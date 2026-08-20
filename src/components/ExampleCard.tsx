import { useState } from "react";
import type { Example } from "../types";
import { DIAGRAMS } from "./Diagrams";
import { IcChevD, IcChip, IcImage } from "./Icons";
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
  delay = 0,
}: {
  example: Example;
  code: string;
  index: number;
  delay?: number;
}) {
  const pass = example.verdict === "pass";
  const Diagram = example.diagram ? DIAGRAMS[example.diagram] : null;
  const [open, setOpen] = useState(false);

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
            {example.image && (
              <span className="absolute left-2.5 top-2.5 flex items-center gap-1 border border-edge bg-bg/80 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.18em] text-copperlt backdrop-blur-[2px]">
                <IcImage size={10} /> REAL PHOTO
              </span>
            )}
          </div>
        </div>

        {/* body */}
        <div className="flex flex-1 flex-col p-4 pt-3.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.2em] text-faint">
              {code}-{String(index + 1).padStart(2, "0")}
            </span>
            <span
              className={`ml-auto font-mono text-[10px] tracking-[0.16em] ${pass ? "text-pass/90" : "text-fail/90"}`}
            >
              {pass ? "DO THIS" : "NEVER THIS"}
            </span>
          </div>

          <h3 className="mt-2 font-display text-[17px] font-bold leading-snug tracking-wide text-ink">
            {example.title}
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-dim">{example.description}</p>

          {/* collapsible reason */}
          {example.reason && (
            <div className="mt-3">
              <button
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className={`flex w-full items-center gap-2 border-l-2 py-1.5 pl-3 pr-1 text-left transition-colors ${
                  pass
                    ? "border-pass/60 hover:bg-pass/5"
                    : "border-fail/60 hover:bg-fail/5"
                }`}
              >
                <span className={`font-mono text-[9.5px] tracking-[0.24em] ${pass ? "text-pass/80" : "text-fail/80"}`}>
                  {pass ? "WHY THIS WORKS" : "WHY THIS FAILS"}
                </span>
                <span
                  className={`ml-auto shrink-0 text-faint transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                >
                  <IcChevD size={13} />
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className={`border-l-2 pl-3 pt-2 text-[12.5px] leading-relaxed text-ink/85 ${pass ? "border-pass/60" : "border-fail/60"}`}>
                    {example.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

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
      </article>
    </Reveal>
  );
}
