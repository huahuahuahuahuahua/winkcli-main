const process = require("process");

const inquirer = require("inquirer");
// const chalk = require("chalk");
const readline = require("readline");
// import * as path from "path";
const path = require("path");
const handlebars = require("handlebars");
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

const create = (value) => {
  console.log("create-value", value);
  if (!value) {
    console.log(chalk.hex("#f40")("请输入项目名"));
    return;
  } else {
  }
  inquirer
    .prompt([
      //选择项目类型
      {
        type: "project",
        name: "type",
        message: "创建项目:",
        choices: [
          {
            name: "react（创建react模板）",
            value: "react",
          },
          {
            name: "vue（创建vue模板）",
            value: "vue",
          },
        ],
        when: (answer) => {
          return answer.update;
        },
      },
      //选择是否使用代理
      {
        type: "confirm",
        name: "update",
        message: `Your connection to the default yarn registry seems to be slow.\n Use https://registry.npm.taobao.org for faster installation?`,
        default: true,
      },
      //开始更新
      {
        when: (answer) => {
          if (!answer.update) {
            console.log(chalk.hex("#f40")("开始更新..."));
          }
        },
      },
      //选择vue项目preset
      {
        type: "list",
        name: "preset",
        message: "Prease pick a preset:",
        choices: [
          {
            name: "Default ([Vue 2] babel,eslint)",
            value: 1,
          },
          {
            name: "Default (Vue 3)([Vue 3]) babel,eslint",
            value: 2,
          },
          {
            name: "Manually select features",
            value: 3,
          },
        ],
        when: (answer) => {
          if (answer.update) {
            console.log(chalk.red(`\n\n Vue CLI v4.5.13`));
            console.log(`
          _____                    _____                    _____                    _____                    _____                    _____            _____          
         /\    \                  /\    \                  /\    \                  /\    \                  /\    \                  /\    \          /\    \         
        /::\____\                /::\    \                /::\____\                /::\____\                /::\    \                /::\____\        /::\    \        
       /:::/    /                \:::\    \              /::::|   |               /:::/    /               /::::\    \              /:::/    /        \:::\    \       
      /:::/   _/___               \:::\    \            /:::::|   |              /:::/    /               /::::::\    \            /:::/    /          \:::\    \      
     /:::/   /\    \               \:::\    \          /::::::|   |             /:::/    /               /:::/\:::\    \          /:::/    /            \:::\    \     
    /:::/   /::\____\               \:::\    \        /:::/|::|   |            /:::/____/               /:::/  \:::\    \        /:::/    /              \:::\    \    
   /:::/   /:::/    /               /::::\    \      /:::/ |::|   |           /::::\    \              /:::/    \:::\    \      /:::/    /               /::::\    \   
  /:::/   /:::/   _/___    ____    /::::::\    \    /:::/  |::|   | _____    /::::::\____\________    /:::/    / \:::\    \    /:::/    /       ____    /::::::\    \  
 /:::/___/:::/   /\    \  /\   \  /:::/\:::\    \  /:::/   |::|   |/\    \  /:::/\:::::::::::\    \  /:::/    /   \:::\    \  /:::/    /       /\   \  /:::/\:::\    \ 
|:::|   /:::/   /::\____\/::\   \/:::/  \:::\____\/:: /    |::|   /::\____\/:::/  |:::::::::::\____\/:::/____/     \:::\____\/:::/____/       /::\   \/:::/  \:::\____\
|:::|__/:::/   /:::/    /\:::\  /:::/    \::/    /\::/    /|::|  /:::/    /\::/   |::|~~~|~~~~~     \:::\    \      \::/    /\:::\    \       \:::\  /:::/    \::/    /
 \:::\/:::/   /:::/    /  \:::\/:::/    / \/____/  \/____/ |::| /:::/    /  \/____|::|   |           \:::\    \      \/____/  \:::\    \       \:::\/:::/    / \/____/ 
  \::::::/   /:::/    /    \::::::/    /                   |::|/:::/    /         |::|   |            \:::\    \               \:::\    \       \::::::/    /          
   \::::/___/:::/    /      \::::/____/                    |::::::/    /          |::|   |             \:::\    \               \:::\    \       \::::/____/           
    \:::\__/:::/    /        \:::\    \                    |:::::/    /           |::|   |              \:::\    \               \:::\    \       \:::\    \           
     \::::::::/    /          \:::\    \                   |::::/    /            |::|   |               \:::\    \               \:::\    \       \:::\    \          
      \::::::/    /            \:::\    \                  /:::/    /             |::|   |                \:::\    \               \:::\    \       \:::\    \         
       \::::/    /              \:::\____\                /:::/    /              \::|   |                 \:::\____\               \:::\____\       \:::\____\        
        \::/____/                \::/    /                \::/    /                \:|   |                  \::/    /                \::/    /        \::/    /        
         ~~                       \/____/                  \/____/                  \|___|                   \/____/                  \/____/          \/____/         
                                                                                                                                                                           
┌───────────────────────────────────────────┐
│                                           │
│   New version available ${chalk.hex("#f40")("4.5.13")} → ${chalk.hex("#f40")(
              "4.5.15"
            )}   │
│     Run ${chalk.hex("#f40")("npm i -g @vue/cli")} to update!      │
│                                           │
└───────────────────────────────────────────┘
          `);
          }
          return answer.update;
        },
      },
      //选择使用yarn和npm
      {
        type: "list",
        name: "type",
        message:
          "Pick the package manager to use when installing dependencies:",
        choices: [
          {
            name: "Use Yarn",
            value: "yarn",
          },
          {
            name: "Use NPM",
            value: "npm",
          },
        ],
        when: (answer) => {
          return answer.update;
        },
      },
      {
        when: (answer) => {
          if (answer.type) {
            console.log(chalk.hex("#f40")("Vue CLI v4.5.13"));
            console.log(
              chalk.hex("#f40")(
                "✨  Creating project in /Users/zhiepngwan/Desktop/demo/1111."
              )
            );
            console.log(chalk.hex("#f40")("🗃  Initializing git repository..."));
            console.log(
              chalk.hex("#f40")(
                "⚙️  Installing CLI plugins. This might take a while..."
              )
            );
          }
        },
      },
      {
        type: "confirm",
        name: "join",
        message: "加入我",
        default: true,
        when: (answer) => {
          return answer.update;
        },
      },
    ])
    .then((answer) => {
      //Use user feedback for ... whatever!!
      if (!answer.join) {
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
        return;
      }
      console.log(answer);
      console.log("etx... 接着再执行一系列命令");
    })
    .catch((error) => {
      if (error.isTtyError) {
        //Prompt couldn't be rendered in the current environment
      } else {
        //something else went wrong...
      }
    });
};

