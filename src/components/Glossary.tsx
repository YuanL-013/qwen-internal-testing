import type { ReactNode } from "react";
import Reveal from "./Reveal";

function G({ children }: { children: ReactNode }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0 text-copperlt"
    >
      {children}
    </svg>
  );
}

const TERMS: Array<{ term: string; def: ReactNode; icon: ReactNode }> = [
  {
    term: "Schematic",
    def: (
      <>
        The circuit drawn with symbols — chips, resistors, wires. It says{" "}
        <em className="text-ink not-italic">what connects to what</em>, but nothing about where anything sits.
      </>
    ),
    icon: (
      <G>
        <path d="M3 12h3l3-5 3 10 3-5h6" />
      </G>
    ),
  },
  {
    term: "PCB layers",
    def: (
      <>
        The board is fibreglass with thin sheets of copper glued inside. We usually order{" "}
        <em className="text-ink not-italic">2-layer</em> boards: copper on top and bottom.
      </>
    ),
    icon: (
      <G>
        <rect x="4" y="4.5" width="16" height="15" rx="1" />
        <path d="M4 12h16" />
        <circle cx="8" cy="8.2" r="1" fill="currentColor" stroke="none" />
        <circle cx="16" cy="15.8" r="1" fill="currentColor" stroke="none" />
      </G>
    ),
  },
  {
    term: "Trace",
    def: (
      <>
        A copper wire on the board. Wide traces carry power; thin ones carry signals. Every rule about{" "}
        <em className="text-ink not-italic">width</em> is really a rule about current.
      </>
    ),
    icon: (
      <G>
        <path d="M4 17h6l3-10h7" />
      </G>
    ),
  },
  {
    term: "Pad",
    def: (
      <>
        The little copper landing spot a part gets soldered onto. Round pads have a hole through them; flat
        rectangles sit on the surface — those are <em className="text-ink not-italic">SMD</em> pads.
      </>
    ),
    icon: (
      <G>
        <circle cx="8.5" cy="12" r="4.5" />
        <circle cx="8.5" cy="12" r="1.6" />
        <rect x="15" y="9" width="6" height="6" rx="1" />
      </G>
    ),
  },
  {
    term: "Via",
    def: (
      <>
        A tiny plated hole that carries a trace from one layer to another — a{" "}
        <em className="text-ink not-italic">copper elevator</em>. You'll see them as little dots all over a board.
      </>
    ),
    icon: (
      <G>
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
        <path d="M12 3.5V6M12 18v2.5M3.5 12H6M18 12h2.5" />
      </G>
    ),
  },
  {
    term: "Copper pour / plane",
    def: (
      <>
        An entire area flooded with copper — usually ground. It's free wiring, shields noise and spreads heat.
        When cards say <em className="text-ink not-italic">“use a zone”</em>, this is what they mean.
      </>
    ),
    icon: (
      <G>
        <rect x="4.5" y="4.5" width="15" height="15" rx="1" />
        <path d="M7 16.5l9.5-9.5M10.5 19.5L19.5 10.5M4.5 13.5l6-6" />
      </G>
    ),
  },
  {
    term: "Solder mask",
    def: (
      <>
        The green (or black) coating over everything <em className="text-ink not-italic">except</em> the pads. It
        stops solder sticking where it shouldn't.
      </>
    ),
    icon: (
      <G>
        <rect x="4.5" y="4.5" width="15" height="15" rx="1" />
        <rect x="8" y="8" width="3" height="3" fill="currentColor" stroke="none" opacity="0.85" />
        <rect x="13" y="13" width="3" height="3" fill="currentColor" stroke="none" opacity="0.85" />
      </G>
    ),
  },
  {
    term: "Silkscreen",
    def: (
      <>
        The white lettering printed on top: part labels, logos, arrows. It's just ink —{" "}
        <em className="text-ink not-italic">for humans</em>, not for electricity.
      </>
    ),
    icon: (
      <G>
        <path d="M5 19L15.5 8.5a2.1 2.1 0 0 1 3 3L8 22H5z" />
        <path d="M13.5 10.5l3 3" />
        <path d="M4 5h8M4 8h5" />
      </G>
    ),
  },
  {
    term: "Footprint",
    def: (
      <>
        The pattern of pads a part lands on. Get it wrong and the part physically won't fit — that's why we take
        footprints <em className="text-ink not-italic">from the library</em>, not from imagination.
      </>
    ),
    icon: (
      <G>
        <rect x="4.5" y="7" width="4" height="3" />
        <rect x="4.5" y="14" width="4" height="3" />
        <rect x="15.5" y="7" width="4" height="3" />
        <rect x="15.5" y="14" width="4" height="3" />
        <rect x="10" y="9" width="4" height="6" />
      </G>
    ),
  },
  {
    term: "Decoupling cap",
    def: (
      <>
        A tiny charge reservoir parked right at a chip's power pin. When the chip suddenly gulps current, this is
        what answers — <em className="text-ink not-italic">before the rail even notices</em>.
      </>
    ),
    icon: (
      <G>
        <path d="M9 5.5v13M15 5.5v13" />
        <path d="M12 2.5V5.5M12 18.5v3" strokeDasharray="0" />
        <path d="M12 5.5V9M12 15v3.5" />
      </G>
    ),
  },
  {
    term: "DRC",
    def: (
      <>
        Design Rule Check — the software measures every gap and width against the fab's limits and hands you a list
        of violations. The goal is always <em className="text-ink not-italic">zero errors</em> before ordering.
      </>
    ),
    icon: (
      <G>
        <rect x="5" y="3.5" width="14" height="17" rx="1" />
        <path d="M8.5 9l2 2 4-4M8.5 15h7" />
      </G>
    ),
  },
  {
    term: "Fab & Gerbers",
    def: (
      <>
        The factory that makes the board. Fabs don't read CAD files — they read{" "}
        <em className="text-ink not-italic">Gerbers</em>: one photo file per copper layer, plus a drill file.
      </>
    ),
    icon: (
      <G>
        <rect x="6.5" y="3.5" width="13" height="11" rx="1" />
        <path d="M4.5 8v9.5a1 1 0 0 0 1 1h11" />
        <path d="M10 7.5h6M10 10.5h4" />
      </G>
    ),
  },
];

export default function Glossary() {
  return (
    <section id="glossary" className="relative border-b border-edge">
      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.28em] text-copper">FIRST /// SPEAK PCB</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            The words we keep using
          </h2>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-dim">
            Twelve words cover about 90% of this guide. Read these once — two minutes — and every card below will
            make sense. Nobody memorises this stuff; we all just come back and look.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TERMS.map((t, i) => (
            <Reveal key={t.term} delay={(i % 3) * 80}>
              <div className="group flex h-full gap-3.5 border border-edge bg-panel/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-copper/50">
                <span className="mt-0.5 transition-transform duration-300 group-hover:scale-110">{t.icon}</span>
                <div>
                  <h3 className="font-display text-[15px] font-bold tracking-wide text-ink">{t.term}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-dim">{t.def}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160}>
          <p className="mt-6 border border-edgesoft bg-panel/50 px-4 py-3 font-mono text-[10.5px] leading-relaxed tracking-[0.12em] text-faint">
            <span className="text-copperlt">STILL LOST?</span> HOVER ANY DIAGRAM — THEY'RE ALL DRAWN TO SCALE-ISH
            AND LABELLED. AND THE <span className="text-dim">FURTHER READING</span> SECTION AT THE BOTTOM HAS FULL
            BEGINNER COURSES.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
