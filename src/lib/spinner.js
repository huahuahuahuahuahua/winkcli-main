const ora = require("ora");
const chalk = require("chalk");

const spinner = ora();

const startSpinner = (text) => {
  const msg = `${text}...\n`;
  spinner.start(msg);
  spinner.stopAndPersist({
    symbol: "✨",
    text: msg,
  });
};

const succeedSpiner = (text) => {
  spinner.stopAndPersist({
    symbol: "🎉",
    text: `${text}\n`,
  });
};

const failSpinner = (text) => {
  spinner.fail(chalk.red(text));
};
module.exports = {
  startSpinner,
  succeedSpiner,
  failSpinner,
};
