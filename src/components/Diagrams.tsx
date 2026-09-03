import { createContext, useContext, type ReactElement, type ReactNode } from "react";

/* Stylised "layout excerpt" illustrations drawn as inline SVG.
   Layout contract that keeps labels clear of the art:
   - viewBox is 220 x 132
   - labels live in the top band (y <= 24) or bottom band (y >= 110)
   - artwork occupies the middle (y 26..108)
   - at most one bottom label row, spaced with explicit anchors       */

const CU = "#e0955a";
const GOLD = "#f0cd8d";
const SILK = "#e9f2ea";
const BAD = "#f2685e";
const GOOD = "#55d78e";
const DIM = "#9cb8a7";
const MONO = "var(--font-mono)";

interface Tone {
  board: string;
  grid: string;
  frame: string;
  caption: string;
}

const ToneCtx = createContext<Tone>({
  board: "#08201715".slice(0, 7),
  grid: "#103024",
  frame: "#16382a",
  caption: "#5d7a68",
});

export function RedTone({ children }: { children: ReactNode }) {
  return (
    <ToneCtx.Provider value={{ board: "#1d0f0b", grid: "#33201a", frame: "#3f201a", caption: "#9c7263" }}>
      {children}
    </ToneCtx.Provider>
  );
}

function clean(s: string) {
  return s.replace(/\s+—\s+/g, ", ").replace(/—/g, ", ");
}

function Mini({ children, caption }: { children: ReactNode; caption?: string }) {
  const tone = useContext(ToneCtx);
  const dots: Array<[number, number]> = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) dots.push([18 + c * 23, 34 + r * 22]);
  return (
    <div className="w-full">
      {caption && (
        <div
          className="mb-1.5 flex items-center gap-1.5 font-mono text-[8px] tracking-[0.14em]"
          style={{ color: tone.caption }}
        >
          <span className="h-1 w-1 rotate-45 bg-current opacity-70" />
          {clean(caption)}
        </div>
      )}
      <svg viewBox="0 0 220 132" className="block h-auto w-full rounded" role="img" aria-label={caption}>
        <rect x="1" y="1" width="218" height="130" rx="8" fill={tone.board} stroke={tone.frame} strokeWidth="1.5" />
        <g fill={tone.grid}>
          {dots.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.1" />
          ))}
        </g>
        {children}
      </svg>
    </div>
  );
}

function Lbl({
  x,
  y,
  children,
  tone = DIM,
  size = 8,
  anchor = "middle",
}: {
  x: number;
  y: number;
  children: ReactNode;
  tone?: string;
  size?: number;
  anchor?: "middle" | "start" | "end";
}) {
  const text = typeof children === "string" ? clean(children) : children;
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily={MONO} fontSize={size} fill={tone}>
      {text}
    </text>
  );
}

function Callout({ x, y, r = 19, tone = BAD }: { x: number; y: number; r?: number; tone?: string }) {
  return <circle cx={x} cy={y} r={r} fill="none" stroke={tone} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.95" />;
}

function ThPad({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="8" fill={GOLD} />
      <circle cx={x} cy={y} r="3" fill="#0d281e" />
    </g>
  );
}

function Smd({ x, y, w = 20, h = 12 }: { x: number; y: number; w?: number; h?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx="2.5" fill={GOLD} />;
}

function Hatch({ x, y, w, h, tone = "#2b6a50", gap = 7 }: { x: number; y: number; w: number; h: number; tone?: string; gap?: number }) {
  const id = "h" + x + y + Math.round(Math.random() * 1e6);
  return (
    <g>
      <defs>
        <pattern id={id} width={gap} height={gap} patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2={gap} stroke={tone} strokeWidth="1.3" />
        </pattern>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={`url(#${id})`} stroke={tone} strokeWidth="1.1" />
    </g>
  );
}

/* ---------------- Trace Routing ---------------- */

const Corners = () => (
  <Mini caption="MITRE EVERY TURN">
    <path d="M 24 92 H 88 L 128 52 H 196" fill="none" stroke={CU} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
    <Lbl x={110} y={20} tone={GOOD} size={8}>45 degree bends, no right angles</Lbl>
  </Mini>
);

const Widths = () => (
  <Mini caption="WIDTH BY RAIL">
    <path d="M 26 40 H 130" stroke={CU} strokeWidth="13" />
    <Lbl x={140} y={44} tone={GOLD} size={8} anchor="start">24V 80 mil</Lbl>
    <path d="M 26 62 H 130" stroke={CU} strokeWidth="6" />
    <Lbl x={140} y={65} tone={GOLD} size={8} anchor="start">5V 30 mil</Lbl>
    <path d="M 26 80 H 130" stroke={CU} strokeWidth="3.6" />
    <Lbl x={140} y={82} tone={GOLD} size={8} anchor="start">3V3 20 mil</Lbl>
    <path d="M 26 96 H 130" stroke={CU} strokeWidth="1.8" />
    <Lbl x={140} y={98} tone={GOLD} size={8} anchor="start">sig 10 mil</Lbl>
    <Lbl x={110} y={120} tone={DIM} size={7}>set once in net classes</Lbl>
  </Mini>
);

const Corner90 = () => (
  <Mini caption="RIGHT ANGLE = ACID TRAP">
    <path d="M 24 90 H 108 V 30 H 196" fill="none" stroke={CU} strokeWidth="11" strokeLinecap="butt" strokeLinejoin="miter" />
    <path d="M 113 79 Q 113 86 121 86 L 121 90 Q 110 90 110 79 Z" fill="#4fae9b" opacity="0.9" />
    <Callout x={113} y={85} r={18} />
    <Lbl x={204} y={60} tone={BAD} size={7.5} anchor="end">etchant pools</Lbl>
    <Lbl x={204} y={71} tone={BAD} size={7.5} anchor="end">and eats the corner</Lbl>
  </Mini>
);

const ViaSpace = () => (
  <Mini caption="VIAS ALIGNED AND SPACED">
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <circle cx={46 + i * 30} cy={52} r="6.5" fill={GOLD} />
        <circle cx={46 + i * 30} cy={52} r="2.6" fill="#0d281e" />
      </g>
    ))}
    <Lbl x={110} y={24} tone={GOOD} size={8}>neat column, room between</Lbl>
    <rect x={40} y={78} width={52} height={26} fill="none" stroke={BAD} strokeWidth="1.3" strokeDasharray="4 3" />
    <Lbl x={66} y={94} tone={BAD} size={7}>part underneath</Lbl>
    <circle cx={66} cy={68} r="6.5" fill={GOLD} />
    <circle cx={66} cy={68} r="2.6" fill="#0d281e" />
    <path d="M 60 62 l 12 12 m 0 -12 l -12 12" stroke={BAD} strokeWidth="1.6" />
    <Lbl x={204} y={86} tone={BAD} size={7.5} anchor="end">check the far</Lbl>
    <Lbl x={204} y={97} tone={BAD} size={7.5} anchor="end">layer first</Lbl>
  </Mini>
);

