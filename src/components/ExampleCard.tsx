import type { Example } from "../types";
import { DIAGRAMS } from "./Diagrams";
import { IcChip, IcPencil, IcTrash } from "./Icons";
import Reveal from "./Reveal";

function Ticks() {
  const c = "absolute h-3 w-3 border-copper/60";
  return (
    <>
      <span className={`${c} left-1.5 top-1.5 border-l-2 border-t-2`} />
      <span className={`${c} right-1.5 top-1.5 border-r-2 border-t-2`} />
      <span className={`${c} bottom-1.5 left-1.5 border-b-2 border-l-2`} />
      <span className={`${c} bottom-1.5 right-1.5 border-b-2 border-r-2`} />
    </>
  );
}

export default function ExampleCard({
  example,
  code,
  index,
  editable,
  delay = 0,
  onEdit,
  onDelete,
}: {
  example: Example;
  code: string;
  index: number;
  editable: boolean;
  delay?: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const pass = example.verdict === "pass";
  const Diagram = example.diagram ? DIAGRAMS[example.diagram] : null;

  return (
    <Reveal delay={delay}>
      <article
        className={`group relative flex h-full flex-col border bg-panel/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 ${
          pass ? "border-passdim/60 hover:border-pass/60" : "border-faildim/60 hover:border-fail/60"
        }`}
      >
        {/* visual */}
        <div className="relative p-3 pb-0">
          <div className="relative">
            <Ticks />
            {example.image ? (
              <img
                src={example.image}
                alt={example.title}
                className="block w-full border border-edgesoft object-cover"
                style={{ aspectRatio: "5/3" }}
              />
            ) : Diagram ? (
              <Diagram />
            ) : (
              <div className="flex items-center justify-center border border-edgesoft bg-bg py-10 text-faint">
                <IcChip size={26} />
              </div>
            )}
            {/* stamp */}
            <span
              className={`absolute right-2.5 top-2.5 -rotate-6 border-2 px-2 py-0.5 font-display text-[12px] font-bold tracking-[0.22em] backdrop-blur-[2px] transition-transform duration-300 group-hover:-rotate-2 ${
                pass ? "border-pass/80 bg-bg/60 text-pass" : "border-fail/80 bg-bg/60 text-fail"
              }`}
            >
              {pass ? "APPROVED" : "REJECTED"}
            </span>
          </div>
        </div>

        {/* body */}
        <div className="flex flex-1 flex-col p-4 pt-3.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.2em] text-faint">
              {code}-{String(index + 1).padStart(2, "0")}
            </span>
            {pass ? (
              <span className="ml-auto font-mono text-[10px] tracking-[0.16em] text-pass/90">
                REQUIRED STANDARD · NO BONUS
              </span>
            ) : (
              <>
                <span
                  className={`border px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-[0.18em] ${
                    example.severity === "critical"
                      ? "border-fail/50 bg-fail/10 text-fail"
                      : example.severity === "major"
                        ? "border-warn/50 bg-warn/10 text-warn"
                        : "border-info/50 bg-info/10 text-info"
                  }`}
                >
                  {(example.severity ?? "major").toUpperCase()}
                </span>
                <span className="ml-auto font-mono text-[11px] font-semibold tracking-[0.12em] text-fail">
                  −{example.deduction ?? 0} PTS / OCC.
                </span>
              </>
            )}
          </div>

          <h3 className="mt-2 font-display text-[17px] font-bold leading-snug tracking-wide text-ink">
            {example.title}
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-dim">{example.description}</p>

          <div className={`mt-3 border-l-2 pl-3 ${pass ? "border-pass/60" : "border-fail/60"}`}>
            <p className={`font-mono text-[9.5px] tracking-[0.24em] ${pass ? "text-pass/80" : "text-fail/80"}`}>
              {pass ? "WHY IT PASSES" : "WHY IT IS NOT SUPPORTED"}
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink/85">{example.reason}</p>
          </div>

          {example.tags.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1.5 pt-3.5">
              {example.tags.map((t) => (
                <span key={t} className="border border-edgesoft px-1.5 py-0.5 font-mono text-[9.5px] tracking-[0.14em] text-faint">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* edit controls */}
        {editable && (
          <div className="absolute left-2.5 top-2.5 z-10 flex gap-1 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <button
              onClick={onEdit}
              className="flex items-center gap-1 border border-edge bg-bg/90 px-2 py-1 font-mono text-[9.5px] tracking-[0.14em] text-copperlt hover:border-copper"
            >
              <IcPencil size={11} /> EDIT
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1 border border-edge bg-bg/90 px-2 py-1 font-mono text-[9.5px] tracking-[0.14em] text-fail hover:border-fail"
            >
              <IcTrash size={11} /> DEL
            </button>
          </div>
        )}
      </article>
    </Reveal>
  );
}
