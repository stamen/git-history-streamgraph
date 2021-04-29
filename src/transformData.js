import {
  timeParse,
  stack,
  extent,
  stackOffsetWiggle,
  stackOrderAppearance,
} from 'd3';
import { blur } from 'array-blur';

const parseDate = timeParse('%Y-%m-%d');

const layer = d => d.repo;

export const transformData = (data) => {
  const layers = Object.keys(data.repositories);
  const dates = data.dates.map(d => parseDate(d));

  const dataBylayer = new Map();

  for (let layer of layers) {
    const layerData = data.repositories[layer];

    // Apply smoothing
    const smoothedLayerData = blur().radius(12)(layerData);

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

  const stackedData = stack()
    .offset(stackOffsetWiggle)
    .order(stackOrderAppearance)
    .keys(layers)(transformedData);

  return { dates, stackedData };
};
