"use strict";

const chalk = require("chalk");
const program = require("commander");
const { create } = require("../commands/create.js");
const { isUsingYarn, checkForLatestVersion } = require("./utils");
const envinfo = require("envinfo");
const semver = require("semver");
process.env.NODE_PATH = __dirname + "/../../node_modules";
// 即用户新输入的参数值和当前已有的参数值
// const optionFunc = (newValue, preValue) => {
//   console.log(newValue, preValue);
// };
const packageJson = require("../../package.json");
// 输入版本信息，使用`create-react-app -v`的时候就用打印版本信息
program.version(packageJson.version);
// program.usage("<command>");
let projectName;
let projectOptions;
function init() {
  program
    .configureOutput({
      writeOut: (str) => process.stdout.write(`[out] ${str}`),
      writeErr: (str) =>
        process.stdout.write(`\n[err] ${str}\n run --help for more help\n`),
      outputError: (str, write) => write(chalk.hex("#f40")(str)),
    })
    .command("create <project-directory> [options...]")
    // .arguments("create <project-directory> [options]")
    .usage(
      `${chalk.green("<project-directory>")} ${chalk.blueBright("[options]")}`
    )
    .action((command, name, options) => {
      projectName = name && name[0];
      projectOptions = options;
    })
    .description("创建模板")
    .option("--force", "是否强制创建")
    .option("--verbose", "print additional logs")
    .option("--info", "print environment debug info")
    .option("--use-pnp")
    .allowUnknownOption()
    .on("--help", () => {
      console.log(
        `    Only ${chalk.green("<project-directory>")} is required.`
      );
      console.log();
      console.log(
        `    A custom ${chalk.cyan("--scripts-version")} can be one of:`
      );
      console.log(`      - a specific npm version: ${chalk.green("0.8.2")}`);
      console.log(`      - a specific npm tag: ${chalk.green("@next")}`);
      console.log(
        `      - a custom fork published on npm: ${chalk.green(
          "my-react-scripts"
        )}`
      );
      console.log(
        `      - a local path relative to the current working directory: ${chalk.green(
          "file:../my-react-scripts"
        )}`
      );
      console.log(
        `      - a .tgz archive: ${chalk.green(
          "https://mysite.com/my-react-scripts-0.8.2.tgz"
        )}`
      );
      console.log(
        `      - a .tar.gz archive: ${chalk.green(
          "https://mysite.com/my-react-scripts-0.8.2.tar.gz"
        )}`
      );
      console.log(
        `    It is not needed unless you specifically want to use a fork.`
      );
      console.log();
      console.log(`    A custom ${chalk.cyan("--template")} can be one of:`);
      console.log(
        `      - a custom template published on npm: ${chalk.green(
          "cra-template-typescript"
        )}`
      );
      console.log(
        `      - a local path relative to the current working directory: ${chalk.green(
          "file:../my-custom-template"
        )}`
      );
      console.log(
        `      - a .tgz archive: ${chalk.green(
          "https://mysite.com/my-custom-template-0.8.2.tgz"
        )}`
      );
      console.log(
        `      - a .tar.gz archive: ${chalk.green(
          "https://mysite.com/my-custom-template-0.8.2.tar.gz"
        )}`
      );
      console.log();
      console.log(
        `    If you have any problems, do not hesitate to file an issue:`
      );
      console.log(
        `      ${chalk.cyan(
          "https://github.com/facebook/create-react-app/issues/new"
        )}`
      );
      console.log();
    })
    .parse(process.argv);
  // program
  //   .command("createtemplate")
  //   .option("-f,--force <path>", "是否强制创建")
  //   .description("创建模板")
  //   .alias("c")
  //   .action(() => {
  //     require("../commands/createtemplate.js")();
  //   })
  //   .parse(process.argv);

  // program
  //   .command("list")
  //   .description("List all the templates")
  //   .alias("l")
  //   .action(() => {
  //     require("../commands/list.js")();
  //   })
  //   .parse(process.argv);

  // program
  //   .command("init")
  //   .description("Generate a new project")
  //   .alias("i")
  //   .action(() => {
  //     require("../commands/init.js")();
  //   });

  // program
  //   .command("delete")
  //   .description("Delete a template")
  //   .alias("d")
  //   .action(() => {
  //     require("../commands/delete.js")();
  //   });

  // program
  //   .command("encourage")
  //   .description("this is a encourage command")
  //   .alias("en")
  //   .action(() => {
  //     require("../commands/encourage.js")();
  //   });

  // 这个就是解析我们正常的`Node`进程，可以这么理解没有这个东东，`commander`就不能接管`Node`
  if (!projectName || projectName === "") {
    console.log(chalk.bold("\nprojectName is empty\n"));
    console.log("run --help for more help\n");
    process.exit(-1);
  }
  if (!!projectOptions.info) {
    console.log(chalk.bold("\nEnvironment Info:"));
    console.log(
      `\n  current version of ${packageJson.name}: ${packageJson.version}`
    );
    console.log(`  running from ${__dirname}`);
    return envinfo
      .run(
        {
          System: ["OS", "CPU"],
          Binaries: ["Node", "npm", "Yarn"],
          Browsers: [
            "Chrome",
            "Edge",
            "Internet Explorer",
            "Firefox",
            "Safari",
          ],
          npmPackages: ["react", "react-dom", "react-scripts"],
          npmGlobalPackages: ["create-react-app"],
        },
        {
          duplicates: true,
          showNotFound: true,
        }
      )
      .then(console.log);
  }
  checkForLatestVersion()
    .catch(() => {
      try {
        return execSync("npm view winkcli-main version").toString().trim();
      } catch (e) {
        return null;
      }
    })
    .then((latest) => {
      if (latest && semver.lt(packageJson.version, latest)) {
        console.log();
        console.error(
          chalk.yellow(
            `You are running \`winkcli-main\` ${packageJson.version}, which is behind the latest release (${latest}).\n\n` +
              "We recommend always using the latest version of winkcli-main if possible."
          )
        );
        console.log();
        console.log(
          "The latest instructions for creating a new app can be found here:\n" +
            "https://www.npmjs.com/package/winkcli-main"
        );
        console.log();
      } else {
        const useYarn = isUsingYarn();
        console.log(projectName);
        create(
          projectName,
          projectOptions.verbose,
          projectOptions.force,
          useYarn,
          projectOptions.usePnp
        );
      }
    });
}

module.exports = {
  init,
};