const Stub = () => (
  <Mini caption="NO DEAD-ENDS">
    <path d="M 24 48 H 196" stroke={CU} strokeWidth="7" />
    <path d="M 120 48 V 96" stroke={CU} strokeWidth="7" />
    <circle cx={120} cy={100} r="6" fill="none" stroke={BAD} strokeWidth="1.6" strokeDasharray="3 3" />
    <Lbl x={120} y={120} tone={BAD} size={7.5}>stub picks up noise</Lbl>
    <path d="M 40 84 H 88" stroke={CU} strokeWidth="7" />
    <Lbl x={64} y={104} tone={GOOD} size={7.5}>clean</Lbl>
  </Mini>
);

/* ---------------- Power ---------------- */

const Decap = () => (
  <Mini caption="ONE CAP PER PIN">
    <rect x={76} y={40} width={72} height={56} fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={112} y={72} tone={SILK} size={10}>MCU</Lbl>
    {[50, 70, 88].map((y) => (
      <g key={y}>
        <path d={`M 56 ${y} H 76`} stroke={CU} strokeWidth="4" />
        <rect x={38} y={y - 6} width={16} height={12} rx="2" fill={GOLD} />
        <path d={`M 38 ${y} H 28`} stroke={CU} strokeWidth="2.2" />
      </g>
    ))}
    <Lbl x={112} y={22} tone={GOOD} size={8}>short path, one each</Lbl>
    <Hatch x={18} y={106} w={184} h={10} />
  </Mini>
);

const Relief = () => (
  <Mini caption="THERMAL RELIEF">
    <Hatch x={16} y={24} w={188} h={84} />
    <path d="M 110 46 V 30 M 110 82 V 98 M 88 64 H 72 M 132 64 H 148" stroke={CU} strokeWidth="7" />
    <circle cx={110} cy={64} r="16" fill={GOLD} />
    <circle cx={110} cy={64} r="5.5" fill="#0d281e" />
    <Lbl x={110} y={122} tone={GOOD} size={7.5}>spokes keep the pad hot enough to solder</Lbl>
  </Mini>
);

const Flood = () => (
  <Mini caption="POUR CLEARANCE">
    <Hatch x={16} y={28} w={116} h={76} />
    <circle cx={118} cy={52} r="12" fill={GOLD} />
    <circle cx={118} cy={52} r="4" fill="#0d281e" />
    <Callout x={110} y={44} r={16} />
    <Lbl x={60} y={92} tone={BAD} size={7.5} anchor="start">0.0 mm, a short</Lbl>
    <circle cx={176} cy={66} r="12" fill={GOLD} />
    <circle cx={176} cy={66} r="4" fill="#0d281e" />
    <circle cx={176} cy={66} r="18" fill="none" stroke={GOOD} strokeWidth="1.3" strokeDasharray="4 3" />
    <Lbl x={176} y={118} tone={GOOD} size={7.5}>cleared</Lbl>
  </Mini>
);

const RailZone = () => (
  <Mini caption="RAILS RIDE COPPER">
    <rect x={20} y={38} width={42} height={36} fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={41} y={60} tone={SILK} size={8}>SW</Lbl>
    <Hatch x={74} y={44} w={50} h={24} tone="#8a5a33" />
    <Lbl x={99} y={60} tone="#f6c489" size={7}>5V pour</Lbl>
    <circle cx={146} cy={56} r="13" fill="none" stroke={GOLD} strokeWidth="2" />
    <circle cx={146} cy={56} r="4.5" fill="#0d281e" />
    <Hatch x={110} y={86} w={94} h={26} />
    <Lbl x={157} y={102} tone="#7fd6b4" size={7.5}>3V3 zone</Lbl>
    <Lbl x={110} y={22} tone={GOOD} size={8}>wide copper in, wide copper out</Lbl>
  </Mini>
);

const DecapBunch = () => (
  <Mini caption="SHARED CAP = COUPLED NOISE">
    <rect x={22} y={36} width={40} height={64} fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={42} y={72} tone={SILK} size={9}>MCU</Lbl>
    {[46, 68, 90].map((y) => (
      <path key={y} d={`M 62 ${y} H 88`} stroke={CU} strokeWidth="3.6" />
    ))}
    <path d="M 88 46 V 90 M 88 68 H 128 V 76" stroke={CU} strokeWidth="3.6" fill="none" />
    <rect x={120} y={78} width={16} height={12} rx="2" fill={GOLD} />
    <path d="M 128 90 V 100" stroke={CU} strokeWidth="2.2" />
    <Callout x={108} y={66} r={28} />
    <Lbl x={170} y={50} tone={BAD} size={7.5} anchor="end">one cap feeds</Lbl>
    <Lbl x={170} y={61} tone={BAD} size={7.5} anchor="end">three pins</Lbl>
    <Lbl x={110} y={120} tone={BAD} size={7}>return currents share the bunch</Lbl>
  </Mini>
);

/* ---------------- CAN / clock ---------------- */

const CanPair = () => (
  <Mini caption="MIRROR THE PAIR">
    <path d="M 24 46 H 80 L 96 60 H 140 L 156 46 H 196" fill="none" stroke={CU} strokeWidth="6" />
    <path d="M 24 86 H 80 L 96 72 H 140 L 156 86 H 196" fill="none" stroke="#56c3b2" strokeWidth="6" />
    <path d="M 24 66 H 196" stroke={DIM} strokeWidth="1" strokeDasharray="2 5" />
    <Lbl x={48} y={34} tone={GOOD} size={7.5} anchor="start">CANH</Lbl>
    <Lbl x={48} y={104} tone={GOOD} size={7.5} anchor="start">CANL</Lbl>
    <Lbl x={170} y={20} tone={DIM} size={7} anchor="end">mirror axis</Lbl>
    <Lbl x={110} y={122} tone={GOOD} size={7.5}>same length, same bends, same spacing</Lbl>
  </Mini>
);

