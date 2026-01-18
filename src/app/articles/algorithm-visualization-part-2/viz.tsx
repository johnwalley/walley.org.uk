'use client'

import * as d3 from 'd3'
import { useEffect } from 'react'

type ActionType = 'move' | 'blocked' | 'success' | 'reset' | 'search'

interface MoveAction {
  type: 'move'
  index: number
  amount: number
}

interface BlockedAction {
  type: 'blocked'
  index: number
}

interface SuccessAction {
  type: 'success'
}

interface ResetAction {
  type: 'reset'
  x?: number
}

interface SearchAction {
  type: 'search'
  range: [number, number, number]
}

type Action = MoveAction | BlockedAction | SuccessAction | ResetAction | SearchAction

const Viz = () => {
  useEffect(() => {
    let count = 0
    const overshoot = 300

    function whenBoundsVisible(
      computeBounds: () => [number, number],
      callback: (arg: null) => void
    ) {
      const id = '.visible-' + ++count
      const self = d3.select(window)
      let bounds: [number, number]

      if (document.readyState === 'loading') self.on('load' + id, loaded)
      else loaded()

      function loaded() {
        self
          .on('resize' + id, resized)
          .on('scroll' + id, scrolled)
          .each(resized)
      }

      function resized() {
        bounds = computeBounds()
        if (bounds[1] < bounds[0]) bounds.reverse()
        scrolled()
      }

      function scrolled() {
        if (bounds[0] <= pageYOffset && pageYOffset <= bounds[1]) {
          callback(null)
          self.on(id, null)
        }
      }
    }

    const whenFullyVisible = function (
      element: Element,
      callback: (arg: null) => void
    ) {
      return whenBoundsVisible(function () {
        const rect = element.getBoundingClientRect()
        return [
          rect.bottom + pageYOffset - innerHeight,
          rect.top + pageYOffset,
        ] as [number, number]
      }, callback)
    }

    if (!document.querySelector('p#kingdomAndTrees>svg')) {
      let array = [9, 5, 11, 2, 11, 3]
      array = d3.range(6).map(function () {
        return Math.floor(Math.random() * 20) + 1
      })

      const n = array.length
      const maxX = 20

      const margin = {
        top: 60,
        right: 20,
        bottom: 60,
        left: 40,
      }
      const width =
        (d3.select('#kingdomAndTrees').node() as Element)?.getBoundingClientRect()
          .width -
          margin.left -
          margin.right || 600
      const height = 400 - margin.top - margin.bottom

      const x = d3.scaleBand<number>().range([0, width]).padding(0.1)

      const y = d3.scaleLinear().range([height, 0])

      const xAxis = d3.axisBottom(x)

      const yAxis = d3.axisLeft(y)

      const p = d3.select('#kingdomAndTrees').on('click', click)

      const svg = p
        .append('svg')
        .attr('width', width + margin.left + margin.top)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      x.domain(d3.range(0, n))
      y.domain([0, d3.max(array) ?? 20])

      svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      svg
        .append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Height')

      const mid = Math.floor((maxX - 1) / 2)

      const title = svg
        .append('text')
        .attr('x', (width / maxX) * mid)
        .attr('y', 0 - margin.top / 1.5)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .text(mid)

      svg
        .append('rect')
        .attr('class', 'range-background')
        .attr('x', 0)
        .attr('width', width)
        .attr('y', 0 - margin.top / 2)
        .attr('height', 20)

      const searchRange = svg
        .append('rect')
        .attr('class', 'range')
        .attr('x', 0)
        .attr('width', width)
        .attr('y', 0 - margin.top / 2)
        .attr('height', 20)

      svg
        .selectAll('.bar')
        .data(array)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function (_d, i) {
          return x(i) ?? 0
        })
        .attr('width', x.bandwidth())
        .attr('y', function (d) {
          return y(d)
        })
        .attr('height', function (d) {
          return height - y(d)
        })

      const node = p.node()
      if (node) whenFullyVisible(node as Element, click)

      function click() {
        const actions = kingdomAndTrees(array, maxX)

        const bar = svg
          .selectAll('.bar, .bar-blocked')
          .attr('class', 'bar')
          .interrupt()

        let data = array.slice()

        let transition = svg
          .transition()
          .duration(600)
          .on('start', function start() {
            const action = actions.pop()
            if (!action) return

            switch (action.type) {
              case 'move': {
                data[action.index] += action.amount

                bar.data(data)

                transition.each(function () {
                  bar
                    .transition()
                    .attr('x', function (_d, i) {
                      return x(i) ?? 0
                    })
                    .attr('y', function (d) {
                      return y(d as number)
                    })
                    .attr('height', function (d) {
                      return height - y(d as number)
                    })
                    .attr('class', function (_d, idx) {
                      return idx === action.index ? 'bar-active' : 'bar'
                    })
                })

                break
              }
              case 'blocked': {
                transition.each(function () {
                  bar.transition().attr('class', function (_d, idx) {
                    return idx === action.index ? 'bar-blocked' : 'bar'
                  })
                })

                break
              }
              case 'success': {
                transition.each(function () {
                  bar.transition().attr('class', 'bar-success')
                })

                break
              }
              case 'reset': {
                data = array.slice()
                bar.data(data)

                bar
                  .transition()
                  .attr('x', function (_d, i) {
                    return x(i) ?? 0
                  })
                  .attr('y', function (d) {
                    return y(d as number)
                  })
                  .attr('height', function (d) {
                    return height - y(d as number)
                  })
                  .attr('class', 'bar')
                break
              }
              case 'search': {
                transition.each(function () {
                  searchRange
                    .attr('class', 'range')
                    .attr('x', (width / maxX) * (action.range[0] - 1))
                    .attr(
                      'width',
                      (width / (maxX - 1)) *
                        (action.range[2] - action.range[0])
                    )
                    .attr('y', 0 - margin.top / 2)
                    .attr('height', 20)

                  title
                    .transition()
                    .text(action.range[1])
                    .attr('x', (width / maxX) * (action.range[1] - 1))
                })

                break
              }
            }
            if (actions.length)
              transition = transition.transition().on('start', start)
            else
              transition.on('end', function () {
                bar.attr('class', 'bar')
              })
          })
      }

      function kingdomAndTrees(a: number[], maxX: number): Action[] {
        const actions: Action[] = []

        let lo = 1
        let hi = maxX
        let mid: number

        while (lo < hi) {
          mid = Math.floor((hi + lo) / 2)
          actions.push({
            type: 'search',
            range: [lo, mid, hi],
          })
          actions.push({
            type: 'reset',
            x: mid,
          })

          const success = hasSolution(a, mid, actions)

          if (success) {
            hi = mid
          } else {
            lo = mid + 1
          }
        }
        mid = Math.floor((hi + lo) / 2)

        actions.push({
          type: 'search',
          range: [lo, mid, hi],
        })
        actions.push({
          type: 'reset',
          x: lo,
        })
        hasSolution(a, lo, actions)

        return actions.reverse()
      }

      function hasSolution(a: number[], j: number, actions: Action[]): boolean {
        let lastHeight = 0
        let i: number
        for (i = 0; i < a.length; i++) {
          if (a[i] + j > lastHeight) {
            lastHeight = Math.max(lastHeight + 1, a[i] - j)
            actions.push({
              type: 'move',
              index: i,
              amount: -a[i] + lastHeight,
            })
          } else {
            actions.push({
              type: 'move',
              index: i,
              amount: -a[i] + lastHeight,
            })
            actions.push({
              type: 'blocked',
              index: i,
            })
            return false
          }
        }

        if (i === a.length) {
          actions.push({
            type: 'success',
          })
          return true
        }

        return false
      }
    }
  }, [])

  return <p id="kingdomAndTrees" className="shuffle animation"></p>
}

export default Viz
