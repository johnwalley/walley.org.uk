'use client'

import * as d3 from 'd3'
import { useEffect } from 'react'

interface DataPoint {
  x: number
  y: number
}

const Chart = () => {
  useEffect(() => {
    if (!document.querySelector('div#example>svg')) {
      const D = function (n: number): number {
        if (n <= 0) return 1

        if (n <= 1) return 0

        return (n - 1) * (D(n - 1) + D(n - 2))
      }

      const data: DataPoint[] = []

      for (let k = 2; k < 20; k++) {
        data.push({ x: k, y: D(k) })
      }

      const margin = { top: 20, right: 20, bottom: 30, left: 50 }
      const width = 710 - margin.left - margin.right
      const height = 500 - margin.top - margin.bottom

      const x = d3.scaleLinear().range([0, width])

      const y = d3.scaleLog().range([height, 0])

      const xAxis = d3.axisBottom(x)

      const yAxis = d3.axisLeft(y)

      const line = d3
        .line<DataPoint>()
        .x(function (d) {
          return x(d.x)
        })
        .y(function (d) {
          return y(d.y)
        })

      const svg = d3
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
        }) as [number, number]
      )
      y.domain(
        d3.extent(data, function (d) {
          return d.y
        }) as [number, number]
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

export default Chart
