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
 * site is public/data/scheme.json, edited by reviewers with repo access.
 * This file is only the fallback when that file cannot be fetched.
 */
export const DEFAULT_SCHEME: Scheme = {
  meta: {
    team: "Northbolt Robotics",
    doc: "STD-PCB-01",
    rev: "E",
    updated: "2026-03-04",
  },
  categories: [
    {
      id: "cat-trc",
      code: "TRC",
      name: "Trace Routing",
      blurb:
        "How copper is drawn decides whether the board etches cleanly and carries its current without turning into a heater.",
      examples: [
        ex(
          "ex-45",
          "45° corners everywhere",
          "Every change of direction is a 45° mitre or a smooth arc — no net on the board carries a right angle.",
          "Right-angle corners trap etchant during fabrication and become impedance bumps on fast signals. 45° corners etch evenly, keep impedance constant and read as intentional work.",
          "pass",
          { diagram: "corners", tags: ["routing", "geometry"] }
        ),
        ex(
          "ex-netclass",
          "Net classes, not magic widths",
          "Power nets run at 0.5 mm, signals at 0.25 mm — widths defined once in net classes, so the DRC catches any violation automatically.",
          "Net classes move width rules out of memory and into the DRC. Widths stay consistent across the whole board, and anyone can verify the rule set in one place.",
          "pass",
          { diagram: "netclass", tags: ["routing", "drc"] }
        ),
        ex(
          "ex-teardrop",
          "Teardrops at pad entries",
          "Traces flare into a teardrop where they meet pads and vias, instead of stopping abruptly at the pad edge.",
          "The flare spreads drill shock and thermal stress over more copper, so pads stop lifting during rework or heavy soldering. Most CAD tools generate them in one click — there is no reason not to.",
          "pass",
          { diagram: "teardrop", tags: ["routing", "reliability"] }
        ),
        ex(
          "ex-90",
          "90° corners on traces",
          "One or more traces turn with a sharp right angle.",
          "Acid trap: etchant pools inside the corner and over-etchs the copper, thinning the trace exactly where it bends. On fast signals the corner adds capacitance and reflects energy. Use two 45° segments or an arc instead.",
          "fail",
          { diagram: "corner90", tags: ["routing", "etching"] }
        ),
        ex(
          "ex-neck",
          "Neck-downs below class width",
          "A trace narrows below its class width to squeeze between two pads.",
          "The thin segment carries the same current as the rest of the net, so it becomes a fuse: it heats first and can be eaten entirely during etching. If the gap can't be crossed at full width, the neighbouring pads need to move.",
          "fail",
          { diagram: "neckdown", tags: ["routing", "current"] }
        ),
        ex(
          "ex-antipad",
          "Holes biting into pads",
          "A drill breaks through the edge of a pad, or the annular ring is thinner than the fab's minimum.",
          "With little or no ring left, the barrel connection is unreliable and the pad can delaminate at the first rework. Give every hole a full annular ring — or keep it out of the pad entirely.",
          "fail",
          { diagram: "antipad", tags: ["drill", "reliability"] }
        ),
      ],
    },
    {
      id: "cat-pwr",
      code: "PWR",
      name: "Power & Grounding",
      blurb:
        "Clean power delivery and joints that can actually be soldered — the difference between a board and a paperweight.",
      examples: [
        ex(
          "ex-relief",
          "Thermal relief on plane connections",
          "Every pad tied into a copper plane connects through four spokes, never solid copper.",
          "A solid tie into a big plane drags heat out of the joint faster than the iron can deliver it — the classic cold joint. Spokes keep the electrical connection while letting the pad reach soldering temperature.",
          "pass",
          { diagram: "relief", tags: ["soldering", "planes"] }
        ),
        ex(
          "ex-stitch",
          "Ground pour stitched with vias",
          "Top and bottom ground pours are tied together with stitching vias, placed densely near signal layer changes.",
          "Stitching gives return currents a short path home, shrinks loop area and EMI, and stops the two planes resonating against each other at RF.",
          "pass",
          { diagram: "stitch", tags: ["grounding", "emi"] }
        ),
        ex(
          "ex-decap-one",
          "One decoupling cap per power pin",
          "Every VDD / VDDA / VBAT pin of the MCU gets its own 100 nF cap with a short path to the pin and to ground — our usual practice is a 3.3 V zone on the back layer that each cap vias straight down into.",
          "Each pin draws its own switching current, and a dedicated local cap is the only reservoir close enough to answer. The back-layer zone keeps every return path short without burning routing space on top.",
          "pass",
          { diagram: "decap", tags: ["decoupling", "mcu"] }
        ),
        ex(
          "ex-cap-orient",
          "Bulk caps oriented before fab",
          "Every polarised cap — electrolytic or tantalum — has its stripe / marking matched to the board silk, checked twice: once in layout, once against the BOM.",
          "A reversed bulk cap is the classic first-power-on firework. The stripe always means the negative side; when part and footprint disagree, the part wins and the footprint gets fixed.",
          "pass",
          { diagram: "caporient", tags: ["passives", "polarity"] }
        ),
        ex(
          "ex-reg-thermal",
          "Regulators dump heat through vias into GND copper",
          "The regulator's tab / exposed pad is stitched with thermal vias down to the ground plane; the plane copper does the spreading.",
          "The tab is the main heat path out of the part. Vias into ground copper turn the whole plane into a heat sink — for our loads that is enough, no exotic copper pours needed.",
          "pass",
          { diagram: "thermalvias", tags: ["thermal", "regulator"] }
        ),
        ex(
          "ex-rail-zone",
          "Regulator outputs leave on copper zones",
          "The 5 V switcher output reaches its inductor through a pour, the LM1117's 3.3 V leaves on a zone, and the 3.3 V rail itself is zoned or fat — never signal width. Bulk caps sit at the point of load, next to the inductor.",
          "Rails carry the whole board's current, so thin wire drops voltage and burns heat exactly where you can least afford it. Copper is free — spend it. On the switcher side, wide copper also keeps the commutating loop tight and less noisy.",
          "pass",
          { diagram: "railzone", tags: ["power", "zones", "regulator"] }
        ),
        ex(
          "ex-starpoint",
          "Analog and digital grounds split at one point",
          "Sensitive analog circuitry gets its own quiet ground region, joined to the noisy digital ground at a single star point — one 0 Ω resistor or narrow bridge.",
          "Motor and switcher return currents flowing through the analog ground show up as noise on every measurement. Splitting the regions and forcing one crossing keeps the dirty currents out of the quiet zone.",
          "pass",
          { diagram: "starpoint", tags: ["grounding", "analog"] }
        ),
        ex(
          "ex-viapad",
          "Via drilled inside an SMD pad",
          "A via sits directly inside an SMD pad, untented and unplugged.",
          "During reflow, molten solder wicks down the via and starves the joint — or the uneven pad makes the part tombstone. Keep vias outside the pad, or use properly tented and plugged via-in-pad.",
          "fail",
          { diagram: "viapad", tags: ["assembly", "reflow"] }
        ),
        ex(
          "ex-flood",
          "Copper pour floods a pad",
          "A ground pour creeps onto a signal pad with zero clearance.",
          "That is a short between the pad and the plane — sometimes only visible after assembly, when the board is already populated. Every pour must respect the board clearance rule against every net, no exceptions.",
          "fail",
          { diagram: "flood", tags: ["clearance", "shorts"] }
        ),
        ex(
          "ex-decap-shared",
          "One decoupling cap shared across power pins",
          "A single cap — or a bunch wired together — feeds two or more VDD pins of the MCU.",
          "The shared cap sits too far from most pins, and its path crosses the other pins' return currents, so high-frequency noise flows through the whole bunch instead of being absorbed at the source. One pin, one cap, short path.",
          "fail",
          { diagram: "decapbunch", tags: ["decoupling", "mcu"] }
        ),
        ex(
          "ex-rail-thin",
          "Power rails routed as thin traces",
          "A regulator feeding its inductor through a skinny trace, or the 3.3 V rail routed at signal width.",
          "Undersized copper means IR drop plus heat under load. On the switcher side it also stretches the loop inductance and makes ringing worse. If a rail must cross a crowded region, pour it on another layer and stitch down — don't neck it.",
          "fail",
          { diagram: "thinrail", tags: ["power", "width"] }
        ),
        ex(
          "ex-cap-wrong",
          "22 pF where the regulator wants 22 µF",
          "The regulator's output bulk cap fitted in the wrong order of magnitude — a pF value where µF is required.",
          "A pF cap only filters RF; the bulk cap is the energy store the load draws from between cycles. With pF in its place the output sags and the control loop can oscillate under load. Sanity-check µF vs nF vs pF on every passive before ordering.",
          "fail",
          { diagram: "wrongcap", tags: ["passives", "regulator"] }
        ),
      ],
    },
    {
      id: "cat-bus",
      code: "BUS",
      name: "CAN, Clock & Signals",
      blurb:
        "CAN bus, crystal and general signal routing — the small symmetry and placement decisions that decide whether the bus survives a noisy robot.",
      examples: [
        ex(
          "ex-can-pair",
          "CANH and CANL as symmetrical as possible",
          "The two CAN wires are routed as a mirror pair: same length, same bends, same spacing — as symmetrical as the board allows — and kept away from power switching.",
          "CAN is differential: the receiver only reads the difference between the wires. The more symmetric the pair, the more of the picked-up noise lands on both wires equally and cancels out. Asymmetry turns common noise into differential errors — and the bus starts failing exactly when the motors spin.",
          "pass",
          { diagram: "canpair", tags: ["can", "differential", "symmetry"] }
        ),
        ex(
          "ex-xtal-caps",
          "Load caps first, then the crystal",
          "The crystal's load caps sit between the MCU and the crystal — the trace hits the cap pad before it reaches the crystal, with the shortest possible stubs.",
          "The cap has to shunt the crystal pin to ground; any trace past the cap toward the crystal detunes the load capacitance and invites start-up trouble. Caps closest to the MCU side, crystal after.",
          "pass",
          { diagram: "xtal", tags: ["clock", "placement"] }
        ),
        ex(
          "ex-via-clear",
          "Signals keep clear of unrelated vias",
          "Signal traces give non-member vias a healthy margin instead of slipping between them.",
          "Via drills carry positional tolerance — a tight pass risks drill breakout or a short after fab, and stray via capacitance nicks at fast edges. If a corridor is tight, move the via, not the tolerance.",
          "pass",
          { diagram: "viakeepout", tags: ["routing", "vias"] }
        ),
        ex(
          "ex-can-split",
          "CAN lines split or length-mismatched",
          "CANH and CANL sent on different paths, one crossing a power / switching area alone, or the two arriving with visibly different lengths.",
          "Whatever couples into one line but not the other arrives as a differential error — the one kind of noise CAN cannot reject. Length mismatch adds skew on top. Re-pair them, mirror the bends, and steer both wires around the noisy copper.",
          "fail",
          { diagram: "cansplit", tags: ["can", "noise", "symmetry"] }
        ),
        ex(
          "ex-xtal-ring",
          "Crystal left unshielded",
          "No ground vias around the crystal, or switching copper routed under or beside it.",
          "A ring of GND stitching vias around the crystal — with the load caps inside it — shields the clock from nearby switching noise and gives the caps a quiet reference. Without it, the oscillator couples to whatever is noisy this week. A dozen vias is cheap insurance for the whole robot's timing.",
          "fail",
          { diagram: "xtalring", tags: ["clock", "shielding"] }
        ),
      ],
    },
    {
      id: "cat-fpt",
      code: "FPT",
      name: "Footprints & Packages",
      blurb:
        "The footprint is a promise to the assembly house. Break it and the part simply will not fit.",
      examples: [
        ex(
          "ex-lib",
          "Library footprints, IPC-7351",
          "Every part uses a footprint from the team library, generated to IPC-7351 density level B.",
          "Generated footprints match real part bodies and paste-stencil rules, avoiding the tombstoning and misalignment that hand-drawn pads cause after reflow.",
          "pass",
          { diagram: "footprint", tags: ["library", "ipc"] }
        ),
        ex(
          "ex-pin1",
          "Pin 1 and polarity marked",
          "Every polarised part has a pin-1 dot or triangle on silkscreen, and the matching marker sits on the footprint itself.",
          "Assembly — human or pick-and-place — must know orientation with zero doubt. Missing polarity marks are the number-one cause of backwards parts on student boards.",
          "pass",
          { diagram: "pin1", tags: ["silkscreen", "assembly"] }
        ),
        ex(
          "ex-xh-lib",
          "XH2.54 footprints from the library, with 3D",
          "JST-XH (2.54 mm) connector footprints come from a proper library — pads, courtyard and 3D body included — so fit is checked in the 3D view before fab.",
          "The 3D model is how you catch plug collisions, height clashes and mirrored connectors before you are holding a physical board. Library footprints also carry verified pad geometry instead of guesswork.",
          "pass",
          { diagram: "xh", tags: ["connectors", "3d"] }
        ),
        ex(
          "ex-courtyard",
          "Courtyard kept clear",
          "Every footprint carries a courtyard (F.CrtYd) and nothing — tracks, silks of other parts, other bodies — enters it.",
          "The courtyard is the part's working space: placement tolerance, rework clearance and inspection access all live there. Parts that share copper fight over it forever.",
          "pass",
          { diagram: "courtyard", tags: ["ipc", "placement"] }
        ),
        ex(
          "ex-mount",
          "Mounting holes done properly",
          "Mounting holes are plated where they carry ground, keep a copper keep-out ring around the hole, and leave clearance for the screw head and washer.",
          "Plated holes tie the chassis to ground and survive repeated screwing; the keep-out stops the screw biting live copper, and the clearance circle stops the head shorting pads nobody remembered.",
          "pass",
          { diagram: "mount", tags: ["mechanical", "grounding"] }
        ),
        ex(
          "ex-hand",
          "Hand-drawn footprint, unverified",
          "Pads sketched by eye from the datasheet's mechanical drawing.",
          "Datasheet package drawings are not PCB pad geometry. Unchecked footprints mean solderability problems discovered only after fabrication. Use the library — or generate the pads, then measure them against the drawing.",
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
          "Adjacent 4-pin (or 2-pin) headers spaced for bare pins only — XH housings and plugs have nowhere to go.",
          "XH housings are wider than their pins, and plugs need approach space. Pack headers together and only the first one stays pluggable. Space them for the housings, not for the drill holes.",
          "fail",
          { diagram: "headergap", tags: ["connectors", "placement"] }
        ),
      ],
    },
    {
      id: "cat-sil",
      code: "SIL",
      name: "Silkscreen & Documentation",
      blurb:
        "The board must be readable by a human holding a soldering iron at 2 a.m. before a competition.",
      examples: [
        ex(
          "ex-refdes",
          "Reference designators outside the body",
          "Every part is labelled with a reference of at least 1 mm height, placed outside the component body, reading left-to-right or bottom-to-top.",
          "Readable references let anyone map a fault from schematic to board in seconds. Labels inside the body get covered by the part anyway — dead ink.",
          "pass",
          { diagram: "refdes", tags: ["silkscreen", "readability"] }
        ),
        ex(
          "ex-silk-headers",
          "Header legends made obvious",
          "Every header carries a loud legend: pin 1 marker, pitch, and what it is — net names or function — readable at arm's length.",
          "During bring-up and in the pit, somebody will plug into the wrong header once. Obvious header silk is the cheapest mistake-prevention on the whole board.",
          "pass",
          { diagram: "silkhdr", tags: ["silkscreen", "connectors"] }
        ),
        ex(
          "ex-testpts",
          "Test points where the probes go",
          "Bare, solder-mask-opened pads on a 1.27 mm grid for the rails and buses you will actually probe — 3.3 V, CANH, CANL, GND — each labelled in silk.",
          "Without test points, bring-up means probing a 0402 pad with a shaking hand. A labelled probe pad turns a twenty-minute debug into a thirty-second one.",
          "pass",
          { diagram: "testpts", tags: ["bringup", "probing"] }
        ),
        ex(
          "ex-silkpad",
          "Silkscreen over pads",
          "Legend lines or text cross exposed copper pads.",
          "Ink on a pad stops solder from wetting — opens and weak joints follow. Many fabs silently strip silk from pads, taking your markings with it. Keep all silk at least 0.2 mm from exposed copper.",
          "fail",
          { diagram: "silkpad", tags: ["silkscreen", "soldering"] }
        ),
        ex(
          "ex-polarity",
          "Missing or ambiguous polarity",
          "Diodes, electrolytic caps or connectors carry no visible polarity mark on the assembled side.",
          "It forces the assembler to cross-check the schematic for every single part — and one wrong guess destroys the board at first power-on.",
          "fail",
          { diagram: "nopolarity", tags: ["silkscreen", "assembly"] }
        ),
      ],
    },
    {
      id: "cat-clr",
      code: "CLR",
      name: "Clearance & DFM",
      blurb:
        "Respect the fab's minimums and the physics of high voltage — the board has to survive manufacture and the real world.",
      examples: [
        ex(
          "ex-drc",
          "DRC clean at the fab's real limits",
          "The design passes DRC with zero errors at 0.2 mm clearance / 0.2 mm track — our JLCPCB baseline.",
          "A clean DRC at the fab's actual capability is the cheapest insurance that exists. Running it with looser rules just hides failures the fab will find for you, at your expense.",
          "pass",
          { diagram: "drc", tags: ["drc", "fab"] }
        ),
        ex(
          "ex-sliver",
          "Copper slivers between pads",
          "Thin copper splinters left between pads after a pour flood.",
          "Slivers can detach during etching and bridge neighbouring pads, or corrode loose months later. Adjust pour clearance and hunt for isolated islands after every flood.",
          "fail",
          { diagram: "sliver", tags: ["pour", "etching"] }
        ),
        ex(
          "ex-creep",
          "Creepage violation on HV nets",
          "Mains or high-voltage nets run closer than the creepage table allows.",
          "Too little surface distance lets tracking arcs form across the board over time — a safety failure, not a cosmetic one. HV nets get their own clearance rules and usually a routed slot.",
          "fail",
          { diagram: "creepage", tags: ["safety", "hv"] }
        ),
      ],
    },
    {
      id: "cat-doc",
      code: "DOC",
      name: "Deliverables",
      blurb:
        "What you hand over, and in what state. A perfect layout with broken outputs is still an incomplete submission.",
      examples: [
        ex(
          "ex-gerber",
          "Gerber set verified in a viewer",
          "All copper layers, masks, silks, paste, outline and the Excellon drill file exported — then eyeballed layer by layer in a Gerber viewer before zipping.",
          "Viewer review catches missing layers, mirrored art and wrong units before the board ships. Most “the fab broke my board” stories start exactly here.",
          "pass",
          { diagram: "gerbers", tags: ["outputs", "review"] }
        ),
        ex(
          "ex-fiducials",
          "Fiducials for the pick-and-place",
          "At least three global fiducials — bare 1 mm copper dots with mask opened, placed asymmetrically — plus a local pair beside any fine-pitch part.",
          "The placement machine finds the board's real position through the fiducials. Without them, or with them covered by mask or silk, every SMD part shifts by the panel's mechanical tolerance.",
          "pass",
          { diagram: "fiducials", tags: ["assembly", "outputs"] }
        ),
        ex(
          "ex-drill",
          "Missing or mismatched drill file",
          "The drill file is absent from the Gerber zip, or drill hits do not line up with the pads.",
          "Without the drill data nobody can make holes — or worse, the fab guesses. Re-export the whole set from one CAD session and verify every layer, every time.",
          "fail",
          { diagram: "drill", tags: ["outputs", "fab"] }
        ),
      ],
    },
  ],
  checklist: [
    "DRC passes with zero errors at 0.2 mm / 0.2 mm",
    "No right-angle corners or acid traps on any net",
    "Power nets ≥ 0.5 mm; rails on zones, never thin wires",
    "One 100 nF decoupling cap per MCU power pin",
    "Regulator bulk caps are µF-class (not pF), oriented correctly, at the point of load",
    "Thermal relief on plane pads; regulator tab via'd to GND copper",
    "No vias inside untented SMD pads; annular rings intact",
    "CANH/CANL symmetrical — same length, same bends; crystal capped on the MCU side and ringed with GND vias",
    "Teardrops at pad entries; no stubs past the last pad",
    "Pin-1 / polarity marked on every polarised part; header legends obvious",
    "Connectors from the library with 3D checked; headers spaced for housings",
    "Mounting holes plated with keep-out rings; fiducials placed and unobstructed",
    "Labelled test points on the rails and buses you will probe",
    "Every subsystem in the schematic has a power feed — pneumatics included",
    "Gerber set + drill file verified layer-by-layer in a viewer",
  ],
};
