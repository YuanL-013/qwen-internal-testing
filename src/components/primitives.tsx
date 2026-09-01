import { useEffect, useRef, useState, type ReactNode, type SVGProps } from "react";

/* ---------------- Reveal on scroll ---------------- */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in" : ""} ${className}`}
      style={{ ["--rv-delay" as string]: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------------- Inline icons ---------------- */
type P = SVGProps<SVGSVGElement> & { size?: number };
function base({ size = 16, ...rest }: P, children: ReactNode) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...rest}>
      {children}
    </svg>
  );
}
export const IcChevD = (p: P) => base(p, <path d="M6 9.5 12 15.5 18 9.5" />);
export const IcSearch = (p: P) => base(p, <><circle cx="10.5" cy="10.5" r="6" /><path d="M15.2 15.2 20 20" /></>);
export const IcX = (p: P) => base(p, <path d="M6 6l12 12M18 6L6 18" />);
export const IcCheck = (p: P) => base(p, <path d="M4.5 12.5 10 18 19.5 6.5" />);
export const IcReset = (p: P) => base(p, <><path d="M4.5 8A8.5 8.5 0 1 1 3.6 13" /><path d="M4.5 3.5V8H9" /></>);
export const IcArrow = (p: P) => base(p, <path d="M4 12h15M13.5 6 19.5 12l-6 6" />);
export const IcChip = (p: P) =>
  base(p, <><rect x="7" y="7" width="10" height="10" rx="1.5" /><rect x="10.2" y="10.2" width="3.6" height="3.6" /><path d="M9.5 7V3.5M14.5 7V3.5M9.5 20.5V17M14.5 20.5V17M7 9.5H3.5M7 14.5H3.5M20.5 9.5H17M20.5 14.5H17" /></>);
export const IcLink = (p: P) =>
  base(p, <><path d="M10 14a4 4 0 0 0 6 .5l2.5-2.5a4 4 0 1 0-5.7-5.7L11.5 7.5" /><path d="M14 10a4 4 0 0 0-6-.5l-2.5 2.5a4 4 0 1 0 5.7 5.7l1.3-1.2" /></>);

/* ---------------- Ambient circuit background ---------------- */
const TRACES = [
  "M -20 140 H 240 L 300 200 H 560 L 620 140 H 900",
  "M -20 320 H 180 L 240 260 H 520 L 580 320 H 860 L 920 260 H 1460",
  "M -20 540 H 320 L 380 480 H 700 L 760 540 H 1460",
  "M -20 760 H 200 L 260 820 H 640 L 700 760 H 1000 L 1060 820 H 1460",
];
const PADS: Array<[number, number]> = [
  [240, 140], [560, 200], [180, 320], [580, 320], [320, 540], [700, 480], [200, 760], [1000, 760],
];

export function CircuitBackground() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1100px 600px at 78% -10%, #0c241a 0%, transparent 60%), radial-gradient(900px 700px at -10% 40%, #0a2018 0%, transparent 55%), linear-gradient(180deg, #071510 0%, #050f0b 45%, #040d09 100%)",
        }}
      />
      <div className="dotgrid absolute inset-0 opacity-60" />
      <svg className="absolute inset-x-0 top-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {TRACES.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#143226" strokeWidth={i % 2 ? 2 : 3} />
        ))}
        {PADS.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={7} fill="none" stroke="#143226" strokeWidth={2} />
            <circle cx={x} cy={y} r={2.4} fill="#143226" />
          </g>
        ))}
        {!reduced &&
          TRACES.map((d, i) => (
            <circle key={`p${i}`} r={3.4} fill="#f6c489" opacity={0.6}>
              <animateMotion dur={`${11 + i * 4}s`} repeatCount="indefinite" path={d} begin={`${i * 2.4}s`} />
            </circle>
          ))}
      </svg>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 50% 0%, transparent 50%, rgba(2,8,6,0.85) 100%)" }}
      />
    </div>
  );
}
