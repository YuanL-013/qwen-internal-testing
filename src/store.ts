import { DEFAULT_SCHEME } from "./data/scheme";
import type { Scheme } from "./types";

const KEY_CHECKS = "pcb-guide-checks-v1";

/* ---------------- scheme content ----------------
   The guide is data. Reviewers with repo collaborator access edit
   public/data/scheme.json directly on GitHub; Pages redeploys and every
   visitor reads the same file. The compiled DEFAULT_SCHEME is only a
   fallback for previews where the JSON is unreachable. */

function normalizeScheme(raw: unknown): Scheme {
  const base = structuredClone(DEFAULT_SCHEME);
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<Scheme>;
  return {
    meta: { ...base.meta, ...(r.meta ?? {}) },
    categories: Array.isArray(r.categories)
      ? (r.categories as Scheme["categories"]).map((c) => ({
          ...c,
          examples: Array.isArray(c.examples)
            ? c.examples.map((e) => ({
                ...e,
                tags: Array.isArray(e.tags) ? e.tags : [],
                verdict: e.verdict === "pass" ? ("pass" as const) : ("fail" as const),
              }))
            : [],
        }))
      : base.categories,
    checklist: Array.isArray(r.checklist) && r.checklist.length ? (r.checklist as string[]) : base.checklist,
  };
}

/** Rank a document revision so builds can ignore stale data files ("A" < "B" < …; "C2" supported). */
export function revRank(rev: string): number {
  const v = (rev ?? "").trim().toUpperCase();
  const m = /^([A-Z])(\d*)$/.exec(v);
  if (m) return (m[1].charCodeAt(0) - 64) * 1000 + (m[2] ? parseInt(m[2], 10) : 0);
  return v.length ? v.charCodeAt(0) : 0;
}

export async function fetchCommittedScheme(): Promise<Scheme | null> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}data/scheme.json`, { cache: "no-store" });
    if (!res.ok) return null;
    return normalizeScheme(await res.json());
  } catch {
    return null;
  }
}

/* ---------------- trainee checklist (local only) ---------------- */

export function loadChecks(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(KEY_CHECKS) ?? "{}");
  } catch {
    return {};
  }
}

export function saveChecks(v: Record<string, boolean>): void {
  localStorage.setItem(KEY_CHECKS, JSON.stringify(v));
}