const Xtal = () => (
  <Mini caption="LOAD CAPS BEFORE THE CRYSTAL">
    <path d="M 26 30 V 104" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={14} y={68} tone={DIM} size={7}>MCU</Lbl>
    <path d="M 26 46 H 148 V 56 M 26 86 H 176 V 76" fill="none" stroke={CU} strokeWidth="3.2" />
    <path d="M 62 46 V 52" stroke={CU} strokeWidth="2.2" />
    <path d="M 55 58 H 69 M 55 64 H 69" stroke={GOLD} strokeWidth="2.4" />
    <path d="M 62 64 V 72" stroke={CU} strokeWidth="2" />
    <path d="M 56 74 H 68 M 58 77 H 66 M 60 80 H 64" stroke={DIM} strokeWidth="1.3" />
    <path d="M 96 86 V 92" stroke={CU} strokeWidth="2.2" />
    <path d="M 89 98 H 103 M 89 104 H 103" stroke={GOLD} strokeWidth="2.4" />
    <path d="M 96 104 V 112" stroke={CU} strokeWidth="2" />
    <path d="M 90 114 H 102 M 92 117 H 100 M 94 120 H 98" stroke={DIM} strokeWidth="1.3" />
    <rect x={140} y={56} width={44} height={16} fill="#17362a" stroke={GOLD} strokeWidth="1.5" />
    <Lbl x={162} y={67} tone={GOLD} size={8}>X1 8M</Lbl>
    <Lbl x={110} y={20} tone={GOOD} size={8}>caps first, mirrored, shortest stubs</Lbl>
  </Mini>
);

const CanSplit = () => (
  <Mini caption="SKEW = NOISE INSIDE">
    <path d="M 24 40 H 196" fill="none" stroke={CU} strokeWidth="6" />
    <path d="M 24 96 H 70 L 86 76 H 130 L 150 96 H 196" fill="none" stroke="#56c3b2" strokeWidth="6" />
    <path d="M 188 40 V 96" stroke={BAD} strokeWidth="1.2" strokeDasharray="3 3" />
    <Lbl x={176} y={68} tone={BAD} size={7} anchor="end">skew</Lbl>
    <Lbl x={110} y={22} tone={BAD} size={8}>CANH arrives first</Lbl>
    <Lbl x={110} y={118} tone={BAD} size={7}>noise couples into only one line</Lbl>
  </Mini>
);

const ReturnSplit = () => (
  <Mini caption="RETURN PATHS NEED FLOOR">
    <Hatch x={16} y={48} w={76} h={52} />
    <Hatch x={128} y={48} w={76} h={52} />
    <path d="M 24 34 H 196" stroke={CU} strokeWidth="6" />
    <path d="M 100 76 C 60 118, 160 118, 128 76" stroke={BAD} strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
    <Lbl x={110} y={64} tone={DIM} size={7}>split</Lbl>
    <Lbl x={110} y={122} tone={BAD} size={7}>return forced the long way, big loop</Lbl>
  </Mini>
);

/* ---------------- Footprints ---------------- */

const Footprint = () => (
  <Mini caption="IPC-7351 LEVEL B">
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <Smd x={54} y={36 + i * 20} w={24} h={12} />
        <Smd x={142} y={36 + i * 20} w={24} h={12} />
      </g>
    ))}
    <rect x={88} y={32} width={44} height={72} fill="none" stroke={SILK} strokeWidth="1.3" />
    <circle cx={95} cy={40} r="2.4" fill={SILK} />
    <Lbl x={110} y={20} tone={GOOD} size={8}>library footprint, pads match the part</Lbl>
    <Lbl x={110} y={122} tone={DIM} size={7}>pin 1 marked on silk and copper</Lbl>
  </Mini>
);

const Mirror = () => (
  <Mini caption="WRONG LAYER VIEW">
    <rect x={50} y={40} width={120} height={52} rx="3" fill="none" stroke={SILK} strokeWidth="1.3" />
    <g transform="translate(110 66) scale(-1 1)">
      <text x={0} y={5} textAnchor="middle" fontFamily={MONO} fontSize="13" fill={SILK}>U3</text>
    </g>
    {[0, 1, 2].map((i) => (
      <Smd key={i} x={60 + i * 36} y={30} w={18} h={9} />
    ))}
    {[0, 1, 2].map((i) => (
      <Smd key={`b${i}`} x={60 + i * 36} y={94} w={18} h={9} />
    ))}
    <Lbl x={110} y={116} tone={BAD} size={7.5}>text mirrored, part can't be placed</Lbl>
  </Mini>
);

const HeaderGap = () => (
  <Mini caption="HOUSINGS NEED ROOM">
    {[0, 1, 2].map((i) => (
      <g key={i}>
        {[0, 1, 2, 3].map((p) => (
          <circle key={p} cx={32 + i * 32} cy={46 + p * 13} r="3.6" fill={GOLD} />
        ))}
      </g>
    ))}
    <Callout x={64} y={64} r={34} />
    <Lbl x={70} y={110} tone={BAD} size={7}>housings collide</Lbl>
    <path d="M 138 40 V 92" stroke={GOOD} strokeWidth="1.3" strokeDasharray="4 3" />
    {[0, 1, 2, 3].map((p) => (
      <circle key={`r${p}`} cx={178} cy={46 + p * 13} r="3.6" fill={GOLD} />
    ))}
    <Lbl x={178} y={110} tone={GOOD} size={7}>room to plug</Lbl>
  </Mini>
);

const Mount = () => (
  <Mini caption="MOUNTING DONE RIGHT">
    <circle cx={60} cy={60} r="15" fill="none" stroke={GOLD} strokeWidth="2" />
    <circle cx={60} cy={60} r="6.5" fill="#0d281e" />
    <circle cx={60} cy={60} r="25" fill="none" stroke={GOOD} strokeWidth="1.2" strokeDasharray="4 3" />
    <Lbl x={60} y={104} tone={GOOD} size={7}>no copper under the screw</Lbl>
    <circle cx={160} cy={60} r="15" fill="none" stroke={GOLD} strokeWidth="2" />
    <circle cx={160} cy={60} r="6.5" fill="#0d281e" />
    <Hatch x={138} y={38} w={44} h={44} tone="#8a5a33" />
    <Callout x={160} y={60} r={23} />
    <Lbl x={160} y={116} tone={BAD} size={7}>pour under the screw, a short</Lbl>
  </Mini>
);

/* ---------------- Silkscreen ---------------- */

