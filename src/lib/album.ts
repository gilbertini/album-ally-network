import { WORLD_CUP_2026_CHECKLIST_MD } from "@/data/checklist-2026";
import { parseChecklist } from "@/lib/checklist/parse";
import type { Sticker } from "@/lib/types";

export const ALBUM_NAME = "Panini FIFA World Cup 2026";
export const EXPECTED_BASE_COUNT = 980;
export const EXPECTED_TOTAL_COUNT = 992;

/**
 * The authoritative 992-sticker USA & Canada checklist is in src/data/checklist-2026.ts, so
 * the hard count validation runs. Set to false only while staging a partial
 * checklist for a new album.
 */
export const CHECKLIST_IS_COMPLETE = true;

export const album = parseChecklist(WORLD_CUP_2026_CHECKLIST_MD, {
  album: ALBUM_NAME,
  ...(CHECKLIST_IS_COMPLETE ? { expectedBaseCount: EXPECTED_TOTAL_COUNT } : {}),
});

export const stickers: Sticker[] = album.stickers;
export const stickerById = new Map(stickers.map((s) => [s.id, s]));
export const importErrors: string[] = album.errors;

export interface CountrySection {
  name: string;
  slug: string;
  flag: string;
  code: string;
  stickers: Sticker[];
}

export const countries: CountrySection[] = album.countries.map((name) => {
  const list = stickers.filter((s) => s.country === name);
  return {
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    flag: list[0]?.flag ?? "🏳️",
    code: list[0]?.countryCode ?? "",
    stickers: list,
  };
});

export function countryBySlug(slug: string) {
  return countries.find((c) => c.slug === slug);
}

export function searchStickers(query: string, limit = 40): Sticker[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return stickers
    .filter(
      (s) =>
        s.code.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q),
    )
    .slice(0, limit);
}
