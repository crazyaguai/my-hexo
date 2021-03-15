---
title: <ES6>Symbol
date: 2019-02-13 00:00:00
tags: [ES6,js]
categories: ES6
---
### 简介

-  ES6引入了第六种原始类型Symbol

#### 私有名称

- 为了创建非字符串属性名称设计的，Symbol出现之前一直通过属性名称来访问所有属性，全部通过一个字符串来访问。

### Symbol相关

#### 创建Symbol

```
let name = Symbol()
let obj = {}
obj[name] = 'yxc'
```

- 由于Symbol是原始值，因此调用new Symbol()会报错，
- Symbol函数接收一个可选参数，让你添加文本描述，建议每次创建都添加。

```
let name = Symbol('name')
```

- Symbol的描述被存储在内部的[[Description]]属性中，只有当调用Symbol的toString()方法时才会读取这个属性。

#### 检测Symbol

- 使用typeof

```
let name = Symbol('name')
name.toString()//"Symbol(name)"
typeof name//"symbol"
```

#### Symbol的使用

- 所有使用可计算属性名的地方都可以使用Symbol

```
let name = Symbol('name')
let obj = {
    [name]: 'yxc'
}

```

- 用于Object.defineProperty()\Object.defineProperties()方法中

```
let name = Symbol('name')
let obj = {}
Object.defineProperty(obj,name,{writable:false})
```

#### Symbol共享体系

- ES6创建了一个可以随时访问的全局Symbol注册表，如果想创建一个可共享Symbol，使用Symbol.for()方法

```
let id = Symbol.for('id')
let id2 = Symbol.for('id')
console.log(id===id2)//true
```

- 使用Symbol.keyFor()方法在Symbol全局注册表中检索与Symbol有关的关键字

```
let id = Symbol.for('id')
console.log(Symbol.keyFor(id))//id
```

- Symbol全局注册表是一个类似全局作用域的共享环境，其他第三方库也有可能使用。

#### Symbol与强制类型转换

- 其他类型没有与Symbol逻辑等价的值，因此Symbol使用不是很灵活，尤其不能将Symbol强制转换为字符串和数字类型
- 将Symbol强制转换为字符串会被错

```
let name = Symbol('name')
let a = name + ''//VM1175:1 Uncaught TypeError: Cannot convert a Symbol value to a string
```

- Symbol与JS中的非空值类似，其等价布尔值为true

```
let name = Symbol('name')
let a = name/1//VM1299:2 Uncaught TypeError: Cannot convert a Symbol value to a number
```

#### Symbol属性的检索

- 为了保持ES5函数原有功能，Object.keys(),Object.getOwnPropertyNames()都不支持Symbol属性，ES6添加Object.getOwnPropertySymbols()返回包含所有Symbol属性的数组。

```
let name = Symbol('name')
let obj = {
    [name]: 'yxc'
}
console.log(Object.getOwnPropertySymbols(obj))//[Symbol(name)]
```

#### well-known Symbol

- 对象可以从原型链中继承Symbol属性，ES6通过一些well-known Symbol预定义这些属性

1. Symbol.hasInstance方法

- 用于确认对象是否为函数的实例，该方法在Function.prototype中定义，所有函数都继承了instanceof属性的默认行为

```
let obj = []
console.log(obj instanceof Array)//true
Array[Symbol.hasInstance](obj)//true
```

#### 参考

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol#
