---
title: webpack配置全局常量
date: 2018-09-26 14:04:10
tags: [webpack]
categories: webpack
---

### 简介

- 需求：进行项目打包时需要配置不同的服务url，手动去更改容易出错，因此将不同url打包写入程序，根据webpack配置不同打包命令。需要用到全局常量的配置。

### webpack配置文件中的全局常量

- 使用 [cross-env](https://www.npmjs.com/package/cross-env) 库可以配置webpack配置文件中的全局常量。
首先安装这个库：

```
npm install --save-dev cross-env
```

- 修改package.json中的命令：

```
"scripts": {
    "build-qa": "cross-env OUTPUT_DATA=qa node webpack/build.js"
}
```

- 此时，执行npm run build-qa命令时可以在webpack配置文件中获取相关常量：

```
//webpack.prod.conf.js文件中
console.log(process.env.OUTPUT_DATA)//qa
```

### 配置打包代码中的全局常量

- 使用 [DefinePlugin](https://www.webpackjs.com/plugins/define-plugin/) 可以配置打包代码中的常量：
具体配置：

```
new webpack.DefinePlugin({
    'process.env': {
        NODE_ENV: '"production"',
        OUTPUT_DATA: process.env.OUTPUT_DATA == 'qa' ? '"qa"' : '""'
    }
})
```

- 注意，因为这个插件直接执行文本替换，给定的值必须包含字符串本身内的实际引号。通常，有两种方式来达到这个效果，使用 '"production"', 或者使用 JSON.stringify('production')。
- 配置之后，webpack会将项目代码中的process.env.OUTPUT_DATA、process.env.NODE_ENV 变量替换为对应的常量。
- 结合以上两种方式，就可以控制webpack打包的常量了。



