import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Category, Example, Severity, Verdict } from "../types";
import { SEVERITIES } from "../data/scheme";
import { DIAGRAMS, DIAGRAM_OPTIONS } from "./Diagrams";
import { fileToDataURL, passcodeIsDefault, setPasscode, uid, verifyPasscode } from "../store";
import { IcImage, IcLink, IcLock, IcTrash, IcUpload } from "./Icons";

/* ---------------------------------- shell ---------------------------------- */

function ModalShell({
  title,
  code,
  onClose,
  children,
  wide,
}: {
  title: string;
  code?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="fadein absolute inset-0 bg-black/75" onClick={onClose} />
      <div
        className={`modalin relative max-h-[92vh] w-full overflow-y-auto border border-edge bg-panel shadow-2xl shadow-black/60 ${
          wide ? "max-w-2xl" : "max-w-lg"
        }`}
        role="dialog"
        aria-modal
      >
        <div className="sticky top-0 flex items-center gap-3 border-b border-edge bg-panel px-5 py-3.5">
          <span className="h-3.5 w-1 bg-copper" />
          <h3 className="font-display text-base font-bold tracking-wide text-ink">{title}</h3>
          {code && <span className="font-mono text-[10px] tracking-[0.2em] text-faint">{code}</span>}
          <button
            onClick={onClose}
            className="ml-auto font-mono text-[11px] tracking-widest text-faint hover:text-ink"
          >
            ESC ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

const field =
  "w-full border border-edge bg-bg px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-copper focus:outline-none transition-colors";
const labelCls = "mb-1.5 block font-mono text-[10px] font-medium tracking-[0.2em] text-dim";

/* ------------------------------- passcode gate ------------------------------- */

export function GateModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef.current?.focus(), []);

  const submit = () => {
    if (verifyPasscode(value)) {
      onSuccess();
    } else {
      setError(true);
      setAttempts((a) => a + 1);
      setValue("");
      inputRef.current?.focus();
    }
  };

  return (
    <ModalShell title="Reviewer access" code="LOCKED" onClose={onClose}>
      <div key={attempts} className={error ? "shake" : ""}>
        <div className="flex items-center gap-3 border border-edge bg-bg p-4">
          <span className="text-copper">
            <IcLock size={22} />
          </span>
          <p className="text-[13px] leading-relaxed text-dim">
            Trainees never need this. Reviewers sign in to add examples, adjust deductions and maintain the scheme.
          </p>
        </div>
        <label className={`${labelCls} mt-5`}>PASSCODE</label>
        <input
          ref={inputRef}
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="•••••••••"
          className={`${field} font-mono tracking-[0.3em] ${error ? "border-fail" : ""}`}
          autoComplete="off"
        />
        {error && (
          <p className="mt-2 font-mono text-[11px] tracking-wider text-fail">ACCESS DENIED — WRONG PASSCODE</p>
        )}
        <button
          onClick={submit}
          className="mt-4 w-full bg-copper py-2.5 font-display text-sm font-bold tracking-[0.15em] text-bg transition-colors hover:bg-copperlt"
        >
          UNLOCK REVIEW MODE
        </button>
        <div className="mt-4 space-y-1 border-t border-edgesoft pt-3">
          <p className="font-mono text-[10px] leading-relaxed tracking-wider text-faint">
            DEMO PASSCODE: <span className="text-copperlt">SOLDER-01</span> — change it from the bar after unlocking.
          </p>
          <p className="font-mono text-[10px] leading-relaxed tracking-wider text-faint">
            NOTE: this is a static GitHub Pages site, so the gate is client-side only — a soft lock, not a vault.
          </p>
        </div>
      </div>
    </ModalShell>
  );
}

/* ----------------------------- change passcode ----------------------------- */

export function PasscodeModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ tone: "err" | "ok"; text: string } | null>(null);

  const submit = () => {
    if (!verifyPasscode(cur)) return setMsg({ tone: "err", text: "CURRENT PASSCODE IS WRONG" });
    if (next.trim().length < 6) return setMsg({ tone: "err", text: "NEW PASSCODE NEEDS ≥ 6 CHARACTERS" });
    if (next !== confirm) return setMsg({ tone: "err", text: "NEW PASSCODES DO NOT MATCH" });
    setPasscode(next.trim());
    onSaved();
  };

  return (
    <ModalShell title="Change passcode" code="SEC" onClose={onClose}>
      {passcodeIsDefault() && (
        <p className="mb-4 border border-warn/40 bg-warn/10 px-3 py-2 font-mono text-[10px] leading-relaxed tracking-wider text-warn">
          YOU ARE STILL ON THE DEMO PASSCODE — STRONGLY RECOMMENDED TO CHANGE IT.
        </p>
      )}
      <label className={labelCls}>CURRENT</label>
      <input type="password" value={cur} onChange={(e) => setCur(e.target.value)} className={field} />
      <label className={`${labelCls} mt-4`}>NEW (≥ 6 CHARS)</label>
      <input type="password" value={next} onChange={(e) => setNext(e.target.value)} className={field} />
      <label className={`${labelCls} mt-4`}>REPEAT NEW</label>
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        className={field}
      />
      {msg && (
        <p className={`mt-3 font-mono text-[11px] tracking-wider ${msg.tone === "err" ? "text-fail" : "text-pass"}`}>
          {msg.text}
        </p>
      )}
      <button
        onClick={submit}
        className="mt-5 w-full bg-copper py-2.5 font-display text-sm font-bold tracking-[0.15em] text-bg transition-colors hover:bg-copperlt"
      >
        SAVE PASSCODE
      </button>
    </ModalShell>
  );
}

