const clone = require('./clone');
const knife = require('./knife');
const json = require('./json');
const combine = require('./combine');
const aggregate = require('./aggregate');

// Clone the repositories
console.log('Cloning...');
clone();

// Convert to kniveSV files
console.log('Knifing...');
knife();

// Convert to JSON files
console.log('Converting to JSON...');
json();

// Combine the output file
console.log('Combining the output file...');
combine();

// Aggregate by week
console.log('Aggregating...');
aggregate();
