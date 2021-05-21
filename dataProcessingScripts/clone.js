const fs = require('fs');
const { execSync } = require('child_process');

const clone = (repositories) => {
  try {
    execSync('mkdir repositories');
  } catch (e) {}

  repositories.forEach(({ name, org }) => {
    const command = `git clone https://github.com/${org}/${name}.git`;
    try {
      execSync(command,{ cwd: './repositories' });
    } catch (error) {
      console.log(error);
      console.log('Continuing...');
    }
  });
};

module.exports = clone;
