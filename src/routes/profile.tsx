import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Flame, Star, Trophy } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { ProgressMeter } from "@/components/app/ProgressMeter";
import { StatCard } from "@/components/app/StatCard";
import { levelClass } from "@/lib/levels";
import { cn } from "@/lib/utils";

import { me, useStore } from "@/mocks/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My collector profile — StickerSwap" },
      {
        name: "description",
        content:
          "Your rating, completed trades, collector level, album progress and achievements. City-level location only.",
      },
      { property: "og:title", content: "My collector profile — StickerSwap" },
      { property: "og:description", content: "Reputation built on completed trades, not prices." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { stats, trades } = useStore();
  const completed = trades.filter((t) => t.status === "completed").length + me.completedTrades;

  const achievements = [
    { name: "First Trade", description: "Complete your first swap.", unlocked: completed > 0 },
    { name: "Perfect Match", description: "Complete a 5-for-5 trade.", unlocked: true },
    {
      name: "Argentina Complete",
      description: "Collect every Argentina sticker.",
      unlocked: stats.countriesComplete > 0,
    },
    { name: "50% Club", description: "Collect half the album.", unlocked: stats.percent >= 50 },
    { name: "Album Complete", description: "Collect all base stickers.", unlocked: stats.percent >= 100 },
  ];

  return (
    <AppShell title="Profile" subtitle={`@${me.username}`}>
      <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-4">
          <span className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-lg font-extrabold text-primary-foreground">
            {me.avatar}
          </span>
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-lg font-extrabold text-foreground">
              {me.displayName}
              {me.emailVerified ? (
                <BadgeCheck className="size-4 text-primary" aria-label="Email verified" />
              ) : null}
            </p>
            <p className="text-xs text-muted-foreground">
              {me.city}, {me.state} · {me.country}
            </p>
            <p className="mt-1 inline-flex items-center gap-2 text-xs font-semibold text-foreground">
              <Star className="size-3.5 fill-dupe text-dupe" aria-hidden />
              {me.rating.toFixed(1)} · {completed} completed trades · {me.successRate}% successful
            </p>
            <p className="text-[11px] text-muted-foreground">Member since {me.memberSince}</p>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-secondary p-3">
          <p className="flex items-center justify-between text-xs font-bold text-secondary-foreground">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${levelClass(me.level)}`}
            >
              <Trophy className="size-3.5" aria-hidden />
              {me.level}
            </span>
            <span>{stats.percent.toFixed(0)}% complete</span>
          </p>
          <ProgressMeter value={stats.percent} className="mt-2" />
        </div>
      </section>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <StatCard label="Countries" value={`${stats.countriesComplete}/${stats.countriesTotal}`} />
        <StatCard
          label="Streak"
          value={me.streak}
          icon={<Flame className="size-3.5 text-accent" aria-hidden />}
        />
        <StatCard label="Duplicates" value={stats.duplicates} />
      </div>

      <h2 className="mt-6 text-sm font-extrabold text-foreground">Achievements</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {achievements.map((a) => (
          <div
            key={a.name}
            className={cn(
              "rounded-2xl border p-4",
              a.unlocked ? "border-primary/30 bg-primary/5" : "border-border bg-card opacity-70",
            )}
          >
            <p className="text-sm font-bold text-foreground">{a.name}</p>
            <p className="text-xs text-muted-foreground">{a.description}</p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-primary">
              {a.unlocked ? "Unlocked" : "Locked"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Link
          to="/wallet"
          className="rounded-2xl border border-border bg-card p-4 text-sm font-semibold text-foreground shadow-[var(--shadow-card)]"
        >
          Trade Credits & billing
        </Link>
        <Link
          to="/admin"
          className="rounded-2xl border border-border bg-card p-4 text-sm font-semibold text-foreground shadow-[var(--shadow-card)]"
        >
          Reports & safety
        </Link>
      </div>
      <p className="mt-4 text-[11px] text-muted-foreground">
        Your street address is never shown publicly — it is shared only inside a finalized trade.
      </p>
    </AppShell>
  );
}
