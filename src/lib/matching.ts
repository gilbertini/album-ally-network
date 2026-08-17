import type { Collector, UserSticker } from "@/lib/types";

export interface Inventory {
  userId: string;
  items: Map<string, UserSticker>;
}

export interface MatchResult {
  collector: Collector;
  theyHave: string[]; // sticker ids they can give me
  youHave: string[]; // sticker ids I can give them
  mutual: boolean;
  score: number; // 0-100 display match score
  reasons: string[];
}

export function buildInventory(userId: string, items: UserSticker[]): Inventory {
  return { userId, items: new Map(items.map((i) => [i.stickerId, i])) };
}

function needs(inv: Inventory, stickerId: string) {
  const item = inv.items.get(stickerId);
  if (!item) return false;
  return item.wanted && item.quantityOwned === 0;
}

function canGive(inv: Inventory, stickerId: string) {
  const item = inv.items.get(stickerId);
  return !!item && item.quantityAvailableForTrade > 0;
}

/**
 * Matching never considers monetary value — only reciprocal need, proximity and
 * reputation. A pairing is a Mutual Match only when both sides can help.
 */
export function matchCollectors(
  me: { profile: Collector; inventory: Inventory },
  others: { profile: Collector; inventory: Inventory }[],
  allStickerIds: string[],
): MatchResult[] {
  return others
    .filter((o) => o.profile.id !== me.profile.id)
    .map(({ profile, inventory }) => {
      const theyHave = allStickerIds.filter(
        (id) => needs(me.inventory, id) && canGive(inventory, id),
      );
      const youHave = allStickerIds.filter(
        (id) => needs(inventory, id) && canGive(me.inventory, id),
      );

      const mutualAvailable = theyHave.length + youHave.length;
      const reciprocal = Math.min(theyHave.length, youHave.length);
      const reasons: string[] = [];

      let bonus = 0;
      if (profile.state && profile.state === me.profile.state) {
        bonus += 8;
        reasons.push(`Also in ${profile.state}`);
      } else if (profile.country === me.profile.country) {
        bonus += 4;
        reasons.push(`Same country — cheaper shipping`);
      }
      if (profile.city === me.profile.city && profile.city) {
        bonus += 4;
        reasons.push("Same metro area");
      }
      if (profile.rating >= 4.8) {
        bonus += 5;
        reasons.push(`Top rated ${profile.rating.toFixed(1)}★`);
      }
      if (profile.completedTrades >= 20) {
        bonus += 4;
        reasons.push(`${profile.completedTrades} completed trades`);
      }

      const base = reciprocal * 14 + mutualAvailable * 3;
      const score = Math.max(0, Math.min(99, Math.round(base + bonus)));

      return {
        collector: profile,
        theyHave,
        youHave,
        mutual: theyHave.length > 0 && youHave.length > 0,
        score,
        reasons,
      };
    })
    .filter((m) => m.theyHave.length > 0 || m.youHave.length > 0)
    .sort((a, b) => {
      if (a.mutual !== b.mutual) return a.mutual ? -1 : 1;
      return b.score - a.score;
    });
}
