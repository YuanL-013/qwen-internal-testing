import { useEffect, useState, type ReactNode } from "react";
import type { Category, Example, Verdict, ReadingGroup } from "../types";
import { DIAGRAMS, RedTone } from "./Diagrams";
import { Reveal, IcChevD, IcSearch, IcX, IcCheck, IcReset, IcLink, IcChip } from "./primitives";
import { loadChecks, saveChecks } from "../store";

export type VerdictFilter = "all" | Verdict;

/* ---------------- Category nav + filters + search ---------------- */
export function CategoryNav({
  categories,
  active,
  onActive,
  verdict,
  onVerdict,
  query,
  onQuery,
}: {
  categories: Category[];
  active: string;
  onActive: (id: string) => void;
  verdict: VerdictFilter;
  onVerdict: (v: VerdictFilter) => void;
  query: string;
  onQuery: (q: string) => void;
}) {
  const tab = (id: string, label: string) => (
    <button
      key={id}
      onClick={() => onActive(id)}
      className={`relative border px-3 py-2 font-mono text-[11.5px] tracking-[0.14em] transition-all ${
        active === id
          ? "border-copper bg-copper text-bg"
          : "border-edge bg-panel/60 text-dim hover:border-copper/50 hover:text-copperlt"
      }`}
    >
      {label}
    </button>
  );

  const vBtn = (v: VerdictFilter, label: ReactNode, tone?: string) => (
    <button
      key={v}
      onClick={() => onVerdict(v)}
      className={`px-3 py-2 font-mono text-[11.5px] tracking-[0.14em] transition-colors ${
        verdict === v ? tone ?? "bg-raise text-ink" : "text-faint hover:text-ink"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="sticky top-0 z-40 border-b border-edge bg-bg/95 backdrop-blur-sm" id="standard">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 lg:px-8">
        <div className="flex flex-wrap items-center gap-1.5">
          {tab("all", "ALL")}
          {categories.map((c) => tab(c.id, c.code))}
        </div>

        <div className="flex items-center border border-edge">
          {vBtn("all", "ALL")}
          {vBtn("pass", <>✓<span className="hidden md:inline">&nbsp;RECOMMENDED</span></>, "bg-pass/20 text-pass")}
          {vBtn("fail", <>✕<span className="hidden md:inline">&nbsp;NOT&nbsp;REC.</span></>, "bg-fail/20 text-fail")}
        </div>

        <div className="relative ml-auto w-full min-w-[200px] sm:w-64">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint">
            <IcSearch size={14} />
          </span>
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Try 'via', 'silk' or 'CAN'…"
            className="w-full border border-edge bg-panel py-2 pl-9 pr-8 text-[13px] text-ink placeholder:text-faint transition-colors focus:border-copper focus:outline-none"
          />
          {query && (
            <button onClick={() => onQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-faint hover:text-ink" aria-label="Clear search">
              <IcX size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Finding card ---------------- */
export function ExampleCard({
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
  const [open, setOpen] = useState(false);
  const pass = example.verdict === "pass";
  const Diagram = example.diagram ? DIAGRAMS[example.diagram] : null;

  return (
    <Reveal delay={delay} className="h-full">
      <article
        className={`group relative flex h-full flex-col border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 ${
          pass ? "border-passdim/60 bg-panel/80 hover:border-pass/60" : "border-faildim/60 bg-paneled/80 hover:border-fail/60"
        }`}
      >
        <div className="relative p-3 pb-0">
          {Diagram ? (
            pass ? <Diagram /> : <RedTone><Diagram /></RedTone>
          ) : (
            <div className="flex items-center justify-center border border-edgesoft bg-bg py-10 text-faint">
              <IcChip size={26} />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4 pt-3.5">
          <span className="font-mono text-[10px] tracking-[0.2em] text-faint">
            {code}-{String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-2 font-display text-[17px] font-bold leading-snug tracking-wide text-ink">{example.title}</h3>
          <p className="mt-1.5 text-[13.5px] leading-[1.65] text-dim">{example.description}</p>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className={`mt-3 flex w-full items-center justify-between gap-2 border-l-2 py-1.5 pl-3 text-left transition-colors ${
              pass ? "border-pass/60 hover:bg-pass/5" : "border-fail/60 hover:bg-fail/5"
            }`}
          >
            <span className={`font-mono text-[9.5px] tracking-[0.24em] ${pass ? "text-pass/80" : "text-fail/80"}`}>
              {pass ? "WHY IT'S RECOMMENDED" : "WHY IT'S NOT"}
            </span>
            <span className={`transition-transform duration-300 ${open ? "rotate-180" : ""} text-faint`}>
              <IcChevD size={13} />
            </span>
          </button>
          <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
            <div className="overflow-hidden">
              <p className={`border-l-2 py-2.5 pl-3 text-[13px] leading-[1.7] text-ink/85 ${pass ? "border-pass/40 bg-pass/[0.04]" : "border-fail/40 bg-fail/[0.04]"}`}>
                {example.reason}
              </p>
            </div>
          </div>

          {example.tags.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1.5 pt-2.5">
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

/* ---------------- Category section ---------------- */
export function CategorySection({ category, index }: { category: Category; index: number }) {
  const passes = category.examples.filter((e) => e.verdict === "pass").length;
  const fails = category.examples.length - passes;

  return (
    <section id={`cat-${category.id}`} className="relative scroll-mt-20 border-b border-edgesoft py-12 lg:py-16">
      <div className="relative z-10">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 font-mono text-[10.5px] tracking-[0.3em] text-faint">
            <span className="border border-edge bg-panel/70 px-2 py-0.5 text-copperlt">SECTION {String(index + 1).padStart(2, "0")}</span>
            <span className="h-px flex-1 bg-edgesoft" />
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="border border-copper/60 bg-copper/10 px-2.5 py-1 font-mono text-[12px] font-semibold tracking-[0.24em] text-copperlt">
              {category.code}
            </span>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">{category.name}</h2>
            <span className="font-mono text-[10.5px] tracking-[0.18em] text-faint">
              {category.examples.length} PATTERNS · <span className="text-pass/80">{passes} ✓</span>{" "}
              <span className="text-fail/80">{fails} ✕</span>
            </span>
          </div>
          <p className="mt-2.5 max-w-2xl text-[14px] leading-relaxed text-dim">{category.blurb}</p>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {category.examples.map((ex, i) => (
            <ExampleCard key={ex.id} example={ex} code={category.code} index={i} delay={(i % 2) * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Pre-flight checklist ---------------- */
export function Checklist({ items }: { items: string[] }) {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  useEffect(() => {
    setChecks(loadChecks());
  }, []);

  const toggle = (item: string) => {
    setChecks((prev) => {
      const next = { ...prev, [item]: !prev[item] };
      saveChecks(next);
      return next;
    });
  };

  const done = items.filter((i) => checks[i]).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;
  const allDone = items.length > 0 && done === items.length;

  return (
    <section className="relative border-b border-edge">
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.28em] text-copper">PRE-FLIGHT /// BEFORE THE FAB</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">Self-check before you submit</h2>
              <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-dim">
                This is the same list the team runs before any board ships. Tick every box against your own layout.
                Your progress is saved in this browser only. A board that goes out green rarely comes back.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-8 border border-edge bg-panel/80 p-5">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[11px] tracking-[0.22em] text-dim">READINESS</span>
                  <span className={`font-display text-3xl font-bold ${allDone ? "text-pass" : "text-copperlt"}`}>
                    {pct}<span className="text-lg">%</span>
                  </span>
                </div>
                <div className="mt-3 h-2.5 w-full border border-edge bg-bg">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: allDone ? "#55d78e" : "linear-gradient(90deg, #e0955a, #f6c489)" }}
                  />
                </div>
                <p className="mt-2 font-mono text-[10.5px] tracking-[0.18em] text-faint">{done} / {items.length} CHECKS GREEN</p>
                <p className={`mt-4 border px-3 py-2.5 font-mono text-[11px] leading-relaxed tracking-[0.12em] transition-colors ${allDone ? "border-pass/50 bg-pass/10 text-pass" : "border-edge text-dim"}`}>
                  {allDone
                    ? "ALL CHECKS GREEN, THIS BOARD IS READY TO SHIP."
                    : done === 0
                      ? "NOTHING CHECKED YET, WALK THE BOARD TOP TO BOTTOM."
                      : "KEEP GOING, REVIEWERS WILL FIND WHAT YOU SKIPPED."}
                </p>
                {done > 0 && (
                  <button
                    onClick={() => { setChecks({}); saveChecks({}); }}
                    className="mt-3 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-faint hover:text-fail"
                  >
                    <IcReset size={12} /> RESET CHECKS
                  </button>
                )}
              </div>
            </Reveal>
          </div>

          <Reveal delay={90}>
            <ol className="divide-y divide-edgesoft border border-edge bg-panel/70">
              {items.map((item, i) => (
                <li key={item}>
                  <button onClick={() => toggle(item)} className="group flex w-full items-center gap-3.5 px-4 py-3 text-left transition-colors hover:bg-raise/50">
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-all ${checks[item] ? "border-pass bg-pass/20 text-pass" : "border-edge text-transparent group-hover:border-copper/60"}`}>
                      <IcCheck size={12} />
                    </span>
                    <span className="font-mono text-[10px] text-faint">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`text-[13.5px] leading-relaxed transition-all ${checks[item] ? "text-faint line-through decoration-pass/50" : "text-ink/90"}`}>
                      {item}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Further reading ---------------- */
export function Readings({ groups }: { groups: ReadingGroup[] }) {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.28em] text-copper">GO DEEPER /// WHERE THE RULES COME FROM</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">Further reading</h2>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-dim">
            The conventions in this guide didn't come from nowhere. These are the references the team keeps coming back
            to, grouped by where you are in your journey.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {groups.map((g, gi) => (
            <Reveal key={g.group} delay={gi * 90} className="h-full">
              <div className="flex h-full flex-col border border-edge bg-panel/80">
                <div className="border-b border-edgesoft px-4 py-3">
                  <h3 className="font-display text-[15px] font-bold tracking-wide text-copperlt">{g.group}</h3>
                </div>
                <ul className="flex-1 divide-y divide-edgesoft">
                  {g.links.map((l) => (
                    <li key={l.title}>
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="group block px-4 py-3.5 transition-colors hover:bg-raise/60">
                        <div className="flex items-center gap-2">
                          <span className="text-copper transition-transform group-hover:translate-x-0.5">
                            <IcLink size={14} />
                          </span>
                          <span className="font-medium text-[13.5px] text-ink group-hover:text-copperlt transition-colors">{l.title}</span>
                          {l.tag && (
                            <span className="ml-auto border border-edgesoft px-1.5 py-0.5 font-mono text-[9px] tracking-[0.14em] text-faint">{l.tag}</span>
                          )}
                        </div>
                        {l.note && <p className="mt-1.5 pl-6 text-[12px] leading-relaxed text-dim">{l.note}</p>}
                      </a>
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
