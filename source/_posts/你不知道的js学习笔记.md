---
title: 你不知道的js学习笔记
date: 2018-11-27 23:55:37
tags: [js]
categories: js
---

### 词法作用域

- 无论函数在哪里被调用，也无论它如何被调用，它的词法作用域都只由函数被声明时所处的位置决定。词法作用域意味着作用域是由书写代码时函数声明的位置来决定。

```
let c = 2
function a() {
    let c = 1
    b()//2
}
function b() {
    console.log(c)
}
b()//2
a()
```

- 在严格模式的程序中，eval(..)在运行时有其自己的词法作用域，意味着其中的声明无法修改所在的作用域。

```
function c(str) {
    eval(str)
    console.log(b)//1
}
c('var b = 1')
function a(str) {
    'use strict'
    eval(str)
    console.log(b)//ReferenceError
}
a('var b = 1')
```

- setTimeout(..)和setInterval(..)的第一个参数可以是字符串，字符串的内容可以被解释为一段动态生成的函数代码。
- with 使用注意

```
function f1(obj) {
    with (obj){
        a = 2
    }
}
var o1 = {
    a: 1
}
var o2 = {
    b: 1
}
f1(o1)
f1(o2)
console.log(o1)//{a:2}
console.log(o2)//{b:1}
console.log(a)//2,因为o2中没有a，所以a被泄露到全局了
//o2的作用域、foo(..)的作用域和全局作用域中都没有找到标识符a，因此当a＝2执行时，自动创建了一个全局变量（因为是非严格模式）。
```

### 作用域

- 函数作用域的含义是指，属于这个函数的全部变量都可以在整个函数的范围内使用及复用（事实上在嵌套的作用域中也可以使用）。
- 区分函数声明和表达式最简单的方法是function关键字出现在声明中的位置（不仅仅是一行代码，而是整个声明中的位置）。如function是声明中的第一个词，那么就是一个函数声明，否则就是一个函数表达式。
- 提升是指声明会被视为存在于其所出现的作用域的整个范围内。但是使let进行的声明不会在块作用域中进行提升。

### 作用域提升

- 只有声明本身会被提升，而赋值或其他运行逻辑会留在原地。如果提升改变了代码执行的顺序，会造成非常严重的破坏。

```
console.log(a)//undefined
var a = 1
```

- 函数声明会被提升，但是函数表达式却不会被提升。

```
f1()//1
f2()//TypeError: f2 is not a function
function f1() {
    console.log(1)
}
var f2 = function () {
    console.log(2)
}
```

- 即使是具名的函数表达式，名称标识符在赋值之前也无法在所在作用域中。

```
f1()//TypeError
f2()//ReferenceError
var f1 = function f2() {
}
//可以理解为
// var f1
// f1()
// f2()
// f1 = function () {
//     var f2 = ...self...
// }
```

- 函数优先提升，一个值得注意的细节（这个细节可以出现在有多个“重复”声明的代码中）是函数会首先被提升，然后才是变量。

```
a()//1
var a = 1
function a() {
    console.log(1)
}
```

- 尽管重复var声明会被忽略掉，但出现在后面的函数声明还是可以覆盖前面的。

```
a()//2
function a() {
    console.log(1)
}
function a() {
    console.log(2)
}
```

- 一个普通块内部的函数声明通常会被提升到所在作用域的顶部，这个过程不会像下的代码暗示的那样可以被条件判断所控制。**但是需要注意这个行为并不可靠，JavaScript未来的版本中有可能发生改变，因此应该尽可能避免在块内部声明函数。**

```
a()//TypeError: a is not a function,**这个demo和书里面的就不一样了书里面说会log 2**
var b = true
if(b){
    function a() {
        console.log(1)
    }
}else {
    function a() {
        console.log(2)
    }
}
```

### 闭包

- 当函数可以记住并访问所在的词法作用域，即使函数是在当前词法作用域之外执行，这时就产生了闭包。
- 模块有两个主要特征：（1）为创建内部作用域而调用了一个包装函数；（2）包装函数的返回值必须至少包括一个对内部函数的引用，这样就会创建涵盖整个包装函数内部作用域的闭包。

### this

- 学this的第一步是明this既不指向函数自身也不指向函数的词法作用域，
- this实际上是在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用。
#### 调用位置
- 调用位置就是函数在代码中被调用的位置（而不是声明的位置）。

### this绑定规则

#### 默认规则

- 独立函数调用，，函数调用时应用this的默认绑定，因this指向全局对象。
- 严格模式下this为undefined

#### 隐式绑定

```
function a() {
    console.log(this.data)
}
var data = 1
var obj = {
    data: 2,
    fn: a
}
a()//1
obj.fn()//2
```

- 隐式丢失

```
function a() {
    console.log(this.data)
}
var data = 1
var obj = {
    data: 2,
    fn: a
}
var fn1 = obj.fn
fn1()//1
var f2
(f2 = obj.fn)()//2
```

#### 显示绑定

- JavaScript提供的绝大多数函数以及你自己创建的所有函数都可以使call(..)apply(..)bind(...)方法。

#### new绑定使

- new来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。

1. 创建（或者说构造）一个全新的对象。
2. 这个新对象会被执[[原]]连接。
3. 这个新对象会绑定到函数调用this。
4. 如果函数没有返回其他对象，那new表达式中的函数调用会自动返回这个新对象。

#### 优先级

- new > 显示 > 隐式 > 默认

#### 被忽略的this

- 如果你null或undefined作this的绑定对象传call、apply或者bind，这些值在调用时会被忽略，实际应用的是默认绑定规则。

```
function a() {
    console.log(this.data)
}
var data = 1
a.apply(null)//1
```

#### 更安全的this

```
function a() {
    console.log(this.data)
}
var data = 1
var ø = Object.create(null)
a.apply(ø)//1
```

#### 软绑定

```
if (!Function.prototype.softBind) {
    Function.prototype.softBind = function (obj) {
        var fn = this;
        // 捕获所有 curried 参数
        var curried = [].slice.call(arguments, 1);
        var bound = function () {
            return fn.apply(
                (!this || this === (window || global)) ? obj : this,
                curried.concat.apply(curried, arguments)
            )
        };
        bound.prototype = Object.create(fn.prototype);
        return bound;
    };
}
var data = 2

function a() {
    console.log(data)
}

var b = a.softBind({data: 1})
a()//2
b()//1
```

#### 箭头函数

- 箭头函数不使this的四种标准规则，而是根据外层（函数或者全局）作用域来决this。

```
function a() {
    //返回箭头函数
    return ()=>{
        //this继承自a()
        console.log(this.data)
    }

    //ES5的实现
    // let self = this
    // return function () {
    //     console.log(self.data)
    // }
}
let b = a.call({data:1})
b.call({data:2})//1
```
