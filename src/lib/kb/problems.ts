// What a big ticket really holds. Counts follow the desk's own view (causes.ts, by tenant), like
// CauseTable. Reports the desk read as a one-day move (desk-notes.json) are a problem of their own:
// they stay counted where the desk files them and get their own row as well.
import { causeOf, uniqueById, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'one-day' | 'unplaced';

export type ProblemGroup = {
  problem: Problem;
  reports: number;
  tenants: string[];
  channels: Record<string, number>;
  firstSeen: string;
  lastSeen: string;
  // The problem the desk files these reports under (they are counted there too).
  alsoIn?: Problem;
};

export function splitTicket(
  all: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { total: number; exportRows: number; groups: ProblemGroup[] } {
  const merged = uniqueById(all).filter((r) => r.mergedInto === ticket);
  const by = new Map<Problem, Report[]>();
  for (const r of merged) {
    const p: Problem = causeOf(r, tenantOf(r)) ?? 'unplaced';
    by.set(p, [...(by.get(p) ?? []), r]);
  }
  const moved = merged.filter((r) => oneDayMove.includes(r.id));
  const filedAs = [...new Set(moved.map((r) => causeOf(r, tenantOf(r)) ?? 'unplaced'))];
  const groups = [...by.entries(), ...(moved.length ? [['one-day', moved] as [Problem, Report[]]] : [])]
    .map(([problem, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        problem,
        reports: rs.length,
        tenants: [...new Set(rs.map((r) => r.tenant))].sort(),
        channels: rs.reduce<Record<string, number>>((n, r) => ({ ...n, [r.channel]: (n[r.channel] ?? 0) + 1 }), {}),
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
        alsoIn: problem === 'one-day' && filedAs.length === 1 ? filedAs[0] : undefined,
      };
    })
    .sort((a, b) => b.reports - a.reports);
  return { total: merged.length, exportRows: all.filter((r) => r.mergedInto === ticket).length, groups };
}
