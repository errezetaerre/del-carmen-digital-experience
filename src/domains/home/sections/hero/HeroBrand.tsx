import { Button } from "@/shared/ui/button";
import { brand } from "@/config/brand";
import { HERO_CTA } from "./constants";

export default function HeroBrand() {
  return (
    <div className="flex h-full min-h-full flex-col">
      {/* Brand — Mobile */}
      <h1
        className="
          mt-4
          font-display
          text-6xl
          font-light
          uppercase
          leading-[0.88]
          tracking-[0.04em]
          text-white

          md:hidden
        "
      >
        <span className="block">Del</span>
        <span className="block">Carmen</span>
      </h1>

      {/* Brand — Tablet / Desktop */}
      <h1
        className="
          mt-10
          hidden
          font-display
          font-light
          uppercase
          leading-[0.88]
          tracking-[0.04em]
          text-white

          md:block
          md:text-7xl

          lg:text-8xl
        "
      >
        {brand.name}
      </h1>

      {/* Tagline — Mobile */}
      <p
        className="
          mt-7
          font-display
          text-lg
          font-normal
          leading-[1.25]
          tracking-[0.08em]
          text-brand-gold

          md:hidden
        "
      >
        Painting the Eternal
        <br />
        Essence Within
      </p>

      {/* Tagline — Tablet / Desktop */}
      <p
        className="
          mt-8
          hidden
          max-w-md
          font-display
          text-xl
          font-normal
          leading-[1.25]
          tracking-[0.08em]
          text-brand-gold

          md:block
        "
      >
        {brand.tagline}
      </p>

      {/* Tablet / Desktop CTA */}
      <div
        className="
          mt-12
          hidden
          w-fit

          md:mt-20
          md:block

          lg:mt-20

          [@media(orientation:landscape)_and_(max-height:600px)]:!block
        "
      >
        <Button
          type="button"
          variant="bronzeUnderline"
          className="mt-10"
        >
          {HERO_CTA}
        </Button>
      </div>

      {/* Scroll — Tablet / Desktop */}
      <div
        className="
          mt-20
          hidden
          items-center
          gap-4
          font-sans
          text-xs
          uppercase
          tracking-[0.25em]
          text-white/40

          md:mt-12
          md:flex

          lg:mt-20

          [@media(orientation:landscape)_and_(max-height:600px)]:!flex
        "
      >
        <span className="h-px w-12 bg-white/30" />
        <span>Scroll</span>
      </div>
    </div>
  );
}