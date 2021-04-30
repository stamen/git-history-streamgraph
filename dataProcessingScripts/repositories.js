// Useful command for listing repositories for a given org:
//
// ```
// curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/orgs/topojson/repos?per_page=100\&page=1 > repos_page1.json
// ```
// const fs = require("fs");
// const reposPage1 = JSON.parse(fs.readFileSync("./repos_page1.json").toString());
// const depends = reposPage1.map(d => d.name);
// console.log(depends);

const topojson = [
  'topojson',
  'us-atlas',
  'world-atlas',
  'topojson-specification',
  'topojson-client',
  'topojson-simplify',
  'topojson-1.x-api-reference',
  'topojson-server',
];

const d3 = [
  'd3',
  'd3-array',
  'd3-axis',
  'd3-brush',
  'd3-chord',
  'd3-color',
  'd3-contour',
  'd3-delaunay',
  'd3-dispatch',
  'd3-drag',
  'd3-dsv',
  'd3-ease',
  'd3-fetch',
  'd3-force',
  'd3-format',
  'd3-geo',
  'd3-hierarchy',
  'd3-interpolate',
  'd3-path',
  'd3-polygon',
  'd3-quadtree',
  'd3-random',
  'd3-scale',
  'd3-scale-chromatic',
  'd3-selection',
  'd3-shape',
  'd3-time',
  'd3-time-format',
  'd3-timer',
  'd3-transition',
  'd3-zoom',
];

const addOrg = (org) => (name) => ({ name, org });

module.exports = d3.map(addOrg('d3')).concat(topojson.map(addOrg('topojson')));
