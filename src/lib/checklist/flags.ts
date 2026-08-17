/**
 * Team-code → flag emoji lookup. Data only — the parser stays album-agnostic
 * and falls back to a trophy for non-team sections (FWC, publisher intros).
 */
export const TEAM_FLAGS: Record<string, string> = {
  ALG: "🇩🇿", ARG: "🇦🇷", AUS: "🇦🇺", AUT: "🇦🇹", BEL: "🇧🇪", BIH: "🇧🇦",
  BRA: "🇧🇷", CAN: "🇨🇦", CIV: "🇨🇮", COD: "🇨🇩", COL: "🇨🇴", CPV: "🇨🇻",
  CRO: "🇭🇷", CUW: "🇨🇼", CZE: "🇨🇿", ECU: "🇪🇨", EGY: "🇪🇬", ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  ESP: "🇪🇸", FRA: "🇫🇷", GER: "🇩🇪", GHA: "🇬🇭", HAI: "🇭🇹", IRN: "🇮🇷",
  IRQ: "🇮🇶", JOR: "🇯🇴", JPN: "🇯🇵", KOR: "🇰🇷", KSA: "🇸🇦", MAR: "🇲🇦",
  MEX: "🇲🇽", NED: "🇳🇱", NOR: "🇳🇴", NZL: "🇳🇿", PAN: "🇵🇦", PAR: "🇵🇾",
  POR: "🇵🇹", QAT: "🇶🇦", RSA: "🇿🇦", SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", SEN: "🇸🇳", SUI: "🇨🇭",
  SWE: "🇸🇪", TUN: "🇹🇳", TUR: "🇹🇷", URU: "🇺🇾", USA: "🇺🇸", UZB: "🇺🇿",
};

export const FALLBACK_FLAG = "🏆";

export function flagForCode(code: string): string {
  return TEAM_FLAGS[code] ?? FALLBACK_FLAG;
}
