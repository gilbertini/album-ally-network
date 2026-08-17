import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Handshake, PackageCheck, Sparkles, Star, Truck } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import type { NotificationKind } from "@/lib/types";
import { useStore } from "@/mocks/store";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — StickerSwap" },
      {
        name: "description",
        content: "New matches, trade proposals, counteroffers, shipping updates and ratings.",
      },
      { property: "og:title", content: "Notifications — StickerSwap" },
      { property: "og:description", content: "Everything happening across your trades." },
    ],
  }),
  component: Notifications,
});

const icons: Record<NotificationKind, typeof Bell> = {
  new_match: Sparkles,
  trade_proposal: Handshake,
  counteroffer: Handshake,
  trade_accepted: Handshake,
  trade_shipped: Truck,
  trade_delivered: PackageCheck,
  rating_received: Star,
};

function Notifications() {
  const { notifications, markAllNotificationsRead } = useStore();

  return (
    <AppShell
      title="Notifications"
      subtitle={`${notifications.filter((n) => !n.read).length} unread`}
      action={
        <button
          type="button"
          onClick={markAllNotificationsRead}
          className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground"
        >
          Mark all read
        </button>
      }
    >
      <ul className="flex flex-col gap-2">
        {notifications.map((n) => {
          const Icon = icons[n.kind];
          const body = (
            <div
              className={cn(
                "flex items-start gap-3 rounded-2xl border p-4",
                n.read ? "border-border bg-card" : "border-primary/30 bg-primary/5",
              )}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          );
          return (
            <li key={n.id}>
              {n.tradeId ? (
                <Link to="/trades/$tradeId" params={{ tradeId: n.tradeId }}>
                  {body}
                </Link>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
