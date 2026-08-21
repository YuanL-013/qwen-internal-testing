export default function Credit({ name }: { name?: string }) {
  if (!name) return null;
  return (
    <div className="relative overflow-hidden border-t border-edgesoft">
      <div aria-hidden className="dotgrid pointer-events-none absolute inset-0 opacity-25" />
      <p className="sr-only">This project was initiated by {name}.</p>
      <div
        aria-hidden
        className="relative select-none whitespace-nowrap px-4 py-14 text-center leading-none lg:py-20"
      >
        <span
          className="block font-display font-bold uppercase tracking-tight"
          style={{
            fontSize: "clamp(2.2rem, 8.5vw, 7.5rem)",
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(24,58,45,0.95)",
          }}
        >
          initiated by {name}
        </span>
      </div>
      <p className="relative pb-8 text-center font-mono text-[9px] tracking-[0.32em] text-faint/70">
        · PROJECT CREDIT ·
      </p>
    </div>
  );
}
