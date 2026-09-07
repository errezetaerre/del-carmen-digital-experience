import Link from "next/link";
import { Container } from "@/shared/layout/container";
import AboutContinueMotion from "./AboutContinueMotion";

export default function AboutContinue() {
    return (
        <section className="about-continue-scene relative overflow-hidden bg-neutral-950 py-28 md:py-36 lg:py-40">
            <Container>
                <div className="about-continue-motion">
                    <div className="max-w-3xl">
                        <p className="about-continue-eyebrow font-sans text-[10px] uppercase tracking-[0.34em] text-amber-200/70">
                            Continue
                        </p>

                        <h2 className="about-continue-heading mt-5 font-display text-5xl font-light leading-[0.95] tracking-[-0.03em] text-stone-100 md:text-6xl lg:text-7xl">
                            The encounter
                            <span className="block italic text-stone-500">continues.</span>
                        </h2>
                    </div>

                    <div className="about-continue-pathways mt-16 grid border-t border-white/[0.08] md:mt-20 md:grid-cols-2">
                        <Link
                            href="/artist"
                            className="about-continue-path group relative border-b border-white/[0.08] py-10 md:border-r md:py-12"
                        >
                            <div className="about-continue-line absolute left-0 top-0 h-px w-full origin-left bg-amber-200/60" />

                            <div className="md:pr-10">
                                <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-amber-200/65">
                                    01
                                </p>

                                <h3 className="about-continue-title mt-4 font-display text-3xl font-light text-stone-100 transition-colors duration-500 group-hover:text-amber-100 md:text-4xl">
                                    Discover the Artist
                                </h3>

                                <p className="about-continue-copy mt-4 max-w-sm font-sans text-sm font-light leading-6 text-stone-500">
                                    The life and practice behind the work.
                                </p>

                                <span className="about-continue-arrow mt-7 inline-block font-sans text-lg text-stone-500 transition duration-500 group-hover:translate-x-2 group-hover:text-amber-200">
                                    →
                                </span>
                            </div>
                        </Link>

                        <Link
                            href="/artworks"
                            className="about-continue-path group relative border-b border-white/[0.08] py-10 md:pl-10 md:py-12"
                        >
                            <div className="about-continue-line absolute left-0 top-0 h-px w-full origin-left bg-amber-200/60" />

                            <div>
                                <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-amber-200/65">
                                    02
                                </p>

                                <h3 className="about-continue-title mt-4 font-display text-3xl font-light text-stone-100 transition-colors duration-500 group-hover:text-amber-100 md:text-4xl">
                                    Explore the Artworks
                                </h3>

                                <p className="about-continue-copy mt-4 max-w-sm font-sans text-sm font-light leading-6 text-stone-500">
                                    Paintings, collections and their stories.
                                </p>

                                <span className="about-continue-arrow mt-7 inline-block font-sans text-lg text-stone-500 transition duration-500 group-hover:translate-x-2 group-hover:text-amber-200">
                                    →
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </Container>

            <AboutContinueMotion />
        </section>
    );
}