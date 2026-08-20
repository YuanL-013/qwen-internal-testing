import type { Scheme } from "../types";
import { PASS_MARK, START_SCORE } from "../data/scheme";
import { IcArrow, IcLock, IcPencil } from "./Icons";
import Reveal from "./Reveal";

export default function TitleBlock({
  scheme,
  editMode,
  onStartReview,
}: {
  scheme: Scheme;
  editMode: boolean;
  onStartReview: () => void;
}) {
  const fails = scheme.categories.flatMap((c) =>
    c.examples.filter((e) => e.verdict === "fail").map((e) => ({ title: e.title, pts: e.deduction ?? 0, code: c.code }))
  );

  const effective = new Date(scheme.meta.updated + "T00:00:00").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const rows: Array<[string, string]> = [
    ["DOC NO", scheme.meta.doc],
    ["REV", scheme.meta.rev],
    ["EFFECTIVE", effective.toUpperCase()],
    ["SHEET", "1 OF 1"],
    ["CLASS", "INTERNAL — HW DIV"],
  ];

  return (
    <header className="relative border-b border-edge">
      <div className="mx-auto max-w-6xl px-5 pb-8 pt-10 lg:px-8 lg:pt-14">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <Reveal>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] font-medium tracking-[0.28em] text-copper">
                <span>{scheme.meta.team.toUpperCase()}</span>
                <span className="text-edge">///</span>
                <span className="text-dim">TRAINEE RECRUITMENT</span>
                <span className="text-edge">///</span>
                <span className="text-dim">HARDWARE DIVISION</span>
              </p>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="mt-4 font-display font-bold leading-[0.95] tracking-tight">
                <span className="block text-[clamp(2.6rem,7vw,4.6rem)] text-ink">PCB HOMEWORK</span>
                <span
                  className="block text-[clamp(2.6rem,7vw,4.6rem)]"
                  style={{ WebkitTextStroke: "1.5px #e0955a", color: "transparent" }}
                >
                  MARKING SCHEME
                </span>
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-dim">
                Every submission is reviewed against this document. Study the approved patterns, memorise the
                rejected ones — each rejected pattern carries a deduction, and the reasons below are exactly what a
                reviewer will write on your board.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <span className="border border-edge bg-panel px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-ink">
                  START <span className="text-copperlt">{START_SCORE} PTS</span>
                </span>
                <span className="border border-edge bg-panel px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-ink">
                  PASS ≥ <span className="text-pass">{PASS_MARK}</span>
                </span>
                <span className="border border-edge bg-panel px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-ink">
                  {fails.length} REJECTION PATTERNS
                </span>
                <a
                  href="#standard"
                  className="group ml-1 flex items-center gap-2 border border-copper/50 bg-copper/10 px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-copperlt transition-colors hover:bg-copper hover:text-bg"
                >
                  READ THE STANDARD
                  <span className="transition-transform group-hover:translate-y-0.5">
                    <IcArrow size={13} className="rotate-90" />
                  </span>
                </a>
                {!editMode && (
                  <button
                    onClick={onStartReview}
                    className="flex items-center gap-2 border border-edge px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-faint transition-colors hover:border-copper hover:text-copperlt"
                  >
                    <IcLock size={13} /> REVIEWER
                  </button>
                )}
                {editMode && (
                  <span className="flex items-center gap-2 border border-copper/50 px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-copper">
                    <IcPencil size={13} /> EDITING LIVE
                  </span>
                )}
              </div>
            </Reveal>
          </div>

          {/* engineering title block */}
          <Reveal delay={200} className="hidden sm:block">
            <div className="w-64 border-2 border-edge bg-panel/80 font-mono text-[11px]">
              <div className="flex items-center justify-between border-b-2 border-edge px-3 py-2">
                <span className="tracking-[0.25em] text-faint">TITLE BLOCK</span>
                <span className="flex items-center gap-1.5 text-pass">
                  <span className="led h-1.5 w-1.5 rounded-full bg-pass" /> RELEASED
                </span>
              </div>
              {rows.map(([k, v]) => (
                <div key={k} className="flex border-b border-edgesoft last:border-b-0">
                  <span className="w-24 border-r border-edgesoft px-3 py-1.5 tracking-[0.18em] text-faint">{k}</span>
                  <span className="flex-1 px-3 py-1.5 tracking-wider text-ink">{v}</span>
                </div>
              ))}
              <div className="flex">
                <span className="w-24 border-r border-edgesoft px-3 py-1.5 tracking-[0.18em] text-faint">PREP. BY</span>
                <span className="flex-1 px-3 py-1.5 tracking-wider text-copperlt">HW LEAD</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* rejected-patterns ticker */}
      <div className="ticker relative overflow-hidden border-t border-edge bg-panel/70 py-2">
        <div className="ticker-track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {fails.map((f, i) => (
                <span key={`${dup}-${i}`} className="flex items-center font-mono text-[11px] tracking-[0.14em]">
                  <span className="px-4 text-fail">✕ {f.title.toUpperCase()}</span>
                  <span className="text-faildim">−{f.pts} PTS</span>
                  <span className="pl-4 text-edge">///</span>
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent" />
      </div>
    </header>
  );
}
