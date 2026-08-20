export type Verdict = "pass" | "fail";

export type Severity = "critical" | "major" | "minor";

export interface Example {
  id: string;
  title: string;
  /** What the reviewer sees in the submission */
  description: string;
  /** Why it is approved / why it is not supported */
  reason: string;
  verdict: Verdict;
  /** fail only */
  severity?: Severity;
  /** fail only — points deducted per occurrence */
  deduction?: number;
  /** key into the built-in diagram library */
  diagram?: string;
  /** uploaded data-URL or external image URL (overrides diagram) */
  image?: string;
  tags: string[];
}

export interface Category {
  id: string;
  /** short code, e.g. TRC */
  code: string;
  name: string;
  blurb: string;
  examples: Example[];
}

export interface SchemeMeta {
  team: string;
  doc: string;
  rev: string;
  updated: string;
}

export interface Scheme {
  meta: SchemeMeta;
  categories: Category[];
  checklist: string[];
}

export type Toast = {
  id: number;
  message: string;
  tone: "ok" | "warn" | "err";
  actionLabel?: string;
  onAction?: () => void;
};
