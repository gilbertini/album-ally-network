import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import { ProgressMeter } from "@/components/app/ProgressMeter";
import { StickerTile } from "@/components/app/StickerTile";
import { album, countries, stickerById } from "@/lib/album";
import { cn } from "@/lib/utils";
import { useStore } from "@/mocks/store";

export const Route = createFileRoute("/album/")({
  head: () => ({
    meta: [
      { title: "My Album — StickerSwap" },
      {
        name: "description",
        content:
          "Browse your Panini World Cup 2026 album by country, player or code and update have, need and duplicate counts.",
      },
      { property: "og:title", content: "My Album — StickerSwap" },
      {
        property: "og:description",
        content: "Track owned stickers, missing numbers and duplicates ready to trade.",
      },
    ],
  }),
  component: MyAlbum,
});

type Filter = "all" | "missing" | "owned" | "duplicates";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "missing", label: "Missing" },
  { key: "owned", label: "Owned" },
  { key: "duplicates", label: "Duplicates" },
];

function MyAlbum() {
  const { inventory, stats, setOwned, setWanted, addDuplicate, lockedStickerIds } = useStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inventory.filter((item) => {
      const sticker = stickerById.get(item.stickerId);
      if (!sticker) return false;
      if (filter === "missing" && item.quantityOwned > 0) return false;
      if (filter === "owned" && item.quantityOwned === 0) return false;
      if (filter === "duplicates" && item.quantityAvailableForTrade === 0) return false;
      if (!q) return true;
      return (
        sticker.code.toLowerCase().includes(q) ||
        sticker.name.toLowerCase().includes(q) ||
        sticker.country.toLowerCase().includes(q)
      );
    });
  }, [inventory, filter, query]);

  return (
    <AppShell
      title="My Album"
      subtitle={`${stats.owned} / ${stats.total} collected · ${stats.percent.toFixed(1)}%`}
      action={
        <div className="flex flex-col gap-2">
          <ProgressMeter value={stats.percent} />
          <label className="relative block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search player, code or country"
              aria-label="Search your album"
              className="w-full rounded-full border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </label>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  filter === f.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      }
    >
      {album.errors.length > 0 ? (
        <div className="mb-4 flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p className="font-bold">Checklist import warning</p>
            {album.errors.slice(0, 3).map((e) => (
              <p key={e}>{e}</p>
            ))}
          </div>
        </div>
      ) : null}

      <section>
        <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Countries
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {countries.map((country) => {
            const owned = country.stickers.filter(
              (s) => (inventory.find((i) => i.stickerId === s.id)?.quantityOwned ?? 0) > 0,
            ).length;
            return (
              <Link
                key={country.slug}
                to="/album/$country"
                params={{ country: country.slug }}
                className="w-28 shrink-0 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)] transition-transform hover:scale-[1.02]"
              >
                <span className="text-xl">{country.flag}</span>
                <p className="mt-1 truncate text-xs font-bold text-foreground">{country.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {owned} / {country.stickers.length}
                </p>
                <ProgressMeter
                  value={(owned / country.stickers.length) * 100}
                  className="mt-1.5"
                  label={`${country.name} progress`}
                />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            {items.length} stickers
          </h2>
          <span className="inline-flex items-center text-[11px] text-muted-foreground">
            Tap Need / Have / + <ChevronRight className="size-3" aria-hidden />
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.slice(0, 120).map((item) => {
            const sticker = stickerById.get(item.stickerId);
            if (!sticker) return null;
            return (
              <StickerTile
                key={item.stickerId}
                sticker={sticker}
                item={item}
                locked={lockedStickerIds.has(item.stickerId)}
                onSetOwned={(qty) => setOwned(item.stickerId, qty)}
                onSetWanted={(w) => setWanted(item.stickerId, w)}
                onAddDuplicate={() => addDuplicate(item.stickerId)}
              />
            );
          })}
        </div>
        {items.length > 120 ? (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Showing the first 120 — narrow it down with search or a country.
          </p>
        ) : null}
      </section>
    </AppShell>
  );
}