const SilkHdr = () => (
  <Mini caption="FUNCTION FIRST, PINS AFTER">
    {[0, 1, 2, 3].map((i) => (
      <ThPad key={i} x={52} y={40 + i * 21} />
    ))}
    <rect x={34} y={26} width={36} height={90} fill="none" stroke={SILK} strokeWidth="1.1" strokeDasharray="4 3" />
    <Lbl x={100} y={36} tone={SILK} size={9} anchor="start">UART_VRTG</Lbl>
    <path d="M 62 40 H 92 M 62 61 H 92 M 62 82 H 92 M 62 103 H 92" stroke={DIM} strokeWidth="1" />
    <Lbl x={96} y={43} tone={DIM} size={7.5} anchor="start">V 5V</Lbl>
    <Lbl x={96} y={64} tone={DIM} size={7.5} anchor="start">R RX</Lbl>
    <Lbl x={96} y={85} tone={DIM} size={7.5} anchor="start">T TX</Lbl>
    <Lbl x={96} y={106} tone={DIM} size={7.5} anchor="start">G GND</Lbl>
    <Lbl x={110} y={122} tone={GOOD} size={7}>read left to right, pin 1 marked</Lbl>
  </Mini>
);

const SilkPad = () => (
  <Mini caption="KEEP INK OFF COPPER">
    <Smd x={48} y={48} w={38} h={24} />
    <Smd x={48} y={82} w={38} h={22} />
    <path d="M 32 94 L 100 42" stroke={SILK} strokeWidth="3" opacity="0.9" />
    <Callout x={70} y={62} r={19} />
    <Lbl x={150} y={56} tone={BAD} size={8}>ink on pad</Lbl>
    <Lbl x={150} y={68} tone={BAD} size={7}>solder won't wet</Lbl>
  </Mini>
);

const RevSilk = () => (
  <Mini caption="THE BOARD INTRODUCES ITSELF">
    <rect x={24} y={30} width={172} height={76} rx="6" fill="none" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={36} y={54} tone={SILK} size={10} anchor="start">ROBO-PWR</Lbl>
    <Lbl x={36} y={70} tone={DIM} size={8} anchor="start">REV D, 2026-02</Lbl>
    <Lbl x={36} y={86} tone={DIM} size={7} anchor="start">HKUST ROBOTICS</Lbl>
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={176} cy={46 + i * 15} r="3.6" fill={GOLD} />
    ))}
    <Lbl x={110} y={122} tone={GOOD} size={7.5}>which board is this? answered on the silk</Lbl>
  </Mini>
);

/* ---------------- Clearance ---------------- */

const Drc = () => (
  <Mini caption="DRC @ FAB LIMITS">
    <path d="M 24 50 H 196" stroke={CU} strokeWidth="9" />
    <path d="M 24 88 H 196" stroke={CU} strokeWidth="9" />
    <path d="M 110 57 V 81" stroke={GOOD} strokeWidth="1.1" />
    <Lbl x={122} y={72} tone={GOOD} size={8} anchor="start">0.2 mm</Lbl>
    <Lbl x={110} y={22} tone={GOOD} size={8.5}>0 errors, 0 warnings</Lbl>
  </Mini>
);

const Sliver = () => (
  <Mini caption="ISOLATED ISLANDS">
    <Smd x={42} y={44} w={32} h={44} />
    <Smd x={146} y={44} w={32} h={44} />
    <path d="M 92 42 L 112 66 L 92 90 L 96 66 Z" fill={CU} opacity="0.95" />
    <Callout x={100} y={66} r={20} />
    <Lbl x={110} y={116} tone={BAD} size={7.5}>sliver can bridge pads</Lbl>
  </Mini>
);

const Creepage = () => (
  <Mini caption="SURFACE DISTANCE">
    <rect x={26} y={42} width={68} height={56} rx="4" fill={CU} opacity="0.85" />
    <rect x={116} y={42} width={68} height={56} rx="4" fill={CU} opacity="0.85" />
    <path d="M 100 22 l -6 10 h 6 l -5 10" fill="none" stroke={BAD} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <Lbl x={110} y={116} tone={BAD} size={7.5}>too close, tracking arc risk over time</Lbl>
  </Mini>
);

/* ---------------- Deliverables ---------------- */

const Gerbers = () => (
  <Mini caption="FULL SET, EYEBALLED">
    {[
      ["GT L", "#e0955a"], ["GB L", "#c77f45"], ["GTS", "#2b6a50"], ["DRL", "#9cb8a7"],
    ].map(([t, c], i) => (
      <g key={t as string}>
        <rect x={36 + i * 7} y={78 - i * 14} width={100} height={24} rx="3" fill="#0f231b" stroke={c as string} strokeWidth="1.3" />
        <text x={46 + i * 7} y={94 - i * 14} fontFamily={MONO} fontSize="9" fill={c as string}>{t}</text>
      </g>
    ))}
    <Lbl x={180} y={114} tone={GOOD} size={7.5} anchor="end">+ paste + outline</Lbl>
  </Mini>
);

const Drill = () => (
  <Mini caption="DRILL MATCHES PADS">
    <ThPad x={46} y={48} />
    <ThPad x={46} y={90} />
    <ThPad x={106} y={48} />
    <ThPad x={106} y={90} />
    <circle cx={106} cy={48} r="3.2" fill="none" stroke={BAD} strokeWidth="1.3" />
    <path d="M 94 34 v 9 M 90 38 h 9" stroke={BAD} strokeWidth="1.3" />
    <circle cx={158} cy={70} r="3.2" fill="none" stroke={BAD} strokeWidth="1.3" />
    <path d="M 158 60 v 8 M 154 64 h 8" stroke={BAD} strokeWidth="1.3" />
    <Callout x={106} y={48} r={15} />
    <Lbl x={160} y={34} tone={BAD} size={7.5} anchor="end">hits off-pad</Lbl>
    <Lbl x={160} y={118} tone={BAD} size={7.5} anchor="end">or missing entirely</Lbl>
  </Mini>
);

/* ================= deduction-coverage batch (Rev I) ================= */

function CapV({ x, y, tone = CU }: { x: number; y: number; tone?: string }) {
  return (
    <g stroke={tone} strokeWidth="2.2" fill="none">
      <path d={`M ${x} ${y - 8} V ${y - 2.5}`} />
      <path d={`M ${x - 6} ${y - 2.5} H ${x + 6}`} />
      <path d={`M ${x - 6} ${y + 2.5} H ${x + 6}`} />
      <path d={`M ${x} ${y + 2.5} V ${y + 8}`} />
    </g>
  );
}

