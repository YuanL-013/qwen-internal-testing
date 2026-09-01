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
};
