const process = require("process");
const inquirer = require("inquirer");
const readline = require("readline");
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
const prompts = [
  //选择项目类型
  {
    type: "project",
    name: "type",
    message: "创建项目:",
    choices: [
      {
        name: "utils-ts（创建utils-ts模板）",
        value: "utils-ts",
      },
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
    message: "Pick the package manager to use when installing dependencies:",
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
];
const create = (value) => {
  console.log("create-value", value);
  if (!value) {
    console.error(chalk.hex("#f40")("请输入项目名"));
    return;
  } else {
    inquirer
      .prompt(prompts)
      .then((answer) => {
        //Use user feedback for ... whatever!!
        if (!answer.join) {
          readline.cursorTo(process.stdout, 0, 0);
          readline.clearScreenDown(process.stdout);
          return;
        }
        console.log("您的选是：", answer);
        // console.log("etx... 接着再执行一系列命令");
      })
      .catch((error) => {
        if (error.isTtyError) {
          failSpinner("Prompt couldn't be rendered in the current environment");
          //Prompt couldn't be rendered in the current environment
        } else {
          failSpinner(error);
          //something else went wrong...
        }
      });
  }
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
  const jsonPath = `${targetDir}/package.json`;
  const jsonContent = fs.readFileSync(jsonPath, "utf-8");
  const jsonResult = handlebars.compile(jsonContent)(projectInfo);
  fs.writeFileSync(jsonPath, jsonResult);
  succeedSpiner(`仓库创建完成 ${chalk.cyan(projectName)}\n\n输入命令：\n`);
  info(`$ cd ${projectName}\n$ npm install\n`);
};

const action = async (projectName, cmdArgs) => {
  try {
    const targetDir = path.join(
      (cmdArgs && cmdArgs.content) || cwd,
      projectName
    );
    if (!(await checkProjectExist(targetDir))) {
      const projectInfo = await getQuestions(projectName);
      await cloneProject(targetDir, projectName, projectInfo);
    }
  } catch (error) {
    if (!projectName) {
      console.error(chalk.hex("#f40")("请输入项目名"));
      failSpinner(error);
    }
    return;
  }
};
module.exports = {
  // create,
  command: "create <name>",
  description: "创建 react 模板",
  optionList: [
    ["--context <context>", "上下文路径"],
    ["-f,--force <path>", "是否强制创建"],
  ],
  create: action,
};
