import { useId, type ReactElement, type ReactNode } from "react";

/* Stylised "layout excerpt" illustrations drawn as inline SVG —
   precise enough to teach from, consistent with the doc's visual language. */

const CU = "#e0955a";
const GOLD = "#f0cd8d";
const SILK = "#e9f2ea";
const BAD = "#f2685e";
const GOOD = "#55d78e";
const DIM = "#9cb8a7";
const MONO = "var(--font-mono)";

function Mini({ children, caption }: { children: ReactNode; caption?: string }) {
  const dots: Array<[number, number]> = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) dots.push([18 + c * 23, 16 + r * 25]);
  return (
    <svg viewBox="0 0 220 132" className="block h-auto w-full" role="img">
      <rect x="1" y="1" width="218" height="130" rx="8" fill="#0d281e" stroke="#1c4636" strokeWidth="1.5" />
      <g fill="#173a2d">
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.2" />
        ))}
      </g>
      {children}
      {caption && (
        <text x="10" y="123" fontFamily={MONO} fontSize="7.5" letterSpacing="0.08em" fill="#67856f">
          {caption}
        </text>
      )}
    </svg>
  );
}

function Mark({ x, y, ok }: { x: number; y: number; ok: boolean }) {
  const tone = ok ? GOOD : BAD;
  return (
    <g>
      <circle cx={x} cy={y} r="10" fill="#0d281e" stroke={tone} strokeWidth="2" />
      {ok ? (
        <path d={`M ${x - 4.5} ${y} L ${x - 1.2} ${y + 3.6} L ${x + 5} ${y - 3.4}`} fill="none" stroke={tone} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d={`M ${x - 4} ${y - 4} L ${x + 4} ${y + 4} M ${x + 4} ${y - 4} L ${x - 4} ${y + 4}`} stroke={tone} strokeWidth="2.4" strokeLinecap="round" />
      )}
    </g>
  );
}

function Callout({ x, y, r = 19, tone = BAD }: { x: number; y: number; r?: number; tone?: string }) {
  return <circle cx={x} cy={y} r={r} fill="none" stroke={tone} strokeWidth="1.6" strokeDasharray="4 3" opacity="0.95" />;
}

function Dim({ x1, y1, x2, y2, label, tone = DIM }: { x1: number; y1: number; x2: number; y2: number; label: string; tone?: string }) {
  const horizontal = y1 === y2;
  const y = y1;
  const x = x1;
  const arrowA = horizontal
    ? `M ${x1} ${y} l 6 -3.4 v 6.8 z`
    : `M ${x} ${y1} l -3.4 6 h 6.8 z`;
  const arrowB = horizontal
    ? `M ${x2} ${y} l -6 -3.4 v 6.8 z`
    : `M ${x} ${y2} l -3.4 -6 h 6.8 z`;
  const midX = horizontal ? (x1 + x2) / 2 : x1;
  const midY = horizontal ? y - 5 : (y1 + y2) / 2 + 3;
  return (
    <g>
      <path d={horizontal ? `M ${x1} ${y} H ${x2}` : `M ${x} ${y1} V ${y2}`} stroke={tone} strokeWidth="1.1" />
      <path d={arrowA} fill={tone} />
      <path d={arrowB} fill={tone} />
      <text x={horizontal ? midX : midX + 7} y={midY} textAnchor={horizontal ? "middle" : "start"} fontFamily={MONO} fontSize="8" fill={tone}>
        {label}
      </text>
    </g>
  );
}

function Hatch({ x, y, w, h, tone = "#2b6a50", gap = 7 }: { x: number; y: number; w: number; h: number; tone?: string; gap?: number }) {
  const id = "h" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <g>
      <defs>
        <pattern id={id} width={gap} height={gap} patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2={gap} stroke={tone} strokeWidth="1.4" />
        </pattern>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={`url(#${id})`} stroke={tone} strokeWidth="1.2" />
    </g>
  );
}

function ThPad({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="9" fill={GOLD} />
      <circle cx={x} cy={y} r="3.4" fill="#0d281e" />
    </g>
  );
}