const checkProjectExist = async (targetDir) => {
  if (fs.existsSync(targetDir)) {
    const answer = await inquirer.prompt({
      type: "list",
      name: "checkExist",
      message: `\n仓库路径${targetDir}已存在，请选择`,
      choices: ["覆盖", "取消"],
    });
    if (answer.checkExist === "覆盖") {
      wran(`删除${targetDir}...`);
      fs.removeSync(targetDir);
    } else {
      return true;
    }
  }
  return false;
};

const getQuestions = async (projectName) => {
  return await inquirer.prompt([
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
  ]);
};
const cloneProject = async (targetDir, projectName, projectInfo) => {
  startSpinner(`开始创建私服仓库 ${chalk.cyan(targetDir)}`);
  await fs.copy(
    path.join(__dirname, "..", "..", "project-template"),
    targetDir
  );
  const jsonPath = `${targetDir}/package.json`;
  const jsonContent = fs.readFileSync(jsonPath, utf - 8);
  const jsonResult = handlebars.compile(jsonContent)(projectInfo);
  fs.writeFileSync(jsonPath, jsonResult);

  execa.commandSync("npm install", {
    stdio: "inherit",
    cwd: targetDir,
  });

  succeedSpiner(
    `私服仓库创建完成 ${chalk.yellow(projectName)}\n👉输入一下命令开启私服：`
  );
  info(`$ cd ${projectName}\n$ sh start.sh\n`);
};

// const action = async (projectName, cmdArgs) => {
//   info("projectName:", projectName, "cmdArgs:", cmdArgs);
//   try {
//     const targetDir = path.join(
//       (cmdArgs && cmdArgs.content) || cwd,
//       projectName
//     );
//     info("targetDir:", targetDir);
//     if (!(await checkProjectExist(targetDir))) {
//       const projectInfo = await getQuestions(projectName);
//       await cloneProject(targetDir, projectName, projectInfo);
//     }
//   } catch (error) {
//     failSpinner(error);
//     return;
//   }
// };
const action = (projectName, cmdArgs) => {
  console.log("projectName:", projectName);
  console.log("cmdArgs:", cmdArgs);
};
module.exports = {
  create,
  command: "create <name>",
  description: "创建 react 模板",
  optionList: [
    ["--context <context>", "上下文路径"],
    ["-f,--force <path>", "是否强制创建"],
  ],
  action: action,
};
