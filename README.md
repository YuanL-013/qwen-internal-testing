# PCB Design Guide — Northbolt Robotics

A static webpage that shows the team's PCB design standard: what's okay, what's
not okay, and why. Trainees read it, and anyone with repo access can grow it.

**Live content:** `public/data/scheme.json` — that one file is the whole guide.

---

## How it works

1. The site is a plain static build (React + Vite), hosted on GitHub Pages.
2. On load, the page fetches `data/scheme.json` and renders whatever is in it —
   categories, findings, checklist.
3. If the file is missing, or its `rev` is **older** than the one compiled into
   the build, the built-in copy (`src/data/scheme.ts`) is shown instead. A stale
   file can never hide newer content. The small DATA lamp in the title block
   tells you which copy you're looking at.
4. Reviewers don't need any admin login. Access control **is** the repo:
   collaborator access = can edit the guide. Everyone else gets a read-only page.

```
repo
├── public/
│   ├── data/scheme.json    ← THE guide. Edit this.
│   └── examples/           ← real board photos, referenced from the JSON
├── src/
│   ├── data/scheme.ts      ← compiled fallback copy (keep in sync)
│   └── components/
│       └── Diagrams.tsx    ← the built-in drawing library
└── dist/                   ← built site (what Pages serves)
```

---

## How to expand the guide

Everything below is a commit to `public/data/scheme.json`
(and the matching `src/data/scheme.ts`), then push — Pages rebuilds.

### Add a finding (a "card")

Inside the right category's `examples` array:

```json
{
  "id": "ex-my-finding",
  "title": "What the reader sees",
  "description": "The pattern, in one or two plain sentences.",
  "reason": "Why it's okay — or why it fails. This is the part people actually learn from.",
  "verdict": "pass",
  "tags": ["routing"],
  "diagram": "corners"
}
```

- `verdict` — `"pass"` (green card, "DO THIS") or `"fail"` (red card, "NEVER THIS").
- `reason` — optional but strongly encouraged; it renders as an expandable
  "WHY THIS WORKS / WHY THIS FAILS" line.
- `tags` — searchable, lowercase.
- Visual: use **one** of:
  - `"diagram": "<key>"` — a built-in drawing (see list below), or
  - `"image": "examples/my-photo.jpg"` — a real photo from `public/examples/`
    (cards with photos get a REAL PHOTO badge). `image` wins if both are set.
  - neither — the card shows a neutral chip placeholder. Still fine.

### Add a category

```json
{
  "id": "cat-mech",
  "code": "MEC",
  "name": "Mechanical & Connectors",
  "blurb": "One sentence on what this section cares about.",
  "examples": [ ... ]
}
```

`code` is the 2–4 letter tab label. Order in the array = order on the page.

### Edit the checklist

`"checklist": [ "…", "…" ]` — plain strings, in the order you want them.
Trainees can tick these locally on their own browser; nothing is sent anywhere.

### Add real photos

1. Commit the image to `public/examples/` (see that folder's README).
2. Point a finding's `"image"` at it: `"image": "examples/bad-corner.jpg"`.

Keep files under ~1.5 MB — squash them first; every byte ships to every reader.

### Add a new built-in diagram

Diagrams are small inline SVG components in `src/components/Diagrams.tsx`.
Add a component, register it in the `DIAGRAMS` map (and `DIAGRAM_OPTIONS` for
the list), and reference its key from `"diagram"`. This is the only change that
touches code rather than data.

---

## Built-in diagram keys

`corners` `corner90` `netclass` `neckdown` `relief` `stitch` `viapad` `flood`
`footprint` `pin1` `sketchfp` `mirror` `refdes` `silkpad` `nopolarity` `drc`
`sliver` `creepage` `gerbers` `drill` `decap` `decapbunch` `thermalvias`
`railzone` `thinrail` `wrongcap` `canpair` `cansplit` `xtal` `xtalring`
`viakeepout` `xh` `headergap` `silkhdr` `caporient` `antipad` `mount` `testpts`
`teardrop` `courtyard` `fiducials` `starpoint`

Unknown keys fall back to the neutral placeholder — a typo won't break the page.

---

## Deploying (GitHub Pages)

1. `npm run build` → `dist/`.
2. Serve `dist/` (Pages branch, an action, whatever the repo already uses).
3. **Project pages** (`username.github.io/repo-name`): build with `base: "./"`
   in `vite.config` so asset and data paths stay relative.
4. After changing the guide, bump `meta.rev` (A → B → C…) and `meta.updated`.
   The app only trusts a data file whose rev is newer than its compiled copy —
   that's also how you force an update through stale caches.

## Rules of the house

- **No scores in this repo.** The guide shows standards only. Weighting, bands
  and point values live in the internal marking sheet and are never committed
  here — trainees see what's expected, not what things cost.
- One file of data, one place for photos, one library of drawings. That's the
  whole architecture — it scales by adding entries, not by adding systems.
