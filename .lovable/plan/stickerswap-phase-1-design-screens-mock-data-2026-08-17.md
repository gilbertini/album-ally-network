# StickerSwap — Phase 1: Design & Screens (mock data)

No buying. No selling. Just trading.

This first pass builds every core screen with realistic mock data, so we lock the look and the flows before wiring accounts, payments, and the database. Nothing is charged and nothing is stored yet.

## Visual direction

"Kickoff Bright": clean light UI, cobalt blue `#1B4CE0` primary, hot coral `#FF4D5E` accent for NEED/alerts, near-black text. Rounded cards, progress meters, big sticker tiles with country flags, restrained micro-interactions. Mobile-first with a bottom tab bar; desktop widens to a centered column plus grid.

## Screens in this phase

1. **Home / landing** (`/`) — hero with tagline, "Join for $5" and "See How It Works", then the 4-step explainer (Build Your Album, Find Matches, Trade, Complete the Album).
2. **Onboarding** — 4 steps: create account (UI only), $5 membership step (UI only), pick I HAVE / I NEED, then the payoff screen: "🎯 27 Trade Matches Found — 18 collectors have stickers you need, 9 have mutual matches right now" with "Find My Best Trade".
3. **Dashboard** — album progress (643 / 980, 65.6%), Missing / Duplicates counts, Best Matches cards with match %, their stickers / your stickers, "Build Trade".
4. **My Album** — filter by country, code, missing, owned, duplicates; per-sticker Need / Have / Duplicate +1 controls with quantity stepper.
5. **Country view** — e.g. Argentina, 14/20 collected, sticker grid with obvious HAVE / NEED / 2 DUPLICATES states.
6. **Matches feed** — card-based, swipe-friendly: collector, location, rating, completed trades, THEY HAVE / YOU HAVE sticker rows, "Possible Trade: 4 ↔ 3", Build Trade + View Collector.
7. **Build Trade** — You Send (max 5) / You Receive (max 5) pickers with the 5-per-side cap enforced in the UI, Send Trade Proposal / Cancel.
8. **Trade detail** — incoming offer view with Accept / Counter / Decline, status timeline (proposed → … → completed), "Complete this trade for 1 Trade Credit" panel, shipping panel (address revealed only after acceptance, Mark as Shipped, tracking + carrier), "I Received My Stickers", then rating.
9. **Trades list** — active / incoming / completed tabs.
10. **Wallet** — credit balance, packs 5/$5, 10/$10, 25/$25, and a ledger-style history list.
11. **Profile** — username, display name, city/state/country, photo, rating, completed trades, member since, verified email, collector level, completion %, countries completed, streak, achievements.
12. **Notifications** — list for new match, proposal, counter, accepted, shipped, delivered, rating.
13. **Search** — sticker code / player / country, showing "184 collectors have duplicates · 23 are mutual matches for you", mutual matches first.
14. **Trade chat** — lightweight message thread inside a trade.

Bottom nav: Home, Album, Matches, Trades, Profile, with the credit balance shown subtly in the header.

## Sticker data in this phase

You're uploading the Panini 2026 Markdown checklist next. Plan:

- Write the parser utility now (`src/lib/checklist/parse.ts`): headings → country/section, then sticker code, name, and category (`player` / `emblem` / `team_photo` / `world_cup`), producing the documented sticker object shape plus an album field.
- Include a count validation that errors if the album doesn't yield the expected 980 base stickers.
- Album-agnostic by design so Copa América, Euro, Pokémon, or card checklists can be added later.
- Until your file lands, screens run on a generated mock subset (a handful of countries) so the UI is real and swappable; when you upload, I re-run the parser against the real file and the whole app picks it up.

## Matching engine in this phase

Implemented as a pure client-side function against mock collectors, so the real behavior is visible now: mutual match only when each side has something the other needs; score from reciprocal counts, boosted by same state / metro / country, collector rating, and trade history. Never any monetary value.

## Explicitly deferred to phase 2

Accounts (email/Google/Apple), the database with row-level security, real Stripe checkout for the $5 membership and credit packs, the credit ledger, notifications delivery, reports/blocking, and the admin dashboard. I'll set these up with Lovable's built-in Stripe (no Stripe account needed, test mode first) once the screens are approved.

## Technical notes

- TanStack Start + React + TypeScript + Tailwind (this project's stack; equivalent to the Next.js request).
- One route file per screen under `src/routes/`, each with its own page metadata.
- Reusable components: `StickerTile`, `StickerGrid`, `ProgressMeter`, `MatchCard`, `CollectorBadge`, `CreditPill`, `TradeStatusTimeline`, `BottomNav`.
- Domain types in `src/lib/types.ts` (sticker, user sticker inventory, trade, trade item, ledger entry) matching the shapes in your spec, so phase 2 maps 1:1 onto database tables.
- Mock data isolated in `src/mocks/` so it can be deleted cleanly when the backend lands.
