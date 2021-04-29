const fs = require("fs")
const {exec} = require("child_process")
const depends = require("./depends"); 

console.log("dependencies", depends)
// clone each repo
//let repo = "d3"
const commits = []
depends.forEach(repo => {
  const txt = fs.readFileSync(`data/${repo}.001.json`).toString()
  const json = JSON.parse(txt)
  json.forEach(c => {
    c.repo = repo
    commits.push(c)
  })
})
fs.writeFileSync(`all-d3-commits.json`, JSON.stringify(commits))

