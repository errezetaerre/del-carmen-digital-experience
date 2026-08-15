import { Button } from "@/shared/ui/button";
import { brand } from "@/config/brand";
import {
  HERO_QUOTE,
  HERO_CTA,
} from "./constants";

export default function HeroBrand() {
  return (
    <div className="flex h-full min-h-full flex-col">
      {/* Brand */}
      <h1
        className="
          mt-10
          font-display
          text-6xl
          font-light
          uppercase
          leading-[0.88]
          tracking-[0.04em]
          text-white
          md:text-7xl
          lg:text-8xl
        "
      >
        {brand.name}
      </h1>

      {/* Tagline */}
      <p
        className="
          mt-8
          max-w-md
          font-display
          text-lg
          font-normal
          leading-[1.25]
          tracking-[0.08em]
          text-brand-gold
          md:text-xl
        "
      >
        {brand.tagline}
      </p>

      {/* CTA */}
      <div className="mt-12 w-fit md:mt-20 lg:mt-20">
        <Button
          type="button"
          variant="bronzeUnderline"
          className="mt-10"
        >
          {HERO_CTA}
        </Button>
      </div>

      {/* Scroll indicator */}
      <div
        className="
          mt-20
          flex
          items-center
          gap-4
          font-sans
          text-xs
          uppercase
          tracking-[0.25em]
          text-white/40
          md:mt-12
          lg:mt-20
        "
      >
        <span className="h-px w-12 bg-white/30" />
        <span>Scroll</span>
      </div>
    </div>
  );
}