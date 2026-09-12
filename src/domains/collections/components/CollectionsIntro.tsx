import { Container } from "@/shared/layout";

export default function CollectionsIntro() {
    return (
        <section
            aria-labelledby="collections-intro-title"
            className="
                flex
                min-h-[30svh]
                items-center
                bg-background
                py-14

                md:min-h-[36svh]
                md:py-20
            "
        >
            <Container size="wide">
                <div className="max-w-4xl">
                    <p
                        className="
                            mb-5
                            font-sans
                            text-[10px]
                            uppercase
                            tracking-[0.38em]
                            text-brand-gold
                        "
                    >
                        Collections
                    </p>

                    <h1
                        id="collections-intro-title"
                        className="
                            font-display
                            text-4xl
                            font-light
                            leading-[0.98]
                            tracking-[0.01em]
                            text-white

                            md:text-6xl
                            lg:text-7xl
                        "
                    >
                        Bodies of work shaped by
                        time, memory, and
                        contemplation.
                    </h1>

                    <p
                        className="
                            mt-8
                            font-sans
                            text-[10px]
                            uppercase
                            tracking-[0.22em]
                            text-white/30
                        "
                    >
                        Scroll to explore ↓
                    </p>
                </div>
            </Container>
        </section>
    );
}