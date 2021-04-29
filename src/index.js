import {
  json,
  scaleTime,
  extent,
  max,
  min,
  scaleLinear,
  area,
  select,
  scaleOrdinal,
  hcl,
  randomNormal,
  randomLcg,
  axisTop,
  axisBottom,
  ascending,
} from 'd3';
import { areaLabel } from 'd3-area-label';
import { transformData } from './transformData';

const dataURL =
  'https://gist.githubusercontent.com/curran/18287ef2c4b64ffba32000aad47c292b/raw/eb2dd48d383f09a70b23dc35c3e8eb7b6c7c31ad/all-d3-commits.json';
const width = window.innerWidth;
const height = window.innerHeight;

const margin = { top: 20, right: 0, bottom: 20, left: 0 };
const ticks = 20;

const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const xValue = (d) => d.date;

const render = ({ data, stackedData }) => {
  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth]);

  const yScale = scaleLinear()
    .domain([
      min(stackedData, (d) => min(d, (d) => d[0])),
      max(stackedData, (d) => max(d, (d) => d[1])),
    ])
    .range([innerHeight, 0]);

  const areaGenerator = area()
    .x((d) => xScale(d.data.date))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]));

  const svg = select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const g = svg
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left},${margin.top})`
    );

  const random = randomNormal.source(randomLcg(0.5))(
    30,
    10
  );

  const colorScale = scaleOrdinal().range(
    stackedData.map((country, i) => {
      const t = i / stackedData.length;
      return hcl(t * 360, 50, random());
    })
  );

  g.append('g').call(
    axisTop(xScale)
      .tickSize(-innerHeight)
      .tickPadding(6)
      .ticks(ticks)
  );
  g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(
      axisBottom(xScale)
        .tickSize(0)
        .tickPadding(5)
        .ticks(ticks)
    )
    .selectAll('line')
    .remove();

  // Add a black "envelope" as a backdrop behind the layers,
  // so that we don't get undesirable artifacts where the
  // tick lines are slightly visible in the cracks between layers.
  stackedData.sort((a, b) => ascending(a.index, b.index));
  const first = stackedData[0];
  const last = stackedData[stackedData.length - 1];
  const outlinePadding = 0.5;
  const envelope = first.map((d, i) =>
    Object.assign(
      [d[0] - outlinePadding, last[i][1] + outlinePadding],
      { data: d.data }
    )
  );
  g.append('path').attr('d', areaGenerator(envelope));

  g.append('g')
    .selectAll('path')
    .data(stackedData)
    .enter()
    .append('a')
    .attr(
      'href',
      (d) => `https://github.com/stamen/${d.key}`
    )
    .attr('target', '_blank')
    .append('path')
    .attr('class', 'area')
    .attr('d', areaGenerator)
    .attr('fill', (d) => colorScale(d.key))
    .append('title')
    .text((d) => d.key);

  const labels = g
    .append('g')
    .selectAll('text')
    .data(stackedData);

  labels
    .enter()
    .append('text')
    .attr('class', 'area-label')
    .merge(labels)
    .text((d) => d.key)
    .attr('transform', areaLabel(areaGenerator));
};

// Load the data.
json(dataURL).then((data) => {
  render(transformData(data));
});
