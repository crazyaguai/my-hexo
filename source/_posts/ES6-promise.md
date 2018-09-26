---
title: ES6-promise
date: 2018-08-22 08:29:26
tags: [ES6,js]
categories: ES6
---



Promise可以完成其他语言中类似Future和Deferred功能

异步编程的背景知识：
JS引擎是基于单线程(single-threaded)事件循环概念构建的，同一时刻只允许一个代码块在执行，代码块放在一个任务队列(job queue)中，
每当一个代码块准备执行，就会被添加到任务队列，JS引擎执行完一段代码后，事件循环会执行队列中的下一个任务，队列中的任务会从第一个执行到
最后一个。
## 事件模型
事件模型,适用于响应用户交互和完成类似的低频功能，但是对于复杂的需求不是很灵活

```
let btn = document.querySelector('.button')
    btn.onclick = function (event) {
}
```

## 回调模式
回调模式，如果嵌套了太多回调，会陷入回调地狱

## Promise
### Promise基础知识
* Promise相当于异步操作的占位符，让函数返回一个Promise
Promise生命周期：
* 先处于进行中(pending)状态，此时操作未完成，它也是未处理(unsettled)的，一旦异步操作结束，Promise变为已处理(settled)状态
* 之后会进入Fulfilled(完成)或者Rejected(未成功)状态
* 内部属性[[PromiseState]]被用来表示三种状态pending\fufilled\rejected

* Promise有then()方法接收两个参数，fufilled状态调用的函数、rejected状态调用的函数

* 如果有一个对象实现了then()方法，那么称之为thenable对象，所有Promise都是thenable对象。但并非所有thenable对象都是promise

* Promise还有一个chache()方法用来接收错误，如果不给Promise添加拒绝处理程序，那么所有错误将被忽略，所以一定要添加

* 每次调用then()\cache()方法时都会创建一个任务，当promise被解决时，这些任务都会加入到一个为Promise定制的独立队列中

### 创建未完成的Promise

```
function Fun() {
    return new Promise((resolve,reject)=>{
        resolve()
    })
}
Fun().then(res=>{
}).catch(err=>{
})
```


Promise执行器会立即执行，之后才会执行后续流程的代码

```
function Fun1() {
    return new Promise((resolve,reject)=>{
        //这里会立即执行
        console.log(1)
        resolve(3)
    })
}
Fun1().then(res=>{
    //这里会被添加到任务对列中并异步执行
    //完成处理程序和拒绝处理程序总被添加到任务对列的末尾
    console.log(res)
})
console.log(2)
```


### 创建已处理的Promise
Promise.resolve(),接收参数返回一个完成状态的Promise,不会有任何编排过程

```
let promise = Promise.resolve(1)
promise.then(res=>{
    console.log(res)
})
promise.then(res=>{
    console.log(res)
})
```

### 创建拒绝状态的Promise
Promise.reject('error'),创建拒绝状态的Promise

### 非Promise的Thenable对象

非Promise的Thenable对象，如果传入一个非Promise的Thenable对象，则这些方法会创建一个新的Promise并在then()函数中调用

```
let thenable = {
    then(resolve,reject){
        setTimeout(()=>{
            resolve('thenable')
        },1000)
    }
}
let p1 = Promise.resolve(thenable)
p1.then(res=>{
    console.log(res)
})
```


 * 可以使用Promise.resolve()或者Promise.reject()处理非Promise的Thenable对象，
 * ES6之前许多库使用了thenable对象，所以如果想兼容之前已有的库，需要将Thenable对象转换为正式的Promise对象，
 * 如果不确定某个对象是否为Promise对象，那么可以根据预期的结果将其传入Promise.resolve()或Promise.reject()
 * 如果是Promise则不会有任何变化


```
var original = Promise.resolve('我在第二行');
var cast = Promise.resolve(original);
cast.then(function(value) {
    console.log('value: ' + value);
});
console.log('original === cast ? ' + (original === cast));
```

