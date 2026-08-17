import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Copy, Flame, Layers, Sparkles } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { MatchCard } from "@/components/app/MatchCard";
import { ProgressMeter } from "@/components/app/ProgressMeter";
import { StatCard } from "@/components/app/StatCard";
import { me, useStore } from "@/mocks/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your album & best matches — StickerSwap" },
      {
        name: "description",
        content:
          "Track album completion, duplicates and your strongest mutual trade matches in one place.",
      },
      { property: "og:title", content: "Your album & best matches — StickerSwap" },
      {
        property: "og:description",
        content: "See who has the stickers you're missing right now.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { stats, matches } = useStore();
  const mutual = matches.filter((m) => m.mutual);

  return (
    <AppShell title={`Hey, ${me.displayName.split(" ")[0]}`} subtitle={me.level}>
      <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              Your album
            </h2>
            <p className="mt-1 text-3xl font-extrabold text-foreground">
              {stats.owned} <span className="text-muted-foreground">/ {stats.total}</span>
            </p>
          </div>
          <p className="text-2xl font-extrabold text-gradient-primary">
            {stats.percent.toFixed(1)}%
          </p>
        </div>
        <ProgressMeter value={stats.percent} className="mt-3" label="Album completion" />
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-secondary p-2.5">
            <p className="text-lg font-bold text-foreground">{stats.missing}</p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Missing</p>
          </div>
          <div className="rounded-xl bg-secondary p-2.5">
            <p className="text-lg font-bold text-foreground">{stats.duplicates}</p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Duplicates</p>
          </div>
          <div className="rounded-xl bg-secondary p-2.5">
            <p className="text-lg font-bold text-foreground">
              {stats.countriesComplete}/{stats.countriesTotal}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Countries</p>
          </div>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard
          label="Mutual matches"
          value={mutual.length}
          hint="Both sides can help"
          icon={<Sparkles className="size-3.5 text-primary" aria-hidden />}
        />
        <StatCard
          label="Streak"
          value={me.streak}
          hint="Clean trades in a row"
          icon={<Flame className="size-3.5 text-accent" aria-hidden />}
        />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-base font-extrabold text-foreground">Best matches</h2>
        <Link
          to="/matches"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
        >
          See all <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      <div className="mt-3 flex flex-col gap-4">
        {matches.slice(0, 3).map((match) => (
          <MatchCard key={match.collector.id} match={match} />
        ))}
        {matches.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Mark some stickers as needed or duplicate to unlock matches.
          </p>
        ) : null}
      </div>

      <Link
        to="/album"
        className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-secondary p-4 text-sm font-semibold text-foreground"
      >
        <span className="inline-flex items-center gap-2">
          <Layers className="size-4 text-primary" aria-hidden />
          Update my album
        </span>
        <Copy className="size-4 text-muted-foreground" aria-hidden />
      </Link>
    </AppShell>
  );
}
