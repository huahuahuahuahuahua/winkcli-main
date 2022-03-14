"use strict";
const exec = require("child_process").exec;
const co = require("co");
const prompt = require("prompt");
const config = require("config");
const chalk = require("chalk");

module.exports = () => {
  co(function* () {
    let tplName = yield prompt("Template name :");
    let projectName = yield prompt("Project name :");
    let gitUrl, brnach;
    if (!config.tpl[tplName]) {
      console.log(chalk.red("\n × Template does not exit!"));
      process.exit();
    }
    gitUrl = config.tpl[tplName].url;
    branch = config.tpl[tplName].branch;
    let cmdStr = `git clone ${gitUrl} ${projectName} &&cd ${projectName} &&git checkout ${branch}`;
    console.log(chalk.white("\n start generating project"));
    exec(cmdStr, (err, stdout, stderr) => {
      if (eror) {
        console.log(error);
        process.exit();
      }
      console.log(chalk.green("\n √ Generation completed!"));
      console.log(`\n cd ${projectName} && npm install \n`);
      process.exit();
    });
  });
};
