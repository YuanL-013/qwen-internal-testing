import type { ReadingGroup } from "../types";
import { IcArrow, IcDoc, IcImage, IcLink } from "./Icons";
import Reveal from "./Reveal";

const TAG_TONE: Record<string, string> = {
  DOCS: "text-info border-info/40",
  TOOLS: "text-warn border-warn/40",
  VIDEO: "text-fail border-fail/40",
  REFERENCE: "text-pass border-pass/40",
};

function GroupIcon({ tag }: { tag?: string }) {
  const cls = "shrink-0";
  if (tag === "VIDEO") return <IcImage size={14} className={cls} />;
  if (tag === "TOOLS" || tag === "REFERENCE") return <IcLink size={14} className={cls} />;
  return <IcDoc size={14} className={cls} />;
}

export default function Readings({ groups }: { groups: ReadingGroup[] }) {
  const visible = (groups ?? []).filter((g) => g.links && g.links.length > 0);
  if (visible.length === 0) return null;

  return (
    <section id="readings" className="relative border-t border-edge">
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.28em] text-copper">SECTION 08 /// FURTHER READING</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Where the rules come from
          </h2>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-dim">
            Everything in this guide is a team rule — short on purpose. When you want the fuller picture behind a rule,
            or you've finished the homework early and want to go deeper, these are the places we actually use.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {visible.map((g, gi) => (
            <Reveal key={g.group} delay={(gi % 2) * 100}>
              <div className="h-full border border-edge bg-panel/70">
                <div className="flex items-center gap-3 border-b border-edge px-5 py-3.5">
                  <span className="h-3.5 w-1 bg-copper" />
                  <h3 className="font-display text-[15px] font-bold tracking-wide text-ink">{g.group}</h3>
                  <span className="ml-auto font-mono text-[10px] tracking-[0.18em] text-faint">
                    {g.links.length} LINK{g.links.length === 1 ? "" : "S"}
                  </span>
                </div>
                <ul className="divide-y divide-edgesoft">
                  {g.links.map((l) => {
                    const tone = TAG_TONE[l.tag ?? ""] ?? "text-dim border-edge";
                    return (
                      <li key={l.url}>
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-start gap-3.5 px-5 py-3.5 transition-colors hover:bg-raise/60"
                        >
                          <span className={`mt-0.5 ${tone.split(" ")[0]}`}>
                            <GroupIcon tag={l.tag} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-baseline gap-2">
                              <span className="font-display text-[14px] font-semibold leading-snug text-ink transition-colors group-hover:text-copperlt">
                                {l.title}
                              </span>
                              {l.tag && (
                                <span className={`shrink-0 border px-1.5 py-px font-mono text-[8.5px] tracking-[0.16em] ${tone}`}>
                                  {l.tag}
                                </span>
                              )}
                            </span>
                            {l.note && <span className="mt-1 block text-[12.5px] leading-relaxed text-dim">{l.note}</span>}
                          </span>
                          <span className="mt-1 shrink-0 text-faint transition-all duration-200 group-hover:translate-x-1 group-hover:text-copperlt">
                            <IcArrow size={15} className="-rotate-45" />
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
