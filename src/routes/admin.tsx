import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Reports & safety review — StickerSwap" },
      {
        name: "description",
        content: "Review reported users and trades, and act on blocked or disputed swaps.",
      },
      { property: "og:title", content: "Reports & safety review — StickerSwap" },
      { property: "og:description", content: "Keeping the trade loop clean." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const reports = [
  { id: "r1", kind: "Trade", subject: "t_1991", reason: "Never shipped after 12 days", status: "open" },
  { id: "r2", kind: "User", subject: "@fastflipper", reason: "Asked to pay cash instead of trading", status: "open" },
  { id: "r3", kind: "User", subject: "@dupeking", reason: "Sent wrong stickers twice", status: "reviewing" },
  { id: "r4", kind: "Trade", subject: "t_1873", reason: "Stickers arrived damaged", status: "resolved" },
];

function Admin() {
  return (
    <AppShell title="Reports & safety" subtitle="Admin review queue">
      <div className="flex items-start gap-2 rounded-2xl border border-border bg-secondary p-4 text-xs text-secondary-foreground">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        Trading requires a verified email, the $5 membership and a completed profile. Self-trades and
        stickers already locked in another trade are blocked automatically.
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {reports.map((r) => (
          <li
            key={r.id}
            className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-foreground">
                  {r.kind} report · {r.subject}
                </p>
                <p className="text-xs text-muted-foreground">{r.reason}</p>
              </div>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase text-secondary-foreground">
                {r.status}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => toast.success("Report dismissed")}
                className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-foreground"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => toast.success("Account suspended pending review")}
                className="rounded-full bg-destructive px-3 py-2 text-xs font-semibold text-destructive-foreground"
              >
                Suspend
              </button>
            </div>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
