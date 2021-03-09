---
title: js-类型
date: 2019-03-03 10:10:22
tags: [js,js类型]
categories: js
---

### 类型

#### 内置类型

- 7种内置类型

null,undefined,object,string,number,boolean,symbol

- 检查类型

使用typeof检查，注意：

```
typeof null//"object"
typeof []//"object"
typeof function(){}//"function"
```

#### 基本类型

null,undefined,string,number,boolean,symbol

#### 值和类型

- js中变量没有类型，值才有类型，变量可以随时持有任何类型的值。
- 执行typeof时，得到的是变量持有值的类型。
- undefined声明但还没有赋值的变量，undeclared作用域中还没有声明过得变量
- 试图访问"undeclared" 变量时这样报错：ReferenceError: a is not defined， 并且typeof对undefined 和undeclared 变量都返回"undefined"。

### 值

#### 数组

- 数组可以容纳任何类型的值，可以是字符串、数字、对象（object），甚至是其他数组（多维数组）
- delete运算符可以删除数组元素，但是不会改变length
- 类数组：DOM元素列表，arguments对象

```
//类数组转换为数组
function f(){
    let arr = Array.prototype.slice.call( arguments )
    let arr1 = Array.from(arguments)//ES6
}
```

#### 字符串

- 字符串不可变是指字符串的成员函数不会改变其原始值，而是创建并返回一个新的字符串。而数组的成员函数都是在其原始值上进行操作。
- 借用数组非变更方法处理字符串

```
let a = '123'
let b = Array.prototype.join.call(a,'_')
console.log(a)//123
console.log(b)//1_2_3
```

- 数组有一个字符串没有的可变更成员函数reverse()，反转数组。

```
//实现字符串反转
let a = '123'
let b = a.split('').reverse().join('')
console.log(a)//123
console.log(b)//321
```

#### 数字

- 0.1 + 0.2是一个比较接近的数字0.30000000000000004
- 机器精度：js中2^-52 (2.220446049250313e-16)，ES6中该值定义在Number.EPSILON中
- 安全范围：最大整数是2^53 - 1（Number.MAX_SAFE_INTEGER），最整数（-2^53 - 1）-9007199254740991（Number.
MIN_SAFE_INTEGER）
- 检测整数：Number.isInteger() 方法
- 检测安全整数：Number.isSafeInteger()

#### 特殊的值

1. undefined,null

- null 指空值（empty value），undefined 指没有值（missing value）
- 不要给全局标识符undefined赋值

2. 特殊数字

- NaN：理解为“无效数值”“失败数值”或者“坏数值
- NaN和自身不相等，isNaN() 来判断一个值是否是NaN，ES6可以使用Number.isNaN()判断
- Object.is(NaN,NaN)返回true
- 无穷数：

```
let a = 1 / 0; // Infinity
let b = -1 / 0; // -Infinity
```

- 0值：0和-0
- 加法和减法运算不会得到负零（negative zero）。

```
var a = 0 / -3; // -0
var b = 0 * -3; // -0
0===-0//true
Object.is(0,-0)//false
//判断-0
function isNegZero(n) {
    n = Number( n );
    return (n === 0) && (1 / n === -Infinity);
}
```

#### 值和引用

- JavaScript 中的引用和其他语言中的引用/ 指针不同，它们不能指向别的变量/ 引用，只能指向值。
- JavaScript引用指向的是值。如果一个值有10个引用，这些引用指向的都是同一个值，它们相互之间没有引/指向关系。
- 简单值（即标量基本类型值，scalar primitive）总是通过**值复制**的方式来赋/传递，包括null、undefined、字符串、数字、布尔ES6中symbol。
- 复合值（compound value）对象和函数，则总是通过**引用复制**的方式来赋/传递。
- 我们无法自行决定使用值复制还是引用复制，一切由值的类型来决定。

### 原生函数

#### 常用原生函数

- 常用原生函数：String()，Number()，Boolean()，Array()，Object()，Function()，RegExp()，Date()，Error()，Symbol()
- 原生函数可以当做构造函数使用，但是构造出来的是对象

```
let s = new String('123')
//，new String("123")创建的是字符"123"的封装对象，而非基本类型"123"
console.log(typeof s)//object
s instanceof String; // true
Object.prototype.toString.call( s ); // "[object String]"
```

