import { newsletterActionGet, newsletterActionPost } from "@/domains/newsletter/server/actionHandlers";

export function GET(request: Request) { return newsletterActionGet(request, "unsubscribe"); }
export function POST(request: Request) { return newsletterActionPost(request, "unsubscribe"); }
