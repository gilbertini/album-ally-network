import { Link } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import type { ReactNode } from "react";

import { BottomNav } from "@/components/app/BottomNav";
import { CreditPill } from "@/components/app/CreditPill";
import { useStore } from "@/mocks/store";

export function AppShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const { credits, notifications } = useStore();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-foreground">{title}</h1>
            {subtitle ? (
              <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <CreditPill credits={credits} />
          <Link
            to="/search"
            aria-label="Search stickers"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Search className="size-5" aria-hidden />
          </Link>
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Bell className="size-5" aria-hidden />
            {unread > 0 ? (
              <span className="absolute right-1 top-1 size-2 rounded-full bg-accent" />
            ) : null}
          </Link>
        </div>
        {action ? <div className="mx-auto max-w-3xl px-4 pb-3">{action}</div> : null}
      </header>
      <main className="mx-auto max-w-3xl px-4 py-5">{children}</main>
      <BottomNav />
    </div>
  );
}
