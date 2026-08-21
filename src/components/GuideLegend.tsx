import { DIAGRAMS } from "./Diagrams";
import { IcChevD, IcInfo } from "./Icons";
import Reveal from "./Reveal";

const Corners = DIAGRAMS.corners;

function AnatomyRow({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-[7px] h-2 w-2 shrink-0 rotate-45 ${tone}`} />
      <p className="text-[13.5px] leading-relaxed text-dim">{children}</p>
    </li>
  );
}

export default function GuideLegend() {
  return (
    <section className="relative border-b border-edge">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:px-8 lg:py-16">
        <div>
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.28em] text-copper">TWO MINUTES /// HOW TO READ IT</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Every card says three things
            </h2>
            <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-dim">
              What you're looking at, whether it's okay, and why. That's the whole system — everything else on the
              card is detail.
            </p>
          </Reveal>

          {/* sample card, real markup */}
          <Reveal delay={120}>
            <div className="relative mt-7 max-w-sm border border-passdim/60 bg-panel/80">
              <div className="p-3 pb-0">
                <Corners />
              </div>
              <div className="p-4 pt-3.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-faint">TRC-01</span>
                  <span className="ml-auto font-mono text-[10px] tracking-[0.16em] text-pass/90">DO THIS</span>
                </div>
                <h3 className="mt-1.5 font-display text-[16px] font-bold tracking-wide text-ink">45° corners everywhere</h3>
                <p className="mt-1 text-[12.5px] leading-relaxed text-dim">Every bend in a trace is a 45° cut or a smooth curve.</p>
                <div className="mt-2.5 flex items-center gap-2 border-l-2 border-pass/60 py-1.5 pl-3">
                  <span className="font-mono text-[9.5px] tracking-[0.24em] text-pass/80">WHY THIS WORKS</span>
                  <span className="ml-auto text-faint">
                    <IcChevD size={12} />
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {["routing", "geometry"].map((t) => (
                    <span key={t} className="border border-edgesoft px-1.5 py-0.5 font-mono text-[9.5px] tracking-[0.14em] text-faint">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-faint">
              <span className="inline-block h-2 w-2 rotate-45 bg-copper" />
              BORDER = VERDICT · CORNER LABEL = VERDICT · “WHY” ROW = TAP TO OPEN
            </p>
          </Reveal>
        </div>

        <div className="lg:pt-[68px]">
          <Reveal delay={90}>
            <ul className="space-y-4">
              <AnatomyRow tone="bg-pass">
                <span className="text-ink">The border colour is the verdict.</span> Green means okay, red means not
                okay — and the little <span className="font-mono text-[11px] tracking-[0.12em]">DO THIS / NEVER THIS</span>{" "}
                label in the corner says it out loud.
              </AnatomyRow>
              <AnatomyRow tone="bg-copper">
                <span className="text-ink">The “why” line opens up — tap it.</span> That one line is the difference
                between memorising rules and understanding them. It's the part people skip and then relearn the hard
                way.
              </AnatomyRow>
              <AnatomyRow tone="bg-info">
                <span className="text-ink">Photos are real boards; drawings are teaching art.</span> When a card shows
                a photo (marked{" "}
                <span className="font-mono text-[11px] tracking-[0.12em] text-copperlt">REAL PHOTO</span>), that's
                something we actually saw on one of ours.
              </AnatomyRow>
              <AnatomyRow tone="bg-warn">
                <span className="text-ink">The tabs jump by topic, the search finds anything.</span> Lost? Hit{" "}
                <span className="font-mono text-[11px] tracking-[0.12em]">ALL</span> and search for the word on your
                mind — “via”, “CAN”, “silk”.
              </AnatomyRow>
            </ul>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Reveal delay={200}>
              <div className="h-full border border-edge bg-panel/70 p-4">
                <p className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.22em] text-copperlt">
                  <IcInfo size={13} /> IF YOU'RE NEW
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-dim">
                  Read this guide once before you start routing. Then keep the checklist at the bottom open while you
                  work — it's the same list the team runs before any board goes to the fab.
                </p>
              </div>
            </Reveal>
            <Reveal delay={280}>
              <div className="h-full border border-edge bg-panel/70 p-4">
                <p className="font-mono text-[10.5px] tracking-[0.22em] text-copperlt">SOMETHING MISSING?</p>
                <p className="mt-2 text-[13px] leading-relaxed text-dim">
                  Good standards grow out of real boards. If you spot a pattern that belongs in here, say so — the
                  guide is meant to be added to.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