/* ------------------------------- category form ------------------------------- */

export function CategoryModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Category;
  onSave: (c: { code: string; name: string; blurb: string }) => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState(initial?.code ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [blurb, setBlurb] = useState(initial?.blurb ?? "");
  const [err, setErr] = useState("");

  const submit = () => {
    const c = code.trim().toUpperCase();
    if (!/^[A-Z0-9]{2,4}$/.test(c)) return setErr("CODE MUST BE 2–4 LETTERS/DIGITS (E.G. TRC)");
    if (name.trim().length < 3) return setErr("NAME IS TOO SHORT");
    onSave({ code: c, name: name.trim(), blurb: blurb.trim() });
  };

  return (
    <ModalShell title={initial ? "Edit category" : "New category"} code={initial?.code} onClose={onClose}>
      <div className="grid grid-cols-[110px_1fr] gap-4">
        <div>
          <label className={labelCls}>CODE</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={4}
            placeholder="TRC"
            className={`${field} font-mono tracking-widest`}
          />
        </div>
        <div>
          <label className={labelCls}>NAME</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Trace Routing" className={field} />
        </div>
      </div>
      <label className={`${labelCls} mt-4`}>SECTION BLURB</label>
      <textarea value={blurb} onChange={(e) => setBlurb(e.target.value)} rows={3} className={field} />
      {err && <p className="mt-3 font-mono text-[11px] tracking-wider text-fail">{err}</p>}
      <button
        onClick={submit}
        className="mt-5 w-full bg-copper py-2.5 font-display text-sm font-bold tracking-[0.15em] text-bg transition-colors hover:bg-copperlt"
      >
        {initial ? "SAVE CHANGES" : "ADD CATEGORY"}
      </button>
    </ModalShell>
  );
}

/* -------------------------------- example form -------------------------------- */

