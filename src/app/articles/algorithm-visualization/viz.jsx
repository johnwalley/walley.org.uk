'use client'

import * as d3 from 'd3'
import { useEffect } from 'react'

const Viz = () => {
  useEffect(() => {
    var count = 0,
      overshoot = 300

    function whenBoundsVisible(computeBounds, callback) {
      var id = '.visible-' + ++count,
        self = d3.select(window),
        bounds

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

    const beforeVisible = function (element, callback) {
      return whenBoundsVisible(function () {
        var rect = element.getBoundingClientRect()
        return [
          rect.top + pageYOffset - innerHeight - overshoot,
          rect.bottom + pageYOffset + overshoot,
        ]
      }, callback)
    }

    const whenFullyVisible = function (element, callback) {
      return whenBoundsVisible(function () {
        var rect = element.getBoundingClientRect()
        return [rect.bottom + pageYOffset - innerHeight, rect.top + pageYOffset]
      }, callback)
    }

    if (!document.querySelector('p#longestString>svg')) {
      var array = 'abcaabbccaaabbbcccaaaabbbbcccc'.split('')
      var intArray = array.map(function (x) {
        return x.charCodeAt(0)
      })

      var n = array.length

      var pointers = [0, 1]

      var margin = { top: 60, right: 20, bottom: 60, left: 20 },
        width =
          d3.select('#longestString').node().getBoundingClientRect().width -
          margin.left -
          margin.right,
        height = 180 - margin.top - margin.bottom

      var x = d3
        .scalePoint()
        .domain(d3.range(n + 1))
        .range([0, width])

      var p = d3.select('#longestString').on('click', click)

      var svg = p
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      var gText = svg.append('g')

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

      var gLine = svg.append('g').attr('class', 'line')

      gLine
        .selectAll('line')
        .data(pointers)
        .enter()
        .append('line')
        .attr('class', 'line--inactive')
        .attr('transform', transform)
        .attr('y2', -height)

      p.append('button').text('▶ Play')

      whenFullyVisible(p.node(), click)

      function click() {
        var actions = longestSubstring(intArray, 2)

        var line = gLine
          .selectAll('line')
          .attr('transform', transform)
          .attr('class', 'line--inactive')
          .interrupt()

        var transition = svg
          .transition()
          .duration(150)
          .on('start', function start() {
            var action = actions.pop()
            switch (action.type) {
              case 'increment': {
                var i = action.i
                var j = action.j

                line.data([i, j])

                transition.each(function () {
                  line.transition().attr('transform', transformPosition)
                })

                break
              }
              case 'longest': {
                var i = action.i
                var j = action.j

                gText.selectAll('text').attr('class', function (d, idx) {
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

      function transform(d, i) {
        return 'translate(' + x(i) + ',' + height + ')'
      }

      function transformPosition(d, i) {
        return 'translate(' + x(d) + ',' + 0.5 * height + ')'
      }

      function longestSubstring(a, m) {
        var actions = []

        var i = 0
        var j = 1

        var longestString = [i, j]

        var hist = Array(128).fill(0)
        hist[a[i]]++

        while (j < a.length) {
          hist[a[j]]++

          if (
            hist
              .map(function (x) {
                return x > 0
              })
              .reduce(function (a, b) {
                return a + b
              }) <= m
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
