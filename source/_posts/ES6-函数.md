---
title: ES6-函数
date: 2018-08-21 08:31:24
tags: [ES6,js]
categories: ES6
---


ES6在ES5的基础上做了大量改进，使编程更加灵活，更少出错。

## 参数默认值

```
function defaultParam(a,b=1) {
}
```
默认参数对arguments的影响（在ES6中如果一个函数使用了默认值，无论是否显示定义严格模式，arguments与ES5严格模式保持一致）

```
function Fun(a,b=1) {
    console.log(arguments)//不传b参数时，没有arguments[1]
    console.log(a === arguments[0])//true
    console.log(b === arguments[1])//true
    a = 2
    b = 2
    console.log(arguments)
    console.log(a === arguments[0])//false
    console.log(b === arguments[1])//false
}
Fun(1)
```

## 默认参数表达式
注意如果忘记写小括号，则传入默认函数的引用

```
let num = 1
function Funa() {
    return num++
}
function Fun(a,b=Funa()) {
    console.log(b)
}
Fun(1)//1
Fun(1)//2
```


- 可以使用先定义的参数作为后定义参数的默认值(但是反过来的话会产生临时死区TDZ)

```
function add(first,second = first) {
    return first+second
}
add(1)
```

- 参数的默认值不能访问函数体内声明的变量（参数和函数体的作用域相互独立）

## 处理无命名参数
### 不定参数
* 使用限制：1、每个函数只能声明一个不定参数 2、不定参数必需放在所有参数的末尾
* 不定参数对arguments的影响：无论是否使用不定参数，arguments对象总是包含所有传入的参数

```
function pick(object,...keys) {
    console.log(arguments)
    let result = Object.create(null)
    for(let i = 0,len = keys.length; i<len ;i++){
        result[keys[i]] = object[keys[i]]
    }
    return result
}
pick({a:1,b:2},...['a','b'])
```


### Function构造函数增强

```
let Funaa = new Function('a=1','...nums','console.log(a+nums[0])')//11(字符串)
Funaa(1,[1])
```
### 展开运算符
指定数组，打散后作为参数传入函数

```
let numArr= [1,2,3]
Math.max(...numArr,0)//在后边在传入参数，可以控制最小值
Math.max.apply(null,numArr)//等同于这个，但是apply需要手动绑定this
```

## name属性
* 1、函数表达式的属性名字比函数赋值的变量权重高
* 2、getter函数名字有get
* 3、调用bind生成函数名字有bind

```
function name2() {
}
let name1 = name2
console.log(name1.name)//name2
console.log(name2.name)//name2
let person = {
    get firstName(){
        return '1234'
    }
}
console.log(person.firstName.name)//get firstName
let name3 = name2.bind(null)
console.log(name3.name)//bound name2
```

## 明确函数的多用途
* 1、函数有[[Call]]和[[Construct]]方法，分表表示直接调用和new构造
* 2、元属性new.target（判断函数是否通过new关键字调用）

```
function bbb() {
    if(new.target === bbb){
        this.a = 1
    }else {
        console.log('error')
    }
}
bbb()//error
new bbb()
```

## 块级函数
* 块级函数（代码中块级函数会被提升至块的顶部，而使用let声明的变量不会）

```
if(true){
    console.log(typeof a)//function
    function a() {

    }
}
```
## 箭头函数
* 1、没有this\super\arguments\ner.target绑定，箭头函数中的这些由外层最近一个非箭头函数决定
* 2、不能通过new关键字调用
* 3、没有原型
* 4、不可改变this指向
* 5、不支持arguments对象
* 6、不支持重复命名参数

```
let reflec = val=>val//直接返回val

let refObj = ()=>({a:1})//直接返回object

let bbbb = ((val)=>{return val})(1)//立即执行

let nullRef = ()=>{}
typeof nullRef//function
```
### 多个箭头的函数与科里化
```
var a = b => c => d => {
    console.log(b)
    console.log(c)
    console.log(d)
}

    // 等价于
var a = function (b) {
    return function (c) {
        return function (d) {
            console.log(b)
            console.log(c)
            console.log(d)
        }

    }
}
```

## 尾调用优化
尾调用指的是函数作为另一个函数的最后一条语句被执行
需要同时满足：
* 1、尾调用不访问当前函数的变量
* 2、在函数内部，尾调用是最后一条语句
* 3、尾调用的结果作为函数的返回值
适用于递归函数

```
function factorial(n,p=1) {
    if(n<=1){
        return 1
    }else {
        let result = n*p
        return factorial(n-1,result)
    }
}
```