function Smd({ x, y, w = 20, h = 12 }: { x: number; y: number; w?: number; h?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx="2.5" fill={GOLD} />;
}

function Lbl({
  x,
  y,
  children,
  tone = DIM,
  size = 8.5,
  anchor = "middle",
}: {
  x: number;
  y: number;
  children: ReactNode;
  tone?: string;
  size?: number;
  anchor?: "middle" | "start" | "end";
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily={MONO} fontSize={size} fill={tone}>
      {children}
    </text>
  );
}

/* ------------------------------------------------------------------ */

const Corners = () => (
  <Mini caption="MITRE EVERY TURN">
    <path d="M 22 100 H 88 L 128 58 H 198" fill="none" stroke={CU} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 22 100 H 88 L 128 58 H 198" fill="none" stroke="#8a5a33" strokeWidth="3" strokeDasharray="1 8" />
    <Mark x={182} y={28} ok />
    <Lbl x={100} y={42} tone={GOOD}>45°</Lbl>
  </Mini>
);

const Corner90 = () => (
  <Mini caption="RIGHT ANGLE = ACID TRAP">
    <path d="M 22 98 H 108 V 34 H 198" fill="none" stroke={CU} strokeWidth="11" strokeLinecap="round" strokeLinejoin="miter" />
    <path d="M 114 92 L 128 92 L 114 78 Z" fill={BAD} opacity="0.85" />
    <Callout x={112} y={92} r={21} />
    <Lbl x={150} y={112} tone={BAD}>etchant pools here</Lbl>
  </Mini>
);

const NetClass = () => (
  <Mini caption="NET CLASSES">
    <path d="M 24 34 H 138" stroke={CU} strokeWidth="16" />
    <path d="M 24 68 H 168" stroke={CU} strokeWidth="10" />
    <path d="M 24 100 H 118" stroke={CU} strokeWidth="5.5" />
    <Lbl x={152} y={37} tone={GOLD} anchor="start">PWR 0.5 mm</Lbl>
    <Lbl x={180} y={71} tone={GOLD} anchor="start">SIG 0.25</Lbl>
    <Lbl x={130} y={103} tone={GOLD} anchor="start">AUX 0.15</Lbl>
    <Mark x={198} y={100} ok />
  </Mini>
);

const Neckdown = () => (
  <Mini caption="WIDTH MUST HOLD">
    <path d="M 20 66 H 78" stroke={CU} strokeWidth="13" />
    <path d="M 78 66 H 142" stroke={CU} strokeWidth="3.5" />
    <path d="M 142 66 H 200" stroke={CU} strokeWidth="13" />
    <Callout x={110} y={66} r={24} />
    <Lbl x={110} y={104} tone={BAD}>below class width</Lbl>
    <Lbl x={110} y={30} tone={BAD}>it becomes a fuse</Lbl>
  </Mini>
);

const Relief = () => (
  <Mini caption="THERMAL RELIEF">
    <Hatch x={16} y={14} w={188} h={104} />
    <path d="M 110 42 V 26 M 110 90 V 106 M 86 66 H 70 M 134 66 H 150" stroke={CU} strokeWidth="7" />
    <circle cx={110} cy={66} r="17" fill={GOLD} />
    <circle cx={110} cy={66} r="6" fill="#0d281e" />
    <Mark x={186} y={26} ok />
    <Lbl x={110} y={14} tone={GOOD} size={7.5}> </Lbl>
  </Mini>
);

const Stitch = () => (
  <Mini caption="STITCHED POURS">
    <Hatch x={16} y={16} w={188} h={44} />
    <Hatch x={16} y={76} w={188} h={40} />
    {[56, 110, 164].map((x) => (
      <g key={x}>
        <path d={`M ${x} 58 V 78`} stroke={DIM} strokeWidth="1.2" strokeDasharray="3 3" />
        <circle cx={x} cy={68} r="6.5" fill={GOLD} />
        <circle cx={x} cy={68} r="2.6" fill="#0d281e" />
      </g>
    ))}
    <Lbl x={24} y={42} tone="#7fd6b4" anchor="start">GND top</Lbl>
    <Lbl x={24} y={100} tone="#7fd6b4" anchor="start">GND bottom</Lbl>
    <Mark x={192} y={68} ok />
  </Mini>
);

const ViaInPad = () => (
  <Mini caption="VIA PLACEMENT">
    <path d="M 110 18 V 114" stroke="#1c4636" strokeWidth="1.4" strokeDasharray="5 4" />
    <Smd x={40} y={52} w={52} h={30} />
    <circle cx={66} cy={67} r="7.5" fill="#0d281e" stroke={SILK} strokeWidth="1.4" />
    <Mark x={66} y={104} ok={false} />
    <Lbl x={66} y={30} tone={BAD}>via in pad</Lbl>
    <Smd x={130} y={52} w={52} h={30} />
    <circle cx={196} cy={67} r="7.5" fill="#0d281e" stroke={SILK} strokeWidth="1.4" />
    <path d="M 184 67 H 192" stroke={CU} strokeWidth="5" />
    <Mark x={196} y={104} ok />
    <Lbl x={164} y={30} tone={GOOD}>via outside</Lbl>
  </Mini>
);

const Flood = () => (
  <Mini caption="POUR CLEARANCE">
    <Hatch x={16} y={16} w={120} h={100} />
    <circle cx={120} cy={50} r="13" fill={GOLD} />
    <circle cx={120} cy={50} r="4.5" fill="#0d281e" />
    <Callout x={112} y={42} r={17} />
    <Lbl x={76} y={96} tone={BAD} anchor="start">0.0 mm — short</Lbl>
    <circle cx={176} cy={66} r="13" fill={GOLD} />
    <circle cx={176} cy={66} r="4.5" fill="#0d281e" />
    <circle cx={176} cy={66} r="19" fill="none" stroke={GOOD} strokeWidth="1.4" strokeDasharray="4 3" />
    <Lbl x={176} y={106} tone={GOOD}>cleared</Lbl>
  </Mini>
);

const Footprint = () => (
  <Mini caption="IPC-7351 LEVEL B">
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <Smd x={52} y={26 + i * 22} w={26} h={13} />
        <Smd x={142} y={26 + i * 22} w={26} h={13} />
      </g>
    ))}
    <rect x={86} y={22} width={48} height={88} fill="none" stroke={SILK} strokeWidth="1.3" />
    <circle cx={93} cy={32} r="2.6" fill={SILK} />
    <Dim x1={78} y1={16} x2={142} y2={16} label="pitch ok" tone={GOOD} />
    <Mark x={196} y={110} ok />
  </Mini>
);

