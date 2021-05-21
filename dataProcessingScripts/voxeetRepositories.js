// Useful command for listing repositories for a given org:
//
// ```
// curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/orgs/org/repos?per_page=100\&page=1 > repos_page1.json
// ```
const org = 'voxeet';
const fs = require('fs');
const reposPage1 = JSON.parse(
  fs.readFileSync(`./${org}/repos_page1.json`).toString()
);
//const reposPage2 = JSON.parse(
//  fs.readFileSync('./org/repos_page2.json').toString()
//);
const names = reposPage1
  .map((d) => d.name)
//  .concat(reposPage2.map((d) => d.name));

const addOrg = (org) => (name) => ({ name, org });

// These projects are not really "Stamen Projects" per se.
// Stamen just so happened to fork them.
const blacklist = new Set([
]);
const orgRepos = names
  .filter((name) => !blacklist.has(name))
  .map(addOrg(org));

module.exports = orgRepos
