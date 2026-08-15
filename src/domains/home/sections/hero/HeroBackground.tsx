export default function HeroBackground() {
  return (
    <>
      {/* Global vignette */}
      <div
        aria-hidden
        className="
          absolute
          inset-0
          pointer-events-none
          bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)]
        "
      />
    </>
  );
}