export default function ArtworkPlaceholder() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-neutral-900">

      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-40" />

      <span className="relative z-10 text-xs uppercase tracking-[0.5em] text-white/40">
        Artwork
      </span>

    </div>
  );
}