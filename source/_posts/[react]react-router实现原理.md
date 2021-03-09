---
title: react-router实现原理
date: 2020-06-11 00:00:00
tags: [react]
categories:  react
---

#### 前端路由解决方案

- 解决思路：1、拦截用户的刷新操作，避免服务端盲目响应、返回不符合预期的资源内容 2、感知 URL 的变化

##### hash模式

- hash 的改变

```javascript
// hash 的改变：我们可以通过 location 暴露出来的属性，直接去修改当前 URL 的 hash 值
window.location.hash = 'home'
```

- hash变化监听：通过监听 “hashchange”事件，可以用 JS 来捕捉 hash 值的变化，进而决定我们页面内容是否需要更新

```javascript
// 监听hash变化，点击浏览器的前进后退会触发
window.addEventListener('hashchange', function(event){ 
    // 根据 hash 的变化更新内容
},false)
```

##### history

- history api
- 通过html5 新特性：pushState、replaceState实现

```javascript
window.history.forward()  // 前进到下一页
window.history.back() // 后退到上一页
window.history.go(2) // 前进两页
window.history.go(-2) // 后退两页

// html5新特性
history.pushState(data[,title][,url]); // 向浏览历史中追加一条记录
history.replaceState(data[,title][,url]); // 修改（替换）当前页在浏览历史中的信息
```

- 监听变化

```
window.addEventListener('popstate', function(e) {
  console.log(e)
});
```

- history模式需要在服务端完成 historyApiFallback 配置

#### react-router设计模式

##### Monorepo设计

- 与 Monorepo 相对的概念是Multirepo。Multirepo 就是我们常用的开发模式，一个仓库对应一个工程，子团队自行维护
- React Router 使用了 Monorepo 的工程架构，使工程代码对团队中的每一个人都具备透明度
- 通常会使用 Lerna 作为开发管理 Monorepo 的开发工具，它的主要用户包括 Babel、React、umi、React Router 等

##### Context数据共享

- 使用 Context API 完成数据共享

#### react-router相关库

- 在 React Router 内部主要依靠 history 库完成，这是由 React Router 自己封装的库，为了实现跨平台运行的特性，内部提供两套基础 history，一套是直接使用浏览器的 History API，用于支持 react-router-dom；另一套是基于内存实现的版本，这是自己做的一个数组，用于支持 react-router-native
- react-router 是没有 UI 层的，react-router-dom = react-router + Dom UI，而 react-router-native = react-router + native UI

#### react-router关键模块

1. Context 容器，分别是 Router 与 MemoryRouter，主要提供上下文消费容器；
2. 直接消费者，提供路由匹配功能，分别是 Route、Redirect、Switch；
3. 与平台关联的功能组件，分别是 react-router-dom 中的 Link、NavLink 以及 react-router-native 中的 DeepLinking









