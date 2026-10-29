import type { SiteLocale } from "./config";
import type { HomeBookChapter } from "@/domains/home/experience/homeBookContent";

interface HomeBookCopy {
    title: string; navigation: string; back: string; newsletter: string;
    position: string; chapter: Record<HomeBookChapter, string>;
}
const copy: Record<SiteLocale, HomeBookCopy> = {
    en: { title: "Del Carmen — Home Glass ArtBook", navigation: "Explore the Home Artbook", back: "Back to Home",
        newsletter: "Subscribe to the newsletter", position: "Page {index} of {total}",
        chapter: { cover: "The encounter", featured: "Featured work", artist: "The artist", collections: "Collections", artworks: "Selected works", journal: "Journal", invitation: "Continue the journey", credits: "Credits" } },
    es: { title: "Del Carmen — Inicio Glass ArtBook", navigation: "Explorar el Artbook del inicio", back: "Volver al inicio",
        newsletter: "Suscribirse al boletín", position: "Página {index} de {total}",
        chapter: { cover: "El encuentro", featured: "Obra destacada", artist: "El artista", collections: "Colecciones", artworks: "Obras seleccionadas", journal: "Diario", invitation: "Sigamos el viaje", credits: "Créditos" } },
};
export function homeBookCopy(locale: SiteLocale): HomeBookCopy { return copy[locale]; }
