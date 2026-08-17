import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftRight } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import { TradeStatusTimeline } from "@/components/app/TradeStatusTimeline";
import { cn } from "@/lib/utils";
import type { Trade } from "@/lib/types";
import { collectorById, me, useStore } from "@/mocks/store";

export const Route = createFileRoute("/trades/")({
  head: () => ({
    meta: [
      { title: "My trades — StickerSwap" },
      {
        name: "description",
        content: "Track incoming offers, active swaps and completed trades in one list.",
      },
      { property: "og:title", content: "My trades — StickerSwap" },
      { property: "og:description", content: "Proposals, shipping status and completed swaps." },
    ],
  }),
  component: Trades,
});

type Tab = "incoming" | "active" | "completed";

function bucket(trade: Trade): Tab {
  if (trade.status === "completed" || trade.status === "cancelled") return "completed";
  if (trade.receiverId === me.id && (trade.status === "proposed" || trade.status === "countered")) {
    return "incoming";
  }
  return "active";
}

function TradeRow({ trade }: { trade: Trade }) {
  const otherId = trade.proposerId === me.id ? trade.receiverId : trade.proposerId;
  const other = collectorById(otherId);
  const mine = trade.proposerId === me.id ? trade.send : trade.receive;
  const theirs = trade.proposerId === me.id ? trade.receive : trade.send;

  return (
    <Link
      to="/trades/$tradeId"
      params={{ tradeId: trade.id }}
      className="block rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-transform hover:scale-[1.01]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-primary-foreground">
            {other?.avatar}
          </span>
          <div>
            <p className="text-sm font-bold text-foreground">{other?.displayName}</p>
            <p className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ArrowLeftRight className="size-3" aria-hidden />
              You send {mine.length} · receive {theirs.length}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-secondary-foreground">
          {trade.status.replace(/_/g, " ")}
        </span>
      </div>
      <div className="mt-3">
        <TradeStatusTimeline status={trade.status} />
      </div>
    </Link>
  );
}

function Trades() {
  const { trades } = useStore();
  const [tab, setTab] = useState<Tab>("incoming");
  const list = trades.filter((t) => bucket(t) === tab);

  return (
    <AppShell
      title="Trades"
      subtitle={`${trades.filter((t) => bucket(t) === "active").length} active`}
      action={
        <div className="flex gap-1.5">
          {(["incoming", "active", "completed"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors",
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {list.map((trade) => (
          <TradeRow key={trade.id} trade={trade} />
        ))}
        {list.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Nothing here yet.
          </p>
        ) : null}
      </div>
    </AppShell>
  );
}
