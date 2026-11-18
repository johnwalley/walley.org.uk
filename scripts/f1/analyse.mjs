// Build a lap chart for every cached race and score how well each one shows
// the "bumps chart meets F1" problem: how many position changes are real
// on-track passes, and how many are pit stop or safety car noise.
//
// Usage: node scripts/f1/analyse.mjs [year]
// Reads scripts/f1/.cache/raw/{year}, writes scripts/f1/.cache/processed/{year}.
//
// Position at the end of lap L = order in which drivers crossed the line to
// complete lap L, worked out from lap start timestamps. Drivers who took the
// chequered flag a lap or more down are kept at the bottom of later columns;
// retired drivers drop out.

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const YEAR = Number(process.argv[2] ?? 2026)
const here = path.dirname(fileURLToPath(import.meta.url))
const rawDir = path.join(here, '.cache', 'raw', String(YEAR))
const outDir = path.join(here, '.cache', 'processed', String(YEAR))

const readJson = async (...p) => JSON.parse(await readFile(path.join(...p), 'utf8'))
const t = (iso) => Date.parse(iso)

function neutralisedLaps(raceControl) {
  // Returns { laps: Set of lap numbers under SC/VSC, periods: [{ from, to, kind }], sc, vsc, red }
  const laps = new Set()
  const periods = []
  let sc = 0, vsc = 0, red = 0
  let open = null // { from, kind }
  const msgs = [...raceControl].sort((a, b) => t(a.date) - t(b.date))
  const close = (to) => {
    for (let l = open.from; l <= to; l++) laps.add(l)
    periods.push({ from: open.from, to, kind: open.kind })
    open = null
  }
  let standingStarts = 0
  for (const m of msgs) {
    // Red flags show up as the session being aborted, then restarted.
    if (m.category === 'SessionStatus' && m.message === 'SESSION ABORTED') {
      red++
      open = { from: open?.from ?? m.lap_number, kind: 'Red' }
    }
    if (m.message === 'STANDING START') {
      standingStarts++
      if (open) close(m.lap_number) // restart after a red flag or SC
      else if (standingStarts === 1 && m.lap_number > 1 && !periods.length) {
        // Wet start behind the safety car, then a standing start.
        open = { from: 1, kind: 'SC' }
        close(m.lap_number)
      }
    }
    if (m.category !== 'SafetyCar') continue
    if (/^(SAFETY CAR|VSC) DEPLOYED/.test(m.message)) {
      const kind = m.message.startsWith('VSC') ? 'VSC' : 'SC'
      kind === 'VSC' ? vsc++ : sc++
      if (open) {
        // VSC upgraded straight to a full safety car: close the VSC, open the SC.
        close(m.lap_number - 1)
      }
      open = { from: m.lap_number, kind }
    } else if (/SAFETY CAR IN THIS LAP|VSC ENDING/.test(m.message) && open) {
      close(m.lap_number)
    }
  }
  return { laps, periods, sc, vsc, red }
}

