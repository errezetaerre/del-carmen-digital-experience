import Hero from "./sections/hero";
import FeaturedArtwork from "./sections/featuredArtwork";
import Collection from "./sections/collection";
import ArtistStatement from "./sections/artistStatement";
import SelectedWorks from "./sections/selectedWorks";
import JournalPreview from "./sections/journal";
import Invitation from "./sections/invitation";
import Footer from "@/shared/layout/footer";
import EnglishContent from "@/i18n/EnglishContent";

export default function Home() {
  return (
    <main
      className="
        relative
        w-full
        min-w-0
        overflow-x-clip
      "
    >
      <Hero />
      <EnglishContent>
      <FeaturedArtwork />
      <ArtistStatement />
      <Collection />
      <SelectedWorks />
      <JournalPreview />
      <Invitation />
      </EnglishContent>
      <Footer />
    </main>
  );
}