const Pin1 = () => (
  <Mini caption="POLARITY MARKED">
    <rect x={76} y={20} width={68} height={92} rx="3" fill="none" stroke={SILK} strokeWidth="1.4" />
    <path d="M 102 20 a 8 8 0 0 0 16 0" fill="none" stroke={SILK} strokeWidth="1.4" />
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <ThPad x={56} y={34 + i * 22} />
        <ThPad x={164} y={34 + i * 22} />
      </g>
    ))}
    <circle cx={56} cy={34} r="13" fill="none" stroke={GOOD} strokeWidth="1.6" />
    <path d="M 50 15 L 56 7 L 62 15 Z" fill={SILK} />
    <Lbl x={56} y={60} tone={GOOD}>1</Lbl>
    <Mark x={196} y={26} ok />
  </Mini>
);

const SketchFp = () => (
  <Mini caption="UNVERIFIED PADS">
    <path d="M 40 40 q 4 -6 26 -4 q 6 1 5 10 q -1 9 -14 8 q -20 -1 -17 -14" fill={GOLD} opacity="0.9" />
    <path d="M 130 70 q 8 -8 30 -2 q 8 3 4 12 q -5 10 -20 7 q -18 -4 -14 -17" fill={GOLD} opacity="0.9" />
    <Dim x1={40} y1={86} x2={72} y2={86} label="1.1?" tone={BAD} />
    <Dim x1={132} y1={106} x2={168} y2={106} label="1.4?" tone={BAD} />
    <Lbl x={110} y={26} tone={BAD}>sketched by eye</Lbl>
    <Mark x={196} y={24} ok={false} />
  </Mini>
);

const Mirror = () => (
  <Mini caption="WRONG LAYER VIEW">
    <rect x={46} y={36} width={128} height={56} rx="3" fill="none" stroke={SILK} strokeWidth="1.3" />
    <g transform="translate(110 64) scale(-1 1)">
      <text x={0} y={6} textAnchor="middle" fontFamily={MONO} fontSize="13" fill={SILK}>U3</text>
    </g>
    {[0, 1, 2].map((i) => (
      <Smd key={i} x={56 + i * 38} y={26} w={18} h={10} />
    ))}
    {[0, 1, 2].map((i) => (
      <Smd key={`b${i}`} x={56 + i * 38} y={92} w={18} h={10} />
    ))}
    <Lbl x={110} y={84} tone={BAD}>text mirrored</Lbl>
    <Mark x={196} y={24} ok={false} />
  </Mini>
);

