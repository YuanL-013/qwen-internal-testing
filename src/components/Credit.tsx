import { useEffect, useState } from "react";
import type { SchemeMeta } from "../types";

interface CommitInfo {
  author: string;
  when: string;
}

/** Try to read the most recent push that touched the guide from the GitHub API. */
async function fetchLastPush(): Promise<CommitInfo | null> {
  try {
    const { host, pathname } = window.location;
    // Only runs on GitHub Pages: https://<owner>.github.io/<repo>/…
    if (!host.endsWith(".github.io")) return null;
    const owner = host.split(".")[0];
    const repo = pathname.split("/").filter(Boolean)[0];
    if (!owner || !repo) return null;
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?path=public/data/scheme.json&per_page=1`,
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) return null;
    const list = (await res.json()) as Array<{
      commit: { author: { name: string; date: string } };
    }>;
    const c = list[0];
    if (!c) return null;
    return { author: c.commit.author.name, when: relTime(c.commit.author.date) };
  } catch {
    return null;
  }
}

function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms) || ms < 0) return "just now";
  const min = Math.floor(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d > 1 ? "s" : ""} ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} month${mo > 1 ? "s" : ""} ago`;
  return `${Math.floor(mo / 12)} yr ago`;
}

export default function Credit({ meta }: { meta: SchemeMeta }) {
  const [push, setPush] = useState<CommitInfo | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchLastPush().then((p) => {
      if (!cancelled) {
        setPush(p);
        setChecked(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // While the API call is in flight, hold the space so the footer doesn't jump.
  const author = push?.author ?? meta.lastUpdatedBy ?? meta.maintainer ?? "the team";
  const when = push?.when ?? (meta.updated ? relTime(meta.updated) : "");

  return (
    <div className="border-t border-edgesoft/60 py-5">
      <p className="text-center font-mono text-[10px] tracking-[0.22em] text-faint/80">
        LAST UPDATED BY{" "}
        <span className="text-dim">{author.toUpperCase()}</span>
        {checked || when ? (
          <>
            {" · "}
            <span className="text-faint/80">{(push ? `GIT PUSH ${when.toUpperCase()}` : `REV ${meta.rev} · ${when.toUpperCase()}`).replace("· ·", "·")}</span>
          </>
        ) : null}
        {!push && (
          <span className="ml-3 cursor-help text-faint/50" title="On GitHub Pages this reads the actual last commit to data/scheme.json. Locally it falls back to the file's own revision.">
            ◆
          </span>
        )}
      </p>
    </div>
  );
}
