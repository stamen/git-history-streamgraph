(function (d3, d3AreaLabel, arrayBlur) {
  'use strict';

  const parseDate = d3.timeParse('%Y-%m-%d');

  const transformData = (data) => {
    const layers = Object.keys(data.repositories);
    const dates = data.dates.map((d) => parseDate(d));

    const dataBylayer = new Map();

    for (let layer of layers) {
      const layerData = data.repositories[layer];

      // Apply smoothing
      const smoothedLayerData = arrayBlur.blur().radius(12)(layerData);

      dataBylayer.set(layer, smoothedLayerData);
    }

    const transformedData = [];
    dates.forEach((date, i) => {
      const row = { date };
      for (let layer of layers) {
        row[layer] = dataBylayer.get(layer)[i];
      }
      transformedData.push(row);
    });

    const stackedData = d3.stack()
      .offset(d3.stackOffsetWiggle)
      .order(d3.stackOrderInsideOut)
      .keys(layers)(transformedData);

    return { dates, stackedData };
  };

  const dataURL = './aggregatedData.json';
  const width = window.innerWidth;
  const height = window.innerHeight;

  const margin = { top: 20, right: 0, bottom: 20, left: 20 };
  const ticks = 20;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const render = ({ dates, stackedData }) => {
    const xScale = d3.scaleTime().domain(d3.extent(dates)).range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([
        d3.min(stackedData, (d) => d3.min(d, (d) => d[0])),
        d3.max(stackedData, (d) => d3.max(d, (d) => d[1])),
      ])
      .range([innerHeight, 0]);

    const areaGenerator = d3.area()
      .x((d) => xScale(d.data.date))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]));

    const svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const random = d3.randomNormal.source(d3.randomLcg(0.5))(30, 10);

    const colorScale = d3.scaleOrdinal().range(
      stackedData.map((country, i) => {
        const t = i / stackedData.length;
        return d3.hcl(t * 360, 50, random());
      })
    );

    g.append('g').call(
      d3.axisTop(xScale).tickSize(-innerHeight).tickPadding(6).ticks(ticks)
    );
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(0).tickPadding(5).ticks(ticks))
      .selectAll('line')
      .remove();

    // Add a black "envelope" as a backdrop behind the layers,
    // so that we don't get undesirable artifacts where the
    // tick lines are slightly visible in the cracks between layers.
    stackedData.sort((a, b) => d3.ascending(a.index, b.index));
    const first = stackedData[0];
    const last = stackedData[stackedData.length - 1];
    const outlinePadding = 0.01;
    const envelope = first.map((d, i) =>
      Object.assign([d[0] - outlinePadding, last[i][1] + outlinePadding], {
        data: d.data,
      })
    );
    g.append('path').attr('d', areaGenerator(envelope));

    g.append('g')
      .selectAll('path')
      .data(stackedData)
      .enter()
      //    .append('a')
      //    .attr('href', (d) => `https://github.com/stamen/${d.key}`)
      //    .attr('target', '_blank')
      .append('path')
      .attr('class', 'area')
      .attr('d', areaGenerator)
      .attr('fill', (d) => colorScale(d.key))
      .append('title')
      .text((d) => d.key);

    const labels = g.append('g').selectAll('text').data(stackedData);

    labels
      .enter()
      .append('text')
      .attr('class', 'area-label')
      .merge(labels)
      .text((d) => d.key)
      .attr('transform', d3AreaLabel.areaLabel(areaGenerator));
  };

  // Load the data.
  d3.json(dataURL).then((data) => {
    render(transformData(data));
  });

}(d3, d3, d3));
//# sourceMappingURL=bundle.js.map
