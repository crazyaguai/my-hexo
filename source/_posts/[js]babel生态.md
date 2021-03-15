---
title: <js>babel生态
date: 2018-11-14 00:00:00
tags: [ES6,js,Babel]
categories: ES6
---

### core-js

- 由 Lerna 搭建的 Monorepo 风格的项目
- core-js 将自身能力充分解耦，提供出的多个包都可以被其他项目所依赖
	core-js-compact 可以被 Babel 生态使用，由 Babel 分析出根据环境需要按需加载的垫片；
	core-js-builder 可以被 Node.js 服务使用，构建出不同场景的垫片包。

#### core-js相关包

1. core-js


- core-js 实现的基础垫片能力，是整个 core-js 的逻辑核心

2. core-js-pure

- core-js-pure 提供了不污染全局变量的垫片能力

```javascript
import _from from 'core-js-pure/features/array/from';
import _flat from 'core-js-pure/features/array/flat';
```

3. core-js-compact

- core-js-compact 维护了按照browserslist规范的垫片需求数据

```javascript
const {
  list, // array of required modules
  targets, // object with targets for each module
} = require('core-js-compat')({
  targets: '> 2.5%'
});
```

4. core-js-builder

- core-js-builder 可以结合 core-js-compact 以及 core-js，并利用 webpack 能力，根据需求打包出 core-js 代码

```javascript
require('core-js-builder')({
  targets: '> 0.5%',
  filename: './my-core-js-bundle.js',
}).then(code => {}).catch(error => {});
```

5. core-js-bundle

#### polyfill 方案

- 核心原则：按照用户终端环境、按照业务代码使用情况

1. 手动打补丁：

- es5-shim 和 es6-shim 方案
- 缺点：方案原始而难以维护，同时对于 polyfill 的实现要求较高

2. babel-polyfill 方案：

- babel-polyfill 融合了 core-js 和 regenerator-runtime
- 缺点：如果粗暴地使用 babel-polyfill 一次性全量导入到项目中，会导致项目 size 过大

3. babel-polyfill 结合 @babel/preset-env + useBuiltins（entry） + preset-env targets 的方案

- @babel/preset-env 定义了 Babel 所需插件预设，同时由 Babel 根据 preset-env targets 配置的支持环境，自动按需加载 polyfills

```javascript
// babel配置
{
  "presets": [
    ["@babel/env", {
      useBuiltIns: 'entry',
      targets: { chrome: 44 }
    }]
  ]
}

// 工程入口处
import '@babel/polyfill';

// 编译后
import "core-js/XXXX/XXXX";
import "core-js/XXXX/XXXXX";
```

4. 在线动态打补丁

- Polyfill.
- 在高版本浏览器上，可能会返回空内容，因为该浏览器已经支持了 ES2015 特性。如果在低版本浏览器上，将会得到真实的 polyfills bundle

```
<script src="https://polyfill.io/v3/polyfill.min.js?features=es2015"></script>
```

### babel

- 是一个 JavaScript 的“编译器”
- 功能：
	语法转换，一般是高级语言特性的降级；
	Polyfill（垫片/补丁）特性的实现和接入；
	源码转换，比如 JSX 等。
- 理念
	可插拔（Pluggable）：Babel 需要有一套灵活的插件机制，召集第三方开发者力量，同时还需要方便接入各种工具
	可调式（Debuggable）：编译过程中提供 source map
	基于协定（Compact）：实现灵活的配置方式,帮助开发者在“尽量还原规范”和“更小的编译产出体积”之间，找到平衡

#### babel相关包

1. @babel/core

- Babel 实现转换的核心，它可以根据配置，进行源码的编译转换

```javascript
var babel = require("@babel/core");

babel.transform(code, options, function(err, result) {
  result; // => { code, map, ast }
});
```

2. @babel/cli

- Babel 提供的命令行，它可以在终端中通过命令行方式运行，编译文件或目录
- @babel/cli 使用了 commander 库搭建基本的命令行开发
- @babel/cli 负责获取配置内容，并最终依赖了 @babel/core 完成编译

3. @babel/standalone

