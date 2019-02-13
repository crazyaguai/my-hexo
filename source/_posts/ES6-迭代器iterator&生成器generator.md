---
title: ES6-迭代器iterator&生成器generator
date: 2018-08-22 08:29:09
tags: [ES6,js]
categories: ES6
---

### 简介
* 通过程序化的方式使用迭代器对象返回集合中的元素，可以极大地简化数据操作，例如：for...of循环、展开运算符（...）、异步编程。

* 循环存在的问题(如果多个循环要追踪多个变量，代码复杂度大大增加)

```
let arr = [1,2,3]
for(let i = 0;i<arr.length;i++){
    console.log(arr[i])
}
```

### 迭代器（iterator）
* 是一个特殊的对象，为专门的迭代程序设计了接口，都有一个next()方法
* 每次调用next()返回一个对象有两个属性value和done,{value:'',done:''}
* 每一次调用next()都会返回下一次的值，如果没有值的话，返回{value:undefined,done:true}

```
function createIterator(items) {
    var i = 0
    return {
        next: function () {
            var done = (i>=items.length)
            var value = !done ? items[i++] : undefined
            return {
                done: done,
                value: value
            }
        }
    }
}
var iterator = createIterator([1,2])
console.log(iterator.next())//{done:false,value:1}
console.log(iterator.next())
console.log(iterator.next())//{done:true,value:undefined}
```

### 生成器（generator）
* 生成器是一种返回迭代器的函数，通过function关键字后的*号来表示，函数中会用到新的关键字yield
* *号可以紧挨function也可以有个空格
* 生成器中当每执行一条yield之后会自动停止执行，继续调用next()才会继续执行
* 注意：yield只可以在生成器函数内部调用，在其他地方调用会出现语法错误，即使是在生成器内部函数里面调用

```
function *Fun() {
    yield 1
    yield 2
}
let iterator1 = Fun()
console.log(iterator1.next())
console.log(iterator1.next())
console.log(iterator1.next())

//生成器函数表达式
let Fun1 = function *() {
    yield 1
    yield 2
}
```

#### 生成器对象方法
生成器对象方法（生成器本身是函数，可以添加到对象中）

```
let obj = {
    createIterator: function *() {
        yield 1
    },
    *Fun(){//ES6函数写法创建

    }
}
```

#### 可迭代对象与for...of循环
* 可迭代对象与for...of循环
* 可迭代对象具有Symbol.iterator属性，通过指定的函数可以返回一个作用于附属对象的迭代器
* ES6中所有对象合集（数组、Set、Map、字符串）都是可迭代对象，都有默认的可迭代器
* for...of循环就是用到可迭代对象的这些功能，每执行一次都会调用可迭代对象的next()方法
* 通过调用Symbol.iterator方法来获得迭代器


```
//默认的迭代器，通过Symbol.iterator来访问对象默认的迭代器
let arr1 = [1,2]
let iterator2 = arr1[Symbol.iterator]()
console.log(iterator2.next())
console.log(iterator2.next())
console.log(iterator2.next())

//可以使用Symbol.iterator检测是否为可迭代对象
function checkItertor(obj){
    return typeof obj[Symbol.iterator] === 'function'
}
console.log(checkItertor([1,2]))//true
console.log(checkItertor(1))//false
```

#### 创建可迭代对象
* 创建可迭代对象，开发者定义的对象都是不可迭代的，如果给对象Symbol.iterator属性添加一个生成器可变为可迭代对象
* 先创建一个生成器，并赋值给Symbol.iterator属性来创建默认的迭代器

```
let collection = {
    items: [],
    *[Symbol.iterator](){
        for(let item of this.items){
            yield item
        }
    }
}
collection.items.push(1)
collection.items.push(2)
for(let item of collection){
    console.log(item)
}
```

