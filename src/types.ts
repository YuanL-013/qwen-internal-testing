export type Verdict = "pass" | "fail";

export interface Example {
  id: string;
  title: string;
  verdict: Verdict;
  description: string;
  reason: string;
  tags: string[];
  diagram?: string;
  hidden?: boolean;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  blurb: string;
  examples: Example[];
  hidden?: boolean;
}

export interface ReadingLink {
  title: string;
  url: string;
  note?: string;
  tag?: string;
}

export interface ReadingGroup {
  group: string;
  links: ReadingLink[];
}

export interface SpecGroup {
  id: string;
  num: number;
  title: string;
  items: string[];
}

export interface SchemeMeta {
  team: string;
  doc: string;
  rev: string;
  updated: string;
  maintainer?: string;
}

export interface Scheme {
  meta: SchemeMeta;
  spec?: SpecGroup[];
  categories: Category[];
  checklist: string[];
  readings?: ReadingGroup[];
}
