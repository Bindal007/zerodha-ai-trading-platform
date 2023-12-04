import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type DataItem = { date: Date; close: number };

const HistoricalValueChart: React.FC = () => {
    const d3Container = useRef<SVGSVGElement | null>(null);
    const dataString = `date,close
  1-May-12,58.13
  30-Apr-12,53.98
  27-Apr-12,67.00
  26-Apr-12,89.70
  25-Apr-12,99.00
  24-Apr-12,130.28
  23-Apr-12,166.70
  20-Apr-12,234.98
  19-Apr-12,345.44
  18-Apr-12,443.34
  17-Apr-12,543.70
  16-Apr-12,580.13
  13-Apr-12,605.23
  12-Apr-12,622.77
  11-Apr-12,626.20
  10-Apr-12,628.44
  9-Apr-12,636.23
  5-Apr-12,633.68
  4-Apr-12,624.31
  3-Apr-12,629.32
  2-Apr-12,618.63
  30-Mar-12,599.55
  29-Mar-12,609.86
  28-Mar-12,617.62
  27-Mar-12,614.48
  26-Mar-12,606.98`;

    useEffect(() => {
        if (d3Container.current) {
            const parsedData = d3.csvParse(dataString, d => {
                const parseDate = d3.timeParse("%d-%b-%y");
                const date =parseDate(d.date.trim());
                const close = +d.close;

                return {
                        date: date ? date : new Date(),
                        close: close         
                    }
            });
const data : DataItem[] = parsedData.filter((d): d is DataItem => d.date instanceof Date);

const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const x = d3.scaleTime()
    .range([0, width])
    .domain(d3.extent(data, d => d.date) as [Date, Date]);

const y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(data, d => d.close) as number]);

const area = d3.area<DataItem>()
    .x(d => x(d.date))
    .y0(height)
    .y1(d => y(d.close));

const svg = d3.select(d3Container.current)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('fill', '#0e75e6')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

svg.append('path')
    .datum(data)
    .attr('class', 'area')
    .attr('d', area);

svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

svg.append('g')
    .call(d3.axisLeft(y));
    }
  }, []);

return (
    <div className="flex flex-col bg-white shadow-lg rounded-lg p-4">
        <p className="text-lg font-semibold mb-4">Historical Portfolio Value</p>
        <svg ref={d3Container} />
    </div>
);
};

export default HistoricalValueChart;