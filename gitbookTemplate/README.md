# GitBook Introduction 使用教程

 [huawink的GitBook 地址]([huahuahuahuahuahua (huawink) (github.com)](https://github.com/huahuahuahuahuahua))

 [huawink的博客]([huawink (huahuahuahuahuahua.github.io)](https://huahuahuahuahuahua.github.io/huawink-/)) 

## 背景

由于最近有过多的md文件需要处理，所以急需一个简洁明了的文档进行处理。而gitbook可以满足我所需

## GitBook 简介

- [GitBook 官网](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.gitbook.com)
- [GitBook 文档](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2FGitbookIO%2Fgitbook)

## GitBook 准备工作

### 安装 Node.js

GitBook 是一个基于 Node.js 的命令行工具，下载安装 [Node.js](https://links.jianshu.com/go?to=https%3A%2F%2Fnodejs.org%2Fen)，安装完成之后，你可以使用下面的命令来检验是否安装成功。

```
$ node -v
v14.10.0 //后面不成功，改成v10.21.0就可以使用gitbook了
```

### 安装 GitBook

输入下面的命令来安装 GitBook。

```
$ npm install gitbook-cli -g
```

安装完成之后，你可以使用下面的命令来检验是否安装成功。

```
$ gitbook -V
CLI version: 2.3.2
GitBook version: 3.2.3
```

更多详情请参照 [GitBook 安装文档](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2FGitbookIO%2Fgitbook%2Fblob%2Fmaster%2Fdocs%2Fsetup.md) 来安装 GitBook。

### 编辑工具的安装

这里给大家介绍两个编辑工具：gitbook editer 和 typora

#### gitbook editor

这个编辑工具对新手来说是个不错的选择，它集成了 gitbook，git，Markdown 等功能，可以将书籍同步到 gitbook.com 网站和 github。
但是 gitbook editor 的注册和登录需要翻墙，而且这东西的官网进不去，所以还下不到。

#### typora

这个工具是我目前在使用的，推荐这个也没有啥特别的原因，就是我自己感觉挺好用的

下载地址:https://www.typora.io/

直接进官网下载对应平台的版本就可以了

## 先睹为快

GitBook 准备工作做好之后，我们进入一个你要写书的目录，输入如下命令。

```
$ gitbook init
warn: no summary file in this book
info: create README.md
info: create SUMMARY.md
info: initialization is finished

```

但是产生了如下的报错：
![安装gitbook的一些问题gitbook init和if (cb) cb.apply(this, ar](https://images1.tqwba.com/20200906/1etat3qqltt.png)
产生这个报错的原因在于，nodejs 的版本不对，不支持这个 gitbook.
有两个解决办法：
**一，切换 nodejs 的版本：**
切换成 nodejs 的 v10.21.0 版本就会成功。
当然啦，在这里，我又接触到了新的知识！因为 nodejs 的版本很多，所以，就有 nodejs 的版本控制工具，可以方便地切换版本！但是时间有限，都凌晨一点了！我就采用直接安装 v10.21.0 版本先解决啦~~
这是这个方法的博客地址，里面有 v10.21.0 版本的 nodejs 下载：

**二，第二个方法呢，就更方便且不要脸了，就是把报错的代码注释掉！**
直接打开报错的文件：
C:\Users\Administrator\AppData\Roaming\npm\node_modules\gitbook-cli\node_modules\npm\node_modules\graceful-fs\polyfills.js
错误的位置在代码的第 287 行

```
function statFix (orig) {
  if (!orig) return orig
  // Older versions of Node erroneously returned signed integers for
  // uid + gid.
  return function (target, cb) {
    return orig.call(fs, target, function (er, stats) {
      if (!stats) return cb.apply(this, arguments)
      if (stats.uid < 0) stats.uid += 0x100000000
      if (stats.gid < 0) stats.gid += 0x100000000
      if (cb) cb.apply(this, arguments)
    })
  }
}
```

> 这个函数的作用是用来修复 node.js 的一些 bug

注释即可

```js
  // fs.stat = statFix(fs.stat)
  // fs.fstat = statFix(fs.fstat)
  // fs.lstat = statFix(fs.lstat)
```

安装完再取消注释

#### 

可以看到会创建 README.md 和 SUMMARY.md 这两个文件，README.md 应该不陌生，就是说明文档，而 SUMMARY.md 是书的章节目录

![](https://upload-images.jianshu.io/upload_images/20760577-441ec8985e5116ab?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

其默认内容如下所示：

```
# Summary

* [Introduction](README.md)

```

接下来，我们输入 `$ gitbook serve` 命令，然后在浏览器地址栏中输入 `http://localhost:4000` 便可预览书籍。

效果如下所示：

![](https://upload-images.jianshu.io/upload_images/1944467-80941aa796f964d9)

运行该命令后会在书籍的文件夹中生成一个 `_book` 文件夹, 里面的内容即为生成的 html 文件，我们可以使用下面命令来生成网页而不开启服务器。

```
gitbook build //开启服务器。
```

下面我们来详细介绍下 GitBook 目录结构及相关文件。

## 目录结构tree

GitBook 基本的目录结构如下所示：

```
.
├── book.json
├── README.md
├── SUMMARY.md
├── chapter-1/
|   ├── README.md
|   └── something.md
└── chapter-2/
    ├── README.md
    └── something.md

```

下面我们主要来讲讲 book.json 和 SUMMARY.md 文件。

### book.json

该文件主要用来存放配置信息，这是我用于更换模板的

```
{
  "title": "gitbookTemplate",
  "author": "作者名称",
  "description": "描述",
  "language": "zh-hans",
  "gitbook": "3.2.3",
  "styles": {
    "website": "./styles/website.css"
  },
  "structure": {
    "readme": "README.md"
  },
  "links": {
    "sidebar": {
      "我的狗窝": "https://huahuahuahuahuahua.github.io/huawink-/"
    }
  },
  "plugins": [
    "-sharing",
    "splitter",
    "expandable-chapters-small",
    "anchors",
    "github",
    "github-buttons",
    "donate",
    "sharing-plus",
    "anchor-navigation-ex",
    "favicon"
  ],
  "pluginsConfig": {
    "github": {
      "url": "https://github.com/huahuahuahuahuahua"
    },
    "github-buttons": {
      "buttons": [
        {
          "user": "huahuahuahuahuahua",
          "repo": "gitbookTemplate",
          "type": "star",
          "size": "small",
          "count": true
        }
      ]
    },
    "donate": {
      "alipay": "./source/images/donate.png",
      "title": "喜欢本文的话，可以鼓励下作者哦~",
      "button": "赞赏",
      "alipayText": ""
    },
    "sharing": {
      "douban": false,
      "facebook": false,
      "google": false,
      "hatenaBookmark": false,
      "instapaper": false,
      "line": false,
      "linkedin": false,
      "messenger": false,
      "pocket": false,
      "qq": false,
      "qzone": false,
      "stumbleupon": false,
      "twitter": false,
      "viber": false,
      "vk": false,
      "weibo": false,
      "whatsapp": false,
      "all": [
        "google",
        "facebook",
        "weibo",
        "twitter",
        "qq",
        "qzone",
        "linkedin",
        "pocket"
      ]
    },
    "anchor-navigation-ex": {
      "showLevel": false
    },
    "favicon": {
      "shortcut": "./source/images/favicon.jpg",
      "bookmark": "./source/images/favicon.jpg",
      "appleTouch": "./source/images/apple-touch-icon.jpg",
      "appleTouchMore": {
        "120x120": "./source/images/apple-touch-icon.jpg",
        "180x180": "./source/images/apple-touch-icon.jpg"
      }
    }
  }
}

```

| title         | 本书标题                                                 |
| ------------- | -------------------------------------------------------- |
| author        | 本书作者                                                 |
| description   | 本书描述                                                 |
| language      | 本书语言，中文设置 "zh-hans" 即可                        |
| gitbook       | 指定使用的 GitBook 版本                                  |
| styles        | 自定义页面样式                                           |
| structure     | 指定 Readme、Summary、Glossary 和 Languages 对应的文件名 |
| links         | 在左侧导航栏添加链接信息                                 |
| plugins       | 配置使用的插件                                           |
| pluginsConfig | 配置插件的属性                                           |

### SUMMARY.md

这个文件主要决定 GitBook 的章节目录，它通过 Markdown 中的列表语法来表示文件的父子关系，下面是一个简单的示例：

```
# Summary

* [Introduction](README.md)
* [Part I](part1/README.md)
    * [Writing is nice](part1/writing.md)
    * [GitBook is nice](part1/gitbook.md)
* [Part II](part2/README.md)
    * [We love feedback](part2/feedback_please.md)
    * [Better tools for authors](part2/better_tools.md)

```

这个配置对应的目录结构如下所示:

![](https://upload-images.jianshu.io/upload_images/1944467-de97699c5919469e)

我们通过使用 `标题` 或者 `水平分割线` 将 GitBook 分为几个不同的部分，如下所示：

```
# Summary

- [Introduction](README.md)
- [测试页面](part1/README.md)
  - [Part I](part1/part1.md)
  - [Part I](part1/part2.md)

```

这个配置对应的目录结构如下所示:

![](https://upload-images.jianshu.io/upload_images/1944467-e80d5e46997e5eb4)



GitBook 有 [插件官网](https://links.jianshu.com/go?to=https%3A%2F%2Fplugins.gitbook.com%2F)，默认带有 5 个插件，highlight、search、sharing、font-settings、livereload



如果要配置使用的插件可以在 book.json 文件中加入即可，比如我们添加plugin[github](https://links.jianshu.com/go?to=https%3A%2F%2Fplugins.gitbook.com%2Fplugin%2Fgithub)，在 book.json 中加入配置如下即可：

```
{
    "plugins": [ "github" ],
    "pluginsConfig": {
        "github": {
            "url": "https://github.com/your/repo"
        }
    }
}

```

然后在终端输入 `gitbook install ./` 即可。



或者你也可以使用我写的[winkcli]([winkcli-main - npm (npmjs.com)](https://www.npmjs.com/package/winkcli-main))来创建gitbook模板





## 结语

这是我对 GitBook 使用的总结
