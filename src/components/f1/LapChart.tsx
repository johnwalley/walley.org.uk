'use client'

import { line, scaleLinear } from 'd3'
import { useMemo, useState } from 'react'

import { dashedDrivers, pitOnlyMoves, type LapChartData } from './types'

const ROW = 22
const MARGIN = { top: 32, right: 56, bottom: 28, left: 64 }
const WIDTH = 720

export interface Annotation {
  /** Driver code the note is attached to. */
  driver: string
  lap: number
  text: string
  /** Which side of the line the note sits. Defaults to above. */
  side?: 'above' | 'below'
  /** Horizontal text alignment relative to the point. Defaults to middle. */
  align?: 'start' | 'middle' | 'end'
}

interface Props {
  data: LapChartData
  /** Fade line segments where the position change came only from pit stops. */
  fadePitMoves?: boolean
  /** Driver codes emphasised when nothing is hovered. */
  highlight?: string[]
  annotations?: Annotation[]
  /** Accessible description of what the chart shows. */
  description?: string
}

export function LapChart({ data, fadePitMoves = false, highlight = [], annotations = [], description }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [pinned, setPinned] = useState<number | null>(null)

  const laps = data.columns.length - 1
  const rows = Math.max(...data.columns.map((c) => c.length))
  const height = MARGIN.top + MARGIN.bottom + (rows - 1) * ROW
  const x = scaleLinear().domain([0, laps]).range([MARGIN.left, WIDTH - MARGIN.right])
  const y = (pos: number) => MARGIN.top + pos * ROW // pos is 0-based

  const series = useMemo(() => {
    const dashed = dashedDrivers(data)
    const pitOnly = pitOnlyMoves(data)
    const xs = scaleLinear().domain([0, laps]).range([MARGIN.left, WIDTH - MARGIN.right])
    const path = line<[number, number]>()
      .defined(([, p]) => p >= 0)
      .x(([l]) => xs(l))
      .y(([, p]) => y(p))
    return Object.entries(data.drivers).map(([n, info]) => {
      const num = Number(n)
      const points = data.columns.map((c, l) => [l, c.indexOf(num)] as [number, number])
      const present = points.filter(([, p]) => p >= 0)
      // Split into solid and pit-only segments, one "M..L.." per lap.
      let solid = ''
      let faded = ''
      for (let l = 1; l < points.length; l++) {
        const [p0, p1] = [points[l - 1][1], points[l][1]]
        if (p0 < 0 || p1 < 0) continue
        const seg = `M${xs(l - 1)},${y(p0)}L${xs(l)},${y(p1)}`
        if (pitOnly.get(num)?.has(l)) faded += seg
        else solid += seg
      }
      return {
        num,
        ...info,
        dashed: dashed.has(num),
        all: path(points) ?? '',
        solid,
        faded,
        points,
        start: present[0],
        end: present.at(-1),
        retiredAfter: data.retired[n] as number | undefined,
        stops: (data.pits[n] ?? []).length,
      }
    })
  }, [data, laps])

  const highlightNums = series.filter((s) => highlight.includes(s.code)).map((s) => s.num)
  const active = pinned ?? hovered
  const emphasised = active != null ? [active] : highlightNums
  const isDim = (num: number) => emphasised.length > 0 && !emphasised.includes(num)
  const ordered = [...series].sort((a, b) => Number(!isDim(a.num)) - Number(!isDim(b.num)))
  const activeSeries = series.find((s) => s.num === active)

  // Finishing order, retirements last (most laps first): used by the legend and table.
  const finishOrder = [...series].sort((a, b) => {
    const [ra, rb] = [a.retiredAfter ?? Infinity, b.retiredAfter ?? Infinity]
    return ra === rb ? (a.end?.[1] ?? 99) - (b.end?.[1] ?? 99) : rb - ra
  })
  const teams = [...new Map(finishOrder.map((s) => [s.team, s.colour])).entries()]

  const result = (s: (typeof series)[number]) =>
    s.retiredAfter != null ? `Retired, lap ${s.retiredAfter + 1}` : `P${(s.end?.[1] ?? 0) + 1}`

  const ticks = x.ticks(Math.min(laps / 5, 12)).filter((t) => t > 0)
  const strokeProps = (s: (typeof series)[number]) => ({
    fill: 'none',
    stroke: s.colour,
    strokeWidth: 2,
    strokeLinejoin: 'round' as const,
    strokeDasharray: s.dashed ? '5 3' : undefined,
  })

  return (
    <figure className="not-prose my-10">
      <div className="mb-2 flex min-h-10 flex-wrap items-baseline justify-between gap-x-4 text-sm">
        <span className="font-semibold text-zinc-800 dark:text-zinc-100">
          {data.name} {data.date.slice(0, 4)}
          <span className="font-normal text-zinc-500 dark:text-zinc-400"> · {data.race}</span>
        </span>
        <span className="text-zinc-600 dark:text-zinc-400" aria-live="polite">
          {activeSeries ? (
            <>
              <span className="font-medium text-zinc-800 dark:text-zinc-100">{activeSeries.name}</span> ·{' '}
              {activeSeries.team} · P{(activeSeries.start?.[1] ?? 0) + 1} → {result(activeSeries)} ·{' '}
              {activeSeries.stops} stop{activeSeries.stops === 1 ? '' : 's'}
            </>
          ) : (
            'Hover or tap a line to follow a driver'
          )}
        </span>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 [contain:inline-size] sm:mx-0 sm:px-0">
        <svg
          viewBox={`0 0 ${WIDTH} ${height}`}
          className="w-full min-w-[640px] select-none sm:min-w-0 text-zinc-500 dark:text-zinc-400"
          role="img"
          aria-label={description ?? `Lap chart of the ${data.date.slice(0, 4)} ${data.name} at ${data.race}: every driver's position at the end of each lap.`}
          onPointerLeave={() => setHovered(null)}
        >
          {data.neutralised.map(({ from, to, kind }) => (
            <g key={`${kind}${from}`}>
              <rect
                x={x(from - 1)}
                width={x(to) - x(from - 1)}
                y={MARGIN.top - 12}
                height={height - MARGIN.top - MARGIN.bottom + 24}
                className={kind === 'Red' ? 'fill-red-500/10' : 'fill-amber-400/10'}
              />
              <text x={(x(from - 1) + x(to)) / 2} y={MARGIN.top - 18} textAnchor="middle" fontSize={10} fill="currentColor">
                {kind === 'Red' ? 'Red flag' : kind}
              </text>
            </g>
          ))}

          {ticks.map((t) => (
            <g key={t}>
              <line x1={x(t)} x2={x(t)} y1={MARGIN.top - 8} y2={height - MARGIN.bottom + 8} stroke="currentColor" strokeOpacity={0.12} />
              <text x={x(t)} y={height - 6} textAnchor="middle" fontSize={10} fill="currentColor">
                {t}
              </text>
            </g>
          ))}
          <text x={x(0)} y={height - 6} textAnchor="middle" fontSize={10} fill="currentColor">
            Grid
          </text>
          <text x={WIDTH - 4} y={height - 6} textAnchor="end" fontSize={10} fill="currentColor">
            Lap
          </text>
          {Array.from({ length: rows }, (_, i) => (
            <text key={i} x={MARGIN.left - 44} y={y(i)} dy="0.35em" textAnchor="end" fontSize={10} fill="currentColor">
              {i + 1}
            </text>
          ))}

          {ordered.map((s) => (
            <g
              key={s.num}
              opacity={isDim(s.num) ? 0.12 : 1}
              className="cursor-pointer"
              onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(s.num)}
              onClick={() => setPinned((p) => (p === s.num ? null : s.num))}
            >
              {fadePitMoves ? (
                <>
                  <path d={s.faded} fill="none" stroke={s.colour} strokeWidth={1.5} strokeOpacity={0.55} strokeDasharray="1 3" strokeLinecap="round" />
                  <path d={s.solid} {...strokeProps(s)} />
                </>
              ) : (
                <path d={s.all} {...strokeProps(s)} />
              )}
              <path d={s.all} fill="none" stroke="transparent" strokeWidth={14} />
              {s.retiredAfter != null && s.end && (
                <path
                  d={`M${x(s.end[0]) - 4},${y(s.end[1]) - 4}l8,8m0,-8l-8,8`}
                  stroke={s.colour}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              )}
              {s.start && (
                <text x={x(0) - 8} y={y(s.start[1])} dy="0.35em" textAnchor="end" fontSize={11} className="fill-zinc-700 dark:fill-zinc-300">
                  {s.code}
                </text>
              )}
              {s.retiredAfter == null && s.end && (
                <text x={x(laps) + 8} y={y(s.end[1])} dy="0.35em" fontSize={11} className="fill-zinc-700 dark:fill-zinc-300">
                  {s.code}
                </text>
              )}
            </g>
          ))}

          {active == null &&
            annotations.map((a) => {
              const s = series.find((d) => d.code === a.driver)
              const p = s?.points[a.lap]?.[1]
              if (!s || p == null || p < 0) return null
              const above = (a.side ?? 'above') === 'above'
              return (
                <g key={`${a.driver}${a.lap}`} pointerEvents="none">
                  <circle cx={x(a.lap)} cy={y(p)} r={4} fill={s.colour} className="stroke-white dark:stroke-zinc-900" strokeWidth={2} />
                  <text
                    x={x(a.lap) + (a.align === 'start' ? -6 : a.align === 'end' ? 6 : 0)}
                    y={y(p) + (above ? -12 : 20)}
                    textAnchor={a.align ?? 'middle'}
                    fontSize={11}
                    fontWeight={500}
                    paintOrder="stroke"
                    strokeWidth={4}
                    strokeLinejoin="round"
                    className="fill-zinc-800 stroke-white dark:fill-zinc-100 dark:stroke-zinc-900"
                  >
                    {a.text}
                  </text>
                </g>
              )
            })}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
        {teams.map(([team, colour]) => (
          <span key={team} className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full" style={{ background: colour }} />
            {team}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <svg width="16" height="2" aria-hidden="true">
            <line x1="0" x2="16" y1="1" y2="1" stroke="currentColor" strokeWidth="2" strokeDasharray="5 3" />
          </svg>
          Team&rsquo;s second car
        </span>
        {fadePitMoves && (
          <span className="inline-flex items-center gap-1.5">
            <svg width="16" height="2" aria-hidden="true">
              <line x1="0" x2="16" y1="1" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 3" strokeLinecap="round" />
            </svg>
            Moved only by pit stops
          </span>
        )}
      </div>

      <details className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        <summary className="cursor-pointer select-none">Show as a table</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left tabular-nums">
            <thead className="text-zinc-800 dark:text-zinc-100">
              <tr>
                <th className="py-1 pr-4 font-medium">Driver</th>
                <th className="py-1 pr-4 font-medium">Team</th>
                <th className="py-1 pr-4 font-medium">Grid</th>
                <th className="py-1 pr-4 font-medium">Result</th>
                <th className="py-1 font-medium">Stops</th>
              </tr>
            </thead>
            <tbody>
              {finishOrder.map((s) => (
                <tr key={s.num} className="border-t border-zinc-100 dark:border-zinc-800">
                  <td className="py-1 pr-4">{s.name}</td>
                  <td className="py-1 pr-4">{s.team}</td>
                  <td className="py-1 pr-4">P{(s.start?.[1] ?? 0) + 1}</td>
                  <td className="py-1 pr-4">{result(s)}</td>
                  <td className="py-1">{s.stops}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}
