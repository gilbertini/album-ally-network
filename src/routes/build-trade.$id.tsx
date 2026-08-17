import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeftRight, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { CollectorBadge } from "@/components/app/CollectorBadge";
import { stickerById } from "@/lib/album";
import { cn } from "@/lib/utils";
import { collectorById, useStore } from "@/mocks/store";

export const MAX_PER_SIDE = 5;

export const Route = createFileRoute("/build-trade/$id")({
  head: () => ({
    meta: [
      { title: "Build a trade — StickerSwap" },
      {
        name: "description",
        content:
          "Pick up to five duplicates to send and up to five stickers to receive, then send the proposal.",
      },
      { property: "og:title", content: "Build a trade — StickerSwap" },
      { property: "og:description", content: "One Trade Credit covers up to 5 stickers each way." },
    ],
  }),
  component: BuildTrade,
});

function Picker({
  title, tone, ids, selected, onToggle,
}: {
  title: string;
  tone: "have" | "need";
  ids: string[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <h2 className={cn("text-[11px] font-bold uppercase tracking-wide", tone === "have" ? "text-have" : "text-need")}>
          {title}
        </h2>
        <span className="text-[11px] font-semibold text-muted-foreground">
          {selected.length} / {MAX_PER_SIDE}
        </span>
      </div>
      <div className="mt-3 flex max-h-72 flex-col gap-1.5 overflow-y-auto">
        {ids.map((id) => {
          const sticker = stickerById.get(id);
          if (!sticker) return null;
          const isOn = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => onToggle(id)}
              aria-pressed={isOn}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-colors",
                isOn ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted",
              )}
            >
              <span className="grid size-8 place-items-center rounded-lg bg-secondary text-sm">
                {sticker.flag || "🏆"}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-bold text-foreground">
                  {sticker.code}
                </span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {sticker.name}
                </span>
              </span>
              <span
                className={cn(
                  "grid size-5 place-items-center rounded-full border",
                  isOn ? "border-primary bg-primary text-primary-foreground" : "border-border",
                )}
              >
                {isOn ? <Check className="size-3" aria-hidden /> : null}
              </span>
            </button>
          );
        })}
        {ids.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">Nothing available here.</p>
        ) : null}
      </div>
    </section>
  );
}

function BuildTrade() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { matches, createTrade, lockedStickerIds } = useStore();
  const collector = collectorById(id);
  const match = matches.find((m) => m.collector.id === id);

  const [send, setSend] = useState<string[]>([]);
  const [receive, setReceive] = useState<string[]>([]);

  if (!collector || !match) {
    return (
      <AppShell title="Collector unavailable">
        <p className="text-sm text-muted-foreground">
          This collector has no tradeable overlap with your album right now.
        </p>
      </AppShell>
    );
  }

  const toggle = (list: string[], setList: (v: string[]) => void) => (sid: string) => {
    if (list.includes(sid)) {
      setList(list.filter((x) => x !== sid));
      return;
    }
    if (list.length >= MAX_PER_SIDE) {
      toast.error(`Maximum ${MAX_PER_SIDE} stickers per side`);
      return;
    }
    setList([...list, sid]);
  };

  const sendable = match.youHave.filter((sid) => !lockedStickerIds.has(sid));

  return (
    <AppShell title="Build trade" subtitle={`With ${collector.displayName}`}>
      <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
        <CollectorBadge collector={collector} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Picker
          title="You send (your duplicates)"
          tone="have"
          ids={sendable}
          selected={send}
          onToggle={toggle(send, setSend)}
        />
        <Picker
          title="You receive"
          tone="need"
          ids={match.theyHave}
          selected={receive}
          onToggle={toggle(receive, setReceive)}
        />
      </div>

      <div className="sticky bottom-24 mt-5 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-lift)]">
        <p className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
          <ArrowLeftRight className="size-4 text-primary" aria-hidden />
          {send.length} ↔ {receive.length}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          1 Trade Credit covers this entire trade — up to 5 stickers each. Credits are only used
          once both collectors accept.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/matches" })}
            className="flex-1 rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={send.length === 0 || receive.length === 0}
            onClick={() => {
              const trade = createTrade(collector.id, send, receive);
              toast.success("Trade proposal sent");
              navigate({ to: "/trades/$tradeId", params: { tradeId: trade.id } });
            }}
            className="flex-[1.4] rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-40"
          >
            Send trade proposal
          </button>
        </div>
      </div>
    </AppShell>
  );
}