function Gnd({ x, y, tone = DIM }: { x: number; y: number; tone?: string }) {
  return (
    <g stroke={tone} strokeWidth="1.6">
      <path d={`M ${x - 7} ${y} H ${x + 7}`} />
      <path d={`M ${x - 4.5} ${y + 3.5} H ${x + 4.5}`} />
      <path d={`M ${x - 2} ${y + 7} H ${x + 2}`} />
    </g>
  );
}

const Neckdown = () => (
  <Mini caption="WIDTH MUST HOLD ALONG THE NET">
    <path d="M 22 64 H 80" stroke={CU} strokeWidth="13" />
    <path d="M 80 64 H 140" stroke={CU} strokeWidth="3.5" />
    <path d="M 140 64 H 198" stroke={CU} strokeWidth="13" />
    <Callout x={110} y={64} r={24} />
    <Lbl x={110} y={18} tone={BAD}>the skinny part carries the same current</Lbl>
    <Lbl x={110} y={120} tone={BAD}>it becomes a fuse exactly where you squeezed it</Lbl>
  </Mini>
);

const ViaLadder = () => (
  <Mini caption="MAX 2 VIAS PER SIGNAL TRACE">
    <path d="M 20 62 H 200" stroke={CU} strokeWidth="4" />
    {[62, 96, 130, 164].map((x) => (
      <g key={x}>
        <circle cx={x} cy={62} r="6.5" fill={GOLD} />
        <circle cx={x} cy={62} r="2.6" fill="#0d281e" />
      </g>
    ))}
    <Callout x={113} y={62} r={52} />
    <Lbl x={110} y={18} tone={BAD}>four layer hops on one net</Lbl>
    <Lbl x={110} y={120} tone={BAD}>every via adds a stub and inductance</Lbl>
  </Mini>
);

const ThtPierc = () => (
  <Mini caption="KEEP TRACES OUT OF PAD FIELDS">
    {[0, 1, 2, 3, 4].map((i) => (
      <ThPad key={i} x={50 + i * 30} y={48} />
    ))}
    <path d="M 20 48 H 28 M 28 48 Q 65 48 72 66 H 88 Q 95 48 132 48 H 200" stroke={CU} strokeWidth="3.6" fill="none" />
    <Callout x={80} y={56} r={17} />
    <Lbl x={110} y={18} tone={BAD}>threading between two through-holes</Lbl>
    <Lbl x={110} y={120} tone={BAD}>acid traps plus a drill-tolerance short</Lbl>
  </Mini>
);

const Stitch = () => (
  <Mini caption="SOLID GND, BOTH LAYERS, STITCHED">
    <Hatch x={16} y={30} w={188} h={34} />
    <Hatch x={16} y={76} w={188} h={32} />
    {[56, 110, 164].map((x) => (
      <g key={x}>
        <path d={`M ${x} 62 V 78`} stroke={DIM} strokeWidth="1.2" strokeDasharray="3 3" />
        <circle cx={x} cy={70} r="6.5" fill={GOLD} />
        <circle cx={x} cy={70} r="2.6" fill="#0d281e" />
      </g>
    ))}
    <Lbl x={24} y={44} tone="#7fd6b4" anchor="start">GND top</Lbl>
    <Lbl x={24} y={96} tone="#7fd6b4" anchor="start">GND bottom</Lbl>
    <Lbl x={110} y={120} tone={GOOD}>stitching ties the two pours into one plane</Lbl>
  </Mini>
);

const ViaArray = () => (
  <Mini caption="CURRENT CHANGING LAYER: MANY VIAS">
    <Smd x={34} y={44} w={44} h={44} />
    {[0, 1, 2].map((r) =>
      [0, 1, 2].map((c) => (
        <g key={`${r}${c}`}>
          <circle cx={132 + c * 20} cy={46 + r * 20} r="6" fill={GOLD} />
          <circle cx={132 + c * 20} cy={46 + r * 20} r="2.4" fill="#0d281e" />
        </g>
      ))
    )}
    <path d="M 84 66 H 120" stroke={CU} strokeWidth="9" />
    <path d="M 116 60 L 124 66 L 116 72 Z" fill={CU} />
    <Lbl x={110} y={18} tone={GOOD}>one via carries half an amp at best</Lbl>
    <Lbl x={110} y={120} tone={GOOD}>a grid shares the load, nothing runs hot</Lbl>
  </Mini>
);

const Fb = () => (
  <Mini caption="FEEDBACK TAP AT THE FB PIN">
    <rect x="26" y="42" width="62" height="46" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={57} y={62} tone={SILK} size={9}>DC-DC</Lbl>
    <Lbl x={57} y={76} tone={DIM} size={7}>FB</Lbl>
    <Smd x={88} y={52} w={16} h={10} />
    <Smd x={88} y={72} w={16} h={10} />
    <path d="M 104 57 H 128 V 60 M 128 77 H 152 V 74" stroke={CU} strokeWidth="2.6" fill="none" />
    <Callout x={110} y={67} r={26} tone={GOOD} />
    <Lbl x={166} y={60} tone={GOLD} size={8} anchor="start">R1 / R2</Lbl>
    <Lbl x={110} y={120} tone={GOOD}>right at the pin, tapped off the output pad</Lbl>
  </Mini>
);

const PowerLoop = () => (
  <Mini caption="POWER WANTS THE SHORT WAY">
    <rect x="24" y="52" width="40" height="28" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={44} y={69} tone={SILK} size={8}>REG</Lbl>
    <rect x="156" y="52" width="40" height="28" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={176} y={69} tone={SILK} size={8}>LOAD</Lbl>
    <path d="M 64 60 H 84 V 34 H 148 V 60 H 156" stroke={CU} strokeWidth="5" fill="none" />
    <path d="M 64 72 H 156" stroke={DIM} strokeWidth="1.4" strokeDasharray="5 4" />
    <Lbl x={110} y={18} tone={BAD}>the scenic route adds R and L for nothing</Lbl>
    <Lbl x={110} y={120} tone={GOOD}>straight and tight, like the dashed path</Lbl>
  </Mini>
);

