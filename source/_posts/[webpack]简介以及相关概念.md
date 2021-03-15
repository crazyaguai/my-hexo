---
title: <webpack>简介以及相关概念
date: 2018-12-19 00:00:00
tags: [webpack]
categories: webpack
---

### 作者为什么要开发webpack

- 为了实现代码分割功能

### 为什么要构建

- 开发分工变化：单页面应用、越来越复杂、文件越来越多
- 框架演变：由js库变为前端框架、模块化开发、新的语法特性、逻辑分层、MVVM框架
- 语言的发展：HTML(W3C)、css->less\sass\stylus预处理工具、js->ts\模块化\ES6
- 环境的变化：前端代码可以使用node环境服务
- 社区变化：github、npm 包管理需要构建
- 工具的变化：grunt\gulp\webpack\rollup
- #### 为什么要webpack
- Vue-cli\React-starter\Angular-cli 都是webpack构建的
- 支持Code-Spliting(代码分割)
- 支持模块化

### 模块化开发

- 命名空间->commonjs(只能在nodejs服务端使用)->AMD|CMD|UMD->ES6 module
- 命名空间

```
var NameSpace = {}
NameSpace.type = NameSpace.type || {}
NameSpace.type.method = function(){}
```

#### commonjs

1. 一个文件是一个模块
2. 通过 module.exports 暴露模块接口

#### AMD

1. 使用 define 定义模块、使用 require 加载模块
2. RequireJS
3. 依赖前置，提前执行

```
define(['jquery'], function ($) {
    //    methods
    function myFunc(){};

    //    exposed public methods
    return myFunc;
});
```

#### CMD

1. SeaJS
2. 尽可能懒执行

```
define(function (require, exports, module) {
    // load dependence
    var $ = require('jquery');

    //    methods
    function myFunc(){};

    //    exposed public methods
    return myFunc;
})
```

#### UMD(Universal Module Definition)通用模块解决方案

1. 判断是否支持AMD
2. 判断是否支持commonJS
3. 如果都没有，使用全局变量

```
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.jQuery);
    }
}(this, function ($) {
    //    methods
    function myFunc(){};

    //    exposed public method
    return myFunc;
}));
```

#### ESM

1. 一个文件一个模块 export/import

#### webpack支持的模块化

- AMD\ES Module(推荐)\CommonJS

#### css模块化

- CSS设计模式：OOCSS\SMACSS\Atomic css\MCSS\AMCSS\BEM
- CSS Module：

### webpack简介

#### 功能进化

- v2版本

1. Tree Shaking
2. ES Module
3. 动态 import
4. 新的文档

- v3版本

1. Scope Hoisting（作用于提升）打包后代码性能提升
2. Magic Comments (配合动态import使用) 指定打包后的文件名

- v4版本

#### 核心概念

- entry

1. 代码入口、打包入口、单个或者多个

```
module.exports = {
    entry: {
        index: 'index.js',
        vendor: ['jquery']
    }
}
```

- output

1. 对打包生成文件的描述、一个或者多个
2. https://www.webpackjs.com/configuration/output/

- Loaders

1. 处理文件、转化为模块
2. https://www.webpackjs.com/loaders/

- Plugins

1. 参与整个打包过程
2. https://www.webpackjs.com/plugins/

#### 名词

- chunk 代码块
- Bundle 打包后的文件
- Module 模块
