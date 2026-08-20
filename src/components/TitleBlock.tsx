import type { Scheme } from "../types";
import { IcArrow, IcChip } from "./Icons";
import Reveal from "./Reveal";

const DATA_STATE = {
  live: { led: "led bg-pass", text: "text-pass", label: "LIVE · REPO" },
  stale: { led: "led bg-warn", text: "text-warn", label: "STALE FILE IGNORED" },
  compiled: { led: "bg-copper", text: "text-copperlt", label: "BUILT-IN SNAPSHOT" },
} as const;

export default function TitleBlock({
  scheme,
  source,
}: {
  scheme: Scheme;
  source: keyof typeof DATA_STATE;
}) {
  const ds = DATA_STATE[source];
  const all = scheme.categories.flatMap((c) => c.examples.map((e) => ({ title: e.title, verdict: e.verdict })));
  const passes = all.filter((e) => e.verdict === "pass").length;
  const fails = all.length - passes;

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
    ["AUDIENCE", "TRAINEES + MARKERS"],
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
                <span className="text-dim">HW HOMEWORK — PCB</span>
              </p>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="mt-4 font-display font-bold leading-[0.95] tracking-tight">
                <span className="block text-[clamp(2.6rem,7vw,4.6rem)] text-ink">PCB LAYOUT</span>
                <span
                  className="block text-[clamp(2.6rem,7vw,4.6rem)]"
                  style={{ WebkitTextStroke: "1.5px #e0955a", color: "transparent" }}
                >
                  STANDARD
                </span>
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-dim">
                One guide for trainees and markers: what is <span className="text-pass">okay</span> on a submission,
                what is <span className="text-fail">not okay</span>, and why. Study it before you route a single
                track — how boards are scored stays internal; what is expected of them is written here, in the open.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <span className="border border-edge bg-panel px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-ink">
                  <span className="text-pass">✓ {passes}</span> APPROVED PATTERNS
                </span>
                <span className="border border-edge bg-panel px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-ink">
                  <span className="text-fail">✕ {fails}</span> REJECTED PATTERNS
                </span>
                <span className="border border-edge bg-panel px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-ink">
                  {scheme.categories.length} SECTIONS
                </span>
                <a
                  href="#guide"
                  className="group ml-1 flex items-center gap-2 border border-copper/50 bg-copper/10 px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-copperlt transition-colors hover:bg-copper hover:text-bg"
                >
                  READ THE GUIDE
                  <span className="transition-transform group-hover:translate-y-0.5">
                    <IcArrow size={13} className="rotate-90" />
                  </span>
                </a>
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
                <div key={k} className="flex border-b border-edgesoft">
                  <span className="w-24 border-r border-edgesoft px-3 py-1.5 tracking-[0.18em] text-faint">{k}</span>
                  <span className="flex-1 px-3 py-1.5 tracking-wider text-ink">{v}</span>
                </div>
              ))}
              <div className="flex">
                <span className="w-24 border-r border-edgesoft px-3 py-1.5 tracking-[0.18em] text-faint">DATA</span>
                <span
                  className="flex flex-1 cursor-help items-center gap-1.5 px-3 py-1.5 tracking-wider"
                  title={
                    source === "stale"
                      ? "data/scheme.json in this build is an older revision than the app — serving the compiled content instead."
                      : source === "live"
                        ? "Content loaded from data/scheme.json (reviewer-maintained)."
                        : "No committed data file found — serving the revision compiled into this build."
                  }
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${ds.led}`} />
                  <span className={ds.text}>{ds.label}</span>
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* pattern ticker — standards only, no scoring */}
      <div className="ticker relative overflow-hidden border-t border-edge bg-panel/70 py-2">
        <div className="ticker-track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {all.map((e, i) => (
                <span key={`${dup}-${i}`} className="flex items-center font-mono text-[11px] tracking-[0.14em]">
                  <span className={`px-4 ${e.verdict === "pass" ? "text-pass" : "text-fail"}`}>
                    {e.verdict === "pass" ? "✓" : "✕"} {e.title.toUpperCase()}
                  </span>
                  <span className="text-edge">///</span>
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

export function TitleBlockSkeleton() {
  return (
    <header className="border-b border-edge">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-12 lg:px-8 lg:pt-16">
        <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.28em] text-copper">
          <span className="led h-1.5 w-1.5 rounded-full bg-copper" /> READING GUIDE DATA…
        </p>
        <div className="mt-5 flex items-center gap-4">
          <span className="text-raise">
            <IcChip size={34} />
          </span>
          <div className="space-y-2.5">
            <div className="h-6 w-64 bg-raise" />
            <div className="h-3 w-44 bg-raise" />
          </div>
        </div>
      </div>
    </header>
  );
}
