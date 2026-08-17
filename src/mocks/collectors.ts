import { stickers } from "@/lib/album";
import type { Collector, UserSticker } from "@/lib/types";

/** Deterministic PRNG so mock inventories are stable across renders/SSR. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export const me: Collector = {
  id: "u_me",
  username: "gilcollects",
  displayName: "Gil Ramirez",
  city: "Austin",
  state: "TX",
  zip: "78704",
  country: "United States",
  avatar: "GR",
  flag: "🇺🇸",
  rating: 4.9,
  completedTrades: 37,
  cancelledTrades: 1,
  disputedTrades: 0,
  successRate: 98,
  memberSince: "August 2026",
  emailVerified: true,
  isMember: true,
  level: "Super Collector",
  streak: 12,
};

const others: Omit<Collector, "level" | "streak">[] = [
  { id: "u_carlos", username: "carlos_10", displayName: "Carlos Mendez", city: "Houston", state: "TX", zip: "77002", country: "United States", avatar: "CM", flag: "🇺🇸", rating: 4.9, completedTrades: 41, cancelledTrades: 0, disputedTrades: 0, successRate: 99, memberSince: "August 2026", emailVerified: true, isMember: true },
  { id: "u_maya", username: "mayaswaps", displayName: "Maya Chen", city: "Austin", state: "TX", zip: "78745", country: "United States", avatar: "MC", flag: "🇺🇸", rating: 4.8, completedTrades: 26, cancelledTrades: 1, disputedTrades: 0, successRate: 96, memberSince: "August 2026", emailVerified: true, isMember: true },
  { id: "u_dani", username: "dani.albums", displayName: "Daniela Rossi", city: "Chicago", state: "IL", zip: "60614", country: "United States", avatar: "DR", flag: "🇺🇸", rating: 5, completedTrades: 18, cancelledTrades: 0, disputedTrades: 0, successRate: 100, memberSince: "August 2026", emailVerified: true, isMember: true },
  { id: "u_tomas", username: "tomas_wc", displayName: "Tomas Alvarez", city: "Monterrey", state: "NL", zip: "64000", country: "Mexico", avatar: "TA", flag: "🇲🇽", rating: 4.7, completedTrades: 33, cancelledTrades: 2, disputedTrades: 1, successRate: 92, memberSince: "August 2026", emailVerified: true, isMember: true },
  { id: "u_priya", username: "priyapanini", displayName: "Priya Nair", city: "Dallas", state: "TX", zip: "75201", country: "United States", avatar: "PN", flag: "🇺🇸", rating: 4.6, completedTrades: 9, cancelledTrades: 0, disputedTrades: 0, successRate: 95, memberSince: "August 2026", emailVerified: true, isMember: true },
  { id: "u_leo", username: "leo.stickers", displayName: "Leo Bakker", city: "Toronto", state: "ON", zip: "M5V", country: "Canada", avatar: "LB", flag: "🇨🇦", rating: 4.9, completedTrades: 22, cancelledTrades: 0, disputedTrades: 0, successRate: 98, memberSince: "August 2026", emailVerified: true, isMember: true },
  { id: "u_sofia", username: "sofia_ars", displayName: "Sofia Duarte", city: "Miami", state: "FL", zip: "33130", country: "United States", avatar: "SD", flag: "🇺🇸", rating: 4.8, completedTrades: 14, cancelledTrades: 1, disputedTrades: 0, successRate: 94, memberSince: "August 2026", emailVerified: true, isMember: true },
  { id: "u_ken", username: "kenjitrades", displayName: "Kenji Sato", city: "Seattle", state: "WA", zip: "98101", country: "United States", avatar: "KS", flag: "🇺🇸", rating: 4.5, completedTrades: 6, cancelledTrades: 0, disputedTrades: 0, successRate: 93, memberSince: "August 2026", emailVerified: true, isMember: true },
  { id: "u_ade", username: "ade9", displayName: "Ade Okafor", city: "Atlanta", state: "GA", zip: "30303", country: "United States", avatar: "AO", flag: "🇺🇸", rating: 4.9, completedTrades: 29, cancelledTrades: 0, disputedTrades: 0, successRate: 99, memberSince: "August 2026", emailVerified: true, isMember: true },
  { id: "u_marta", username: "martaesp", displayName: "Marta Ibanez", city: "Madrid", state: "MD", zip: "28001", country: "Spain", avatar: "MI", flag: "🇪🇸", rating: 4.7, completedTrades: 12, cancelledTrades: 0, disputedTrades: 0, successRate: 97, memberSince: "August 2026", emailVerified: true, isMember: true },
  { id: "u_owen", username: "owen_eng", displayName: "Owen Clarke", city: "Phoenix", state: "AZ", zip: "85004", country: "United States", avatar: "OC", flag: "🇺🇸", rating: 4.4, completedTrades: 4, cancelledTrades: 1, disputedTrades: 0, successRate: 90, memberSince: "August 2026", emailVerified: true, isMember: true },
  { id: "u_ines", username: "ines.por", displayName: "Ines Cardoso", city: "San Antonio", state: "TX", zip: "78205", country: "United States", avatar: "IC", flag: "🇺🇸", rating: 5, completedTrades: 31, cancelledTrades: 0, disputedTrades: 0, successRate: 100, memberSince: "August 2026", emailVerified: true, isMember: true },
  { id: "u_hugo", username: "hugofr", displayName: "Hugo Lemaire", city: "Denver", state: "CO", zip: "80202", country: "United States", avatar: "HL", flag: "🇺🇸", rating: 4.6, completedTrades: 17, cancelledTrades: 0, disputedTrades: 1, successRate: 94, memberSince: "August 2026", emailVerified: true, isMember: true },
  { id: "u_nadia", username: "nadia_dupes", displayName: "Nadia Haddad", city: "Newark", state: "NJ", zip: "07102", country: "United States", avatar: "NH", flag: "🇺🇸", rating: 4.8, completedTrades: 21, cancelledTrades: 0, disputedTrades: 0, successRate: 97, memberSince: "August 2026", emailVerified: true, isMember: true },
];

function levelFor(trades: number): Collector["level"] {
  if (trades >= 40) return "Album Legend";
  if (trades >= 30) return "Master Collector";
  if (trades >= 20) return "Super Collector";
  if (trades >= 5) return "Collector";
  return "Rookie Collector";
}

export const collectors: Collector[] = others.map((c, i) => ({
  ...c,
  level: levelFor(c.completedTrades),
  streak: 3 + ((i * 5) % 11),
}));

export const allCollectors = [me, ...collectors];

function generateInventory(userId: string, seed: number, ownRate: number): UserSticker[] {
  const rand = rng(seed);
  return stickers.map((s) => {
    const owns = rand() < ownRate;
    const dupes = owns && rand() < 0.1 ? 1 + Math.floor(rand() * 2) : 0;
    const quantityOwned = owns ? 1 + dupes : 0;
    return {
      stickerId: s.id,
      userId,
      quantityOwned,
      quantityAvailableForTrade: dupes,
      wanted: !owns,
    };
  });
}

export const myInventory = generateInventory(me.id, 20260617, 0.656);

export const otherInventories = new Map(
  collectors.map((c, i) => [
    c.id,
    generateInventory(c.id, 9000 + i * 7717, 0.45 + ((i * 3) % 7) / 20),
  ]),
);
