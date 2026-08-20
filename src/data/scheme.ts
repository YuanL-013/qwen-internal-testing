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
    rev: "C",
    updated: "2026-02-12",
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
          "Stitching gives return currents a short path home, shrinking loop area and EMI — and stops the two planes resonating against each other at RF.",
          "pass",
          { diagram: "stitch", tags: ["grounding", "emi"] }
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
    "Power nets ≥ 0.5 mm; no neck-downs below class width",
    "Thermal relief on every pad connected to a plane",
    "No vias inside untented SMD pads",
    "Pin-1 / polarity marked on every polarised part",
    "No silkscreen over pads; every part labelled ≥ 1 mm",
    "Gerber set + drill file verified layer-by-layer in a viewer",
  ],
};
