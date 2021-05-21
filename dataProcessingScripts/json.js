const fs = require('fs');
const { exec } = require('child_process');

const json = (repositories) => {
  repositories.forEach(({ name }) => {
    const txt = fs.readFileSync(`data/${name}.🔪sv`).toString();
    const lines = txt.split('☕');
    const commits = lines.slice(1).map((line) => {
      const l = line.split('🔪');
      return {
        //hash: l[0],
        date: l[1],
        author: l[2],
        //subject: l[3],
        //body: l[4]
      };
    });
    fs.writeFileSync(`data/${name}.json`, JSON.stringify(commits));
  });
};

module.exports = json;
