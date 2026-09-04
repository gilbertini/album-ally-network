import type { Album, Sticker, StickerCategory } from "@/lib/types";
import { flagForCode } from "@/lib/checklist/flags";

/**
 * Album-agnostic checklist importer.
 *
 * Expected Markdown shape (works for World Cup, Copa America, Euro, Pokemon,
 * sports cards — any checklist that groups codes under section headings):
 *
 *   ## Argentina 🇦🇷 (ARG)
 *   - ARG1 — Team Emblem
 *   - [ ] **ARG2** — Team Photo
 *   - [x] ARG17 — Lionel Messi
 *
 *   ## FIFA World Cup
 *   - WC1 — FIFA World Cup Trophy
 *
 * Separators accepted between code and name: `—`, `-`, `–`, `:`, `|`, tab.
 */

export interface ParsedChecklist extends Album {
  countries: string[];
  errors: string[];
}

const HEADING = /^#{1,6}\s+(.*)$/;
const ROW =
  /^(?:[-*+]\s+)?(?:\[[ xX]?\]\s*)?(?:\|\s*|\d+\.\s+)?\*{0,2}([A-Z]{2,5}\d{1,4}|\d{1,4})\*{0,2}\s*(?:—|–|-|:|\||\t)\s*(.+?)\s*\|?\s*$/;
const FLAG_IN_HEADING = /\p{Regional_Indicator}{2}/u;
const CODE_IN_HEADING = /\(([A-Z]{2,5})\)/;
/** Blockquotes, horizontal rules and metadata lines are never stickers. */
const IGNORED_LINE = /^(?:>|-{3,}$|\*{3,}$|_{3,}$)/;

function categorize(name: string, section: string): StickerCategory {
  if (/coca-cola|coca cola/i.test(section)) return "coca_cola";
  const n = name.toLowerCase();
  // Section wins for non-team sections: "Official Emblem" inside a
  // tournament/publisher section is a world-cup sticker, not a team emblem.
  if (/world cup|trophy|special|intro|we are|panini/i.test(section)) return "world_cup";
  if (/emblem|badge|crest|logo/.test(n)) return "emblem";
  if (/team photo|squad photo|team picture/.test(n)) return "team_photo";
  if (/world cup|trophy|tournament|host cit|mascot|ball|stadium|poster/.test(n)) {
    return "world_cup";
  }
  if (/world cup|trophy|special|intro/i.test(section)) return "world_cup";
  return "player";
}

function cleanHeading(raw: string) {
  const flag = raw.match(FLAG_IN_HEADING)?.[0] ?? "";
  const codeMatch = raw.match(CODE_IN_HEADING)?.[1] ?? "";
  const name = raw
    .replace(FLAG_IN_HEADING, "")
    .replace(CODE_IN_HEADING, "")
    .replace(/[*_`#]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return { name, flag, codeHint: codeMatch };
}

export function parseChecklist(
  markdown: string,
  options: { album: string; expectedBaseCount?: number } = { album: "Unknown album" },
): ParsedChecklist {
  const stickers: Sticker[] = [];
  const errors: string[] = [];
  const seen = new Set<string>();
  const countries: string[] = [];

  let section = "General";
  let flag = "";
  let codeHint = "";

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (IGNORED_LINE.test(line)) continue;

    const heading = line.match(HEADING);
    if (heading?.[1]) {
      const parsed = cleanHeading(heading[1]);
      section = parsed.name || section;
      flag = parsed.flag;
      codeHint = parsed.codeHint;
      if (!countries.includes(section)) countries.push(section);
      continue;
    }

    const row = line.match(ROW);
    if (!row?.[1] || !row[2]) continue;
    const code = row[1];
    const name = row[2].replace(/[*_`]/g, "").trim();
    if (!name || /^-+$/.test(name) || /^name$/i.test(name)) continue;

    if (seen.has(code)) {
      errors.push(`Duplicate sticker code "${code}" in section "${section}".`);
      continue;
    }
    seen.add(code);

    const countryCode = codeHint || code.replace(/\d+$/, "");
    stickers.push({
      id: `${options.album}:${code}`.toLowerCase().replace(/\s+/g, "-"),
      code,
      name,
      country: section,
      countryCode,
      flag: flag || flagForCode(countryCode),
      category: categorize(name, section),
      album: options.album,
      editionId: code.startsWith("CC") ? "north-america-coca-cola" : "international-core",
      number: stickers.length + 1,
    });
  }

  if (
    typeof options.expectedBaseCount === "number" &&
    stickers.length !== options.expectedBaseCount
  ) {
    errors.push(
      `Expected ${options.expectedBaseCount} base stickers but parsed ${stickers.length}. Check the checklist source before importing.`,
    );
  }

  return {
    id: options.album.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: options.album,
    expectedBaseCount: options.expectedBaseCount ?? stickers.length,
    stickers,
    countries: countries.filter((c) => stickers.some((s) => s.country === c)),
    errors,
  };
}
