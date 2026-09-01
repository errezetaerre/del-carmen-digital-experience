import ArtistHero from "./sections/hero/ArtistHero";
import TheArtist from "./sections/theArtist/TheArtist";
import ArtistPhilosophy from "./sections/philosophy/ArtistPhilosophy";
import ThePractice from "./sections/practice/ThePractice";
import TheJourney from "./sections/journey/TheJourney";
import TheWork from "./sections/work";
import Footer from "@/shared/layout/footer";

export default function Artist() {
    return (
        <main className="relative w-full min-w-0 overflow-x-clip">
            <ArtistHero />
            <TheArtist />
            <ArtistPhilosophy />
            <ThePractice />
            <TheJourney />
            <TheWork />
            <Footer />
        </main>
    );
}