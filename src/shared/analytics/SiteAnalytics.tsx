"use client";

import { useMemo } from "react";
import { Analytics } from "@vercel/analytics/next";
import { createAnalyticsFilter } from "./analyticsPrivacy.mjs";

export default function SiteAnalytics() {
    const beforeSend = useMemo(() => createAnalyticsFilter(), []);
    return <Analytics beforeSend={beforeSend} debug={false} />;
}
