import { Link } from "@tanstack/react-router";
import { ArrowLeftRight } from "lucide-react";

import { CollectorBadge } from "@/components/app/CollectorBadge";
import { StickerBadge } from "@/components/app/StickerTile";
import { stickerById } from "@/lib/album";
import type { MatchResult } from "@/lib/matching";

export function MatchCard({ match, limit = 3 }: { match: MatchResult; limit?: number }) {
  const theyHave = match.theyHave.slice(0, limit);
  const youHave = match.youHave.slice(0, limit);

  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3 border-b border-border p-4">
        <CollectorBadge collector={match.collector} />
        <div className="shrink-0 text-right">
          <p className="text-xl font-extrabold text-gradient-primary">{match.score}%</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Trade match
          </p>
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <section>
          <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-need">
            They have ({match.theyHave.length})
          </h3>
          <div className="flex flex-col gap-1.5">
            {theyHave.map((id) => {
              const sticker = stickerById.get(id);
              return sticker ? <StickerBadge key={id} sticker={sticker} /> : null;
            })}
          </div>
        </section>
        <section>
          <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-have">
            You have ({match.youHave.length})
          </h3>
          <div className="flex flex-col gap-1.5">
            {youHave.map((id) => {
              const sticker = stickerById.get(id);
              return sticker ? <StickerBadge key={id} sticker={sticker} /> : null;
            })}
          </div>
        </section>
      </div>

      {match.reasons.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {match.reasons.slice(0, 3).map((reason) => (
            <span
              key={reason}
              className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
            >
              {reason}
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-border bg-secondary/50 p-3">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <ArrowLeftRight className="size-4 text-primary" aria-hidden />
          Possible trade: {Math.min(5, match.theyHave.length)} ↔{" "}
          {Math.min(5, match.youHave.length)}
        </p>
        <div className="flex items-center gap-2">
          <Link
            to="/collector/$id"
            params={{ id: match.collector.id }}
            className="rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            View collector
          </Link>
          <Link
            to="/build-trade/$id"
            params={{ id: match.collector.id }}
            className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:scale-[1.02]"
          >
            Build trade
          </Link>
        </div>
      </div>
    </article>
  );
}
