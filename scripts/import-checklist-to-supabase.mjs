import fs from "node:fs";
import { parseChecklistSource, validate } from "./validate-checklist.mjs";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
}

const source = fs.readFileSync(new URL("../src/data/checklist-2026.ts", import.meta.url), "utf8");
const rows = parseChecklistSource(source);
const result = validate(rows);
if (!result.valid) throw new Error(result.errors.join("\n"));

const headers = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  "Content-Type": "application/json",
  Prefer: "resolution=merge-duplicates,return=minimal",
};

async function upsert(table, records, onConflict) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`,
    { method: "POST", headers, body: JSON.stringify(records) },
  );
  if (!response.ok) throw new Error(`${table} import failed: ${response.status} ${await response.text()}`);
}

await upsert("albums", [{ id: "panini-fifa-world-cup-2026", name: "Panini FIFA World Cup 2026", core_sticker_count: 980 }], "id");
await upsert("album_editions", [
  { id: "international-core", album_id: "panini-fifa-world-cup-2026", name: "International core", region: "GLOBAL", sticker_count: 980 },
  { id: "north-america-coca-cola", album_id: "panini-fifa-world-cup-2026", name: "Coca-Cola USA & Canada", region: "US-CA", sticker_count: 12 },
], "id");
await upsert("stickers", rows.map((row, index) => ({
  id: `panini-fifa-world-cup-2026:${row.editionId}:${row.code}`.toLowerCase(),
  album_id: "panini-fifa-world-cup-2026",
  edition_id: row.editionId,
  code: row.code,
  name: row.name,
  section: row.section,
  category: row.editionId === "north-america-coca-cola" ? "coca_cola" : (/emblem|badge/i.test(row.name) ? "emblem" : (/team photo/i.test(row.name) ? "team_photo" : (/^FWC|^00$/.test(row.code) ? "world_cup" : "player"))),
  sort_order: index + 1,
  source_url: row.editionId === "north-america-coca-cola"
    ? "https://blog.paniniamerica.net/coca-cola-north-america-and-panini-america-partner-to-bring-iconic-fifa-world-cup-ritual-to-fans-across-the-u-s-and-canada/"
    : "https://www.paninigroup.com/en/ca/wc26pack-contents",
})), "album_id,edition_id,code");

console.log(`Imported ${rows.length} validated sticker records.`);
