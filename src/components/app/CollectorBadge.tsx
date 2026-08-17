import { MapPin, Star } from "lucide-react";

import type { Collector } from "@/lib/types";

export function CollectorBadge({ collector }: { collector: Collector }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-primary-foreground">
        {collector.avatar}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-foreground">
          {collector.displayName} <span aria-hidden>{collector.flag}</span>
        </p>
        <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" aria-hidden />
            {collector.city}, {collector.state}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="size-3 fill-dupe text-dupe" aria-hidden />
            {collector.rating.toFixed(1)}
          </span>
          <span>{collector.completedTrades} trades</span>
        </p>
      </div>
    </div>
  );
}
