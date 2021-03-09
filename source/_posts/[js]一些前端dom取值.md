---
title: 一些前端dom取值
date: 2019-04-15 20:41:53
tags: [js,DOM,css]
categories: DOM取值
---


### css尺寸

- $().outerWidth()==el.offsetWidth 即border box尺寸
- $().innerWidth()==el.clientWidth 即padding box 尺寸
- $().outerWidth(true) margin box 尺寸(可能会是负的，没有原生对应)
- document.documentElement.offsetHeight和document.body.offsetHeight默认会包含滚动区域高度（没有设置height值）

### offsetTop

- 元素相对于 offsetParent 的边界框

```
function getOffset(obj) {
    let offsetL = 0;
    let offsetT = 0;
    while (obj !== window.document.body && obj !== null) {
        offsetL += obj.offsetLeft;
        offsetT += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return {
        top: offsetT,
        left: offsetL
    }
}
```

### getBoundingClientRect()

- 获取元素距离视口的距离el.getBoundingClientRect()
- 返回元素的大小及其相对于视口的位置

### scrollTop兼容写法

```
let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
```

### scrollHeight

- 包含padding

### window.screen.height

- 整个屏幕高

### window.screen.availHeight

- 可用工作区高度
