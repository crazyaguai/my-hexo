---
title: <node>nodejs使用
date: 2021-02-20 00:00:00
tags: [node]
categories: node
---

### nodejs特点

- js运行环境，基于chromeV8引擎解析代码，事件驱动，异步驱动，非阻塞I/O，高并发，单线程

- nodejs前端工程化与后端服务应用：
1. 运行环境：
	工程化：运行在本机开花环境
	服务：运行在远程服务器，涉及到发布工具（devops），进程管理工具（PM2）,监控告警机制，日志打印及跟踪染色
2. 受众群体不同：
	工程化：服务开发者，提升开发效率，研发质量
	服务：真实用户群体，需要关注服务稳定性，并发性能，考虑扩容方案，优化服务性能
3. 问题调试：
	工程化：本地运行，可以在脚本中打log
	服务：需要高性能日志工具，遇到内存泄漏、句柄泄漏或者进程异常退出等问题，需要工具分析
4. 关注点不同：
	工程化：注重开发效率提升以及研发质量保证
	服务：真正发挥node异步驱动特性，在非CPU密集场景下，开发网络I/O较高服务

### 事件循环

- node 10+ 版本后在运行结果上与浏览器一致，但是基于 libev 库实现，浏览器的核心是宏任务和微任务，node 有阶段性任务执行阶段

#### 循环阶段

1. timers：执行 setTimeout、setInterval 回调函数
2. pending callbacks：执行操作系统回调，如 TCP 错误回调
3. idle、prepare：仅系统内部使用
4. poll：检索新的 I/O 事件，执行与 I/O 相关的回调
5. check：执行 setImmediate 回调，setImmediate 并不是立马执行，而是当事件循环 poll 中没有新的事件处理时就执行该部分
6. close callbacks：执行关闭的回调，如 socket.on('close', ...)

- 发起事件循环起点：
	nodejs 启动后
	setTimeout、setInterval 回调
	某一次 I/O 回调

#### poll过程

- poll 过程中，主要处理的是异步 I/O 的回调函数，以及其他几乎所有的回调函数，异步 I/O 又分为网络 I/O 和文件 I/O

#### 微任务宏任务

- 微任务：process.nextTick 和 Promise，同一个事件循环中有其他任务存在时，优先执行微任务队列，优先级 process.nextTick 高于 Promise
- 宏任务：setTimeout、setInterval、setImmediate 和 I/O，宏任务在微任务执行之后执行，因此在同一个事件循环周期内，如果既存在微任务队列又存在宏任务队列，那么优先将微任务队列清空，再执行宏任务队列

```javascript
"use strict";
const process = require("process");
const fs = require("fs");
const path = require("path");

console.log("start");

function promiseRun() {
  Promise.resolve().then(() => {
    console.log("promise");
  });
}

fs.readFile(path.resolve(__dirname, "./file.txt"), (err, data) => {
  if (err) {
    throw err;
  }
  promiseRun();
  console.log("fs io callback");
});

setImmediate(() => {
  promiseRun();
  console.log("immediate");
});

setTimeout(() => {
  promiseRun();
  console.log("timeout");
  fs.readFile(path.resolve(__dirname, "./file.txt"), (err, data) => {
    if (err) {
      throw err;
    }
    console.log("async fs io callback");
  });
}, 0);

promiseRun();

process.nextTick(() => {
  console.log("nextTick");
});

console.log("end");

// start
// end
// nextTick
// promise
// timeout
// promise
// immediate
// promise
// fs io callback
// promise
// async fs io callback
```

#### 单线程多线程

- node 主线程是单线程执行的，但是 Node.js 存在多线程执行，多线程包括 setTimeout 和异步 I/O 事件。其实 Node.js 还存在其他的线程，包括垃圾回收、内存优化等

### node适用服务场景

- 适用场景：
	业务网关：鉴权处理服务，特性：网络 I/O 高，高并发，不涉及 CPU 密集逻辑
	中台服务：配置系统、反馈系统、推送系统、系统工具搭建，特点：网络 I/O高、并发高、通用性强及业务复杂度低
	运营系统：并发高，不涉及底层数据库读写
	爬虫系统：puppeteer，jsdom 等库支持动态静态爬虫抓取

- 不适用场景：node 不适用阻塞主线程、CPU 密集型运算的服务，如：图片处理、大字符串数字处理、大文件读写

### nodejs框架

#### express与koa区别

