# Repaint StickerSwap in the official World Cup 2026 colors

Your uploaded palette becomes the app's official color set. Every screen picks it up at once, because all colors in the app come from one shared list.

## The colors I'll use

Taken directly from your image:

- Electric blue `#304FFF` — main buttons, links, progress bars, active tab
- Deep navy `#1A247D` — headlines and dark surfaces
- Magenta `#E81F63` — "NEED" stickers, alerts, match percentage badges
- Green `#00C752` — "HAVE" / owned stickers, completed trades
- Lime `#B1EB00` — "DUPLICATE" counters and achievement highlights
- Mint `#63FFD8` — subtle highlight behind big moments (match reveal, album complete)
- Violet `#6101EB` — collector levels and gamification accents
- Black / white — text and page background

Dark mode gets the same colors, brightened so they stay readable on navy.

## What changes on screen

1. **Everywhere at once**: buttons, tabs, cards, progress meters, bottom navigation and the credit chip switch to the new blue/navy scheme.
2. **Sticker states get clearer**: HAVE = green, NEED = magenta, DUPLICATES = lime, so the album grid reads at a glance.
3. **Home hero**: navy-to-blue field with a mint glow behind "No buying. No selling. Just trading." and a magenta "Join for $5" button.
4. **Match cards**: match percentage in a magenta-to-violet badge, "Build Trade" in electric blue.
5. **Match reveal moment** (after you enter your haves and needs): mint and lime burst behind the "27 Trade Matches Found" number.
6. **Collector levels**: each level gets its own palette color, Rookie through Album Legend.

## Notes

- Colors are defined once as design tokens in the shared stylesheet (light and dark values), so future albums or a rebrand only touch that one place.
- Contrast is checked on the bright colors — lime and mint always sit under dark text, never white.
- No layout, wording, data or trade logic changes; this is purely the look.
