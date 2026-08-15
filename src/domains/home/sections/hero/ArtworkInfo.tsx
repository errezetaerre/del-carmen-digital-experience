import type { ArtworkProps } from "@/domains/artworks/components/types";

export default function ArtworkInfo({ artwork }: ArtworkProps) {
  return (
    <div
        className="
          relative
          z-20
          mt-8
          w-full
          rounded-[10px]
          border
          border-brand-gold/70
          bg-black/10
          p-[6px]

          md:absolute
          md:bottom-[12%]
          md:right-[4%]
          md:mt-0
          md:w-[min(22vw,360px)]
          md:min-w-[260px]
        "
      >
            <div
        className="
          rounded-[6px]
          bg-black/45
          px-8
          py-7
          backdrop-blur-[4px]
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        "
      >
        <h2 className="font-serif text-2xl font-light tracking-wide text-brand-gold">
          {artwork.title}
        </h2>

        {artwork.quote && (
          <p className="mt-3 max-w-sm font-serif text-base font-light italic leading-relaxed text-white/75 md:text-lg">
            "{artwork.quote}"
          </p>
        )}

        <div className="mt-6 h-px w-32 bg-gradient-to-r from-brand-gold to-transparent" />


        <div className="mt-6 space-y-3">
          <p className="text-sm text-white/80">
            {artwork.technique}
          </p>

          <p className="text-sm text-white/65">
            {artwork.year}
          </p>

          <p className="text-sm text-white/55">
            {artwork.dimensions.width} × {artwork.dimensions.height}{" "}
            {artwork.dimensions.unit}
          </p>
        </div>
      </div>
    </div>
  );
}