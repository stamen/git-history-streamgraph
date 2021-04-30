const fs = require('fs');
const { exec } = require('child_process');

const clone = (repositories) => {
  exec('mkdir repositories');
  repositories.forEach((repository) => {
    let command = `git clone https://github.com/d3/${repository}.git`;
    console.log(command);
    exec(command, { cwd: './repositories' }, (error, stdout, stderr) => {});
  });
};

module.exports = clone;
