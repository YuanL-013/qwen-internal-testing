import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Category, Example, Scheme, Toast } from "./types";
import { DEFAULT_SCHEME } from "./data/scheme";
import {
  clearStoredScheme,
  endAdminSession,
  exportScheme,
  fetchCommittedScheme,
  isAdminSession,
  loadStoredScheme,
  parseSchemeImport,
  saveScheme,
  startAdminSession,
  uid,
} from "./store";
import CircuitBackground from "./components/CircuitBackground";
import TitleBlock from "./components/TitleBlock";
import Scoring from "./components/Scoring";
import CategoryNav, { type VerdictFilter } from "./components/CategoryNav";
import CategorySection from "./components/CategorySection";
import Checklist from "./components/Checklist";
import AdminBar from "./components/AdminBar";
import Reveal from "./components/Reveal";
import { CategoryModal, ExampleModal, GateModal, PasscodeModal } from "./components/Modals";
import { IcLock, IcX } from "./components/Icons";

type ModalState =
  | { kind: "gate" }
  | { kind: "passcode" }
  | { kind: "category"; categoryId?: string }
  | { kind: "example"; categoryId: string; example?: Example }
  | null;

export default function App() {
  const [scheme, setScheme] = useState<Scheme>(() => loadStoredScheme() ?? structuredClone(DEFAULT_SCHEME));
  const [editMode, setEditMode] = useState(() => isAdminSession());
  const [modal, setModal] = useState<ModalState>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [active, setActive] = useState("all");
  const [verdict, setVerdict] = useState<VerdictFilter>("all");
  const [query, setQuery] = useState("");
  const lastDeleted = useRef<{ category?: Category; example?: { catId: string; example: Example; index: number } } | null>(null);
  const warnedQuota = useRef(false);

  /* -------- boot: fall back to committed data/scheme.json (GitHub Pages) -------- */
  useEffect(() => {
    if (loadStoredScheme()) return;
    let live = true;
    fetchCommittedScheme().then((committed) => {
      if (live && committed) setScheme(committed);
    });
    return () => {
      live = false;
    };
  }, []);

  /* -------- persist -------- */
  useEffect(() => {
    const res = saveScheme(scheme);
    if (!res.ok && !warnedQuota.current) {
      warnedQuota.current = true;
      pushToast("Browser storage is full — large images may not persist. Export a JSON backup.", "warn");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheme]);

  /* keep active tab valid */
  useEffect(() => {
    if (active !== "all" && !scheme.categories.some((c) => c.id === active)) setActive("all");
  }, [scheme.categories, active]);

  const pushToast = useCallback(
    (message: string, tone: Toast["tone"] = "ok", action?: { label: string; fn: () => void }) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t.slice(-2), { id, message, tone, actionLabel: action?.label, onAction: action?.fn }]);
      window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), action ? 6500 : 4200);
    },
    []
  );

  /* ---------------- category CRUD ---------------- */

  const saveCategory = (data: { code: string; name: string; blurb: string }, categoryId?: string) => {
    setScheme((s) =>
      categoryId
        ? { ...s, categories: s.categories.map((c) => (c.id === categoryId ? { ...c, ...data } : c)) }
        : { ...s, categories: [...s.categories, { id: uid(), examples: [], ...data }] }
    );
    setModal(null);
    pushToast(categoryId ? `Category ${data.code} updated` : `Category ${data.code} added`);
  };

  const deleteCategory = (cat: Category) => {
    lastDeleted.current = { category: cat };
    setScheme((s) => ({ ...s, categories: s.categories.filter((c) => c.id !== cat.id) }));
    pushToast(`Deleted ${cat.code} — ${cat.name}`, "warn", {
      label: "UNDO",
      fn: () => {
        const d = lastDeleted.current?.category;
        if (!d) return;
        setScheme((s) => {
          const idx = s.categories.findIndex((c) => c.code > d.code);
          const cats = [...s.categories];
          cats.splice(idx === -1 ? cats.length : idx, 0, d);
          return { ...s, categories: cats };
        });
        lastDeleted.current = null;
        pushToast("Category restored");
      },
    });
  };

  const moveCategory = (id: string, dir: -1 | 1) => {
    setScheme((s) => {
      const i = s.categories.findIndex((c) => c.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= s.categories.length) return s;
      const cats = [...s.categories];
      [cats[i], cats[j]] = [cats[j], cats[i]];
      return { ...s, categories: cats };
    });
  };

  /* ---------------- example CRUD ---------------- */

  const saveExample = (catId: string, ex: Example, existingId?: string) => {
    setScheme((s) => ({
      ...s,
      categories: s.categories.map((c) => {
        if (c.id !== catId) return c;
        return existingId
          ? { ...c, examples: c.examples.map((e) => (e.id === existingId ? ex : e)) }
          : { ...c, examples: [...c.examples, ex] };
      }),
    }));
    setModal(null);
    pushToast(existingId ? "Finding updated" : `Finding added — ${ex.verdict === "pass" ? "approved" : "rejected"} pattern`);
  };

  const deleteExample = (catId: string, ex: Example) => {
    const cat = scheme.categories.find((c) => c.id === catId);
    const index = cat?.examples.findIndex((e) => e.id === ex.id) ?? -1;
    lastDeleted.current = { example: { catId, example: ex, index } };
    setScheme((s) => ({
      ...s,
      categories: s.categories.map((c) => (c.id === catId ? { ...c, examples: c.examples.filter((e) => e.id !== ex.id) } : c)),
    }));
    pushToast(`Deleted “${ex.title}”`, "warn", {
      label: "UNDO",
      fn: () => {
        const d = lastDeleted.current?.example;
        if (!d) return;
        setScheme((s) => ({
          ...s,
          categories: s.categories.map((c) => {
            if (c.id !== d.catId) return c;
            const examples = [...c.examples];
            examples.splice(Math.min(d.index, examples.length), 0, d.example);
            return { ...c, examples };
          }),
        }));
        lastDeleted.current = null;
        pushToast("Finding restored");
      },
    });
  };

  /* ---------------- admin actions ---------------- */

  const handleImportFile = async (file: File) => {
    try {
      const imported = parseSchemeImport(await file.text());
      setScheme(imported);
      pushToast(`Imported ${imported.categories.length} categories from ${file.name}`);
    } catch {
      pushToast("Import failed — not a valid scheme JSON file", "err");
    }
  };

  const handleReset = async () => {
    clearStoredScheme();
    const committed = await fetchCommittedScheme();
    setScheme(committed ?? structuredClone(DEFAULT_SCHEME));
    setActive("all");
    setVerdict("all");
    setQuery("");
    pushToast(committed ? "Restored from data/scheme.json" : "Restored built-in scheme");
  };

  /* ---------------- filtering ---------------- */

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scheme.categories
      .filter((c) => active === "all" || c.id === active)
      .map((c) => ({
        ...c,
        examples: c.examples.filter(
          (e) =>
            (verdict === "all" || e.verdict === verdict) &&
            (!q ||
              [e.title, e.description, e.reason, c.name, c.code, ...e.tags].join(" ").toLowerCase().includes(q))
        ),
      }));
  }, [scheme, active, verdict, query]);

  const shownCount = visible.reduce((n, c) => n + c.examples.length, 0);

  /* ---------------- render ---------------- */

  return (
    <div className="relative min-h-screen">
      <CircuitBackground />

      {editMode && (
        <AdminBar
          docCode={`${scheme.meta.doc} · REV ${scheme.meta.rev}`}
          onExport={() => {
            exportScheme(scheme);
            pushToast("Scheme exported — commit it as data/scheme.json to publish");
          }}
          onImportFile={handleImportFile}
          onReset={handleReset}
          onChangePasscode={() => setModal({ kind: "passcode" })}
          onExit={() => {
            endAdminSession();
            setEditMode(false);
            pushToast("Review mode closed — back to trainee view");
          }}
        />
      )}

      <TitleBlock scheme={scheme} editMode={editMode} onStartReview={() => setModal({ kind: "gate" })} />

      <Scoring />

      <CategoryNav
        categories={scheme.categories}
        active={active}
        onActive={setActive}
        verdict={verdict}
        onVerdict={setVerdict}
        query={query}
        onQuery={setQuery}
        editMode={editMode}
        onAddCategory={() => setModal({ kind: "category" })}
      />

      <main className="mx-auto max-w-6xl px-5 lg:px-8">
        {visible.map((c, i) => (
          <CategorySection
            key={c.id}
            category={c}
            index={scheme.categories.findIndex((x) => x.id === c.id)}
            editable={editMode}
            canUp={scheme.categories.findIndex((x) => x.id === c.id) > 0}
            canDown={scheme.categories.findIndex((x) => x.id === c.id) < scheme.categories.length - 1}
            onMove={(dir) => moveCategory(c.id, dir)}
            onAddExample={() => setModal({ kind: "example", categoryId: c.id })}
            onEditCategory={() => setModal({ kind: "category", categoryId: c.id })}
            onDeleteCategory={() => {
              const full = scheme.categories.find((x) => x.id === c.id);
              if (full) deleteCategory(full);
            }}
            onEditExample={(ex) => setModal({ kind: "example", categoryId: c.id, example: ex })}
            onDeleteExample={(ex) => deleteExample(c.id, ex)}
          />
        ))}

        {shownCount === 0 && (
          <div className="py-24 text-center">
            <p className="font-display text-2xl font-bold text-ink">Nothing matches those filters</p>
            <p className="mt-2 text-sm text-dim">Try a different category, verdict or search term.</p>
            <button
              onClick={() => {
                setActive("all");
                setVerdict("all");
                setQuery("");
              }}
              className="mt-5 border border-copper px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-copperlt transition-colors hover:bg-copper hover:text-bg"
            >
              CLEAR FILTERS
            </button>
          </div>
        )}
      </main>

      <Checklist
        items={scheme.checklist}
        editMode={editMode}
        onItemsChange={(items) => setScheme((s) => ({ ...s, checklist: items.filter((i) => i.trim() !== "") }))}
      />

      {/* footer */}
      <footer className="border-t border-edge bg-panel/50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-6 lg:px-8">
          <p className="font-mono text-[10.5px] tracking-[0.2em] text-faint">
            {scheme.meta.doc} · REV {scheme.meta.rev} · <span className="text-copper/70">{scheme.meta.team.toUpperCase()}</span> HW DIVISION
          </p>
          <p className="font-mono text-[10.5px] tracking-[0.2em] text-faint/70">UNCONTROLLED WHEN PRINTED</p>
          <div className="ml-auto flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.16em] text-faint/60">STATIC BUILD — GITHUB PAGES READY</span>
            {!editMode && (
              <button
                onClick={() => setModal({ kind: "gate" })}
                className="flex items-center gap-2 border border-edge px-3 py-1.5 font-mono text-[10.5px] tracking-[0.18em] text-dim transition-colors hover:border-copper hover:text-copperlt"
              >
                <IcLock size={12} /> REVIEWER SIGN-IN
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* modals */}
      {modal?.kind === "gate" && (
        <GateModal
          onClose={() => setModal(null)}
          onSuccess={() => {
            startAdminSession();
            setEditMode(true);
            setModal(null);
            pushToast("Review mode unlocked — edits save to this browser");
          }}
        />
      )}
      {modal?.kind === "passcode" && (
        <PasscodeModal
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            pushToast("Passcode changed");
          }}
        />
      )}
      {modal?.kind === "category" && (
        <CategoryModal
          initial={modal.categoryId ? scheme.categories.find((c) => c.id === modal.categoryId) : undefined}
          onSave={(data) => saveCategory(data, modal.categoryId)}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.kind === "example" && (
        <ExampleModal
          initial={modal.example}
          onSave={(ex) => saveExample(modal.categoryId, ex, modal.example?.id)}
          onClose={() => setModal(null)}
        />
      )}

      {/* toasts */}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toastin pointer-events-auto flex items-center gap-3 border bg-panel px-3.5 py-2.5 shadow-xl shadow-black/50 ${
              t.tone === "err" ? "border-fail/60" : t.tone === "warn" ? "border-warn/60" : "border-pass/50"
            }`}
          >
            <span className={`h-6 w-1 shrink-0 ${t.tone === "err" ? "bg-fail" : t.tone === "warn" ? "bg-warn" : "bg-pass"}`} />
            <p className="min-w-0 flex-1 text-[12px] leading-snug text-ink/90">{t.message}</p>
            {t.actionLabel && t.onAction && (
              <button
                onClick={() => {
                  t.onAction?.();
                  setToasts((x) => x.filter((y) => y.id !== t.id));
                }}
                className="shrink-0 border border-copper/60 px-2 py-1 font-mono text-[9.5px] tracking-[0.16em] text-copperlt hover:bg-copper/15"
              >
                {t.actionLabel}
              </button>
            )}
            <button
              onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
              className="shrink-0 text-faint hover:text-ink"
              aria-label="Dismiss"
            >
              <IcX size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* first-visit hint for reviewers, view mode only */}
      {!editMode && (
        <Reveal className="pointer-events-none fixed bottom-5 left-5 z-30 hidden lg:block">
          <div className="border border-edgesoft bg-panel/90 px-3 py-2 font-mono text-[9.5px] leading-relaxed tracking-[0.14em] text-faint">
            MAINTAINING THIS DOC?
            <br />
            <span className="text-copper/80">REVIEWER SIGN-IN → FOOTER</span>
          </div>
        </Reveal>
      )}
    </div>
  );
}
