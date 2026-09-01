import type { Scheme, SpecGroup } from "../types";
import { Reveal, IcArrow, IcChevD } from "./primitives";

/* ---------------- Title block + ticker ---------------- */
export function TitleBlock({ scheme, source }: { scheme: Scheme; source: "live" | "stale" | "compiled" }) {
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
    ["OWNER", "HW TEAM"],
  ];

  const ds =
    source === "live"
      ? { led: "led bg-pass", text: "text-pass", label: "LIVE · REPO" }
      : source === "stale"
        ? { led: "led bg-warn", text: "text-warn", label: "STALE FILE IGNORED" }
        : { led: "bg-copper", text: "text-copperlt", label: "BUILT-IN SNAPSHOT" };

  return (
    <header className="relative border-b border-edge">
      <div className="mx-auto max-w-6xl px-5 pb-8 pt-10 lg:px-8 lg:pt-14">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <Reveal>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] font-medium tracking-[0.28em] text-copper">
                <span>{scheme.meta.team.toUpperCase()}</span>
                <span className="text-edge">///</span>
                <span className="text-dim">RDC 2026</span>
                <span className="text-edge">///</span>
                <span className="text-dim">HARDWARE DIVISION</span>
              </p>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="mt-4 font-display font-bold leading-[0.95] tracking-tight">
                <span className="block text-[clamp(2.6rem,7vw,4.6rem)] text-ink">PCB DESIGN</span>
                <span className="block text-[clamp(2.6rem,7vw,4.6rem)]" style={{ WebkitTextStroke: "1.5px #e0955a", color: "transparent" }}>
                  GUIDE · RDC 2026
                </span>
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-dim">
                Everything here comes from boards we actually built, the good and the ugly.{" "}
                <span className="text-pass">Green is what we recommend.</span>{" "}
                <span className="text-fail">Red is not recommended.</span> And every card explains why, so you can make
                the call yourself. Start with the requirements and work down.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <span className="border border-edge bg-panel px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] text-ink">
                  <span className="text-pass">✓ {passes}</span> RECOMMENDED
                </span>
                <span className="border border-edge bg-panel px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] text-ink">
                  <span className="text-fail">✕ {fails}</span> NOT RECOMMENDED
                </span>
                <span className="border border-edge bg-panel px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] text-ink">
                  <span className="text-copperlt">{topics}</span> TOPICS
                </span>
                <a
                  href="#spec"
                  className="group ml-1 flex items-center gap-2 border border-copper/50 bg-copper/10 px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] text-copperlt transition-colors hover:bg-copper hover:text-bg"
                >
                  REQUIREMENTS
                  <span className="transition-transform group-hover:translate-y-0.5">
                    <IcArrow size={13} className="rotate-90" />
                  </span>
                </a>
              </div>
            </Reveal>
          </div>

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
                <span className={`flex flex-1 items-center gap-1.5 px-3 py-1.5 tracking-wider ${ds.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${ds.led}`} />
                  {ds.label}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="ticker relative flex items-stretch border-t border-edge bg-panel/80">
        <div className="flex shrink-0 items-center gap-2 border-r border-edge bg-raise/70 px-4">
          <span className="led h-1.5 w-1.5 rounded-full bg-pass" />
          <span className="font-mono text-[10px] tracking-[0.26em] text-copperlt">ALL PATTERNS</span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="ticker-track items-center py-2.5">
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
      </div>
    </header>
  );
}

