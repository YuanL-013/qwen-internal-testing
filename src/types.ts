export type Verdict = "pass" | "fail";

export interface Example {
  id: string;
  title: string;
  verdict: Verdict;
  /** What the reviewer (and trainee) is looking at. */
  description: string;
  /** Why this pattern is okay / not okay — the part that settles arguments. */
  reason: string;
  tags: string[];
  /** Key of a built-in SVG illustration. */
  diagram?: string;
  /** Path to a photo/shot committed to the repo (e.g. "examples/pad.jpg") or a URL. */
  image?: string;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  blurb: string;
  examples: Example[];
}

export interface SchemeMeta {
  team: string;
  doc: string;
  rev: string;
  updated: string; // ISO yyyy-mm-dd
}

export interface Scheme {
  meta: SchemeMeta;
  categories: Category[];
  checklist: string[];
}
