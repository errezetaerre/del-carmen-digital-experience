import type { Redis } from "@upstash/redis";

import { formPrivacy } from "@/config/formPrivacy";

export const PENDING_TTL_SECONDS = 24 * 60 * 60;
export const UNSUBSCRIBED_TTL_SECONDS = 30 * 24 * 60 * 60;

const ACTIVE_SUBSCRIBERS_KEY = "newsletter:subscribers";

const subscriberKey = (email: string) => `newsletter:subscriber:${email}`;
const confirmationKey = (hash: string) => `newsletter:confirmation:${hash}`;
const unsubscribeKey = (hash: string) => `newsletter:unsubscribe:${hash}`;

// Validate stored data and the Set before any writes: Lua errors do not roll back writes.
const PRELUDE = `
local function subscriber_at(key, email)
    local raw = redis.call('GET', key)
    if not raw then return nil end
    local subscriber = cjson.decode(raw)
    if type(subscriber) ~= 'table' or subscriber.email ~= email then
        error('Invalid newsletter subscriber record')
    end
    return subscriber
end

local function check_active_set(key)
    local kind = redis.call('TYPE', key)
    if type(kind) == 'table' then kind = kind.ok end
    if kind ~= 'none' and kind ~= 'set' then
        error('Invalid newsletter audience key type')
    end
end
`;

const REQUEST_PENDING = PRELUDE + `
local subscriber = subscriber_at(KEYS[1], ARGV[1])
if subscriber then
    if subscriber.status == 'active' then return 0 end
    if subscriber.status ~= 'pending' and subscriber.status ~= 'unsubscribed' then
        error('Invalid newsletter subscriber status')
    end
end
check_active_set(KEYS[3])
redis.call('SET', KEYS[1], ARGV[2], 'EX', ARGV[3])
redis.call('SET', KEYS[2], ARGV[1], 'EX', ARGV[3])
redis.call('SREM', KEYS[3], ARGV[1])
return 1
`;

const CONFIRM = PRELUDE + `
if redis.call('GET', KEYS[2]) ~= ARGV[1] then return 0 end
local subscriber = subscriber_at(KEYS[1], ARGV[1])
if not subscriber or subscriber.status ~= 'pending'
    or subscriber.confirmationTokenHash ~= ARGV[2] then return 0 end
check_active_set(KEYS[4])
subscriber.status = 'active'
subscriber.confirmedAt = ARGV[4]
subscriber.unsubscribedAt = cjson.null
subscriber.confirmationTokenHash = nil
subscriber.unsubscribeTokenHash = ARGV[3]
local active = cjson.encode(subscriber)
-- SET without EX removes the pending TTL; the unsubscribe lookup must also persist.
redis.call('SET', KEYS[1], active)
redis.call('SET', KEYS[3], ARGV[1])
redis.call('SADD', KEYS[4], ARGV[1])
redis.call('DEL', KEYS[2])
return 1
`;

const UNSUBSCRIBE = PRELUDE + `
if redis.call('GET', KEYS[2]) ~= ARGV[1] then return 0 end
local subscriber = subscriber_at(KEYS[1], ARGV[1])
if not subscriber or subscriber.status ~= 'active'
    or subscriber.unsubscribeTokenHash ~= ARGV[2] then return 0 end
check_active_set(KEYS[3])
-- Only the email, withdrawal time and status are needed for short incident follow-up.
local record = cjson.encode({
    email = ARGV[1],
    status = 'unsubscribed',
    unsubscribedAt = ARGV[3]
})
redis.call('SET', KEYS[1], record, 'EX', ARGV[4])
redis.call('SREM', KEYS[3], ARGV[1])
redis.call('DEL', KEYS[2])
return 1
`;

const CLEAN_FAILED_REQUEST = PRELUDE + `
local subscriber = subscriber_at(KEYS[1], ARGV[1])
local lookup = redis.call('GET', KEYS[2])
local removed = 0
if subscriber and subscriber.status == 'pending'
    and subscriber.confirmationTokenHash == ARGV[2] then
    removed = redis.call('DEL', KEYS[1])
end
if lookup == ARGV[1] then
    redis.call('DEL', KEYS[2])
end
return removed
`;

export async function requestPendingSubscription(
    redis: Redis,
    email: string,
    source: string,
    tokenHash: string,
    requestedAt: string,
): Promise<"pending" | "active"> {
    const subscriber = {
        email,
        source,
        requestedAt,
        confirmedAt: null,
        unsubscribedAt: null,
        status: "pending",
        confirmationTokenHash: tokenHash,
        consent: {
            noticeVersion: formPrivacy.version,
            purpose: formPrivacy.newsletter.purpose,
            statement: formPrivacy.newsletter.consentLabel,
            acceptedAt: requestedAt,
        },
    };

    const result = await redis.eval(
        REQUEST_PENDING,
        [subscriberKey(email), confirmationKey(tokenHash), ACTIVE_SUBSCRIBERS_KEY],
        [email, JSON.stringify(subscriber), PENDING_TTL_SECONDS],
    );

    if (result !== 0 && result !== 1) {
        throw new Error("Unexpected newsletter request result");
    }

    // A superseded lookup expires within its original 24h; the hash check makes it unusable now.
    return result === 1 ? "pending" : "active";
}

export async function confirmSubscription(
    redis: Redis,
    tokenHash: string,
    unsubscribeTokenHash: string,
    confirmedAt: string,
): Promise<boolean> {
    const lookup = confirmationKey(tokenHash);
    const email = await redis.get<string>(lookup);

    if (typeof email !== "string" || !email) return false;

    const result = await redis.eval(
        CONFIRM,
        [subscriberKey(email), lookup, unsubscribeKey(unsubscribeTokenHash), ACTIVE_SUBSCRIBERS_KEY],
        [email, tokenHash, unsubscribeTokenHash, confirmedAt],
    );

    return result === 1;
}

export async function unsubscribeSubscription(
    redis: Redis,
    tokenHash: string,
    unsubscribedAt: string,
): Promise<boolean> {
    const lookup = unsubscribeKey(tokenHash);
    const email = await redis.get<string>(lookup);

    if (typeof email !== "string" || !email) return false;

    const result = await redis.eval(
        UNSUBSCRIBE,
        [subscriberKey(email), lookup, ACTIVE_SUBSCRIBERS_KEY],
        [email, tokenHash, unsubscribedAt, UNSUBSCRIBED_TTL_SECONDS],
    );

    return result === 1;
}

export async function cleanFailedSubscriptionRequest(
    redis: Redis,
    email: string,
    tokenHash: string,
): Promise<void> {
    await redis.eval(
        CLEAN_FAILED_REQUEST,
        [subscriberKey(email), confirmationKey(tokenHash)],
        [email, tokenHash],
    );
}
