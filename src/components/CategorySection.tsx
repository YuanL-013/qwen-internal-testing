import type { Category } from "../types";
import ExampleCard from "./ExampleCard";
import Reveal from "./Reveal";

export default function CategorySection({ category, index }: { category: Category; index: number }) {
  const passes = category.examples.filter((e) => e.verdict === "pass").length;
  const fails = category.examples.length - passes;

  return (
    <section id={`cat-${category.id}`} className="relative border-b border-edgesoft py-12 lg:py-16">
      <Reveal>
        <p className="mb-4 flex items-center gap-3 font-mono text-[10.5px] tracking-[0.28em] text-faint">
          <span className="border border-edge bg-panel/70 px-2 py-0.5 text-copperlt">
            SECTION {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-edgesoft" />
        </p>
      </Reveal>

      <div className="relative z-10">
        <Reveal>
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

        {category.examples.length === 0 ? (
          <div className="mt-8 border border-dashed border-edge py-14 text-center">
            <p className="font-mono text-[11px] tracking-[0.22em] text-faint">
              NOTHING HERE YET
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {category.examples.map((ex, i) => (
              <ExampleCard
                key={ex.id}
                example={ex}
                code={category.code}
                index={i}
                delay={(i % 2) * 90}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