- 在非 Node.js 环境（比如浏览器环境）自动编译含有 text/babel 或 text/jsx 的 type 值的 script 标签，并进行编译
- 编译行为由 @babel/core 提供
- @babel/standalone 可以在浏览器中直接执行，因此这个包对于浏览器环境动态插入高级语言特性的脚本、在线自动解析编译非常有意义
- Babel 官网也用到了这个包，JSFiddle、JS Bin 等也都是 @babel/standalone 的受益者


```javascript
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">// 含有type="text/babel"进行编译
	const getMessage = () => "Hello World";
	document.getElementById('output').innerHTML = getMessage();
</script>
```

4. @babel/parser、@babel/code-frame、@babel/generator、@babel/traverse、@babel/types

- @babel/parser
	Babel 用来对 JavaScript 语言解析的解析器
	require("@babel/parser").parse()方法可以返回给我们一个针对源码编译得到的 AST

- @babel/traverse
	可以对 babel AST 进行遍历，可以在遍历过程中进行修改

- @babel/types
	包提供了对具体的 AST 节点的修改能力

- @babel/generator
	对新的 AST 进行聚合并生成 JavaScript 代码

5. @babel/preset-env

- 直接暴露给开发者在业务中运用的包能力
- @babel/preset-env 允许我们配置需要支持的目标环境（一般是浏览器范围或 Node.js 版本范围），利用 babel-polyfill 完成补丁的接入
- 通过 targets 参数，按照 browserslist 规范，结 合core-js-compat，筛选出适配环境所需的 polyfills

6. @babel/polyfill

- @babel/polyfill 其实就是 core-js 和 regenerator-runtime 两个包的结合
- @babel/polyfill 源码层面，通过 build-dist.sh 脚本，利用 browserify 进行打包
- @babel/polyfill 目前已经计划废弃，新的 Babel 生态（@babel/preset-env V7.4.0 版本）鼓励开发者直接在代码中引入 core-js 和 regenerator-runtime

7. @babel/plugin-transform-runtime

- 可以重复使用 Babel 注入的 helpers 函数，达到节省代码大小的目的
- 例如：将 _instanceof _classCallCheck 等helper函数，转换为引入
- helper 函数由 @babel/runtime 给出

```javascript
// 源代码
class Person{}

// 使用babel编译后
function _instanceof(left, right) { 
  // ...
}
function _classCallCheck(instance, Constructor) { 
  if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); }
}
var Person = function Person() {
  _classCallCheck(this, Person);
};

// 使用 @babel/plugin-transform-runtime 后
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var Person = function Person() {
  (0, _classCallCheck2.default)(this, Person);
};
```

8. @babel/runtime

- @babel/runtime含有 Babel 编译所需的一些运行时 helpers 函数，供业务代码引入模块化的 Babel helpers 函数
- 同时它提供了 regenerator-runtime，对 generator 和 async 函数进行编译降级
	@babel/plugin-transform-runtime 需要和 @babel/runtime 配合使用；
	@babel/plugin-transform-runtime 用于编译时，作为 devDependencies 使用；
	@babel/plugin-transform-runtime 将业务代码编译，引用 @babel/runtime 提供的 helpers，达到缩减编译产出体积的目的；
	@babel/runtime 用于运行时，作为 dependencies 使用
- 除了可以对产出代码瘦身以外，还能避免污染全局作用域

9. @babel/plugin

- 是 Babel 插件集合
	@babel/plugin-syntax-* 是 Babel 的语法插件
	@babel/plugin-proposal-* 用于编译转换在提议阶段的语言特性
	@babel/plugin-transform-* 是 Babel 的转换插件

10. @babel/template

- 封装了基于 AST 的模板能力，可以将字符串代码转换为 AST

11. @babel/node

- 类似 Node.js Cli，@babel/node 提供在命令行执行高级语法的环境，也就是说，相比于 Node.js Cli，它加入了对更多特性的支持

12. @babel/register

- 为 require 增加了一个 hook，使用之后，所有被 Node.js 引用的文件都会先被 Babel 转码
- 注意：@babel/node 和 @babel/register，都是在运行时进行编译转换，因此运行时性能上会有影响。在生产环境中，我们一般不直接使用

13. @babel/eslint-parser

- 配合 ESLint 检验合法 Babel 代码的解析器

#### babel配置

```
```

#### babel常用插件

- @babel/plugin-proposal-optional-chaining
可选链
```javascript
a?.b?.c
```

### browserslist















