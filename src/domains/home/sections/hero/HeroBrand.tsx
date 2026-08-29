import { Button } from "@/shared/ui/button";
import { brand } from "@/config/brand";
import { HERO_CTA } from "./constants";

export default function HeroBrand() {
  return (
    <div className="flex h-full flex-col">
      {/* Mobile portrait brand */}
      <h1
        className="
          mt-4
          font-display
          text-5xl
          font-light
          uppercase
          leading-[0.88]
          tracking-[0.04em]
          text-[#F5EFE6]

          md:hidden
        "
      >
        <span className="block">Del</span>
        <span className="block">Carmen</span>
      </h1>

      {/* Tablet / Desktop / Mobile landscape */}
      <h1
        className="
          mt-10
          hidden
          font-display
          font-light
          uppercase
          leading-[0.88]
          tracking-[0.04em]
          text-[#F5EFE6]

          md:block
          md:text-7xl
          lg:text-9xl
          xl:text-[9rem]

          [@media(orientation:landscape)_and_(max-height:600px)]:!mt-6
          [@media(orientation:landscape)_and_(max-height:600px)]:!text-6xl
        "
      >
        {brand.name}
      </h1>

      {/* Mobile portrait tagline */}
      <p
        className="
          mt-7
          font-display
          text-base
          font-normal
          uppercase
          leading-[1.25]
          tracking-[0.08em]
          text-brand-gold
          drop-shadow-[0_2px_2px_rgba(0,0,0,0.85)]

          md:hidden
        "
      >
        Painting the Eternal
        <br />
        Essence Within
      </p>

      {/* Tablet / Desktop / Mobile landscape tagline */}
      <p
        className="
          mt-8
          hidden
          max-w-md
          font-display
          md:text-xl
lg:text-2xl
xl:text-[1.65rem]
          font-normal
          uppercase
          leading-[1.25]
          tracking-[0.08em]
          text-brand-gold

          md:block
          drop-shadow-[0_2px_2px_rgba(0,0,0,0.85)]
          [@media(orientation:landscape)_and_(max-height:600px)]:!mt-5
          [@media(orientation:landscape)_and_(max-height:600px)]:!text-base
        "
      >
        {brand.tagline}
      </p>

      {/* CTA */}
      <div
        className="
          mt-12
          hidden
          w-fit

          md:mt-20
          md:block

          lg:mt-20

          [@media(orientation:landscape)_and_(max-height:600px)]:!mt-5
        "
      >
        <Button
          type="button"
          variant="bronzeUnderline"
          className="
            mt-10

            [@media(orientation:landscape)_and_(max-height:600px)]:!mt-2
          "
        >
          {HERO_CTA}
        </Button>
      </div>

      {/* Scroll — desktop only */}
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
          text-[#F5EFE6]/40

          lg:flex

          [@media(pointer:coarse)]:!hidden
        "
      >
        <span className="h-px w-12 bg-white/30" />
        <span>Scroll</span>
      </div>
    </div>
  );
}