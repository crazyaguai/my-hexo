---
title: webpack-搭建环境以及相关优化
date: 2018-12-21 17:39:22
tags: [webpack]
categories: webpack
---

### webpack watch mode
- 使用方式
```
webpack -watch
webpack -w
```
- 不会建立web服务器
### webpack-dev-server
- live reloading (重新刷新浏览器)
- 路径重定向
- https
- 在浏览器显示编译错误
- 接口代理
- 模块热更新（不刷新浏览器更新代码）https://www.webpackjs.com/guides/hot-module-replacement/
- 基本配置 https://www.webpackjs.com/configuration/dev-server/
### express + webpack-dev-middleware

### 开启source-map
#### js开启source-map
- Devtool
1. 开发环境使用 cheap-module-source-map\source-map
2. 生产环境使用 一般不用，如果修改问题可以配置为source-map
- 生产环境uglify压缩时需要开启配置
- webpack.SourceMapDevToolPlugin
- webpack.EvalSourceMapDevToolPlugin
#### css开启source-map
- 开启相关loader的sourcemap配置
### 开发环境和生产环境的区别
#### 开发环境
1. 模块热更新
2. sourceMap
3. 接口代理
4. 代码规范检查
#### 生产环境
1. 提取公共代码
2. 压缩混淆
3. 文件压缩或base64编码
4. 去除无用代码 tree-shaking
5. 分离css
6. 打包代码配置
### 打包结果分析
- 官方 Offical Analyse Tool
1. 命令
```
webpack --profile --json >stats.json
webpack --profile --json | Out-file 'stats.json' - Encoding //windows下命令
```
2. 官方分析地址 http://webpack.github.io/analyse/
- webpack-bundle-analyzer
1. 抵用插件BundleAnalyzerPlugin https://www.npmjs.com/package/webpack-bundle-analyzer
2. 命令行
```
webpack-bundle-analyzer stats.json
```

### 优化打包速度
1. 分开vendor与app（第三方与开发文件）使用Dllplugin与DllReferencePlugin
2. UglifyJsPlugin 配置参数 parallel:true（并行处理压缩）
3. UglifyJsPlugin cache缓存
4. HappyPach 并行处理 loader
5. babel-loader 配置 cacheDirectory开启缓存、配置include exlude规定范围
6. 其他
- 减少 resolve
- 去除 source-map
- cache-loader
- 升级 node\webpack
### 长缓存优化
#### 场景1：app改变vendor也改变了
1. 提取vendor
2. 解决hash变化问题：hash->chunkhash(将打包的hash变为代码快的hash)，将output[hash]改为[chunkhash]
3. 提取 manifest 文件（提取webpack runtime 代码）
#### 场景2：引入新的模块，模块顺序发生变化，vendor hash变化了（因为chunkId变了）
1. NameChunksPlugin 改变chunk名
2. 保持moduleId稳定 NameModulesPlugin （如果想看打包module name命令行添加 --display-modules）
3. 或者使用HashedModuleIdsPlugin 保持moduleId稳定
- vue配置
```
// 保持chunkId不变
new webpack.NamedChunksPlugin(),
// 保持moduleID稳定
new webpack.HashedModuleIdsPlugin(),
```
#### 场景3：动态引入时vendor hash发生变化（异步加载的包改变）
1. 在动态引入的代码中添加 异步module名称
```
import(/* webpackChunkName: "print" */ './print')
```
#### 总结优化打包
1. 独立打包vendor
2. 抽出manifest
3. NameChunksPlugin\NameModulesPlugin\HashedModuleIdsPlugin
4. 动态加载模块设置名称
