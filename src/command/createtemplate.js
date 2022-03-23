"use strict";
const co = require("co");
const prompt = require("co-prompt");
const config = require("../template");
const chalk = require("chalk");
const fs = require("fs");

module.exports = () => {
  co(function* () {
    let tplName = yield prompt("请输入模板名称: ");
    let gitUrl = yield prompt("Please enter Git https link: ");
    let branch = yield prompt("Please enter Branch: ");

    // 避免重复添加
    if (!config.tpl[tplName]) {
      config.tpl[tplName] = {};
      config.tpl[tplName]["url"] = gitUrl.replace(/[\u0000-\u0019]/g, ""); // 过滤unicode字符
      config.tpl[tplName]["branch"] = branch;
    } else {
      console.log(chalk.red("Template has already existed!"));
      process.exit();
    }

    // 把模板信息写入templates.json
    fs.writeFile(
      __dirname + "/../template.json",
      JSON.stringify(config),
      "utf-8",
      (err) => {
        if (err) console.log(err);
        console.log(chalk.green("New template added!\n"));
        console.log(chalk.grey("The last template list is: \n"));
        console.log(config);
        console.log("\n");
        process.exit();
      }
    );
  });
};