#### 内部属性[[Class]]

- 所typeof返回值"object"的对象（如数组）都包含一个内部属[[Class]]（我们可以把它看作一个内部的分类，而非传统的面向对象意义上的类。
- Object.prototype.toString()来查看[[Class]]
- 多数情况，对象的内[[Class]]属性和创建该对象的内建原生构造函数相对应。

```
Object.prototype.toString.call( [1,2,3] );// "[object Array]"
```

- 虽Null()Undefined()这样的原生构造函数并不存在，但是内[[Class]]属性值仍然为"Null"和"Undefined"。

```
Object.prototype.toString.call( null );// "[object Null]"
Object.prototype.toString.call( undefined );// "[object Undefined]"
```

#### 封装对象

- 一般情况不直接使用封装对象，让js引擎自己决定使用。
- 使用封装对象注意

```
let a = new Boolean(false)
if(a){//判断通过，因为a是对象，是真值（truthy）,不是false
    console.log(123)
}
```

- 自行封装基本类型，可以使用Object()（不带new关键字）

```
let a = 'aaa'
let b = new String(a)
let c = Object(a)
console.log(typeof a)//string
console.log(typeof b)//object
console.log(typeof c)//object
```

- 拆封：得到封装对象基本类型值，可以使用valueOf()函数

```
let a = new Boolean(false)
console.log(a)//Boolean {false}__proto__: Boolean[[PrimitiveValue]]: false
console.log(a.valueOf())//false
```

#### 原生函数作为构造函数

- 避免使用构造函数
- 构造函数Array()，不要求带new关键字，会自己补上
- Array()只带一个**数字参数**时，作为预设长度
- ES5规范开始就允许在列表（数组值、属性列表等）末尾多加一个逗号，（在实际处理中会被忽略不计。
- 永远不要创建使用空单元数组，会产生问题
- RegExp()有时还是很有用的，比如动态定义正则表达式时。
- Date()

```
(new Date()).getTime()
+new Date()
Date.now()
```

- Symbol：使Symbol()原生构造函数来自定义符号

#### 原生原型

- 原生构造函数有自己的.prototype对象，这些对象包含对应子类的行为特征
- Function.prototype 是一个函数，RegExp.prototype 是一个正则表达式，而Array.prototype 是一个数组
- 原型作为默认值

```
function f(val) {
    val = val || Array.prototype
}
```

### 强制类型转换

#### 值类型转换

- 显式类型转换，隐式类型转换（强制类型转换）
- js中强制类型转换总是返回标量基本类型：字符串、数字、布尔值
- 强制类型转换发生在动态语言的运行时

#### 抽象值操作

- 字符串、数字、布尔值之间类型转换的基本规则

1. ToString

- 负责处理非字符串到字符串的强制类型转换
- 基本类型的规则：null->'null',undefined->'undefined',true->'true',数字遵循通用规则
- 对于普通对象：非自定义情况下，toString()（Object.prototype.toString()）返回内部属性[[Class]]，如果自定义了toString()方法，调用该方法使用其返回值。
- 数组：数字默认toString()重新定义，用,连接单元字符。
- JSON字符串化：JSON.stringify()用到了toString()，不安全的JSON值（undefined,function.symbol,循环引用）不符合JSON解构标准，无法处理。
- 如果对象中定义了toJSON()方法，会先调用该方法，然后将返回值序列化。
- JSON.stringify()，可以传递一个可选参数replacer，数组或者函数，用来指定哪些属性被处理。第三个参数space，用来指定缩进格式

```
let obj = {
    a: {
        b: 1
    }
}
let a = JSON.stringify(obj,function (k,v) {
    return v
})
let b = JSON.stringify(obj,['a','b'])
console.log(a)//{"a":{"b":1}}
console.log(b)//{"a":{"b":1}}
```

2. ToNumber

