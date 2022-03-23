const globby = require("globby");
// const commander = require("commander");
const path = require("path");
// const { error, chalk, fs, info } = require("./bin");
const pacote = require("pacote");
const {
  cwd,
  chalk,
  error,
  execa,
  fs,
  startSpinner,
  succeedSpiner,
  failSpinner,
  warn,
  info,
} = require("./lib");
const { program } = require("commander");
let commandsPath = [];
let pkgVersion = "";
let pkgName = "";
const getCommand = () => {
  commandsPath =
    globby.sync("./commands/*.js", { cwd: __dirname, deep: 1 }) || [];
  return commandsPath;
};

const getPkgInfo = () => {
  const jsonPath = path.join(__dirname, "../package.json");
  const jsonContent = fs.readFileSync(jsonPath, "utf-8");
  const jsonResult = JSON.parse(jsonContent);
  pkgVersion = jsonResult.version;
  pkgName = jsonResult.name;
};

const getLastestVersion = async () => {
  const mainfest = await pacote.manifest(`${pkgName}@latest`);
  info(`mainfest:${mainfest}`);
  return mainfest.version;
};

function start() {
  startSpinner(` ${chalk.blue("start")}`);
  const commandsPath = getCommand();
  commandsPath.forEach((commandPath) => {
    const commandObj = require(`./${commandPath}`);
    const { command, description, optionList, action } = commandObj;
    startSpinner(` "optionList:"${chalk.blue(optionList)}`);
    const curp = program
      .command(command)
      .description(description)
      .action(action);
    optionList &&
      optionList.map((option) => {
        curp.option(...option);
        pkgVersion;
      });
  });

  getPkgInfo();
  program.version(pkgVersion);
  program.on("command:*", async ([cmd]) => {
    program.outputHelp();
    error(`位置命令 command ${chalk.yellow(cmd)}.`);
    const latestVersion = await getLastestVersion();
    if (latestVersion !== pkgVersion) {
      info(
        `可更新版本，${chalk.green(pkgVersion)}->${chalk.green(
          latestVersion
        )} \n执行npm install -g ${pkgName}`
      );
    }
    process.exitCode = 1;
  });
  program.parseAsync(process.argv);
}
start();