const SpiderWeb = () => (
  <Mini caption="POUR A ZONE, DON'T SPIN A WEB">
    <circle cx={110} cy={64} r="11" fill={GOLD} />
    <circle cx={110} cy={64} r="4" fill="#0d281e" />
    {[
      [40, 36], [110, 30], [180, 36], [40, 92], [110, 98], [180, 92],
    ].map(([x, y]) => (
      <g key={`${x}${y}`}>
        <path d={`M 110 64 L ${x} ${y}`} stroke={CU} strokeWidth="1.6" />
        <Smd x={x - 8} y={y - 5} w={16} h={10} />
      </g>
    ))}
    <Lbl x={110} y={18} tone={BAD}>six thin spokes where one pour would do</Lbl>
    <Lbl x={110} y={122} tone={BAD}>long, thin and matched in nothing</Lbl>
  </Mini>
);

const WrongCap = () => (
  <Mini caption="µF AND pF ARE NOT THE SAME PART">
    <rect x="28" y="44" width="58" height="42" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={57} y={62} tone={SILK} size={9}>REG</Lbl>
    <Lbl x={57} y={74} tone={DIM} size={7}>OUT</Lbl>
    <path d="M 86 62 H 119" stroke={CU} strokeWidth="4" />
    <CapV x={130} y={62} />
    <path d="M 141 62 H 178" stroke={CU} strokeWidth="4" />
    <Lbl x={190} y={65} tone={DIM} size={7.5}>load</Lbl>
    <Callout x={130} y={62} r={20} />
    <Lbl x={78} y={102} tone={BAD} size={9} anchor="start">fitted: 22 pF</Lbl>
    <Lbl x={78} y={120} tone={GOOD} size={8} anchor="start">wanted: 22 µF, a thousand times bigger</Lbl>
  </Mini>
);

const UnderParts = () => (
  <Mini caption="NOTHING UNDER, ON ANY LAYER">
    <rect x="36" y="40" width="52" height="26" rx="3" fill="#17362a" stroke={GOLD} strokeWidth="1.5" />
    <Lbl x={62} y={57} tone={GOLD} size={8}>X1</Lbl>
    <Hatch x={30} y={74} w={64} h={22} tone="#8a5a33" />
    <rect x="132" y="40" width="52" height="30" rx="3" fill="#17362a" stroke={GOLD} strokeWidth="1.5" />
    <Lbl x={158} y={59} tone={GOLD} size={8}>L1</Lbl>
    <Hatch x={126} y={78} w={64} h={18} tone="#8a5a33" />
    <Lbl x={110} y={18} tone={BAD}>copper routed under the crystal and inductor</Lbl>
    <Lbl x={110} y={120} tone={BAD}>the oscillator hears everything, the inductor radiates</Lbl>
  </Mini>
);

const TopSide = () => (
  <Mini caption="HUMANS PLUG INTO THE TOP">
    <path d="M 20 96 H 200" stroke={SILK} strokeWidth="1.6" />
    <Lbl x={26} y={90} tone={DIM} size={7} anchor="start">top copper</Lbl>
    <Smd x={44} y={80} w={22} h={14} />
    <Smd x={86} y={80} w={22} h={14} />
    <Smd x={128} y={80} w={22} h={14} />
    <path d="M 176 80 v 12 M 170 86 h 12" stroke={GOLD} strokeWidth="2" />
    <path d="M 110 100 V 108" stroke={DIM} strokeWidth="1.2" strokeDasharray="3 3" />
    <Lbl x={118} y={107} tone={DIM} size={7} anchor="start">bottom: routing only</Lbl>
    <Lbl x={55} y={72} tone={GOLD} size={7}>XT60</Lbl>
    <Lbl x={97} y={72} tone={GOLD} size={7}>XH</Lbl>
    <Lbl x={133} y={72} tone={GOLD} size={7}>BTN</Lbl>
    <Lbl x={110} y={18} tone={GOOD}>ports, buttons and LEDs live up here, aligned</Lbl>
    <Lbl x={110} y={122} tone={GOOD}>nothing to plug into on the back</Lbl>
  </Mini>
);

const Inside = () => (
  <Mini caption="THE OUTLINE IS THE LIMIT">
    <rect x="150" y="44" width="86" height="40" rx="4" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <path d="M 219 40 V 88" stroke={GOLD} strokeWidth="2" strokeDasharray="5 3" />
    <Lbl x={158} y={68} tone={SILK} size={8} anchor="start">U7</Lbl>
    <path d="M 212 34 l 7 7 M 219 34 l -7 7 M 212 85 l 7 7 M 219 85 l -7 7" stroke={BAD} strokeWidth="1.4" />
    <Lbl x={100} y={18} tone={BAD}>half the part hangs past the edge</Lbl>
    <Lbl x={110} y={120} tone={BAD}>courtyards stay inside, or the panel route eats them</Lbl>
  </Mini>
);

const DisplayClear = () => (
  <Mini caption="TFT FULLY ABOARD, CLEAR BELOW">
    <rect x="96" y="32" width="140" height="46" rx="3" fill="#123125" stroke={GOLD} strokeWidth="1.6" />
    <Lbl x={140} y={58} tone={GOLD} size={9} anchor="start">TFT</Lbl>
    <path d="M 219 28 V 82" stroke={GOLD} strokeWidth="2" strokeDasharray="5 3" />
    <Hatch x={120} y={84} w={52} h={18} tone="#8a5a33" />
    <Callout x={146} y={92} r={24} />
    <Lbl x={100} y={18} tone={BAD}>screen floats past the edge, a tall part below it</Lbl>
    <Lbl x={110} y={122} tone={BAD}>overhang cracks, protrusions short</Lbl>
  </Mini>
);

const EdgeClear = () => (
  <Mini caption="COPPER KEEPS OFF THE EDGE">
    <path d="M 30 40 H 190" stroke={CU} strokeWidth="5" />
    <path d="M 26 30 H 194" stroke={GOLD} strokeWidth="1.6" strokeDasharray="5 3" />
    <Lbl x={34} y={56} tone={BAD} size={7.5} anchor="start">0.1 mm</Lbl>
    <path d="M 30 78 H 190" stroke={CU} strokeWidth="5" />
    <path d="M 26 60 H 194" stroke={GOLD} strokeWidth="1.6" strokeDasharray="5 3" />
    <Lbl x={34} y={94} tone={GOOD} size={7.5} anchor="start">0.4 mm</Lbl>
    <Lbl x={110} y={18} tone={DIM}>board outline is the gold dashes</Lbl>
    <Lbl x={110} y={120} tone={BAD}>edge copper gets chipped, scored or exposed</Lbl>
  </Mini>
);

