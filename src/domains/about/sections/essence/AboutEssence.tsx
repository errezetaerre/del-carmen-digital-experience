import { useTranslations } from "next-intl";
import { Container } from "@/shared/layout/container";
import AboutEssenceMotion from "./AboutEssenceMotion";

export default function AboutEssence() {
    const t = useTranslations("About");
    const statement =
        t("essence.statement");
    const words = statement.split(" ");

    return (
        <section className="about-essence-scene relative overflow-hidden bg-neutral-950 py-28 md:py-36 lg:py-44">
            <Container>
                <div className="about-essence-motion grid gap-14 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-3">
                        <div className="about-essence-rule mb-6 h-px w-12 bg-brand-gold/55" />

                        <p className="about-essence-eyebrow font-sans text-[10px] uppercase tracking-[0.34em] text-brand-gold/70">
                            {t("essence.eyebrow")}
                        </p>
                    </div>

                    <div className="about-essence-content lg:col-span-8 lg:col-start-5">
                        <h2 className="max-w-4xl font-display text-4xl font-light leading-[1.08] tracking-[-0.025em] text-stone-100 md:text-5xl lg:text-[4rem] lg:leading-[1.04]">
                            {words.map((word, index) => (
                                <span
                                    key={`${word}-${index}`}
                                    className="about-essence-word inline-block"
                                >
                                    {word}
                                    {index < words.length - 1 ? "\u00A0" : ""}
                                </span>
                            ))}
                        </h2>

                        <p className="about-essence-copy mt-10 max-w-2xl font-sans text-sm font-light leading-7 text-stone-500 md:text-base md:leading-8">
                            {t("essence.description")}
                        </p>
                    </div>
                </div>
            </Container>

            <AboutEssenceMotion />
        </section>
    );
}