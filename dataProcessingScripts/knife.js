const { execSync } = require('child_process');
const depends = require('./depends');

const knife = () => {
  try {
    execSync('mkdir data');
  } catch (e) {}
  depends.forEach((repo) => {
    let command = `cd repositories/${repo}; git log --pretty=format:"☕%h🔪%ad🔪%an🔪%s🔪%b" --date="iso" --no-merges --compact-summary > ../../data/${repo}.001.🔪sv`;
    execSync(command, (error, stdout, stderr) => {
      if (error) console.log(error);
    });
  });
};

module.exports = knife;
