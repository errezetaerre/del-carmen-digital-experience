export type HomeCollectionEntry =
    | {
        type: "artwork";
        id: string;
    }
    | {
        type: "series";
        id: string;
    };

export interface HomeCuration {
    hero: {
        artworkId: string;
    };

    featuredWork: {
        artworkId: string;
    };

    featuredCollection: HomeCollectionEntry[];
}