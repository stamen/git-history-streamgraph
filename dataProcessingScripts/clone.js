const fs = require('fs');
const { exec } = require('child_process');
const depends = require('./depends');

const clone = () => {
  exec('mkdir repositories');
  depends.forEach((repo) => {
    let command = `git clone https://github.com/d3/${repo}.git`;
    console.log(command);
    exec(command, { cwd: './repositories' }, (error, stdout, stderr) => {});
  });
};

module.exports = clone;
