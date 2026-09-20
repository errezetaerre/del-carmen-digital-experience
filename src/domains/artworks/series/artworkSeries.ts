import { ArtworkSeries } from "./types";

export const artworkSeries: ArtworkSeries[] = [
    {
        id: "yasemi",
        slug: "yasemi",
        title: "Yasemi",
        description:
            "A contemplative exploration of serenity, transformation, and the shifting language of color.",
        statement:
            "Yasemi unfolds as a space of contemplation in the more deep of the ocean is living what the world needs from now on.",
        coverArtworkId: "yasemi_i",
        images: {
            featured: {
                src: "/artworks/yasemi_I_collection_hero_landscape.jpg",
                alt: "Yasemi — featured collection",
                width: 1376,
                height: 768,
            },
        },
        hero: {
            layout: {
                mobile: { media: "portrait", content: "bottom" },
                tablet: { media: "portrait", content: "bottom" },
                desktop: { media: "landscape", content: "right" },
            },
            media: {
                type: "image",
                desktop: {
                    src: "/artworks/yasemi_I_collection_hero_landscape.jpg",
                    alt: "Yasemi",
                    width: 1376,
                    height: 768,
                },
                mobile: {
                    src: "/artworks/yasemi_I_collection_hero_portrait.png",
                    alt: "Yasemi",
                    width: 941,
                    height: 1672,
                },
            },
        },
        status: "ongoing",
        yearStart: 2026,
        atmosphere: {
            src: "/series/yasemi/yasemi_atmosphere.png",
            alt: "",
        },
    },
    {
        id: "epifanias",
        slug: "epifanias",
        title: "Epifanias",
        description:
            "A study of presence, silence, and the emotional character of light.",
        statement:
            "This collection explores the relationship between the human figure, atmosphere, and contemplative space.",
        coverArtworkId: "artwork-id-here",
        hero: {
            layout: {
                mobile: { media: "portrait", content: "top" },
                tablet: { media: "portrait", content: "top" },
                desktop: { media: "landscape", content: "left" },
            },
            media: {
                type: "image",
                desktop: {
                    src: "/artworks/epifanias_collection_hero_landscape.png",
                    alt: "Epifanias hero landscape",
                    width: 1672,
                    height: 941,
                },
                mobile: {
                    src: "/artworks/epifanias_collection_hero_portrait.png",
                    alt: "Epifanias hero portrait",
                    width: 941,
                    height: 1672,
                },
            },
        },
        status: "ongoing",
        yearStart: 2027,
        atmosphere: {
            src: "/series/epifanias/epifanias_atmosphere.png",
            alt: "",
        },
    },
    {
        id: "the_inner_treasury",
        slug: "the_inner_treasury",
        title: "The Inner Treasury",
        description:
            "A contemplative series exploring the invisible treasures we gather within: wisdom, faith, self-knowledge and the quiet transformation of the soul.",
        statement:
            "The Inner Treasury explores the idea that our most profound treasures are not the things we possess, but those we gradually discover within ourselves. Through symbolic objects, intimate spaces, light, silence and ritual, the series transforms the visible world into a language of interior experience. Chests, books, candles, sacred figures and reflective surfaces appear not simply as objects, but as thresholds—each suggesting something concealed, remembered, learned or waiting to be revealed. At the heart of the collection lies a journey from seeking to recognizing. Knowledge may open one door, faith another; silence invites contemplation, while light becomes a metaphor for consciousness. Some mysteries remain sealed until we are ready to encounter them. The works do not attempt to prescribe a spiritual path. Instead, they create spaces for stillness and personal interpretation, where the material and the intangible quietly coexist. Ultimately, The Inner Treasury proposes that the greatest discovery is not hidden somewhere beyond us. It is the moment in which the seeker turns inward and recognizes what has been there all along: the soul encountering itself.",
        coverArtworkId: "artwork-id-here",
        hero: {
            layout: {
                mobile: { media: "portrait", content: "top" },
                tablet: { media: "portrait", content: "top" },
                desktop: { media: "landscape", content: "left" },
            },
            media: {
                type: "image",
                desktop: {
                    src: "/artworks/the_inner_treasury_collection_hero_landscape.png",
                    alt: "The Inner Treasury landscape",
                    width: 1672,
                    height: 941,
                },
                mobile: {
                    src: "/artworks/the_inner_treasury_collection_hero_portrait.png",
                    alt: "The Inner Treasury portrait",
                    width: 941,
                    height: 1672,
                },
            },
        },
        status: "completed",
        yearStart: 2024,
        yearEnd: 2024,
        atmosphere: {
            src: "/series/the_inner_treasury/the_inner_treasury_atmosphere.png",
            alt: "",
        },
    },
    {
        id: "the_discipline_of_seeing",
        slug: "the_discipline_of_seeing",
        title: "The Discipline of Seeing",
        description:
            "Studies in intimacy, before the hand creates, the eye must learn to see.",
        statement:
            "The Discipline of Seeing brings together works created throughout my academic training in the atelier. More than technical exercises, they represent a sustained practice of observation—a process of learning to recognize proportion, structure, anatomy, light and the subtle relationships that give form its presence.",
        coverArtworkId: "artwork-id-here",
        hero: {
            layout: {
                mobile: { media: "portrait", content: "bottom" },
                tablet: { media: "portrait", content: "bottom" },
                desktop: { media: "landscape", content: "right" },
            },
            media: {
                type: "image",
                desktop: {
                    src: "/artworks/the_discipline_of_seeing_collection_hero_landscape.png",
                    alt: "the_discipline_of_seeing_hero_landscape",
                    width: 1672,
                    height: 941,
                },
                mobile: {
                    src: "/artworks/the_discipline_of_seeing_collection_hero_portrait.png",
                    alt: "the_discipline_of_seeing_hero_portrait",
                    width: 941,
                    height: 1672,
                },
            },
        },
        status: "completed",
        yearStart: 2023,
        yearEnd: 2023,
        atmosphere: {
            src: "/series/the_discipline_of_seeing/the_discipline_of_seeing_atmosphere.png",
            alt: "",
        },
    },
];
