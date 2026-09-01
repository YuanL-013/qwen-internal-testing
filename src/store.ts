import { DEFAULT_SCHEME } from "./data/scheme";
import type { Scheme } from "./types";

const KEY_CHECKS = "pcb-guide-checks-v1";

/** Recursively strip em dashes out of any text so the site always reads dash-free. */
export function stripEmDashes<T>(v: T): T {
  if (typeof v === "string")
    return v
      .replace(/\s+—\s+/g, ", ")
      .replace(/—/g, ", ")
      .replace(/,\s*,+/g, ",")
      .replace(/\s{2,}/g, " ") as T;
  if (Array.isArray(v)) return v.map(stripEmDashes) as T;
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v as Record<string, unknown>)) out[k] = stripEmDashes((v as Record<string, unknown>)[k]);
    return out as T;
  }
  return v;
}

function normalizeScheme(raw: unknown): Scheme {
  const base = structuredClone(DEFAULT_SCHEME);
  if (!raw || typeof raw !== "object") return stripEmDashes(base);
  const r = raw as Partial<Scheme>;
  return stripEmDashes({
    meta: { ...base.meta, ...(r.meta ?? {}) },
    spec: Array.isArray(r.spec) && r.spec.length ? (r.spec as Scheme["spec"]) : base.spec,
    categories: Array.isArray(r.categories)
      ? (r.categories as Scheme["categories"]).map((c) => ({
          ...c,
          hidden: c.hidden === true,
          examples: Array.isArray(c.examples)
            ? c.examples.map((e) => ({
                ...e,
                tags: Array.isArray(e.tags) ? e.tags : [],
                verdict: e.verdict === "pass" ? ("pass" as const) : ("fail" as const),
                hidden: e.hidden === true,
              }))
            : [],
        }))
      : base.categories,
    checklist: Array.isArray(r.checklist) && r.checklist.length ? (r.checklist as string[]) : base.checklist,
    readings: Array.isArray(r.readings) && r.readings.length ? (r.readings as Scheme["readings"]) : base.readings,
  });
}

/** Rank a document revision so builds can ignore stale data files. */
export function revRank(rev: string): number {
  const v = (rev ?? "").trim().toUpperCase();
  const m = /^([A-Z])(\d*)$/.exec(v);
  if (m) return (m[1].charCodeAt(0) - 64) * 1000 + (m[2] ? parseInt(m[2], 10) : 0);
  return v.length ? v.charCodeAt(0) : 0;
}

export async function fetchCommittedScheme(): Promise<Scheme | null> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}data/scheme.json?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    return normalizeScheme(await res.json());
  } catch {
    return null;
  }
}

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
