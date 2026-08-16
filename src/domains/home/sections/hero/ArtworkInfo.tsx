import type { ArtworkProps } from "@/domains/artworks/components/types";

export default function ArtworkInfo({
  artwork,
}: ArtworkProps) {
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

        md:w-[min(22vw,360px)]
        md:min-w-[260px]
        md:bg-black/10
        md:p-[6px]
        md:backdrop-blur-none
      "
    >
      <div
        className="
          rounded-[6px]
          bg-black/55
          px-5
          py-4
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]

          md:px-8
          md:py-7
          md:backdrop-blur-[4px]
        "
      >
        {/* Mobile compact layout */}
        <div className="md:hidden">
          <h2
            className="
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
            <p
              className="
                mt-2
                whitespace-nowrap
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

          <div
            className="
              mt-4
              h-px
              w-full
              bg-gradient-to-r
              from-brand-gold
              to-transparent
            "
          />

          <div
            className="
              mt-4
              flex
              flex-wrap
              items-center
              gap-x-3
              gap-y-1
              font-sans
              text-[11px]
              text-white/65
            "
          >
            <span>{artwork.technique}</span>

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

        {/* Tablet / Desktop layout */}
        <div className="hidden md:block">
          <h2 className="font-display text-2xl font-light tracking-[0.01em] text-brand-gold">
            {artwork.title}
          </h2>

          {artwork.quote && (
            <p className="mt-3 max-w-sm font-display text-base font-light italic leading-relaxed text-white/75 md:text-lg">
              &quot;{artwork.quote}&quot;
            </p>
          )}

          <div className="mt-6 h-px w-32 bg-gradient-to-r from-brand-gold to-transparent" />

          <div className="mt-6 space-y-3 font-sans">
            <p className="text-sm text-white/80">
              {artwork.technique}
            </p>

            <p className="text-sm text-white/65">
              {artwork.year}
            </p>

            <p className="text-sm text-white/55">
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