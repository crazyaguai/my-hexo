---
title: <工程化>npm使用
date: 2020-12-22 00:00:00
tags: [npm,工程化]
categories: npm
---

#### 安装机制
执行npm install后流程
- 检查获取npm配置
配置获取优先级：项目级的 .npmrc 文件 > 用户级的 .npmrc 文件> 全局级的 .npmrc 文件 > npm 内置的 .npmrc 文件
- 检查是否有package-lock.json文件
有，检查 package-lock.json 和 package.json 中声明的依赖是否一致，一致，直接使用 package-lock.json 中的信息，从缓存或网络资源中加载依赖；不一致，按照 npm 版本进行处理（最新处理方式：按照package.json安装，并更新package-lock.json）；
没有，则根据 package.json 递归构建依赖树，最后生成 package-lock.json
- 安装依赖资源，检查是否缓存
存在，则将缓存内容解压到 node_modules 中
不存在，否则就先从 npm 远程仓库下载包，校验包的完整性，并添加到缓存，同时解压到 node_modules
- 构建依赖树，扁平原则
当前依赖项目不管其是直接依赖还是子依赖的依赖，优先将其放置在 node_modules 根目录，遇到相同模块就判断已放置在依赖树中的模块版本是否符合新模块的版本范围，如果符合则跳过；不符合则在当前模块的 node_modules 下放置该模块

#### 缓存机制

- 查看缓存目录 npm config get cache 缓存文件在 _cacache 文件夹下
- _cacache文件夹目录：content-v2（二进制文件，将文件改名为.tgz后解压，可以得到npm包资源）、index-v5（描述文件，对应 content-v2 里文件的索引）、tmp
- npm install下载依赖时，先下载到缓存中，在解压到node_modules下
- 在每次安装资源时，根据 package-lock.json 中存储的 integrity、version、name 信息生成一个唯一的 key，这个 key 能够对应到 index-v5 目录下的缓存记录。如果发现有缓存资源，就会找到 tar 包的 hash，根据 hash 再去找缓存的 tar 包，省去了网络下载资源的开销

#### npm 配置作用优先级

- 命令行设置配置 > env环境变量npm配置 > 项目级配置 > 用户级配置 > 全局级配置 > npm内部.npmrc配置

#### npm init

- 调用shell脚本初始化package.json文件
- 自定义 npm init 命令
```
// 需要自己编写.npm-init.js脚本
npm config set init-module ~\.npm-init.js
```

#### npm link

- 搞笑率调试本地包，验证包的可用性
```
// 调试react源码
cd build/node_modules/react
# 申明react指向
npm link
# 解除指向
npm unlink
cd build/node_modules/react-dom
# 申明react-dom指向
npm link
# 解除指向
npm unlink
# 在react项目中引入全局指向
npm link react react-dom
# 解除引用，在react项目中
npm unlink react react-dom
# 强制解除全局引用
npm rm --global packageName
```

#### npx

- 解决了 npm 的一些使用快速开发、调试，以及项目内使用全局模块的痛点
- 优点
1. 它可以直接执行 node_modules/.bin 文件夹下的文件。在运行命令时，npx 可以自动去 node_modules/.bin 路径和环境变量 $PATH 里面检查命令是否存在，而不需要再在 package.json 中定义相关的 script
2. npx 执行模块时会优先安装依赖，但是在安装执行后便删除此依赖，这就避免了全局安装模块带来的问题

#### 查看项目引用包版本
- npm outdated

#### 查看全局安装包
- npm list -g --depth 0

#### 设置安装源

