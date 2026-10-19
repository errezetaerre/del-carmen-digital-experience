import { Container } from "@/shared/layout";
import { LinkButton } from "@/shared/ui/button";
import { getJournalEntries } from "@/domains/journal";
import { useLocale, useTranslations } from "next-intl";
import { journalEntryTextLocale, localizeJournalEntry } from "@/i18n/journalCopy";

import JournalPreviewMotion from "./JournalPreviewMotion";


export default function JournalPreview() {
  const locale = useLocale();
  const t = useTranslations("Home");
  const entries = getJournalEntries().slice(0, 4).map((entry) => localizeJournalEntry(entry, locale));

  if (entries.length === 0) {
    return null;
  }

  return (
    <section
      id="journal"
      data-journal-preview

      className="
        relative
        overflow-hidden
        bg-background
        py-[var(--section-space-generous)]
        text-white
      "
    >
      <JournalPreviewMotion />
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
            data-journal-eyebrow

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
            {t("journalEyebrow")}
          </p>

          <h2
            data-journal-title

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
            {t("journalTitleFirst")}
            <br />
            {t("journalTitleSecond")}
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
          {entries.map((entry, index) => (
            <article
              data-journal-entry

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
                data-journal-image

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
                data-journal-heading
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
                  <span lang={journalEntryTextLocale(entry, locale)}>{entry.category}</span>

                  <span className="h-px w-6 bg-brand-gold/50" />

                  <span>{entry.year}</span>
                </div>

                {/* Entry title */}
                <h3
                  lang={journalEntryTextLocale(entry, locale)}
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
                <div data-journal-copy>
                  <p
                    lang={journalEntryTextLocale(entry, locale)}
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
                </div>

                {/* CTA */}
                <div data-journal-cta>
                  <LinkButton
                    href={`/journal/${entry.slug}`}
                    variant="bronzeUnderline"
                    className="
                      mt-10
                      font-sans
                      text-xs
                      tracking-[0.28em]
                    "
                  >
                    {t("journalRead")}
                  </LinkButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
