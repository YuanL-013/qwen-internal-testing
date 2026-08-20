import type { Category, Example } from "../types";
import ExampleCard from "./ExampleCard";
import Reveal from "./Reveal";
import { IcChevD, IcChevU, IcPencil, IcPlus, IcTrash } from "./Icons";

export default function CategorySection({
  category,
  index,
  editable,
  canUp,
  canDown,
  onMove,
  onAddExample,
  onEditCategory,
  onDeleteCategory,
  onEditExample,
  onDeleteExample,
}: {
  category: Category;
  index: number;
  editable: boolean;
  canUp: boolean;
  canDown: boolean;
  onMove: (dir: -1 | 1) => void;
  onAddExample: () => void;
  onEditCategory: () => void;
  onDeleteCategory: () => void;
  onEditExample: (ex: Example) => void;
  onDeleteExample: (ex: Example) => void;
}) {
  const passes = category.examples.filter((e) => e.verdict === "pass").length;
  const fails = category.examples.length - passes;

  const smallBtn =
    "flex items-center gap-1 border border-edge bg-panel px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-dim transition-colors";

  return (
    <section id={`cat-${category.id}`} className="relative border-b border-edgesoft py-12 lg:py-16">
      <span
        aria-hidden
        className="pointer-events-none absolute right-2 top-6 select-none font-display text-[7rem] font-bold leading-none text-raise lg:text-[9rem]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative">
        <Reveal>
          <div className="flex flex-wrap items-start gap-x-5 gap-y-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="border border-copper/60 bg-copper/10 px-2.5 py-1 font-mono text-[12px] font-semibold tracking-[0.24em] text-copperlt">
                  {category.code}
                </span>
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">{category.name}</h2>
                <span className="font-mono text-[10.5px] tracking-[0.18em] text-faint">
                  {category.examples.length} FINDINGS · <span className="text-pass/80">{passes} ✓</span>{" "}
                  <span className="text-fail/80">{fails} ✕</span>
                </span>
              </div>
              <p className="mt-2.5 max-w-2xl text-[14px] leading-relaxed text-dim">{category.blurb}</p>
            </div>

            {editable && (
              <div className="flex flex-wrap items-center gap-1.5 lg:ml-auto">
                <button onClick={() => onMove(-1)} disabled={!canUp} className={`${smallBtn} disabled:opacity-30`} title="Move up">
                  <IcChevU size={12} />
                </button>
                <button onClick={() => onMove(1)} disabled={!canDown} className={`${smallBtn} disabled:opacity-30`} title="Move down">
                  <IcChevD size={12} />
                </button>
                <button onClick={onEditCategory} className={`${smallBtn} hover:border-copper hover:text-copperlt`}>
                  <IcPencil size={12} /> EDIT
                </button>
                <button onClick={onDeleteCategory} className={`${smallBtn} hover:border-fail hover:text-fail`}>
                  <IcTrash size={12} /> DELETE
                </button>
                <button
                  onClick={onAddExample}
                  className="flex items-center gap-1.5 border border-copper bg-copper/15 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-copperlt transition-colors hover:bg-copper hover:text-bg"
                >
                  <IcPlus size={12} /> FINDING
                </button>
              </div>
            )}
          </div>
        </Reveal>

        {category.examples.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-3 border border-dashed border-edge py-14 text-center">
            <p className="font-mono text-[11px] tracking-[0.22em] text-faint">NO FINDINGS DOCUMENTED YET</p>
            {editable && (
              <button
                onClick={onAddExample}
                className="flex items-center gap-1.5 border border-copper px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] text-copperlt hover:bg-copper hover:text-bg transition-colors"
              >
                <IcPlus size={13} /> ADD THE FIRST FINDING
              </button>
            )}
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {category.examples.map((ex, i) => (
              <ExampleCard
                key={ex.id}
                example={ex}
                code={category.code}
                index={i}
                editable={editable}
                delay={(i % 2) * 90}
                onEdit={() => onEditExample(ex)}
                onDelete={() => onDeleteExample(ex)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
