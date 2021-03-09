---
title: 平滑生成大量div方法
date: 2019-04-18 18:18:29
tags: [js]
categories: js
---


### DocumentFragment

- 创建没有父级的最小对象
- 当请求把一个 DocumentFragment 节点插入文档树时，插入的不是 DocumentFragment 自身，而是它的所有子孙节点。
- 使用document.createDocumentFragment()创建

### window.requestAnimationFrame()

- 在浏览器下一次重绘之前执行
- 回调函数执行次数通常是每秒60次，但在大多数遵循W3C建议的浏览器中，回调函数执行次数通常与浏览器屏幕刷新次数相匹配。

```
//方法1
function insertDiv(num) {
    let frame = document.createDocumentFragment()
    for(let i = 0;i<100;i++){
        let div = document.createElement('div')
        frame.appendChild(div)
    }
    document.body.appendChild(frame)
    if(100*num<20000000000){
        console.log(num)
        setTimeout(function () {
            insertDiv(num+1)
        },17)
    }
}
setTimeout(function () {
    insertDiv(1)
},17)
//方法2
function insertDiv(num) {
    let frame = document.createDocumentFragment()
    for(let i = 0;i<100;i++){
        let div = document.createElement('div')
        frame.appendChild(div)
    }
    document.body.appendChild(frame)
    if(100*num<20000000000){
        window.requestAnimationFrame(function () {
            insertDiv(num+1)
        })
    }
}
window.requestAnimationFrame(function () {
    insertDiv(1)
})
```
