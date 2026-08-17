import { createFileRoute, Link } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import { searchStickers } from "@/lib/album";
import { collectors, otherInventories, useStore } from "@/mocks/store";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search stickers & collectors — StickerSwap" },
      {
        name: "description",
        content:
          "Search by player, sticker code or country and see which collectors have duplicates, mutual matches first.",
      },
      { property: "og:title", content: "Search stickers & collectors — StickerSwap" },
      { property: "og:description", content: "Find who has ARG17 right now." },
    ],
  }),
  component: SearchPage;
});

function SearchPage() {
  const [query, setQuery] = useState("");
  const { matches } = useStore();
  const results = useMemo(() => searchStickers(query, 30), [query]);

  return (
    <AppShell
      title="Search"
      action={
        <label className="relative block">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Messi, ARG17, Argentina…"
            aria-label="Search stickers"
            className="w-full rounded-full border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
      }
    >
      {query.trim() === "" ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Search a player, a sticker code, or a country.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {results.map((sticker) => {
            const withDupes = collectors.filter(
              (c) =>
                (otherInventories.get(c.id) ?? []).find((i) => i.stickerId === sticker.id)
                  ?.quantityAvailableForTrade,
            );
            const mutualCount = matches.filter(
              (m) => m.mutual && m.theyHave.includes(sticker.id),
            ).length;
            return (
              <li
                key={sticker.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-secondary">
                    {sticker.flag || "🏆"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">
                      {sticker.name} — {sticker.code}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {withDupes.length} collectors have duplicates ·{" "}
                      <span className="font-semibold text-primary">
                        {mutualCount} mutual matches for you
                      </span>
                    </p>
                  </div>
                </div>
                {withDupes.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {withDupes.slice(0, 4).map((c) => (
                      <Link
                        key={c.id}
                        to="/collector/$id"
                        params={{ id: c.id }}
                        className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground hover:bg-muted"
                      >
                        {c.displayName} {c.flag}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </li>
            );
          })}
          {results.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No stickers matched “{query}”.
            </p>
          ) : null}
        </ul>
      )}
    </AppShell>
  );
}
