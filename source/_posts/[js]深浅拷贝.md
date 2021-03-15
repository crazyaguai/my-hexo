---
title: <js>浅拷贝
date: 2019-01-06 00:00:00
tags: [js,深拷贝]
categories: js
---

### 概念

- https://mp.weixin.qq.com/s/scz9gRJeh7PM6GJ7wvnTsA

### 浅拷贝

#### Object.assign()

```javascript
const obj1 = {a:1}
const obj2 = {b:{c:1}}
Object.assign(obj1,obj2)
console.log(JSON.stringify(obj1)) // {"a":1,"b":{"c":1}}
obj2.b.c = 2
console.log(JSON.stringify(obj1)) // {"a":1,"b":{"c":2}}
```

#### 扩展运算符

```javascript
const obj1 = { a: { c: 2 }, b: 1 };
obj2 = { ...obj1 };
obj1.a.c = 1;
console.log(JSON.stringify(obj2)); // {"a":{"c":1},"b":1}
```

#### conact拷贝数组

```javascript
const arr1 = [1,2,{a: 1}]
const arr2 = arr1.concat()
arr1[2].a = 2
arr2[0] = 3
console.log(JSON.stringify(arr2)) // [3,2,{"a":2}]
```

#### slice拷贝数组

```javascript
const arr1 = [1,2,{a: 1}]
const arr2 = arr1.slice()
arr1[2].a = 2
arr2[0] = 3
console.log(JSON.stringify(arr2)) // [3,2,{"a":2}]
```

#### 代码实现浅拷贝

```javascript
function clone(target) {
  if (typeof target === "object" && target !== null) {
    const cloneData = Array.isArray(target) ? [] : {};
    for (const k in target) {
      if (target.hasOwnProperty(k)) {
        cloneData[k] = target[k];
      }
    }
    return cloneData;
  }
  return target;
}
```

### 深拷贝

#### JSON.stringfy

- 存在问题：
1. 函数、undefined、symbol 会消失
2. Date 引用类型会变成字符串
3. 不可枚举属性无法拷贝
4. 无法拷贝对象的原型链
5. 拷贝 RegExp 引用类型会变成空对象
6. 有 NaN、Infinity 以及 -Infinity 会变成 null
7. 无法拷贝对象的循环应用，即对象成环 (obj[key] = obj) 错误信息：Uncaught TypeError: Converting circular structure to JSON

```javascript
function deepClone(target) {
  return JSON.parse(JSON.stringify(target));
}
const obj = {
  fun: function () {},
  date: new Date(),
  reg: /\d/gim,
  d1: Symbol(),
  d2: null,
  d3: undefined,
  d4: NaN,
};
console.log(JSON.stringify(deepClone(obj))); // {"date":"2021-03-09T08:40:02.381Z","reg":{},"d2":null,"d4":null}
```

#### 递归实现

```javascript
function clone(value) {
  if (Array.isArray(value)) {
    return value.map(clone);
  } else if (value && typeof value === "object") {
    const res = {};
    for (const key in value) {
      if (target.hasOwnProperty(k)) {
        res[key] = clone(value[key]);
      }
    }
    return res;
  } else {
    return value;
  }
}
```

#### 考虑循环嵌套情况

```javascript
function deepClone(target, cache = new WeakMap()) {
  if (cache.has(target)) {
    return cache.get(target);
  }
  if (typeof target === "object" && target !== null) {
    if (target.constructor === Date) {
      return new Date(target);
    }
    if (target.constructor === RegExp) {
      return new RegExp(target);
    }
    // ...
    cache.set(target, target);
    const cloneTarget = Array.isArray(target) ? [] : {};
    for (const k in target) {
      if (target.hasOwnProperty(k)) {
        cloneTarget[k] = deepClone(target[k], cache);
      }
    }
    return cloneTarget;
  }
  return target;
}
```

```javascript
const deepClone = function (obj, hash = new WeakMap()) {
  if (obj.constructor === Date) 
  return new Date(obj)       // 日期对象直接返回一个新的日期对象
  if (obj.constructor === RegExp)
  return new RegExp(obj)     //正则对象直接返回一个新的正则对象
  //如果循环引用了就用 weakMap 来解决
  if (hash.has(obj)) return hash.get(obj)
  let allDesc = Object.getOwnPropertyDescriptors(obj)
  //遍历传入参数所有键的特性
  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)
  //继承原型链
  hash.set(obj, cloneObj)
  for (let key of Reflect.ownKeys(obj)) { 
    cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? deepClone(obj[key], hash) : obj[key]
  }
  return cloneObj
}
```