const RefDes = () => (
  <Mini caption="LABELS OUTSIDE BODY">
    <rect x={70} y={44} width={80} height={48} rx="4" fill="none" stroke={SILK} strokeWidth="1.4" />
    <path d="M 70 56 a 10 10 0 0 1 0 24" fill="none" stroke={SILK} strokeWidth="1.4" />
    <Smd x={52} y={52} w={16} h={10} />
    <Smd x={52} y={74} w={16} h={10} />
    <Smd x={152} y={52} w={16} h={10} />
    <Smd x={152} y={74} w={16} h={10} />
    <path d="M 128 40 L 152 26" stroke={DIM} strokeWidth="1.1" />
    <Lbl x={166} y={24} tone={SILK} size={11}>C12</Lbl>
    <Mark x={32} y={28} ok />
    <Lbl x={110} y={116} tone={GOOD} size={7.5}>1.2 mm tall, outside body</Lbl>
  </Mini>
);

const SilkPad = () => (
  <Mini caption="KEEP INK OFF COPPER">
    <Smd x={46} y={48} w={40} h={26} />
    <Smd x={46} y={84} w={40} h={26} />
    <path d="M 30 96 L 100 40" stroke={SILK} strokeWidth="3" opacity="0.9" />
    <path d="M 34 104 L 104 48" stroke={SILK} strokeWidth="1.6" opacity="0.7" />
    <Callout x={72} y={60} r={20} />
    <Lbl x={150} y={58} tone={BAD}>ink on pad</Lbl>
    <Lbl x={150} y={72} tone={BAD} size={7.5}>solder won't wet</Lbl>
    <Mark x={192} y={104} ok={false} />
  </Mini>
);

const NoPolarity = () => (
  <Mini caption="MARK THE CATHODE">
    <rect x={62} y={44} width={96} height={44} rx="4" fill="#17362a" stroke={SILK} strokeWidth="1.3" />
    <rect x={62} y={44} width={20} height={44} rx="4" fill="#1f4636" stroke={SILK} strokeWidth="1.3" />
    <path d="M 42 66 H 62 M 158 66 H 178" stroke={CU} strokeWidth="6" />
    <text x={110} y={72} textAnchor="middle" fontFamily={MONO} fontSize="14" fill={BAD} opacity="0.85">?</text>
    <Callout x={110} y={66} r={24} />
    <Lbl x={110} y={112} tone={BAD}>no band, no dot, no plus</Lbl>
  </Mini>
);

const Drc = () => (
  <Mini caption="DRC @ FAB LIMITS">
    <path d="M 24 46 H 196" stroke={CU} strokeWidth="9" />
    <path d="M 24 92 H 196" stroke={CU} strokeWidth="9" />
    <Dim x1={110} y1={53} x2={110} y2={85} label="0.2 mm" tone={GOOD} />
    <Mark x={192} y={24} ok />
    <Lbl x={26} y={26} tone={GOOD} anchor="start" size={9}>0 errors · 0 warnings</Lbl>
  </Mini>
);

const Sliver = () => (
  <Mini caption="ISOLATED ISLANDS">
    <Smd x={42} y={42} w={34} h={48} />
    <Smd x={144} y={42} w={34} h={48} />
    <path d="M 92 40 L 112 66 L 92 92 L 96 66 Z" fill={CU} opacity="0.95" />
    <Callout x={100} y={66} r={21} />
    <Lbl x={110} y={114} tone={BAD}>sliver can bridge pads</Lbl>
  </Mini>
);

const Creepage = () => (
  <Mini caption="SURFACE DISTANCE">
    <rect x={24} y={34} width={70} height={64} rx="4" fill={CU} opacity="0.85" />
    <rect x={112} y={34} width={70} height={64} rx="4" fill={CU} opacity="0.85" />
    <Dim x1={96} y1={66} x2={110} y2={66} label="" tone={BAD} />
    <Lbl x={103} y={56} tone={BAD} size={8}>0.4!</Lbl>
    <path d="M 100 14 l -6 10 h 6 l -5 10" fill="none" stroke={BAD} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <Lbl x={140} y={24} tone={BAD} anchor="start">tracking arc risk</Lbl>
  </Mini>
);

