const fs = require('fs');
const { exec } = require('child_process');

const combine = (repositories) => {
  const commits = [];
  repositories.forEach((repository) => {
    const txt = fs.readFileSync(`data/${repository}.json`).toString();
    const json = JSON.parse(txt);
    json.forEach((c) => {
      c.repository = repository;
      commits.push(c);
    });
  });
  fs.writeFileSync('data/all-commits.json', JSON.stringify(commits));
};

module.exports = combine;
