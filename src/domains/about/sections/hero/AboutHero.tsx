import Image from "next/image";
import { Container } from "@/shared/layout/container";
import AboutHeroMotion from "./AboutHeroMotion";

export default function AboutHero() {
    return (
        <section className="about-hero-scene relative min-h-[calc(100svh-5rem)] overflow-hidden border-b border-white/5 bg-neutral-950">
            {/* Poster / future video */}
            <div className="about-hero-media absolute inset-0 z-0">
                <Image
                    src="/about/film/the_encounter_poster.png"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                />

                {/* Protect copy */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/65 to-black/10" />

                {/* Navigation transition */}
                <div className="absolute inset-x-0 top-0 h-[32%] bg-gradient-to-b from-black/50 to-transparent" />

                {/* Bottom transition */}
                <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-neutral-950/75 to-transparent" />
            </div>

            {/* Atmosphere */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[1]"
            >
                <div className="about-hero-light absolute left-[-20%] top-[10%] h-[65%] w-[45%] rounded-full bg-amber-100/[0.055] blur-[110px]" />
            </div>

            {/* Content */}
            <Container>
                <div className="relative z-20 flex min-h-[calc(100svh-5rem)] items-center py-28 md:py-32">
                    <div className="max-w-4xl">
                        <p className="about-hero-eyebrow mb-7 font-sans text-[11px] uppercase tracking-[0.34em] text-amber-200/80">
                            About
                        </p>

                        <h1 className="font-display text-[clamp(3.4rem,7.5vw,7rem)] font-light leading-[0.9] tracking-[-0.035em] text-stone-100">
                            <span className="about-hero-line block overflow-hidden">
                                <span className="about-hero-line-inner block">
                                    Where art meets
                                </span>
                            </span>

                            <span className="about-hero-line block overflow-hidden">
                                <span className="about-hero-line-inner block italic text-amber-200/90">
                                    experience.
                                </span>
                            </span>
                        </h1>

                        <p className="about-hero-copy mt-9 max-w-xl font-sans text-sm font-light leading-7 text-stone-300 md:text-base md:leading-8">
                            Del Carmen is a contemplative space where painting, memory
                            and technology meet without competing for attention.
                        </p>

                    </div>
                </div>
            </Container>
            {/* Centered film control */}
            <div className="about-hero-film-cta pointer-events-none absolute left-[50%] top-[82%] z-30 -translate-x-1/2 -translate-y-1/2 md:left-[72%] md:top-[50%]">
                <button
                    type="button"
                    aria-label="Play The Encounter film"
                    className="pointer-events-auto group flex h-20 w-20 items-center justify-center rounded-full border border-amber-200/55 bg-black/25 backdrop-blur-sm transition duration-500 hover:scale-105 hover:border-amber-200 hover:bg-black/45 md:h-24 md:w-24"
                >
                    <span className="ml-1 block h-0 w-0 border-b-[8px] border-l-[13px] border-t-[8px] border-b-transparent border-l-stone-100 border-t-transparent transition-colors group-hover:border-l-amber-100" />
                </button>
            </div>

            <AboutHeroMotion />
        </section>
    );
}