import Hero from "./sections/hero";
import FeaturedArtwork from "./sections/featuredArtwork";
import Collection from "./sections/collection";
import ArtistStatement from "./sections/artistStatement";
import SelectedWorks from "./sections/selectedWorks";
import JournalPreview from "./sections/journal";
import Invitation from "./sections/invitation";
import Footer from "@/shared/layout/footer";
import HomeExperience from "./experience/HomeExperience";
import type { HomeCatalogue } from "./model/homeCatalogue";

export default function Home({ catalogue }: { catalogue: HomeCatalogue }) {
  return (
    <HomeExperience catalogue={catalogue}><main
      className="
        relative
        w-full
        min-w-0
        overflow-x-clip
      "
    >
      <Hero artwork={catalogue.hero} />
      <FeaturedArtwork artwork={catalogue.featured} />
      <ArtistStatement />
      <Collection featuredCollection={catalogue.collection} />
      <SelectedWorks artworks={catalogue.selected} />
      <JournalPreview />
      <Invitation />
      <Footer />
    </main></HomeExperience>
  );
}
