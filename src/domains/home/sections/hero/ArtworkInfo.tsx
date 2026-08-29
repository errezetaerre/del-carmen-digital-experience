import type { ArtworkProps } from "@/domains/artworks/components/types";

export default function ArtworkInfo({
  artwork,
}: ArtworkProps) {
  const techniqueLabel = `${artwork.medium} on ${artwork.support}`;

  return (
    <div
      className="
    relative
    z-20
    w-full
    rounded-[10px]
    border
    border-brand-gold/55
    bg-black/20
    p-[5px]
    backdrop-blur-[6px]

    md:w-[420px]
    md:min-w-0
    md:bg-black/10
    md:p-[6px]
    md:backdrop-blur-none

    xl:w-[430px]

    [@media(orientation:landscape)_and_(max-height:600px)]:!w-[360px]
    [@media(orientation:landscape)_and_(max-height:600px)]:!min-w-0
    [@media(orientation:landscape)_and_(max-height:600px)]:!max-w-none
  "
    >
      <div
        className="
          rounded-[6px]
          bg-black/55
          px-5
          py-4
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]

          md:px-6
          md:py-5
          md:backdrop-blur-[4px]

          xl:px-9
          xl:py-7

          [@media(orientation:landscape)_and_(max-height:600px)]:!px-5
          [@media(orientation:landscape)_and_(max-height:600px)]:!py-4
        "
      >
        {/* ===================================================
            MOBILE PORTRAIT
           =================================================== */}

        <div
          className="
            md:hidden

            [@media(orientation:landscape)_and_(max-height:600px)]:!hidden
          "
        >
          <h2
            className="
              whitespace-nowrap
              font-display
              text-2xl
              font-light
              tracking-[0.01em]
              text-brand-gold
            "
          >
            {artwork.title}
          </h2>

          {artwork.quote && (
            <p
              className="
                mt-1
                font-display
                text-sm
                font-light
                italic
                leading-relaxed
                text-white/75
              "
            >
              &quot;{artwork.quote}&quot;
            </p>
          )}

          <div className="mt-3 h-px w-full bg-gradient-to-r from-brand-gold to-transparent" />

          <div
            className="
              mt-4
              flex
              flex-wrap
              items-center
              gap-x-3
              gap-y-1
              font-sans
              text-[0.5em]
              text-white/65
            "
          >
            <span>{techniqueLabel}</span>

            <span className="text-brand-gold/40">
              ·
            </span>

            <span>{artwork.year}</span>

            <span className="text-brand-gold/40">
              ·
            </span>

            <span>
              {artwork.dimensions.width} ×{" "}
              {artwork.dimensions.height}{" "}
              {artwork.dimensions.unit}
            </span>
          </div>
        </div>

        {/* ===================================================
            MOBILE LANDSCAPE
           =================================================== */}

        <div
          className="
            hidden

            [@media(orientation:landscape)_and_(max-height:600px)]:!block
          "
        >
          {/* Title + tagline */}
          <div
            className="
              flex
              items-start
              gap-4
            "
          >
            <h2
              className="
                shrink-0
                whitespace-nowrap
                font-display
                text-xl
                font-light
                tracking-[0.01em]
                text-brand-gold
              "
            >
              {artwork.title}
            </h2>

            {artwork.quote && (
              <>
                <span
                  aria-hidden
                  className="
                    h-8
                    w-px
                    shrink-0
                    bg-brand-gold/35
                  "
                />

                <p
                  className="
                    font-display
                    text-sm
                    font-light
                    italic
                    leading-relaxed
                    text-white/70
                  "
                >
                  &quot;{artwork.quote}&quot;
                </p>
              </>
            )}
          </div>

          {/* Divider */}
          <div
            className="
              mt-3
              h-px
              w-full
              bg-gradient-to-r
              from-brand-gold
              via-brand-gold/50
              to-transparent
            "
          />

          {/* Metadata */}
          <div
            className="
              mt-3
              flex
              items-center
              gap-3
              whitespace-nowrap
              font-sans
              text-[10px]
              text-white/65
            "
          >
            <span>{techniqueLabel}</span>

            <span className="text-brand-gold/40">
              ·
            </span>

            <span>{artwork.year}</span>

            <span className="text-brand-gold/40">
              ·
            </span>

            <span>
              {artwork.dimensions.width} ×{" "}
              {artwork.dimensions.height}{" "}
              {artwork.dimensions.unit}
            </span>
          </div>
        </div>

        {/* ===================================================
            TABLET
           =================================================== */}

        <div
          className="
            hidden
            md:block
            xl:hidden

            [@media(orientation:landscape)_and_(max-height:600px)]:!hidden
          "
        >
          {/* Title + tagline */}
          <div
            className="
              flex
              items-start
              gap-3
            "
          >
            <h2
              className="
                shrink-0
                whitespace-nowrap
                font-display
                text-2xl
                font-light
                tracking-[0.01em]
                text-brand-gold
              "
            >
              {artwork.title}
            </h2>

            {artwork.quote && (
              <>
                <span
                  aria-hidden
                  className="
                    h-10
                    w-px
                    shrink-0
                    bg-brand-gold/35
                  "
                />

                <p
                  className="
                    max-w-[220px]
                    font-display
                    text-base
                    font-light
                    italic
                    leading-relaxed
                    text-white/75
                    whitespace-nowrap
                  "
                >
                  &quot;{artwork.quote}&quot;
                </p>
              </>
            )}
          </div>

          {/* Divider */}
          <div
            className="
              mt-4
              h-px
              w-full
              bg-gradient-to-r
              from-brand-gold
              via-brand-gold/50
              to-transparent
            "
          />

          {/* Metadata */}
          <div
            className="
              mt-4
              flex
              items-center
              gap-4
              whitespace-nowrap
              font-sans
              text-xs
              text-white/65
            "
          >
            <span>{techniqueLabel}</span>

            <span className="text-brand-gold/40">
              ·
            </span>

            <span>{artwork.year}</span>

            <span className="text-brand-gold/40">
              ·
            </span>

            <span>
              {artwork.dimensions.width} ×{" "}
              {artwork.dimensions.height}{" "}
              {artwork.dimensions.unit}
            </span>
          </div>
        </div>

        {/* ===================================================
            DESKTOP
           =================================================== */}

        <div
          className="
            hidden
            xl:block

            [@media(orientation:landscape)_and_(max-height:600px)]:!hidden
          "
        >
          <h2
            className="
              font-display
              text-5xl
              font-light
              tracking-[0.01em]
              text-brand-gold
            "
          >
            {artwork.title}
          </h2>

          {artwork.quote && (
            <p
              className="
                mt-3
                max-w-sm
                font-display
                text-2xl
                font-light
                italic
                leading-relaxed
                text-white/75
              "
            >
              &quot;{artwork.quote}&quot;
            </p>
          )}

          <div className="mt-4 h-px w-90 bg-gradient-to-r from-brand-gold to-transparent" />

          <div className="
              mt-4
              
              font-sans
              
              flex
              flex-wrap
              items-center
              gap-x-8
              gap-y-1
              
              text-[0.5em]
              text-white/75
          ">
            <p className="text-base">
              {techniqueLabel}
            </p>

            <p className="text-base">
              {artwork.year}
            </p>

            <p className="text-base">
              {artwork.dimensions.width} ×{" "}
              {artwork.dimensions.height}{" "}
              {artwork.dimensions.unit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}