async function analyseRace(session, meetingNames) {
  const dir = path.join(rawDir, String(session.session_key))
  const [drivers, laps, positions, pits, raceControl] = await Promise.all(
    ['drivers', 'laps', 'position', 'pit', 'race_control'].map((e) => readJson(dir, `${e}.json`)),
  )

  // Crossing time at the end of each lap, per driver.
  const lapsByDriver = new Map()
  for (const l of laps) {
    if (!lapsByDriver.has(l.driver_number)) lapsByDriver.set(l.driver_number, new Map())
    lapsByDriver.get(l.driver_number).set(l.lap_number, l)
  }
  // OpenF1's date_start is occasionally off by tens of seconds for a single
  // lap, while lap_duration stays consistent. Each crossing is estimated three
  // ways and the median wins, so one bad timestamp can't make a spike:
  //   a) start of the next lap
  //   b) start of this lap + its duration
  //   c) previous crossing + this lap's duration
  const median = (xs) => [...xs].sort((p, q) => p - q)[Math.floor(xs.length / 2)]
  const crossings = new Map() // driver -> [time at end of lap 1, lap 2, ...]
  for (const [d, byLap] of lapsByDriver) {
    const maxLap = Math.max(...byLap.keys())
    const times = []
    for (let L = 1; L <= maxLap; L++) {
      const cur = byLap.get(L)
      const dur = cur?.lap_duration ? cur.lap_duration * 1000 : null
      const next = byLap.get(L + 1)?.date_start
      const a = next ? t(next) : null
      const b = cur?.date_start && dur ? t(cur.date_start) + dur : null
      const c = times.length && dur ? times.at(-1) + dur : null
      const candidates = [a, b, c].filter((v) => v != null)
      const end = candidates.length === 3 ? median(candidates) : (c ?? a ?? b)
      if (end == null) break
      if (times.length && end <= times.at(-1)) break // corrupt or out of order
      times.push(end)
    }
    crossings.set(d, times)
  }

  const raceStart = Math.min(...laps.filter((l) => l.lap_number === 1 && l.date_start).map((l) => t(l.date_start)))
  const leaderLaps = Math.max(...[...crossings.values()].map((x) => x.length))
  const winner = [...crossings].filter(([, x]) => x.length === leaderLaps).sort((a, b) => a[1].at(-1) - b[1].at(-1))[0]
  const chequer = winner[1].at(-1)
  const tookFlag = (d) => (crossings.get(d)?.at(-1) ?? 0) >= chequer

  // Grid: last position reported before the start.
  const grid = new Map()
  for (const p of [...positions].sort((a, b) => t(a.date) - t(b.date))) {
    if (t(p.date) < raceStart) grid.set(p.driver_number, p.position)
  }
  const gridOrder = [...grid].sort((a, b) => a[1] - b[1]).map(([d]) => d)

  // columns[L] = driver numbers in order at the end of lap L (L = 0 is the grid).
  const columns = [gridOrder]
  const gaps = [gridOrder.map(() => 0)]
  for (let L = 1; L <= leaderLaps; L++) {
    const done = [...crossings].filter(([, x]) => x.length >= L).sort((a, b) => a[1][L - 1] - b[1][L - 1])
    const lapped = [...crossings]
      .filter(([d, x]) => x.length < L && tookFlag(d))
      .sort((a, b) => b[1].length - a[1].length || a[1].at(-1) - b[1].at(-1))
    columns.push([...done, ...lapped].map(([d]) => d))
    const leaderTime = done[0][1][L - 1]
    gaps.push(done.map(([, x]) => +((x[L - 1] - leaderTime) / 1000).toFixed(3)))
  }

  // Cross-check the final column against OpenF1's last reported positions.
  const lastPos = new Map()
  for (const p of [...positions].sort((a, b) => t(a.date) - t(b.date))) lastPos.set(p.driver_number, p.position)
  const final = columns.at(-1)
  const mismatches = final.filter((d, i) => lastPos.get(d) !== i + 1).length

  // Classify every pairwise swap between consecutive columns.
  const pitLaps = new Map()
  for (const p of pits) {
    if (!pitLaps.has(p.driver_number)) pitLaps.set(p.driver_number, new Set())
    pitLaps.get(p.driver_number).add(p.lap_number)
  }
  const pitAffected = (d, T) => pitLaps.get(d)?.has(T - 1) || pitLaps.get(d)?.has(T)
  const neutral = neutralisedLaps(raceControl)

  const swaps = { start: 0, onTrack: 0, pit: 0, neutralised: 0 }
  const onTrackByLap = []
  for (let T = 1; T < columns.length; T++) {
    const prev = new Map(columns[T - 1].map((d, i) => [d, i]))
    const cur = columns[T].filter((d) => prev.has(d))
    let lapOnTrack = 0
    for (let i = 0; i < cur.length; i++) {
      for (let j = i + 1; j < cur.length; j++) {
        const [a, b] = [cur[i], cur[j]]
        if (prev.get(a) < prev.get(b)) continue // same order as before
        if (T === 1) swaps.start++
        else if (pitAffected(a, T) || pitAffected(b, T)) swaps.pit++
        else if (neutral.laps.has(T)) swaps.neutralised++
        else (swaps.onTrack++, lapOnTrack++)
      }
    }
    onTrackByLap.push(lapOnTrack)
  }
  // Data-quality check: a car that drops or gains 3+ places for exactly one
  // lap, with no pit stop nearby, is almost certainly a timing glitch.
  let spikes = 0
  for (let L = 2; L < columns.length - 1; L++) {
    for (const d of columns[L]) {
      const [p0, p1, p2] = [L - 1, L, L + 1].map((l) => columns[l].indexOf(d))
      if (p0 < 0 || p2 < 0 || pitAffected(d, L) || pitAffected(d, L + 1)) continue
      if (Math.abs(p1 - p0) >= 3 && Math.abs(p1 - p2) >= 3 && Math.abs(p0 - p2) <= 1) spikes++
    }
  }
  const racing = swaps.onTrack + swaps.pit + swaps.neutralised
  const finishers = final.filter(tookFlag).length

  const driverInfo = Object.fromEntries(
    drivers.map((d) => [d.driver_number, { code: d.name_acronym, name: d.full_name, team: d.team_name, colour: `#${d.team_colour}` }]),
  )

  return {
    summary: {
      key: session.session_key,
      race: session.circuit_short_name,
      date: session.date_start.slice(0, 10),
      laps: leaderLaps,
      starters: gridOrder.length,
      finishers,
      ...swaps,
      pitShare: racing ? swaps.pit / racing : 0,
      sc: neutral.sc,
      vsc: neutral.vsc,
      red: neutral.red,
      stops: pits.length,
      mismatches,
      spikes,
    },
    chart: {
      name: meetingNames.get(session.meeting_key) ?? `${session.country_name} Grand Prix`,
      race: session.circuit_short_name,
      country: session.country_name,
      date: session.date_start.slice(0, 10),
      drivers: driverInfo,
      columns,
      gaps,
      pits: Object.fromEntries([...pitLaps].map(([d, s]) => [d, [...s].sort((a, b) => a - b)])),
      neutralised: neutral.periods,
      retired: Object.fromEntries(
        [...crossings].filter(([d]) => !final.includes(d)).map(([d, x]) => [d, x.length]),
      ), // driver -> laps completed
      // Final order is on the road; OpenF1's final positions may differ after post-race penalties.
      onTrackByLap,
    },
  }
}

