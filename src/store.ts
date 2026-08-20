import { DEFAULT_SCHEME } from "./data/scheme";
import type { Scheme } from "./types";

const KEY_SCHEME = "pcb-ms-scheme-v1";
const KEY_PASS = "pcb-ms-pass-v1";
const KEY_ADMIN = "pcb-ms-admin-v1";
const KEY_CHECKS = "pcb-ms-checks-v1";

/** Demo passcode — reviewers should change it on first sign-in. */
export const DEFAULT_PASSCODE = "SOLDER-01";

export function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

/* ---------------- passcode (client-side, nominal) ---------------- */

function hashPass(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (((h << 5) + h) ^ s.charCodeAt(i)) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

export function getPassHash(): string {
  const stored = localStorage.getItem(KEY_PASS);
  if (stored) return stored;
  const fresh = hashPass(DEFAULT_PASSCODE);
  localStorage.setItem(KEY_PASS, fresh);
  return fresh;
}

export function verifyPasscode(input: string): boolean {
  return hashPass(input.trim()) === getPassHash();
}

export function setPasscode(next: string): void {
  localStorage.setItem(KEY_PASS, hashPass(next));
}

export function passcodeIsDefault(): boolean {
  return getPassHash() === hashPass(DEFAULT_PASSCODE);
}

/* ---------------- admin session ---------------- */

export function isAdminSession(): boolean {
  return sessionStorage.getItem(KEY_ADMIN) === "1";
}
export function startAdminSession(): void {
  sessionStorage.setItem(KEY_ADMIN, "1");
}
export function endAdminSession(): void {
  sessionStorage.removeItem(KEY_ADMIN);
}

/* ---------------- scheme persistence ---------------- */

function normalizeScheme(raw: unknown): Scheme {
  const base = structuredClone(DEFAULT_SCHEME);
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<Scheme>;
  return {
    meta: { ...base.meta, ...(r.meta ?? {}) },
    categories: Array.isArray(r.categories) ? (r.categories as Scheme["categories"]) : base.categories,
    checklist: Array.isArray(r.checklist) && r.checklist.length ? (r.checklist as string[]) : base.checklist,
  };
}

export function loadStoredScheme(): Scheme | null {
  try {
    const raw = localStorage.getItem(KEY_SCHEME);
    if (!raw) return null;
    return normalizeScheme(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveScheme(s: Scheme): { ok: boolean; error?: string } {
  try {
    localStorage.setItem(KEY_SCHEME, JSON.stringify(s));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "storage full" };
  }
}

export function clearStoredScheme(): void {
  localStorage.removeItem(KEY_SCHEME);
}

/** Try to load a committed scheme.json (for GitHub Pages deployments). */
export async function fetchCommittedScheme(): Promise<Scheme | null> {
  try {
    const res = await fetch("data/scheme.json", { cache: "no-store" });
    if (!res.ok) return null;
    return normalizeScheme(await res.json());
  } catch {
    return null;
  }
}

/* ---------------- checklist persistence ---------------- */

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

/* ---------------- import / export ---------------- */

export function exportScheme(s: Scheme): void {
  const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${s.meta.doc}-rev${s.meta.rev}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 800);
}

export function parseSchemeImport(text: string): Scheme {
  const data: unknown = JSON.parse(text);
  const s = normalizeScheme(data);
  if (!s.categories.length) throw new Error("No categories found in file");
  return s;
}

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