/* ---------------- How to read a card ---------------- */
export function GuideLegend() {
  return (
    <section className="relative border-b border-edge">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2.5 py-4">
            <span className="font-mono text-[10px] font-medium tracking-[0.28em] text-copper">HOW TO READ A CARD</span>
            <span className="flex items-center gap-2.5">
              <span className="h-3.5 w-3.5 border-2 border-pass bg-pass/15" />
              <span className="text-[12.5px] text-dim">
                <strong className="font-semibold text-pass">Green frame</strong>: we recommend it
              </span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="h-3.5 w-3.5 border-2 border-fail bg-fail/15" />
              <span className="text-[12.5px] text-dim">
                <strong className="font-semibold text-fail">Red frame</strong>: not recommended
              </span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="text-copperlt">
                <IcChevD size={14} />
              </span>
              <span className="text-[12.5px] text-dim">
                <strong className="font-semibold text-ink">WHY line</strong>: tap it for the reasoning
              </span>
            </span>
            <span className="ml-auto hidden font-mono text-[9.5px] tracking-[0.16em] text-faint lg:block">
              PHOTOS = REAL BOARDS · DRAWINGS = TEACHING ART
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Glossary ---------------- */
const TERMS: Array<{ term: string; def: string }> = [
  { term: "Trace", def: "A copper wire on the board. Wide traces carry power, thin ones carry signals." },
  { term: "Pad", def: "The copper landing spot a part gets soldered onto. Round pads have a hole, flat ones are surface mount." },
  { term: "Via", def: "A tiny plated hole that carries a connection from one layer to another." },
  { term: "Copper pour", def: "An area flooded with copper, usually ground. Free wiring, shielding and heat spreading." },
  { term: "Footprint", def: "The pattern of pads a specific component sits on. Get it wrong and the part won't fit." },
  { term: "Silkscreen", def: "The printed white text and lines, part labels, board name, logos. It's ink on top of the board." },
  { term: "Solder mask", def: "The green coating over everything except the pads. Stops solder sticking where it shouldn't." },
  { term: "Decoupling cap", def: "A small capacitor placed near a chip's power pin to smooth out sudden current draws." },
  { term: "Differential pair", def: "Two matched traces (like CAN H/L) that carry a signal as the difference between them, very noise-resistant." },
  { term: "Thermal relief", def: "Spokes of copper joining a pad to a plane, so the pad heats up evenly when you solder it." },
  { term: "Gerbers", def: "The photo files the fab uses to make each layer, plus a drill file for the holes." },
  { term: "DRC", def: "Design Rule Check. The software measures every gap and width against the fab's limits." },
];

export function Glossary() {
  return (
    <section id="glossary" className="relative border-b border-edge">
      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.28em] text-copper">NEVER TOUCHED A PCB? /// 60-SECOND GLOSSARY</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">The words we keep using</h2>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-dim">
            Everything below is explained in plain language. Skim it once and the rest of the guide will read normally.
            If a term shows up that isn't here, just ask, that's how this list grows.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {TERMS.map((t, i) => (
            <Reveal key={t.term} delay={(i % 3) * 70}>
              <div className="group h-full border border-edge bg-panel/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-copper/50">
                <h3 className="font-display text-[15px] font-bold tracking-wide text-copperlt">{t.term}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-dim">{t.def}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Spec / requirements ---------------- */
export function SpecSection({ spec }: { spec: SpecGroup[] }) {
  return (
    <section id="spec" className="relative scroll-mt-16 border-b border-edge">
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.28em] text-copper">SECTION 00 /// THE REQUIREMENTS</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">The requirements</h2>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-dim">
            This is the official requirement list, reproduced so you never have to dig up the brief. Every pattern
            further down this guide exists to satisfy one of these. Read this first, then check your board against it
            requirement by requirement.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spec.map((g, i) => (
            <Reveal key={g.id} delay={(i % 3) * 70} className="h-full">
              <div className="group flex h-full flex-col border border-edge bg-panel/80 transition-colors hover:border-copper/50">
                <div className="flex items-baseline gap-3 border-b border-edgesoft px-4 py-3">
                  <span className="font-mono text-[13px] font-semibold text-copperlt">{String(g.num).padStart(2, "0")}</span>
                  <h3 className="font-display text-[15px] font-bold tracking-wide text-ink">{g.title}</h3>
                </div>
                <ul className="flex-1 space-y-2 px-4 py-3.5">
                  {g.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[13px] leading-relaxed text-dim">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-copper/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
