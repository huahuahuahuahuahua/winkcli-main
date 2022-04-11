[![](https://img.shields.io/badge/winkcli-@huawink-blue.svg?style=plastic)]({https://www.npmjs.com/package/winkcli-main})
[![](https://img.shields.io/github/v/release/huahuahuahuahuahua/winkcli-main.svg)]({https://www.npmjs.com/package/winkcli-main})

# WINKCLI

这是一个通过命令行构建 createapp 的模板

## how to use

进入项目根路径后使用命令
`npm i`
进行依赖安装

`npm link`
在 package.json 中

"bin": {
"winkcli": "src/bin/index.js"
},

#### 该命令可以创建一个 global 环境的命令 `winkcli`

### 显示

```js
winkcli

[err] Usage: index <command>

Options:
  -V, --version                       output the version number
  -h, --help                          display help for command

Commands:
  createscaffold|cs [options] <name>  创建应用
  create|c [options]                  创建模板
  list|l                              List all the templates
  init|i                              Generate a new project
  delete|d                            Delete a template
  encourage|en                        this is a encourage command
  help [command]                      display help for command
```

#### 即可进行使用

## 目录说明

```

│  tsconfig.json
│  README.md
│  babel.config.js
│  package.json
│  package-lock.json
│  dist
│  src
        │  index.ts
        │  template.json

        │
        ├─bin
        │      index.js				---命令行入口
        │
        └─command
                create.js			---创建模板
                createscaffold.js	---创建前端模板
                delete.js			---删除模板
                encourage.js		---鼓励语言
                init.js				---模板初始化
                list.js         	---列表显示
```
