const process = require("process");

const inquirer = require("inquirer");
const program = require("commander");
const chalk = require("chalk");
const readline = require("readline");

module.exports = {
  createscaffold: function (value) {
    console.log(value, "xx");
    if (!value) {
      console.log(chalk.hex("#f40")("请输入项目名"));
      return;
    } else {
    }
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "update",
          message: `Your connection to the default yarn registry seems to be slow.\n Use https://registry.npm.taobao.org for faster installation?`,
          default: true,
        },
        {
          when: (answer) => {
            if (!answer.update) {
              console.log(chalk.hex("#f40")("开始更新..."));
            }
          },
        },
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
              console.log(
                chalk.hex("#f40")("🗃  Initializing git repository...")
              );
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
  },
};
