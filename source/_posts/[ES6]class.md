---
title: <ES6>class
date: 2018-08-22 00:00:00
tags: [ES6,js]
categories: ES6
---

### 基本的类声明语法

- 注意：类的属性不可以被赋予新值

1. 类声明与let声明类似，不能被提升
2. 类声明所有代码都将自动运行在严格模式下
3. 在类中所有方法都不可被枚举，无需通过Object.defineProperty指定
4. 每个类都有一个[[Construct]]方法,通过new关键字调用不含[[Construct]]方法会报错
5. 使用除关键字new之外的方式调用类的构造函数会导致程序报错

```
class personalClass {
    constructor(name){
        //自有属性，不会出现在原型上
        this.name = name
    }
    //等价于personClass.prototype.sayName
    sayName(){
        console.log(this.name)
    }
}
```

#### 类的名称

- 类的名称在类中为常量，不能再类的方法中更改但是可以再外部更改

```
class Foo {
    constructor(){
        Foo = 'bar'//执行时会报错
    }
}
Foo = 'bar'//外部执行不会

// 等价于
let Foo1 = (function () {
    const Foo1 = function (name) {
        Foo1 = 'bar'
        this.name = name
    }
    Object.defineProperty(Foo1,prototype,'sayName',{
        value: function () {
            console.log(this.name)
        }
    })
})()

```
#### 类表达式

- 类表达式,不需要标识符在类后，除了语法类表达式功能上等价于类声明

```
let perClass = class {
    constructor(){
    }
}

```

- 命名类表达式,此时p1Class是const定义，不可更改

```
let pClass = class p1Class{
    constructor(){

    }
}
```

- 类可以传入函数，可以从函数返回、并且可以赋值给变量

#### 类立即调用（创建单例）

```
let person = new class {
    constructor(name){
        this.name = name
    }
}('aa')
```

#### 访问器属性

- 访问器属性，类支持在原型上定义访问器属性

```
class getSetClass{
    constructor(name){
        this.name = name
    }
    get age(){

    }
    set age(val){

    }
}

//等价于
Object.defineProperty(getSetClass.prototype,'age',{
     get:function () {

     },
     set:function (val) {

    }
})
```

#### 可计算成员名称

```
let name = 'aaa'
class pp{
    constructor(){

    }
    [name](){

    }
}

```

#### 生成器方法

```
class MyClass {
    *myGenerator(){
        yield 1
        yield 2
    }
    //定义默认迭代器
    *[symbol.iterator](){
        yield 1
    }
}

```

#### 静态成员

```
class staticClass{
    constructor(){

    }
    static create(){
        return new staticClass()
    }
}
//等价于
function aa() {

}
aa.create = function () {
    return new aa()
}
```

### 继承与派生类

- 继承自其他类的类被称为派生类，如果在派生类中指定了构造函数必须使用super()
- 如果不使用构造函数，则会自动调用super()并传入所有参数
- 注意：

1. 只可以在派生类的构造函数中使用super()
2. 在构造函数访问this之前一定要使用super()，它负责初始化this
3. 如果不想调用super()唯一的方法是让类的构造函数返回一个对象

```
class father {
    constructor(){

    }
}
class child extends father {
    constructor(){
        //等价于father.call(this)
        super()
    }
}
```

- 类方法遮蔽，派生类中的方法总会覆盖基类的同名方法

```
class Super{
    Fun(){

    }
}

class Square extends Super{
    constructor(){
        super()
    }
    //覆盖并遮蔽基类方法
    Fun(){
        //调用基类中的方法，this会被自动正确设置
        super.Fun()
    }
}
```

- 静态成员继承，如果基类有静态成员，在派生类中也可以使用

#### 派生自表达式的类

```
function bb() {

}
//bb是一个ES5的构造函数，cc是一个类，由于bb具有[[Construct]]属性和原型，因此可以作为基类
class cc extends bb{
    constructor(){
        super()
    }
}
```

### mixin

- 首先创建一个base函数，再将每一个mixin的对象属性赋值给base原型

```
let m1 = {
    Fun(){}
}
let m2 = {
    Fun1(){}
}
function mixin(...mixins) {
    var base = function () {

    }
    Object.assign(base.prototype,...mixins)
    return base
}
class x extends mixin(m1,m2,){

}
```

### 内建对象的继承

- ES5,MyArray实际行为与内建Array不一样，因为通过传统JS继承实现的数组继承没有从Array.apply()中活原型中继承相关功能

```
function MyArray() {
    Array.apply(this,arguments)
}
MyArray.prototype = Object.create(Array.prototype,{
    constructor: {
        value: MyArray,
        writable: true,
        enumerable: false,
        configurable: true
    }
})
var colors = new MyArray()
colors.push('red')
colors.length = 0
console.log(colors)//['red']
```

#### ES6Class中继承与ES5不同

1. ES5先由派生类创建this，然后调用基类的构造函数，this开始指向的是MyArray的实例，之后被来自Array的其他属性修饰
2. ES6中继承相反，先由基类创建this值，然后派生类的构造函数再去修改这个值，所以一开始可以通过this调用基类所有的内建功能

```
class MyArrayClass extends Array{
    constructor(){
        super()
    }
}
```

#### Symbol.species属性

- 如果有一个派生类MyArray继承Array，那么slice()这样的方法返回的数组会继承自MyArray
- 这是引擎通过Symbol.species属性实现的
- Symbol.species定义返回函数的静态访问器属性
- Array\ArrayBuffer\Map\Promise\RegExp\Set\Type arrays都有默认的Symbol.species属性，该属性的返回值为this,也就是总会返回构造函数

```
//在自定义类中实现Symbol.species
class speciesClass {
    static get [Symbol.species](){
        return this
    }
}
```
```
//在类方法中使用constructor以及Symbol.species
class Funnnn{
    static get [Symbol.species](){
        //这里返回构造函数,通过定义返回的构造函数，可以改变继承时clone的实例类型
        return this
    }
    constructor(value){
        this.value = value
    }
    clone(){
        //this.constructor指向Funnn构造函数（类）
        return new this.constructor[Symbol.species](this.value)
    }
}
let ff = new Funnnn(11)
ff.clone()
```

#### new.target

- 在构造函数中使用new.target
- 简单情况下new.target等于构造函数
- 类构造函数必须通过new关键字调用
- 可以使用new.target创造一个抽象基类（不能被直接实例化的类）

```
class baseClass {
    constructor(){
        if(new.target === baseClass){
            throw new Error('不能被直接实例化')
        }
    }
}
```
