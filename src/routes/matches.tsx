import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import { MatchCard } from "@/components/app/MatchCard";
import { cn } from "@/lib/utils";
import { useStore } from "@/mocks/store";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { title: "Match feed — StickerSwap" },
      {
        name: "description",
        content:
          "Swipe through collectors who have the stickers you need and need the ones you have spare.",
      },
      { property: "og:title", content: "Match feed — StickerSwap" },
      { property: "og:description", content: "Mutual matches first. Build a trade in two taps." },
    ],
  }),
  component: Matches,
});

function Matches() {
  const { matches } = useStore();
  const [onlyMutual, setOnlyMutual] = useState(true);
  const [index, setIndex] = useState(0);

  const list = onlyMutual ? matches.filter((m) => m.mutual) : matches;
  const current = list[Math.min(index, Math.max(0, list.length - 1))];

  return (
    <AppShell
      title="Matches"
      subtitle={`${matches.filter((m) => m.mutual).length} mutual matches right now`}
      action={
        <div className="flex gap-1.5">
          {[
            { key: true, label: "Mutual matches" },
            { key: false, label: "Everyone" },
          ].map((tab) => (
            <button
              key={String(tab.key)}
              type="button"
              onClick={() => {
                setOnlyMutual(tab.key);
                setIndex(0);
              }}
              aria-pressed={onlyMutual === tab.key}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                onlyMutual === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      }
    >
      {current ? (
        <>
          <div className="flex items-center justify-between pb-3">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" aria-hidden />
              Card {Math.min(index + 1, list.length)} of {list.length}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous match"
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                className="grid size-9 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
              >
                <ChevronLeft className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Next match"
                onClick={() => setIndex((i) => Math.min(list.length - 1, i + 1))}
                className="grid size-9 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
              >
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          </div>

          <div key={current.collector.id} className="animate-in fade-in zoom-in-95 duration-300">
            <MatchCard match={current} limit={5} />
          </div>

          <h2 className="mt-8 text-sm font-extrabold text-foreground">Up next</h2>
          <div className="mt-3 flex flex-col gap-4">
            {list.slice(index + 1, index + 4).map((match) => (
              <MatchCard key={match.collector.id} match={match} />
            ))}
          </div>
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No matches yet. Add more duplicates and needed stickers in My Album.
        </p>
      )}
    </AppShell>
  );
}
