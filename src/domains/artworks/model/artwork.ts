export type ArtworkAuthorship =
  | "original"
  | "master-copy"
  | "study-after";

export type ArtworkContext =
  | "independent"
  | "academic-study"
  | "commission";

export type ArtworkMedium =
  | "oil"
  | "graphite"
  | "charcoal"
  | "mixed-media";

export type ArtworkSupport =
  | "canvas"
  | "paper";

export type ArtworkAvailability =
  | "available"
  | "reserved"
  | "sold";

export type ArtworkCurrency =
  | "USD"
  | "CRC";

export interface ArtworkImage {
  src: string;
  alt: string;

  width?: number;
  height?: number;
}

export interface ArtworkImages {
  primary: ArtworkImage;

  heroPortrait?: ArtworkImage;

  heroLandscape?: ArtworkImage;

  thumbnail?: ArtworkImage;

  collection?: ArtworkImage;
}

export interface ArtworkDimensions {
  width: number;
  height: number;

  unit: "cm" | "in";
}

export interface ArtworkPrice {
  amount: number;

  currency: ArtworkCurrency;
}

export interface Artwork {
  id: string;

  slug: string;

  title: string;

  year: number;

  authorship: ArtworkAuthorship;

  context: ArtworkContext;

  medium: ArtworkMedium;

  support: ArtworkSupport;

  categories: string[];

  seriesId?: string;

  dimensions: ArtworkDimensions;

  images: ArtworkImages;

  quote?: string;

  description?: string;

  availability: ArtworkAvailability;

  price?: ArtworkPrice;
}