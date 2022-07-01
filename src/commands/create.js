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
  checkYarnVersion,
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
const checkProjectExist = async (targetDir, projectName) => {
  if (fs.existsSync(targetDir)) {
    // 存在时判断是否安全
    if (!isSafeToCreateProjectIn(targetDir, projectName)) {
      process.exit(1);
    }
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
          name: "react（创建react模板）无",
          value: "react-template",
        },
        {
          name: "webpack-vue-ts模板 无",
          value: "webpack-vue-ts",
        },
        {
          name: "webpack-react-ts模板 无",
          value: "webpack-react-ts",
        },
        {
          name: "gitbookTemplate模板",
          value: "gitbookTemplate",
        },
      ],
    },
    //文件拷贝方式
    {
      type: "list",
      name: "copyfile",
      message: "文件拷贝方式:",
      choices: [
        // 不想要用本地克隆了，太费劲了
        // {
        //   name: "cloneProject（从本地克隆项目）",
        //   value: "cloneProject",
        // },
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
      message: "description：",
    },
    {
      type: "input",
      name: "author",
      message: "author：",
    },
  ];
  return await inquirer.prompt(prompt);
};
// 克隆模板到创建的项目目录中
const cloneProject = async (targetDir, projectName, projectInfo) => {
  startSpinner(`开始创建仓库 ${chalk.cyan(projectName)}...`);
  await fs.copy(
    path.join(__dirname, "..", "..", projectInfo.project),
    targetDir
  );
  cloneFile(targetDir, projectName, projectInfo);
};
// github下载项目下来
const downloadProject = async (targetDir, projectName, projectInfo) => {
  return new Promise((resolve, reject) => {
    startSpinner(`开始创建仓库 ${chalk.cyan(projectName)}...`);
    info(
      `下载地址：https://github.com:huahuahuahuahuahua/${projectInfo.project}#master`
    );
    //https://github.com/huahuahuahuahuahua/winkcli-main/tree/master
    download(
      `https://github.com:huahuahuahuahuahua/${projectInfo.project}#master`,
      projectName,
      { clone: true },
      async (err) => {
        if (err) {
          failSpinner("克隆github项目失败，err:", err);
          throw new Error(err);
        } else {
          succeedSpiner("克隆github项目成功");
          await cloneFile(targetDir, projectName, projectInfo);
          resolve();
        }
      }
    );
  });
  return;
};
const cloneFile = async (targetDir, projectName, projectInfo) => {
  return new Promise((resolve, reject) => {
    const jsonPath = `${targetDir}/package.json`;
    const jsonContent = fs.readFileSync(jsonPath, "utf-8");
    const jsonResult = handlebars.compile(jsonContent)(projectInfo);
    fs.writeFileSync(jsonPath, jsonResult);
    resolve();
  }).catch((err) => failSpinner("克隆项目到目录失败，err:", err));
};

const downloadProjectAction = async (projectName, cmdArgs) => {
  try {
    const targetDir = path.join(
      (cmdArgs && cmdArgs.content) || cwd,
      projectName
    );
    const projectInfo = await getQuestions(projectName);
    if (projectInfo.copyfile === "cloneProject") {
      // 暂时废除不维护
      // await cloneProject(targetDir, projectName, projectInfo);
    } else if (projectInfo.copyfile === "downloadProject") {
      await downloadProject(targetDir, projectName, projectInfo);
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
// 创建项目
const create = async (projectName, verbose, force, useYarn, usePnp) => {
  // 确认npm是否支持
  confirmNpmSupport();
  const root = path.resolve(projectName);
  // path = "D:\filecat\dog.jpg";  dog.jpg
  const appName = path.basename(root);
  // 检查名称是否合法
  checkAppName(appName);
  // 检查项目是否存在
  await checkProjectExist(root, projectName);

  console.log(`\nCreating a new  app in ${chalk.green(root)}.\n`);
  // 定义package.json基础内容
  const originalDirectory = process.cwd();
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
  // 拷贝文件并安装依赖
  installPackage(
    root,
    appName,
    verbose,
    force,
    originalDirectory,
    useYarn,
    usePnp
  );
};
// 拷贝文件并安装依赖
const installPackage = async (
  root,
  appName,
  verbose,
  force,
  originalDirectory,
  useYarn,
  usePnp
) => {
  console.log("Installing packages. This might take a couple of minutes.");
  const isOnline = await checkIfOnline();
  // 下载文件下来
  await downloadProjectAction(appName, cwd);

  // 切换到文件夹目录中
  process.chdir(root);
  // npm or yarn 安装
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
    startSpinner(`开始安装依赖 ${chalk.cyan(projectName)}...`);
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("close", (code) => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(" ")}`,
        });
        return;
      }
      succeedSpiner(`仓库创建完成 ${chalk.cyan(appName)}\n\n输入命令：`);
      info(`$ cd ${appName}\n进入项目,查看package.json scripts启动项目`);
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
};