const MechLayer = () => (
  <Mini caption="OUTLINE LIVES ON EDGE.CUTS">
    {[
      ["F.Cu", "#e0955a", 40], ["Edge.Cuts", "#f0cd8d", 66], ["F.SilkS", "#e9f2ea", 92],
    ].map(([t, c, y]) => (
      <g key={t as string}>
        <rect x={52} y={y as number} width={116} height={20} rx="3" fill="#0f231b" stroke={c as string} strokeWidth="1.4" />
        <text x={62} y={(y as number) + 14} fontFamily="var(--font-mono)" fontSize="9" fill={c as string}>{t}</text>
        {t === "Edge.Cuts" && <path d={`M 150 ${(y as number) + 10} h 12`} stroke={c as string} strokeWidth="2" strokeDasharray="4 3" />}
      </g>
    ))}
    <Lbl x={110} y={18} tone={GOOD}>one layer, one job: the board shape</Lbl>
    <Lbl x={110} y={122} tone={GOOD}>CAM reads the outline from exactly this layer</Lbl>
  </Mini>
);

const Erc = () => (
  <Mini caption="ERC: ZERO ERRORS, ZERO WARNINGS">
    <rect x="42" y="32" width="136" height="72" rx="3" fill="#0f231b" stroke="#20493a" strokeWidth="1.4" />
    <Lbl x={110} y={48} tone={SILK} size={9}>ERC REPORT</Lbl>
    <path d="M 56 62 l 5 5 l 9 -10" stroke={GOOD} strokeWidth="2.2" fill="none" />
    <Lbl x={78} y={66} tone={GOOD} size={8.5} anchor="start">0 errors</Lbl>
    <path d="M 56 82 l 5 5 l 9 -10" stroke={GOOD} strokeWidth="2.2" fill="none" />
    <Lbl x={78} y={86} tone={GOOD} size={8.5} anchor="start">0 warnings</Lbl>
    <Lbl x={110} y={18} tone={GOOD}>floating pins and dead nets show up here first</Lbl>
    <Lbl x={110} y={120} tone={GOOD}>run it after every wiring session</Lbl>
  </Mini>
);

const NetNaming = () => (
  <Mini caption="ONE RAIL, ONE CLEAR NAME">
    <path d="M 24 44 H 120" stroke={CU} strokeWidth="4" />
    <Lbl x={128} y={47} tone={GOOD} size={8.5} anchor="start">3V3_MCU</Lbl>
    <path d="M 24 70 H 96" stroke={CU} strokeWidth="4" />
    <Lbl x={104} y={73} tone={BAD} size={8.5} anchor="start">N$17</Lbl>
    <path d="M 24 96 H 108" stroke={CU} strokeWidth="4" />
    <Lbl x={116} y={99} tone={BAD} size={8.5} anchor="start">VCC_1</Lbl>
    <Lbl x={110} y={18} tone={DIM}>the name should answer: what rail, whose</Lbl>
    <Lbl x={110} y={122} tone={BAD}>auto-names hide a split rail from the ERC</Lbl>
  </Mini>
);

const DivCalc = () => (
  <Mini caption="DIVIDER SETS THE REAL VOLTAGE">
    <path d="M 60 34 H 160" stroke={CU} strokeWidth="3.6" />
    <Lbl x={168} y={37} tone={GOLD} size={8} anchor="start">VOUT</Lbl>
    <rect x="104" y="40" width="12" height="24" fill="#17362a" stroke={SILK} strokeWidth="1.3" />
    <Lbl x={94} y={56} tone={SILK} size={8} anchor="end">R1</Lbl>
    <path d="M 110 64 V 72 H 160" stroke={CU} strokeWidth="2.6" fill="none" />
    <Lbl x={168} y={75} tone={GOLD} size={8} anchor="start">FB</Lbl>
    <rect x="104" y="72" width="12" height="24" fill="#17362a" stroke={SILK} strokeWidth="1.3" />
    <Lbl x={94} y={88} tone={SILK} size={8} anchor="end">R2</Lbl>
    <path d="M 110 96 V 102" stroke={CU} strokeWidth="2.6" />
    <Gnd x={110} y={104} />
    <Lbl x={110} y={18} tone={GOOD}>VOUT = VREF · (1 + R1/R2), computed, not copied</Lbl>
    <Lbl x={110} y={122} tone={GOOD}>wrong ratio, quietly wrong rail</Lbl>
  </Mini>
);

const Unwired = () => (
  <Mini caption="PLACED IS NOT CONNECTED">
    <rect x="30" y="40" width="44" height="36" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={52} y={62} tone={SILK} size={9}>U1</Lbl>
    <path d="M 74 50 H 112 M 74 62 H 100" stroke={CU} strokeWidth="2.6" />
    <circle cx={112} cy={50} r="2.4" fill="none" stroke={BAD} strokeWidth="1.4" />
    <circle cx={100} cy={62} r="2.4" fill="none" stroke={BAD} strokeWidth="1.4" />
    <rect x="140" y="76" width="44" height="28" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={162} y={94} tone={SILK} size={9}>U2</Lbl>
    <Callout x={162} y={90} r={28} />
    <Lbl x={110} y={18} tone={BAD}>wires end mid-air, U2 has none at all</Lbl>
    <Lbl x={110} y={122} tone={BAD}>every pin gets an answer, or the ERC does it for you</Lbl>
  </Mini>
);

const WrongSym = () => (
  <Mini caption="CHECK THE PINOUT BEFORE WIRING">
    <rect x="84" y="38" width="52" height="52" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={110} y={60} tone={SILK} size={8.5}>Q1</Lbl>
    <Lbl x={110} y={74} tone={DIM} size={7}>NMOS</Lbl>
    <path d="M 84 46 H 60 M 84 64 H 60 M 84 82 H 60" stroke={CU} strokeWidth="2.6" />
    <Lbl x={54} y={49} tone={GOLD} size={8} anchor="end">G</Lbl>
    <Lbl x={54} y={67} tone={GOLD} size={8} anchor="end">D</Lbl>
    <Lbl x={54} y={85} tone={GOLD} size={8} anchor="end">S</Lbl>
    <path d="M 136 46 H 168 M 136 64 H 168 M 136 82 H 168" stroke={CU} strokeWidth="2.6" />
    <Lbl x={172} y={49} tone={BAD} size={7.5} anchor="start">MOTOR?</Lbl>
    <Lbl x={172} y={67} tone={BAD} size={7.5} anchor="start">GND?</Lbl>
    <Lbl x={172} y={85} tone={BAD} size={7.5} anchor="start">24V?</Lbl>
    <Lbl x={110} y={18} tone={BAD}>symbol pins guessed against the nets</Lbl>
    <Lbl x={110} y={122} tone={BAD}>datasheet pinout first, wires second</Lbl>
  </Mini>
);

