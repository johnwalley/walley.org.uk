import * as d3 from 'd3'
import { useEffect } from 'react'

export const Chart = () => {
  useEffect(() => {
    if (!document.querySelector('div#example>svg')) {
      var D = function (n) {
        if (n <= 0) return 1

        if (n <= 1) return 0

        return (n - 1) * (D(n - 1) + D(n - 2))
      }

      var data = [],
        n = 100,
        a = 1,
        b = 2

      for (var k = 2; k < 20; k++) {
        data.push({ x: k, y: D(k) })
      }

      var margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = 710 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom

      var x = d3.scaleLinear().range([0, width])

      var y = d3.scaleLog().range([height, 0])

      var xAxis = d3.axisBottom(x)

      var yAxis = d3.axisLeft(y)

      var line = d3
        .line()
        .x(function (d) {
          return x(d.x)
        })
        .y(function (d) {
          return y(d.y)
        })

      var svg = d3
        .select('div#example')
        .append('svg')
        .attr(
          'viewBox',
          `0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`
        )
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      x.domain(
        d3.extent(data, function (d) {
          return d.x
        })
      )
      y.domain(
        d3.extent(data, function (d) {
          return d.y
        })
      )

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
        .text('y')

      svg
        .append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line)
        .style('fill', 'none')
        .style('stroke', 'red')
    }
  }, [])

  return <div id="example"></div>
}
