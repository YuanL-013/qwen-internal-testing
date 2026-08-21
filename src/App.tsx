import { useEffect, useMemo, useState } from "react";
import type { Scheme } from "./types";
import { DEFAULT_SCHEME } from "./data/scheme";
import { fetchCommittedScheme, revRank } from "./store";
import CircuitBackground from "./components/CircuitBackground";
import TitleBlock, { TitleBlockSkeleton } from "./components/TitleBlock";
import GuideLegend from "./components/GuideLegend";
import CategoryNav, { type VerdictFilter } from "./components/CategoryNav";
import CategorySection from "./components/CategorySection";
import Checklist from "./components/Checklist";
import Readings from "./components/Readings";

import Reveal from "./components/Reveal";
import { IcSearch } from "./components/Icons";

export default function App() {
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [source, setSource] = useState<"live" | "stale" | "compiled">("compiled");
  const [active, setActive] = useState("all");
  const [verdict, setVerdict] = useState<VerdictFilter>("all");
  const [query, setQuery] = useState("");

  /* The guide is committed data: public/data/scheme.json. The data file is
     used only when its revision is strictly newer than the one compiled into
     this build — a stale file (old deploy, old commit) can never mask the
     fresher built-in content. */
  useEffect(() => {
    let cancelled = false;
    fetchCommittedScheme().then((committed) => {
      if (cancelled) return;
      if (committed && revRank(committed.meta.rev) >= revRank(DEFAULT_SCHEME.meta.rev)) {
        // Data file is current (or ahead) of this build — use it.
        setScheme(committed);
        setSource("live");
      } else {
        // Data file is older than the build (or missing) — fall back to the
        // compiled copy so a stale file can never mask newer content.
        if (committed) setSource("stale");
        setScheme(structuredClone(DEFAULT_SCHEME));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /* keep active tab valid */
  useEffect(() => {
    if (scheme && active !== "all" && !scheme.categories.some((c) => !c.hidden && c.id === active)) setActive("all");
  }, [scheme, active]);

  const visible = useMemo(() => {
    if (!scheme) return [];
    const q = query.trim().toLowerCase();
    return scheme.categories
      .filter((c) => !c.hidden)
      .filter((c) => active === "all" || c.id === active)
      .map((c) => ({
        ...c,
        examples: c.examples.filter(
          (e) =>
            !e.hidden &&
            (verdict === "all" || e.verdict === verdict) &&
            (!q ||
              [e.title, e.description, e.reason, c.name, c.code, ...e.tags].join(" ").toLowerCase().includes(q))
        ),
      }));
  }, [scheme, active, verdict, query]);

  const shownCount = visible.reduce((n, c) => n + c.examples.length, 0);

  if (!scheme) {
    return (
      <div className="relative min-h-screen">
        <CircuitBackground />
        <TitleBlockSkeleton />
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="space-y-5 py-10">
            {[92, 78, 85, 60].map((w, i) => (
              <div key={i} className="h-24 animate-pulse border border-edgesoft bg-panel/60" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <CircuitBackground />

      <TitleBlock scheme={scheme} source={source} />

      <GuideLegend />

      <CategoryNav
        categories={scheme.categories.filter((c) => !c.hidden)}
        active={active}
        onActive={setActive}
        verdict={verdict}
        onVerdict={setVerdict}
        query={query}
        onQuery={setQuery}
      />

      <main className="mx-auto max-w-6xl px-5 lg:px-8">
        {shownCount === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <span className="text-faint">
              <IcSearch size={30} />
            </span>
            <p className="font-mono text-[12px] tracking-[0.22em] text-dim">
              NOTHING MATCHES {query ? `“${query.toUpperCase()}”` : "THAT FILTER"}
            </p>
            <button
              onClick={() => {
                setQuery("");
                setVerdict("all");
                setActive("all");
              }}
              className="border border-copper/50 px-4 py-2 font-mono text-[11px] tracking-[0.18em] text-copperlt transition-colors hover:bg-copper hover:text-bg"
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          visible.map((c, i) => <CategorySection key={c.id} category={c} index={i} />)
        )}
      </main>

      <Checklist items={scheme.checklist} />

      <Readings groups={scheme.readings ?? []} />

      <footer className="border-t border-edge">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-5 py-8 lg:px-8">
          <div className="flex items-center gap-2.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e0955a" strokeWidth="1.8" aria-hidden>
              <rect x="7" y="7" width="10" height="10" rx="1.5" />
              <rect x="10.2" y="10.2" width="3.6" height="3.6" />
              <path d="M9.5 7V3.5M14.5 7V3.5M9.5 20.5V17M14.5 20.5V17M7 9.5H3.5M7 14.5H3.5M20.5 9.5H17M20.5 14.5H17" strokeLinecap="round" />
            </svg>
            <span className="font-display text-sm font-bold tracking-wide text-ink">
              {scheme.meta.team.toUpperCase()} · HW DIVISION
            </span>
          </div>
          <span className="font-mono text-[10.5px] tracking-[0.18em] text-faint">
            {scheme.meta.doc} · REV {scheme.meta.rev} · UPDATED {scheme.meta.updated.toUpperCase()}
          </span>
          <Reveal className="ml-auto">
            <span className="font-mono text-[10px] tracking-[0.18em] text-faint">
              MAINTAINED BY <span className="text-copper/70">{(scheme.meta.maintainer ?? "THE TEAM").toUpperCase()}</span>
            </span>
          </Reveal>
        </div>
      </footer>
    </div>
  );
}
