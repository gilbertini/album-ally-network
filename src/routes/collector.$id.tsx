import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Star, Flag, Ban } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { StickerBadge } from "@/components/app/StickerTile";
import { stickerById } from "@/lib/album";
import { collectorById, useStore } from "@/mocks/store";

export const Route = createFileRoute("/collector/$id")({
  head: () => ({
    meta: [
      { title: "Collector profile — StickerSwap" },
      {
        name: "description",
        content:
          "Rating, completed trades, collector level and the stickers this collector can trade with you.",
      },
      { property: "og:title", content: "Collector profile — StickerSwap" },
      { property: "og:description", content: "City-level location only. No addresses shown." },
    ],
  }),
  component: CollectorProfile,
});

function CollectorProfile() {
  const { id } = Route.useParams();
  const { matches } = useStore();
  const collector = collectorById(id);
  const match = matches.find((m) => m.collector.id === id);

  if (!collector) {
    return (
      <AppShell title="Collector not found">
        <Link to="/matches" className="text-sm font-semibold text-primary">
          Back to matches
        </Link>
      </AppShell>
    );
  }

  return (
    <AppShell title={collector.displayName} subtitle={`@${collector.username}`}>
      <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-base font-extrabold text-primary-foreground">
            {collector.avatar}
          </span>
          <div>
            <p className="inline-flex items-center gap-1.5 text-lg font-extrabold text-foreground">
              {collector.displayName}
              {collector.emailVerified ? (
                <BadgeCheck className="size-4 text-primary" aria-label="Email verified" />
              ) : null}
            </p>
            <p className="text-xs text-muted-foreground">
              {collector.city}, {collector.state} · {collector.country}
            </p>
            <p className="mt-1 inline-flex items-center gap-2 text-xs font-semibold text-foreground">
              <Star className="size-3.5 fill-dupe text-dupe" aria-hidden />
              {collector.rating.toFixed(1)} · {collector.completedTrades} trades ·{" "}
              {collector.successRate}% successful
            </p>
            <p className="text-[11px] text-muted-foreground">
              {collector.level} · member since {collector.memberSince}
            </p>
          </div>
        </div>
      </section>

      {match ? (
        <>
          <h2 className="mt-6 text-sm font-extrabold text-foreground">
            They can give you ({match.theyHave.length})
          </h2>
          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {match.theyHave.slice(0, 8).map((sid) => {
              const s = stickerById.get(sid);
              return s ? <StickerBadge key={sid} sticker={s} /> : null;
            })}
          </div>
          <Link
            to="/build-trade/$id"
            params={{ id: collector.id }}
            className="mt-5 block rounded-full bg-primary px-5 py-3.5 text-center text-sm font-bold text-primary-foreground"
          >
            Build trade
          </Link>
        </>
      ) : (
        <p className="mt-6 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No tradeable overlap with your album right now.
        </p>
      )}

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => toast.success("Report submitted for review")}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm font-semibold text-foreground"
        >
          <Flag className="size-4" aria-hidden /> Report user
        </button>
        <button
          type="button"
          onClick={() => toast(`${collector.displayName} blocked`)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm font-semibold text-destructive"
        >
          <Ban className="size-4" aria-hidden /> Block user
        </button>
      </div>
    </AppShell>
  );
}
