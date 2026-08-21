import type { Scheme } from "../types";

const ex = (
  id: string,
  title: string,
  description: string,
  reason: string,
  verdict: "pass" | "fail",
  extra: Partial<{ diagram: string; tags: string[] }> = {}
) => ({ id, title, description, reason, verdict, tags: [] as string[], ...extra });

/**
 * Built-in snapshot of the guide. The live source of truth for the deployed
 * site is public/data/scheme.json, edited by anyone with repo access.
 * This file is only the fallback when that file cannot be fetched.
 */
export const DEFAULT_SCHEME: Scheme = {
  meta: {
    team: "HKUST Robotics Team",
    doc: "STD-PCB-01",
    rev: "F",
    updated: "2026-02-26",
  },
  categories: [
    {
      id: "cat-trc",
      code: "TRC",
      name: "Trace Routing",
      blurb: "How you draw the copper decides whether the board survives the fab and carries its current without cooking itself.",
      examples: [
        ex(
          "ex-45",
          "45° corners everywhere",
          "Every bend in a trace is a 45° cut or a smooth curve. No trace on the board turns a hard right angle.",
          "Sharp corners trap etching chemicals, which eat the copper thin right at the bend. On fast signals they also throw the impedance off. Two 45° bends (or an arc) cost nothing and avoid both.",
          "pass",
          { diagram: "corners", tags: ["routing", "geometry"] }
        ),
        ex(
          "ex-netclass",
          "Trace widths from net classes",
          "Power nets run at 0.5 mm, signals at 0.25 mm — set once in net classes, so the design rule check flags any trace that breaks them.",
          "Rules in the checker beat rules in your head. Widths stay consistent across the whole board, and anyone can verify the setup in one place.",
          "pass",
          { diagram: "netclass", tags: ["routing", "drc"] }
        ),
        ex(
          "ex-teardrop",
          "Teardrops where traces meet pads",
          "Every trace flares out into a smooth teardrop before it reaches its pad — no skinny trace walking straight into a big pad.",
          "A thin trace meeting a large pad concentrates stress at the junction — that's where copper lifts when you rework a joint or the board flexes. The flare spreads the load over more copper so the connection stays put.",
          "pass",
          { diagram: "teardrop", tags: ["routing", "pads"] }
        ),
        ex(
          "ex-90",
          "90° corners on traces",
          "One or more traces turn a hard right angle.",
          "Acid trap: etching fluid pools in the corner and eats the copper thin exactly where the trace bends. On fast signals the corner also adds capacitance and bounces energy back. Two 45° bends fix it for free.",
          "fail",
          { diagram: "corner90", tags: ["routing", "etching"] }
        ),
        ex(
          "ex-neck",
          "Traces that neck down",
          "A trace squeezes thinner than its class width to slip between two pads.",
          "The thin part carries the same current as the rest of the net — it becomes a fuse you didn't ask for, heating first and sometimes vanishing during etching. If it won't fit at full width, move the pads.",
          "fail",
          { diagram: "neckdown", tags: ["routing", "current"] }
        ),
        ex(
          "ex-stub",
          "Leftover stubs on a net",
          "A trace branches and one arm goes nowhere — a dead-end stub, usually left behind after a reroute.",
          "At speed, an open stub rings and radiates — a little antenna you didn't order. When a net moves, delete the old copper. Don't leave tails.",
          "fail",
          { diagram: "stub", tags: ["routing", "cleanup"] }
        ),
      ],
    },
    {
      id: "cat-pwr",
      code: "PWR",
      name: "Power & Grounding",
      blurb: "Clean power in, heat out, joints that actually solder. This is where boards live or die.",
      examples: [
        ex(
          "ex-relief",
          "Thermal relief on plane pads",
          "Any pad that connects into a copper plane does it through four spokes — never solid copper.",
          "A solid link into a big plane pulls heat away faster than the iron can put it in — hello, cold joints. Spokes keep the connection while letting the pad get hot enough to solder.",
          "pass",
          { diagram: "relief", tags: ["soldering", "planes"] }
        ),
        ex(
          "ex-stitch",
          "Ground stitched through vias",
          "Top and bottom ground pours are tied together with stitching vias — thickly near anywhere a signal swaps layers.",
          "Stitching gives return currents a short way home. Short loops mean less noise, and the planes stop ringing against each other at RF.",
          "pass",
          { diagram: "stitch", tags: ["grounding", "emi"] }
        ),
        ex(
          "ex-decap-one",
          "One decoupling cap per power pin",
          "Every VDD / VDDA / VBAT pin on the MCU gets its own 100 nF cap with a short path to the pin and to ground. Our usual way: a 3.3 V zone on the back layer, each cap via'd straight down into it.",
          "Each pin draws its own bursts of current, and only a cap sitting right next to it can answer fast enough. The back-layer zone keeps the return paths short without eating up the top side.",
          "pass",
          { diagram: "decap", tags: ["decoupling", "mcu"] }
        ),
        ex(
          "ex-reg-thermal",
          "Regulators dump heat through vias",
          "The regulator's tab / exposed pad is stitched with thermal vias down to the ground plane. The plane's copper does the spreading.",
          "The tab is the part's main heat exit. Vias into ground copper turn the whole plane into a heatsink — for our loads, that's plenty.",
          "pass",
          { diagram: "thermalvias", tags: ["thermal", "regulator"] }
        ),
        ex(
          "ex-rail-zone",
          "Power rails run on copper, not wire",
          "The 5 V output reaches its inductor through a pour, the LM1117's 3.3 V leaves on a zone, and the 3.3 V rail is zoned or fat — never signal-width. Bulk caps sit next to the load, beside the inductor.",
          "Rails carry the whole board's current, so thin wire means lost voltage and heat where you can least afford it. Copper is free — spend it. On the switcher side, fat copper also keeps the noisy loop tight.",
          "pass",
          { diagram: "railzone", tags: ["power", "zones", "regulator"] }
        ),
        ex(
          "ex-viapad",
          "Via drilled inside an SMD pad",
          "A via sits inside an SMD pad, untented and unplugged.",
          "During reflow, liquid solder drains down the via and starves the joint — or the lopsided pad flips the part upright (tombstoning). Keep vias outside pads, or use properly filled and plugged via-in-pad.",
          "fail",
          { diagram: "viapad", tags: ["assembly", "reflow"] }
        ),
        ex(
          "ex-flood",
          "Copper pour flooding a pad",
          "A ground pour has crept onto a signal pad with no clearance.",
          "That's a short to the plane — sometimes one you only find after assembly, when the board is already full of parts. Every pour obeys the clearance rule on every net. No exceptions.",
          "fail",
          { diagram: "flood", tags: ["clearance", "shorts"] }
        ),
        ex(
          "ex-decap-shared",
          "One cap shared across power pins",
          "A single cap — or a bunch tied together — feeds two or more of the MCU's power pins.",
          "The shared cap sits too far from most pins, and its path crosses everyone else's return current — so noise flows through the whole bunch instead of dying at its source. One pin, one cap, short path.",
          "fail",
          { diagram: "decapbunch", tags: ["decoupling", "mcu"] }
        ),
        ex(
          "ex-rail-thin",
          "Power rails drawn as thin traces",
          "A regulator feeding its inductor through a skinny trace, or the 3.3 V rail routed at signal width.",
          "Thin copper on a rail means voltage drop and heat under load. On the switcher side it also stretches the loop, which makes ringing worse. If a rail must cross busy territory, pour it on another layer and stitch down — don't thin it out.",
          "fail",
          { diagram: "thinrail", tags: ["power", "width"] }
        ),
        ex(
          "ex-cap-wrong",
          "22 pF where the regulator wants 22 µF",
          "The regulator's bulk cap fitted in the wrong size class — a pF value where µF is needed.",
          "A pF cap only filters the very fastest noise; the bulk cap is the energy bucket the load drinks from. With a pF in its place the output sags and the regulator can ring under load. Read µF / nF / pF twice on every part before ordering.",
          "fail",
          { diagram: "wrongcap", tags: ["passives", "regulator"] }
        ),
      ],
    },
    {
      id: "cat-bus",
      code: "BUS",
      name: "CAN, Clock & Signals",
      blurb: "CAN bus, the crystal, and general signal care — the small grouping habits that decide whether the bus survives a noisy robot.",
      examples: [
        ex(
          "ex-can-pair",
          "CANH and CANL as symmetrical as possible",
          "The two CAN wires run as a mirror pair: same length, same bends, same spacing — as symmetrical as the board allows — and stay away from power switching.",
          "CAN reads the difference between its two wires. When they're symmetrical, outside noise hits both the same way and cancels out. When they're not, the difference turns into errors. Symmetry is the whole trick.",
          "pass",
          { diagram: "canpair", tags: ["can", "differential"] }
        ),
        ex(
          "ex-xtal",
          "Load caps first, then the crystal — mirrored",
          "The crystal's two load caps sit between the MCU and the crystal, placed as a mirror pair: same distance from the pins, same-length stubs to ground. The trace hits the cap before it reaches the crystal.",
          "A cap only does its job at the point the trace passes it — and the two halves of the oscillator want identical loading. Symmetric caps, symmetric stubs: the crystal starts without argument.",
          "pass",
          { diagram: "xtal", tags: ["clock", "symmetry"] }
        ),
        ex(
          "ex-xtal-ring",
          "Crystal left unshielded",
          "No ground vias around the crystal, or worse — switching copper routed underneath it.",
          "The oscillator is the most easily disturbed part on the board. A ring of ground vias ties the top and bottom ground together around it and gives noise somewhere else to go. Cheap insurance, real results.",
          "fail",
          { diagram: "xtalring", tags: ["clock", "shielding"] }
        ),
        ex(
          "ex-via-clear",
          "Signals keep clear of stray vias",
          "Signal traces give vias they don't belong to a healthy margin, instead of threading between them.",
          "Drilled holes are never exactly where you drew them. A tight squeeze risks a breakout or a short after fab — and stray via capacitance nicks at fast edges anyway. If the gap is tight, move the via, not the luck.",
          "pass",
          { diagram: "viakeepout", tags: ["routing", "vias"] }
        ),
        ex(
          "ex-can-split",
          "CAN lines routed apart",
          "CANH and CANL take different paths, or one of them crosses a power / switching area alone.",
          "Any noise that lands on one wire but not the other shows up straight at the receiver — the one kind of noise CAN can't ignore. Re-pair them, even loosely, and steer both wires around the noisy copper.",
          "fail",
          { diagram: "cansplit", tags: ["can", "noise"] }
        ),
      ],
    },
    {
      id: "cat-sch",
      code: "SCH",
      name: "Schematic Hygiene",
      blurb: "The schematic gets read far more often than it gets drawn — in bring-up, in debug, at 2 a.m. Keep it readable and the layout follows.",
      examples: [
        ex(
          "ex-sch-flow",
          "Schematic flows left to right",
          "Signals enter on the left and leave on the right; power comes from the top, ground sinks to the bottom. Reading a page should feel like reading a sentence.",
          "When a board misbehaves, someone traces signals across the page. If the schematic flows, they find it in minutes; if it doesn't, they redraw it in their head first.",
          "pass",
          { diagram: "schflow", tags: ["readability", "pages"] }
        ),
        ex(
          "ex-sch-names",
          "One rail, one spelling",
          "Every net has exactly one name on every page — 3V3 everywhere, never 3.3V on one page and V3P3 on another.",
          "To the netlister, different spellings are different nets. Two names for the same rail mean the halves never connect — and the mistake only shows up on the finished board.",
          "pass",
          { diagram: "netnaming", tags: ["nets", "naming"] }
        ),
        ex(
          "ex-sch-decal",
          "Draw decoupling caps beside their pin",
          "On the schematic, each decoupling cap hangs right off the power pin it serves — not collected in a corner of the sheet.",
          "Caps tend to get placed where they were drawn. A cap drawn next to the pin gets laid out next to the pin — which is exactly where it has to be.",
          "pass",
          { diagram: "decal", tags: ["decoupling", "placement"] }
        ),
        ex(
          "ex-sch-erc",
          "ERC clean before layout starts",
          "The schematic runs the electrical rules check with zero errors — and a second person has read it once — before layout begins.",
          "Every mistake caught in the schematic is free; the same mistake caught after fab costs a new board. The ERC is the cheapest review you'll ever run.",
          "pass",
          { diagram: "erc", tags: ["erc", "review"] }
        ),
      ],
    },
    {
      id: "cat-fpt",
      code: "FPT",
      name: "Footprints & Packages",
      blurb: "A footprint is a promise to the assembly house. Break it and the part simply won't fit.",
      examples: [
        ex(
          "ex-lib",
          "Library footprints, IPC-7351",
          "Every part uses a footprint from the team library, generated to IPC-7351 density level B.",
          "Generated footprints match real part bodies and stencil rules, which is what keeps parts flat and centred after reflow. Hand-drawn pads are where tombstones come from.",
          "pass",
          { diagram: "footprint", tags: ["library", "ipc"] }
        ),
        ex(
          "ex-pin1",
          "Pin 1 and polarity marked",
          "Every polarised part has a pin-1 dot or triangle in the silkscreen, and the footprint carries the same marker.",
          "Whoever assembles it — person or machine — must know which way round with zero doubt. Missing polarity marks are the number-one cause of backwards parts.",
          "pass",
          { diagram: "pin1", tags: ["silkscreen", "assembly"] }
        ),
        ex(
          "ex-xh-lib",
          "XH2.54 footprints from the library, with 3D",
          "JST-XH (2.54 mm) connector footprints come from a proper library — pads, courtyard and 3D body — so fit is checked in the 3D view before fab.",
          "The 3D model is how you catch plug collisions, height clashes and mirrored connectors before you're holding the physical board. Library footprints also carry verified pad geometry instead of guesswork.",
          "pass",
          { diagram: "xh", tags: ["connectors", "3d"] }
        ),
        ex(
          "ex-hand",
          "Hand-drawn footprint, unverified",
          "Pads sketched by eye from the datasheet's mechanical drawing.",
          "Datasheet package drawings are not PCB pad geometry. Unchecked footprints mean solder problems you only find after the board arrives. Use the library — or generate the pads, then measure them against the drawing.",
          "fail",
          { diagram: "sketchfp", tags: ["library", "risk"] }
        ),
        ex(
          "ex-mirror",
          "Mirrored footprint",
          "A part drawn as if seen through the board — pads mirrored, silkscreen text backwards.",
          "The component physically cannot be placed. This happens when a footprint is edited in the wrong layer view, so flipping the view is the very first thing anyone checks.",
          "fail",
          { diagram: "mirror", tags: ["layers", "placement"] }
        ),
        ex(
          "ex-headers-tight",
          "Headers packed with no room for housings",
          "Neighbouring 4-pin (or 2-pin) headers spaced for the bare pins only — XH housings and plugs have nowhere to go.",
          "XH housings are wider than their pins, and plugs need room to approach. Pack headers together and only the first one stays pluggable. Space them for the housings, not for the drill holes.",
          "fail",
          { diagram: "headergap", tags: ["connectors", "placement"] }
        ),
      ],
    },
    {
      id: "cat-sil",
      code: "SIL",
      name: "Silkscreen & Documentation",
      blurb: "The board has to be readable by a human holding a soldering iron at 2 a.m. before a competition.",
      examples: [
        ex(
          "ex-refdes",
          "Reference designators outside the body",
          "Every part is labelled with its reference (C12, U3…) at least 1 mm tall, outside the component body, reading left-to-right or bottom-to-top.",
          "Readable references let anyone jump from a fault on the schematic to the part on the board in seconds. Labels inside the body get covered by the part — dead ink.",
          "pass",
          { diagram: "refdes", tags: ["silkscreen", "readability"] }
        ),
        ex(
          "ex-silk-headers",
          "Headers labelled: function first, then pin map",
          "Every header's silk names the port's function first, then spells out each pin, left to right — e.g. UART_GVTR: a UART port where G = GND, V = power, T = TX, R = RX. One letter per pin, in plug order.",
          "During bring-up someone plugs in without opening the schematic. Function-first names find the right port; a per-pin map in plug order means the first wire lands where expected. The name is the documentation.",
          "pass",
          { diagram: "silkhdr", tags: ["silkscreen", "connectors"] }
        ),
        ex(
          "ex-silkpad",
          "Silkscreen over pads",
          "Legend lines or text cross exposed copper pads.",
          "Ink on a pad stops solder from wetting — opens and weak joints follow. Many fabs strip silk from pads anyway, taking your markings with it. Keep all silk at least 0.2 mm from exposed copper.",
          "fail",
          { diagram: "silkpad", tags: ["silkscreen", "soldering"] }
        ),
        ex(
          "ex-polarity",
          "Missing or ambiguous polarity",
          "Diodes, electrolytic caps or connectors carry no visible polarity mark on the assembled side.",
          "It forces whoever assembles it to cross-check the schematic for every part — and one wrong guess kills the board at first power-on.",
          "fail",
          { diagram: "nopolarity", tags: ["silkscreen", "assembly"] }
        ),
      ],
    },
    {
      id: "cat-clr",
      code: "CLR",
      name: "Clearance & DFM",
      blurb: "Respect the fab's limits and the physics of high voltage — the board has to survive being made, and the real world.",
      examples: [
        ex(
          "ex-drc",
          "DRC clean at the fab's real limits",
          "The design passes the design rule check with zero errors at 0.2 mm clearance / 0.2 mm track — our JLCPCB baseline.",
          "A clean DRC at the fab's actual capability is the cheapest insurance there is. Running it with looser rules just hides failures the fab will find for you — at your expense.",
          "pass",
          { diagram: "drc", tags: ["drc", "fab"] }
        ),
        ex(
          "ex-sliver",
          "Copper slivers between pads",
          "Thin splinters of copper left between pads after a pour flood.",
          "Slivers can detach during etching and bridge neighbouring pads, or work loose with corrosion months later. Tweak pour clearance and hunt for lonely islands after every flood.",
          "fail",
          { diagram: "sliver", tags: ["pour", "etching"] }
        ),
        ex(
          "ex-creep",
          "Creepage violation on HV nets",
          "Mains or high-voltage nets run closer than the creepage table allows.",
          "Too little surface distance lets an arc crawl across the board over time — a safety failure, not a cosmetic one. HV nets get their own clearance rules and usually a routed slot.",
          "fail",
          { diagram: "creepage", tags: ["safety", "hv"] }
        ),
      ],
    },
    {
      id: "cat-doc",
      code: "DOC",
      name: "Deliverables",
      blurb: "What you hand over, and in what state. A perfect layout with broken outputs is still an unfinished board.",
      examples: [
        ex(
          "ex-datasheet",
          "Check it against the datasheet",
          "Before ordering: every part number, package, pinout and value cross-checked against the actual datasheet — not the symbol wizard, not memory, not a search result.",
          "The datasheet is the only source of truth. Wrong-package and wrong-pinout mistakes are the most common way boards arrive dead — and every one of them was preventable with a five-minute read.",
          "pass",
          { diagram: "datasheet", tags: ["ordering", "parts"] }
        ),
        ex(
          "ex-gerber",
          "Gerber set verified in a viewer",
          "All copper layers, masks, silk, paste, outline and the drill file exported — then eyeballed layer by layer in a Gerber viewer before zipping.",
          "Viewer review catches missing layers, mirrored art and wrong units before the board ships. Most “the fab broke my board” stories start exactly here.",
          "pass",
          { diagram: "gerbers", tags: ["outputs", "review"] }
        ),
        ex(
          "ex-drill",
          "Missing or mismatched drill file",
          "The drill file is absent from the Gerber zip, or drill hits don't line up with the pads.",
          "Without the drill data nobody can make holes — or worse, the fab guesses. Re-export the whole set from one CAD session and verify every layer, every time.",
          "fail",
          { diagram: "drill", tags: ["outputs", "fab"] }
        ),
      ],
    },
  ],
  checklist: [
    "Schematic: ERC clean, one spelling per rail, caps drawn beside their pins",
    "Every part cross-checked against its datasheet before ordering",
    "DRC passes with zero errors at 0.2 mm / 0.2 mm",
    "No right-angle corners, acid traps or dead-end stubs",
    "Power nets ≥ 0.5 mm; rails on zones, never thin wires",
    "One 100 nF decoupling cap per MCU power pin",
    "Regulator bulk caps are µF-class (not pF) and sit beside the load",
    "Thermal relief on plane pads; regulator tab via'd to GND copper",
    "No vias inside untented SMD pads",
    "CANH/CANL symmetrical — same length, same bends",
    "Crystal: load caps mirrored before it, ringed with GND vias",
    "Signals keep clear of vias they don't belong to",
    "Pin-1 / polarity marked on every polarised part",
    "Header silk: function first, then per-pin map (e.g. UART_GVTR)",
    "Connectors from the library with 3D checked; headers spaced for housings",
    "Every subsystem on the schematic has a power feed — pneumatics included",
    "Gerber set + drill file verified layer-by-layer in a viewer",
  ],
};
