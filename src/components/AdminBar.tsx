import { useEffect, useRef, useState } from "react";
import { IcDownload, IcInfo, IcKey, IcReset, IcUpload, IcX } from "./Icons";

export default function AdminBar({
  docCode,
  onExport,
  onImportFile,
  onReset,
  onChangePasscode,
  onExit,
}: {
  docCode: string;
  onExport: () => void;
  onImportFile: (f: File) => void;
  onReset: () => void;
  onChangePasscode: () => void;
  onExit: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const btn =
    "flex items-center gap-1.5 border border-copper/40 px-2.5 py-1 font-mono text-[11px] tracking-wider text-copperlt hover:bg-copper/15 hover:border-copper transition-colors";

  return (
    <div className="sticky top-0 z-50 border-b border-copper/30 bg-[#1a130a]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-6xl items-center gap-3 px-5 lg:px-8">
        <span className="led h-2 w-2 rounded-full bg-copper shadow-[0_0_10px_2px_rgba(224,149,90,0.5)]" />
        <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-copperlt">
          REVIEWER MODE
        </span>
        <span className="hidden font-mono text-[11px] tracking-wider text-copper/60 sm:inline">
          {docCode} · EDITS SAVE TO THIS BROWSER
        </span>

        <div className="ml-auto flex items-center gap-2">
          <button className={btn} onClick={onExport} title="Download scheme as JSON">
            <IcDownload size={13} /> <span className="hidden sm:inline">EXPORT</span>
          </button>
          <button className={btn} onClick={() => fileRef.current?.click()} title="Import scheme JSON">
            <IcUpload size={13} /> <span className="hidden sm:inline">IMPORT</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImportFile(f);
              e.target.value = "";
            }}
          />
          <button className={btn} onClick={onChangePasscode} title="Change reviewer passcode">
            <IcKey size={13} /> <span className="hidden md:inline">PASSCODE</span>
          </button>
          <div className="relative">
            <button
              className={`${btn} ${tipOpen ? "bg-copper/15 border-copper" : ""}`}
              onClick={() => setTipOpen((v) => !v)}
              title="Deployment tips"
            >
              <IcInfo size={13} />
            </button>
            {tipOpen && (
              <div className="fadein absolute right-0 top-full z-50 mt-2 w-80 border border-edge bg-panel p-4 text-left shadow-2xl shadow-black/50">
                <p className="font-mono text-[10px] tracking-[0.2em] text-copper">DEPLOYING ON GITHUB PAGES</p>
                <ul className="mt-2 space-y-2 text-[12px] leading-relaxed text-dim">
                  <li>
                    <span className="text-ink">1.</span> Edits live in this browser's localStorage only — visitors
                    won't see them.
                  </li>
                  <li>
                    <span className="text-ink">2.</span> Use <span className="text-copperlt">EXPORT</span>, then commit
                    the file to the repo as <code className="text-copperlt">data/scheme.json</code> (next to{" "}
                    <code className="text-copperlt">dist/index.html</code>).
                  </li>
                  <li>
                    <span className="text-ink">3.</span> On a fresh browser the site loads{" "}
                    <code className="text-copperlt">data/scheme.json</code> automatically; local edits still take
                    priority for reviewers.
                  </li>
                  <li>
                    <span className="text-ink">4.</span> Project-page subpath? Build with{" "}
                    <code className="text-copperlt">base: "./"</code> in vite.config.
                  </li>
                </ul>
                <button
                  className="mt-3 font-mono text-[10px] tracking-widest text-faint hover:text-ink"
                  onClick={() => setTipOpen(false)}
                >
                  CLOSE ×
                </button>
              </div>
            )}
          </div>
          <button
            className={`${btn} ${confirming ? "border-fail text-fail hover:bg-fail/15" : ""}`}
            onClick={() => {
              if (confirming) {
                onReset();
                setConfirming(false);
              } else {
                setConfirming(true);
                timer.current = window.setTimeout(() => setConfirming(false), 3000);
              }
            }}
            title="Restore built-in scheme"
          >
            <IcReset size={13} /> {confirming ? "CONFIRM?" : <span className="hidden sm:inline">RESET</span>}
          </button>
          <button
            className="flex items-center gap-1.5 border border-faildim px-2.5 py-1 font-mono text-[11px] tracking-wider text-fail hover:bg-fail/15 transition-colors"
            onClick={onExit}
          >
            <IcX size={13} /> EXIT
          </button>
        </div>
      </div>
    </div>
  );
}
