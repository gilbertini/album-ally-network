# Import the real 980-sticker checklist

Swap the placeholder sticker subset for the authoritative Panini FIFA World Cup 2026 checklist you pasted, so every screen (album, country views, search, matching) runs on the real 980 stickers, 48 teams, and the FWC/We Are Panini sections.

## What changes for you

- **My Album** shows all 48 countries with real 20-sticker sections and true progress (e.g. `643 / 980 collected`).
- **Country view** shows real names — ARG17 Lionel Messi, USA16 Christian Pulisic, POR15 Cristiano Ronaldo.
- **Search** finds real players and codes.
- **Matches** are computed across the full album, so match cards and the "X Trade Matches Found" moment use real stickers.
- The importer **validates the 980 count** and shows a clear in-app error banner if a future checklist doesn't match.

## Technical notes

1. **`src/data/checklist-2026.ts`** — replace the placeholder Markdown string with your full checklist verbatim (980 rows, 50 headings). Kept as the single swappable data source.
2. **`src/lib/checklist/parse.ts`** — extend the row parser for this Markdown flavour, keeping it album-agnostic:
   - accept task-list checkboxes: `- [ ]` / `- [x]`
   - accept bolded codes: `**MEX1**`
   - keep existing separators (`—`, `-`, `:`, `|`)
   - skip blockquote/metadata lines (`> This checklist covers…`, `**Total base stickers: 980**`) and horizontal rules so they never become stickers
   - derive `countryCode` from the code prefix (MEX, RSA, FWC) since headings carry no `(CODE)` hint
   - categorisation: `Emblem` → `emblem`, `Team Photo` → `team_photo`, the `FIFA World Cup` + `We Are Panini` sections → `world_cup`, everything else → `player`
3. **Country flags** — add a `countryCode → flag emoji` lookup (`src/lib/checklist/flags.ts`) covering all 48 teams plus a 🏆 fallback for FWC/Panini, and apply it in the parser when a heading has no flag. Keeps parser generic; map is data.
4. **`src/lib/album.ts`** — set `CHECKLIST_IS_COMPLETE = true` so `expectedBaseCount: 980` validation runs. Surface `album.errors` as a dismissible warning strip in My Album instead of failing silently.
5. **`src/mocks/collectors.ts`** — mock inventories are generated from `stickers`, so they scale automatically; retune the ownership/duplicate probabilities so a full album yields realistic numbers (~65% collected, ~90 duplicates) rather than being uniformly sparse.
6. **Perf check** — verify the album grid and matching engine still feel instant at 980 stickers; memoise the per-country slices and match computation if any screen lags.

Sticker artwork stays as coded placeholders (code + flag tiles); no monetary values anywhere.
