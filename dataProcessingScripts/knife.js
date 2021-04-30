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
    execSync(command, (error, stdout, stderr) => {
      if (error) console.log(error);
    });
  });
};

module.exports = knife;
