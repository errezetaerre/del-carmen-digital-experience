import { Container } from "@/shared/layout";
import { useTranslations } from "next-intl";

export default function CollectionsIntro() {
    const t = useTranslations("Collections");
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
                md:py-30
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
                        {t("eyebrow")}
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
                        {t("heading")}
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
                        {t("scroll")}
                    </p>
                </div>
            </Container>
        </section>
    );
}
