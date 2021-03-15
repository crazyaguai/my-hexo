---
title: <js>new、call、apply、bind实现
date: 2021-01-11 00:00:00
tags: [js]
categories: js
---

### new

- new执行步骤

1. 创建新对象
2. 将构造函数作用域赋给新对象（this指向新对象）
3. 执行构造函数（添加对象属性）
4. 返回新对象（如果构造函数return一个对象，new会返回这个对象）

- new 关键词执行之后总是会返回一个对象，要么是实例对象，要么是 return 语句指定的对象

```javascript
function _new(ctor, ...args) {
  if (typeof ctor !== "function") {
    throw "ctor must be a function";
  }
  const obj = Object.create({});
  obj.__proto__ = Object.create(ctor.prototype);
  const res = ctor.apply(obj, args);
  const resType = typeof res;
  return resType === "object" && res !== null ? res : obj;
}

function Child(name) {
  this.name = name;
}
Child.prototype.say = function () {
  console.log(this.name);
};
const child = _new(Child, "张三");
```

### call、apply

- 都是用来改变执行函数的 this 指向
- 区别：call 从第 2 个至第 N 个都是给 func 的传参；apply 的第 2 个参数为数组；
- 应用场景：
1. 判断数据类型：Object.prototype.toString.call()
2. 类数组借用方法：
```javascript
const arrayLike = {
  0: "java",
  1: "script",
  length: 2,
};
Array.prototype.push.call(arrayLike, "jack", "lily");
console.log(typeof arrayLike); // 'object'
console.log(arrayLike); // {0: "java", 1: "script", 2: "jack", 3: "lily", length: 4}
```
3. 获取数组的最大 / 最小值
```javascript
let arr = [13, 6, 10, 11, 16];
const max = Math.max.apply(Math, arr);
const min = Math.min.apply(Math, arr);
console.log(max); // 16
console.log(min); // 6
```
4. 继承中使用 call
- 实现 call、apply：结合方法“借用”原理

```javascript
Function.prototype.call = function (ctx = window, ...args) {
  const fun = Symbol();
  ctx[fun] = this;
  const res = ctx[fun](...args);
  delete ctx[fun];
  return res;
};
Function.prototype.apply = function (ctx = window, args) {
  const fun = Symbol();
  ctx[fun] = this;
  const res = ctx[fun](...args);
  delete ctx[fun];
  return res;
};
```

### bind

- bind 虽然改变了 func 的 this 指向，但不是马上执行
- 新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数

```javascript
Function.prototype.bind = function (ctx = window, ...args) {
  const self = this;
  const bindFun = function () {
    return self.apply(
      this instanceof self ? this : context, // 防止返回的bind函数再次调用call、apply、bind方法
      args.concat(Array.prototype.slice.call(arguments)) // 聚合参数
    );
  };
  if (this.prototype) {
    bindFun.prototype = Object.create(this.prototype);
  }
  return bindFun;
};
```