### 内建迭代器
 * entries(),多个键值对
 * values(),集合的值
 * keys(),所有的键名(数组打印出来的都是数字类型的索引)
 * 默认的迭代器
 * 数组、Set是values
 * Map是entries()
 * 注意：WeakMap与WeakSet没有内建迭代器，因为要管理弱引用无法确定存在的值

```
let map = new Map([['a',1],['b',2]])
for(let [k,value] of map.entries()){//解构运用
    console.log(k)
    console.log(value)
}
```

#### 字符串迭代器
字符串迭代器（可以正确使用双字节字符）

```
let msg = '123'
for(let s of msg){
    console.log(s)
}
```


#### NodeList迭代器

```
let divs = document.getElementsByTagName('div')
for(let d of divs){
    console.log(d)
}
```


#### Set转换数组
- 展开运算符与非数组可迭代对象(将可迭代对象转换为数组)
```
let set1 = new
Set([1,2,2,3])
console.log([...set1])//[1,2,3]
```


### 高级迭代器功能

#### 给迭代器传递参数
* 如果给迭代器的next()方法传递参数，这个参数会替代生成器内部上一条yield语句的返回值
* 注意：第一次调用next()时无论传什么参数都会被丢弃

```
function *createIterator2() {
    let first = yield 1
    let secoud = yield first + 1
    yield secoud + 1
}
let iterator4 = createIterator2()
console.log(iterator4.next())
console.log(iterator4.next(1))
console.log(iterator4.next(2))
console.log(iterator4.next())
```

#### 在迭代器中抛出错误
* 通过throw()方法，当迭代器执行时可以抛出错误
* next()和throw()像是迭代器两条指令，调用都会继续执行，但是调用throw()会抛出错误
* 在错误之后的执行取决于内部的代码
```
function *errIterator() {
    yield 1
    yield 2
    yield 3
}
let iterator5 = errIterator()
console.log(iterator5.next())
// console.log(iterator5.throw(new Error('error')))
console.log(iterator5.next())//不会在执行

//可以在内部通过try-catch捕获错误
function *errIterator1() {
    let first = yield 1
    let secound
    try {//由于生成器捕获了这些错误因此会继续执行下一条语句
        secound = yield first + 1
    }catch (e) {
        secound = 2
    }
    yield secound + 1
}
let iterator6 = errIterator1()
console.log(iterator6.next())
console.log(iterator6.next(1))
console.log(iterator6.throw(new Error('error')))
console.log(iterator6.next(1))
```
#### 生成器的return返回语句
* 可以通过return提前退出执行，如果return了值，则为{done:true,value:对应值}
* 注意：展开运算符和for...of循环会直接忽略通过return返回的任何值，只要done变为true就会停止

```
function *returnIterator() {
    return 1
}
let iterator7 = returnIterator()
console.log(iterator7.next())//{value:1,done:true}
```


#### 委托生成器（合并迭代器）

```
function *c1() {
    yield 1
    return 2
}
function *c2() {
    yield 3
    return 4
}
function *c3() {
    let result = yield *c1()
    yield result//如果想返回这个return值需要这个么做
    yield *c2()
    yield *'aaa'//会使用字符串的默认迭代器
}
let iteratorC = c3()
```


#### 异步任务执行器

```
function run(taskDef) {

    //创建一个无限使用的迭代器
    let task = taskDef()

    //开始执行任务
    let result = task.next()

    //循环调用使用next()函数
    function step() {
        if(!result.done){
            //判断如果是函数则执行函数
            if(typeof result.value === 'function'){
                //执行异步函数，传入回调，再回调中继续执行next(),处理数据
                result.value(function (err,data) {
                    if(err){
                        task.throw(err)
                        return
                    }
                    result = task.next(data)
                    step()
                })
            }else {
                result = task.next(result.value)
                step()
            }
        }
    }
    step()
}

function outFun() {
    return function (callback) {
        setTimeout(()=>{
            console.log('111')
            callback(null,'123')
        },1000)
    }
}

run(function *() {
    let res = yield outFun()
    console.log('2222')
})
```
