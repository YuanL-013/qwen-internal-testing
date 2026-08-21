# PCB Design Review Guide — HKUST Robotics Team

A public, always-current guide of what our PCB layouts should (and shouldn't) look like.
Trainees read it to learn the standard. Reviewers maintain it by editing **one JSON file**.

> **You do not need to know how to code to maintain this guide.** Everything a reviewer ever
> changes lives in a single text file. If you can copy-paste and edit text, you can do this.

---

## How it works (the 30-second version)

```
public/data/scheme.json   ←  THE ONLY FILE REVIEWERS EDIT
        │
        ▼
   the website reads it and renders every card, tab and checklist item
```

- The website is **static** (it runs on GitHub Pages — no server, no database).
- All the content — every category, every "okay / not okay" card, every checklist line — comes
  from **`public/data/scheme.json`**.
- When you edit that file and push to `main`, GitHub Pages rebuilds and the site updates.
- The code only controls *how* things look, not *what* is shown. Reviewers never need to touch it.

---

## Before you start: two rules

1. **This guide shows standards, never scores.** No points, no bands, no deductions anywhere.
   Those live in the internal marking sheet and must not be committed here.
2. **Bump the revision when you change content** (see [Revision & date](#changing-the-team-name-revision--date)).
   The site ignores data files with an *older* revision than the build, so an outdated file can
   never accidentally overwrite newer content.

---

## Adding a new design convention (the main task)

Every convention is one **example** object inside a **category**. Here's the recipe.

### Step 1 — Open `public/data/scheme.json`

Find the category your convention belongs to (`"code": "PWR"` for power, `"code": "BUS"` for
CAN/clock, etc.). Inside it there's an `"examples": [ ... ]` list.

### Step 2 — Copy-paste this template into the list

```json
{
  "id": "ex-my-new-rule",
  "title": "Short, human name for the rule",
  "verdict": "pass",
  "description": "What you actually see on the board. One or two plain sentences.",
  "reason": "Why this is okay (or not okay). This is the part that settles arguments.",
  "tags": ["power", "regulator"],
  "diagram": "railzone"
},
```

### Step 3 — Fill in the fields

| Field | What to put | Notes |
|---|---|---|
| `id` | A unique slug, e.g. `"ex-bulk-cap-close"` | Must not repeat anywhere in the file. |
| `title` | The card heading. | Keep it short and human. |
| `verdict` | `"pass"` (okay / do this) **or** `"fail"` (not okay / never this) | This sets the green/red styling. |
| `description` | What the reviewer/trainee is looking at. | Plain words, no jargon if possible. |
| `reason` | The *why*. | This is hidden behind a "Why this works/fails" tap on the card. |
| `tags` | A few lowercase keywords. | Powers the search box. |
| `diagram` **or** `image` | The visual — see below. | Use **one** of these, not both. |

> **Punctuation tip:** each example object ends with a comma `,` *except* the very last one in a
> list. If the site goes blank after your edit, you almost certainly added or dropped a comma.

### Step 4 — Pick a visual

You have two choices:

**Option A — a built-in diagram** (easiest). Set `"diagram"` to one of the keys below. These are
hand-drawn SVG illustrations that always look consistent.

```
corners  corner90  netclass  neckdown  stub
relief  stitch  decap  decapbunch  thermalvias  railzone  thinrail  wrongcap
canpair  cansplit  xtal  xtalring  viakeepout
schflow  netnaming  decal  erc
footprint  pin1  xh  sketchfp  mirror  headergap
refdes  silkhdr  silkpad  nopolarity
drc  sliver  creepage
gerbers  drill  datasheet
teardrop  antipad  caporient  courtyard  mount  testpts  fiducials  starpoint
```

**Option B — a real photo** (great for "we actually saw this on a board").
See [Adding real photos](#adding-real-photos). If you set `"image"`, delete the `"diagram"` line.

---

## Showing and hiding cards (reviewer control)

Sometimes a convention is correct in general but **not used by our team right now**. Rather than
delete it, hide it — it stays in the file for reference but doesn't appear on the site.

Add `"hidden": true` to any example:

```json
{
  "id": "ex-24v-rail",
  "title": "24 V vs 12 V main rail",
  "verdict": "pass",
  "description": "...",
  "reason": "...",
  "tags": ["power"],
  "diagram": "railzone",
  "hidden": true
},
```

- `"hidden": true` → card is **not shown** on the site.
- No `hidden` line (or `"hidden": false`) → card **is shown**.

You can also hide a **whole category** by adding `"hidden": true` to the category object (next to
its `"code"` / `"name"`). Hidden cards still count for nothing — header totals, tabs and the
ticker all skip them automatically.

> This is the mechanism for "some design conventions are not used in our case": keep them in the
> repo, flip `hidden` to `true`, and flip it back when the team adopts them.

---

## Adding real photos

1. Put your image file in the **`public/examples/`** folder (there's a README there too).
   Name it something memorable: `bad-acid-trap.jpg`, `good-decoupling.png`.
2. In your example, reference it with an `"image"` field (path is relative to the site root):

```json
"image": "examples/bad-acid-trap.jpg"
```

3. Remove the `"diagram"` line for that example (a card uses a photo *or* a diagram).

Guidelines:
- Keep each file **under ~1.5 MB** (compress first — every byte ships to every trainee).
- JPG for photos, PNG only for crisp line-art screenshots.
- Crop to the interesting region; one image per card is enough.
- Cards with a photo automatically show a small **REAL PHOTO** badge so trainees know it's a
  board we actually saw.

---

## Editing the checklist

The pre-submission checklist is just a list of strings at the bottom of the file:

```json
"checklist": [
  "DRC passes with zero errors at 0.2 mm / 0.2 mm",
  "One 100 nF decoupling cap per MCU power pin",
  "Add your new line here"
]
```

Add, remove or reorder lines freely. Trainees can tick these off in their browser (ticks are saved
locally on their machine only).

---

## Adding a whole new category

If your conventions don't fit an existing topic, add a new category object to the
`"categories": [ ... ]` list:

```json
{
  "id": "cat-emc",
  "code": "EMC",
  "name": "EMC & Shielding",
  "blurb": "One sentence on why this topic matters.",
  "examples": [
    { "id": "ex-...", "title": "...", "verdict": "pass", "description": "...", "reason": "...", "tags": [], "diagram": "stitch" }
  ]
}
```

- `code` is the short tab label (2–4 letters).
- A new tab appears automatically; no code changes needed.

---

## Changing the team name, revision & date

At the top of the file:

```json
"meta": {
  "team": "HKUST Robotics Team",
  "doc": "STD-PCB-01",
  "rev": "F",
  "updated": "2026-02-26"
}
```

- **`rev`** — bump the letter each time you publish a change (`F` → `G` → `H`). The site only
  trusts a data file whose revision is *newer* than the one it was built with, so this prevents an
  old copy from clobbering new content.
- **`updated`** — set to today's date in `YYYY-MM-DD` form.

---

## Deploying to GitHub Pages

1. Commit your change to `public/data/scheme.json` and push to `main`.
2. GitHub Pages rebuilds automatically; the new card is live in a minute or two.
3. If you're hosting under a **project subpath** (`username.github.io/repo-name`), make sure the
   build uses a relative base (`base: "./"` in `vite.config.ts`) so `data/scheme.json` resolves.
   For a custom domain or user page, the defaults already work.

---

## Running it locally (optional, for the curious)

```bash
npm install
npm run dev      # live preview while you edit
npm run build    # production build into dist/
```

---

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Site is blank after my edit | A JSON comma is missing or extra. Paste the file into [jsonlint.com](https://jsonlint.com) to find it. |
| Title block says **STALE FILE IGNORED** | Your `scheme.json` `rev` is *older* than the build's. Bump `rev` higher. |
| Title block says **BUILT-IN SNAPSHOT** | `data/scheme.json` couldn't be fetched — check the file exists at `public/data/scheme.json`. |
| My photo doesn't show | Check the path starts with `examples/...` and the file is under `public/examples/`. |

---

## File map

```
public/
  data/scheme.json      ← reviewers edit this (all content)
  examples/             ← reviewers drop real photos here
src/
  data/scheme.ts        ← built-in fallback copy of the content (devs keep in sync)
  components/Diagrams.tsx ← the built-in SVG illustration library
  (everything else is presentation — reviewers can ignore it)
```

**House rules:** standards are public, scoring is not · keep language plain · bump the rev ·
when in doubt, hide rather than delete.
