import { Container } from "@/shared/layout";
import { LinkButton } from "@/shared/ui/button";

type JournalEntry = {
  category: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  href: string;
};

const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    category: "Reflections",
    date: "2026",
    title: "The Art of Remembering",
    excerpt:
      "A reflection on memory, beauty and the invisible essence that remains within us.",
    image: "/images/journal/placeholder-01.jpg",
    href: "#",
  },
  {
    category: "Studio",
    date: "2026",
    title: "Inside the Studio",
    excerpt:
      "Notes from the quiet space where observation becomes painting.",
    image: "/images/journal/placeholder-02.jpg",
    href: "#",
  },
  {
    category: "Thoughts",
    date: "2026",
    title: "Painting What Cannot Be Seen",
    excerpt:
      "On the relationship between contemplation, silence and the act of creating.",
    image: "/images/journal/placeholder-03.jpg",
    href: "#",
  },
];

export default function JournalPreview() {
  return (
    <section
      id="journal"
      className="
        relative
        overflow-hidden
        bg-background
        py-[var(--section-space-generous)]
        text-white
      "
    >
      <Container>
        {/* Section heading */}
        <div
          className="
            mb-20
            max-w-2xl
            md:mb-28
            [@media(orientation:landscape)_and_(max-height:600px)]:!mb-14
          "
        >
          <p
            className="
              mb-5
              font-sans
              text-xs
              font-medium
              uppercase
              tracking-[0.35em]
              text-brand-gold
            "
          >
            Journal
          </p>

          <h2
            className="
              font-display
              text-4xl
              font-light
              leading-[1.02]
              tracking-[0.01em]
              text-white
              md:text-5xl
              lg:text-6xl
              [@media(orientation:landscape)_and_(max-height:600px)]:!text-4xl

            "
          >
            Thoughts, stories
            <br />
            and quiet observations.
          </h2>
        </div>

        {/* Editorial entries */}
        <div
          className="
            space-y-24
            md:space-y-32
            lg:space-y-40
            [@media(orientation:landscape)_and_(max-height:600px)]:!space-y-20
          "
        >
          {JOURNAL_ENTRIES.map((entry, index) => (
            <article
              key={entry.title}
              className={[
                "group grid items-center gap-10",
                index % 2 === 0
                  ? "lg:grid-cols-[1.25fr_0.75fr]"
                  : "lg:grid-cols-[0.75fr_1.25fr]",
              ].join(" ")}
            >
              {/* Image */}
              <div
                className={[
                  "overflow-hidden",
                  index % 2 === 0
                    ? "lg:order-1"
                    : "lg:order-2",
                ].join(" ")}
              >
                <div className="w-full overflow-hidden bg-neutral-500">
                  <img
                    src={entry.image}
                    alt=""
                    className="
                      block
                      h-auto
                      w-full
                      transition-transform
                      duration-1000
                      ease-out
                      group-hover:scale-[1.02]
                    "
                  />
                </div>
              </div>

              {/* Editorial text */}
              <div
                className={[
                  "max-w-md",
                  "[@media(orientation:landscape)_and_(max-height:600px)]:!max-w-none",
                  index % 2 === 0
                    ? "lg:order-2"
                    : "lg:order-1",
                ].join(" ")}
              >
                {/* Metadata */}
                <div
                  className="
                    mb-5
                    flex
                    items-center
                    gap-3
                    font-sans
                    text-[11px]
                    font-medium
                    uppercase
                    tracking-[0.22em]
                    text-white/45
                  "
                >
                  <span>{entry.category}</span>

                  <span className="h-px w-6 bg-brand-gold/50" />

                  <span>{entry.date}</span>
                </div>

                {/* Entry title */}
                <h3
                  className="
                    font-display
                    text-3xl
                    font-light
                    leading-[1.05]
                    tracking-[0.01em]
                    text-white
                    md:text-4xl
                  "
                >
                  {entry.title}
                </h3>

                {/* Excerpt */}
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
                  {entry.excerpt}
                </p>

                {/* CTA */}
                <LinkButton
                  href={entry.href}
                  variant="bronzeUnderline"
                  className="
                    mt-10
                    font-sans
                    text-xs
                    tracking-[0.28em]
                  "
                >
                  Read Journal →
                </LinkButton>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}