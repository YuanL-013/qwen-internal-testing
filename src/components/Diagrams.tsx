import { createContext, useId, useContext, type ReactElement, type ReactNode } from "react";

/* Stylised "layout excerpt" illustrations drawn as inline SVG —
   precise enough to teach from, consistent with the doc's visual language. */

const CU = "#e0955a";
const GOLD = "#f0cd8d";
const SILK = "#e9f2ea";
const BAD = "#f2685e";
const GOOD = "#55d78e";
const DIM = "#9cb8a7";
const MONO = "var(--font-mono)";

/* NOT-OKAY diagrams are wrapped in <RedTone> so their substrate reads red. */
const ToneCtx = createContext(false);
export function RedTone({ children }: { children: ReactNode }) {
  return <ToneCtx.Provider value>{children}</ToneCtx.Provider>;
}

function Mini({ children, caption }: { children: ReactNode; caption?: string }) {
  const red = useContext(ToneCtx);
  const bg = red ? "#231210" : "#0d281e";
  const frame = red ? "#4a251f" : "#1c4636";
  const dot = red ? "#3a1d18" : "#173a2d";
  const cap = red ? "#8f6a5f" : "#67856f";
  const dots: Array<[number, number]> = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) dots.push([18 + c * 23, 16 + r * 25]);
  return (
    <svg viewBox="0 0 220 132" className="block h-auto w-full" role="img">
      <rect x="1" y="1" width="218" height="130" rx="8" fill={bg} stroke={frame} strokeWidth="1.5" />
      <g fill={dot}>
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.2" />
        ))}
      </g>
      {children}
      {caption && (
        <text x="10" y="123" fontFamily={MONO} fontSize="7.5" letterSpacing="0.08em" fill={cap}>
          {caption}
        </text>
      )}
    </svg>
  );
}

/* Verdict ticks/crosses now live on the card chrome (border colour + label),
   not inside the drawing — they kept covering the diagrams. */
