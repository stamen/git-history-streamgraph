const fs = require("fs")
const {exec} = require("child_process")
const depends = require("./depends"); 

const clone = () => {
  exec('mkdir repositories');
  depends.forEach(repo => {
    let command = `git clone https://github.com/d3/${repo}.git`
    exec(command, {cwd: './repositories'}, (error, stdout, stderr) => {
      // TODO: handle errors.
    })
  });
}

module.exports = clone;
