import Hero from "./sections/hero";
import FeaturedArtwork from "./sections/featuredArtwork";
import Collection from "./sections/collection";
import ArtistStatement from "./sections/artistStatement";
import JournalPreview from "./sections/journal";
import Invitation from "./sections/invitation";
import Footer from "./sections/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedArtwork />
      <ArtistStatement/>
      <Collection />
      <JournalPreview />
      <Invitation />
      <Footer />
    </>
  );
}