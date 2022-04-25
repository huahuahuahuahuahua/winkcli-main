const process = require("process");
const inquirer = require("inquirer");
const readline = require("readline");
const path = require("path");
const handlebars = require("handlebars");
const download = require("download-git-repo");
const {
  confirmNpmSupport,
  checkAppName,
  isSafeToCreateProjectIn,
  checkNpmVersion,
  checkIfOnline,
  checkThatNpmCanReadCwd,
} = require("../scripts/utils");
const {
  cwd,
  chalk,
  execa,
  fs,
  startSpinner,
  succeedSpiner,
  failSpinner,
  warn,
  info,
} = require("../lib");
//cross-spawn：这个我之前说到了没有？忘了，用来执行node进程。
const spawn = require("cross-spawn");
const checkProjectExist = async (targetDir) => {
  if (fs.existsSync(targetDir)) {
    const answer = await inquirer.prompt({
      type: "list",
      name: "checkExist",
      message: `\n仓库路径${targetDir}已存在，请选择`,
      choices: ["覆盖", "取消"],
    });
    if (answer.checkExist === "覆盖") {
      startSpinner(`删除${targetDir}...`);
      fs.removeSync(targetDir);
      succeedSpiner(`删除${targetDir}成功`);
    } else {
      return true;
    }
  }
  return false;
};

const getQuestions = async (projectName) => {
  const prompt = [
    //选择项目类型
    {
      type: "list",
      name: "project",
      message: "create创建项目:",
      choices: [
        {
          name: "utils-ts（创建utils-ts模板）",
          value: "util-template",
        },
        {
          name: "react（创建react模板）",
          value: "react-template",
        },
      ],
    },
    //文件拷贝方式
    {
      type: "list",
      name: "copyfile",
      message: "文件拷贝方式:",
      choices: [
        {
          name: "cloneProject（从本地克隆项目）",
          value: "cloneProject",
        },
        {
          name: "downloadProject（从远程git下载项目）",
          value: "downloadProject",
        },
      ],
    },
    {
      type: "input",
      name: "name",
      message: `package name:(${projectName})`,
      default: projectName,
    },
    {
      type: "input",
      name: "description",
      message: "description",
    },
    {
      type: "input",
      name: "author",
      message: "author",
    },
  ];
  return await inquirer.prompt(prompt);
  // .then((answer) => {
  //   console.log(answer);
  //   return answer;
  // })
  // .catch((error) => {
  //   if (error.isTtyError) {
  //     failSpinner("Prompt couldn't be rendered in the current environment");
  //     //Prompt couldn't be rendered in the current environment
  //   } else {
  //     failSpinner(error);
  //     //something else went wrong...
  //   }
  // });
};
const cloneProject = async (targetDir, projectName, projectInfo) => {
  startSpinner(`开始创建仓库 ${chalk.cyan(projectName)}...`);
  await fs.copy(
    path.join(__dirname, "..", "..", projectInfo.project),
    targetDir
  );
  cloneFile(targetDir, projectName, projectInfo);
};
const downloadProject = (targetDir, projectName, projectInfo) => {
  startSpinner(`开始创建仓库 ${chalk.cyan(projectName)}...`);
  info(
    `下载地址：https://github.com:huahuahuahuahuahua/${projectInfo.project}#main`
  );
  //https://github.com/huahuahuahuahuahua/winkcli-main/tree/master
  download(
    `https://github.com:huahuahuahuahuahua/${projectInfo.project}#main`,
    projectName,
    { clone: true },
    async (err) => {
      if (err) {
        failSpinner("克隆项目失败，err:", err);
        throw new Error(err);
      } else {
        succeedSpiner("克隆项目成功");
        cloneFile(targetDir, projectName, projectInfo);
      }
    }
  );
  return;
};
const cloneFile = (targetDir, projectName, projectInfo) => {
  const jsonPath = `${targetDir}/package.json`;
  const jsonContent = fs.readFileSync(jsonPath, "utf-8");
  const jsonResult = handlebars.compile(jsonContent)(projectInfo);
  fs.writeFileSync(jsonPath, jsonResult);
};
const action = async (projectName, cmdArgs) => {
  try {
    const targetDir = path.join(
      (cmdArgs && cmdArgs.content) || cwd,
      projectName
    );
    // if (!(await checkProjectExist(targetDir))) {
    const projectInfo = await getQuestions(projectName);
    if (projectInfo.copyfile === "cloneProject") {
      await cloneProject(targetDir, projectName, projectInfo);
    } else if (projectInfo.copyfile === "downloadProject") {
      downloadProject(targetDir, projectName, projectInfo);
    } else {
      console.error(chalk.hex("#f40")("请输入文件拷贝方式"));
    }
    // }
  } catch (error) {
    if (!projectName) {
      console.error(chalk.hex("#f40")("请输入项目名"));
      failSpinner(error);
    }
    console.log(error);
    console.log("Aborting installation.");
    process.exit(1);
  }
};

