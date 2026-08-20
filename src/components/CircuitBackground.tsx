import { useEffect, useState } from "react";

const TRACES = [
  "M -20 140 H 240 L 300 200 H 560 L 620 140 H 900",
  "M -20 320 H 180 L 240 260 H 520 L 580 320 H 860 L 920 260 H 1460",
  "M -20 540 H 320 L 380 480 H 700 L 760 540 H 1460",
  "M -20 760 H 200 L 260 820 H 640 L 700 760 H 1000 L 1060 820 H 1460",
];

const PADS: Array<[number, number]> = [
  [240, 140], [560, 200], [180, 320], [580, 320], [320, 540], [700, 480], [200, 760], [1000, 760],
];

export default function CircuitBackground() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      {/* base wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1100px 600px at 78% -10%, #133024 0%, transparent 60%), radial-gradient(900px 700px at -10% 40%, #11291f 0%, transparent 55%), linear-gradient(180deg, #0c1b15 0%, #0a1712 45%, #091410 100%)",
        }}
      />
      {/* drill grid */}
      <div className="dotgrid absolute inset-0 opacity-60" />
      {/* copper traces + moving pulses */}
      <svg
        className="absolute inset-x-0 top-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {TRACES.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#1b4030" strokeWidth={i % 2 ? 2 : 3} />
        ))}
        {PADS.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={7} fill="none" stroke="#1b4030" strokeWidth={2} />
            <circle cx={x} cy={y} r={2.4} fill="#1b4030" />
          </g>
        ))}
        {!reduced &&
          TRACES.map((d, i) => (
            <circle key={`p${i}`} r={3.4} fill="#f6c489" opacity={0.75}>
              <animateMotion dur={`${11 + i * 4}s`} repeatCount="indefinite" path={d} begin={`${i * 2.4}s`} />
            </circle>
          ))}
      </svg>
      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, transparent 55%, rgba(6,14,11,0.75) 100%)",
        }}
      />
    </div>
  );
}
