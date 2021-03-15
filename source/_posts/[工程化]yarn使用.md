---
title: <工程化>yarn使用
date: 2020-07-20 00:00:00
tags: [yarn,工程化]
categories: yarn
---

#### yarn解决的问题

1. 确定性：通过 yarn.lock 等机制，保证了确定性。即不管安装顺序如何，相同的依赖关系在任何机器和环境下，都可以以相同的方式被安装（最新npm也有实现，package-lock.json 机制）
2. 采用模块扁平安装模式：将依赖包的不同版本，按照一定策略，归结为单个版本，以避免创建多个副本造成冗余（最新npm也有实现）
3. 网络性能更好：Yarn 采用了请求排队的理念，类似并发连接池，能够更好地利用网络资源；同时引入了更好的安装失败时的重试机制
4. 采用缓存机制，实现了离线模式（最新npm也有实现）

#### 与npm区别

1. yarn.lock 并没有使用 JSON 格式，而是采用了一种自定义的标记格式
2. 相比 npm，Yarn 显著区别是 yarn.lock 中子依赖的版本号不是固定版本，单独一个 yarn.lock 确定不了 node_modules 目录结构，还需要和 package.json 文件进行配合

#### synp

- 可以将 yarn.lock 、 package-lock.json 互相转换

#### yarn缓存

- yarn cache dir // 缓存目录
- yarn cache list // 列出缓存的包
- yarn cache list --pattern <pattern>  // 列出匹配指定模式的已缓存的包

#### yarn安装机制

- 检测（checking）→ 解析包（Resolving Packages） → 获取包（Fetching Packages）→ 链接包（Linking Packages）→ 构建包（Building Packages）
1. 检测包：检测项目中是否存在一些 npm 相关文件，提示用户，也会检查系统 OS、CPU 等信息
2. 解析包：解析依赖树中每一个包的版本信息
 （1）获取当前项目中 package.json 定义的 dependencies、devDependencies、optionalDependencies 的内容（首层依赖）
 （2）采用遍历首层依赖的方式获取依赖包的版本信息，以及递归查找每个依赖下嵌套依赖的版本信息，并将解析过和正在解析的包用一个 Set 数据结构来存储，这样就能保证同一个版本范围内的包不会被重复解析
 	获取首层依赖->解析依赖->已解析情况：放到对垒中->未解析情况：是否在yarn.lock中标记->存在：获取精确版本信息->不存在：向register请求符合条件版本->确定依赖具体版本以及下载地址
3. 获取包：首先需要检查缓存中是否存在当前的依赖包，同时将缓存中不存在的依赖包下载到缓存目录，Yarn 会根据 cacheFolder+slug+node_modules+pkg.name 生成一个 path，判断系统中是否存在该 path，如果存在证明已经有缓存，不用重新下载。这个 path 也就是依赖包缓存的具体路径
4. 链接包：将项目中的依赖复制到项目 node_modules 下，同时遵循扁平化原则。在复制依赖前，Yarn 会先解析 peerDependencies，如果找不到符合 peerDependencies 的包，则进行 warning 提示，并最终拷贝依赖到项目中
5. 构建包：编译依赖包中存在的二进制包

#### 依赖包管理困境

- 早期npm中，在安装依赖时将依赖放到项目的 node_modules 文件中；同时如果某个直接依赖 A 还依赖其他模块 B，作为间接依赖，模块 B 将会被下载到 A 的 node_modules 文件夹中，依此递归执行，最终形成了一颗巨大的依赖模块树，会形成“嵌套地狱”
- 存在问题：安装结果浪费了较大的空间资源、安装过程慢、层级太深文件路径过长，在weindows中出现node_modules删除失败问题
- 解决方式：采用扁平化安装解决

#### 镜像源

- yarn config get registry
- yarn config set registry https://registry.npm.taobao.org/

#### 查看全局安装包

- yarn global list --depth=0

#### 命令

1. yarn install

```
// 在本地 node_modules 目录安装 package.json 里列出的所有依赖
yarn install

// 重新拉取所有包，即使之前已经安装的（所以以后别在删除node-modules了...）
yarn install --force

// 为 node_modules 目录指定另一位置，代替默认的 ./node_modules
yarn install --modules-folder <path>

// 不读取或生成 yarn.lock 文件
yarn install --no-lockfile

// 只安装 dependence下的包，不安装 devDependencies 的包
yarn install --production[=true|false] / --production / --prod
```

2. yarn add

```
// 会安装 latest 最新版本
yarn add package-name

// 安装包到dependencies中
yarn add <package...>

// 用 --dev 或 -D 安装包到 devDependencies
yarn add <package...> [--dev/-D]

// 用 --peer 或者 -P 安装包到 peerDependencies
yarn add <package...> [--peer/-P]

// 用 --optional 或者 -O 安装包到 optionalDependencies 
yarn add <package...> [--optional/-O]

// 用 --exact 或者 -E 会安装包的精确版本。默认是安装包的主要版本里的最新版本。 比如说， yarn add foo@1.2.3 会接受 1.9.1 版，但是 yarn add foo@1.2.3 --exact 只会接受 1.2.3 版
yarn add <package...> [--exact/-E]

// 用 --tilde 或者 -T 来安装包的次要版本里的最新版。 默认是安装包的主要版本里的最新版本。 比如说，yarn add foo@1.2.3 --tilde 会接受 1.2.9，但不接受 1.3.0
yarn add <package...> [--tilde/-T]
```

3. yarn config

```
// 查看配置key的值
yarn config get <key>

// 查看当前的配置
yarn config list

// 从配置中删除配置key
yarn config delete <key>

// 设置配置项 key 的值为 value
yarn config set <key> <value> [-g|--global]
```

4. 其他

```
// 查询当前工作文件夹所有的依赖
yarn list

// 查看包信息，可以查看特定
yarn info <package> [<field>]

// 从依赖里移除名包，同时更新你 package.json 和 yarn.lock 文件
yarn remove <package...>

// 执行用户自定义的脚本
yarn <script> [<args>]
```