import { Container } from "@/shared/layout/container";

export default function AboutFilm() {
    return (
        <section className="relative bg-neutral-950 py-20 md:py-28 lg:py-36">
            <Container>
                <div className="mb-8 flex items-end justify-between gap-8">
                    <div>
                        <p className="font-sans text-[10px] uppercase tracking-[0.34em] text-brand-gold/70">
                            The Encounter
                        </p>

                        <h2 className="mt-3 font-display text-3xl font-light text-stone-100 md:text-4xl">
                            A sixty-second journey.
                        </h2>
                    </div>

                    <p className="hidden font-sans text-xs uppercase tracking-[0.22em] text-stone-600 md:block">
                        Film · 01:00
                    </p>
                </div>

                <div className="relative aspect-video w-full overflow-hidden border border-white/[0.08] bg-neutral-900">
                    {/* Temporary film poster */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_38%,rgba(184,139,72,0.13),transparent_38%),linear-gradient(to_bottom,rgba(255,255,255,0.025),transparent_35%)]" />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

                        <div className="absolute left-1/2 top-1/2 h-[34vw] max-h-[460px] w-[34vw] max-w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-200/[0.09] shadow-[0_0_120px_rgba(184,139,72,0.07)]" />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <button
                            type="button"
                            aria-label="Film coming soon"
                            className="group flex h-20 w-20 items-center justify-center rounded-full border border-stone-300/30 bg-black/20 backdrop-blur-sm transition duration-500 hover:border-amber-200/70 hover:bg-black/40 md:h-24 md:w-24"
                        >
                            <span className="ml-1 block h-0 w-0 border-b-[8px] border-l-[13px] border-t-[8px] border-b-transparent border-l-stone-200 border-t-transparent transition-colors group-hover:border-l-amber-200" />
                        </button>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between md:bottom-8 md:left-8 md:right-8">
                        <div>
                            <p className="font-display text-xl text-stone-100 md:text-2xl">
                                The Encounter
                            </p>

                            <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.24em] text-stone-500">
                                Film in production
                            </p>
                        </div>

                        <span className="font-sans text-xs tabular-nums text-stone-500">
                            00:00 / 01:00
                        </span>
                    </div>
                </div>

                {/* <div className="mt-5 flex justify-between border-t border-white/[0.07] pt-4 font-sans text-[9px] uppercase tracking-[0.24em] text-stone-600 md:text-[10px]">
                    <span>Matter</span>
                    <span>Creation</span>
                    <span>The Encounter</span>
                    <span>Human</span>
                </div> */}
            </Container>
        </section>
    );
}