import { createPageMetadata } from "@/shared/lib/metadata";

export const metadata = createPageMetadata({title: "Contact", description: "Contact Del Carmen about artworks, exhibitions, collaborations and other enquiries.", });

import Contact from "@/domains/contact";

export default function ContactPage() {
    return <Contact />;
}