await mkdir(outDir, { recursive: true })
const sessions = await readJson(rawDir, 'sessions.json')
const meetingNames = new Map((await readJson(rawDir, 'meetings.json')).map((m) => [m.meeting_key, m.meeting_name]))
const results = []
for (const s of sessions) {
  try {
    const { summary, chart } = await analyseRace(s, meetingNames)
    results.push(summary)
    await writeFile(path.join(outDir, `${s.session_key}.json`), JSON.stringify(chart))
  } catch (e) {
    console.warn(`${s.circuit_short_name}: ${e.message}`)
  }
}

// Score: a good example race has plenty of genuine racing AND lots of pit
// noise to expose, with enough finishers for a full chart.
const max = (k) => Math.max(...results.map((r) => r[k]))
for (const r of results) {
  r.score = +((r.onTrack / max('onTrack')) * 0.4 + (r.pit / max('pit')) * 0.4 + (r.finishers / max('finishers')) * 0.2).toFixed(3)
}
results.sort((a, b) => b.score - a.score)
await writeFile(path.join(outDir, 'summary.json'), JSON.stringify(results, null, 2))

const cols = ['race', 'laps', 'finishers', 'start', 'onTrack', 'pit', 'neutralised', 'pitShare', 'sc', 'vsc', 'red', 'stops', 'mismatches', 'spikes', 'score']
console.log(cols.map((c) => c.padStart(c === 'race' ? 18 : 9)).join(''))
for (const r of results) {
  console.log(
    cols
      .map((c) => {
        const v = c === 'pitShare' ? `${Math.round(r[c] * 100)}%` : String(r[c])
        return c === 'race' ? v.padEnd(18) : v.padStart(9)
      })
      .join(''),
  )
}
