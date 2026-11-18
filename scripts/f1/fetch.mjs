// Download raw OpenF1 data for every 2026 Grand Prix into scripts/f1/.cache/raw.
// Re-running only fetches what isn't cached yet.
//
// Usage: node scripts/f1/fetch.mjs [year]
//
// Data: OpenF1 (https://openf1.org), an unofficial community API not
// associated with Formula 1. The free tier is rate-limited, so requests are
// spaced out.

import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const YEAR = Number(process.argv[2] ?? 2026)
const API = 'https://api.openf1.org/v1'
const ENDPOINTS = ['drivers', 'laps', 'position', 'pit', 'stints', 'race_control']
const DELAY_MS = 2100

const here = path.dirname(fileURLToPath(import.meta.url))
const rawDir = path.join(here, '.cache', 'raw', String(YEAR))

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const exists = (p) => access(p).then(() => true, () => false)

async function get(url, attempt = 1) {
  const res = await fetch(url)
  if (res.status === 429 && attempt <= 5) {
    const wait = DELAY_MS * 2 ** attempt
    console.warn(`  429, retrying in ${wait}ms`)
    await sleep(wait)
    return get(url, attempt + 1)
  }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
  return res.json()
}

await mkdir(rawDir, { recursive: true })

const sessionsFile = path.join(rawDir, 'sessions.json')
const sessions = (
  await get(`${API}/sessions?year=${YEAR}&session_name=Race`)
).filter((s) => !s.is_cancelled && new Date(s.date_end) < new Date())
await writeFile(sessionsFile, JSON.stringify(sessions, null, 2))
await sleep(DELAY_MS)
await writeFile(path.join(rawDir, 'meetings.json'), JSON.stringify(await get(`${API}/meetings?year=${YEAR}`), null, 2))
console.log(`${sessions.length} completed races in ${YEAR}`)

for (const s of sessions) {
  const dir = path.join(rawDir, String(s.session_key))
  await mkdir(dir, { recursive: true })
  for (const endpoint of ENDPOINTS) {
    const file = path.join(dir, `${endpoint}.json`)
    if (await exists(file)) continue
    await sleep(DELAY_MS)
    const data = await get(`${API}/${endpoint}?session_key=${s.session_key}`)
    await writeFile(file, JSON.stringify(data))
    console.log(`${s.circuit_short_name.padEnd(20)} ${endpoint} (${data.length})`)
  }
}

// Sanity check: every file parsed and non-empty.
for (const s of sessions) {
  for (const endpoint of ['drivers', 'laps', 'position']) {
    const file = path.join(rawDir, String(s.session_key), `${endpoint}.json`)
    const data = JSON.parse(await readFile(file, 'utf8'))
    if (!data.length) console.warn(`EMPTY: ${s.circuit_short_name} ${endpoint}`)
  }
}
