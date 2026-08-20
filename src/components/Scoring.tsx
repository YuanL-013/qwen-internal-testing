import { BANDS, PASS_MARK, SEVERITIES, START_SCORE } from "../data/scheme";
import type { Severity } from "../types";
import { IcAlert } from "./Icons";
import Reveal from "./Reveal";

const severityTone: Record<Severity, string> = {
  critical: "text-fail border-fail/50 bg-fail/10",
  major: "text-warn border-warn/50 bg-warn/10",
  minor: "text-info border-info/50 bg-info/10",
};

export default function Scoring() {
  // bar segments in ascending score order
  const segs = [...BANDS].reverse();
  const total = segs[segs.length - 1].max - segs[0].min + 1;

  return (
    <section id="scoring" className="relative border-b border-edge">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:px-8 lg:py-16">
        <div>
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.28em] text-copper">SECTION 00 /// METHOD</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              How your board is scored
            </h2>
            <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-dim">
              Every board starts at <span className="font-mono text-copperlt">{START_SCORE} points</span>. A reviewer
              walks the layout category by category; each rejected pattern deducts points{" "}
              <em className="text-ink not-italic underline decoration-copper/50 underline-offset-4">per occurrence</em>{" "}
              — three acid traps cost three times. Approved patterns score nothing extra: they are simply the entry
              ticket.
            </p>
          </Reveal>

          <div className="mt-7 space-y-3">
            {(Object.keys(SEVERITIES) as Severity[]).map((s, i) => (
              <Reveal key={s} delay={i * 90}>
                <div className="group flex items-center gap-4 border border-edge bg-panel/70 p-4 transition-colors hover:border-copper/40">
                  <span
                    className={`flex h-11 w-16 shrink-0 items-center justify-center border font-mono text-[11px] font-semibold tracking-[0.14em] ${severityTone[s]}`}
                  >
                    −{SEVERITIES[s].pts}
                  </span>
                  <div>
                    <p className="font-display text-[15px] font-bold tracking-wide text-ink">
                      {SEVERITIES[s].label}
                      <span className="ml-2 font-mono text-[10px] font-normal tracking-[0.2em] text-faint">
                        PER OCCURRENCE
                      </span>
                    </p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-dim">{SEVERITIES[s].desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="lg:pt-[72px]">
          <Reveal delay={120}>
            <p className="font-mono text-[11px] tracking-[0.28em] text-copper">OUTCOME BANDS</p>
            <div className="relative mt-4">
              <div className="flex h-12 w-full overflow-hidden border border-edge">
                {segs.map((b) => (
                  <div
                    key={b.label}
                    className="group relative flex items-end justify-center pb-1 transition-transform hover:-translate-y-0.5"
                    style={{ width: `${((b.max - b.min + 1) / total) * 100}%`, background: `${b.tone}26` }}
                    title={`${b.min}–${b.max}: ${b.label}`}
                  >
                    <span className="absolute inset-x-0 top-0 h-1" style={{ background: b.tone }} />
                    <span className="font-mono text-[10px] tracking-wider" style={{ color: b.tone }}>
                      {b.min}+
                    </span>
                  </div>
                ))}
              </div>
              {/* pass mark tick */}
              <div className="absolute -top-2 bottom-0" style={{ left: `${(PASS_MARK / 100) * 100}%` }}>
                <div className="h-full w-px bg-ink/70" />
                <span className="absolute -top-1 left-1 font-mono text-[9px] tracking-[0.2em] text-ink/70">
                  PASS {PASS_MARK}
                </span>
              </div>
            </div>

            <ul className="mt-5 divide-y divide-edgesoft border border-edge bg-panel/70">
              {[...BANDS].map((b) => (
                <li key={b.label} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-raise/50">
                  <span className="h-2.5 w-2.5 shrink-0 rotate-45" style={{ background: b.tone }} />
                  <span className="w-24 shrink-0 font-display text-sm font-bold tracking-wide text-ink">{b.label}</span>
                  <span className="w-14 shrink-0 font-mono text-[11px] text-faint">
                    {b.min}–{b.max}
                  </span>
                  <span className="text-[12.5px] text-dim">{b.note}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-start gap-3 border border-warn/30 bg-warn/5 p-4">
              <span className="mt-0.5 shrink-0 text-warn">
                <IcAlert size={16} />
              </span>
              <p className="text-[12.5px] leading-relaxed text-dim">
                <span className="font-mono text-[11px] tracking-[0.18em] text-warn">REVIEWER'S NOTE — </span>
                deductions stack without a per-category cap. One category cannot drag you below zero, but a board
                riddled with the same mistake reads as "not yet ready", and the band reflects that.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
