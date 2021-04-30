// Useful command for listing repositories for a given org:
//
// ```
// curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/orgs/stamen/repos?per_page=100\&page=1 > repos_page1.json
// ```
const fs = require('fs');
const reposPage1 = JSON.parse(
  fs.readFileSync('./stamen/repos_page1.json').toString()
);
const reposPage2 = JSON.parse(
  fs.readFileSync('./stamen/repos_page2.json').toString()
);
const names = reposPage1
  .map((d) => d.name)
  .concat(reposPage2.map((d) => d.name));

const addOrg = (org) => (name) => ({ name, org });

// These projects are not really "Stamen Projects" per se.
// Stamen just so happened to fork them.
const blacklist = new Set([
  'mapbox-gl-js',
  'openmaptiles',
  'xyz-showcase',
  'WhirlyGlobe',
  'react-fullpage',
  'react-dropdown',
  'react-autosuggest',
  'react-slick',
  'natural-earth-vector',
  'react-typeahead',
  'openstreetmap-carto',
  'intro.js',
  'leaflet-rails',
  'osm',
  'GetOutside',
  'Cinder-MsKinect',
  'tm2',
]);
const stamenRepos = names
  .filter((name) => !blacklist.has(name))
  .map(addOrg('stamen'));

// curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/orgs/Citytracking/repos?per_page=100\&page=1 > repos_page1.json
const cityTrackingRepos = JSON.parse(
  fs.readFileSync('./stamen/Citytracking/repos_page1.json').toString()
)
  .map((d) => d.name)
  .map(addOrg('Citytracking'));

// curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/orgs/cityenergyproject/repos?per_page=100\&page=1 > repos_page1.json
const cityEnergyRepos = JSON.parse(
  fs.readFileSync('./stamen/cityenergyproject/repos_page1.json').toString()
)
  .map((d) => d.name)
  .map(addOrg('cityenergyproject'));

// curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/orgs/oceanplanning/repos?per_page=100\&page=1 > repos_page1.json
const oceanplanningRepos = JSON.parse(
  fs.readFileSync('./stamen/oceanplanning/repos_page1.json').toString()
)
  .map((d) => d.name)
  .map(addOrg('oceanplanning'));

// curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/orgs/openterrain/repos?per_page=100\&page=1 > repos_page1.json
const openterrainRepos = JSON.parse(
  fs.readFileSync('./stamen/openterrain/repos_page1.json').toString()
)
  .map((d) => d.name)
  .map(addOrg('openterrain'));

const panoramaRepos = [
  'panorama',
  'panorama-template',
  'panorama-overlandtrails',
  'panorama-foreignborn',
  'panorama-forcedmigration',
  'panorama-canals',
].map(addOrg('americanpanorama'));

module.exports = stamenRepos
  .concat(panoramaRepos)
  .concat(cityTrackingRepos)
  .concat(openterrainRepos)
  .concat(oceanplanningRepos);
