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
  /** Set true to keep the finding in the file without showing it on the site. */
  hidden?: boolean;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  blurb: string;
  examples: Example[];
  /** Set true to hide a whole category (tab + section) from the site. */
  hidden?: boolean;
}

export interface ReadingLink {
  title: string;
  url: string;
  note?: string;
  tag?: string; // DOCS · TOOLS · VIDEO · REFERENCE
}

export interface ReadingGroup {
  group: string;
  links: ReadingLink[];
}

export interface SchemeMeta {
  team: string;
  doc: string;
  rev: string;
  updated: string; // ISO yyyy-mm-dd
  maintainer?: string; // shown in the footer
}

export interface Scheme {
  meta: SchemeMeta;
  categories: Category[];
  checklist: string[];
  readings?: ReadingGroup[];
}
