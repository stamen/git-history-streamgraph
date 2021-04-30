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

module.exports = names.map(addOrg('stamen'));
