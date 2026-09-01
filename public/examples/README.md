# examples/ — real-world board photos

Drop real images here (fab shots, solder joints, actual layouts, 3D renders, microscope shots…)
and reference them from `data/scheme.json`:

```json
"image": "examples/bad-corner.jpg"
```

When an example has an `"image"`, the guide card shows your photo (with a small **REAL PHOTO**
badge) *instead of* the built-in diagram.

Rules of the house:

- Keep each file under **~1.5 MB** (squash with any image tool before committing — this is a
  static site, every byte ships to every trainee)
- Name files in `kebab-case.jpg` / `.png`
- Prefer JPG for photos; use PNG only for crisp line-art screenshots
- Crop to the interesting region — one image per card is plenty

See the repo-root `README.md` for the full walkthrough.
