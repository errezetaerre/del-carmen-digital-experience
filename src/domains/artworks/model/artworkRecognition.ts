export type ArtworkRecognitionKind = "award" | "honourable-mention" | "selection";

// Recognitions reference artworks; they do not change authorship, categories or sale availability.
export interface ArtworkRecognition {
    id: string;
    artworkId: string;
    kind: ArtworkRecognitionKind;
    title: string;
    event: string;
    year: number;
}
