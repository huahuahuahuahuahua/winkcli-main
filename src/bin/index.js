#!/usr/bin/env node
"use strict";
const chalk = require("chalk");
const program = require("commander");
const { createscaffold } = require("../command/createscaffold.js");
process.env.NODE_PATH = __dirname + "/../../node_modules";
// 即用户新输入的参数值和当前已有的参数值
const optionFunc = (newValue, preValue) => {
  console.log(newValue, preValue);
};
program.version(require("../../package.json").version);
program.usage("<command>");
program
  .configureOutput({
    writeOut: (str) => process.stdout.write(`[out] ${str}`),
    writeErr: (str) => process.stdout.write(`[err] ${str}`),
    outputError: (str, write) => write(chalk.hex("#f40")(str)),
  })
  .command("createscaffold <name>")
  .alias("cs")
  .description("创建应用")
  .option("-f,--force <path>", "是否强制创建", optionFunc)
  .action((name, options, command) => {
    createscaffold(name);
  });
program
  .command("create")
  .option("-f,--force <path>", "是否强制创建", optionFunc)
  .description("创建模板")
  .alias("c")
  .action(() => {
    require("../command/create.js")();
  });
program
  .command("list")
  .description("List all the templates")
  .alias("l")
  .action(() => {
    require("../command/list.js")();
  });

program
  .command("init")
  .description("Generate a new project")
  .alias("i")
  .action(() => {
    require("../command/init.js")();
  });

program
  .command("delete")
  .description("Delete a template")
  .alias("d")
  .action(() => {
    require("../command/delete.js")();
  });

program
  .command("encourage")
  .description("this is a encourage command")
  .alias("en")
  .action(() => {
    require("../command/encourage.js")();
  });
program.parse(process.argv);
if (!program.args.length) {
  program.help();
}
