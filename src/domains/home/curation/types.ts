export interface HomeCuration {
    hero: {
        artworkId: string;
    };

    featuredWork: {
        artworkId: string;
    };

    featuredCollection: {
        seriesId: string;
    };

    selectedWorks: string[];
}