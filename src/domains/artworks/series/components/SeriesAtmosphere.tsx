interface SeriesAtmosphereProps {
    src: string;
}

export default function SeriesAtmosphere({
    src,
}: SeriesAtmosphereProps) {
    return (
        <div
            aria-hidden="true"
            className="
                pointer-events-none
                absolute
                inset-0
                overflow-hidden
            "
        >
            {/* Editorial atmosphere */}
            <img
                src={src}
                alt=""
                className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    object-center
                "
            />

            {/* 
                Very subtle overall treatment.
                The generated artwork already contains its own
                typographic quiet zone, so we should not destroy it
                with a heavy global overlay.
            */}
            <div
                className="
                    absolute
                    inset-0
                    bg-black/25
                "
            />

            {/*
                Lower transition.

                The atmosphere remains visible through the title
                and artwork area, then gradually dissolves into the
                canonical page background.
            */}
            <div
                className="
                    absolute
                    inset-x-0
                    bottom-0
                    h-[62%]
                    bg-gradient-to-b
                    from-transparent
                    via-background/95
                    to-background
                "
            />

            {/*
                Soft lateral containment.

                This prevents the outer edges from becoming visually
                disconnected from the dark Del Carmen environment,
                without creating an artificial central safe zone.
            */}
            <div
                className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-background/25
                    via-transparent
                    to-background/25
                "
            />
        </div>
    );
}