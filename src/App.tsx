import { useEffect, useMemo, useState } from "react";
import type { Scheme } from "./types";
import { DEFAULT_SCHEME } from "./data/scheme";
import { fetchCommittedScheme, revRank, stripEmDashes } from "./store";
import { CircuitBackground, Reveal } from "./components/primitives";
import { TitleBlock, GuideLegend, Glossary, SpecSection } from "./components/sections";
import { CategoryNav, CategorySection, Checklist, Readings, type VerdictFilter } from "./components/browser";

type Source = "live" | "stale" | "compiled";

export default function App() {
  const [scheme, setScheme] = useState<Scheme>(() => stripEmDashes(structuredClone(DEFAULT_SCHEME)));
  const [source, setSource] = useState<Source>("compiled");
  const [active, setActive] = useState("all");
  const [verdict, setVerdict] = useState<VerdictFilter>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchCommittedScheme().then((committed) => {
      if (cancelled || !committed) return;
      if (revRank(committed.meta.rev) >= revRank(DEFAULT_SCHEME.meta.rev)) {
        setScheme(committed);
        setSource("live");
      } else {
        setSource("stale");
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleCategories = useMemo(() => scheme.categories.filter((c) => !c.hidden), [scheme]);

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visibleCategories
      .map((c) => ({
        ...c,
        examples: c.examples.filter((e) => {
          if (e.hidden) return false;
          if (verdict !== "all" && e.verdict !== verdict) return false;
          if (active !== "all" && c.id !== active) return false;
          if (!q) return true;
          const hay = `${e.title} ${e.description} ${e.reason} ${e.tags.join(" ")} ${c.name}`.toLowerCase();
          return hay.includes(q);
        }),
      }))
      .filter((c) => c.examples.length > 0 || active === "all");
  }, [visibleCategories, verdict, active, query]);

  const shownSpec = scheme.spec ?? [];

  return (
    <div className="relative min-h-screen">
      <CircuitBackground />

      <TitleBlock scheme={scheme} source={source} />
      <GuideLegend />
      <Glossary />

      {shownSpec.length > 0 && <SpecSection spec={shownSpec} />}

      <CategoryNav
        categories={visibleCategories}
        active={active}
        onActive={setActive}
        verdict={verdict}
        onVerdict={setVerdict}
        query={query}
        onQuery={setQuery}
      />

      <main className="mx-auto max-w-6xl px-5 lg:px-8">
        {filteredCategories.length === 0 ? (
          <div className="border border-dashed border-edge py-24 text-center">
            <p className="font-mono text-[12px] tracking-[0.22em] text-faint">NOTHING MATCHES THAT, TRY ANOTHER WORD</p>
          </div>
        ) : (
          filteredCategories.map((c, i) => <CategorySection key={c.id} category={c} index={i} />)
        )}
      </main>

      <Checklist items={scheme.checklist} />
      <Readings groups={scheme.readings ?? []} />

      <footer className="border-t border-edge">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-6 lg:px-8">
          <span className="font-mono text-[10.5px] tracking-[0.18em] text-copper/80">
            {scheme.meta.doc} · REV {scheme.meta.rev} · {scheme.meta.team.toUpperCase()}
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
