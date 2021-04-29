import {
  timeParse,
  utcWeek,
  utcWeeks,
  group,
  stack,
  extent,
  stackOffsetWiggle,
  stackOrderAppearance,
} from 'd3';
import { blur } from 'array-blur';

const parseDate = timeParse('%Y-%m-%d');

const layer = d => d.repo;

export const transformData = (data) => {
  data.forEach((d) => {
    d.date = utcWeek.floor(parseDate(d.date.split(' ')[0]));
  });

  // Aggregate by month and repository.
  const groupedData = group(
    data,
    (d) => d.date,
    layer
  );
  

  const layerGroupedData = group(data, layer);

  const layers = Array.from(layerGroupedData.keys());

  const [start, stop] = extent(data, (d) => d.date);
  const allWeeks = utcWeeks(start, stop);

  const dataBylayer = new Map();

  for (let layer of layers) {
    const layerData = allWeeks.map((date) => {
      const value = groupedData.get(date);
      const commits = value ? value.get(layer) : null;
      const commitCount = commits ? commits.length : 0;
      return commitCount;
    });

    // Apply smoothing
    const smoothedLayerData = blur().radius(12)(layerData);

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

  const stackedData = stack()
    .offset(stackOffsetWiggle)
    .order(stackOrderAppearance)
    .keys(layers)(transformedData);

  return { data, stackedData };
};
