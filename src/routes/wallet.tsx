import { createFileRoute } from "@tanstack/react-router";
import { Coins, CreditCard } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { useStore } from "@/mocks/store";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "Trade Credits wallet — StickerSwap" },
      {
        name: "description",
        content:
          "Buy Trade Credits in packs of 5, 10 or 25. One credit completes one trade of up to five stickers each way.",
      },
      { property: "og:title", content: "Trade Credits wallet — StickerSwap" },
      { property: "og:description", content: "5 Trades $5 · 10 Trades $10 · 25 Trades $25." },
    ],
  }),
  component: Wallet,
});

const packs = [
  { credits: 5, price: 5 },
  { credits: 10, price: 10 },
  { credits: 25, price: 25 },
];

function Wallet() {
  const { credits, ledger, purchaseCredits } = useStore();

  return (
    <AppShell title="Wallet" subtitle="Trade Credits">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/80 p-5 text-primary-foreground shadow-[var(--shadow-lift)]">
        <p className="text-[11px] font-bold uppercase tracking-wide opacity-80">Current balance</p>
        <p className="mt-1 inline-flex items-center gap-2 text-4xl font-extrabold">
          <Coins className="size-7" aria-hidden /> {credits}
        </p>
        <p className="mt-1 text-xs opacity-90">
          1 Trade Credit covers one completed trade — up to 5 stickers each side.
        </p>
      </section>

      <h2 className="mt-6 text-sm font-extrabold text-foreground">Buy credits</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {packs.map((pack) => (
          <button
            key={pack.credits}
            type="button"
            onClick={() => {
              purchaseCredits(pack.credits);
              toast.success(`${pack.credits} Trade Credits added`);
            }}
            className="rounded-2xl border border-border bg-card p-4 text-left shadow-[var(--shadow-card)] transition-transform hover:scale-[1.02]"
          >
            <p className="text-lg font-extrabold text-foreground">{pack.credits} Trades</p>
            <p className="text-sm font-semibold text-primary">${pack.price}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <CreditCard className="size-3.5" aria-hidden /> Secure checkout
            </p>
          </button>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Checkout is wired up in the next phase — purchases here are simulated so you can test the
        credit ledger.
      </p>

      <h2 className="mt-6 text-sm font-extrabold text-foreground">Credit ledger</h2>
      <ul className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {ledger.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between gap-3 p-3.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{entry.note}</p>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {entry.type} · {new Date(entry.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p
              className={
                entry.amount > 0
                  ? "text-sm font-bold text-have"
                  : "text-sm font-bold text-muted-foreground"
              }
            >
              {entry.amount > 0 ? "+" : ""}
              {entry.amount}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Your balance is calculated from these ledger entries, never stored as a mutable number.
      </p>
    </AppShell>
  );
}
