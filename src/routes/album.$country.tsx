import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { ProgressMeter } from "@/components/app/ProgressMeter";
import { StickerTile } from "@/components/app/StickerTile";
import { countryBySlug } from "@/lib/album";
import { useStore } from "@/mocks/store";

export const Route = createFileRoute("/album/$country")({
  loader: ({ params }) => {
    const country = countryBySlug(params.country);
    if (!country) throw notFound();
    return { name: country.name, flag: country.flag, count: country.stickers.length };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Country not found — StickerSwap" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} stickers — StickerSwap`;
    const description = `All ${loaderData.count} ${loaderData.name} stickers in the Panini World Cup 2026 album, with have, need and duplicate states.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CountryView,
  notFoundComponent: CountryNotFound,
});

function CountryNotFound() {
  return (
    <AppShell title="Country not found">
      <p className="text-sm text-muted-foreground">
        That country isn't part of this album checklist.
      </p>
      <Link to="/album" className="mt-4 inline-block text-sm font-semibold text-primary">
        Back to My Album
      </Link>
    </AppShell>
  );
}

function CountryView() {
  const { country: slug } = Route.useParams();
  const country = countryBySlug(slug);
  const { inventory, setOwned, setWanted, addDuplicate, lockedStickerIds } = useStore();

  if (!country) return <CountryNotFound />;

  const items = country.stickers.map((sticker) => ({
    sticker,
    item: inventory.find((i) => i.stickerId === sticker.id),
  }));
  const owned = items.filter((r) => (r.item?.quantityOwned ?? 0) > 0).length;
  const dupes = items.reduce((n, r) => n + (r.item?.quantityAvailableForTrade ?? 0), 0);

  return (
    <AppShell
      title={`${country.flag} ${country.name}`}
      subtitle={`${owned} / ${country.stickers.length} collected · ${dupes} duplicates`}
      action={<ProgressMeter value={(owned / country.stickers.length) * 100} />}
    >
      <Link
        to="/album"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden /> All countries
      </Link>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map(({ sticker, item }) =>
          item ? (
            <StickerTile
              key={sticker.id}
              sticker={sticker}
              item={item}
              locked={lockedStickerIds.has(sticker.id)}
              onSetOwned={(qty) => setOwned(sticker.id, qty)}
              onSetWanted={(w) => setWanted(sticker.id, w)}
              onAddDuplicate={() => addDuplicate(sticker.id)}
            />
          ) : null,
        )}
      </div>
    </AppShell>
  );
}
