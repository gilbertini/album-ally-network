import type { CollectorLevel } from "@/lib/types";

/**
 * Collector levels are earned through completed trades only — never purchased.
 * Each level maps to a colour from the official World Cup 2026 palette.
 */
export const levelStyles: Record<CollectorLevel, string> = {
  "Rookie Collector": "bg-secondary text-secondary-foreground",
  Collector: "bg-primary/12 text-primary",
  "Super Collector": "bg-violet/15 text-violet",
  "Master Collector": "bg-accent/15 text-accent",
  "Album Legend": "bg-dupe text-dupe-foreground",
};

export function levelClass(level: CollectorLevel): string {
  return levelStyles[level] ?? levelStyles["Rookie Collector"];
}
