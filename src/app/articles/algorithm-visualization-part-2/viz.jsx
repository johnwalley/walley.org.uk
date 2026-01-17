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

    if (!document.querySelector('p#kingdomAndTrees>svg')) {
      var array = [9, 5, 11, 2, 11, 3]
      array = d3.range(6).map(function (x) {
        return Math.floor(Math.random() * 20) + 1
      })

      var n = array.length
      var maxX = 20

      var margin = {
          top: 60,
          right: 20,
          bottom: 60,
          left: 40,
        },
        width =
          d3.select('#kingdomAndTrees').node().getBoundingClientRect().width -
          margin.left -
          margin.right,
        height = 400 - margin.top - margin.bottom

      var x = d3.scaleBand().range([0, width]).padding(0.1)

      var y = d3.scaleLinear().range([height, 0])

      var xAxis = d3.axisBottom(x)

      var yAxis = d3.axisLeft(y)

      var p = d3.select('#kingdomAndTrees').on('click', click)

      var svg = p
        .append('svg')
        .attr('width', width + margin.left + margin.top)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      x.domain(d3.range(0, n))
      y.domain([0, d3.max(array)])

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

      var mid = Math.floor((maxX - 1) / 2)

      var title = svg
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

      var searchRange = svg
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
        .attr('x', function (d, i) {
          return x(i)
        })
        .attr('width', x.bandwidth())
        .attr('y', function (d) {
          return y(d)
        })
        .attr('height', function (d) {
          return height - y(d)
        })

      whenFullyVisible(p.node(), click)

      function click() {
        var actions = kingdomAndTrees(array, maxX)

        var bar = svg
          .selectAll('.bar, .bar-blocked')
          .attr('class', 'bar')
          .interrupt()

        var data = array.slice()

        var transition = svg
          .transition()
          .duration(600)
          .on('start', function start() {
            var action = actions.pop()
            switch (action.type) {
              case 'move': {
                data[action.index] += action.amount

                bar.data(data)

                transition.each(function () {
                  bar
                    .transition()
                    .attr('x', function (d, i) {
                      return x(i)
                    })
                    .attr('y', function (d) {
                      return y(d)
                    })
                    .attr('height', function (d) {
                      return height - y(d)
                    })
                    .attr('class', function (d, idx) {
                      return idx === action.index ? 'bar-active' : 'bar'
                    })
                })

                break
              }
              case 'blocked': {
                transition.each(function () {
                  bar.transition().attr('class', function (d, idx) {
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
                  .attr('x', function (d, i) {
                    return x(i)
                  })
                  .attr('y', function (d) {
                    return y(d)
                  })
                  .attr('height', function (d) {
                    return height - y(d)
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
                        (action.range[2] - action.range[0]),
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

      function kingdomAndTrees(a, x) {
        var actions = []

        var lo = 1
        var hi = x
        var mid

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

          var success = hasSolution(a, mid, actions)

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

      function hasSolution(a, j, actions) {
        var lastHeight = 0
        var i
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
      }
    }
  }, [])

  return <p id="kingdomAndTrees" className="shuffle animation"></p>
}

export default Viz
