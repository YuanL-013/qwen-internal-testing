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

## Adding real photos (replaces the diagram on a card)

A photo set on a card **completely replaces** its built-in diagram — the card then shows your
photo and a small **REAL PHOTO** badge. You can upload straight from your browser; no git needed.

**Step 1 — upload the photo to `public/examples/`**

1. On GitHub, open the repo → click into the **`public`** folder → click **`examples`**.
2. Click **Add file → Upload files**, drag your photo in, name it something memorable
   (`bad-acid-trap.jpg`, `good-decoupling.png`), then **Commit changes**.

**Step 2 — point the card at it**

In `public/data/scheme.json`, find your example and add (or swap in) the `image` line — the path
is always `examples/` + the exact filename:

```json
"image": "examples/bad-acid-trap.jpg"
```

If the example had a `"diagram": "..."` line, **delete that line** (a card uses a photo *or* a
diagram). Commit and push — the photo is live when Pages rebuilds.

> **Safety net:** if the `image` path is wrong or the file is missing, the card automatically
> falls back to its built-in diagram instead of showing a broken picture. Nothing can "break"
> a card by pointing at the wrong file — it just shows the drawing until the photo lands.

Guidelines:
- Keep each file **under ~1.5 MB** (compress first — every byte ships to every trainee).
- JPG for photos, PNG only for crisp line-art screenshots.
- Crop to the interesting region; one image per card is enough.

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

## Editing the "Further reading" links

The reading list at the bottom is also data — a `"readings"` array at the end of the file. Each
group is a heading plus a list of links:

```json
"readings": [
  {
    "group": "Routing, grounding & signal integrity",
    "links": [
      {
        "title": "Phil's Lab on YouTube",
        "url": "https://www.youtube.com/@PhilsLab",
        "note": "One line on why this link earns its place.",
        "tag": "VIDEO"
      }
    ]
  }
]
```

- `tag` is one of `DOCS`, `VIDEO`, `TOOLS`, `REFERENCE` (it just picks the chip colour).
- Add or remove whole groups or single links freely; empty groups are skipped automatically.

---

## Changing the team name, revision & date

At the top of the file:

```json
"meta": {
  "team": "HKUST Robotics Team",
  "doc": "STD-PCB-01",
  "rev": "F2",
  "updated": "2026-02-27",
  "maintainer": "the Hardware Division"
}
```

- **`rev`** — bump it each time you publish a change (`F2` → `G` → `H`…). Letters, or letter +
  number for small fixes. The site only trusts a data file whose revision is *the same as or newer
  than* the one it was built with, so an old copy can never clobber new content.
- **`updated`** — set to today's date in `YYYY-MM-DD` form.
- **`maintainer`** — shown in the footer as "MAINTAINED BY …", so trainees know who to ask.

---

## Deploying to GitHub Pages (automatic)

The repo ships with a workflow — **`.github/workflows/pages.yml`** — that builds the site with the
correct settings and publishes it to Pages on every push to `main`. You never run a build command.

**One-time setup (3 clicks):**

1. Repo → **Settings** → **Pages** (left sidebar).
2. Under *Build and deployment* → **Source**, choose **GitHub Actions**.
3. Done. From now on: edit → commit to `main` → the site republishes itself in ~1 minute.

> **Why the site may have shown a blank page before:** GitHub Pages serves project repos from a
> *subpath* (`username.github.io/repo-name/`). A default Vite build writes asset links starting
> with `/`, which point to the wrong place on a subpath — so the page loads nothing. The workflow
> builds with `--base=./` (relative links), which works on any subpath, custom domain or user page.
> If you build manually for some reason, always use `npx vite build --base=./`.

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
| **GitHub Pages is completely blank** | The build used absolute asset paths on a project subpath. Use the bundled workflow (Pages → Source → *GitHub Actions*) or build with `npx vite build --base=./`. Also check Pages settings: it must be set to deploy from *Actions*, not from a branch. |
| Site is blank after my edit | A JSON comma is missing or extra. Paste the file into [jsonlint.com](https://jsonlint.com) to find it. |
| My edit never appears online | Make sure it's committed to **`main`** (not an unmerged branch), then watch the **Actions** tab — the *Deploy guide* run must finish green. Hard-refresh the page once (Ctrl/Cmd + Shift + R). |
| Title block says **STALE FILE IGNORED** | Your `scheme.json` `rev` is *older* than the build's. Bump `rev` higher. |
| Title block says **BUILT-IN SNAPSHOT** | `data/scheme.json` couldn't be fetched — check the file exists at `public/data/scheme.json`. |
| My photo doesn't show | Check the path starts with `examples/...` and the file is committed under `public/examples/` with the exact same spelling. Until it's right, the card safely shows its built-in diagram instead. |

---

## File map

```
.github/workflows/
  pages.yml             ← builds & deploys to Pages on every push to main
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