- 非数字值当做数字使用，比如数学运算时
- true->1,false->0,undefined->NaN,null->0
- 处理字符串遵循数字常量规则，处理失败返回NaN，**''->0**
- ToNumber对于0开头的16进制数按照十进制处理
- 对象（包含数组）会先转换为相应的基本类型，如果是非数字的基本类型，再按照以上规则转换为数字
- 为了将值转换为基本类型，抽象操作ToPromitive会先检查该值是否有valueOf()方法，如果有并且返回基本类型值，就使用该值进行强制类型转换，如果没有就使用toString()的返回值进行强制类型转换。
- 如果valueOf()和toString()都不返回基本类型，会产生typeError错误
- 使用Object.create(null)创建的对象[[Prototypr]]为null，没有valueOf(),toString()方法，因此无法进行强制类型转换。

```
Number(new Boolean(''))//0,valueOf()->false,false->0
Number(new Array('22'))//22,toString()->'22','22'->22
```

3. ToBoolean

- 虽然我们可以将1 强制类型转换为true，将0强制类型转换为false，反之亦然，但它们并不是一回事。
- js中的值分为两类

(1)可以被强制类型转换为false的值
(2)其他（被强制类型转换为true的值）

- 假值：**undefined,null,false,+0,-0,NaN,''**，假值的布尔类型强制转换为false
- 假值对象（并非封装了假值的对象，比如new Boolean('')，而是js语法创建的外来值）：假值对象看起来和普通对象并无二致（都有属性，等等），但将它们强制类型转换为布尔值时结果为false。

```
//封装了假值的对象
console.log(Boolean(false))//false
//document.all假值对象
console.log(Boolean(document.all))//false
```

- 真值：真值就是假值列表之外的值

### 显示强制类型转换

#### 字符串和数字之间的显示转换

- 字符串和数字之间的转换通过String(),和Number()连个内建函数实现的
- String()遵循ToString规则，将值转换为字符串基本类型
- Number()遵循ToNumber规则，将至转换为数字基本类型
- a.toString(),+c转换
- 日期显式转换为数字：+new Date(),(new Date()).getTime(),Date.now()
- ~运算符（非运算符）：首先将值强制类型转换为32位数字，然后执行字位操作“非”（对每一个字位进行反转）。

#### 显式解析数字字符串

- 解析和转换的差别：解析允许字符串中含有非数字字符，解析按从左到右的顺序，如果遇到非数字字符就停止。而转换不允许出现非数字字符，否则会失败并返回NaN。
- 解析方法：parseInt(),parseFload()，针对字符串处理，注意传true等值会转换为字符串，第二个参数指定转换进制，默认为十进制

```
//parseInt会转换为字符串处理
let obj = {
    toString(){
        return '1'
    }
}
console.log(parseInt(obj))
```

#### 显示转换为布尔值

- Boolean()是显示的ToBoolean强制类型转换
- 一元运算符!，显式地将值强制类型转换为布尔值
- 因此最常用方法是!!

### 隐式强制类型转换

- 可以较少冗余，让代码更简洁

#### 字符串与数字之间的隐式强制类型转换

- +操作：如果某个操作数是字符串或者能够通过**以下步骤**转换为字符串的话，+ 将进行拼接操作，如果其中一个操作数是对象（包括数组），则首先对其调用ToPrimitive 抽象操作，该抽象操作再调用[[DefaultValue]]，以数字作为上下文。

```
//数组valueOf()无法得到简单基本类型，因此调用toString()转换为字符串，然后拼接
let a = [1,2]
let b = [3,4]
console.log(a+b)//1,23,4
```
```
let obj = {
    valueOf(){
        return 1
    },
    toString(){
        return '2'
    }
}
console.log(obj+'1')//11,valueOf()返回基本类型1，然后1转换为字符串'1'拼接
```

- 如果+其中一个操作数是字符串（或者通过转换可以得到），则进行字符串拼接，否则进行数字加法。
- 减法运算：a 和b 都需要被转换为数字

#### 布尔值到数字的隐式强制类型转换

- true->1,false->0

```
console.log(true+2)//3
```

#### 隐式强制类型转换为布尔值

- 发生布尔值隐式强制类型转换（非布尔值转换为布尔值）的情况：

(1) if (..) 语句中的条件判断表达式。
(2) for ( .. ; .. ; .. ) 语句中的条件判断表达式（第二个）。
(3) while (..) 和do..while(..) 循环中的条件判断表达式。
(4) ? : 中的条件判断表达式。
(5) 逻辑运算符||（逻辑或）和&&（逻辑与）左边的操作数（作为条件判断表达式）。