打印顺序如下，这里有一个同步异步先后执行的区别
- original === cast ? true
- value: 我在第二行

### Resolve一个thenable对象

```
var p1 = Promise.resolve({
        then: function(onFulfill, onReject) { onFulfill("fulfilled!"); }
    });
console.log(p1 instanceof Promise) // true, 这是一个Promise对象

p1.then(function(v) {
    console.log(v); // 输出"fulfilled!"
}, function(e) {
    // 不会被调用
});
```


### Thenable在callback之前抛出异常
Promise rejects

```
var thenable = { then: function(resolve) {
        throw new TypeError("Throwing");
        resolve("Resolving");
    }};

var p2 = Promise.resolve(thenable);
p2.then(function(v) {
    // 不会被调用
}, function(e) {
    console.log(e); // TypeError: Throwing
});
```


### Thenable在callback之后抛出异常
Promise resolves

```
var thenable = { then: function(resolve) {
        resolve("Resolving");
        throw new TypeError("Throwing");
    }};

var p3 = Promise.resolve(thenable);
p3.then(function(v) {
    console.log(v); // 输出"Resolving"
}, function(e) {
    // 不会被调用
});
```

## 执行器错误
* 如果执行器内部抛出一个错误，那么Promise的拒绝程序就会被调用


```
let p3 = new Promise(function (resolve,reject) {
    throw new Error('Explosion')
    //等价于
    // try{
    //     throw new Error('Explosion')
    // }catch (e) {
    //     reject(e)
    // }
})
p3.catch(function (error) {
    console.log(error.message)
})
```

## 全局的Promise错误处理
### NodeJS中：
* 1、unhandledRejection在一个事件中当Promise被拒绝，并且没有提供拒绝处理程序时该事件被触发
* 2、rejectionHandled在一个事件循环后，当Promise被拒绝时，若拒绝处理程序被调用，触发该事件

拒绝原因以及被拒绝的promise作为参数被传入unhandleRejection事件处理程序

```
let rejected
process.on('unhandleRejection',function (reason,promise) {
    console.log(reason.message)
    console.log(rejected === promise)
})
rejected = Promise.reject(throw new Error('Explosion'))

//rejectionHandle事件在拒绝处理程序最后被调用时触发，如果在创建rejected之后直接添加拒绝处理程序，那个rejectionHandle事件不会被触发
let rejected
process.on('rejectionHandle',function (promise) {
    console.log(rejected === promise)
})
rejected = Promise.reject(new Error('Explosion'))
setTimeout(()=>{
    rejected.catch(err=>{
        console.log(err.message)
    })
},1000)
```


通过rejectionHandle和事件unhandleRejection将潜在未处理的拒绝存储为一个列表


```
let possiblyUnhandleRejections = new Map()
//如果一个拒绝没有被处理，则添加到map集合中
process.on('unhandledRejection',function (reason,promise) {
    possiblyUnhandleRejections.set(promise,reason)
})

//如果被处理了，移除promise
process.on('rejectionHandled',function (promise) {
    possiblyUnhandleRejections.delete(promise)
})

//循环未处理的Promise
setInterval(function () {
    possiblyUnhandleRejections.forEach(function (reason,promise) {
        //做一些处理
    })
    possiblyUnhandleRejections.clear()
},6000)
```


### 浏览器环境的拒绝处理
* unhandledrejection:当一个Promise被拒绝并且没有提供拒绝处理时触发
* rejectionhandled:在一个事件循环后,当Promise被拒绝时，若拒绝处理程序被调用，则触发该事件

用DOM0级标记法onunhandledrejection和onrejectionhandled


