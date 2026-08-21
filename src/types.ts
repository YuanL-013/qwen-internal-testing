export type Verdict = "pass" | "fail";

export interface Example {
  id: string;
  title: string;
  verdict: Verdict;
  /** What you're looking at on the board. */
  description: string;
  /** Why this pattern is okay / not okay — the part that settles arguments. */
  reason: string;
  tags: string[];
  /** Key of a built-in SVG illustration. */
  diagram?: string;
  /** Path to a photo/shot committed to the repo (e.g. "examples/pad.jpg") or a URL. */
  image?: string;
  /** Set "hidden": true in data/scheme.json to keep the finding in the repo but not show it on the guide. */
  hidden?: boolean;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  blurb: string;
  examples: Example[];
  /** Set "hidden": true in data/scheme.json to hide the whole topic from the guide. */
  hidden?: boolean;
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
