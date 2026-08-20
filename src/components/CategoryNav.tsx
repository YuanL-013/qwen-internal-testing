import type { Category, Verdict } from "../types";
import { IcPlus, IcSearch, IcX } from "./Icons";

export type VerdictFilter = "all" | Verdict;

export default function CategoryNav({
  categories,
  active,
  onActive,
  verdict,
  onVerdict,
  query,
  onQuery,
  editMode,
  onAddCategory,
}: {
  categories: Category[];
  active: string;
  onActive: (id: string) => void;
  verdict: VerdictFilter;
  onVerdict: (v: VerdictFilter) => void;
  query: string;
  onQuery: (q: string) => void;
  editMode: boolean;
  onAddCategory: () => void;
}) {
  const tab = (id: string, label: string) => (
    <button
      key={id}
      onClick={() => onActive(id)}
      className={`relative border px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] transition-all ${
        active === id
          ? "border-copper bg-copper text-bg"
          : "border-edge bg-panel/60 text-dim hover:border-copper/50 hover:text-copperlt"
      }`}
    >
      {label}
    </button>
  );

  const vBtn = (v: VerdictFilter, label: string, tone?: string) => (
    <button
      key={v}
      onClick={() => onVerdict(v)}
      className={`px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] transition-colors ${
        verdict === v ? tone ?? "bg-raise text-ink" : "text-faint hover:text-ink"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className={`sticky z-40 border-b border-edge bg-bg/95 backdrop-blur-sm ${editMode ? "top-12" : "top-0"}`}
      id="standard"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 lg:px-8">
        <div className="flex flex-wrap items-center gap-1.5">
          {tab("all", "ALL")}
          {categories.map((c) => tab(c.id, c.code))}
          {editMode && (
            <button
              onClick={onAddCategory}
              className="flex items-center gap-1 border border-dashed border-copper/50 px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] text-copper transition-colors hover:bg-copper/10"
            >
              <IcPlus size={12} /> CATEGORY
            </button>
          )}
        </div>

        <div className="flex items-center border border-edge">
          {vBtn("all", "ALL")}
          {vBtn("pass", "✓ APPROVED", "bg-pass/20 text-pass")}
          {vBtn("fail", "✕ NOT OKAY", "bg-fail/20 text-fail")}
        </div>

        <div className="relative ml-auto w-full min-w-[200px] sm:w-64">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint">
            <IcSearch size={14} />
          </span>
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search findings, reasons, tags…"
            className="w-full border border-edge bg-panel py-1.5 pl-9 pr-8 text-[13px] text-ink placeholder:text-faint focus:border-copper focus:outline-none transition-colors"
          />
          {query && (
            <button
              onClick={() => onQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-faint hover:text-ink"
              aria-label="Clear search"
            >
              <IcX size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
