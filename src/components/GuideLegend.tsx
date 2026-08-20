import { IcEye, IcStamp } from "./Icons";
import Reveal from "./Reveal";

const LEGEND = [
  {
    n: "01",
    title: "The verdict stamp",
    body: "Every finding is either OKAY — a pattern to copy — or NOT OKAY — a pattern that will never ship. No grey zone.",
  },
  {
    n: "02",
    title: "The pattern",
    body: "One layout habit per card: what the reviewer is actually looking at, described exactly as it appears on copper.",
  },
  {
    n: "03",
    title: "The why",
    body: "Physics, fabrication or assembly — the reason behind the ruling. This is the part that settles arguments.",
  },
  {
    n: "04",
    title: "The tags",
    body: "Keywords per finding, so you can pull up everything related to routing, soldering, planes or safety in one search.",
  },
];

export default function GuideLegend() {
  return (
    <section id="guide" className="relative border-b border-edge">
      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.28em] text-copper">SECTION 00 /// LEGEND</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            How to read this guide
          </h2>
        </Reveal>

        <div className="mt-9 grid gap-10 lg:grid-cols-[380px_1fr] lg:gap-14">
          {/* annotated specimen finding */}
          <Reveal delay={100}>
            <div className="relative">
              <article className="border border-passdim/60 bg-panel/80">
                <div className="p-3 pb-0">
                  <div className="relative">
                    <svg viewBox="0 0 220 132" className="block h-auto w-full" role="img" aria-label="Sample trace routing diagram">
                      <rect x="1" y="1" width="218" height="130" rx="8" fill="#0d281e" stroke="#1c4636" strokeWidth="1.5" />
                      <path d="M 22 100 H 88 L 128 58 H 198" fill="none" stroke="#e0955a" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="182" cy="28" r="10" fill="#0d281e" stroke="#55d78e" strokeWidth="2" />
                      <path d="M 177.5 28 L 180.8 31.6 L 187 24.6" fill="none" stroke="#55d78e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="10" y="123" fontFamily="var(--font-mono)" fontSize="7.5" letterSpacing="0.08em" fill="#67856f">
                        MITRE EVERY TURN
                      </text>
                    </svg>
                    <span className="absolute right-2 top-2 -rotate-6 border-2 border-pass/80 bg-bg/60 px-1.5 py-0.5 font-display text-[11px] font-bold tracking-[0.2em] text-pass">
                      OKAY
                    </span>
                  </div>
                </div>
                <div className="p-4 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-faint">TRC-01</span>
                    <span className="font-mono text-[10px] tracking-[0.16em] text-pass/90">DO THIS</span>
                  </div>
                  <h3 className="mt-1.5 font-display text-[15px] font-bold tracking-wide text-ink">
                    45° corners everywhere
                  </h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-dim">
                    Every change of direction is a 45° mitre — no right angles on any net.
                  </p>
                  <div className="mt-2.5 border-l-2 border-pass/60 pl-3">
                    <p className="font-mono text-[9px] tracking-[0.24em] text-pass/80">WHY IT'S OKAY</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-ink/85">
                      Etches evenly, keeps impedance constant, reads as intentional work.
                    </p>
                  </div>
                  <div className="mt-2.5 flex gap-1.5">
                    {["routing", "geometry"].map((t) => (
                      <span key={t} className="border border-edgesoft px-1.5 py-0.5 font-mono text-[9px] tracking-[0.14em] text-faint">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>

              {/* callouts */}
              <span className="absolute -left-3 -top-3 flex h-7 w-7 items-center justify-center border border-copper bg-bg font-mono text-[11px] font-semibold text-copperlt">
                01
              </span>
              <span className="absolute -right-3 top-1/3 flex h-7 w-7 items-center justify-center border border-copper bg-bg font-mono text-[11px] font-semibold text-copperlt">
                02
              </span>
              <span className="absolute -left-3 bottom-16 flex h-7 w-7 items-center justify-center border border-copper bg-bg font-mono text-[11px] font-semibold text-copperlt">
                03
              </span>
              <span className="absolute -right-3 bottom-4 flex h-7 w-7 items-center justify-center border border-copper bg-bg font-mono text-[11px] font-semibold text-copperlt">
                04
              </span>
            </div>
          </Reveal>

          <div>
            <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {LEGEND.map((l, i) => (
                <Reveal key={l.n} delay={i * 90}>
                  <div className="group flex gap-4 border-b border-edgesoft pb-4">
                    <span className="font-mono text-[13px] font-semibold text-copper/80">{l.n}</span>
                    <div>
                      <h3 className="font-display text-[15px] font-bold tracking-wide text-ink">{l.title}</h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-dim">{l.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Reveal delay={140}>
                <div className="flex h-full gap-3.5 border border-edge bg-panel/70 p-4 transition-colors hover:border-copper/40">
                  <span className="mt-0.5 shrink-0 text-copperlt">
                    <IcEye size={18} />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.24em] text-copperlt">IF YOU'RE A TRAINEE</p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-dim">
                      Walk your own layout against every pattern below — especially the red ones. Then finish the
                      pre-submission checklist at the bottom of this page.
                    </p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={220}>
                <div className="flex h-full gap-3.5 border border-edge bg-panel/70 p-4 transition-colors hover:border-copper/40">
                  <span className="mt-0.5 shrink-0 text-copperlt">
                    <IcStamp size={18} />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.24em] text-copperlt">IF YOU'RE A MARKER</p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-dim">
                      Judge against this guide and the internal weighting sheet — nothing invented on the spot. If a
                      pattern is missing, propose it in the repo (see “Keeping this guide current”).
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
