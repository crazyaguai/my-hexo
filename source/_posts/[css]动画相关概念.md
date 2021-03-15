---
title: <css>动画相关概念
date: 2019-02-16 00:00:00
tags: [css,动画]
categories: css
---

### transition

#### 基本参数

1. transition-property: 过渡属性(默认值为all)

- 只有具有中间值的属性才具备过渡效果

2. transition-duration: 过渡持续时间(默认值为0s)

- 单位是秒s或毫秒ms

3. transiton-timing-function: 过渡函数(默认值为ease函数)

- steps函数，将过渡时间划分成大小相等的时间时隔来运行，steps(<integer>[,start | end]?)，第二个参数: 该参数可选，默认是end，表示开始值保持一次；若参数为start，表示开始不保持（设置start开始就执行第一次变化）。
- 贝塞尔曲线
- 关键字，关键字其实是bezier函数或steps函数的特殊值

```
ease: 开始和结束慢，中间快。相当于cubic-bezier(0.25,0.1,0.25,1)
linear: 匀速。相当于cubic-bezier(0,0,1,1)
ease-in: 开始慢。相当于cubic-bezier(0.42,0,1,1)
ease-out: 结束慢。相当于cubic-bezier(0,0,0.58,1)
ease-in-out: 和ease类似，但比ease幅度大。相当于cubic-bezier(0.42,0,0.58,1)
step-start: 直接位于结束处。相当于steps(1,start)
step-end: 位于开始处经过时间间隔后结束。相当于steps(1,end)
```

4. transition-delay: 过渡延迟时间(默认值为0s)

- 单位是秒s或毫秒ms

#### 复合属性

```
transition: <transition-property> || <transition-duration> || <transition-timing-function> || <transition-delay>
```

#### 多值、无效值、重复值情况

```
#test1{
    transition-property: width,width,xxx,background;
    transition-duration: 2s,500ms;
    transition-timing-function: linear,ease;
    transition-delay: 200ms,0s;
}
/*类似于*/
#test2{
    transition: width 500ms ease 0ms,background 500ms ease 0ms;
}
```

#### 触发方式

- :hover、:focus、:active
- @media触发
- 事件改变属性

#### 过渡transitionend事件

```
document.getElementById('tran').addEventListener('transitionend',(e)=>{
    console.log(e.propertyName)//属性名称
    console.log(e.elapsedTime)//过度时间
    console.log(e.pseudoElement)//如果transition效果发生在伪元素，会返回该伪元素的名称，以“::”开头。(::after)
})
```

1. 过渡分为两个阶段：前进阶段和反向阶段。transitionend事件在前进阶段结束时会触发，在反向阶段结束时也会触发。
2. 如果过渡属性是复合属性，如border-width相当于是border-top-width、border-bottom-width、border-left-width和border-right-width这四个属性的集合。则过渡事件触发4次。
3. 如果过渡属性是默认值all，则过渡事件的次数是计算后的非复合的过渡属性的个数。如果发生过渡的属性是border-width和width，则经过计算后过渡事件应该触发5次。
4. 如果过渡延迟时间为负值，且绝对值大于等于过渡持续时间时，低版本webkit内核浏览器不会产生过渡效果，但会触发过渡事件；而其他浏览器即不会产生过渡效果，也不会触发过渡事件。
5. 如果过渡属性存在复合属性及该复合属性包含的非复合属性，则浏览器计算复合属性的子属性时，不会重复计算已包含的属性。

#### 参考

- https://www.cnblogs.com/xiaohuochai/p/5347930.html

### animation

#### 基本参数

1. animation-name ：检索或设置对象所应用的动画名称

```
@keyframes testanimations {
	from { transform: translate(0, 0); }
	20% { transform: translate(20px, 20px); }
	40% { transform: translate(40px, 0); }
	60% { transform: translate(60px, 20); }
	80% { transform: translate(80px, 0); }
	to { transform: translate(100px, 20px); }
}
```

2. animation-duration ：检索或设置对象动画的持续时间
3. animation-timing-function：检索或设置对象动画的过渡类型

- linear：线性过渡。等同于贝塞尔曲线(0.0, 0.0, 1.0, 1.0)
- ease：平滑过渡。等同于贝塞尔曲线(0.25, 0.1, 0.25, 1.0)
- ease-in：由慢到快。等同于贝塞尔曲线(0.42, 0, 1.0, 1.0)
- ease-out：由快到慢。等同于贝塞尔曲线(0, 0, 0.58, 1.0)
- ease-in-out：由慢到快再到慢。等同于贝塞尔曲线(0.42, 0, 0.58, 1.0)
- step-start：等同于 steps(1, start)
- step-end：等同于 steps(1, end)
- steps(<integer>[, [ start | end ] ]?)：接受两个参数的步进函数。第一个参数必须为正整数，指定函数的步数。第二个参数取值可以是start或end，指定每一步的值发生变化的时间点。第二个参数是可选的，默认值为end。
- cubic-bezier(<number>, <number>, <number>, <number>)：特定的贝塞尔曲线类型，4个数值需在[0, 1]区间内

4. animation-delay：检索或设置对象动画延迟的时间
5. animation-iteration-count：检索或设置对象动画的循环次数
- infinite：无限循环
- <number>：指定对象动画的具体循环次数
6. animation-direction：检索或设置对象动画在循环中是否反向运动

- normal：正常方向
- reverse：反方向运行
- alternate：动画先正常运行再反方向运行，并持续交替运行
- alternate-reverse：动画先反运行再正方向运行，并持续交替运行

7. animation-fill-mode：检索或设置对象动画时间之外的状态

- none：默认值。不设置对象动画之外的状态
- forwards：设置对象状态为动画结束时的状态
- backwards：设置对象状态为动画开始时的状态
- both：设置对象状态为动画结束或开始的状态

8. animation-play-state ：检索或设置对象动画的状态。w3c正考虑是否将该属性移除，因为动画的状态可以通过其它的方式实现，比如重设样式

- running：运动
- paused：暂停

#### 复合属性

```
animation: <single-animation-name> || <animation-duration> || <single-animation-timing-function> || <animation-delay> || <single-animation-iteration-count> || <single-animation-direction> || <single-animation-fill-mode> || <single-animation-play-state>
```

#### 参考

- https://www.css88.com/book/css/properties/animation/animation.htm

### Web Animations API

#### 参考

- https://www.zhangxinxu.com/wordpress/2018/03/web-animations-api-dynamic-feature-animation/
- https://juejin.im/post/5bc58bd9e51d450e721108a4

### SVG SMIL animation

#### 参考
- https://www.zhangxinxu.com/wordpress/2014/08/so-powerful-svg-smil-animation/

### Canvas绘制