function Mark(_p: { x: number; y: number; ok: boolean }) {
  return null;
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
    {/* stale etchant pooling tight into the inner notch */}
    <path d="M 113.5 92.5 L 131 92.5 A 17.5 17.5 0 0 0 113.5 75 Z" fill={BAD} opacity="0.78" />
    <circle cx={121} cy={86} r={1.6} fill="#fbd4d0" opacity="0.9" />
    <circle cx={117} cy={80.5} r={1.1} fill="#fbd4d0" opacity="0.85" />
    <circle cx={125.5} cy={89.5} r={1.2} fill="#fbd4d0" opacity="0.85" />
    {/* both copper walls eaten back beside the pool */}
    <path d="M 116 94.6 H 125" stroke={BAD} strokeWidth="1.2" strokeDasharray="2.5 2" />
    <path d="M 111.4 90 V 81" stroke={BAD} strokeWidth="1.2" strokeDasharray="2.5 2" />
    <Callout x={121} y={84} r={23} />
    <path d="M 144 84 H 149" stroke={BAD} strokeWidth="1.2" />
    <Lbl x={151} y={80} tone={BAD} anchor="start" size={7.5}>pooled etchant</Lbl>
    <Lbl x={151} y={92} tone={BAD} anchor="start" size={7.5}>eats both walls</Lbl>
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
    <Lbl x={210} y={112} tone={GOOD} size={7.5} anchor="end">+ paste + outline</Lbl>
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

/* --------------------------- senior review batch --------------------------- */

function CapG({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={CU} fill="none">
      <path d={`M ${x} ${y - 9} V ${y - 2.6} M ${x} ${y + 2.6} V ${y + 9}`} strokeWidth="2.2" />
      <path d={`M ${x - 6.5} ${y - 2.6} H ${x + 6.5} M ${x - 6.5} ${y + 2.6} H ${x + 6.5}`} strokeWidth="2.8" />
    </g>
  );
}

/** series cap on a horizontal trace (vertical plates) */
function CapGV({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={CU} fill="none">
      <path d={`M ${x - 9} ${y} H ${x - 2.6} M ${x + 2.6} ${y} H ${x + 9}`} strokeWidth="2.2" />
      <path d={`M ${x - 2.6} ${y - 6.5} V ${y + 6.5} M ${x + 2.6} ${y - 6.5} V ${y + 6.5}`} strokeWidth="2.8" />
    </g>
  );
}

const Decap = () => (
  <Mini caption="ONE PIN — ONE CAP">
    <rect x="22" y="22" width="46" height="88" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={45} y={70} tone={SILK} size={11}>MCU</Lbl>
    {[36, 66, 96].map((y) => (
      <g key={y}>
        <path d={`M 68 ${y} H 104`} stroke={CU} strokeWidth="4" />
        <CapG x={104} y={y} />
        <path d={`M 104 ${y + 9} V ${y + 17}`} stroke={CU} strokeWidth="2.2" />
        <circle cx={104} cy={y + 20} r="4" fill={GOLD} />
        <circle cx={104} cy={y + 20} r="1.6" fill="#0d281e" />
      </g>
    ))}
    <Lbl x={160} y={30} tone={GOOD} size={7.5}>100 nF each</Lbl>
    <Hatch x={84} y={44} w={120} h={76} tone="#2b6a50" />
    <Lbl x={167} y={74} tone="#7fd6b4" size={7.5}>3.3 ZONE</Lbl>
    <Lbl x={167} y={86} tone="#7fd6b4" size={7.5}>BACK LAYER</Lbl>
  </Mini>
);

const DecapBunch = () => (
  <Mini caption="SHARED CAP = COUPLED NOISE">
    <rect x="22" y="26" width="42" height="80" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={43} y={70} tone={SILK} size={10}>MCU</Lbl>
    {[40, 66, 92].map((y) => (
      <path key={y} d={`M 64 ${y} H 92`} stroke={CU} strokeWidth="4" />
    ))}
    <path d="M 92 40 V 92" stroke={CU} strokeWidth="4" fill="none" />
    <path d="M 92 66 H 140 V 76" stroke={CU} strokeWidth="4" fill="none" />
    <CapG x={140} y={85} />
    <path d="M 140 94 V 104" stroke={CU} strokeWidth="2.2" />
    <circle cx={140} cy={108} r="4" fill={GOLD} />
    <circle cx={140} cy={108} r="1.6" fill="#0d281e" />
    <Callout x={116} y={66} r={30} />
    <Lbl x={172} y={30} tone={BAD} size={7.5}>one cap feeds</Lbl>
    <Lbl x={172} y={42} tone={BAD} size={7.5}>three pins</Lbl>
    <Lbl x={104} y={117} tone={BAD} size={7.5}>all return currents share the bunch</Lbl>
  </Mini>
);

const ThermalVias = () => (
  <Mini caption="TAB → VIAS → GND COPPER">
    <rect x="70" y="16" width="80" height="30" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={110} y={35} tone={SILK} size={9.5}>REGULATOR</Lbl>
    <rect x="90" y="46" width="40" height="34" fill={GOLD} stroke="#b98d54" strokeWidth="1.2" />
    {[98, 110, 122].map((x) =>
      [54, 66, 74].map((y) => (
        <g key={`${x}${y}`}>
          <circle cx={x} cy={y} r="3.2" fill="#0d281e" stroke="#8a6a3c" strokeWidth="1.4" />
        </g>
      ))
    )}
    <path d="M 98 84 V 94 M 110 84 V 94 M 122 84 V 94" stroke={DIM} strokeWidth="1.4" strokeDasharray="3 2.5" />
    <Hatch x={30} y={94} w={160} h={24} tone="#2b6a50" />
    <Lbl x={110} y={110} tone="#7fd6b4" size={8}>GND COPPER SPREADS THE HEAT</Lbl>
    <Mark x={196} y={30} ok />
  </Mini>
);

const RailZone = () => (
  <Mini caption="RAILS LEAVE ON COPPER">
    <rect x="16" y="40" width="46" height="42" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={39} y={58} tone={SILK} size={8.5}>5V SW</Lbl>
    <Lbl x={39} y={70} tone={DIM} size={7}>LM1117…</Lbl>
    <path d="M 62 46 L 128 36 L 180 44 V 70 L 128 78 L 62 68 Z" fill="none" stroke={CU} strokeWidth="1.6" />
    <Hatch x={64} y={40} w={114} h={34} tone="#8a5a33" gap={6} />
    <rect x="180" y="44" width="26" height="26" fill="none" stroke={GOLD} strokeWidth="1.6" />
    <Lbl x={193} y={61} tone={GOLD} size={9}>L1</Lbl>
    <Lbl x={120} y={100} tone={GOOD}>wide copper straight into the inductor</Lbl>
    <Mark x={196} y={22} ok />
  </Mini>
);

const ThinRail = () => (
  <Mini caption="RAILS ARE NOT SIGNALS">
    <rect x="16" y="44" width="46" height="38" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={39} y={60} tone={SILK} size={8.5}>5V SW</Lbl>
    <Lbl x={39} y={72} tone={DIM} size={7}>3V3 LDO</Lbl>
    <path d="M 62 60 H 92 q 10 0 12 -9 q 2 -8 12 -8 H 150 q 12 0 14 10 q 2 9 14 9 H 180" fill="none" stroke={CU} strokeWidth="2.4" />
    <rect x="180" y="48" width="26" height="26" fill="none" stroke={GOLD} strokeWidth="1.6" />
    <Lbl x={193} y={65} tone={GOLD} size={9}>L1</Lbl>
    <Callout x={122} y={48} r={26} />
    <Lbl x={122} y={92} tone={BAD}>signal-width wire on a power rail</Lbl>
    <Lbl x={122} y={106} tone={BAD} size={7.5}>IR drop + heat + loop inductance</Lbl>
  </Mini>
);

const WrongCap = () => (
  <Mini caption="µF ≠ pF — CHECK THE ORDER">
    <rect x="24" y="38" width="58" height="42" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={53} y={56} tone={SILK} size={8.5}>REG</Lbl>
    <Lbl x={53} y={68} tone={DIM} size={7}>3V3 OUT</Lbl>
    <path d="M 82 58 H 119" stroke={CU} strokeWidth="4" />
    <CapGV x={128} y={58} />
    <path d="M 137 58 H 176" stroke={CU} strokeWidth="4" />
    <Lbl x={188} y={61} tone={DIM} size={7.5}>to load</Lbl>
    <Callout x={128} y={58} r={22} />
    <Lbl x={110} y={96} tone={BAD} size={10}>22 pF !</Lbl>
    <Lbl x={110} y={110} tone={GOOD} size={8}>wanted 22 µF</Lbl>
    <Lbl x={172} y={96} tone={BAD} size={7.5}>1000× too small —</Lbl>
    <Lbl x={172} y={108} tone={BAD} size={7.5}>loop has no bulk</Lbl>
  </Mini>
);

const CanPair = () => (
  <Mini caption="MIRROR SYMMETRY">
    <Lbl x={20} y={16} tone={GOOD} anchor="start" size={7.5}>LENGTHS MATCHED — NOISE CANCELS</Lbl>
    <path d="M 16 64 H 204" stroke={DIM} strokeWidth="1" strokeDasharray="6 4" opacity="0.8" />
    <Lbl x={20} y={60} tone={DIM} anchor="start" size={7}>MIRROR AXIS</Lbl>
    <path d="M 22 44 H 84 L 116 24 H 198" fill="none" stroke={CU} strokeWidth="5" strokeLinejoin="round" />
    <path d="M 22 84 H 84 L 116 104 H 198" fill="none" stroke={CU} strokeWidth="5" strokeLinejoin="round" />
    <Lbl x={32} y={38} tone={GOLD} anchor="start" size={8}>CANH</Lbl>
    <Lbl x={32} y={98} tone={GOLD} anchor="start" size={8}>CANL</Lbl>
    <path d="M 60 44 l 6 -8 M 60 84 l 6 8" stroke={GOOD} strokeWidth="2" />
    <path d="M 140 24 l 6 -8 M 140 104 l 6 8" stroke={GOOD} strokeWidth="2" />
    <path d="M 22 114 H 198" stroke={GOOD} strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
    <Lbl x={110} y={124} tone={GOOD} size={7}>SAME LENGTH · SAME BENDS · SAME SPACING</Lbl>
    <Mark x={196} y={56} ok />
  </Mini>
);

const CanSplit = () => (
  <Mini caption="SPLIT PAIR = ANTENNA">
    <path d="M 22 44 H 96 L 128 24 H 198" fill="none" stroke={CU} strokeWidth="5" strokeLinejoin="round" />
    <path d="M 22 88 H 60 L 92 108 H 128 L 160 88 H 198" fill="none" stroke={CU} strokeWidth="5" strokeLinejoin="round" />
    <Lbl x={32} y={38} tone={GOLD} anchor="start" size={8}>CANH</Lbl>
    <Lbl x={32} y={102} tone={GOLD} anchor="start" size={8}>CANL</Lbl>
    <path d="M 178 24 V 88" stroke={BAD} strokeWidth="1.4" strokeDasharray="4 3" />
    <Callout x={178} y={56} r={17} />
    <Lbl x={170} y={60} tone={BAD} anchor="end" size={7.5}>skew</Lbl>
    <Lbl x={110} y={14} tone={BAD} size={7.5}>arrives at different times</Lbl>
    <Lbl x={20} y={122} tone={BAD} anchor="start" size={7}>split paths pick up different noise</Lbl>
    <Mark x={196} y={110} ok={false} />
  </Mini>
);

const XtalRing = () => (
  <Mini caption="GND GUARD RING">
    <path d="M 22 28 V 74" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={14} y={52} tone={DIM} size={8}>MCU</Lbl>
    <path d="M 22 40 H 84 M 22 62 H 84" stroke={CU} strokeWidth="3.2" />
    <rect x="84" y="40" width="52" height="22" fill="#17362a" stroke={GOLD} strokeWidth="1.5" />
    <Lbl x={110} y={54} tone={GOLD} size={8}>X1</Lbl>
    {[92, 110, 128].map((x) => (
      <g key={x}>
        <circle cx={x} cy={30} r="4.2" fill={GOLD} />
        <circle cx={x} cy={30} r="1.7" fill="#0d281e" />
        <circle cx={x} cy={72} r="4.2" fill={GOLD} />
        <circle cx={x} cy={72} r="1.7" fill="#0d281e" />
      </g>
    ))}
    <rect x="62" y="18" width="96" height="66" fill="none" stroke={GOOD} strokeWidth="1.3" strokeDasharray="4 3" />
    <Lbl x={110} y={100} tone={GOOD} size={7.5}>vias stitch the ring to the GND plane</Lbl>
    <Mark x={192} y={50} ok />
  </Mini>
);

const CapOrient = () => (
  <Mini caption="POLARITY — STRIPE TO MARK">
    <rect x="34" y="30" width="60" height="56" rx="6" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <rect x="76" y="30" width="18" height="56" rx="6" fill="#1f4636" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={85} y={62} tone={SILK} size={10}>−</Lbl>
    <Lbl x={52} y={62} tone={SILK} size={10}>+</Lbl>
    <circle cx="152" cy="58" r="26" fill="none" stroke={SILK} strokeWidth="1.4" strokeDasharray="5 4" />
    <path d="M 152 20 v 10 M 147 25 h 10" stroke={SILK} strokeWidth="1.6" />
    <Lbl x={152} y={62} tone={SILK} size={10}>+</Lbl>
    <path d="M 94 58 H 126" stroke={DIM} strokeWidth="1.2" strokeDasharray="3 3" />
    <Lbl x={110} y={50} tone={DIM} size={7.5}>match</Lbl>
    <Lbl x={110} y={112} tone={GOOD} size={7.5}>stripe side lands on the marked half</Lbl>
    <Mark x={196} y={96} ok />
  </Mini>
);

const AntiPad = () => (
  <Mini caption="ANNULAR RING INTACT">
    <ThPad x={56} y={60} />
    <circle cx={56} cy={60} r="13" fill="none" stroke={GOOD} strokeWidth="1.4" />
    <Lbl x={56} y={32} tone={GOOD} size={7.5}>ring ≥ fab min</Lbl>
    <rect x="128" y="46" width="26" height="28" fill={GOLD} />
    <circle cx="154" cy="60" r="7" fill="#0d281e" stroke={SILK} strokeWidth="1.3" />
    <Callout x={150} y={60} r={18} />
    <Lbl x={120} y={94} tone={BAD} anchor="start" size={7.5}>drill breaks the pad edge</Lbl>
    <Mark x={56} y={100} ok />
    <Mark x={166} y={104} ok={false} />
  </Mini>
);

const Mount = () => (
  <Mini caption="MOUNTING HOLES">
    <circle cx="70" cy="62" r="24" fill="none" stroke={GOOD} strokeWidth="1.4" strokeDasharray="5 3" />
    <circle cx="70" cy="62" r="12" fill={GOLD} />
    <circle cx="70" cy="62" r="5.5" fill="#0d281e" stroke={SILK} strokeWidth="1.2" />
    <Lbl x={70} y={26} tone={GOOD} size={7.5}>copper keep-out ring</Lbl>
    <circle cx="150" cy="62" r="10" fill="#0d281e" stroke={SILK} strokeWidth="1.3" />
    <circle cx="150" cy="62" r="19" fill="none" stroke={DIM} strokeWidth="1" strokeDasharray="4 3" />
    <Lbl x={150} y={26} tone={DIM} size={7.5}>unplated</Lbl>
    <Lbl x={150} y={96} tone={DIM} size={7.5}>screw head clearance</Lbl>
    <Mark x={196} y={100} ok />
  </Mini>
);

const TestPts = () => {
  const pts: Array<[number, string]> = [
    [50, "3V3"],
    [95, "CANH"],
    [140, "CANL"],
    [182, "GND"],
  ];
  return (
    <Mini caption="PROBE POINTS">
      <path d="M 30 66 H 202" stroke={DIM} strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
      {pts.map(([x, n]) => (
        <g key={n}>
          <circle cx={x} cy={66} r="8" fill={GOLD} />
          <circle cx={x} cy={66} r="3" fill="#0d281e" />
          <Lbl x={x} y={48} tone={SILK} size={8}>{n}</Lbl>
        </g>
      ))}
      <Lbl x={110} y={94} tone={GOOD} size={7.5}>1.27 mm grid · labelled · mask opened</Lbl>
      <Mark x={196} y={26} ok />
    </Mini>
  );
};

const Teardrop = () => (
  <Mini caption="TEARDROPS AT PADS">
    <path d="M 74 60 H 198" stroke={CU} strokeWidth="9" />
    <path d="M 72 50.5 L 72 69.5 L 112 64.5 L 112 55.5 Z" fill={CU} />
    <ThPad x={66} y={60} />
    <Callout x={92} y={60} r={27} tone={GOOD} />
    <ThPad x={168} y={28} />
    <path d="M 176 28 H 204" stroke={CU} strokeWidth="9" />
    <Lbl x={160} y={14} tone={BAD} size={7}>no flare — lifts</Lbl>
    <Lbl x={112} y={102} tone={GOOD} size={7.5}>copper flares out into the pad</Lbl>
    <Mark x={36} y={100} ok />
  </Mini>
);

const Courtyard = () => (
  <Mini caption="COURTYARD KEPT CLEAR">
    <Lbl x={110} y={14} tone={DIM} size={7.5}>F.CRTYD</Lbl>
    <rect x="50" y="20" width="120" height="68" fill="none" stroke={GOOD} strokeWidth="1.2" strokeDasharray="5 3" />
    <rect x="78" y="34" width="64" height="40" rx="3" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    {[0, 1].map((i) => (
      <Smd key={`l${i}`} x={58} y={40 + i * 16} w={18} h={10} />
    ))}
    {[0, 1].map((i) => (
      <Smd key={`r${i}`} x={144} y={40 + i * 16} w={18} h={10} />
    ))}
    <Lbl x={110} y={104} tone={GOOD} size={7.5}>0.25–0.5 mm of empty space around the body</Lbl>
    <Mark x={196} y={30} ok />
  </Mini>
);

const Fiducials = () => (
  <Mini caption="FIDUCIALS FOR PICK & PLACE">
    <rect x="22" y="18" width="176" height="96" fill="none" stroke={DIM} strokeWidth="1.3" />
    {(
      [
        [38, 32],
        [182, 32],
        [38, 100],
      ] as Array<[number, number]>
    ).map(([x, y]) => (
      <g key={`${x}-${y}`}>
        <circle cx={x} cy={y} r="7" fill="none" stroke={GOOD} strokeWidth="1.2" />
        <circle cx={x} cy={y} r="3.5" fill={GOLD} />
      </g>
    ))}
    <rect x="120" y="62" width="44" height="34" fill="#17362a" stroke={SILK} strokeWidth="1.3" />
    <circle cx="108" cy="56" r="5" fill="none" stroke={GOOD} strokeWidth="1.1" />
    <circle cx="108" cy="56" r="2.4" fill={GOLD} />
    <circle cx="174" cy="102" r="5" fill="none" stroke={GOOD} strokeWidth="1.1" />
    <circle cx="174" cy="102" r="2.4" fill={GOLD} />
    <Lbl x={104} y={44} tone={DIM} anchor="end" size={7}>local pair</Lbl>
    <Lbl x={110} y={10} tone={GOOD} size={7.5}>3 globals, asymmetric — machine finds orientation</Lbl>
  </Mini>
);

const StarPoint = () => (
  <Mini caption="ONE BRIDGE, ONE POINT">
    <Lbl x={110} y={14} tone={GOOD} size={7.5}>RETURN CURRENTS NEVER CROSS</Lbl>
    <Hatch x={16} y={20} w={76} h={44} tone="#2b6a50" />
    <Lbl x={54} y={44} tone="#7fd6b4" size={8}>AGND</Lbl>
    <Hatch x={16} y={72} w={76} h={40} />
    <Lbl x={54} y={94} tone="#7fd6b4" size={8}>DGND</Lbl>
    <rect x="86" y="61" width="20" height="10" fill={CU} />
    <Callout x={96} y={66} r={18} tone={GOOD} />
    <rect x="128" y="24" width="52" height="32" fill="#17362a" stroke={SILK} strokeWidth="1.3" />
    <Lbl x={154} y={44} tone={SILK} size={8}>ADC</Lbl>
    <rect x="128" y="76" width="52" height="32" fill="#17362a" stroke={SILK} strokeWidth="1.3" />
    <Lbl x={154} y={96} tone={SILK} size={8}>MOTORS</Lbl>
    <path d="M 92 42 H 128 M 92 92 H 128" stroke={CU} strokeWidth="3" />
    <Mark x={196} y={66} ok />
  </Mini>
);

const Xtal = () => (
  <Mini caption="LOAD CAPS — MIRRORED, BEFORE CRYSTAL">
    <path d="M 22 28 V 104" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={13} y={66} tone={DIM} size={8}>MCU</Lbl>
    <path d="M 22 46 H 148 V 56 M 22 82 H 176 V 72" fill="none" stroke={CU} strokeWidth="3.4" />
    <path d="M 100 46 V 52" stroke={CU} strokeWidth="2.2" />
    <CapG x={100} y={58} />
    <path d="M 100 61 V 70" stroke={CU} strokeWidth="2.2" />
    <path d="M 94 70 H 106 M 96 74 H 104 M 98 78 H 102" stroke={DIM} strokeWidth="1.4" />
    <path d="M 100 82 V 88" stroke={CU} strokeWidth="2.2" />
    <CapG x={100} y={94} />
    <path d="M 100 97 V 106" stroke={CU} strokeWidth="2.2" />
    <path d="M 94 106 H 106 M 96 110 H 104 M 98 114 H 102" stroke={DIM} strokeWidth="1.4" />
    <rect x="140" y="56" width="44" height="16" fill="#17362a" stroke={GOLD} strokeWidth="1.5" />
    <Lbl x={162} y={67} tone={GOLD} size={8}>X1 8M</Lbl>
    <Callout x={100} y={76} r={36} tone={GOOD} />
    <Lbl x={68} y={30} tone={GOOD}>mirrored caps · equal stubs</Lbl>
    <Mark x={196} y={100} ok />
  </Mini>
);

const ViaKeepout = () => (
  <Mini caption="VIAS DRILL WHERE THEY LIKE">
    {[52, 84].map((y) => (
      <g key={y}>
        <circle cx={110} cy={y} r="7" fill={GOLD} />
        <circle cx={110} cy={y} r="2.8" fill="#0d281e" />
      </g>
    ))}
    <Lbl x={110} y={106} tone={DIM} size={7.5}>someone else's via</Lbl>
    <path d="M 20 26 H 200" stroke={CU} strokeWidth="5" />
    <Lbl x={20} y={18} tone={GOOD} anchor="start" size={8}>clean route</Lbl>
    <path d="M 20 68 H 96 M 124 68 H 200" stroke={CU} strokeWidth="5" />
    <path d="M 96 68 H 124" stroke={BAD} strokeWidth="1.6" strokeDasharray="4 3" />
    <Callout x={110} y={68} r={18} />
    <Lbl x={44} y={116} tone={BAD} anchor="start" size={7.5}>squeezing past = drill-tolerance roulette</Lbl>
  </Mini>
);

const Xh = () => (
  <Mini caption="LIBRARY FOOTPRINT + 3D BODY">
    <rect x="48" y="26" width="106" height="38" fill="#1f4636" />
    <rect x="44" y="30" width="106" height="38" fill="none" stroke={SILK} strokeWidth="1.4" />
    <rect x="84" y="22" width="26" height="10" fill="none" stroke={SILK} strokeWidth="1.4" />
    {[58, 84, 110, 136].map((x) => (
      <ThPad key={x} x={x} y={84} />
    ))}
    <Dim x1={58} y1={102} x2={84} y2={102} label="2.54" tone={GOOD} />
    <Lbl x={210} y={44} tone={GOOD} size={7.5} anchor="end">3D checked</Lbl>
    <Lbl x={210} y={56} tone={GOOD} size={7.5} anchor="end">before fab</Lbl>
    <Mark x={196} y={98} ok />
  </Mini>
);

const HeaderGap = () => (
  <Mini caption="SPACE FOR HOUSINGS, NOT PINS">
    {[28, 38, 48, 58].map((x) => (
      <circle key={x} cx={x} cy={72} r="4" fill={GOLD} />
    ))}
    {[72, 82, 92, 102].map((x) => (
      <circle key={x} cx={x} cy={72} r="4" fill={GOLD} />
    ))}
    <rect x="20" y="44" width="48" height="44" fill="none" stroke={SILK} strokeWidth="1.3" />
    <rect x="64" y="44" width="48" height="44" fill="none" stroke={SILK} strokeWidth="1.3" />
    <rect x="64" y="44" width="4" height="44" fill={BAD} opacity="0.5" />
    <Callout x={66} y={34} r={13} />
    <Lbl x={66} y={16} tone={BAD}>housings collide</Lbl>
    {[140, 149, 158, 167].map((x) => (
      <circle key={x} cx={x} cy={72} r="4" fill={GOLD} />
    ))}
    {[184, 193, 202, 211].map((x) => (
      <circle key={x} cx={x} cy={72} r="4" fill={GOLD} />
    ))}
    <rect x="132" y="44" width="42" height="44" fill="none" stroke={SILK} strokeWidth="1.3" />
    <rect x="178" y="44" width="42" height="44" fill="none" stroke={SILK} strokeWidth="1.3" />
    <Lbl x={176} y={104} tone={GOOD} size={7.5}>room for plugs</Lbl>
    <Mark x={199} y={26} ok />
  </Mini>
);

const SilkHdr = () => (
  <Mini caption="FUNCTION FIRST, THEN PIN MAP">
    <rect x="40" y="42" width="140" height="42" fill="none" stroke={SILK} strokeWidth="1.5" />
    <Lbl x={110} y={34} tone={SILK} size={12}>UART_GVTR</Lbl>
    {[56, 84, 112, 140].map((x, i) => (
      <g key={x}>
        <ThPad x={x} y={62} />
        <Lbl x={x} y={76} tone={GOLD} size={10}>{["G", "V", "T", "R"][i]}</Lbl>
      </g>
    ))}
    <Lbl x={110} y={104} tone={GOOD} size={7.5}>left → right: GND · 5V · TX · RX</Lbl>
    <Mark x={196} y={30} ok />
  </Mini>
);

const Datasheet = () => (
  <Mini caption="CHECK THE DATASHEET FIRST">
    <rect x="24" y="18" width="74" height="96" rx="3" fill="#0f231b" stroke={DIM} strokeWidth="1.3" />
    <Lbl x={61} y={34} tone={SILK} size={8}>DATASHEET</Lbl>
    <path d="M 32 44 H 90 M 32 52 H 90 M 32 60 H 74" stroke={DIM} strokeWidth="1.4" opacity="0.6" />
    <rect x="34" y="70" width="54" height="34" fill="none" stroke={GOLD} strokeWidth="1.4" />
    <Lbl x={61} y={91} tone={GOLD} size={7.5}>PKG · PIN 1</Lbl>
    <circle cx="152" cy="58" r="27" fill="#0f231b" fillOpacity="0.55" stroke={GOOD} strokeWidth="2" />
    <path d="M 141 58 l 7 8 l 14 -16" fill="none" stroke={GOOD} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 171 77 L 190 96" stroke={GOOD} strokeWidth="3.4" strokeLinecap="round" />
    <Lbl x={152} y={104} tone={GOOD} size={7.5}>verify pkg & pinout</Lbl>
    <Lbl x={110} y={120} tone={DIM} size={7}>before you order a single part</Lbl>
  </Mini>
);

const Stub = () => (
  <Mini caption="NO DEAD-END STUBS">
    <path d="M 24 62 H 196" stroke={CU} strokeWidth="9" />
    <path d="M 112 62 V 30 H 162" stroke={CU} strokeWidth="9" fill="none" />
    <circle cx="162" cy="30" r="5" fill={BAD} />
    <Callout x={162} y={30} r={20} />
    <Lbl x={162} y={60} tone={BAD} size={7.5}>goes nowhere</Lbl>
    <path d="M 58 62 V 90" stroke={CU} strokeWidth="9" />
    <ThPad x={58} y={98} />
    <Lbl x={110} y={118} tone={GOOD} size={7.5}>rerouted? delete the old copper</Lbl>
  </Mini>
);

const SchFlow = () => (
  <Mini caption="SIGNALS FLOW LEFT → RIGHT">
    <path d="M 18 42 H 56" stroke={CU} strokeWidth="4" />
    <Lbl x={36} y={34} tone={DIM} size={7}>IN</Lbl>
    <rect x="56" y="28" width="44" height="42" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={78} y={53} tone={SILK} size={8}>AMP</Lbl>
    <path d="M 100 49 H 136" stroke={CU} strokeWidth="4" />
    <path d="M 136 49 l -7 -4 v 8 z" fill={CU} />
    <rect x="136" y="28" width="44" height="42" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={158} y={53} tone={SILK} size={8}>MCU</Lbl>
    <path d="M 20 94 H 200" stroke={CU} strokeWidth="4" opacity="0.5" />
    <Lbl x={30} y={88} tone={GOLD} size={7}>3V3 ↓</Lbl>
    <path d="M 78 70 V 94 M 158 70 V 94" stroke={CU} strokeWidth="2" opacity="0.5" />
    <Lbl x={110} y={116} tone={GOOD} size={7.5}>signal left→right · power top→down</Lbl>
  </Mini>
);

const NetNaming = () => (
  <Mini caption="ONE RAIL, ONE NAME">
    <path d="M 24 40 H 196" stroke={CU} strokeWidth="7" />
    <Lbl x={42} y={30} tone={GOOD} size={9}>3V3</Lbl>
    <Lbl x={112} y={30} tone={GOOD} size={9}>3V3</Lbl>
    <Lbl x={172} y={30} tone={GOOD} size={9}>3V3</Lbl>
    <Mark x={196} y={16} ok />
    <path d="M 24 86 H 98" stroke={CU} strokeWidth="7" />
    <Lbl x={42} y={76} tone={SILK} size={9}>3V3</Lbl>
    <path d="M 122 86 H 196" stroke={CU} strokeWidth="7" opacity="0.4" />
    <Lbl x={140} y={76} tone={BAD} size={9}>V3P3</Lbl>
    <Mark x={110} y={86} ok={false} />
    <Lbl x={110} y={116} tone={BAD} size={7.5}>two names = two nets = broken rail</Lbl>
  </Mini>
);

const Decal = () => (
  <Mini caption="DRAW CAPS AT THEIR PIN">
    <rect x="24" y="30" width="56" height="72" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={52} y={70} tone={SILK} size={9}>U1</Lbl>
    <path d="M 80 46 H 102" stroke={CU} strokeWidth="4" />
    <Lbl x={90} y={40} tone={DIM} size={7}>VDD</Lbl>
    <CapG x={112} y={46} />
    <path d="M 120 46 H 130 M 130 40 V 52 M 134 42 V 50 M 138 44 V 48" stroke={DIM} strokeWidth="1.4" />
    <Callout x={112} y={46} r={23} tone={GOOD} />
    <Lbl x={112} y={24} tone={GOOD} size={7.5}>hanging off the pin</Lbl>
    <path d="M 130 46 H 176 V 84" stroke={CU} strokeWidth="2" strokeDasharray="4 3" opacity="0.5" />
    <CapG x={176} y={94} />
    <Lbl x={176} y={116} tone={BAD} size={7}>stray in a corner ✕</Lbl>
  </Mini>
);

const Erc = () => (
  <Mini caption="ERC CLEAN BEFORE LAYOUT">
    <rect x="26" y="18" width="168" height="92" rx="3" fill="#0f231b" stroke={DIM} strokeWidth="1.3" />
    <Lbl x={40} y={38} tone={SILK} size={9} anchor="start">ERC REPORT</Lbl>
    <path d="M 40 54 H 180 M 40 68 H 180 M 40 82 H 150" stroke={DIM} strokeWidth="1.4" opacity="0.5" />
    <path d="M 152 60 l 8 9 l 16 -18" fill="none" stroke={GOOD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <Lbl x={40} y={102} tone={GOOD} size={9} anchor="start">0 ERRORS · 0 WARNINGS</Lbl>
    <Mark x={196} y={20} ok />
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
  // senior review batch
  decap: Decap,
  decapbunch: DecapBunch,
  thermalvias: ThermalVias,
  railzone: RailZone,
  thinrail: ThinRail,
  wrongcap: WrongCap,
  canpair: CanPair,
  cansplit: CanSplit,
  xtal: Xtal,
  xtalring: XtalRing,
  caporient: CapOrient,
  antipad: AntiPad,
  mount: Mount,
  testpts: TestPts,
  teardrop: Teardrop,
  courtyard: Courtyard,
  fiducials: Fiducials,
  starpoint: StarPoint,
  viakeepout: ViaKeepout,
  xh: Xh,
  headergap: HeaderGap,
  silkhdr: SilkHdr,
  // convention & schematic batch
  datasheet: Datasheet,
  stub: Stub,
  schflow: SchFlow,
  netnaming: NetNaming,
  decal: Decal,
  erc: Erc,
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
  { value: "decap", label: "Per-pin decoupling caps" },
  { value: "decapbunch", label: "Shared decoupling cap" },
  { value: "thermalvias", label: "Regulator thermal vias" },
  { value: "railzone", label: "Rail on copper zone" },
  { value: "thinrail", label: "Thin power rail" },
  { value: "wrongcap", label: "Wrong cap value" },
  { value: "canpair", label: "CANH/CANL mirror symmetry" },
  { value: "cansplit", label: "Split / skewed CAN lines" },
  { value: "xtal", label: "Crystal load cap order" },
  { value: "xtalring", label: "Crystal GND guard ring" },
  { value: "viakeepout", label: "Signal via keep-out" },
  { value: "xh", label: "XH connector + 3D" },
  { value: "headergap", label: "Header spacing for housings" },
  { value: "silkhdr", label: "Obvious header legend" },
  { value: "caporient", label: "Electrolytic cap orientation" },
  { value: "antipad", label: "Annular ring / hole-in-pad" },
  { value: "mount", label: "Mounting hole keep-out" },
  { value: "testpts", label: "Test point grid" },
  { value: "teardrop", label: "Teardrop at pad entry" },
  { value: "courtyard", label: "IPC courtyard clearance" },
  { value: "fiducials", label: "Fiducial placement" },
  { value: "starpoint", label: "AGND/DGND star bridge" },
  { value: "datasheet", label: "Datasheet cross-check" },
  { value: "stub", label: "Dead-end stub removal" },
  { value: "schflow", label: "Schematic left-to-right flow" },
  { value: "netnaming", label: "One rail, one net name" },
  { value: "decal", label: "Decoupling cap at its pin" },
  { value: "erc", label: "ERC clean report" },
];
