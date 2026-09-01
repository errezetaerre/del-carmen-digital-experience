import Image from "next/image";

import { Container } from "@/shared/layout";
import LinkButton from "@/shared/ui/button/LinkButton";

import ArtistStatementMotion from "./ArtistStatementMotion";

export default function ArtistStatement() {
  return (
    <section
      data-artist-statement
      aria-labelledby="artist-philosophy-title"
      className="
        relative
        w-full
        md:pb-[180px]
        lg:pt-[20px]
        lg:pb-[14px]
      "
    >
      <ArtistStatementMotion />

      <Container>
        <div
          className="
            grid
            w-full
            grid-cols-1
            gap-16
            md:grid-cols-8
            md:gap-8
            lg:grid-cols-12
          "
        >
          {/* Artist Portrait */}
          <div
            data-artist-portrait
            className="
              artist-statement-motion
              relative
              flex
              items-center

              md:col-span-3
              lg:col-span-5
            "
            aria-label="Artist portrait"
          >
            {/* Mask */}
            <div
              className="
                relative
                h-[80%]
                min-h-[420px]
                w-full
                overflow-hidden
                bg-black/5

                md:min-h-[520px]
                lg:min-h-[620px]
              "
            >
              {/* Movable image layer */}
              <div
                className="
                  absolute
                  inset-0

                  translate-x-[1%]
                  translate-y-[0%]
                  scale-[1]
                "
              >
                <Image
                  src="/images/artist/about_the_artist.png"
                  alt="Del Carmen"
                  fill
                  className="
                    object-cover
                    object-contain
                  "
                />
              </div>
            </div>
          </div>

          {/* Philosophy */}
          <div
            className="
              flex
              flex-col
              justify-center
              md:col-span-5
              lg:col-span-7
              lg:pl-12
            "
          >
            {/* Heading */}
            <h2
              data-artist-title
              id="artist-philosophy-title"
              className="
                artist-statement-motion
                max-w-2xl
                font-display
                text-4xl
                font-light
                leading-[1.02]
                tracking-[0.01em]
                text-white
                md:text-5xl
                lg:text-6xl
              "
            >
              Art as eternal memory
            </h2>

            {/* Statement */}
            <div
              className="
                mt-10
                max-w-2xl
                space-y-7
                font-sans
                text-base
                font-light
                leading-[1.8]
                tracking-[0.01em]
                text-white/65
                md:mt-12
                md:text-lg
                md:leading-[1.75]
                lg:text-xl
                lg:leading-[1.7]
              "
            >
              <p data-artist-paragraph
                className="artist-statement-motion">
                My works are born from a vow with heaven: to capture the
                beauty that the soul recognizes, but the world has forgotten.
              </p>

              <p data-artist-paragraph
                className="artist-statement-motion">
                I paint to awaken consciousness, to remind us that what is
                essential is not seen, but felt.
              </p>
            </div>

            {/* Signature & CTA */}
            <div className="mt-12">
              <div data-artist-signature
                className="artist-statement-motion">
                <Image
                  src="/images/artist/Rolando_del_Carmen_white_high_res_signature.png"
                  alt="Del Carmen"
                  width={220}
                  height={60}
                  className="
                    h-auto
                    w-[200px]
                    object-contain
                    object-left
                  "
                />
              </div>

              <div data-artist-cta
                className="artist-statement-motion">
                <LinkButton
                  href="/artist"
                  variant="bronzeUnderline"
                  className="
                    mt-10
                    font-sans
                    text-xs
                    tracking-[0.28em]
                  "
                >
                  Discover my story →
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}