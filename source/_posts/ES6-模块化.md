---
title: ES6-模块化
date: 2019-02-11 08:40:50
tags: [ES6,js]
categories: ES6
---

### 简介

 - ES6之前，在应用的每一个js定义中都共享一个全局作用域，会引起命名冲突和安全问题。
 - ES6为了解决作用域问题，引入了模块。
 - 模块是自动运行在严格模式下的js代码，在模块顶部创建的变量不会被加到全局作用域中，这个变量仅在模块的顶级作用域存在，模块可以导入导出。
 - 在模块的顶部，this的值是undefined，模块不支持HTML风格代码注释。

### 基本语法

#### 导出

```
export var a = 1
export function b(){}
export class c(){}
```

- 使用default关键字可以导出匿名函数或者类

#### 导入

```
import {a,b,c} from 'a.js'
```

- 导入整个模块

```
import * as A from 'a.js'
```

- 不管import语句在一个模块执行多少次，只会执行一次

```
//a.js只会执行一次
import {a} from 'a.js'
import {b} from 'a.js'
import {c} from 'a.js'
```

- export和import限制必须在其他语句和函数之外使用

```
if(true){
    export var a = 1//语法错误
}
```

```
//不能在一条语句中使用import
function fun(){
    import {a} from 'a.js'
}
```

- ES6的import语句为函数、变量、类创建的是只读绑定，而不是像正常变量一样简单引用原始绑定

```
export var a = 1

import {a} from 'a.js'
a = 2//抛出错误
```

- 导入重命名

```
import {a as A} from 'a.js'
```

#### 模块的默认值

```
export default a
export {a as default}
```
```
//导入默认值和其他值
import a,{b,c} from 'a.js'
```

#### 无绑定导入

- 某些模块可能不导出任何东西，只是修改全局作用域中的对象
- 无绑定导入可以用来创建polyfill和shim

```
import './a.js'
```
