---
title: <ES6>扩展对象属性
date: 2018-08-21 00:00:00
tags: [ES6,js]
categories: ES6
---

### 简介

- ES6通过多种方式加强对象的使用，通过简单的语法扩展，提供更多操作对象以及对象交互方法。

### 初始值的简写

```
let a = 1;
let obj = {
    a
}
```

### 对象方法的简写

- 注意简写方法可以使用super关键字

```
let obj = {
    a(){
    }
}
```

### 可计算属性名

```
let firstName = 'first name'
let name = 'name'
let person = {
    [firstName]: 'yang',
    ['last'+name]: 'xiao'
}
console.log(person[firstName])//yang
console.log(person['first name'])//yang
console.log(person['last'+name])//xiao
```

### 新增对象方法

#### Object.is()

- 以下几项比较特殊，其他比较与===相同

```
console.log(Object.is(+0,-0))//false
console.log(Object.is(NaN,NaN))//true
console.log(Object.is(0,''))//false
```

#### Object.assign()

- 混合（Mixin）模式，接受一个接收对象和任意数量的源对象

1. 对于对象属性是浅复制
2. 不能将访问器属性复制到接收对象，只是调用get

```
let obj = {}
Object.assign(obj,{a:1},{a:2},{b:[1,2,3]},{get c(){
        return 'c'
    }})
console.log(obj)//{a:2,b:[1,2,3],c:'c'}
```

### 自有属性的枚举顺序

1. 所有数字按照升序排序
2. 所有字母按照被加入对象的顺序排序
3. symbol类型按照被加入顺序排序
4. for-in循环不适用，因为浏览器厂商不一样

### 增强对象原型

- 对原型进行了改进

#### Object.setPrototypeOf()

- 改变对象的原型，改变对象内部专属[[Prototype]]，接收两个参数，**被改变原型的对象**，以及**替代原型的对象**

#### 简化原型访问的super

1. super相当于指针，指向Object.getPrototypeOf(this)的值
2. 必须在简写方法时使用super

```
let person = {
    Fun(){
        return 'hello'
    }
}
let dog = {
    Fun(){
        return 'wangwangwang'
    }
}
let friend = {

    //必须在简写时使用super
    Fun(){
        //ES6写法
        return super.Fun() + ' world'

        //ES5写法
        // return Object.getPrototypeOf(this).Fun.call(this) + ' world'
    }
}

Object.setPrototypeOf(friend,person)
console.log(friend.Fun())//hello world
Object.setPrototypeOf(friend,dog)
console.log(friend.Fun())//wangwangwang world
```

#### 正式的方法定义

```
let obj = {
    //是方法
    a(){
    }
}
//不是方法，是函数
function a(){}
```

- 正式的方法定义内部存在[[HomeObject]]属性

```
let obj = {
    //是方法有[[HomeObject]]属性指向obj
    //super的使用就是通过[[HomeObject]]来确定后续执行，因此必须为简写方法
    Fun(){
    },
    //不是方法没有[[HomeObject]]属性
    Fun1:function () {
    }
}
```
