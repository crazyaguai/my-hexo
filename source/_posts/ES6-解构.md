---
title: ES6-解构
date: 2017-08-17 20:00:00
tags: [ES6,js]
categories: ES6
---

对象和数组是JS里面常用的两种数据结构，ES6中添加了简化任务的新特性：结构，是一种打破数据结构，拆分成更小部分的过程。

## 解构对象

```
let obj = {
    a: 1,b: 2
}
let {a,b} = obj//注意右侧要初始化程序
console.log(a)//1
console.log(b)//2
```


### 解构赋值
```
let c = 1
let d = 1
let obj = {
    c: 4,
    d: 5
};//这个符号要加上
({c,d} = obj)//一定要用小括号包上对象的解构赋值
console.log(c)//4
console.log(d)//5
```

### 如果值为null或者undefined会导致程序抛出错误
```
let {a,b} = null//报错
```

### 默认值
```
let obj = {
    a: 2
}
let {a ,b = 1} = obj
console.log(a)//2
console.log(b)//1
```

### 非同名局部变量赋值
```
let node = {
    type: '1'
}
let {type: localType} = node
console.log(localType)//'1'
```


### 嵌套对象解构
```
let obj = {
    a: {
        s: 4
    }
}
let {a: {s}} = obj//此时a不是绑定，只代表在对象中的检索属性位置
console.log(s)//4
```


## 数组解构

```
let arr = [1,2]
let [a,b] = arr
console.log(a,b)//1  2
```


### 数组解构赋值
```
let arr2 = [3,4];//这个;符号必须要加
[a,b] = arr2
console.log(a,b)//3  4
```


### 特殊用法，交换变量位置
```
let m = 1,n=2;
[m,n] = [n,m]
```


### 默认值
```
let arr = [1]
let [a,b=1] = arr
console.log(a,b)//1  1
```


### 嵌套解构
```
let arr = [1,[1,2,3]]
let [h,[g]] = arr
console.log(h,g)//1  1
```


### 不定元素（不定元素一定要放在最后）
```
let arr = [1,2,3,4,5]
let [a,...b] = arr
console.log(b)//[2,3,4,5]
```

### 不定元素可以解决数组克隆功能
```
let arr = [1,2,3]
let arr1 = arr.concat()//ES5做法
let [...arr2] = arr//不定元素
```


## 混合解构
```
let obj = {
    a: [1, 2, 3],
    b: 2
};
let {
    a: [c],
        b
} = obj
console.log(c,b)
```

## 解构参数

```
const defaultParams = {
    a: 1,b:2
}
function Fun({a,b}=defaultParams) {
    console.log(a)
    console.log(b)
}
Fun({a:3,b:4})
```
