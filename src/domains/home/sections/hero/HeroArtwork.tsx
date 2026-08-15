import { ArtworkImage } from "@/shared/ui/artwork";
import { getFeaturedArtwork } from "@/domains/home/services";
import ArtworkInfo from "./ArtworkInfo";

export default function HeroArtwork() {
  const artwork = getFeaturedArtwork();

  if (!artwork) {
    return null;
  }

  return (
    <div className="relative w-full ">
      {/* Artwork canvas */}
      <div
        // className="
        //   relative
        //   // right-[-9vw]
        //   right-0
        //   top-0
        //   aspect-[16/9]
        //   w-[min(166vw,1060px)]
        //   md:right-[-3vw]
        //   lg:right-[-8vw]
        // "
        className="
          relative
          right-0
          top-0
          aspect-[16/9]
          w-full
          md:min-h-screen
          md:w-[min(166vw,1060px)]
          md:right-[40vw]
          lg:right-[10vw]
        "
      >
        <ArtworkImage
          src={artwork.image.src}
          alt={artwork.image.alt}
          fill
          sizes="(min-width: 1920px) 66vw, (min-width: 768px) 60vw, 100vw"
          className="
            origin-top-right
            object-contain
            scale-120
            object-right-top
            md:scale-[1.08]
            lg:scale-[1.28]
            
          "
        />

        {/* Tablet integration */}
        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            left-0
            top-0
            hidden
            h-screen
            w-[52%]
            bg-gradient-to-r
            from-black
            via-black/75
            to-transparent
            md:block
            lg:hidden
          "
        />
        </div>

      {/* Artwork information */}
      {/* <div
        className="
          relative
          z-10
          mt-0
          
          max-w-none
          
          px-[-2vw]
          md:ml-0
          md:w-auto
          md:max-w-none
          md:absolute
          md:bottom-20
          md:right-[0.1vw]
          md:mt-10
          md:px-0
          lg:right-[0.1vw]
          lg:translate-x-0
        "
      >
        <ArtworkInfo artwork={artwork} />
      </div> */}
    {/* Artwork information */}
    
    <div
      className="
        absolute
        bottom-1
        top-5
        left-0
        z-20
        w-full
        px-20
        
        md:bottom-20
        md:left-auto
        md:right-[0.1vw]
        md:w-auto
        md:px-0
        
        // lg:right-[0.1vw]
        // lg:translate-x-0
        lg:right-0
        lg:bottom-1
      "
    >
      <ArtworkInfo artwork={artwork} />
</div>
        {/* <ArtworkInfo artwork={artwork} /> */}
      
</div>

  );
}