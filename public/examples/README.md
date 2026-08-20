# examples/ — real-world board photos

Drop real images here (fab shots, solder joints, actual layouts, 3D renders…)
and reference them from `data/scheme.json`:

```json
"image": "examples/bad-corner.jpg"
```

When a finding has an `"image"`, the guide card renders the photo **instead
of** the built-in diagram.

Rules of the house:

- Keep each file under ~1.5 MB (squash with any image tool before committing —
  this is a static site, every byte ships to every trainee)
- Name files `kebab-case.jpg` / `.png`
- Prefer JPG for photos, PNG only for line-art screenshots
- One image per finding is enough; crop to the interesting region