- expres内置很多中间件，比如connext、router，koa更加轻量化，可以根据需求定制框架
- 中间件处理：express基于callback处理，koa基于await/async处理
- 异步执行中间件：express并非严格按照洋葱模型执行中间件，koa严格遵循

#### 中间件

1. express

- 流程
  通过app.use方法注册中间件
  一个中间件为一个layer对象，包含当前路由正则信息以及handle方法
  所有中间件（Layer 对象）使用stack数组存储起来
  每个 Router 对象都是通过一个stack数组，存储了相关中间件函数
  router.handle函数通过next()方法遍历每一个 layer 进行比对，next()方法通过闭包维持了对于 Stack Index 游标的引用，当调用next()方法时，就会从下一个中间件开始查找

- 处理结果

```
((req, res) => {
  console.log('第一个中间件');
  ((req, res) => {
    console.log('第二个中间件');
    (async(req, res) => {
      console.log('第三个中间件 => 是一个 route 中间件，处理 /api/test1');
      await sleep(2000)
      res.status(200).send('hello')
    })(req, res)
    console.log('第二个中间件调用结束');
  })(req, res)
  console.log('第一个中间件调用结束')
})(req, res)
```

- Express 的线形机制不容易实现拦截处理逻辑，会对业务代码有一定程度的侵扰，甚至造成不同中间件间的耦合，例如：记录请求响应的中间件，需要在初始中间件计时，在结束处理中计算时间

2. koa中间件

- 中间件使用

```javascript
// 最外层中间件，可以用于兜底 Koa 全局错误
app.use(async (ctx, next) => {
  try {
    // console.log('中间件 1 开始执行')
    // 执行下一个中间件
    await next();
    // console.log('中间件 1 执行结束')
  } catch (error) {
    console.log(`[koa error]: ${error.message}`)
  }
});
// 第二层中间件，可以用于日志记录
app.use(async (ctx, next) => {
  // console.log('中间件 2 开始执行')
  const { req } = ctx;
  console.log(`req is ${JSON.stringify(req)}`);
  await next();
  console.log(`res is ${JSON.stringify(ctx.res)}`);
  // console.log('中间件 2 执行结束')
});
```

- koa组合中间件流程
  通过compose方法组合中间件，返回一个中间件函数fnMiddleware
  接收请求时，先调用handleRequest（调用createContext方法，封装ctx对象，调用this.handleRequest(ctx, fnMiddleware)处理该次请求）
  通过fnMiddleware(ctx).then(handleResponse).catch(onerror)执行中间件

- compose

```javascript
function compose(middleware) {
  // 这里返回的函数，就是上文中的 fnMiddleware
  return function (context, next) {
    let index = -1;
    return dispatch(0);

    function dispatch(i) {
      //
      if (i <= index)
        return Promise.reject(new Error("next() called multiple times"));
      index = i;
      // 取出第 i 个中间件为 fn
      let fn = middleware[i];

      if (i === middleware.length) fn = next;

      // 已经取到了最后一个中间件，直接返回一个 Promise 实例，进行串联
      // 这一步的意义是保证最后一个中间件调用 next 方法时，也不会报错
      if (!fn) return Promise.resolve();

      try {
        // 把 ctx 和 next 方法传入到中间件 fn 中，并将执行结果使用 Promise.resolve 包装
        // 这里可以发现，我们在一个中间件中调用的 next 方法，其实就是dispatch.bind(null, i + 1)，即调用下一个中间件
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
const fn1 = async (ctx, next) => {
  console.log("1 start");
  await next();
  console.log("1 end");
};
const fn2 = async (ctx, next) => {
  console.log("2 start");
  await next();
  console.log("2 end");
};
const fn3 = async (ctx, next) => {
  console.log("3 start");
  await next();
  console.log("3 end");
};
const fun = compose([fn1, fn2, fn3]);
fun({}, () => {});
// 1 start
// 2 start
// 3 start
// 3 end
// 2 end
// 1 end
```

- dispatch(n)对应第 n 个中间件的执行，第 n 个中间件可以通过await next()来执行下一个中间件，同时在最后一个中间件执行完成后，依然有恢复执行的能力。
- 通过洋葱模型，await next()控制调用 “下游”中间件，直到 “下游”没有中间件且堆栈执行完毕，最终流回“上游”中间件

- 处理结果

```
async function middleware1() {
  ...
  await (async function middleware2() {
    ...
    await (async function middleware3() {
      ...
    });
    ...
  });
  ...
}
```


















