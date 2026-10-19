import type { JournalScene, JournalStory } from "@/domains/journal/types";
import type { SiteLocale } from "./config";
import translations from "./content/journalStories.es.json";

type SceneTranslation = Partial<Pick<JournalScene, "eyebrow" | "title" | "text">>;
const spanishStoryCopy: Readonly<Record<string, Readonly<Record<string, SceneTranslation>>>> = translations;
const editorialFields = ["eyebrow", "title", "text"] as const;

function getSceneTranslation(storySlug: string, scene: JournalScene): SceneTranslation | undefined {
    if (!Object.prototype.hasOwnProperty.call(spanishStoryCopy, storySlug)) return undefined;
    const scenes = spanishStoryCopy[storySlug];
    if (!Object.prototype.hasOwnProperty.call(scenes, scene.id)) return undefined;
    const copy = scenes[scene.id];

    // Keep a future scene in English until every existing text field is translated.
    const complete = editorialFields.every((field) => {
        const translated = copy[field];
        return typeof scene[field] !== "string" || (typeof translated === "string" && translated.trim().length > 0);
    });
    return complete ? copy : undefined;
}

export function journalSceneTextLocale(storySlug: string, scene: JournalScene, locale: SiteLocale): SiteLocale {
    return locale === "es" && getSceneTranslation(storySlug, scene) ? "es" : "en";
}

export function localizeJournalStory(story: JournalStory, locale: SiteLocale): JournalStory {
    if (locale !== "es") return story;
    let changed = false;
    const scenes = story.scenes.map((scene) => {
        const copy = getSceneTranslation(story.slug, scene);
        if (!copy) return scene;
        const localized = { ...scene };
        for (const field of editorialFields) {
            const translated = copy[field];
            if (typeof scene[field] === "string" && typeof translated === "string") {
                localized[field] = translated;
            }
        }
        changed = true;
        return localized;
    });
    return changed ? { ...story, scenes } : story;
}
