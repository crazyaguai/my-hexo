---
title: <css>视口概念
date: 2019-01-20 00:00:00
tags: [视口,h5]
categories: 视口
---
### 视口

#### 像素（pixel）

1. 设备像素：任何屏幕的物理像素数量是固定的
2. CSS像素：CSS抽象的

#### 布局视口

- 概念

1. CSS中，被称为初始包含块，是所有CSS百分比宽度推算的根源。
2. PC浏览器布局视口的宽度与浏览器的宽度相同。
3. 移动端浏览器，布局视口与浏览器屏幕宽度不再相互关联，完全独立。

- js获取方式

1. document.documentElement.clientWidth
2. document.documentElement.clientWidth

#### 视觉视口

- 概念

1. 用户正在看到的网站区域，用户可以通过缩放操作视觉视口，同时不会影响布局视口，布局视口仍会保持原来的宽度。
2. 移动端视觉视口与设备屏幕一样宽，并且它表示的CSS像素数量会根据缩放改变。

- js获取方式

1. window.innerWidth
2. window.innerHeight

#### 理想视口

- 概念

1. 移动设备上，布局视口的默认宽度不是一个理想的宽度，因此引进理想视口。
2. 当网站是移动设备使用时理想视口才会生效（meta标签生效）。
3. 设置布局视口宽度与理想视口宽度一致。
4. 浏览器厂商决定理想视口。

```
<meta name="device" content="width=device-width">
```

- js获取方式

1. screen.width/height 存在严重的兼容性问题，也可能返回浏览器设备像素尺寸。

### 视口之间的关系

1. 桌面浏览器，浏览器窗口就是布局视口。
2. 手机上，布局视口限制CSS布局，视觉视口决定用户看到的内容。
3. 理想视口是移动浏览器布局的一个理想尺寸，可以把布局视口尺寸设置为理想视口尺寸，实现响应式布局。

### 缩放

- 缩放行为在手机和桌面上区别很大。
- 桌面上：

1. 行为一般是一次性的。
2. 布局视口会被缩放影响，因为桌面布局视口与视觉视口相同。

- 移动设备上

1. 缩放是一个交互过程
2. 布局视口不会被缩放影响。
3. 移动端缩放不会导致CSS布局被重新计算。
4. 移动端浏览器根据理想视口的大小来计算缩放程度。
5. 拖放
6. 禁止缩放

```
<meta name="viewport" content="user-scalable=no">
```

### 分辨率

#### 物理分辨率

1. 物理分辨率 = 像素数量 / 英寸单位宽度
2. 简称DPI
3. 每英寸像素数量越多显示越清晰
4. 有些手机可以动过screen.width获取，但是有兼容性问题
5. 96dpi = 1dppx

```
//css使用需要加单位
@media all and (min-resolution: 192dpi){

}
```

#### 设备像素比

1. 设备像素比 = 设备像素个数 / 理想视口
2. 简称DPR(Device Pixel Ratio)
3. js属性window.devicePixelRatio
4. CSS device-pixel-ratio（基于webkit浏览器）和分辨率的媒体查询。
5. 浏览器厂商决定理想视口，因此DPR也由他们决定。
6. 单位dppx但是使用时不需要添加。
7. 96dpi = 1dppx

```
//js使用
if(window.devicePixelRatio>=2){

}
//css使用
@media all and (-webkit-min-device-pixel-ratio: 2){

}
```

### meta

1. width：设置布局视口宽度为特定值。
2. initial-scale：设置页面初始缩放程度和布局视口的宽度。
3. minimum-scale\maximum-scale设置用户最小最大可缩放程度。
4. user-scalable：是否阻止缩放。

- 将布局视口设置为设备理想视口

```
<meta name="viewport" content="width=device-width">
```

- initial-scale

1. 缩放程度根据理想视口计算。
2. initial-scale=1时，视觉视口和理想视口尺寸一样。
3. initial-scale=2时，会放大到200%，此时视觉视口的宽高是理想视口的一半。
4. 使用initial-scale，同时会将布局视口的尺寸设置为缩放后的尺寸。
5. initial-scale与width=decice-width效果一样。

```
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
```

### 媒体查询

- 语法

1. 媒介类型：media_type: all | aural | braille | handheld | print | projection | screen | tty | tv | embossed
2. and

```
@media tv and (min-width: 700px) and (orientation: landscape) { }
```

3. or：使用逗号分隔效果等同于or逻辑操作符

```
@media (min-width: 700px), handheld and (orientation: landscape) {}
```

4. not：not关键字仅能应用于整个查询，而不能单独应用于一个独立的查询

```
//例如
@media not all and (monochrome) {}
//等价于
@media not (all and (monochrome)) {}
//而不是
@media (not all) and (monochrome) {}
```
```
@media not screen and (color), print and (color)
//等价于
@media (not (screen and (color))), print and (color)
```

- [MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Media_queries)

#### 媒体查询三种类型：

1. 媒介查询，是什么类型的设备

```
@media print{
}
```

2. 视口相关查询

```
//布局视口宽度小于等于400px时生效
@media all and (max-width: 400){
}
```
```
//布局视口不超过400px，设备处于横屏，并且devicePixelRatio小于1.5时生效
@media all and (max-width: 400) and (orientation: potrait) and  ((max-resolution: 144dpi),(-webkit-max-device-pixel-ratio: 1.5)) {}
```

3. 特性相关查询，浏览器是否支持某些特性

```
@supports ( display: flex ) {
    .foo { display: flex; }
}
```

