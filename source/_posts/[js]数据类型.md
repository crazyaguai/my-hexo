---
title: <js>数据类型
date: 2021-03-03 00:00:00
tags: [js,js类型]
categories: js
---

### 内置类型

- string、number、boolean、null、undefined、symbol、bigInt、object

#### 基本类型

- 基础类型存储在栈内存，被引用或拷贝时，会创建一个完全相等的变量
- string、number、boolean、null、undefined、symbol、bigInt

#### 引用类型

- 引用类型存储在堆内存，存储的是地址，多个引用指向同一个地址
- object，引用类型又分为以下常见的数据类型：Array - 数组对象、RegExp - 正则对象、Date - 日期对象、Math - 数学函数、Function - 函数对象

### 数据类型检测

- typeof 可以判断基本数据类型（null）除外，引用类型除了 Function 外其他不能判断
- instanceof 可以准确判断复杂引用数据类型，不能确定基本类型

#### typeof

```javascript
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
typeof [] // 'object'
typeof {} // 'object'
typeof console // 'object'
// 特殊情况
typeof console.log // 'function' ***
typeof null // 'object' ***
typeof new Number(1) // 'object' ***
typeof Number(1) // 'number' ***
```

#### Array.isArray()

- es6检测数据类型

#### '==='严格运算符

- 用于判断 null 和 undefined，因为这两种类型的值都是唯一的

```javascript
const a = null
typeof a // object
a === null // true
```

#### instanceof

- instanceof 通过原型链判断类型

```javascript
1 instanceof Number // false
Number(1) instanceof Number // false
new Number(1) instanceof Number // true
new Number(1) instanceof Object // true
```

#### constructor

- 与instanceof类似，通过原型链检测
- constructor还可以检测基本类型
- 只能检测父级原型链类型

```javascript
[].constructor === Array // true
('a').constructor === String // true
[].constructor === Object // false
```

#### Object.prototype.toString

- toString() 是 Object 的原型方法，调用该方法，可以统一返回格式为 “[object Xxx]” 的字符串，其中 Xxx 就是对象的类型
- 对于 Object 对象，直接调用 toString() 就能返回 [object Object]；而对于其他对象，则需要通过 call 来调用，才能返回正确的类型信息

```javascript
Object.prototype.toString({})       // "[object Object]"
Object.prototype.toString.call({})  // "[object Object]" 同上结果，加上call也ok
Object.prototype.toString.call(1)    // "[object Number]"
Object.prototype.toString.call('1')  // "[object String]"
Object.prototype.toString.call(true)  // "[object Boolean]"
Object.prototype.toString.call(function(){})  // "[object Function]"
Object.prototype.toString.call(null)   //"[object Null]"
Object.prototype.toString.call(undefined) //"[object Undefined]"
Object.prototype.toString.call(/123/g)    //"[object RegExp]"
Object.prototype.toString.call(new Date()) //"[object Date]"
Object.prototype.toString.call([])       //"[object Array]"
// 特殊情况
Object.prototype.toString.call(window)   //"[object Window]"
Object.prototype.toString.call(document)  //"[object HTMLDocument]" ***
```

- 全局通用的数据类型判断方法

```javascript
function getType(obj){
  let type  = typeof obj;
  // typeof 判断不是 object 直接返回
  if (type !== "object") {
    return type;
  }
  // 对于typeof返回结果是object的，再进行如下的判断，正则返回结果
  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1').toLowerCase();
}
```

### 类型转换

#### 强制类型转换

- 强制类型转换方式包括 Number()、parseInt()、parseFloat()、toString()、String()、Boolean()

##### Number()方法规则

- 如果是布尔值，true->1，false->0
- 如果是数字，返回数字自身
- 如果是 null，返回 0
- 如果是 undefined，返回 NaN
- 如果是字符串：字符串中只包含数字（或者是 0X、0x 开头的十六进制数字字符串，允许包含正负号），则将其转换为十进制；如果字符串中包含有效的浮点格式，将其转换为浮点数值；如果是空字符串，将其转换为 0；如果不是以上格式的字符串，均返回 NaN；
- 如果是 Symbol，抛出错误
- 如果是对象，依次判断是否有 [Symbol.toPrimitive]、valueOf()、toString() 方法，如果存在，依据前面的规则转换方法返回的值

