const {exec} = require("child_process")
const depends = require("./depends"); 
console.log("dependencies", depends)
// clone each repo
depends.forEach(repo => {
  let command = `cd ${repo}; git log --pretty=format:"☕%h🔪%ad🔪%an🔪%s🔪%b" --date="iso" --no-merges --compact-summary > ../data/${repo}.001.🔪sv`
  exec(command, (error, stdout, stderr) => {
    // TODO: handle errors.
    console.log(error);
  })
})