- || 与 &&：js中称为选择器运算符更合适（不像其他语言的逻辑运算符），因为他们在js中的返回值不是布尔值，它们的返回值是两个操作数中的一个。
- || 和&& 首先会对第一个操作数（a和c）执行条件判断，如果其不是布尔值（如上例）就先进行ToBoolean 强制类型转换，然后再执行条件判断。

```
let a = 1
let b = a && 0
let c = b || 1
console.log(b)//0
console.log(c)//1
```
```
var a = 42;
var b = null;
var c = "foo";
if (a && (b || c)) {
    console.log( "yep" );
}
//这里a && (b || c) 的结果实际上是"foo"而非true，然后再由if将foo强制类型转换为布尔值，所以最后结果为true。
```

#### 符号（symbol）的强制类型转换

- ES6 允许从符号到字符串的显式强制类型转换，然而隐式强制类型转换会产生错误。
- 符号不能够被强制类型转换为数字（显式和隐式都会产生错误），但可以被强制类型转换为布尔值（显式和隐式结果都是true）。

### 宽松相等和严格相等

- 对于两者差别的正确的解释是：“**== 允许在相等比较中进行强制类型转换，而=== 不允许。**”

#### 抽象相等

- 定义==运算符的行为
- 特殊情况：NaN与NaN不相等，+0与-0相等

1. 字符串和数字之间的比较

- 规则

(1) 如果Type(x) 是数字，Type(y) 是字符串，则返回x == ToNumber(y) 的结果。
(2) 如果Type(x) 是字符串，Type(y) 是数字，则返回ToNumber(x) == y 的结果。

2. 其他类型和布尔类型之间的比较

- 规则

(1) 如果Type(x) 是布尔类型，则返回ToNumber(x) == y 的结果；
(2) 如果Type(y) 是布尔类型，则返回x == ToNumber(y) 的结果。

- 真值假值与==没有关系
- if判断中无论什么情况下都不要使用== true 和== false

```
'42' == true//false
//true转换为数字1，与'42'比较，注意这里不涉及真值假值概念
```

3. null和undefined之间的比较

- 规则

(1) 如果x 为null，y 为undefined，则结果为true。
(2) 如果x 为undefined，y 为null，则结果为true。

4. 对象和非对象之间的相等比较

- 规则

(1) 如果Type(x) 是字符串或数字，Type(y) 是对象，则返回x == ToPrimitive(y) 的结果；
(2) 如果Type(x) 是对象，Type(y) 是字符串或数字，则返回ToPromitive(x) == y 的结果。

5. 少见情况

- 返回其他数字，更改了valueOf()方法
- 假值的相等比较

```
'0' == false//true，false先转换为数字0
false == 0//true
false == ''//true，false->0，''->0，再比较
false == []//true
'' == 0//true
'' == []//true
0 == []//true
```

- [] == ![]//true，![]->false
- '' == [null]//true，[null].toString()->''
- 0 == '\n'//true，""、"\n"（或者" " 等其他空格组合）等空字符串被ToNumber 强制类型转换
为0
- 完整性检查：如果两边的值中有true 或者false，千万不要使用==。如果两边的值中有[]、"" 或者0，尽量不要使用==。

6. 两个对象比较

- 两个对象指向同一个值时即视为相等，不发生强制类型转换。

```
let a = {}
let b = {}
let c = a
console.log(a == b)//false
console.log(a == c)//true，指向同一个值
```

### 抽象关系比较><

#### 比较双方都是字符串

- 按照字母顺序比较

#### 其他情况

- 比较双方首先调用ToPrimitive，**如果结果出现非字符串**，就根据ToNumber规则将双方强制类型转换为数字来进行比较。

```
true > 0//true，true->1比较
```

#### <= 与>=

- 根据规范a <= b 被处理为b < a，然后将结果反转。因为b < a 的结果是false，所以a <= b 的结果是true
- 实际上JavaScript 中<= 是“不大于”的意思（即!(a > b)，处理为!(b < a)）。同理a >= b 处理为b <= a。

```
let a = {}
let b = {}
console.log(a == b)//false，两个对象不指向同一个值，不相等
console.log(a < b)//false
console.log(a > b)//false
console.log(a <= b)//true
console.log(a >= b)//true
```

