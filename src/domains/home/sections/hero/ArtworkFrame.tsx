import ArtworkSurface from "./ArtworkSurface";

export default function ArtworkFrame() {
  return (
    <div className="relative aspect-[4/5] w-[320px] overflow-hidden border border-white/10 bg-neutral-900 shadow-[0_40px_100px_rgba(0,0,0,0.7)] md:w-[420px]">
      <ArtworkSurface />
    </div>
  );
}

