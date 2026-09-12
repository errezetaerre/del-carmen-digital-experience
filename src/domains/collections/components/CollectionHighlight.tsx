interface CollectionHighlightProps {
    label?: string;
}

export default function CollectionHighlight({
    label,
}: CollectionHighlightProps) {
    if (!label) {
        return null;
    }

    return (
        <div
            className="
                absolute
                right-[var(--page-gutter)]
                top-8
                z-30

                md:top-10
            "
        >
            <span
                className="
                    border
                    border-white/15
                    bg-black/20
                    px-4
                    py-2
                    font-sans
                    text-[9px]
                    uppercase
                    tracking-[0.24em]
                    text-white/65
                    backdrop-blur-sm
                "
            >
                {label}
            </span>
        </div>
    );
}