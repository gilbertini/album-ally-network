import { Check, Copy, Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Sticker, UserSticker } from "@/lib/types";

export function StickerBadge({ sticker, locked }: { sticker: Sticker; locked?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-2 shadow-[var(--shadow-card)]">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-sm">
        {sticker.flag || "🏳️"}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-bold text-foreground">{sticker.code}</span>
        <span className="block truncate text-[11px] text-muted-foreground">{sticker.name}</span>
      </span>
      {locked ? (
        <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase text-muted-foreground">
          locked
        </span>
      ) : null}
    </div>
  );
}

export function StickerTile({
  sticker,
  item,
  onSetOwned,
  onSetWanted,
  onAddDuplicate,
  locked,
}: {
  sticker: Sticker;
  item: UserSticker;
  onSetOwned: (qty: number) => void;
  onSetWanted: (wanted: boolean) => void;
  onAddDuplicate: () => void;
  locked?: boolean;
}) {
  const owned = item.quantityOwned > 0;
  const dupes = item.quantityAvailableForTrade;

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-card)] transition-all",
        owned ? "border-have/40" : "border-need/30",
      )}
    >
      <div
        className={cn(
          "relative flex aspect-[3/4] items-center justify-center bg-gradient-to-b",
          owned ? "from-secondary to-card" : "from-muted to-card",
        )}
      >
        <span className={cn("text-4xl transition", owned ? "" : "opacity-30 grayscale")}>
          {sticker.flag || "🏆"}
        </span>
        <span className="absolute left-2 top-2 rounded-md bg-foreground/85 px-1.5 py-0.5 text-[10px] font-bold text-background">
          {sticker.code}
        </span>
        {owned ? (
          <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-have text-have-foreground">
            <Check className="size-3.5" aria-hidden />
          </span>
        ) : (
          <span className="absolute right-2 top-2 rounded-full bg-need px-1.5 py-0.5 text-[9px] font-bold uppercase text-need-foreground">
            need
          </span>
        )}
        {dupes > 0 ? (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-dupe px-1.5 py-0.5 text-[9px] font-bold uppercase text-dupe-foreground">
            <Copy className="size-2.5" aria-hidden /> {dupes} dupe{dupes > 1 ? "s" : ""}
          </span>
        ) : null}
        {locked ? (
          <span className="absolute bottom-2 right-2 rounded-full bg-foreground/80 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-background">
            in trade
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 p-2.5">
        <p className="truncate text-xs font-semibold text-foreground" title={sticker.name}>
          {sticker.name}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSetWanted(!item.wanted)}
            aria-pressed={item.wanted}
            className={cn(
              "flex-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-colors",
              item.wanted
                ? "bg-need text-need-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted",
            )}
          >
            Need
          </button>
          <button
            type="button"
            onClick={() => onSetOwned(owned ? 0 : 1)}
            aria-pressed={owned}
            className={cn(
              "flex-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-colors",
              owned
                ? "bg-have text-have-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted",
            )}
          >
            Have
          </button>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-secondary px-1.5 py-1">
          <button
            type="button"
            aria-label={`Remove one ${sticker.code}`}
            onClick={() => onSetOwned(item.quantityOwned - 1)}
            className="grid size-6 place-items-center rounded-md text-secondary-foreground transition-colors hover:bg-background"
          >
            <Minus className="size-3.5" aria-hidden />
          </button>
          <span className="text-[11px] font-semibold text-secondary-foreground">
            Owned: {item.quantityOwned}
          </span>
          <button
            type="button"
            aria-label={`Add duplicate of ${sticker.code}`}
            onClick={onAddDuplicate}
            className="grid size-6 place-items-center rounded-md text-secondary-foreground transition-colors hover:bg-background"
          >
            <Plus className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
