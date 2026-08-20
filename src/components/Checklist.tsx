import { useEffect, useState } from "react";
import { loadChecks, saveChecks } from "../store";
import { IcCheck, IcPlus, IcReset, IcTrash } from "./Icons";
import Reveal from "./Reveal";

export default function Checklist({
  items,
  editMode,
  onItemsChange,
}: {
  items: string[];
  editMode: boolean;
  onItemsChange: (items: string[]) => void;
}) {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState("");

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
    <section className="relative">
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.28em] text-copper">SECTION 07 /// PRE-FLIGHT</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Self-check before you submit
              </h2>
              <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-dim">
Reviewers score exactly what is below, in order. Tick every box against your own layout — progress is
saved in this browser. A board that ships with every check green rarely loses more than a few points.              </p>
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
                    style={{
                      width: `${pct}%`,
                      background: allDone ? "#55d78e" : "linear-gradient(90deg, #e0955a, #f6c489)",
                    }}
                  />
                </div>
                <p className="mt-2 font-mono text-[10.5px] tracking-[0.18em] text-faint">
                  {done} / {items.length} CHECKS GREEN
                </p>
                <p
                  className={`mt-4 border px-3 py-2.5 font-mono text-[11px] leading-relaxed tracking-[0.12em] transition-colors ${
                    allDone ? "border-pass/50 bg-pass/10 text-pass" : "border-edge text-dim"
                  }`}
                >
                  {allDone
                    ? "ALL CHECKS GREEN — THIS BOARD IS READY TO SHIP."
                    : done === 0
                      ? "NOTHING CHECKED YET — WALK THE BOARD, TOP TO BOTTOM."
                      : "KEEP GOING — REVIEWERS WILL FIND WHAT YOU SKIPPED."}
                </p>
                {done > 0 && (
                  <button
                    onClick={() => {
                      setChecks({});
                      saveChecks({});
                    }}
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
                  {editMode ? (
                    <div className="flex items-center gap-2 px-4 py-3">
                      <span className="font-mono text-[10px] text-faint">{String(i + 1).padStart(2, "0")}</span>
                      <input
                        value={item}
                        onChange={(e) => {
                          const next = [...items];
                          next[i] = e.target.value;
                          onItemsChange(next);
                        }}
                        className="min-w-0 flex-1 border border-transparent bg-transparent px-2 py-1 text-[13.5px] text-ink focus:border-copper focus:outline-none"
                      />
                      <button
                        onClick={() => onItemsChange(items.filter((_, j) => j !== i))}
                        className="text-faint hover:text-fail"
                        aria-label="Remove item"
                      >
                        <IcTrash size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggle(item)}
                      className="group flex w-full items-center gap-3.5 px-4 py-3 text-left transition-colors hover:bg-raise/50"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-all ${
                          checks[item] ? "border-pass bg-pass/20 text-pass" : "border-edge text-transparent group-hover:border-copper/60"
                        }`}
                      >
                        <IcCheck size={12} />
                      </span>
                      <span className="font-mono text-[10px] text-faint">{String(i + 1).padStart(2, "0")}</span>
                      <span
                        className={`text-[13.5px] leading-relaxed transition-all ${
                          checks[item] ? "text-faint line-through decoration-pass/50" : "text-ink/90"
                        }`}
                      >
                        {item}
                      </span>
                    </button>
                  )}
                </li>
              ))}
              {editMode && (
                <li className="flex items-center gap-2 px-4 py-3">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && draft.trim()) {
                        onItemsChange([...items, draft.trim()]);
                        setDraft("");
                      }
                    }}
                    placeholder="New check item…"
                    className="min-w-0 flex-1 border border-transparent bg-transparent px-2 py-1 text-[13.5px] text-ink placeholder:text-faint focus:border-copper focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (draft.trim()) {
                        onItemsChange([...items, draft.trim()]);
                        setDraft("");
                      }
                    }}
                    className="flex items-center gap-1 font-mono text-[10px] tracking-[0.16em] text-copper hover:text-copperlt"
                  >
                    <IcPlus size={12} /> ADD
                  </button>
                </li>
              )}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
