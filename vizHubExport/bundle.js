(function (d3, d3AreaLabel, arrayBlur) {
  'use strict';

  const parseDate = d3.timeParse('%Y-%m-%d');

  const layer = (d) => d.repo;

  const transformData = (data) => {
    data.forEach((d) => {
      d.date = d3.utcWeek.floor(parseDate(d.date.split(' ')[0]));
    });

    // Aggregate by month and repository.
    const groupedData = d3.group(data, (d) => d.date, layer);

    const layerGroupedData = d3.group(data, layer);

    const layers = Array.from(layerGroupedData.keys());

    const [start, stop] = d3.extent(data, (d) => d.date);
    const allWeeks = d3.utcWeeks(start, stop);

    const dataBylayer = new Map();

    for (let layer of layers) {
      const layerData = allWeeks.map((date) => {
        const value = groupedData.get(date);
        const commits = value ? value.get(layer) : null;
        const commitCount = commits ? commits.length : 0;
        return commitCount;
      });

      // Apply smoothing
      const smoothedLayerData = arrayBlur.blur().radius(12)(layerData);

      dataBylayer.set(layer, smoothedLayerData);
    }

    const transformedData = [];
    allWeeks.forEach((date, i) => {
      const row = { date };
      for (let layer of layers) {
        row[layer] = dataBylayer.get(layer)[i];
      }
      transformedData.push(row);
    });

    const stackedData = d3
      .stack()
      .offset(d3.stackOffsetWiggle)
      .order(d3.stackOrderAppearance)
      .keys(layers)(transformedData);

    return { data, stackedData };
  };

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
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(stackedData, (d) => d3.min(d, (d) => d[0])),
        d3.max(stackedData, (d) => d3.max(d, (d) => d[1])),
      ])
      .range([innerHeight, 0]);

    const areaGenerator = d3
      .area()
      .x((d) => xScale(d.data.date))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]));

    const svg = d3
      .select('body')
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
    const outlinePadding = 0.5;
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
      .append('a')
      .attr('href', (d) => `https://github.com/stamen/${d.key}`)
      .attr('target', '_blank')
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
})(d3, d3, d3);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbInRyYW5zZm9ybURhdGEuanMiLCJpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICB0aW1lUGFyc2UsXG4gIHV0Y1dlZWssXG4gIHV0Y1dlZWtzLFxuICBncm91cCxcbiAgc3RhY2ssXG4gIGV4dGVudCxcbiAgc3RhY2tPZmZzZXRXaWdnbGUsXG4gIHN0YWNrT3JkZXJBcHBlYXJhbmNlLFxufSBmcm9tICdkMyc7XG5pbXBvcnQgeyBibHVyIH0gZnJvbSAnYXJyYXktYmx1cic7XG5cbmNvbnN0IHBhcnNlRGF0ZSA9IHRpbWVQYXJzZSgnJVktJW0tJWQnKTtcblxuY29uc3QgbGF5ZXIgPSBkID0+IGQucmVwbztcblxuZXhwb3J0IGNvbnN0IHRyYW5zZm9ybURhdGEgPSAoZGF0YSkgPT4ge1xuICBkYXRhLmZvckVhY2goKGQpID0+IHtcbiAgICBkLmRhdGUgPSB1dGNXZWVrLmZsb29yKHBhcnNlRGF0ZShkLmRhdGUuc3BsaXQoJyAnKVswXSkpO1xuICB9KTtcblxuICAvLyBBZ2dyZWdhdGUgYnkgbW9udGggYW5kIHJlcG9zaXRvcnkuXG4gIGNvbnN0IGdyb3VwZWREYXRhID0gZ3JvdXAoXG4gICAgZGF0YSxcbiAgICAoZCkgPT4gZC5kYXRlLFxuICAgIGxheWVyXG4gICk7XG4gIFxuXG4gIGNvbnN0IGxheWVyR3JvdXBlZERhdGEgPSBncm91cChkYXRhLCBsYXllcik7XG5cbiAgY29uc3QgbGF5ZXJzID0gQXJyYXkuZnJvbShsYXllckdyb3VwZWREYXRhLmtleXMoKSk7XG5cbiAgY29uc3QgW3N0YXJ0LCBzdG9wXSA9IGV4dGVudChkYXRhLCAoZCkgPT4gZC5kYXRlKTtcbiAgY29uc3QgYWxsV2Vla3MgPSB1dGNXZWVrcyhzdGFydCwgc3RvcCk7XG5cbiAgY29uc3QgZGF0YUJ5bGF5ZXIgPSBuZXcgTWFwKCk7XG5cbiAgZm9yIChsZXQgbGF5ZXIgb2YgbGF5ZXJzKSB7XG4gICAgY29uc3QgbGF5ZXJEYXRhID0gYWxsV2Vla3MubWFwKChkYXRlKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGdyb3VwZWREYXRhLmdldChkYXRlKTtcbiAgICAgIGNvbnN0IGNvbW1pdHMgPSB2YWx1ZSA/IHZhbHVlLmdldChsYXllcikgOiBudWxsO1xuICAgICAgY29uc3QgY29tbWl0Q291bnQgPSBjb21taXRzID8gY29tbWl0cy5sZW5ndGggOiAwO1xuICAgICAgcmV0dXJuIGNvbW1pdENvdW50O1xuICAgIH0pO1xuXG4gICAgLy8gQXBwbHkgc21vb3RoaW5nXG4gICAgY29uc3Qgc21vb3RoZWRMYXllckRhdGEgPSBibHVyKCkucmFkaXVzKDEyKShsYXllckRhdGEpO1xuXG4gICAgZGF0YUJ5bGF5ZXIuc2V0KGxheWVyLCBzbW9vdGhlZExheWVyRGF0YSk7XG4gIH1cblxuICBjb25zdCB0cmFuc2Zvcm1lZERhdGEgPSBbXTtcbiAgYWxsV2Vla3MuZm9yRWFjaCgoZGF0ZSwgaSkgPT4ge1xuICAgIGNvbnN0IHJvdyA9IHsgZGF0ZSB9O1xuICAgIGZvciAobGV0IGxheWVyIG9mIGxheWVycykge1xuICAgICAgcm93W2xheWVyXSA9IGRhdGFCeWxheWVyLmdldChsYXllcilbaV07XG4gICAgfVxuICAgIHRyYW5zZm9ybWVkRGF0YS5wdXNoKHJvdyk7XG4gIH0pO1xuXG4gIGNvbnN0IHN0YWNrZWREYXRhID0gc3RhY2soKVxuICAgIC5vZmZzZXQoc3RhY2tPZmZzZXRXaWdnbGUpXG4gICAgLm9yZGVyKHN0YWNrT3JkZXJBcHBlYXJhbmNlKVxuICAgIC5rZXlzKGxheWVycykodHJhbnNmb3JtZWREYXRhKTtcblxuICByZXR1cm4geyBkYXRhLCBzdGFja2VkRGF0YSB9O1xufTtcbiIsImltcG9ydCB7XG4gIGpzb24sXG4gIHNjYWxlVGltZSxcbiAgZXh0ZW50LFxuICBtYXgsXG4gIG1pbixcbiAgc2NhbGVMaW5lYXIsXG4gIGFyZWEsXG4gIHNlbGVjdCxcbiAgc2NhbGVPcmRpbmFsLFxuICBoY2wsXG4gIHJhbmRvbU5vcm1hbCxcbiAgcmFuZG9tTGNnLFxuICBheGlzVG9wLFxuICBheGlzQm90dG9tLFxuICBhc2NlbmRpbmcsXG59IGZyb20gJ2QzJztcbmltcG9ydCB7IGFyZWFMYWJlbCB9IGZyb20gJ2QzLWFyZWEtbGFiZWwnO1xuaW1wb3J0IHsgdHJhbnNmb3JtRGF0YSB9IGZyb20gJy4vdHJhbnNmb3JtRGF0YSc7XG5cbmNvbnN0IGRhdGFVUkwgPVxuICAnaHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9jdXJyYW4vMTgyODdlZjJjNGI2NGZmYmEzMjAwMGFhZDQ3YzI5MmIvcmF3L2ViMmRkNDhkMzgzZjA5YTcwYjIzZGMzNWMzZThlYjdiNmM3YzMxYWQvYWxsLWQzLWNvbW1pdHMuanNvbic7XG5jb25zdCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuY29uc3QgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG5jb25zdCBtYXJnaW4gPSB7IHRvcDogMjAsIHJpZ2h0OiAwLCBib3R0b206IDIwLCBsZWZ0OiAwIH07XG5jb25zdCB0aWNrcyA9IDIwO1xuXG5jb25zdCBpbm5lcldpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcbmNvbnN0IGlubmVySGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG5cbmNvbnN0IHhWYWx1ZSA9IChkKSA9PiBkLmRhdGU7XG5cbmNvbnN0IHJlbmRlciA9ICh7IGRhdGEsIHN0YWNrZWREYXRhIH0pID0+IHtcbiAgY29uc3QgeFNjYWxlID0gc2NhbGVUaW1lKClcbiAgICAuZG9tYWluKGV4dGVudChkYXRhLCB4VmFsdWUpKVxuICAgIC5yYW5nZShbMCwgaW5uZXJXaWR0aF0pO1xuXG4gIGNvbnN0IHlTY2FsZSA9IHNjYWxlTGluZWFyKClcbiAgICAuZG9tYWluKFtcbiAgICAgIG1pbihzdGFja2VkRGF0YSwgKGQpID0+IG1pbihkLCAoZCkgPT4gZFswXSkpLFxuICAgICAgbWF4KHN0YWNrZWREYXRhLCAoZCkgPT4gbWF4KGQsIChkKSA9PiBkWzFdKSksXG4gICAgXSlcbiAgICAucmFuZ2UoW2lubmVySGVpZ2h0LCAwXSk7XG5cbiAgY29uc3QgYXJlYUdlbmVyYXRvciA9IGFyZWEoKVxuICAgIC54KChkKSA9PiB4U2NhbGUoZC5kYXRhLmRhdGUpKVxuICAgIC55MCgoZCkgPT4geVNjYWxlKGRbMF0pKVxuICAgIC55MSgoZCkgPT4geVNjYWxlKGRbMV0pKTtcblxuICBjb25zdCBzdmcgPSBzZWxlY3QoJ2JvZHknKVxuICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodCk7XG5cbiAgY29uc3QgZyA9IHN2Z1xuICAgIC5hcHBlbmQoJ2cnKVxuICAgIC5hdHRyKFxuICAgICAgJ3RyYW5zZm9ybScsXG4gICAgICBgdHJhbnNsYXRlKCR7bWFyZ2luLmxlZnR9LCR7bWFyZ2luLnRvcH0pYFxuICAgICk7XG5cbiAgY29uc3QgcmFuZG9tID0gcmFuZG9tTm9ybWFsLnNvdXJjZShyYW5kb21MY2coMC41KSkoXG4gICAgMzAsXG4gICAgMTBcbiAgKTtcblxuICBjb25zdCBjb2xvclNjYWxlID0gc2NhbGVPcmRpbmFsKCkucmFuZ2UoXG4gICAgc3RhY2tlZERhdGEubWFwKChjb3VudHJ5LCBpKSA9PiB7XG4gICAgICBjb25zdCB0ID0gaSAvIHN0YWNrZWREYXRhLmxlbmd0aDtcbiAgICAgIHJldHVybiBoY2wodCAqIDM2MCwgNTAsIHJhbmRvbSgpKTtcbiAgICB9KVxuICApO1xuXG4gIGcuYXBwZW5kKCdnJykuY2FsbChcbiAgICBheGlzVG9wKHhTY2FsZSlcbiAgICAgIC50aWNrU2l6ZSgtaW5uZXJIZWlnaHQpXG4gICAgICAudGlja1BhZGRpbmcoNilcbiAgICAgIC50aWNrcyh0aWNrcylcbiAgKTtcbiAgZy5hcHBlbmQoJ2cnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7aW5uZXJIZWlnaHR9KWApXG4gICAgLmNhbGwoXG4gICAgICBheGlzQm90dG9tKHhTY2FsZSlcbiAgICAgICAgLnRpY2tTaXplKDApXG4gICAgICAgIC50aWNrUGFkZGluZyg1KVxuICAgICAgICAudGlja3ModGlja3MpXG4gICAgKVxuICAgIC5zZWxlY3RBbGwoJ2xpbmUnKVxuICAgIC5yZW1vdmUoKTtcblxuICAvLyBBZGQgYSBibGFjayBcImVudmVsb3BlXCIgYXMgYSBiYWNrZHJvcCBiZWhpbmQgdGhlIGxheWVycyxcbiAgLy8gc28gdGhhdCB3ZSBkb24ndCBnZXQgdW5kZXNpcmFibGUgYXJ0aWZhY3RzIHdoZXJlIHRoZVxuICAvLyB0aWNrIGxpbmVzIGFyZSBzbGlnaHRseSB2aXNpYmxlIGluIHRoZSBjcmFja3MgYmV0d2VlbiBsYXllcnMuXG4gIHN0YWNrZWREYXRhLnNvcnQoKGEsIGIpID0+IGFzY2VuZGluZyhhLmluZGV4LCBiLmluZGV4KSk7XG4gIGNvbnN0IGZpcnN0ID0gc3RhY2tlZERhdGFbMF07XG4gIGNvbnN0IGxhc3QgPSBzdGFja2VkRGF0YVtzdGFja2VkRGF0YS5sZW5ndGggLSAxXTtcbiAgY29uc3Qgb3V0bGluZVBhZGRpbmcgPSAwLjU7XG4gIGNvbnN0IGVudmVsb3BlID0gZmlyc3QubWFwKChkLCBpKSA9PlxuICAgIE9iamVjdC5hc3NpZ24oXG4gICAgICBbZFswXSAtIG91dGxpbmVQYWRkaW5nLCBsYXN0W2ldWzFdICsgb3V0bGluZVBhZGRpbmddLFxuICAgICAgeyBkYXRhOiBkLmRhdGEgfVxuICAgIClcbiAgKTtcbiAgZy5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdkJywgYXJlYUdlbmVyYXRvcihlbnZlbG9wZSkpO1xuXG4gIGcuYXBwZW5kKCdnJylcbiAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAuZGF0YShzdGFja2VkRGF0YSlcbiAgICAuZW50ZXIoKVxuICAgIC5hcHBlbmQoJ2EnKVxuICAgIC5hdHRyKFxuICAgICAgJ2hyZWYnLFxuICAgICAgKGQpID0+IGBodHRwczovL2dpdGh1Yi5jb20vc3RhbWVuLyR7ZC5rZXl9YFxuICAgIClcbiAgICAuYXR0cigndGFyZ2V0JywgJ19ibGFuaycpXG4gICAgLmFwcGVuZCgncGF0aCcpXG4gICAgLmF0dHIoJ2NsYXNzJywgJ2FyZWEnKVxuICAgIC5hdHRyKCdkJywgYXJlYUdlbmVyYXRvcilcbiAgICAuYXR0cignZmlsbCcsIChkKSA9PiBjb2xvclNjYWxlKGQua2V5KSlcbiAgICAuYXBwZW5kKCd0aXRsZScpXG4gICAgLnRleHQoKGQpID0+IGQua2V5KTtcblxuICBjb25zdCBsYWJlbHMgPSBnXG4gICAgLmFwcGVuZCgnZycpXG4gICAgLnNlbGVjdEFsbCgndGV4dCcpXG4gICAgLmRhdGEoc3RhY2tlZERhdGEpO1xuXG4gIGxhYmVsc1xuICAgIC5lbnRlcigpXG4gICAgLmFwcGVuZCgndGV4dCcpXG4gICAgLmF0dHIoJ2NsYXNzJywgJ2FyZWEtbGFiZWwnKVxuICAgIC5tZXJnZShsYWJlbHMpXG4gICAgLnRleHQoKGQpID0+IGQua2V5KVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBhcmVhTGFiZWwoYXJlYUdlbmVyYXRvcikpO1xufTtcblxuLy8gTG9hZCB0aGUgZGF0YS5cbmpzb24oZGF0YVVSTCkudGhlbigoZGF0YSkgPT4ge1xuICByZW5kZXIodHJhbnNmb3JtRGF0YShkYXRhKSk7XG59KTtcbiJdLCJuYW1lcyI6WyJ0aW1lUGFyc2UiLCJ1dGNXZWVrIiwiZ3JvdXAiLCJleHRlbnQiLCJ1dGNXZWVrcyIsImJsdXIiLCJzdGFjayIsInN0YWNrT2Zmc2V0V2lnZ2xlIiwic3RhY2tPcmRlckFwcGVhcmFuY2UiLCJzY2FsZVRpbWUiLCJzY2FsZUxpbmVhciIsIm1pbiIsIm1heCIsImFyZWEiLCJzZWxlY3QiLCJyYW5kb21Ob3JtYWwiLCJyYW5kb21MY2ciLCJzY2FsZU9yZGluYWwiLCJoY2wiLCJheGlzVG9wIiwiYXhpc0JvdHRvbSIsImFzY2VuZGluZyIsImFyZWFMYWJlbCIsImpzb24iXSwibWFwcGluZ3MiOiI7OztFQVlBLE1BQU0sU0FBUyxHQUFHQSxZQUFTLENB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
