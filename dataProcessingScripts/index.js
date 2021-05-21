const clone = require('./clone');
const knife = require('./knife');
const json = require('./json');
const combine = require('./combine');
const aggregate = require('./aggregate');
const repositories = require('./repositories');
//const repositories = require('./stamenRepositories');
//const repositories = require('./voxeetRepositories');

// Clone the repositories
console.log('Cloning...');
clone(repositories);

// Convert to kniveSV files
console.log('Knifing...');
knife(repositories);

// Convert to JSON files
console.log('Converting to JSON...');
json(repositories);

// Combine the output file
console.log('Combining the output file...');
combine(repositories);

// Aggregate by week
console.log('Aggregating...');
aggregate();
