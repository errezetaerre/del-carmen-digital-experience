import { Container } from "@/shared/layout/container";
import AboutEcosystemMotion from "./AboutEcosystemMotion";

export default function AboutEcosystem() {
    return (
        <section className="about-ecosystem-scene relative overflow-hidden bg-neutral-950 py-24 md:py-28 lg:py-32">
            <Container>
                <div className="about-ecosystem-motion grid gap-16 lg:grid-cols-12 lg:gap-8">
                    {/* Editorial introduction */}
                    <div className="lg:col-span-4">
                        <p className="about-ecosystem-eyebrow font-sans text-[10px] uppercase tracking-[0.34em] text-amber-200/70">
                            The Ecosystem
                        </p>

                        <h2 className="about-ecosystem-heading mt-5 font-display text-4xl font-light tracking-[-0.025em] text-stone-100 md:text-5xl lg:text-[3.5rem] lg:leading-[1.02]">
                            One philosophy.
                            <span className="block text-stone-500">
                                Distinct expressions.
                            </span>
                        </h2>
                    </div>

                    {/* Brand architecture */}
                    <div className="about-ecosystem-architecture lg:col-span-7 lg:col-start-6">
                        {/* Parent */}
                        <div className="about-ecosystem-parent text-center">
                            <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-stone-600">
                                Parent Creative Identity
                            </p>

                            <h3 className="mt-4 font-display text-4xl font-light text-stone-200 md:text-5xl">
                                Rō Visual
                            </h3>
                        </div>

                        {/* Connection system */}
                        <div
                            aria-hidden="true"
                            className="relative mx-auto mt-9 h-16 w-full max-w-[34rem] md:mt-11 md:h-20"
                        >
                            <div className="about-ecosystem-line-parent absolute left-1/2 top-0 h-1/2 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-amber-200/55 to-amber-200/20" />

                            <div className="about-ecosystem-line-horizontal absolute left-1/4 right-1/4 top-1/2 h-px origin-center bg-white/[0.12]" />

                            <div className="about-ecosystem-line-left absolute left-1/4 top-1/2 h-1/2 w-px origin-top bg-white/[0.12]" />

                            <div className="about-ecosystem-line-right absolute right-1/4 top-1/2 h-1/2 w-px origin-top bg-white/[0.12]" />
                        </div>

                        {/* Expressions */}
                        <div className="grid md:grid-cols-2">
                            <article className="about-ecosystem-child border-y border-white/[0.08] px-4 py-9 text-center md:border-r md:px-8 md:py-10">
                                <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-amber-200/65">
                                    Fine Art
                                </p>

                                <h3 className="mt-3 font-display text-3xl font-light text-stone-100">
                                    Del Carmen
                                </h3>

                                <p className="mx-auto mt-4 max-w-xs font-sans text-sm font-light leading-6 text-stone-500">
                                    Painting, artistic practice and contemplative experiences
                                    centered on the artwork.
                                </p>
                            </article>

                            <article className="about-ecosystem-child border-b border-white/[0.08] px-4 py-9 text-center md:border-y md:px-8 md:py-10">
                                <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-amber-200/65">
                                    Digital Innovation
                                </p>

                                <h3 className="mt-3 font-display text-3xl font-light text-stone-100">
                                    Rō Visual Lab
                                </h3>

                                <p className="mx-auto mt-4 max-w-xs font-sans text-sm font-light leading-6 text-stone-500">
                                    Technology and experimentation extending how creative work
                                    can be experienced.
                                </p>
                            </article>
                        </div>
                    </div>
                </div>
            </Container>

            <AboutEcosystemMotion />
        </section>
    );
}