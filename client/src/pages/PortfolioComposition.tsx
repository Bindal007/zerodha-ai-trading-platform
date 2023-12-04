import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type PortfolioItem = {
  category: string;
  value: number;
};

const PortfolioComposition: React.FC = () => {
  // Correctly type the ref to be a div element
  const d3Container = useRef<HTMLDivElement | null>(null);
  const data: PortfolioItem[] = [
    { category: 'Stocks', value: 45000 },
    { category: 'Bonds', value: 30000 },
    { category: 'Real Estate', value: 15000 },
    { category: 'Cash', value: 10000 },
    // ... add more data as needed
  ];

  useEffect(() => {
    if (d3Container.current) {
      const width = 360;
      const height = 360;
      const radius = Math.min(width, height) / 2;

      // Create SVG element inside the div container
      const svgElement = d3.select(d3Container.current)
                          .append('svg')
                          .attr('width', width)
                          .attr('height', height);

      const svg = svgElement.append('g')
                            .attr('transform', `translate(${width / 2}, ${height / 2})`);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const pie = d3.pie<PortfolioItem>()
                    .value(d => d.value)
                    .sort(null);

      const arc = d3.arc<d3.PieArcDatum<PortfolioItem>>()
                    .innerRadius(0)
                    .outerRadius(radius);

      svg.selectAll('path')
         .data(pie(data))
         .enter()
         .append('path')
         .attr('d', arc)
         .attr('fill', d => color(d.data.category));

      // Optionally, if you want to remove the SVG when the component unmounts
      return () => {
        svgElement.remove();
      };
    }
  }, []);

  return (
    <div className="flex flex-col bg-white shadow-lg rounded-lg p-4">
      <p className="text-lg font-semibold mb-4">Portfolio Composition</p>
      <div ref={d3Container} />
    </div>
  );
};

export default PortfolioComposition;