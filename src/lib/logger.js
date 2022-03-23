const chalk = require("chalk");

const warn = (text) => {
  console.log(chalk.yellow(`\n${text}\n`));
};

const info = (text) => {
  console.log(chalk.cyan(`\n${text}\n`));
};

const error = (text) => {
  console.log(chalk.bgRed(`\n${text}\n`));
};
module.exports = {
  warn,
  info,
  error,
};
