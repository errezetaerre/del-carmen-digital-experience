import type { ArtworkFrameProps } from "./types";

export default function ArtworkFrame({
  children,
  className = "",
  aspectRatio = "16 / 9",
}: ArtworkFrameProps) {
  return (
    <div
      className={[
        "group",
        "relative",
        "mb-16",
        "w-[340px]",
        "overflow-hidden",
        "border",
        "border-white/10",
        "shadow-[0_40px_100px_rgba(0,0,0,0.7)]",
        "md:w-[460px]",
        "xl:w-[520px]",
        className,
      ].join(" ")}
      style={{
        aspectRatio,
      }}
    >
      {children}
    </div>
  );
}