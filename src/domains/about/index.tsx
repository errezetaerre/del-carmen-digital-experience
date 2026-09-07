import AboutHero from "./sections/hero/AboutHero";
import AboutEssence from "./sections/essence/AboutEssence";
import AboutEcosystem from "./sections/ecosystem/AboutEcosystem";
import AboutContinue from "./sections/continue/AboutContinue";
import Footer from "@/shared/layout/footer";

export default function About() {
    return (
        <main className="relative w-full min-w-0 overflow-x-clip bg-neutral-950 text-stone-100">
            <AboutHero />
            <AboutEssence />
            <AboutEcosystem />
            <AboutContinue />
            <Footer />
        </main>
    );
}