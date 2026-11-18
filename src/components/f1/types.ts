export interface DriverInfo {
  code: string
  name: string
  team: string
  colour: string
}

/** One race's lap chart, as written by scripts/f1/analyse.mjs. */
export interface LapChartData {
  /** Official event name, e.g. "Bahrain Grand Prix". */
  name: string
  /** Circuit location, e.g. "Kuala Lumpur". */
  race: string
  country: string
  date: string
  drivers: Record<string, DriverInfo>
  /** columns[L] = driver numbers in order at the end of lap L; L = 0 is the grid. */
  columns: number[][]
  /** gaps[L][i] = seconds behind the leader for columns[L][i] (lead-lap drivers only). */
  gaps: number[][]
  /** Driver number -> laps on which they entered the pits. */
  pits: Record<string, number[]>
  /** Periods under a safety car, virtual safety car or red flag. */
  neutralised: { from: number; to: number; kind: 'SC' | 'VSC' | 'Red' }[]
  /** Driver number -> laps completed, for drivers who didn't finish. */
  retired: Record<string, number>
  onTrackByLap: number[]
}

/**
 * For each driver, the laps L where their move from lap L-1 to L came only
 * from pit stops: every driver they swapped places with (or they themselves)
 * pitted on lap L-1 or L. Same rule as scripts/f1/analyse.mjs.
 */
export function pitOnlyMoves(data: LapChartData): Map<number, Set<number>> {
  const pitted = (d: number, L: number) => {
    const laps = data.pits[d] ?? []
    return laps.includes(L - 1) || laps.includes(L)
  }
  const result = new Map<number, Set<number>>()
  for (let L = 2; L < data.columns.length; L++) {
    const prev = new Map(data.columns[L - 1].map((d, i) => [d, i]))
    const cur = data.columns[L].filter((d) => prev.has(d))
    const swaps = new Map<number, { pit: number; other: number }>()
    for (let i = 0; i < cur.length; i++) {
      for (let j = i + 1; j < cur.length; j++) {
        const [a, b] = [cur[i], cur[j]]
        if (prev.get(a)! < prev.get(b)!) continue
        const kind = pitted(a, L) || pitted(b, L) ? 'pit' : 'other'
        for (const d of [a, b]) {
          const s = swaps.get(d) ?? { pit: 0, other: 0 }
          s[kind]++
          swaps.set(d, s)
        }
      }
    }
    for (const [d, s] of swaps) {
      if (s.pit > 0 && s.other === 0) {
        if (!result.has(d)) result.set(d, new Set())
        result.get(d)!.add(L)
      }
    }
  }
  return result
}

/** OpenF1 writes surnames in capitals ("George RUSSELL"); return "George Russell". */
export function displayName(name: string): string {
  return name.replace(/\b(\p{Lu})(\p{Lu}+)\b/gu, (_, first: string, rest: string) => first + rest.toLowerCase())
}

/** Second driver in each team (higher car number) gets a dashed line. */
export function dashedDrivers(data: LapChartData): Set<number> {
  const byTeam = new Map<string, number[]>()
  for (const [n, d] of Object.entries(data.drivers)) {
    byTeam.set(d.team, [...(byTeam.get(d.team) ?? []), Number(n)])
  }
  const dashed = new Set<number>()
  for (const numbers of byTeam.values()) {
    numbers.sort((a, b) => a - b).slice(1).forEach((n) => dashed.add(n))
  }
  return dashed
}
