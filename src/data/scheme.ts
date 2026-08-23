import type { Scheme } from "../types";

const ex = (
  id: string,
  title: string,
  description: string,
  reason: string,
  verdict: "pass" | "fail",
  extra: Partial<{ diagram: string; tags: string[] }> = {}
) => ({ id, title, description, reason, verdict, tags: [] as string[], hidden: false, ...extra });

export const DEFAULT_SCHEME: Scheme = {
  meta: {
    team: "HKUST Robotics Team",
    doc: "STD-PCB-01",
    rev: "H1",
    updated: "2026-03-04",
    maintainer: "the Hardware Division",
  },
  spec: [
    { id: "sp-board", num: 1, title: "Board Specifications", items: ["2-layer PCB", "Maximum board size 100mm x 100mm", "FR-4 material, 1.6mm thickness", "1 oz copper weight"] },
    { id: "sp-place", num: 2, title: "Component Placement", items: ["Place STM32F405RGT6 MCU in the center of the board", "Group decoupling capacitors close to power pins of ICs", "Place crystal oscillator and its load capacitors close to MCU"] },
    { id: "sp-power", num: 3, title: "Power Supply", items: ["Separate power planes for 24V, 5V, and 3.3V", "Wide traces for power connections (min. 20 mil)", "Place DC-DC converter and LDO with proper thermal considerations"] },
    { id: "sp-sig", num: 4, title: "Signal Integrity", items: ["Keep high-speed signals (e.g. SPI, UART) short and direct", "Use ground planes to reduce EMI", "Avoid 90 degree angles in traces, use 45 degree or curved traces"] },
    { id: "sp-can", num: 5, title: "CAN Interfaces", items: ["Route CAN differential pairs close together", "Maintain 100-ohm differential impedance for CAN traces (suggested)", "Place 0 ohm resistors for CAN linking in accessible locations"] },
    { id: "sp-conn", num: 6, title: "Connectors", items: ["Use connectors for all interfaces", "Place connectors along the board edges for easy access"] },
    { id: "sp-gpio", num: 7, title: "GPIO Expansion", items: ["Route GPIO expansion ports as connectors", "Clearly label all GPIO ports on the silk screen"] },
    { id: "sp-pneu", num: 8, title: "Pneumatic Control", items: ["Use 2 pin port for pneumatic control", "Clear label of polarity"] },
    { id: "sp-ind", num: 9, title: "Indicators and Interfaces", items: ["Place LED indicators in a visible area of the board", "Group SWD, UART, and TFT interface connectors logically"] },
    { id: "sp-mech", num: 10, title: "Mechanical Considerations", items: ["Include 4 mounting holes, one near each corner of the PCB", "Ensure components clear the mounting holes"] },
    { id: "sp-silk", num: 11, title: "Silk Screen and Labeling", items: ["Clearly label all connectors and major components", "Include board name, revision, and date on silk screen"] },
    { id: "sp-dfm", num: 12, title: "Design for Manufacturing", items: ["Maintain minimum 10 mil trace width and spacing", "Use standard drill sizes"] },
    { id: "sp-gnd", num: 13, title: "Grounding", items: ["Implement a solid ground plane", "Use stitching vias to connect top and bottom ground planes"] },
    { id: "sp-test", num: 14, title: "Testing and Debug", items: ["Place all buttons in an accessible location"] },
  ],
  categories: [
    {
      id: "cat-trc",
      code: "TRC",
      name: "Trace Routing",
      blurb: "How copper is drawn decides whether the board etches cleanly and carries its current without turning into a heater.",
      examples: [
        ex("ex-45", "45 degree corners everywhere", "Every change of direction is a 45 degree mitre or a smooth arc, no net on the board carries a right angle.", "Right-angle corners trap etchant during fabrication and become impedance bumps on fast signals. 45 degree corners etch evenly, keep impedance constant and read as intentional work.", "pass", { diagram: "corners", tags: ["routing", "geometry"] }),
        ex("ex-widths", "Width by rail: 80 / 30 / 20 / 10 mil", "24V runs at about 80 mil, 5V at 30 mil, 3.3V at 20 mil, and signal wires at 10 mil, all set once as net classes.", "These are the team's working numbers for this board's current budget. Rails too thin sag and heat, signal wires too fat just waste room. When in doubt, go one step wider on power, copper is free.", "pass", { diagram: "widths", tags: ["routing", "current"] }),
        ex("ex-90", "90 degree corners on traces", "One or more traces turn with a sharp right angle.", "Acid trap: etchant pools inside the corner and over-etchs the copper, thinning the trace exactly where it bends. On fast signals the corner adds capacitance and reflects energy. Use two 45 degree segments or an arc instead.", "fail", { diagram: "corner90", tags: ["routing", "etching"] }),
        ex("ex-viaspace", "Vias aligned, spaced, other side checked", "Use vias to hop layers instead of long detours, placed in neat rows with space between them, after checking the far side isn't already occupied.", "A via landing on a pad, trace or part on the other layer is a hidden short or a broken net. Line them up on-grid, give each one breathing room, and flip the view before you drop them.", "pass", { diagram: "viaspace", tags: ["routing", "vias"] }),
        ex("ex-stub", "Leftover stubs off the main run", "Dead-end copper branches left hanging off a net after a reroute.", "Stubs are antennas: they reflect energy back into fast signals and pick up noise on sensitive ones. After every reroute, delete the old copper, a clean net has exactly one path.", "fail", { diagram: "stub", tags: ["routing", "cleanup"] }),
      ],
    },
    {
      id: "cat-pwr",
      code: "PWR",
      name: "Power & Grounding",
      blurb: "Clean power delivery and joints that can actually be soldered, the difference between a board and a paperweight.",
      examples: [
        ex("ex-decap-one", "One decoupling cap per power pin", "Every VDD, VDDA and VBAT pin of the MCU gets its own 100 nF cap with a short path to the pin and to ground.", "Each pin draws its own switching current, and a dedicated local cap is the only reservoir close enough to answer. The back-layer zone keeps every return path short without burning routing space on top.", "pass", { diagram: "decap", tags: ["decoupling", "mcu"] }),
        ex("ex-relief", "Thermal relief on plane connections", "Every pad tied into a copper plane connects through four spokes, never solid copper.", "A solid tie into a big plane drags heat out of the joint faster than the iron can deliver it, the classic cold joint. Spokes keep the electrical connection while letting the pad reach soldering temperature.", "pass", { diagram: "relief", tags: ["soldering", "planes"] }),
        ex("ex-flood", "Copper pour floods a pad", "A ground pour creeps onto a signal pad with zero clearance.", "That is a short between the pad and the plane, sometimes only visible after assembly, when the board is already populated. Every pour must respect the board clearance rule against every net, no exceptions.", "fail", { diagram: "flood", tags: ["clearance", "shorts"] }),
        ex("ex-rail-zone", "Regulator outputs leave on copper zones", "The 5V switcher output reaches its inductor through a pour, the LDO's 3.3V leaves on a zone, and the 3.3V rail itself is zoned or fat, never signal width.", "Rails carry the whole board's current, so thin wire drops voltage and burns heat exactly where you can least afford it. Copper is free, spend it. On the switcher side, wide copper also keeps the commutating loop tight and less noisy.", "pass", { diagram: "railzone", tags: ["power", "zones"] }),
        ex("ex-decap-shared", "One decoupling cap shared across power pins", "A single cap, or a bunch wired together, feeds two or more VDD pins of the MCU.", "The shared cap sits too far from most pins, and its path crosses everyone else's return current, so noise flows through the whole bunch instead of dying at its source. One pin, one cap, short path.", "fail", { diagram: "decapbunch", tags: ["decoupling", "mcu"] }),
      ],
    },
    {
      id: "cat-bus",
      code: "BUS",
      name: "CAN, Clock & Signals",
      blurb: "CAN bus, crystal and general signal routing, the small grouping and placement decisions that decide whether the bus survives a noisy robot.",
      examples: [
        ex("ex-can-pair", "CANH and CANL as symmetrical as possible", "The two CAN wires run grouped with the same length, the same bends and the same spacing, as close to a mirror image as the board allows.", "CAN rejects noise by seeing it equally on both wires. The more symmetric the pair, the more noise arrives as common mode and gets cancelled. Lightly grouped is the floor, mirror-symmetric is the goal.", "pass", { diagram: "canpair", tags: ["can", "differential"] }),
        ex("ex-xtal", "Load caps first, then the crystal", "Both load caps sit between the MCU and the crystal, at the same distance from it, with equal-length stubs to ground.", "The caps have to shunt the crystal pins to ground, any trace past the cap toward the crystal detunes the load capacitance. Placing the two caps as mirror images keeps both sides of the oscillator equally loaded.", "pass", { diagram: "xtal", tags: ["clock", "placement"] }),
        ex("ex-can-split", "CAN lines routed independently", "CANH and CANL sent on separate paths, or one of them crossing a power or switching area alone.", "Whatever couples into one line but not the other arrives as a differential error, the one kind of noise CAN cannot reject. Re-pair them, even loosely, and steer both wires around the noisy copper.", "fail", { diagram: "cansplit", tags: ["can", "noise"] }),
        ex("ex-returnsplit", "Signals crossing a plane split", "A fast net routed straight over a gap or split in the ground plane beneath it.", "Signal current goes out on the trace and comes back directly underneath it, on the plane. When the plane is split there's no path back, so the return detours around the gap, making a big loop that radiates and picks up noise.", "fail", { diagram: "returnsplit", tags: ["grounding", "signal integrity"] }),
      ],
    },
    {
      id: "cat-fpt",
      code: "FPT",
      name: "Footprints & Packages",
      blurb: "The footprint is a promise to the assembly house. Break it and the part simply will not fit.",
      examples: [
        ex("ex-lib", "Library footprints, IPC-7351", "Every part uses a footprint from the team library, generated to IPC-7351 density level B.", "Generated footprints match real part bodies and paste-stencil rules, avoiding the tombstoning and misalignment that hand-drawn pads cause after reflow.", "pass", { diagram: "footprint", tags: ["library", "ipc"] }),
        ex("ex-mirror", "Mirrored footprint", "A part drawn as if seen through the board, pads mirrored, silkscreen text backwards.", "The component physically cannot be placed. This happens when a footprint is edited in the wrong layer view, so flipping the view is the very first thing anyone checks.", "fail", { diagram: "mirror", tags: ["layers", "placement"] }),
        ex("ex-headers-tight", "Headers packed with no room for housings", "Adjacent 4-pin or 2-pin headers spaced for bare pins only, XH housings and plugs have nowhere to go.", "XH housings are wider than their pins, and plugs need approach space. Pack headers together and only the first one stays pluggable. Space them for the housings, not for the drill holes.", "fail", { diagram: "headergap", tags: ["connectors", "placement"] }),
        ex("ex-mount", "Mounting holes done properly", "Four plated mounting holes, one near each corner, with a keep-out ring of silk and copper clearance.", "The hole is half the job, the other half is the space above it for the screw head and washer. A part parked under a screw is a part that gets cracked at assembly.", "pass", { diagram: "mount", tags: ["mechanical", "placement"] }),
      ],
    },
    {
      id: "cat-sil",
      code: "SIL",
      name: "Silkscreen & Documentation",
      blurb: "The board must be readable by a human holding a soldering iron at 2 a.m. before a competition.",
      examples: [
        ex("ex-silk-headers", "Header legends: function first, then pins", "Every header's silk names the function first, then the per-pin map, e.g. UART_VRTG means UART, and from left to right: 5V, RX, TX, GND.", "A port labelled J4 tells you nothing in the pit. UART_VRTG tells you what it is and what every pin does without opening the schematic. Function first, detail second, read left to right.", "pass", { diagram: "silkhdr", tags: ["silkscreen", "connectors"] }),
        ex("ex-silkpad", "Silkscreen over pads", "Legend lines or text cross exposed copper pads.", "Ink on a pad stops solder from wetting, opens and weak joints follow. Many fabs silently strip silk from pads, taking your markings with it. Keep all silk at least 0.2 mm from exposed copper.", "fail", { diagram: "silkpad", tags: ["silkscreen", "soldering"] }),
        ex("ex-revsilk", "Board name, rev and date on the silk", "Every board carries its name, document revision and date in a silkscreen corner.", "Six months from now, three board revisions will live in the same drawer. The silkscreen is the only way to tell them apart without a microscope and a prayer.", "pass", { diagram: "revsilk", tags: ["silkscreen", "documentation"] }),
      ],
    },
    {
      id: "cat-clr",
      code: "CLR",
      name: "Clearance & DFM",
      blurb: "Respect the fab's minimums and the physics of high voltage, the board has to survive manufacture and the real world.",
      examples: [
        ex("ex-drc", "DRC clean at the fab's real limits", "The design passes DRC with zero errors, the RDC baseline is 10 mil trace and spacing.", "A clean DRC at the fab's actual capability is the cheapest insurance that exists. Running it with looser rules just hides failures the fab will find for you, at your expense.", "pass", { diagram: "drc", tags: ["drc", "fab"] }),
        ex("ex-sliver", "Copper slivers between pads", "Thin copper splinters left between pads after a pour flood.", "Slivers can detach during etching and bridge neighbouring pads, or corrode loose months later. Adjust pour clearance and hunt for isolated islands after every flood.", "fail", { diagram: "sliver", tags: ["pour", "etching"] }),
        ex("ex-creep", "Creepage violation on HV nets", "Mains or high-voltage nets run closer than the creepage table allows.", "Too little surface distance lets tracking arcs form across the board over time, a safety failure, not a cosmetic one. HV nets get their own clearance rules and usually a routed slot.", "fail", { diagram: "creepage", tags: ["safety", "hv"] }),
      ],
    },
    {
      id: "cat-doc",
      code: "DOC",
      name: "Deliverables",
      blurb: "What you hand over, and in what state. A perfect layout with broken outputs is still an incomplete submission.",
      examples: [
        ex("ex-gerber", "Gerber set verified in a viewer", "All copper layers, masks, silks, paste, outline and the Excellon drill file exported, then eyeballed layer by layer in a Gerber viewer before zipping.", "Viewer review catches missing layers, mirrored art and wrong units before the board ships. Most 'the fab broke my board' stories start exactly here.", "pass", { diagram: "gerbers", tags: ["outputs", "review"] }),
        ex("ex-drill", "Missing or mismatched drill file", "The drill file is absent from the Gerber zip, or drill hits do not line up with the pads.", "Without the drill data nobody can make holes, or worse, the fab guesses. Re-export the whole set from one CAD session and verify every layer, every time.", "fail", { diagram: "drill", tags: ["outputs", "fab"] }),
      ],
    },
  ],
  checklist: [
    "Board is 2-layer, 100mm x 100mm max, FR-4 1.6mm per spec",
    "DRC passes with zero errors at the fab's real limits",
    "No right-angle corners, acid traps or leftover stubs on any net",
    "Widths by rail: 24V ~80 mil, 5V ~30 mil, 3V3 ~20 mil, signal ~10 mil",
    "One 100 nF decoupling cap per power pin of every IC",
    "Thermal relief on plane pads, regulator tab via'd to GND copper",
    "No vias inside untented SMD pads",
    "CANH/CANL symmetrical, same length, same bends",
    "Crystal caps mirrored on the MCU side, caps before the crystal",
    "Pin-1 and polarity marked on every polarised part",
    "Header legends show function plus pin map",
    "Connectors from the library with 3D checked, spaced for housings",
    "4 mounting holes, one per corner, clear of components",
    "Gerber set and drill file verified layer-by-layer in a viewer",
  ],
  readings: [
    {
      group: "If you're brand new to PCBs",
      links: [
        { title: "SparkFun PCB Basics", url: "https://learn.sparkfun.com/tutorials/pcb-basics", note: "A friendly, illustrated tour of what a PCB actually is and how it's made.", tag: "DOCS" },
        { title: "Adafruit Guide to Excellent PCBs", url: "https://learn.adafruit.com/adafruit-guide-excellent-pcb", note: "Practical layout habits from a team that ships boards constantly.", tag: "DOCS" },
        { title: "KiCad Documentation", url: "https://docs.kicad.org/", note: "The official manual for the tool most of us design in.", tag: "DOCS" },
      ],
    },
    {
      group: "Routing, grounding & signal integrity",
      links: [
        { title: "Phil's Lab on YouTube", url: "https://www.youtube.com/@PhilsLab", note: "Full mixed-signal board designs walked through start to finish in KiCad.", tag: "VIDEO" },
        { title: "Rick Hartley: How to Achieve Proper Grounding", url: "https://www.youtube.com/results?search_query=rick+hartley+how+to+achieve+proper+grounding", note: "The classic grounding talk. Search it, block an evening, thank us later.", tag: "VIDEO" },
      ],
    },
    {
      group: "Manufacturing & standards",
      links: [
        { title: "JLCPCB PCB Capabilities", url: "https://jlcpcb.com/capabilities/pcb-capabilities", note: "Where our baseline comes from, the fab's real limits.", tag: "TOOLS" },
        { title: "Adam Zonenberg PCB Layout Checklist", url: "https://github.com/azonenberg/pcb-checklist/blob/master/layout-checklist.md", note: "A thorough community checklist of everything to verify before the board ships to fab.", tag: "REFERENCE" },
      ],
    },
  ],
};
