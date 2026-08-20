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
 * site is public/data/scheme.json. This file is only the fallback when that
 * file cannot be fetched, or is an older revision.
 */
export const DEFAULT_SCHEME: Scheme = {
  meta: {
    team: "Northbolt Robotics",
    doc: "STD-PCB-01",
    rev: "E",
    updated: "2026-02-24",
  },
  categories: [
    {
      id: "cat-trc",
      code: "TRC",
      name: "Trace Routing",
      blurb:
        "How you draw the copper decides whether the board comes back from the fab in one piece — and whether it carries its current without cooking.",
      examples: [
        ex(
          "ex-45",
          "45° corners, every turn",
          "Every bend in a trace is a 45° cut or a smooth curve. No right angles anywhere on the board.",
          "Sharp corners trap etching acid and thin the copper right at the bend. On fast signals they also disturb the line. Two 45° cuts or a curve etch clean and look deliberate.",
          "pass",
          { diagram: "corners", tags: ["routing", "geometry"] }
        ),
        ex(
          "ex-netclass",
          "Net classes instead of guessing widths",
          "Power nets run 0.5 mm, signals 0.25 mm — the widths live in net classes, so the DRC catches any slip for you.",
          "When widths live in one place, every trace stays consistent and the design check runs itself. You don't have to remember the numbers — the tool does.",
          "pass",
          { diagram: "netclass", tags: ["routing", "drc"] }
        ),
        ex(
          "ex-teardrop",
          "Teardrops where traces meet pads",
          "Traces enter pads through a small teardrop flare — the copper fans out just before it hits the pad.",
          "Drill holes are never perfectly placed. If the drill lands a little off, a bare trace-to-pad joint can crack or lift. The flare spreads the copper so the joint survives anyway. Most CAD tools do this automatically — turn it on.",
          "pass",
          { diagram: "teardrop", tags: ["routing", "dfm"] }
        ),
        ex(
          "ex-antipad",
          "Pads with room around the hole",
          "Every drilled pad keeps a full copper ring (annular ring) around its hole — the drill never eats into the pad edge.",
          "Fab drills wander a little — it's normal. If the pad is barely bigger than the hole, that wander breaks the ring and the pad lifts off. Give holes breathing room, and check small pads twice.",
          "pass",
          { diagram: "antipad", tags: ["routing", "dfm"] }
        ),
        ex(
          "ex-90",
          "90° corners on traces",
          "One or more traces turn with a hard right angle.",
          "Etching acid pools inside the corner and eats the copper — the trace gets thin exactly where it bends. On fast signals the corner also disturbs the line. Use two 45° cuts or a curve instead.",
          "fail",
          { diagram: "corner90", tags: ["routing", "etching"] }
        ),
        ex(
          "ex-neck",
          "Skinny neck between pads",
          "A trace goes thin to sneak between two pads.",
          "The thin part carries the same current as the rest of the net, so it gets hot first — it's a fuse you didn't ask for. If it doesn't fit at full width, move the pads.",
          "fail",
          { diagram: "neckdown", tags: ["routing", "current"] }
        ),
      ],
    },
    {
      id: "cat-pwr",
      code: "PWR",
      name: "Power & Grounding",
      blurb:
        "Good power means clean voltage, joints that solder first try, and parts that stay cool. Most dead boards die here.",
      examples: [
        ex(
          "ex-relief",
          "Thermal relief on plane pads",
          "Pads that touch a copper plane connect through four little spokes, never solid copper.",
          "A solid tie to a big plane pulls heat away faster than your iron can put it in — hello, cold joints. Spokes keep the connection while letting the pad get hot enough to solder properly.",
          "pass",
          { diagram: "relief", tags: ["soldering", "planes"] }
        ),
        ex(
          "ex-stitch",
          "Stitch ground pours with vias",
          "Top and bottom ground pours are tied together with stitching vias — extra dense near where signals change layer.",
          "The vias give return current a short way home. That keeps loops small and noise down, and stops the two planes ringing against each other.",
          "pass",
          { diagram: "stitch", tags: ["grounding", "emi"] }
        ),
        ex(
          "ex-decap-one",
          "One decoupling cap per power pin",
          "Every VDD / VDDA / VBAT pin on the MCU gets its own 100 nF cap, placed close, with a short path to the pin and to ground. Our usual way: a 3.3 V zone on the back layer, each cap via'ing straight down into it.",
          "Each pin draws its own spiky current, and only a cap sitting right next to it can answer fast enough. The back-layer zone keeps every path short without eating routing space on top.",
          "pass",
          { diagram: "decap", tags: ["decoupling", "mcu"] }
        ),
        ex(
          "ex-reg-thermal",
          "Send regulator heat into the ground copper",
          "The regulator's tab / exposed pad is stitched with thermal vias down to the ground plane. The plane copper spreads the heat.",
          "The tab is the main exit for heat. Vias plus ground copper turn the whole plane into a heatsink — for the loads we run, that's plenty.",
          "pass",
          { diagram: "thermalvias", tags: ["thermal", "regulator"] }
        ),
        ex(
          "ex-rail-zone",
          "Regulator outputs ride on copper zones",
          "The 5 V switcher feeds its inductor through a pour, the LM1117's 3.3 V leaves on a zone, and the 3.3 V rail itself is a zone or a fat trace — never a thin wire. Bulk caps sit where the power lands, next to the inductor.",
          "Rails carry the whole board's current. A thin wire drops voltage and gets hot exactly where you can't afford it. Copper is free — spend it. On the switcher side, fat copper also keeps the switching loop tight and quiet.",
          "pass",
          { diagram: "railzone", tags: ["power", "zones", "regulator"] }
        ),
        ex(
          "ex-caporient",
          "Electrolytic caps oriented for assembly",
          "Every electrolytic cap's stripe lines up with its silk outline, and pin 1 / minus is marked so the part can only go in one way.",
          "A backwards electrolytic cap isn't a typo — it swells and can pop. When the stripe, the silk and the footprint all agree, fitting it wrong becomes nearly impossible.",
          "pass",
          { diagram: "caporient", tags: ["passives", "assembly"] }
        ),
        ex(
          "ex-starpoint",
          "AGND and DGND meet at one star point",
          "Analog and digital grounds are separate copper, joined at exactly one spot — a thin bridge or a 0 Ω resistor near the power entry.",
          "Digital return current is noisy. If the two grounds touch anywhere they like, that noise wanders into your analog readings. One meeting point means you choose where the currents mix, instead of letting them mix everywhere.",
          "pass",
          { diagram: "starpoint", tags: ["grounding", "analog"] }
        ),
        ex(
          "ex-viapad",
          "Via drilled inside an SMD pad",
          "A via sits right inside an SMD pad, open and unplugged.",
          "During reflow, solder wicks down the via and the joint goes dry — or the lopsided pad makes the part flip up. Keep vias outside the pad, or use a properly tented and plugged via-in-pad.",
          "fail",
          { diagram: "viapad", tags: ["assembly", "reflow"] }
        ),
        ex(
          "ex-flood",
          "Copper pour floods a pad",
          "A ground pour creeps onto a signal pad with no gap at all.",
          "That's a short circuit — sometimes one you only find after the board is built. Every pour must respect the clearance rule against every net. No exceptions.",
          "fail",
          { diagram: "flood", tags: ["clearance", "shorts"] }
        ),
        ex(
          "ex-decap-shared",
          "One cap shared between power pins",
          "A single cap — or a bunch wired together — feeds two or more VDD pins on the MCU.",
          "The shared cap sits too far from most pins, and its path crosses the other pins' return current, so noise leaks into everything. One pin, one cap, short path.",
          "fail",
          { diagram: "decapbunch", tags: ["decoupling", "mcu"] }
        ),
        ex(
          "ex-rail-thin",
          "Power rail as a thin trace",
          "A regulator feeds its inductor through a skinny trace, or the 3.3 V rail is routed at signal width.",
          "Thin copper means voltage drop plus heat under load. On the switcher side it also stretches the loop and makes ringing worse. If a rail must cross a busy area, pour it on another layer and stitch down — don't pinch it.",
          "fail",
          { diagram: "thinrail", tags: ["power", "width"] }
        ),
        ex(
          "ex-cap-wrong",
          "22 pF where the regulator wants 22 µF",
          "The regulator's bulk cap is off by a huge factor — a pF value where µF is needed.",
          "A pF cap only filters radio noise. The bulk cap is the energy store the load drinks from. Put a pF cap there and the output sags, and the regulator can even start oscillating. Check µF / nF / pF on every passive before you order.",
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
        "CAN bus, crystals and plain signals. Small choices here decide whether the bus still talks when the motors spin.",
      examples: [
        ex(
          "ex-can-pair",
          "CANH and CANL, as symmetrical as you can",
          "The two CAN wires run together like mirror images: same length, same bends, same gap — as symmetrical as the board allows — and away from power switching. Light grouping is fine; the idea matters more than perfection.",
          "CAN is differential: noise that hits both wires the same way gets cancelled out. If the wires don't match, noise lands on them differently and turns into real errors — right when the motors are spinning. Keep the pair symmetrical and you keep the cancellation.",
          "pass",
          { diagram: "canpair", tags: ["can", "differential"] }
        ),
        ex(
          "ex-xtal",
          "Load caps first, then the crystal",
          "The crystal's load caps sit between the MCU and the crystal — the trace hits the cap pad before it reaches the crystal, with the shortest possible stub.",
          "The cap has to shunt the crystal pin to ground. Any extra trace past the cap changes the load and can cause start-up trouble. Caps first, crystal after, stubs short.",
          "pass",
          { diagram: "xtal", tags: ["clock", "placement"] }
        ),
        ex(
          "ex-xtalring",
          "A ring of ground vias around the crystal",
          "The crystal sits inside a ring of GND vias stitched to the ground plane. Load caps live inside the ring; noisy copper stays well outside it.",
          "The crystal sets the timing for the whole board, so it deserves a quiet room. The via ring keeps stray noise out and keeps the crystal's own signal from leaking into anything else. It costs a few seconds to place and saves a board that randomly won't boot.",
          "pass",
          { diagram: "xtalring", tags: ["clock", "shielding"] }
        ),
        ex(
          "ex-via-clear",
          "Signals keep clear of stray vias",
          "Signal traces give a wide berth to vias that aren't theirs, instead of slipping between them.",
          "Drill holes are never perfectly placed — a tight pass risks a breakout or a short after fab, and stray via capacitance chips at fast edges. If the corridor is tight, move the via, not your tolerance.",
          "pass",
          { diagram: "viakeepout", tags: ["routing", "vias"] }
        ),
        ex(
          "ex-can-split",
          "CAN wires going their own way",
          "CANH and CANL are routed separately, or one of them crosses a power / switching area alone.",
          "Noise that hits one wire but not the other arrives as an error CAN can't cancel. Even loosely, re-pair them, and steer both wires around the noisy copper.",
          "fail",
          { diagram: "cansplit", tags: ["can", "noise"] }
        ),
        ex(
          "ex-xtal-naked",
          "Crystal left naked",
          "No ground vias around the crystal, or switching copper routed right under it.",
          "Without its quiet room, the crystal picks up noise from everything nearby — and everything nearby picks up the crystal. Boards like this tend to fail randomly, which is the worst kind of fail to chase.",
          "fail",
          { diagram: "xtal", tags: ["clock", "shielding"] }
        ),
      ],
    },
    {
      id: "cat-fpt",
      code: "FPT",
      name: "Footprints & Packages",
      blurb:
        "The footprint is your promise to whoever solders the part. Break it and the part simply won't fit.",
      examples: [
        ex(
          "ex-lib",
          "Footprints from the library, IPC-7351",
          "Every part uses a footprint from the team library, made to IPC-7351 level B.",
          "Library footprints match real part bodies and paste-stencil rules. They save you from tombstoning and misaligned parts after reflow — problems you'd only find out about the expensive way.",
          "pass",
          { diagram: "footprint", tags: ["library", "ipc"] }
        ),
        ex(
          "ex-pin1",
          "Pin 1 and polarity marked",
          "Every part with a direction has a pin-1 dot or triangle in silkscreen, and the footprint itself carries the mark too.",
          "Whoever solders it — human or machine — should never have to guess. Missing polarity marks are the number-one cause of backwards parts on our boards.",
          "pass",
          { diagram: "pin1", tags: ["silkscreen", "assembly"] }
        ),
        ex(
          "ex-xh-lib",
          "XH2.54 footprints from the library, with 3D",
          "JST-XH (2.54 mm) connectors use a proper library footprint — pads, courtyard and 3D body included — so the fit is checked in the 3D view before fab.",
          "The 3D model is how you catch plug collisions, height clashes and mirrored connectors before the board is in your hand. Library footprints also bring checked pad sizes instead of guesswork.",
          "pass",
          { diagram: "xh", tags: ["connectors", "3d"] }
        ),
        ex(
          "ex-courtyard",
          "Courtyard kept clear",
          "Every part keeps its IPC courtyard — the keep-out outline around the body — free of other parts' courtyards, copper and tall neighbours.",
          "The courtyard is the part's working space: room for the pick-and-place nozzle, for your soldering iron, and for a quick visual check. Overlapping courtyards means fighting over every part you place or fix.",
          "pass",
          { diagram: "courtyard", tags: ["placement", "ipc"] }
        ),
        ex(
          "ex-mount",
          "Mounting holes done properly",
          "Mounting holes are plated, keep a copper- and silk-free ring around them, and the screw head actually fits.",
          "A hole next to live copper lets the screw short straight into the board. The keep-out ring prevents that, plating keeps the hole strong, and checking the screw-head size saves you from a standoff that won't sit flat.",
          "pass",
          { diagram: "mount", tags: ["mechanical", "dfm"] }
        ),
        ex(
          "ex-hand",
          "Hand-drawn footprint, unchecked",
          "Pads sketched by eye from the datasheet's mechanical drawing.",
          "Datasheet package drawings are not pad layouts. Unchecked footprints turn into solder problems you only find after fab. Use the library — or generate the pads, then measure them against the drawing.",
          "fail",
          { diagram: "sketchfp", tags: ["library", "risk"] }
        ),
        ex(
          "ex-mirror",
          "Mirrored footprint",
          "A part drawn as if you were looking through the board — pads flipped, silk text backwards.",
          "The part physically cannot be placed. It happens when a footprint is edited in the wrong layer view, so checking the view is the first thing to do.",
          "fail",
          { diagram: "mirror", tags: ["layers", "placement"] }
        ),
        ex(
          "ex-headers-tight",
          "Headers crammed with no room for housings",
          "Neighbouring 4-pin (or 2-pin) headers are spaced for bare pins — the XH housings and plugs have nowhere to go.",
          "XH housings are wider than their pins, and plugs need room to approach. Pack headers together and only the first one stays pluggable. Space them for the housing, not for the drill hole.",
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
        "Someone will read this board at 2 a.m. before a match, with a soldering iron in one hand. Make it readable.",
      examples: [
        ex(
          "ex-refdes",
          "Reference designators outside the body",
          "Every part is labelled, at least 1 mm tall, placed outside the component body, reading left-to-right or bottom-to-top.",
          "Readable references let anyone trace a fault from schematic to board in seconds. Labels inside the body get covered by the part anyway — wasted ink.",
          "pass",
          { diagram: "refdes", tags: ["silkscreen", "readability"] }
        ),
        ex(
          "ex-silk-headers",
          "Header legends loud and clear",
          "Every header carries a clear legend: pin-1 marker, pitch, and what it is — net names or function — readable from arm's length.",
          "During bring-up and in the pit, someone will plug into the wrong header once. Clear header silk is the cheapest mistake-prevention on the whole board.",
          "pass",
          { diagram: "silkhdr", tags: ["silkscreen", "connectors"] }
        ),
        ex(
          "ex-testpts",
          "Test points where the probes go",
          "Key nets — 3V3, CANH, CANL, GND, motor rails — get labelled test pads on a 1.27 mm grid, big enough for a probe tip.",
          "Without test points, first power-on means poking probe tips at tiny pads with shaky hands. Labelled pads turn bring-up from a treasure hunt into a checklist.",
          "pass",
          { diagram: "testpts", tags: ["bringup", "probing"] }
        ),
        ex(
          "ex-silkpad",
          "Silkscreen over pads",
          "Legend lines or text cross exposed copper pads.",
          "Ink on a pad stops solder from sticking — you get open or weak joints. Many fabs quietly strip silk off pads anyway, taking your markings with it. Keep all silk at least 0.2 mm away from exposed copper.",
          "fail",
          { diagram: "silkpad", tags: ["silkscreen", "soldering"] }
        ),
        ex(
          "ex-polarity",
          "Missing or unclear polarity",
          "Diodes, electrolytic caps or connectors carry no visible polarity mark on the assembled side.",
          "It forces the assembler to cross-check the schematic for every single part — and one wrong guess kills the board at first power-on.",
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
        "Respect what the fab can actually make, and respect high voltage. The board has to survive both.",
      examples: [
        ex(
          "ex-drc",
          "DRC clean at the fab's real limits",
          "The design passes DRC with zero errors at 0.2 mm clearance / 0.2 mm track — our JLCPCB baseline.",
          "A clean DRC at the fab's actual capability is the cheapest insurance there is. Running it with looser rules just hides problems the fab will find for you — at your cost.",
          "pass",
          { diagram: "drc", tags: ["drc", "fab"] }
        ),
        ex(
          "ex-sliver",
          "Copper slivers between pads",
          "Thin copper splinters left between pads after flooding a pour.",
          "Slivers can lift during etching and bridge pads together, or corrode loose months later. Fix the pour clearance and hunt for lonely islands after every flood.",
          "fail",
          { diagram: "sliver", tags: ["pour", "etching"] }
        ),
        ex(
          "ex-creep",
          "Creepage violation on HV nets",
          "Mains or high-voltage nets run closer together than the creepage table allows.",
          "Too little surface gap lets an arc creep across the board over time — a safety problem, not a looks problem. HV nets get their own clearance rules and usually a routed slot between them.",
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
        "What you hand over, and in what shape. A great layout with broken output files is still an unfinished board.",
      examples: [
        ex(
          "ex-gerber",
          "Gerber set checked in a viewer",
          "All copper layers, masks, silk, paste, outline and the Excellon drill file exported — then checked layer by layer in a Gerber viewer before zipping.",
          "The viewer catches missing layers, mirrored art and wrong units before the board ships. Most “the fab broke my board” stories start right here.",
          "pass",
          { diagram: "gerbers", tags: ["outputs", "review"] }
        ),
        ex(
          "ex-fiducials",
          "Fiducials for the pick-and-place",
          "At least three global fiducials — bare 1 mm copper dots with the mask opened, placed asymmetrically — plus a local pair beside any fine-pitch part.",
          "The placement machine finds the board by these dots. Missing or badly placed fiducials mean the machine guesses where your parts go. Three asymmetric dots remove the guess.",
          "pass",
          { diagram: "fiducials", tags: ["assembly", "pnp"] }
        ),
        ex(
          "ex-drill",
          "Missing or mismatched drill file",
          "The drill file is absent from the Gerber zip, or the drill hits don't line up with the pads.",
          "Without drill data nobody can make holes — or worse, the fab guesses. Re-export the whole set from one CAD session and check every layer, every time.",
          "fail",
          { diagram: "drill", tags: ["outputs", "fab"] }
        ),
      ],
    },
  ],
  checklist: [
    "DRC clean at 0.2 mm / 0.2 mm — zero errors",
    "No right-angle corners anywhere",
    "Power rails on zones or fat copper — no thin wires",
    "One 100 nF cap per MCU power pin, each with a short path to ground",
    "Bulk caps are µF-class (not pF) and sit where the power lands",
    "Plane pads use thermal relief; regulator tab via'd to ground copper",
    "No vias inside open SMD pads; pads keep a healthy annular ring",
    "CANH/CANL mirror each other; crystal caps on the MCU side; crystal ringed with GND vias",
    "Polarity marked on every directional part; electrolytic stripes match the silk",
    "Connectors from the library, 3D checked; headers spaced for their housings",
    "Test points labelled for the nets you'll probe",
    "Every subsystem has a power feed in the schematic — pneumatics included",
    "Gerber set + drill file checked layer by layer in a viewer",
  ],
};
