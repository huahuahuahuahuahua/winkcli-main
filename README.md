# WINKCLI

这是一个通过命令行构建 createapp 的模板

## how to use

进入项目根路径后使用命令
`npm i`
进行依赖安装

`npm link`
在 package.json 中
`"bin": { "winkcli": "src/bin/index.js" },`

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

包名用途
commander 命令行工具，读取命令行命令，知道用户想要做什么
inquirer 交互式命令工具，给用户提供一个提问流方式
chalk 颜色插件，用来修改命令行输出样式，通过颜色区分 info、error 日志，清晰直观
ora 用于显示加载中的效果，类似于前端页面的 loading 效果，想下载模版这种耗时的操作，有了 loading 效果，可以提示用户正在进行中，请耐心等待 globby 用于检索文件
fs-extranode fs 文件系统模块的增强版 pacote 获取 node 包最新版本等信息 handlebars 提供了必要的功能，使你可以高效地构建语义化模板
