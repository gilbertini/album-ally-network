import { createFileRoute, Link } from "@tanstack/react-router";
import { Coins, PackageCheck, Send, Ship, Star, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { CollectorBadge } from "@/components/app/CollectorBadge";
import { StickerBadge } from "@/components/app/StickerTile";
import { TradeStatusTimeline } from "@/components/app/TradeStatusTimeline";
import { stickerById } from "@/lib/album";
import { cn } from "@/lib/utils";
import { collectorById, me, useStore } from "@/mocks/store";

export const Route = createFileRoute("/trades/$tradeId")({
  head: () => ({
    meta: [
      { title: "Trade detail — StickerSwap" },
      {
        name: "description",
        content:
          "Accept, counter or decline a trade, spend a Trade Credit, share shipping and confirm delivery.",
      },
      { property: "og:title", content: "Trade detail — StickerSwap" },
      { property: "og:description", content: "One credit per completed trade, up to 5 each side." },
    ],
  }),
  component: TradeDetail,
});

function TradeDetail() {
  const { tradeId } = Route.useParams();
  const { trades, credits, finalizeTrade, updateTrade, setTradeStatus, sendMessage } = useStore();
  const trade = trades.find((t) => t.id === tradeId);
  const [message, setMessage] = useState("");
  const [tracking, setTracking] = useState("");
  const [stars, setStars] = useState(5);

  if (!trade) {
    return (
      <AppShell title="Trade not found">
        <Link to="/trades" className="text-sm font-semibold text-primary">
          Back to trades
        </Link>
      </AppShell>
    );
  }

  const iAmProposer = trade.proposerId === me.id;
  const other = collectorById(iAmProposer ? trade.receiverId : trade.proposerId);
  const iSend = iAmProposer ? trade.send : trade.receive;
  const iReceive = iAmProposer ? trade.receive : trade.send;
  const incoming = !iAmProposer && (trade.status === "proposed" || trade.status === "countered");
  const accepted = !["proposed", "countered", "cancelled"].includes(trade.status);
  const shippingVisible = accepted && trade.creditConsumed;
  const myShipped = iAmProposer ? trade.shipping.proposerShipped : trade.shipping.receiverShipped;
  const myReceived = iAmProposer ? trade.shipping.proposerReceived : trade.shipping.receiverReceived;

  return (
    <AppShell title="Trade" subtitle={trade.status.replace(/_/g, " ")}>
      <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
        {other ? <CollectorBadge collector={other} /> : null}
        <div className="mt-4">
          <TradeStatusTimeline status={trade.status} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-need">
            You receive ({iReceive.length})
          </h2>
          <div className="flex flex-col gap-1.5">
            {iReceive.map((id) => {
              const s = stickerById.get(id);
              return s ? <StickerBadge key={id} sticker={s} /> : null;
            })}
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-have">
            You send ({iSend.length})
          </h2>
          <div className="flex flex-col gap-1.5">
            {iSend.map((id) => {
              const s = stickerById.get(id);
              return s ? <StickerBadge key={id} sticker={s} locked={accepted} /> : null;
            })}
          </div>
        </section>
      </div>

      {incoming ? (
        <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <p className="text-sm font-bold text-foreground">
            {other?.displayName} wants to trade with you.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            You receive {iReceive.length} · you send {iSend.length}. Max 5 per side.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => {
                setTradeStatus(trade.id, "accepted");
                toast.success("Trade accepted — stickers locked");
              }}
              className="rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
            >
              Accept trade
            </button>
            <Link
              to="/build-trade/$id"
              params={{ id: trade.proposerId }}
              className="rounded-full border border-border bg-card px-4 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Counter offer
            </Link>
            <button
              type="button"
              onClick={() => {
                setTradeStatus(trade.id, "cancelled");
                toast("Trade declined — no credit used");
              }}
              className="rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold text-destructive transition-colors hover:bg-muted"
            >
              Decline
            </button>
          </div>
        </div>
      ) : null}

      {trade.status === "accepted" && !trade.creditConsumed ? (
        <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
            <Coins className="size-4 text-primary" aria-hidden />
            Complete this trade for 1 Trade Credit
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            1 Trade Credit covers this entire trade — up to 5 stickers each. Balance: {credits}{" "}
            credits.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={credits < 1}
              onClick={() => {
                finalizeTrade(trade.id);
                toast.success("Trade finalized — shipping details unlocked");
              }}
              className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-40"
            >
              Use 1 credit
            </button>
            <Link
              to="/wallet"
              className="rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground"
            >
              Buy credits
            </Link>
          </div>
        </div>
      ) : null}

      {shippingVisible ? (
        <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
            <Truck className="size-4 text-primary" aria-hidden /> Shipping
          </h2>
          <p className="mt-2 rounded-xl bg-secondary p-3 text-xs text-secondary-foreground">
            Send to {other?.displayName}, {other?.city}, {other?.state} {other?.zip} — full address
            shared privately in this trade only.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="Tracking number (optional)"
              aria-label="Tracking number"
              className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <select
              aria-label="Carrier"
              defaultValue={trade.shipping.carrier ?? "USPS"}
              onChange={(e) =>
                updateTrade(trade.id, {
                  shipping: { ...trade.shipping, carrier: e.target.value as "USPS" },
                })
              }
              className="rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {["USPS", "UPS", "FedEx", "Other"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              disabled={myShipped}
              onClick={() => {
                updateTrade(trade.id, {
                  status: "shipped",
                  shipping: {
                    ...trade.shipping,
                    ...(iAmProposer ? { proposerShipped: true } : { receiverShipped: true }),
                    ...(tracking ? { tracking } : {}),
                  },
                });
                toast.success("Marked as shipped");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-40"
            >
              <Ship className="size-4" aria-hidden /> {myShipped ? "Shipped" : "Mark as shipped"}
            </button>
            <button
              type="button"
              disabled={myReceived}
              onClick={() => {
                const shipping = {
                  ...trade.shipping,
                  ...(iAmProposer ? { proposerReceived: true } : { receiverReceived: true }),
                };
                const bothReceived = shipping.proposerReceived && shipping.receiverReceived;
                updateTrade(trade.id, {
                  shipping,
                  status: bothReceived ? "completed" : "delivered",
                });
                toast.success(bothReceived ? "Trade completed!" : "Receipt confirmed");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground disabled:opacity-40"
            >
              <PackageCheck className="size-4" aria-hidden />{" "}
              {myReceived ? "Receipt confirmed" : "I received my stickers"}
            </button>
          </div>
        </div>
      ) : null}

      {trade.status === "completed" ? (
        <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-bold text-foreground">Rate this trade</h2>
          {trade.rating ? (
            <p className="mt-2 text-xs text-muted-foreground">
              You rated {trade.rating.stars}★ — “{trade.rating.comment}”
            </p>
          ) : (
            <>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} stars`}
                    onClick={() => setStars(n)}
                    className="p-0.5"
                  >
                    <Star
                      className={cn(
                        "size-6",
                        n <= stars ? "fill-dupe text-dupe" : "text-muted-foreground",
                      )}
                      aria-hidden
                    />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  updateTrade(trade.id, { rating: { stars, comment: "Great swap" } });
                  toast.success("Rating submitted");
                }}
                className="mt-3 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
              >
                Submit rating
              </button>
            </>
          )}
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
        <h2 className="text-sm font-bold text-foreground">Trade chat</h2>
        <div className="mt-3 flex flex-col gap-2">
          {trade.messages.map((m) => (
            <p
              key={m.id}
              className={cn(
                "max-w-[80%] rounded-2xl px-3 py-2 text-xs",
                m.authorId === me.id
                  ? "self-end bg-primary text-primary-foreground"
                  : "self-start bg-secondary text-secondary-foreground",
              )}
            >
              {m.body}
            </p>
          ))}
          {trade.messages.length === 0 ? (
            <p className="text-xs text-muted-foreground">No messages yet.</p>
          ) : null}
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!message.trim()) return;
            sendMessage(trade.id, message.trim());
            setMessage("");
          }}
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message about this trade"
            aria-label="Trade message"
            className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            aria-label="Send message"
            className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground"
          >
            <Send className="size-4" aria-hidden />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
