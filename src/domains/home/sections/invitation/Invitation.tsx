import { Container } from "@/shared/layout";
import { LinkButton } from "@/shared/ui/button";

export default function Invitation() {
  return (
    <section
      id="invitation"
      className="
        relative
        overflow-hidden
        bg-background-alternate
        py-[var(--section-space-generous)]
        text-white
      "
    >
      <Container>
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-4xl
            flex-col
            items-center
            text-center
          "
        >
          {/* Closing statement */}
          <p
            className="
              font-sans
              text-xs
              font-medium
              uppercase
              tracking-[0.35em]
              text-brand-gold
            "
          >
            Del Carmen
          </p>

          <h2
            className="
              mt-8
              font-display
              text-4xl
              font-light
              leading-[1.02]
              tracking-[0.01em]
              text-white
              md:text-6xl
              lg:text-7xl
            "
          >
            Painting the Eternal
            <br />
            Essence Within
          </h2>

          <p
            className="
              mt-6
              font-display
              text-2xl
              font-light
              italic
              leading-[1.2]
              tracking-[0.01em]
              text-white/65
              md:text-3xl
            "
          >
            Let&apos;s continue
            <br />
            the journey.
          </p>

          {/* Newsletter */}
          <div className="mt-16 max-w-2xl md:mt-20">
            <p
              className="
                font-sans
                text-xs
                font-medium
                uppercase
                tracking-[0.30em]
                text-white/45
              "
            >
              Newsletter
            </p>

            <p
              className="
                mt-6
                font-sans
                text-base
                font-light
                leading-[1.8]
                tracking-[0.01em]
                text-white/55
                md:text-lg
              "
            >
              Receive occasional news about upcoming artworks,
              exhibitions, and the evolving world of Rolando Del
              Carmen&apos;s art.
            </p>
          </div>

          {/* Actions */}
          <div
            className="
              mt-10
              flex
              items-center
              justify-center
              gap-10
            "
          >
            <LinkButton
              href="/newsletter"
              variant="goldUnderline"
              className="
                font-sans
                text-xs
                font-medium
                tracking-[0.28em]
              "
            >
              Subscribe
            </LinkButton>

            <LinkButton
              href="/contact"
              variant="goldUnderline"
              className="
                font-sans
                text-xs
                font-medium
                tracking-[0.28em]
              "
            >
              Contact
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}