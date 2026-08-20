import { IcLink } from "./Icons";
import Reveal from "./Reveal";

const SCHEMA_SNIPPET = `{
  "meta":   { "team", "doc", "rev", "updated" },
  "categories": [
    {
      "code": "TRC",            // 2–4 letters, shows as tab
      "name": "Trace Routing",
      "blurb": "…",
      "examples": [
        {
          "id": "ex-slug",
          "title": "What the reviewer sees",
          "verdict": "pass" | "fail",
          "description": "the pattern, precisely",
          "reason": "why okay / not okay",
          "tags": ["routing"],
          "diagram": "corners",   // built-in art, optional
          "image": "examples/x.jpg"  // repo photo, optional
        }
      ]
    }
  ],
  "checklist": ["…"]
}`;

const STEPS = [
  ["01", "Get collaborator access", "Ask the HW lead to add your GitHub account to the repo. Trainees never need it."],
  ["02", "Edit data/scheme.json", "Use GitHub's web editor or your own clone. Add your standard as a new finding — description plus the why."],
  ["03", "Drop real photos in examples/", "Commit fab shots, solder joints or 3D renders to public/examples/ — there is a README in that folder — and point \"image\" at e.g. \"examples/joint.jpg\". The card then shows your photo instead of the built-in diagram. Keep files under ~1.5 MB."],
  ["04", "Commit to main", "Pages rebuilds and republishes automatically. Every trainee reads the same guide — no manual sync."],
];

export default function MaintainerNote() {
  return (
    <section id="maintainers" className="relative border-t border-edge">
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div>
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.28em] text-copper">FOR REVIEWERS /// MAINTENANCE</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Keeping this guide current
              </h2>
              <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-dim">
                The guide is data, and the data lives in the repo —{" "}
                <code className="border border-edge bg-panel px-1.5 py-0.5 font-mono text-[12px] text-copperlt">
                  public/data/scheme.json
                </code>
                . There is deliberately no editor on this page: standards change through code review, like everything
                else we build. Reviewers contribute with{" "}
                <span className="text-ink">GitHub collaborator access</span> and nothing else.
              </p>
            </Reveal>

            <ol className="mt-7 space-y-0">
              {STEPS.map(([n, title, body], i) => (
                <Reveal key={n} delay={i * 90}>
                  <li className="relative flex gap-4 pb-5 last:pb-0">
                    {i < STEPS.length - 1 && <span className="absolute left-[13px] top-8 h-full w-px bg-edge" />}
                    <span className="z-10 flex h-7 w-7 shrink-0 items-center justify-center border border-copper/60 bg-bg font-mono text-[11px] font-semibold text-copperlt">
                      {n}
                    </span>
                    <div>
                      <h3 className="font-display text-[15px] font-bold tracking-wide text-ink">{title}</h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-dim">{body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={380}>
              <p className="mt-6 border border-warn/30 bg-warn/5 px-4 py-3 text-[12.5px] leading-relaxed text-dim">
                <span className="font-mono text-[10.5px] tracking-[0.2em] text-warn">RULE OF THE HOUSE — </span>
                this page shows <em className="text-ink not-italic">standards</em>, never scores. Weighting, bands and
                deductions stay in the internal marking sheet and are not committed here. Trainees see what is
                expected; only markers see what it costs.
              </p>
            </Reveal>
          </div>

          <Reveal delay={160}>
            <div className="flex h-full flex-col border border-edge bg-panel/70">
              <div className="flex items-center justify-between border-b border-edge px-4 py-2.5">
                <span className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.2em] text-faint">
                  <IcLink size={13} /> public/data/scheme.json — SHAPE
                </span>
                <span className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-fail/70" />
                  <span className="h-2 w-2 rounded-full bg-warn/70" />
                  <span className="h-2 w-2 rounded-full bg-pass/70" />
                </span>
              </div>
              <pre className="flex-1 overflow-x-auto p-4 font-mono text-[11.5px] leading-relaxed text-dim">
                <code>{SCHEMA_SNIPPET}</code>
              </pre>
              <div className="border-t border-edge px-4 py-3">
                <p className="font-mono text-[10px] leading-relaxed tracking-[0.14em] text-faint">
                  <span className="text-copperlt">TIP</span> — omit "diagram" and "image" for a text-only finding;
                  omit "tags" only if you enjoy unsearchable standards. Bump meta.rev and meta.updated on every change.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