const create = (projectName, verbose, force, useYarn, usePnp) => {
  confirmNpmSupport();
  const root = path.resolve(projectName);
  const appName = path.basename(root);
  checkAppName(appName);
  fs.ensureDirSync(projectName);
  if (!isSafeToCreateProjectIn(root, projectName)) {
    process.exit(1);
  }
  console.log(`\nCreating a new  app in ${chalk.green(root)}.\n`);
  // 定义package.json基础内容
  const originalDirectory = process.cwd();
  process.chdir(root);
  if (!useYarn && !checkThatNpmCanReadCwd()) {
    process.exit(1);
  }
  if (!useYarn) {
    const npmInfo = checkNpmVersion();
    if (!npmInfo.hasMinNpm) {
      if (npmInfo.npmVersion) {
        console.log(
          chalk.yellow(
            `You are using npm ${npmInfo.npmVersion} so the project will be bootstrapped with an old unsupported version of tools.\n\n` +
              `Please update to npm 6 or higher for a better, fully supported experience.\n`
          )
        );
      }
      // Fall back to latest supported react-scripts for npm 3
      // version = "react-scripts@0.9.x";
    }
  } else if (usePnp) {
    const yarnInfo = checkYarnVersion();
    if (yarnInfo.yarnVersion) {
      if (!yarnInfo.hasMinYarnPnp) {
        console.log(
          chalk.yellow(
            `You are using Yarn ${yarnInfo.yarnVersion} together with the --use-pnp flag, but Plug'n'Play is only supported starting from the 1.12 release.\n\n` +
              `Please update to Yarn 1.12 or higher for a better, fully supported experience.\n`
          )
        );
        // 1.11 had an issue with webpack-dev-middleware, so better not use PnP with it (never reached stable, but still)
        usePnp = false;
      }
      if (!yarnInfo.hasMaxYarnPnp) {
        console.log(
          chalk.yellow(
            "The --use-pnp flag is no longer necessary with yarn 2 and will be deprecated and removed in a future release.\n"
          )
        );
        // 2 supports PnP by default and breaks when trying to use the flag
        usePnp = false;
      }
    }
  }
  run(root, appName, verbose, force, originalDirectory, useYarn);
};

const run = async (
  root,
  appName,
  verbose,
  originalDirectory,
  useYarn,
  usePnp
) => {
  console.log("Installing packages. This might take a couple of minutes.");
  isOnline = await checkIfOnline();
  install(root, appName, verbose, originalDirectory, useYarn, usePnp, isOnline);
};
const install = async (
  root,
  appName,
  verbose,
  force,
  originalDirectory,
  useYarn,
  usePnp,
  isOnline
) => {
  await action(appName, cwd);
  return new Promise((resolve, reject) => {
    let command;
    let args;
    // console.log("appName:", appName);
    if (useYarn) {
      command = "yarnpkg";
      args = ["add", "--exact"];
      if (!force) {
        args.push("--force");
      }
      if (!isOnline) {
        args.push("--offline");
      }
      if (usePnp) {
        args.push("--enable-pnp");
      }
      [].push.apply(args);

      // Explicitly set cwd() to work around issues like
      // https://github.com/facebook/create-react-app/issues/3326.
      // Unfortunately we can only do this for Yarn because npm support for
      // equivalent --prefix flag doesn't help with this issue.
      // This is why for npm, we run checkThatNpmCanReadCwd() early instead.
      args.push("--cwd");
      args.push(root);
      if (!isOnline) {
        console.log(chalk.yellow("You appear to be offline."));
        console.log(chalk.yellow("Falling back to the local Yarn cache."));
        console.log();
      }
    } else {
      command = "npm";
      args = [
        "install",
        "--no-audit", // https://github.com/facebook/create-react-app/issues/11174
        "--save",
        "--save-exact",
        "--loglevel",
        "error",
      ].concat();
      if (usePnp) {
        console.log(chalk.yellow("NPM doesn't support PnP."));
        console.log(chalk.yellow("Falling back to the regular installs."));
        console.log();
      }
    }

    if (verbose) {
      args.push("--verbose");
    }
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("close", (code) => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(" ")}`,
        });
        return;
      }
      succeedSpiner(`仓库创建完成 ${chalk.cyan(projectName)}\n\n输入命令：`);
      info(`$ cd ${projectName}\n$ npm install\n`);
      resolve();
    });
  });
};

module.exports = {
  create,
  command: "create <name>",
  description: "创建 react 模板",
  optionList: [
    ["--context <context>", "上下文路径"],
    ["-f,--force <path>", "是否强制创建"],
  ],
  // create: action,
};
