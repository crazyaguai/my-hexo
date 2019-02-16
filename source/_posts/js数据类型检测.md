---
title: js数据类型检测
date: 2019-01-15 15:52:17
tags: [js,数据类型检测]
categories: js
---

### typeof

- 返回一个表示数据类型的字符串
- 返回结果包括：number、boolean、string、symbol、object、undefined、function 等 7 种数据类型，**但不能判断 null、array 等**
- 在 JavaScript 最初的实现中，JavaScript 中的值是由一个表示类型的标签和实际数据值表示的。对象的类型标签是 0。由于 null 代表的是空指针（大多数平台下值为 0x00），因此，null的类型标签也成为了 0，typeof null就错误的返回了"object"。

```
// Numbers
typeof 37 === 'number';
typeof 3.14 === 'number';
typeof Math.LN2 === 'number';
typeof Infinity === 'number';
typeof NaN === 'number'; // 尽管NaN是"Not-A-Number"的缩写
typeof Number(1) === 'number'; // 但不要使用这种形式!

// Strings
typeof "" === 'string';
typeof "bla" === 'string';
typeof (typeof 1) === 'string'; // typeof总是返回一个字符串
typeof String("abc") === 'string'; // 但不要使用这种形式!

// Booleans
typeof true === 'boolean';
typeof false === 'boolean';
typeof Boolean(true) === 'boolean'; // 但不要使用这种形式!

// Symbols
typeof Symbol() === 'symbol';
typeof Symbol('foo') === 'symbol';
typeof Symbol.iterator === 'symbol';

// Undefined
typeof undefined === 'undefined';
typeof declaredButUndefinedVariable === 'undefined';
typeof undeclaredVariable === 'undefined';

// Objects
typeof {a:1} === 'object';

// 使用Array.isArray 或者 Object.prototype.toString.call
// 区分数组,普通对象
typeof [1, 2, 4] === 'object';

typeof new Date() === 'object';

// 下面的容易令人迷惑，不要使用！
typeof new Boolean(true) === 'object';
typeof new Number(1) === 'object';
typeof new String("abc") === 'object';

// 函数
typeof function(){} === 'function';
typeof class C{} === 'function'
typeof Math.sin === 'function';
typeof new Function() === 'function';

// null
typeof null === 'object';

//new 操作符
var str = new String('String');
var num = new Number(100);

typeof str; // It will return 'object'
typeof num; // It will return 'object'

// But there is a exception in case of Function constructor of Javascript

var func = new Function();

typeof func; // It will return 'function'
```

### instanceof

- instanceof 运算符用来测试一个对象在其原型链中是否存在一个构造函数的 prototype 属性

```
[] instanceof Array; //true
{} instanceof Object;//true
new Date() instanceof Date;//true
new RegExp() instanceof RegExp//true
```

- 对于基本数据类型来说，字面量方式创建出来的结果和实例方式创建的是有一定的区别的

```
console.log(1 instanceof Number)//false
console.log(new Number(1) instanceof Number)//true
```

- 类的原型继承中，我们最后检测出来的结果未必准确

```
var arr = [1, 2, 3];
console.log(arr instanceof Array) // true
console.log(arr instanceof Object);  // true
function fn(){}
console.log(fn instanceof Function)// true
console.log(fn instanceof Object)// true
```

- 不能检测 null 和 undefined

### ES6数组Array.isArray()

```
Array.isArray([]);   // true
```

### 严格运算符 ===

- 只能用于判断 null 和 undefined，因为这两种类型的值都是唯一的

```
var a = null
typeof a // "object"
a === null // true
```

### constructor

- constructor 作用和 instanceof 非常相似。但 constructor 检测 Object 与 instanceof 不一样，**还可以处理基本数据类型的检测**。

```
var aa=[1,2];
console.log(aa.constructor===Array);//true
console.log(aa.constructor===RegExp);//false
console.log((1).constructor===Number);//true
var reg=/^$/;
console.log(reg.constructor===RegExp);//true
console.log(reg.constructor===Object);//false
```

- null 和 undefined 是无效的对象,不会有 constructor 存在。
- 函数的 constructor 是不稳定的，这个主要体现在把类的原型进行重写。

### Object.prototype.toString.call()

- 每个对象都有一个toString()方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。默认情况下，toString()方法被每个Object对象继承。如果此方法在自定义对象中未被覆盖，toString() 返回 "[object type]"，其中type是对象的类型。
- 关于 toString

1. 本意是转换为字符串，但是某些 toString 方法不仅仅是转换为字符串
2. 对于 Number、String，Boolean，Array，RegExp、Date、Function 原型上的 toString 方法都是把当前的数据类型转换为字符串的类型（它们的作用仅仅是用来转换为字符串的）
3. Object 上的 toString 并不是用来转换为字符串的。

- Object 上的 toString 它的作用是返回当前方法执行的主体（方法中的 this）所属类的详细信息。

```
Object.prototype.toString.call('') ;   // [object String]
Object.prototype.toString.call(1) ;    // [object Number]
Object.prototype.toString.call(true) ; // [object Boolean]
Object.prototype.toString.call(undefined) ; // [object Undefined]
Object.prototype.toString.call(null) ; // [object Null]
Object.prototype.toString.call(new Function()) ; // [object Function]
Object.prototype.toString.call(new Date()) ; // [object Date]
Object.prototype.toString.call([]) ; // [object Array]
Object.prototype.toString.call(new RegExp()) ; // [object RegExp]
Object.prototype.toString.call(new Error()) ; // [object Error]
Object.prototype.toString.call(document) ; // [object HTMLDocument]
Object.prototype.toString.call(window) ; //[object global] window是全局对象global的引用
```

### 参考
- 来自https://mp.weixin.qq.com/s/l4U4lVt_sz7lqT43aTuaTA
