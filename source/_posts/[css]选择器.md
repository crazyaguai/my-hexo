---
title: <css>选择器
date: 2019-04-20 00:00:00
tags: [css]
categories: css
---

### 选择器

- [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference#Selectors)
- [选择器参考手册](http://www.w3school.com.cn/cssref/css_selectors.asp)

### 优先级

- 接近度对优先级没有影响
- 内联 > ID选择器 > 类选择器 > 标签选择器

#### 计算规则

- 优先级由(A,B,C,D)四项值决定。
- 从左往右依次进行比较，较大者胜出，如果相等，则继续往又移动一位进行比较 。如果4位全部相等，则后面的会覆盖前面的
- 计算方法

1. 如果存在内联样式，那么 A = 1, 否则 A = 0;
2. B 的值等于 ID选择器 出现的次数;
3. C 的值等于 类选择器 和 属性选择器 和 伪类 出现的总次数;
4. D 的值等于 标签选择器 和 伪元素 出现的总次数。

#### !important

- max-width超越width !important
