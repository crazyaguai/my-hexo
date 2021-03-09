---
title: scroll相关
date: 2019-04-17 10:43:22
tags: [js,scroll]
categories: scroll
---


### scroll-behavior

- 平滑滚动css属性

### scroll()、scrollTo()、scrollBy()

- scrollBy()沿着坐标轴滚动的距离
- 可以添加options对象

```
window.scrollTo({
    top: 0,
  	left: 0,
  	behavior: 'smooth'
})
```

### scrollIntoView()

- 滚动到当前窗口可视区域

```
//滚动到视口顶端
ele.scrollIntoView()
//滚动到视口底部
ele.scrollIntoView(false)
//滚动到中间位置
ele.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
})
```

### overscroll-behavior

- auto - 默认。元素的滚动会传播给祖先元素
- contain - 阻止滚动链接，滚动不会传播给祖先
- none - 和 contain 效果一样
- [浏览器支持](https://caniuse.com/#search=overscroll-behavior)

### Scroll snap

- 规范滚动元素的定位
- scroll-snap-type：https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-snap-type
- scroll-snap-align：https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-align

### history.scrollRestoration

- 设置返回页面是否返回原滚动位置

### js实现平滑滚动

```
var scrollSmoothTo = function (position) {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            return setTimeout(callback, 17);
        };
    }
    // 当前滚动高度
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    // 滚动step方法
    var step = function () {
        // 距离目标滚动距离
        var distance = position - scrollTop;
        // 目标滚动位置
        scrollTop = scrollTop + distance / 5;
        if (Math.abs(distance) < 1) {
            window.scrollTo(0, position);
        } else {
            window.scrollTo(0, scrollTop);
            requestAnimationFrame(step);
        }
    };
    step();
};

if (typeof window.getComputedStyle(document.body).scrollBehavior == 'undefined') {
   // 传统的JS平滑滚动处理代码...
}
```