const PassiveVal = () => (
  <Mini caption="EVERY PASSIVE: VALUE AND TYPE">
    <rect x="40" y="44" width="30" height="18" fill="#17362a" stroke={SILK} strokeWidth="1.3" />
    <text x="55" y="57" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill={BAD}>R?</text>
    <path d="M 30 53 H 40 M 70 53 H 80" stroke={CU} strokeWidth="2.4" />
    <circle cx="122" cy="53" r="13" fill="#17362a" stroke={SILK} strokeWidth="1.3" />
    <text x="122" y="57" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill={BAD}>C?</text>
    <path d="M 100 53 H 109 M 135 53 H 146" stroke={CU} strokeWidth="2.4" />
    <rect x="158" y="42" width="40" height="22" fill="#17362a" stroke={SILK} strokeWidth="1.3" />
    <text x="178" y="56" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill={BAD}>10V?</text>
    <Lbl x={110} y={18} tone={BAD}>missing values, unverified voltage ratings</Lbl>
    <Lbl x={110} y={120} tone={BAD}>write it down, then check it fits the job</Lbl>
  </Mini>
);

const WireThru = () => (
  <Mini caption="WIRES GO AROUND, BUSES GROUP">
    <path d="M 30 38 H 190" stroke={GOOD} strokeWidth="3" />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M ${66 + i * 34} 38 V 52`} stroke={GOOD} strokeWidth="2" />
    ))}
    <Lbl x={34} y={30} tone={GOOD} size={7.5} anchor="start">bus: D0..D7</Lbl>
    <rect x="96" y="74" width="52" height="30" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={122} y={93} tone={SILK} size={8}>U3</Lbl>
    <path d="M 40 89 H 200" stroke={BAD} strokeWidth="2.6" />
    <Callout x={122} y={89} r={22} />
    <Lbl x={110} y={18} tone={GOOD}>parallel nets ride one bus, neat entries</Lbl>
    <Lbl x={110} y={122} tone={BAD}>a wire straight through a symbol hides connections</Lbl>
  </Mini>
);

const FuseShort = () => (
  <Mini caption="FUSE IN SERIES ON THE + FEED">
    <path d="M 20 38 H 200" stroke={CU} strokeWidth="5" />
    <Lbl x={26} y={30} tone={GOLD} size={8} anchor="start">24V</Lbl>
    <path d="M 20 92 H 200" stroke={CU} strokeWidth="5" />
    <Lbl x={26} y={106} tone={GOLD} size={8} anchor="start">GND</Lbl>
    <rect x="100" y="46" width="20" height="38" rx="3" fill="#17362a" stroke={SILK} strokeWidth="1.4" />
    <Lbl x={110} y={70} tone={SILK} size={8}>F1</Lbl>
    <path d="M 110 43 V 38 M 110 84 V 92" stroke={CU} strokeWidth="2.6" />
    {[
      [86, 60], [134, 60], [86, 72], [134, 72],
    ].map(([x, y]) => (
      <path key={`${x}${y}`} d={`M ${x} ${y} l -6 -4 M ${x} ${y} l -6 4`} stroke={BAD} strokeWidth="1.6" />
    ))}
    <Lbl x={110} y={18} tone={BAD}>fuse bridging the rails, not guarding them</Lbl>
    <Lbl x={110} y={122} tone={BAD}>first power-on becomes a spark, not a test</Lbl>
  </Mini>
);

const ConPol = () => (
  <Mini caption="XT60: PIN 1 IS + , VERIFY IT">
    <rect x="42" y="40" width="52" height="48" rx="6" fill="#17362a" stroke={GOLD} strokeWidth="1.6" />
    <Lbl x={68} y={60} tone={GOLD} size={8}>XT60</Lbl>
    <Lbl x={56} y={78} tone={BAD} size={8} anchor="start">1: −</Lbl>
    <path d="M 94 52 H 122 M 94 76 H 122" stroke={CU} strokeWidth="3" />
    <rect x="122" y="40" width="30" height="48" rx="3" fill="none" stroke={SILK} strokeWidth="1.3" />
    <path d="M 137 36 V 30 M 131 30 H 143" stroke={SILK} strokeWidth="1.6" />
    <Lbl x={130} y={56} tone={GOOD} size={9}>+</Lbl>
    <Lbl x={130} y={78} tone={GOOD} size={9}>−</Lbl>
    <Lbl x={160} y={56} tone={DIM} size={7} anchor="start">battery</Lbl>
    <Lbl x={110} y={18} tone={BAD}>wired minus-first, reversed against the pack</Lbl>
    <Lbl x={110} y={122} tone={BAD}>one swapped label fries everything downstream</Lbl>
  </Mini>
);

export const DIAGRAMS: Record<string, () => ReactElement> = {
  corners: Corners,
  widths: Widths,
  corner90: Corner90,
  viaspace: ViaSpace,
  stub: Stub,
  decap: Decap,
  relief: Relief,
  flood: Flood,
  railzone: RailZone,
  decapbunch: DecapBunch,
  canpair: CanPair,
  xtal: Xtal,
  cansplit: CanSplit,
  returnsplit: ReturnSplit,
  footprint: Footprint,
  mirror: Mirror,
  headergap: HeaderGap,
  mount: Mount,
  silkhdr: SilkHdr,
  silkpad: SilkPad,
  revsilk: RevSilk,
  drc: Drc,
  sliver: Sliver,
  creepage: Creepage,
  gerbers: Gerbers,
  drill: Drill,
  // deduction-coverage batch (Rev I)
  neckdown: Neckdown,
  vialadder: ViaLadder,
  thtpierc: ThtPierc,
  stitch: Stitch,
  viaarray: ViaArray,
  fb: Fb,
  powerloop: PowerLoop,
  spiderweb: SpiderWeb,
  wrongcap: WrongCap,
  underparts: UnderParts,
  topside: TopSide,
  inside: Inside,
  displayclear: DisplayClear,
  edgeclear: EdgeClear,
  mechlayer: MechLayer,
  erc: Erc,
  netnaming: NetNaming,
  divcalc: DivCalc,
  unwired: Unwired,
  wrongsym: WrongSym,
  passiveval: PassiveVal,
  wirethru: WireThru,
  fuseshort: FuseShort,
  conpol: ConPol,
};
