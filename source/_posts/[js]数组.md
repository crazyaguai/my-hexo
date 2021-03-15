---
title: <js>数组
date: 2019-10-20 00:00:00
tags: [js,数组]
categories: js
---

### 数组构造器

- new Array()，传入一个数值参数时，参数为数组长度，其他情况参数为数组各项
- Array.of()，将参数依次转化为数组中的一项，然后返回这个新数组
- Array.from()，从一个类似数组的可迭代对象中创建一个新的数组实例
	3个参数：类数组对象、加工函数、加工函数的this

```javascript
console.log(new Array(4)); // [empty × 4]，一个数字参数，表示数组长度
console.log(new Array("1")); // ["1"]，非数字参数
console.log(new Array("a")); // ["a"]，非数字参数
console.log(new Array(1, 2, 3)); // [1, 2, 3]，数组项
console.log(Array.of(4)); // [4]，一个数字参数，数组项，与 new Array 不同
console.log(Array.of(1, 2, 3)); // [1, 2, 3]
console.log(Array.from({ 0: 1, 1: 1, 2: 1, length: 3 })); // [1, 1, 1]，类数组
```

### 数组方法

#### 改变自身方法

- pop
- push
- reverse
- shift
- sort
- splice
- uhshift
- copyWithin
- fill

#### 不改变自身方法

- concat
- join
- slice
- toString
- toLocateString
- indexOf
- lastIndexOf
- includes
- toSource
- flat，数组扁平化

#### 遍历方法（不改变自身）

- forEach
- every
- some
- filter
- map
- reduce
- reduceRight
- entries
- find
- findIndex
- keys
- values

### 类数组

#### 常见类数组

1. arguments

- arguments 只定义在函数体中
- 包括函数的参数和其他属性
- 存在 callee 属性指向函数自身

```javascript
function fun(a, b, c) {
  console.log(arguments);
  console.log(typeof arguments); // object
  console.log(Object.prototype.toString.call(arguments)); // '[object Arguments]'
}
fun(1, 2, 3);
```

2. HTMLCollection

- 是 HTML DOM 对象的一个接口，这个接口包含了获取到的 DOM 元素集合，返回的类型是类数组对象

```javascript
const elm = document.forms[0]
console.log(elm)
console.log(typeof elm) // object
console.log(Object.prototype.toString.call(elm)) // '[object HTMLFormElement]'
```

3. NodeList

- 节点的集合，通常由 querySlector  返回

#### 类数组应用场景

1. 通过arguments遍历函数参数
2. 通过arguments传递函数参数

#### 类数组转换成数组

- 因为类数组不是真正数组，没有数组自带方法
- Array.prototype.slice.call()
- Array.prototype.concat.apply()
- Array.from()

```javascript
function fun(a, b, c) {
  console.log(Array.prototype.slice.call(arguments));
  console.log(Array.prototype.concat.apply([], arguments));
  console.log(Array.from(arguments));
}
fun(1, 2, 3);
```

### 数组扁平化

1. 递归实现

```javascript
function flatten(arr = []) {
  const newArr = [];
  for (const d of arr) {
    if (Array.isArray(d)) {
      return newArr.concat(flatten(d));
    } else {
      newArr.push(d);
    }
  }
  return newArr;
}
```

2. reduce + 递归实现

```javascript
function flatten(arr = []) {
  return arr.reduce((a, b) => {
    return a.concat(Array.isArray(b) ? flatten(b) : b);
  }, []);
}
```

3. 扩展运算符 + concat 实现

```javascript
function flatten(arr = []) {
  while (arr.some((a) => Array.isArray(a))) {
    arr = [].concat(...arr);
  }
}
```

4. toString + split 实现

- 数字会转换成字符串

```javascript
function flatten(arr = []) {
  return arr.toString().split(",");
}
```

5. es6 flat 实现

```javascript
function flatten(arr = []) {
  return arr.flat(Infinity);
}
```

6. JSON.stringify 替换字符后 JSON.parse 实现

```javascript
function flatten(arr = []) {
  return JSON.parse(`[${JSON.stringify(arr).replace(/[\[\]]/g, "")}]`);
}
```

### js实现数组排序方法

### 数组sort排序

- arr.sort([compareFunction])
  compareFunction（a, b）< 0，a 排到 b 之前
  compareFunction（a, b）= 0，a、b 位置不变
  compareFunction（a, b）> 0，b 排到 a 之前

```javascript
// 从小到大排序
const arr = [3, 6, 7, 2, 9, 1, 0];
arr.sort((a, b) => {
  return a < b ? -1 : 1;
});
arr.sort((a, b) => {
  return a - b;
});
console.log(arr);
```

- 底层实现
  当 n <= 10 时，采用插入排序，插入排序在最好的情况下时间复杂度是 O(n)
  当 n > 10 时，采用三路快速排序
    10 < n <=1000，采用中位数作为哨兵元素
    n > 1000，每隔 200 ~ 215 个元素挑出一个元素，放到一个新数组中，然后对它排序，找到中间位置的数，以此作为中位数

### 数组方法底层实现

```javascript
// pop
Array.prototype.pop = function () {
  let O = Object(this);
  let len = this.length >>> 0;
  if (len === 0) {
    O.length = 0;
    return undefined;
  }
  len--;
  let value = O[len];
  delete O[len];
  O.length = len;
  return value;
};

// map
Array.prototype.map = function (callbackFn, thisArg) {
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'map' of null");
  }
  if (Object.prototype.toString.call(callbackfn) != "[object Function]") {
    throw new TypeError(callbackfn + " is not a function");
  }
  let O = Object(this);
  let T = thisArg;

  let len = O.length >>> 0;
  let A = new Array(len);
  for (let k = 0; k < len; k++) {
    if (k in O) {
      let kValue = O[k];
      // 依次传入this, 当前项，当前索引，整个数组
      let mappedValue = callbackfn.call(T, KValue, k, O);
      A[k] = mappedValue;
    }
  }
  return A;
};

// reduce
Array.prototype.reduce = function (callbackfn, initialValue) {
  // 异常处理，和 map 类似
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'reduce' of null");
  }
  // 处理回调类型异常
  if (Object.prototype.toString.call(callbackfn) != "[object Function]") {
    throw new TypeError(callbackfn + " is not a function");
  }
  let O = Object(this);
  let len = O.length >>> 0;
  let k = 0;
  let accumulator = initialValue; // reduce方法第二个参数作为累加器的初始值
  if (accumulator === undefined) {
    // 初始值不传的处理
    for (; k < len; k++) {
      if (k in O) { // 判断是否是 O 的属性
        accumulator = O[k];
        k++;
        break;
      }
    }
  }
  for (; k < len; k++) {
    if (k in O) {
      // 注意 reduce 的核心累加器
      accumulator = callbackfn.call(undefined, accumulator, O[k], O);
    }
  }
  return accumulator;
};
```










