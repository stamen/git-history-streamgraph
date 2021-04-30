let fs = require('fs');
let { exec } = require('child_process');

const json = (repositories) => {
  repositories.forEach((repo) => {
    let txt = fs.readFileSync(`data/${repo}.🔪sv`).toString();
    lines = txt.split('☕');
    commits = lines.slice(1).map((line) => {
      let l = line.split('🔪');
      return {
        //hash: l[0],
        date: l[1],
        author: l[2],
        //subject: l[3],
        //body: l[4]
      };
    });
    fs.writeFileSync(`data/${repo}.json`, JSON.stringify(commits));
  });
};

module.exports = json;
