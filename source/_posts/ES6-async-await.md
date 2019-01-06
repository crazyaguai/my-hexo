---
title: ES6-async&await
date: 2018-12-10 12:16:25
tags: [js,async&await]
categories: js
---
1. async 做一件什么事情?
- 带 async 关键字的函数，它使得你的函数的返回值必定是 promise 对象
- 如果async关键字函数返回的不是promise，会自动用Promise.resolve()包装
- 如果async关键字函数显式地返回promise，那就以你返回的promise为准
- 在语义上要理解，async表示函数内部有异步操作
- 另外注意，一般 await 关键字要在 async 关键字函数的内部，await 写在外面会报错
2. await 在等什么？
- await等的是右侧「表达式」的结果
```
async function async1() {
    console.log( 'async1 start' )
    await async2()
    console.log( 'async1 end' )
}
async function async2() {
    console.log( 'async2' )
}
async1()
console.log( 'script start' )
//async1 start
//async2
//script start
//async1 end
```
3. await 等到之后，做了一件什么事情？
- 如果不是 promise , await会阻塞后面的代码，先执行async外面的同步代码，同步代码执行完，再回到async内部，把这个非promise的东西，作为 await表达式的结果
- 如果它等到的是一个 promise 对象，await 也会暂停async后面的代码，先执行async外面的同步代码，等着 Promise 对象 fulfilled，然后把 resolve 的参数作为 await 表达式的运算结果
#### 来自
1. https://segmentfault.com/a/1190000007535316
2. https://segmentfault.com/a/1190000017224799
