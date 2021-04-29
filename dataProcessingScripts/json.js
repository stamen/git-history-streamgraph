let fs = require("fs")
let {exec} = require("child_process")
const depends = require("./depends"); 
console.log("dependencies", depends)
// clone each repo
//let repo = "d3"
depends.forEach(repo => {
  let txt = fs.readFileSync(`data/${repo}.001.🔪sv`).toString()
  lines = txt.split("☕")
  commits = lines.slice(1).map(line => {
    let l = line.split("🔪");
    return {
      //hash: l[0],
      date: l[1],
      author: l[2],
      //subject: l[3],
      //body: l[4]
    };
  })
  fs.writeFileSync(`data/${repo}.001.json`, JSON.stringify(commits))
})