export function ExampleModal({
  initial,
  onSave,
  onClose,
  onDeleteImage,
}: {
  initial?: Example;
  onSave: (e: Example) => void;
  onClose: () => void;
  onDeleteImage?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [verdict, setVerdict] = useState<Verdict>(initial?.verdict ?? "fail");
  const [severity, setSeverity] = useState<Severity>(initial?.severity ?? "major");
  const [deduction, setDeduction] = useState<number>(initial?.deduction ?? SEVERITIES.major.pts);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [reason, setReason] = useState(initial?.reason ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [diagram, setDiagram] = useState<string>(initial?.diagram ?? "");
  const [image, setImage] = useState<string>(initial?.image ?? "");
  const [imageUrl, setImageUrl] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const DiagramPreview = diagram ? DIAGRAMS[diagram] : null;

  const pickSeverity = (s: Severity) => {
    setSeverity(s);
    setDeduction(SEVERITIES[s].pts);
  };

  const onUpload = async (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return setErr("THAT FILE IS NOT AN IMAGE");
    if (f.size > 1.5 * 1024 * 1024)
      return setErr("IMAGE > 1.5 MB — COMPRESS IT FIRST (STATIC SITE, BROWSER STORAGE)");
    setBusy(true);
    try {
      setImage(await fileToDataURL(f));
      setErr("");
    } catch {
      setErr("COULD NOT READ FILE");
    } finally {
      setBusy(false);
    }
  };

  const submit = () => {
    if (title.trim().length < 3) return setErr("TITLE IS TOO SHORT");
    if (description.trim().length < 10) return setErr("DESCRIPTION NEEDS MORE DETAIL");
    if (reason.trim().length < 10) return setErr("THE REASON IS THE WHOLE POINT — EXPAND IT");
    const url = imageUrl.trim();
    const finalImage = image || (/^https?:\/\//.test(url) ? url : image);
    onSave({
      id: initial?.id ?? uid(),
      title: title.trim(),
      verdict,
      severity: verdict === "fail" ? severity : undefined,
      deduction: verdict === "fail" ? Math.max(1, Math.round(deduction)) : undefined,
      description: description.trim(),
      reason: reason.trim(),
      tags: tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 6),
      diagram: finalImage ? undefined : diagram || undefined,
      image: finalImage || undefined,
    });
  };

  return (
    <ModalShell title={initial ? "Edit finding" : "New finding"} code="FINDING" onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
        <div>
          <label className={labelCls}>TITLE</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 90° corners on traces" className={field} />

          <label className={`${labelCls} mt-4`}>VERDICT</label>
          <div className="grid grid-cols-2 border border-edge">
            {(["pass", "fail"] as Verdict[]).map((v) => (
              <button
                key={v}
                onClick={() => setVerdict(v)}
                className={`py-2 font-mono text-[11px] tracking-[0.2em] transition-colors ${
                  verdict === v
                    ? v === "pass"
                      ? "bg-pass/20 text-pass"
                      : "bg-fail/20 text-fail"
                    : "text-faint hover:text-ink"
                }`}
              >
                {v === "pass" ? "✓ APPROVED" : "✕ NOT OKAY"}
              </button>
            ))}
          </div>

          {verdict === "fail" && (
            <div className="mt-4 grid grid-cols-[1fr_120px] gap-4">
              <div>
                <label className={labelCls}>SEVERITY</label>
                <div className="grid grid-cols-3 border border-edge">
                  {(Object.keys(SEVERITIES) as Severity[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => pickSeverity(s)}
                      className={`py-1.5 font-mono text-[10px] tracking-widest transition-colors ${
                        severity === s
                          ? s === "critical"
                            ? "bg-fail/20 text-fail"
                            : s === "major"
                              ? "bg-warn/20 text-warn"
                              : "bg-info/20 text-info"
                          : "text-faint hover:text-ink"
                      }`}
                    >
                      {SEVERITIES[s].label.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>− PTS</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={deduction}
                  onChange={(e) => setDeduction(Number(e.target.value))}
                  className={`${field} font-mono`}
                />
              </div>
            </div>
          )}

          <label className={`${labelCls} mt-4`}>WHAT THE REVIEWER SEES</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={field} />
          <label className={`${labelCls} mt-4`}>
            {verdict === "pass" ? "WHY IT PASSES" : "WHY IT IS NOT SUPPORTED"}
          </label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className={field} />
          <label className={`${labelCls} mt-4`}>TAGS (COMMA-SEPARATED)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="routing, drc" className={field} />
        </div>

        {/* visual column */}
        <div>
          <label className={labelCls}>ILLUSTRATION</label>
          <div className="border border-edge bg-bg p-2">
            {image ? (
              <div className="relative">
                <img src={image} alt="finding visual" className="block w-full object-cover" style={{ aspectRatio: "5/3" }} />
                <button
                  onClick={() => {
                    setImage("");
                    onDeleteImage?.();
                  }}
                  className="absolute right-1.5 top-1.5 flex items-center gap-1 bg-bg/90 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-fail hover:bg-fail/20"
                >
                  <IcTrash size={11} /> REMOVE
                </button>
              </div>
            ) : DiagramPreview ? (
              <DiagramPreview />
            ) : (
              <div className="flex items-center justify-center border border-dashed border-edge px-3 py-8 text-center font-mono text-[10px] leading-relaxed tracking-wider text-faint">
                PICK A DIAGRAM OR
                <br />
                UPLOAD AN IMAGE
              </div>
            )}
          </div>

          <select value={diagram} onChange={(e) => setDiagram(e.target.value)} className={`${field} mt-2 font-mono text-[12px]`} disabled={!!image}>
            <option value="">— no diagram —</option>
            {DIAGRAM_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>

          <label
            className={`mt-2 flex cursor-pointer items-center justify-center gap-2 border border-edge py-2 font-mono text-[10px] tracking-[0.2em] text-dim transition-colors hover:border-copper hover:text-copperlt ${image ? "pointer-events-none opacity-40" : ""}`}
          >
            <IcUpload size={13} /> {busy ? "READING…" : "UPLOAD IMAGE ≤ 1.5 MB"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files?.[0])} />
          </label>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-faint">
              <IcLink size={13} />
            </span>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="…or paste image URL"
              className={`${field} py-1.5 font-mono text-[11px]`}
              disabled={!!image}
            />
          </div>
          {image && (
            <p className="mt-1.5 flex items-center gap-1.5 font-mono text-[9px] tracking-wider text-faint">
              <IcImage size={11} /> UPLOADED IMAGE TAKES PRIORITY
            </p>
          )}
        </div>
      </div>

      {err && <p className="mt-4 font-mono text-[11px] tracking-wider text-fail">{err}</p>}
      <button
        onClick={submit}
        className="mt-5 w-full bg-copper py-2.5 font-display text-sm font-bold tracking-[0.15em] text-bg transition-colors hover:bg-copperlt"
      >
        {initial ? "SAVE FINDING" : "ADD FINDING"}
      </button>
    </ModalShell>
  );
}
