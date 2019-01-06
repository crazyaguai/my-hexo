---
title: Babel配置
date: 2018-11-14 22:24:43
tags: [ES6,js,Babel]
categories: ES6
---


### babel介绍
#### 功能
把 JavaScript 中 es2015/2016/2017/2046 的新语法转化为 es5，让低端运行环境(如浏览器和 node )能够认识并执行。
#### 阶段
总共分为三个阶段：解析，转换，生成。babel把功能分解到plugin里，需要配置插件。

#### 插件种类
语法插件、转义插件（比如转义箭头函数）

### 配置
#### 6.x
##### 安装依赖

```
"devDependencies": {
    "babel-cli": "^6.26.0",
    "babel-core": "^6.26.3",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-stage-2": "^6.24.1"
},
"dependencies": {
    "babel-runtime": "^6.26.0",
    "babel-polyfill": "^6.26.0"
}
```

##### .babelrc配置

```
{
    "presets": [
        [
            "env",
            {
                "modules": false,
                "useBuiltIns": true,
                "debug": true,
                "targets": {
                    "browsers": [
                        "chrome 70"
                    ]
                }
            }
        ]
    ],
    "plugins": [
        "babel-plugin-transform-runtime"
    ]
}
```
#### 7.x
##### 安装依赖
```
"devDependencies": {
    "@babel/cli": "^7.1.5",
    "@babel/core": "^7.1.5",
    "@babel/plugin-transform-runtime": "^7.1.0",
    "@babel/preset-env": "^7.1.5"
  },
  "dependencies": {
    "@babel/polyfill": "^7.0.0",
    "@babel/runtime": "^7.1.5",
    "@babel/runtime-corejs2": "^7.1.5"
  }
```
##### .babelrc配置
```
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                },
                "modules": false,
                "useBuiltIns": "entry"
            }
        ]
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": 2,
                "helpers": true,
                "regenerator": true,
                "useESModules": false
            }
        ]
    ]
}
```

##### .browserslistrc配置文件
```
> 1%
not dead
```
### 文档
- [babel 6.26.3](https://babeljs.io/docs/en/6.26.3/)
- [babel 7.x](https://babeljs.io/docs/en/index.html)
- [browserslist 文档](https://github.com/browserslist/browserslist)
- [一口(很长的)气了解 Babel](https://mp.weixin.qq.com/s/qetiJo47IyssYWAr455xHQ)
### .babelrc配置
#### preset
- babel 提供的一组插件的集合。官方preset(env, react, flow, minify,stage-x)
- Stage 0 - 稻草人: 只是一个想法，经过 TC39 成员提出即可。
- Stage 1 - 提案: 初步尝试。
- Stage 2 - 初稿: 完成初步规范。
- Stage 3 - 候选: 完成规范和浏览器初步实现。
- Stage 4 - 完成: 将被添加到下一年度发布。

低一级的 stage 会包含所有高级 stage 的内容，例如 stage-1 会包含 stage-2, stage-3 的所有内容。
stage-4 在下一年更新会直接放到 env 中，所以没有单独的 stage-4 可供使用。

#### Plugin
会运行在 Preset 之前。
Plugin 会从前到后顺序执行。
Preset 的顺序则 刚好相反(从后向前)。

- preset 的逆向顺序主要是为了保证向后兼容，因为大多数用户的编写顺序是 [‘es2015’, ‘stage-0’]。这样必须先执行 stage-0 才能确保 babel 不报错。因此我们编排 preset 的时候，也要注意顺序，其实只要按照规范的时间顺序列出即可。

- 简略情况下，插件和 preset 只要列出字符串格式的名字即可。但如果某个 preset 或者插件需要一些配置项(或者说参数)，就需要把自己先变成数组。第一个元素依然是字符串，表示自己的名字；第二个元素是一个对象，即配置对象。

#### env
- env 的核心目的是通过配置得知目标环境的特点，然后只做必要的转换。
如果不写任何配置项，env 等价于 latest，也等价于 es2015 + es2016 + es2017 三个相加(不包含 stage-x 中的插件)。

### 一些工具
#### babel-cli
命令行工具，安装后可以使用命令行编译文件。

```
babel script.js --watch --out-file script-compiled.js
babel script.js --out-file script-compiled.js --source-maps
```


#### babel-node
babel-node 是 babel-cli 的一部分，作用是在 node 环境中，直接运行 es2015 的代码，而不需要额外进行转码。
- babel-node = babel-polyfill + babel-register

#### babel-register
babel-register 模块改写 require 命令，为它加上一个钩子。此后，每当使用 require 加载 .js、.jsx、.es 和 .es6 后缀名的文件，就会先用 babel 进行转码。
使用时，必须首先加载 require(‘babel-register’)。
需要注意的是，babel-register 只会对 require 命令加载的文件转码，而 不会对当前文件转码。
另外，由于它是实时转码，所以 只适合在开发环境使用。

#### babel-polyfill
换新的 API，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象。
- babel-polyfill 主要有两个缺点：
1. 使用 babel-polyfill 会导致打出来的包非常大
2. babel-polyfill 会污染全局变量，给很多类的原型链上都作了修改，如果我们开发的也是一个类库供其他开发者使用，这种情况就会变得非常不可控。

#### babel-runtime 和 babel-plugin-transform-runtime
- babel-plugin-transform-runtime定义在devDependencies
- babel-runtime定义在dependencies
- 首先如果只使用babel每个被转化的文件都会插入一段代码 这就导致重复和浪费了。
使用 babel-plugin-transform-runtime 定义方法改成引用，那重复定义就变成了重复引用，就不存在代码重复的问题了。
- babel-runtime 出场了，它就是这些方法的集合处，在使用 babel-plugin-transform-runtime 的时候必须把 babel-runtime 当做依赖。
- babel-plugin-transform-runtime 不支持 实例方法 (例如 [1,2,3].includes(1))

#### babel-loader
在构建工具（webpack）uglify之前进行处理。压缩后的代码进行 babel 处理，会非常慢。
babel-loader 也会读取 .babelrc 或者 package.json 中的 babel 段作为自己的配置，之后的内核处理也是相同。

### Babel 7.x
- preset 的变更：淘汰 es201x，删除 stage-x，强推 env
- npm package 名称的变化
1. babel-cli 变成了 @babel/cli
2. babel-preset-env 变成了 @babel/preset-env，还可以省略 preset 而简写为 @babel/env
3. babel-plugin-transform-arrow-functions 变成了 @babel/plugin-transform-arrow-functions
- 不再支持低版本 node
babel 7.0 开始不再支持 nodejs 0.10, 0.12, 4, 5 这四个版本
- only 和 ignore 匹配规则的变化
在 babel 6 时，ignore 选项如果包含 .foo.js，实际上的含义 (转化为 glob) 是 ./**/.foo.js，也就是当前目录 包括子目录 的所有 foo.js 结尾的文件。这可能和开发者常规的认识有悖。
于是在 babel 7，相同的表达式 .foo.js 只作用于当前目录，不作用于子目录。如果依然想作用于子目录的，就要按照 glob 的完整规范书写为 ./**/.foo.js 才可以。only 也是相同。
- @babel/node 从 @babel/cli 中独立了
和 babel 6 不同，如果要使用 @babel/node，就必须单独安装，并添加到依赖中
#### babel-upgrade
- 不安装到本地而是直接运行命令，npm 的新功能

```
npx babel-upgrade --write
```

或者常规方式

```
npm i babel-upgrade -g
babel-upgrade --write
```

