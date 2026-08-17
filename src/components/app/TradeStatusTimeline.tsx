import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TradeStatus } from "@/lib/types";

const FLOW: { status: TradeStatus; label: string }[] = [
  { status: "proposed", label: "Proposed" },
  { status: "accepted", label: "Accepted" },
  { status: "awaiting_payment", label: "Credit" },
  { status: "ready_to_ship", label: "Ready to ship" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
  { status: "completed", label: "Completed" },
];

export function TradeStatusTimeline({ status }: { status: TradeStatus }) {
  const terminal = status === "cancelled" || status === "disputed";
  const activeIndex = terminal
    ? -1
    : FLOW.findIndex((s) => s.status === (status === "countered" ? "proposed" : status));

  return (
    <div>
      {terminal ? (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
          Trade {status}
        </p>
      ) : (
        <ol className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {FLOW.map((step, i) => {
            const done = i < activeIndex;
            const current = i === activeIndex;
            return (
              <li key={step.status} className="flex min-w-0 flex-1 items-center gap-1">
                <span
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-full border text-[9px] font-bold",
                    done && "border-have bg-have text-have-foreground",
                    current && "border-primary bg-primary text-primary-foreground",
                    !done && !current && "border-border bg-muted text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-3" aria-hidden /> : i + 1}
                </span>
                <span
                  className={cn(
                    "truncate text-[10px] font-medium",
                    current ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
