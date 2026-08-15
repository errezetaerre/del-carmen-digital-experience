import Image from "next/image";

import { Container } from "@/shared/layout";
import LinkButton from "@/shared/ui/button/LinkButton";

export default function ArtistStatement() {
  return (
    <section
      aria-labelledby="artist-philosophy-title"
      className="
        relative
        w-full
        md:pb-[180px]
        lg:pt-[20px]
        lg:pb-[14px]
      "
    >
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
            className="
              relative
              aspect-[4/5]
              overflow-hidden
              bg-black/5
              md:col-span-3
              lg:col-span-5
            "
            aria-label="Artist portrait"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/images/artist/about_the_artist.png"
                alt="Del Carmen"
                width={2200}
                height={600}
                className="
                  h-[1000px]
                  w-auto
                  object-contain
                  object-left
                "
              />
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
              id="artist-philosophy-title"
              className="
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
              El arte como memoria eterna
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
              <p>
                Mis obras nacen de un voto con el cielo: plasmar las bellezas
                que el alma reconoce, pero el mundo ha olvidado.
              </p>

              <p>
                Pinto para despertar conciencia, para recordarnos que lo
                esencial no se ve, pero se siente.
              </p>
            </div>

            {/* Signature & CTA */}
            <div className="mt-12">
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

              <LinkButton
                href="/collection"
                variant="bronzeUnderline"
                className="
                  mt-10
                  font-sans
                  text-xs
                  tracking-[0.28em]
                "
              >
                Conoce mi historia →
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}