```
let possiblyUnhandleRejections = new Map()
//如果一个拒绝没有被处理，添加到map中
window.onunhandledrejection = function (event) {
    possiblyUnhandleRejections.set(event.promise,event.reason)
}
//如果出发了拒绝方法，从map中删除
window.onrejectionhandled = function (event) {
    possiblyUnhandleRejections.delete(event.promise)
}
//循环遍历处理
setInterval(()=>{
    possiblyUnhandleRejections.forEach((promise,reason)=>{
        console.log('111111')
        console.log(promise)
        console.log(reason)
    })
    possiblyUnhandleRejections.clear()
},3000)
let p5 = Promise.reject('111')
```


## 串联Promise
每次调用then()、cache()方法，实际上创建并且返回了另一个Promise，当只有第一个Promise完成或者被拒绝后，第二个才会被解决

```
let p7 = new Promise((resolve,reject)=>{
    resolve(1)
})
p7.then((res)=>{
    console.log(res)//1
}).then(res=>{
    console.log('Finished')
}).catch(err=>{
    //这里可以处理公共的错误
})
```


* 务必在Promise的结尾有一个处理拒绝的程序，以便能够正确处理所有的错误

## Promise的链返回值
* Promise中返回一个值可以沿着这条链传递数据
* 如果返回的是Promise对象，那么要看返回的Promise怎么处理

## 响应多个Promise
* Promise.all()
* 只有迭代中所有Promise都解决后才被解决
* 如果有一个被拒绝，那么返回的Promise就立即被拒绝

## Promise.race()
* 只要有一个被解决返回，Promise就被解决


## 自Promise继承
* 定义自己的Promise来扩展内建Promise功能
* 由于MyPromise.resolve()和MyPromise.reject()通过Symbol.species属性决定返回Promise类型，所以无论传什么值，都会返回MyPromise实例


```
class MyPromise extends Promise{
    success(resolve,reject){
        return this.then(resolve,reject)
    }
    failure(reject){
        return this.cache(reject)
    }
}

let mPromise = new MyPromise(function (resolve,reject) {
    resolve('1')
})
mPromise.success(res=>{

}).failure(err=>{

})
```



## Promise的异步执行

对已完成的promise执行then,此时会执行then的操作

```
const promise = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('111')
    },1000)
})
setTimeout(()=>{
    promise.then(res=>{
        console.log(res)
    })
},3000)
```



### then里面不返回新的promise

```
new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('2222')
    },1000)
}).then((res)=>{
    (function f() {
        return new Promise(resolve=>{
            setTimeout(()=>{
                resolve('333')
            },1000)
        })
    }())
    console.log(res)
    return false
}).then(res=>{
    console.log(res)
})
```

### then的嵌套
需要返回一个新的promise实例才可以等resolve之后回调

错误处理,catch也会返回promise实例，后面的then和catch也会执行

```
new Promise((resolve, reject) => {
    // reject('123')
    // throw new Error('1111')
}).then(res => {
}).catch(err => {
    console.log(err)
})
```


### promise.all 与 map 连用

```
let arr = [1,2,3]
Promise.all(arr.map(item=>{
    return new Promise(resolve=>{
        resolve('1111')
    })
})).then(all=>{
    console.log(all)
})
```

### promise实现队列，使用.then返回新的promise实例

```
let arr = [1,2,3,4]
function queue(arr) {
    let promise = Promise.resolve()
    arr.forEach(item=>{
        promise = promise.then(res=>{
            console.log(res)
            return new Promise(resolve=>{
                 // 在这里处理相关逻辑
                resolve(item)
            })
        })
    })
    return promise
}
queue(arr).then(res=>{
    console.log(res)
})
```



### promise.resolve

```
Promise.resolve().then(res=>{
    return Promise.resolve('123')
}).then(res=>{
    console.log(res)
    return Promise.resolve(new Promise(resolve=>{
        setTimeout(()=>{
            resolve('456')
        },1000)
    })).then(res=>{
        console.log(res)
        Promise.resolve({
            then(){
                console.log('7890')
            }
        })
    })
})
```
