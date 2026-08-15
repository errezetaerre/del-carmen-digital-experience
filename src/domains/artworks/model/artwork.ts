export interface Artwork {
  id: string;

  title: string;

  year: number;

  technique: string;

  dimensions: {
    width: number;
    height: number;
    unit: "cm" | "in";
  };

  image: {
    src: string;
    alt: string;
  };

  quote?: string;

  description?: string;

  price?: number;

  currency?: "USD" | "CRC";

  availability: "available" | "reserved" | "sold";
}