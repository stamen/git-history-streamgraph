const { execSync } = require('child_process');

const knife = (repositories) => {
  try {
    execSync('mkdir data');
  } catch (e) {}
  repositories.forEach(({ name }) => {
    const command = [
      `cd repositories/${name};`,
      'git log',
      '--pretty=format:"☕%h🔪%ad🔪%an🔪%s🔪%b"',
      '--date="iso"',
      '--no-merges',
      '--compact-summary',
      `> ../../data/${name}.🔪sv`,
    ].join(' ');
    try {
      execSync(command);
    } catch (error) {
      console.log(error);
      console.log('Continuing...');
    }
  });
};

module.exports = knife;
