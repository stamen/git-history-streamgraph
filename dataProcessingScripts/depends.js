const fs = require('fs');
const packageText = fs.readFileSync('./d3Package.json').toString();
const packageJson = JSON.parse(packageText);
const depends = ['d3', ...Object.keys(packageJson.dependencies)];

module.exports = depends;
