import type { Scheme } from "../types";
import { IcArrow } from "./Icons";
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
  const all = scheme.categories
    .filter((c) => !c.hidden)
    .flatMap((c) => c.examples.filter((e) => !e.hidden).map((e) => ({ title: e.title, verdict: e.verdict })));
  const topics = scheme.categories.filter((c) => !c.hidden).length;
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
    ["OWNER", "HW TEAM"],
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
                  DESIGN GUIDE
                </span>
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-dim">
                Everything on this page came from boards we actually built — what held up and what bit back.{" "}
                <span className="text-pass">Green is what we do.</span>{" "}
                <span className="text-fail">Red is what we don't.</span> And every card tells you why. Read it before
                you route a single trace.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <span className="border border-edge bg-panel px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-ink">
                  <span className="text-pass">{passes}</span> DO THIS
                </span>
                <span className="border border-edge bg-panel px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-ink">
                  <span className="text-fail">{fails}</span> NEVER THIS
                </span>
                <span className="border border-edge bg-panel px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-ink">
                  <span className="text-copperlt">{topics}</span> TOPICS
                </span>
                <a
                  href="#standard"
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
                      ? "The committed data file is an older revision than this build — serving the compiled content instead."
                      : source === "live"
                        ? "Content loaded from data/scheme.json."
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
              {all.map((f, i) => (
                <span key={`${dup}-${i}`} className="flex items-center font-mono text-[11px] tracking-[0.14em]">
                  <span className={`px-4 ${f.verdict === "pass" ? "text-pass/80" : "text-fail/80"}`}>
                    {f.verdict === "pass" ? "✓" : "✕"} {f.title.toUpperCase()}
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
    <header className="relative border-b border-edge">
      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="h-4 w-64 animate-pulse bg-raise" />
        <div className="mt-5 h-14 w-[18rem] max-w-full animate-pulse bg-raise" />
        <div className="mt-3 h-14 w-[15rem] max-w-full animate-pulse bg-raise" />
        <div className="mt-6 h-4 w-96 max-w-full animate-pulse bg-raise" />
      </div>
    </header>
  );
}
