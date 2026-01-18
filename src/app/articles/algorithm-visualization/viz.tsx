'use client'

import * as d3 from 'd3'
import { useEffect } from 'react'

interface Action {
  type: 'increment' | 'longest'
  i: number
  j: number
}

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

    if (!document.querySelector('p#longestString>svg')) {
      const array = 'abcaabbccaaabbbcccaaaabbbbcccc'.split('')
      const intArray = array.map(function (x) {
        return x.charCodeAt(0)
      })

      const n = array.length

      const pointers = [0, 1]

      const margin = { top: 60, right: 20, bottom: 60, left: 20 }
      const width =
        (d3.select('#longestString').node() as Element)?.getBoundingClientRect()
          .width -
          margin.left -
          margin.right || 600
      const height = 180 - margin.top - margin.bottom

      const x = d3
        .scalePoint<number>()
        .domain(d3.range(n + 1))
        .range([0, width])

      const p = d3.select('#longestString').on('click', click)

      const svg = p
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      const gText = svg.append('g')

      gText
        .selectAll('text')
        .data(array)
        .enter()
        .append('text')
        .text(function (d) {
          return d
        })
        .attr('transform', transform)
        .attr('y2', -height)
        .attr('text-anchor', 'middle')
        .attr('font-size', (32 * width) / 700)

      const gLine = svg.append('g').attr('class', 'line')

      gLine
        .selectAll('line')
        .data(pointers)
        .enter()
        .append('line')
        .attr('class', 'line--inactive')
        .attr('transform', transform)
        .attr('y2', -height)

      p.append('button').text('▶ Play')

      const node = p.node()
      if (node) whenFullyVisible(node as Element, click)

      function click() {
        const actions = longestSubstring(intArray, 2)

        const line = gLine
          .selectAll('line')
          .attr('transform', transform)
          .attr('class', 'line--inactive')
          .interrupt()

        let transition = svg
          .transition()
          .duration(150)
          .on('start', function start() {
            const action = actions.pop()
            if (!action) return

            switch (action.type) {
              case 'increment': {
                const i = action.i
                const j = action.j

                line.data([i, j])

                transition.each(function () {
                  line.transition().attr('transform', transformPosition as unknown as string)
                })

                break
              }
              case 'longest': {
                const i = action.i
                const j = action.j

                gText.selectAll('text').attr('class', function (_d, idx) {
                  return idx >= i && idx < j ? 'text--active' : 'text--inactive'
                })

                break
              }
            }
            if (actions.length)
              transition = transition.transition().on('start', start)
            else
              transition.on('end', function () {
                line.attr('class', 'line--inactive')
              })
          })
      }

      function transform(_d: unknown, i: number) {
        return 'translate(' + x(i) + ',' + height + ')'
      }

      function transformPosition(d: number) {
        return 'translate(' + x(d) + ',' + 0.5 * height + ')'
      }

      function longestSubstring(a: number[], m: number): Action[] {
        const actions: Action[] = []

        let i = 0
        let j = 1

        let longestString = [i, j]

        const hist = Array(128).fill(0)
        hist[a[i]]++

        while (j < a.length) {
          hist[a[j]]++

          if (
            hist.filter((x: number) => x > 0).length <= m
          ) {
            j++
          } else {
            hist[a[j]]--
            if (hist[a[i]] > 0) hist[a[i]]--
            i++
          }

          actions.push({ type: 'increment', i: i, j: j })

          if (j - i > longestString[1] - longestString[0]) {
            actions.push({ type: 'longest', i: i, j: j })
            longestString = [i, j]
          }
        }

        return actions.reverse()
      }
    }
  }, [])

  return <p id="longestString" className="shuffle animation"></p>
}

export default Viz
