import fs from "node:fs";

export function parseChecklistSource(source) {
  const markdown = source.match(/\x60([\s\S]*?)\x60;/)?.[1];
  if (!markdown) throw new Error("Checklist template literal not found.");

  const rows = [];
  let section = "General";
  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trim();
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      section = heading[1].replace(/\s+\([A-Z]{2,5}\)$/, "");
      continue;
    }
    const row = line.match(/^- \[ \] \*\*([A-Z]{2,5}\d{1,4}|\d{1,4})\*\*\s+—\s+(.+)$/);
    if (!row) continue;
    const code = row[1];
    rows.push({
      code,
      name: row[2],
      section,
      editionId: code.startsWith("CC") ? "north-america-coca-cola" : "international-core",
    });
  }
  return rows;
}

export function validate(rows) {
  const errors = [];
  const codes = new Set();
  for (const row of rows) {
    if (codes.has(row.code)) errors.push(`Duplicate code: ${row.code}`);
    codes.add(row.code);
  }
  const core = rows.filter((row) => row.editionId === "international-core");
  const cocaCola = rows.filter((row) => row.editionId === "north-america-coca-cola");
  const teams = new Map();
  for (const row of core.filter((item) => /^[A-Z]{3}\d+$/.test(item.code))) {
    teams.set(row.section, (teams.get(row.section) ?? 0) + 1);
  }
  if (rows.length !== 992) errors.push(`Expected 992 records, found ${rows.length}.`);
  if (core.length !== 980) errors.push(`Expected 980 core records, found ${core.length}.`);
  if (cocaCola.length !== 12) errors.push(`Expected 12 Coca-Cola records, found ${cocaCola.length}.`);
  if (teams.size !== 48) errors.push(`Expected 48 teams, found ${teams.size}.`);
  for (const [team, count] of teams) {
    if (count !== 20) errors.push(`${team} has ${count} records; expected 20.`);
  }
  return { valid: errors.length === 0, errors, counts: { total: rows.length, core: core.length, cocaCola: cocaCola.length, teams: teams.size } };
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll("\\", "/"))) {
  const source = fs.readFileSync(new URL("../src/data/checklist-2026.ts", import.meta.url), "utf8");
  const result = validate(parseChecklistSource(source));
  console.log(JSON.stringify(result, null, 2));
  if (!result.valid) process.exitCode = 1;
}
