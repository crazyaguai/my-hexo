---
title: yarn使用
date: 2019-12-15 21:36:29
tags: [yarn]
categories: yarn
---


#### 镜像源

- yarn config get registry
- yarn config set registry https://registry.npm.taobao.org/

#### 缓存

- yarn cache dir
- yarn cache list
- yarn cache list --pattern <pattern>  列出匹配指定模式的已缓存的包

#### 命令

1. yarn install

```
yarn install / yarn  在本地 node_modules 目录安装 package.json 里列出的所有依赖
yarn install --force 重新拉取所有包，即使之前已经安装的（所以以后别在删除node-modules了...）
yarn install --modules-folder <path> 为 node_modules 目录指定另一位置，代替默认的 ./node_modules
yarn install --no-lockfile 不读取或生成 yarn.lock 文件
yarn install --production[=true|false] / --production / --prod 只安装 dependence下的包，不安装 devDependencies 的包
```

2. yarn add

```
yarn add package-name 会安装 latest 最新版本。
yarn add <package...>  安装包到dependencies中
yarn add <package...> [--dev/-D]  用 --dev 或 -D 安装包到 devDependencies
yarn add <package...> [--peer/-P]  用 --peer 或者 -P 安装包到 peerDependencies
yarn add <package...> [--optional/-O] 用 --optional 或者 -O 安装包到 optionalDependencies 
yarn add <package...> [--exact/-E] 用 --exact 或者 -E 会安装包的精确版本。默认是安装包的主要版本里的最新版本。 比如说， yarn add foo@1.2.3 会接受 1.9.1 版，但是 yarn add foo@1.2.3 --exact 只会接受 1.2.3 版。
yarn add <package...> [--tilde/-T]  用 --tilde 或者 -T 来安装包的次要版本里的最新版。 默认是安装包的主要版本里的最新版本。 比如说，yarn add foo@1.2.3 --tilde 会接受 1.2.9，但不接受 1.3.0。
```

3. yarn config

```
yarn config get <key> 查看配置key的值
yarn config list 查看当前的配置
yarn config delete <key> 从配置中删除配置key
yarn config set <key> <value> [-g|--global] 设置配置项 key 的值为 value
```

4. 其他

```
yarn list 查询当前工作文件夹所有的依赖
yarn info <package> [<field>]  查看包信息，可以查看特定
yarn remove <package...>  从依赖里移除名包，同时更新你 package.json 和 yarn.lock 文件。
yarn <script> [<args>] 执行用户自定义的脚本
```