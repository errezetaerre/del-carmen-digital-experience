import { createPageMetadata } from "@/shared/lib/metadata";

export const metadata = createPageMetadata();

import Home from "@/domains/home";

export default function Page() {
  return <Home />;
}