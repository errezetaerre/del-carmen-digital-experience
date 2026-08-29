import Link from "next/link";

import {
  getFeaturedCollection,
} from "@/domains/home/services";

import { Container } from "@/shared/layout";
import { LinkButton } from "@/shared/ui/button";

export default function Collection() {
  const featuredCollection =
    getFeaturedCollection();

  if (!featuredCollection) {
    return null;
  }

  const {
    series,
    coverArtwork,
    artworkCount,
  } = featuredCollection;

  const collectionImage =
    series.images?.featured ??
    coverArtwork.images.thumbnail ??
    coverArtwork.images.primary;

  const yearLabel =
    series.yearStart &&
      series.yearEnd &&
      series.yearStart !== series.yearEnd
      ? `${series.yearStart} — ${series.yearEnd}`
      : series.yearStart
        ? String(series.yearStart)
        : null;

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-surface-deep
        text-white
      "
    >
      {/* =====================================================
            TOP SEPARATOR
          ===================================================== */}

      <div
        aria-hidden
        className="
        pointer-events-none
        absolute
        left-1/2
        top-0
        h-px
        w-[82%]
        max-w-[1100px]
        -translate-x-1/2
        bg-gradient-to-r
        from-transparent
        via-brand-gold/65
        to-transparent
      "
      />

      {/* =====================================================
            BOTTOM SEPARATOR
          ===================================================== */}

      <div
        aria-hidden
        className="
        pointer-events-none
        absolute
        bottom-0
        left-1/2
        h-px
        w-[82%]
        max-w-[1100px]
        -translate-x-1/2
        bg-gradient-to-r
        from-transparent
        via-brand-gold/65
        to-transparent
      "
      />

      <Container
        size="wide"
        className="
          py-24

          md:py-32

          lg:py-20

          [@media(orientation:landscape)_and_(max-height:600px)]:!py-16
        "
      >
        <div
          className="
            grid
            gap-14

            lg:grid-cols-[38%_62%]
            lg:items-center
            lg:gap-12

            [@media(orientation:landscape)_and_(max-height:600px)]:!grid-cols-[34%_66%]
            [@media(orientation:landscape)_and_(max-height:600px)]:!gap-8
          "
        >
          {/* =================================================
              EDITORIAL INTRODUCTION
             ================================================= */}

          <div>
            <div
              className="
                max-w-[320px]

                xl:max-w-[360px]
              "
            >
              <p
                className="
                  mb-5
                  font-sans
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.38em]
                  text-brand-gold
                "
              >
                Featured Collection
              </p>

              <h2
                className="
                  font-display
                  text-4xl
                  font-light
                  leading-[1]
                  tracking-[0.01em]
                  text-white

                  md:text-5xl
                  lg:text-6xl
                "
              >
                {series.title}
              </h2>

              {series.description && (
                <p
                  className="
                    mt-6
                    max-w-[300px]
                    font-sans
                    text-sm
                    font-light
                    leading-[1.8]
                    tracking-[0.01em]
                    text-white/55
                    md:text-base
                  "
                >
                  {series.description}
                </p>
              )}

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  items-center
                  gap-x-3
                  gap-y-2
                  font-sans
                  text-[10px]
                  uppercase
                  tracking-[0.24em]
                  text-white/35
                "
              >
                <span>
                  {artworkCount}{" "}
                  {artworkCount === 1
                    ? "work"
                    : "works"}
                </span>

                {yearLabel && (
                  <>
                    <span className="text-brand-gold/40">
                      ·
                    </span>

                    <span>
                      {yearLabel}
                    </span>
                  </>
                )}

                <span className="text-brand-gold/40">
                  ·
                </span>

                <span>
                  {series.status}
                </span>
              </div>

              <div className="mt-10 w-fit">
                <LinkButton
                  href={`/series/${series.slug}`}
                  variant="bronzeUnderline"
                  className="
                    font-sans
                    text-xs
                    font-medium
                    tracking-[0.28em]
                  "
                >
                  Explore collection →
                </LinkButton>
              </div>
            </div>
          </div>

          {/* =================================================
              FEATURED ARTWORK SERIES VISUAL
             ================================================= */}

          <Link
            href={`/series/${series.slug}`}
            aria-label={`Explore ${series.title} artwork series`}
            className="
              group
              relative
              block
              w-full
              overflow-hidden
              focus-visible:outline-none
            "
          >
            <div
              className="
                relative
                mx-auto
                w-full
                max-w-[760px]
              "
            >
              <div
                className="
                  relative
                  aspect-[4/5]
                  overflow-hidden
                  bg-black
                  shadow-[0_40px_100px_rgba(0,0,0,0.55)]
                "
              >
                {/* Series visual */}

                <img
                  src={collectionImage.src}
                  alt={collectionImage.alt}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-1000
                    ease-out

                    group-hover:scale-[1.025]
                    group-focus:scale-[1.025]
                  "
                />

                {/* Image integration */}

                <div
                  aria-hidden
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/70
                    via-black/5
                    to-transparent
                    transition-opacity
                    duration-700

                    group-hover:from-black/85
                    group-focus:from-black/85
                  "
                />

                {/* ===========================================
                    RESTING STATE
                   =========================================== */}

                <div
                  className="
                  absolute
                  inset-x-0
                  bottom-0
                  p-5
                  transition-all
                  duration-[250ms]
                  ease-out

                  md:p-7

                  group-hover:translate-y-2
                  group-hover:opacity-0

                  group-focus:translate-y-2
                  group-focus:opacity-0
                "
                >
                  <h3
                    className="
                      font-display
                      text-3xl
                      font-light
                      leading-none
                      tracking-[0.01em]
                      text-white

                      md:text-4xl
                    "
                  >
                    {series.title}
                  </h3>
                </div>

                {/* ===========================================
                    REVEALED STATE
                   =========================================== */}

                <div
                  className="
                  absolute
                  inset-x-0
                  bottom-0
                  translate-y-4
                  p-5
                  opacity-0
                  transition-all
                  duration-[300ms]
                  ease-out

                  md:p-7

                  group-hover:translate-y-0
                  group-hover:opacity-100

                  group-focus:translate-y-0
                  group-focus:opacity-100
                "
                >
                  <h3
                    className="
                    translate-y-[18px]
                    font-display
                    text-3xl
                    font-light
                    leading-none
                    tracking-[0.01em]
                    text-white
                    opacity-0
                    transition-all
                    duration-[450ms]
                    ease-out

                    md:text-4xl

                    group-hover:translate-y-0
                    group-hover:opacity-100

                    group-focus:translate-y-0
                    group-focus:opacity-100
                  "
                  >
                    {series.title}
                  </h3>

                  <div
                    className="
                      mt-4
                      translate-y-[10px]      
                      flex
                      flex-wrap
                      items-center
                      gap-x-3
                      gap-y-2
                      font-sans
                      text-[9px]
                      uppercase
                      tracking-[0.24em]
                      text-white/55
                      opacity-0
                      transition-all
                      duration-[350ms]
                      ease-out
                      delay-[80ms]

                      group-hover:translate-y-0
                      group-hover:opacity-100

                      group-focus:translate-y-0
                      group-focus:opacity-100
                    "
                  >
                    <span>
                      {artworkCount}{" "}
                      {artworkCount === 1
                        ? "work"
                        : "works"}
                    </span>

                    {yearLabel && (
                      <>
                        <span className="text-brand-gold/40">
                          ·
                        </span>

                        <span>
                          {yearLabel}
                        </span>
                      </>
                    )}

                    <span className="text-brand-gold/40">
                      ·
                    </span>

                    <span>
                      {series.status}
                    </span>
                  </div>

                  <div
                    className="
                      mt-5
                      translate-y-2
                      flex
                      items-center
                      gap-3
                      font-sans
                      text-[9px]
                      uppercase
                      tracking-[0.26em]
                      text-brand-gold
                      opacity-0
                      transition-all
                      duration-[350ms]
                      ease-out
                      delay-[120ms]

                      group-hover:translate-y-0
                      group-hover:opacity-100

                      group-focus:translate-y-0
                      group-focus:opacity-100
                    "
                  >
                    <span>Explore series</span>
                    <span aria-hidden>→</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}