1. 使用nrm
```
npm install -g nrm
nrm ls
nrm use taobao
```
2. 改变全局注册
```
npm config get registry
npm config set registry https://registry.npm.taobao.org
npm info react
```
3. 命令行置顶源
```
npm --registry https://registry.npm.taobao.org install [name]
```
4. 修改.npmrc文件
```
registry = https://registry.npm.taobao.org
```
5. 使用cnpm
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install [name]
```

#### 部署私有npm源

- 社区工具：nexus、verdaccio 以及 cnpm

#### CI上的npm优化

1. 使用 npm ci 安装依赖：npm ci 要求项目中必须存在 package-lock.json，npm ci 完全根据 package-lock.json 安装依赖，npm ci 在执行安装时，会先删除项目中现有的 node_modules，然后全新安装，npm ci 只能一次安装整个项目所有依赖包，无法安装单个依赖包，如果 package-lock.json 和 package.json 冲突，那么 npm ci 会直接报错，并非更新 lockfiles，npm ci 永远不会改变 package.json 和 package-lock.json
2. 使用 package-lock.json 优化依赖安装时间：package-lock.json 中已经缓存了每个包的具体版本和下载链接，你不需要再去远程仓库进行查询，即可直接进入文件完整性校验环节，减少了大量网络请求

#### package-lock.json相关

1. package-lock.json 文件的作用是锁定依赖安装结构，目的是保证在任意机器上执行 npm install 都会得到完全相同的 node_modules 安装结果
2. 不同版本的 npm 安装依赖策略和算法不同，package-lock.json 保证能够完整准确地还原项目依赖
3. package-lock.json 构成：
	Version：依赖包的版本号
	Resolved：依赖包安装源（可简单理解为下载地址）
	Integrity：表明包完整性的 Hash 值
	Dev：表示该模块是否为顶级模块的开发依赖或者是一个的传递依赖关系
	requires：依赖包所需要的所有依赖项，对应依赖包 package.json 里 dependencies 中的依赖项
	dependencies：依赖包 node_modules 中依赖的包（特殊情况下才存在）
4. 是否提交 package-lock.json 到仓库：
	如果开发应用，建议提交，保证项目成员、CI部署一致性
	如果开发给外部使用的库，不需要提交，库项目一般是被其他项目依赖的，在不使用 package-lock.json 的情况下，就可以复用主项目已经加载过的包，减少依赖重复和体积
5. 把 package-lock.json 一起提交到代码库中，不需要 ignore。但是执行 npm publish 命令，发布一个库的时候，它应该被忽略而不是直接发布出去

#### xxxDependencies

- dependencies 项目依赖
	它关联的 npm 包被下载时，dependencies 下的模块也会作为依赖，一起被下载
- devDependencies 开发依赖
	表示开发依赖，不会被自动下载，并不是只有在 dependencies 中的模块才会被一起打包，而在 devDependencies 中的依赖一定不会被打包。实际上，依赖是否被打包，完全取决于项目里是否被引入了该模块
- peerDependencies 同版本依赖
	表示同版本依赖，简单来说就是：如果你安装我，那么你最好也安装我对应的依赖
	使用场景：
	插件不能单独运行
	插件正确运行的前提是核心依赖库必须先下载安装
	我们不希望核心依赖库被重复下载
	插件 API 的设计必须要符合核心依赖库的插件编写规范
	在项目中，同一插件体系下，核心依赖库版本最好相同
- bundledDependencies 捆绑依赖
	bundledDependencies 和 npm pack 打包命令有关
	在 bundledDependencies 中指定的依赖包，必须先在 dependencies 和 devDependencies 声明过，否则在 npm pack 阶段会进行报错
- optionalDependencies 可选依赖
	即使对应依赖项安装失败了，也不会影响整个安装过程，不建议使用

#### npm script

- 在 package.json 中，允许通过 script 字段定义脚本
- npm 钩子：如pre、post，对应命令npm run build的钩子命令就是：prebuild和postbuild，使用npm run build时，会默认自动先执行npm run prebuild再执行npm run build，最后执行npm run postbuild

```json
{
  "scripts": {
    "prebuild": "node prebuild.js",
    "build": "node build.js",
    "postbuild": "node postbuild.js"
  }
}
```

- npm 提供 process.env.npm_lifecycle_even 环境变量，在相关 npm scripts 脚本中获得当前运行的脚本名称
- 通过 npm_package_ 获取 package.json 中的相关字段

```javascript
  // 获取 package.json 中的 name 字段值
  console.log(process.env.npm_package_name)
  // 获取 package.json 中的 version 字段值
  console.log(process.env.npm_package_version)
```

- 原理
	npm run会自动创建一个 Shell（macOS 或 Linux 中指代的是 /bin/sh， 在 Windows 中使用的是 cmd.exe）
	只要是 shell 可以运行的命令，都可以作为 npm script 脚本
	npm scripts 脚本可以使用 Shell 通配符等常规能力
- npm run 创建出来的 Shell 需要将当前目录的node_modules/.bin子目录加入PATH 变量中，在 npm scripts 执行完成后，再将 PATH 变量恢复，因此可以在 npm run 中直接使用 webpack
- 使用技巧：
	传参：使用--标记参数webpack --profile > stats.json
	串行脚本：npm run pre.js && npm run post.js
	并行脚本：npm run a.js & npm run b.js
- npm script 需要考虑平台兼容性问题
	un-script-os：针对不同平台进行不同的定制化脚本
	cross-env：设置环境变量

#### npm使用文章

- [聊聊 NPM 镜像那些险象环生的坑]：https://mp.weixin.qq.com/s/2ntKGIkR3Uiy9cQfITg2NQ