```javascript
Number(true);        // 1
Number(false);       // 0
Number('0111');      // 111
Number(null);        // 0
Number(undefined);   // NaN
Number('');          // 0
Number('1a');        // NaN
Number(-0X11);       // -17
Number('0x11')       // 17
Number(Symbol())     // TypeError: Cannot convert a Symbol value to a number
```

```javascript
const obj1 = {};
obj1[Symbol.toPrimitive] = () => {
  return true;
};
console.log(Number(obj1)); // 1

const obj2 = {};
obj2.valueOf = () => {
  return true;
};
console.log(Number(obj2)); // 1

const obj3 = {};
obj3.toString = () => {
  return true;
};
console.log(Number(obj3)); //1
```

##### Boolean()方法规则

- 除了 undefined、null、false、0（-0、+0）、''、NaN 转换为false，其他都是 true

```javascript
Boolean(0)          // false
Boolean('')         // false
Boolean(-0)         // false
Boolean(null)       // false
Boolean(undefined)  // false
Boolean(NaN)        // false

Boolean(1)          // true
Boolean(13)         // true
Boolean('12')       // true
```

#### 隐式类型转换

- 逻辑运算符 (&&、 ||、 !)、运算符 (+、-、*、/)、关系操作符 (>、 <、 <= 、>=)、相等运算符 (==)、条件操作 (if、while)
- 以上操作，遇到数据类型不一致，会发生隐式类型转换

#### object转换规则

- 依次判断是否有 [Symbol.toPrimitive]、valueOf()、toString() 方法，调用返回

##### '=='规则

- 值相同，不进行转换
- 其中一个值是 null 或 undefined，另一个值必须是 null 或 undefined 才返回 true，否则返回 false
- 其中一个是 Symbol 类型，那么返回 false
- 两个操作值如果为 string 和 number 类型，那么就会将字符串转换为 number
- 如果一个操作值是 boolean，那么转换成 number
- 如果一个操作值为 object 且另一方为 string、number 或者 symbol，就会把 object 转为原始类型再进行判断（[Symbol.toPrimitive]、valueOf()、toString()）

```javascript
// null 与 undefined
null == undefined // true
null == null // true
null == 0 // false

// Symbol
Symbol() == false // false

// 数字与字符串比较
1 == '1' // true，都转换为数字 -> 1 == 1 -> true

// boolean
false == '' // true，false 转换为 0 -> 0 == ''-> 0 == 0 -> true

// object
const obj = {};
obj.valueOf = () => {
  return 1;
};
console.log(obj == 1); // true，obj valueOf 转为 1 -> 1 == 1 -> true

// NaN 比较
NaN == NaN // false
```

##### '+'规则

- 数字 + 数字，加法运算
- 字符串 + 字符串，拼接
- 数字 + 字符串，拼接
- 字符串 + （null、undefined）,toString 后拼接
- 数字 + （null、undefined）,转换成数字后加法运算
- 数字 + object，根据 Object 转换规则转换后运算
- 字符串 + object，根据 Object 转换规则转换后运算

```javascript
1 + 1 // 2
'1' + 1 // '11'
'1' + '1' // '11'
'1' + null // '1null'
1 + undefined // NaN，Number(undefined) -> NaN
1 + null  // 1

// obj
const obj = {}
obj.toString = ()=>{
	return '1'
}
1 + obj // '11'
```

##### ‘<’、'>'比较

- 都是字符串，按字母顺序比较
- 其他情况：比较双方首先调用ToPrimitive，如果结果出现非字符串，就根据ToNumber规则将双方强制类型转换为数字来进行比较

##### '<='、'>='比较

- a <= b 被处理为b < a，然后将结果反转
- JavaScript 中<= 是“不大于”的意思（即!(a > b)，处理为!(b < a)）。同理a >= b 处理为b <= a

### 其他参考

- https://crazyaguai.github.io/2019/03/03/[js]%E7%B1%BB%E5%9E%8B/






