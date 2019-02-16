---
title: js-eventLoop
date: 2018-10-20 20:12:52
tags: [js]
categories: js
---

### Micro-Task 与 Macro-Task

- 事件循环中的异步队列有两种：macro（宏任务）队列和
micro（微任务）队列。

#### macro-task

- setTimeout、setInterval、 setImmediate、script（整体代码）、 I/O 操作、UI 渲染等

#### micro-task

- process.nextTick、Promise、MutationObserver 等。

### Event Loop 过程

1. 初始状态：调用栈空。micro 队列空，macro 队列里有且只有一个 script 脚本（整体代码）。
2. 全局上下文（script 标签）被推入调用栈，同步代码执行。在执行的过程中，通过对一些接口的调用，可以产生新的 macro-task 与 micro-task，它们会分别被推入各自的任务队列里。同步代码执行完了，script 脚本会被移出 macro 队列，这个过程本质上是队列的 macro-task 的执行和出队的过程。
3. macro-task 出队时，任务是一个一个执行的；而 micro-task 出队时，任务是一队一队执行的，因此，一个 macro-task执行完成后，会清空 micro-task对列。
4. 执行渲染操作，更新界面
5. 检查是否存在 Web worker 任务，如果有，则对其进行处理 。

### 例子

```
async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}

async function async2() {
    console.log('async2')
}

console.log('script start')

setTimeout(function () {
    console.log('setTimeout')
}, 0)

async1();

new Promise(function (resolve) {
    console.log('promise1')
    resolve();
}).then(function () {
    console.log('promise2')
})

console.log('script end')
```

- 执行script标签内容（script start）-> setTimeout 进入 Macro-Task 对列 -> 执行 async1（async1 start）-> 执行 async2 (async2) ->由于 await async2 进入等待 -> 执行 Promise （promise1）-> promise.then() 进入 Micro-Task 对列 -> script 执行结束（script end）->清空 Micro-Task 对列（promise2）-> await 执行（async1 end）->执行新的 Macro-Task 任务（setTimeout）
- 注意：node环境以及babel转换或者部分浏览器执行顺序有所不同
