---
title: postcss相关
date: 2019-01-31 20:02:45
tags: [css,postcss]
categories: postcss
---

### postcss做了什么

1. postcss 将你的 css 文件转变成 JS 对象
2. postcss 插件会遍历生成的js对象添加/删除/修改选择器或属性
3. postcss 将该对象转换成 css 文件

### webpack配置postcss

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'postcss-loader'],
      },
      {
        test: /\.jsx?$/,
        use: ['babel-loader', 'astroturf/loader'],
      }
    ]
  }
}
```
### 常用postcss插件

#### autoprefixer

- 添加浏览器前缀

#### postcss-import

- 解析@import路径用
- https://github.com/postcss/postcss-import

#### postcss-url

- 解析url()，可以改路径、转换base64、复制加hash
- https://github.com/postcss/postcss-url

#### postcss-plugin-px2rem

- 转换px为rem
- https://github.com/pigcan/postcss-plugin-px2rem

### .postcssrc.js文件配置

```
module.exports = {
    "plugins": {
        "postcss-import": {},
        "postcss-url": {},
        "postcss-plugin-px2rem": {
            //设计稿尺寸/10
            rootValue: 37.5,
            //屏蔽的属性
            propBlackList: ['border'],
            //屏蔽的路径
            exclude: /src/,
        },
        "autoprefixer": {}
    }
}
```
