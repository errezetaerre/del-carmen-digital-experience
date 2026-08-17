import type { Artwork } from "../model";

export const artworks: Artwork[] = [
  {
    id: "epifania_nupcial",

    title: "Epifania Nupcial",

    year: 2026,

    technique: "Oil on canvas",

    dimensions: {
      width: 113,
      height: 95,
      unit: "cm",
    },

    image: {
      src: "/artworks/epifania_nupcial.png",
      alt: "Epifania Nupcial real",
    },

    quote: "She wears no veil, only silence.",

    description: "A moment suspended between memory, devotion and becoming.",

    price: 6000,

    currency: "USD",

    availability: "available",
  },

  {
    id: "el_misionero",

    title: "El Misionero",

    year: 2024,

    technique: "Oil on canvas",

    dimensions: {
      width: 60,
      height: 70,
      unit: "cm",
    },

    image: {
      src: "/artworks/el_misionero.jpg",
      alt: "El Misionero",
    },

    quote: "She wears no mision, only silence.",

    description:
      "A quiet meditation on inner light, compassion, freedom and the mission within.",

    price: 6000,

    currency: "USD",

    availability: "available",
  },

  {
    id: "el_baul_de_los_tesoros",

    title: "El Baúl de los Tesoros",

    year: 2022,

    technique: "Oil on canvas",

    dimensions: {
      width: 90,
      height: 60,
      unit: "cm",
    },

    image: {
      src: "/artworks/el_baul_de_los_tesoros.jpg",
      alt: "El Baúl de los Tesoros",
    },

    quote: "She wears no baul, only silence.",

    description:
      "A symbolic journey toward the discovery of the soul and the treasures hidden within.",

    price: 6000,

    currency: "USD",

    availability: "available",
  },

  {
    id: "sendero_del_sol",

    title: "Sendero del Sol",

    year: 2023,

    technique: "Oil on canvas",

    dimensions: {
      width: 100,
      height: 130,
      unit: "cm",
    },

    image: {
      src: "/artworks/sendero_del_sol.jpg",
      alt: "Sendero del Sol",
    },

    quote: "She wears no sendero, only silence.",

    description:
      "A reflection on life's path, hope, serenity and the light we leave behind.",

    price: 6000,

    currency: "USD",

    availability: "available",
  },
];