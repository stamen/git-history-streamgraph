const fs = require('fs');
const { exec } = require('child_process');

const combine = (repositories) => {
  const commits = [];
  repositories.forEach(({ name }) => {
    const txt = fs.readFileSync(`data/${name}.json`).toString();
    const json = JSON.parse(txt);
    json.forEach((c) => {
      c.repository = name;
      commits.push(c);
    });
  });
  fs.writeFileSync('data/all-commits.json', JSON.stringify(commits));
};

module.exports = combine;