const Gerbers = () => (
  <Mini caption="FULL SET, EYEBALLED">
    {[
      ["GT L", "#e0955a"], ["GB L", "#c77f45"], ["GTS", "#2b6a50"], ["DRL", "#9cb8a7"],
    ].map(([t, c], i) => (
      <g key={t}>
        <rect x={34 + i * 7} y={76 - i * 14} width={104} height={26} rx="3" fill="#0f231b" stroke={c as string} strokeWidth="1.4" />
        <text x={44 + i * 7} y={93 - i * 14} fontFamily={MONO} fontSize="9" fill={c as string}>{t}</text>
      </g>
    ))}
    <Mark x={188} y={30} ok />
    <Lbl x={188} y={112} tone={GOOD} size={7.5}>+ paste + outline</Lbl>
  </Mini>
);

const Drill = () => (
  <Mini caption="DRILL ↔ PADS">
    <ThPad x={46} y={46} />
    <ThPad x={46} y={92} />
    <ThPad x={110} y={46} />
    <ThPad x={110} y={92} />
    <g opacity="0.9">
      <circle cx={110} cy={46} r="3.4" fill="none" stroke={BAD} strokeWidth="1.4" />
      <path d="M 96 32 v 10 M 91 37 h 10" stroke={BAD} strokeWidth="1.4" />
      <circle cx={160} cy={70} r="3.4" fill="none" stroke={BAD} strokeWidth="1.4" />
      <path d="M 160 58 v 8 M 156 62 h 8" stroke={BAD} strokeWidth="1.4" />
      <circle cx={178} cy={100} r="3.4" fill="none" stroke={BAD} strokeWidth="1.4" />
      <path d="M 178 90 v 8 M 174 94 h 8" stroke={BAD} strokeWidth="1.4" />
    </g>
    <Callout x={110} y={46} r={16} />
    <Lbl x={150} y={28} tone={BAD}>hits off-pad</Lbl>
    <Lbl x={150} y={122} tone={BAD} size={7.5}>or missing entirely</Lbl>
  </Mini>
);

/* ------------------------------------------------------------------ */

export const DIAGRAMS: Record<string, () => ReactElement> = {
  corners: Corners,
  corner90: Corner90,
  netclass: NetClass,
  neckdown: Neckdown,
  relief: Relief,
  stitch: Stitch,
  viapad: ViaInPad,
  flood: Flood,
  footprint: Footprint,
  pin1: Pin1,
  sketchfp: SketchFp,
  mirror: Mirror,
  refdes: RefDes,
  silkpad: SilkPad,
  nopolarity: NoPolarity,
  drc: Drc,
  sliver: Sliver,
  creepage: Creepage,
  gerbers: Gerbers,
  drill: Drill,
};

export const DIAGRAM_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "corners", label: "45° mitred corners (good)" },
  { value: "corner90", label: "90° corner / acid trap (bad)" },
  { value: "netclass", label: "Net class trace widths" },
  { value: "neckdown", label: "Neck-down trace" },
  { value: "relief", label: "Thermal relief spokes" },
  { value: "stitch", label: "Stitched ground pour" },
  { value: "viapad", label: "Via in / outside SMD pad" },
  { value: "flood", label: "Pour flooding a pad" },
  { value: "footprint", label: "IPC footprint + pitch" },
  { value: "pin1", label: "Pin 1 marking" },
  { value: "sketchfp", label: "Hand-sketched footprint" },
  { value: "mirror", label: "Mirrored footprint" },
  { value: "refdes", label: "Reference designator" },
  { value: "silkpad", label: "Silkscreen over pads" },
  { value: "nopolarity", label: "Missing polarity mark" },
  { value: "drc", label: "DRC clearance check" },
  { value: "sliver", label: "Copper sliver" },
  { value: "creepage", label: "Creepage violation" },
  { value: "gerbers", label: "Gerber layer stack" },
  { value: "drill", label: "Drill file mismatch" },
];
