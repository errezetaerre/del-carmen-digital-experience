import type { ReactNode } from "react";

// A temporary language boundary for editorial/form/legal copy that is not yet
// part of the Spanish pilot. It has no layout box and is removed per section
// when its translation has been reviewed.
export default function EnglishContent({ children }: { children: ReactNode }) {
    return <div lang="en" className="contents">{children}</div>;
}
