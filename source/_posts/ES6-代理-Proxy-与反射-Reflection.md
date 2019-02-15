---
title: ES6-代理(Proxy)与反射(Reflection)
date: 2019-02-15 08:50:44
tags: [ES6,js]
categories: ES6
---

### 简介
- 代理Proxy是一种可以拦截并修改底层javascript引擎操作的包装器，在新语言中通过它暴露内部运作的对象。
- 数组问题：ES6之前不能通过自己定义的对象模仿js数组对象的行为方式（赋值影响length属性）。
### 代理和反射
- 调用 new Proxy() 可以创建代替其他目标(target)对象的代理，虚化了目标，所以二者看起来功能一致。
- 陷阱：每个陷阱复写js对象的一些内建特性
- 创建一个简单的代理：示例中代理的所有操作都会转发给目标。
```
let target = {}
let proxy = new Proxy(target,{})
proxy.name = '123'
console.log(target.name)//123

target.age = 11
console.log(proxy.age)//11
```
#### 使用set陷阱验证属性
- 参数：trapTarget(代理目标)，key(写入属性字符串或者symbol)，value(写入值)，receiver(代理)
- Reflect.set()是set陷阱对应的反射方法和默认特性，如果属性已经设置陷阱应该返回true，如果未设置返回false。即基于是否成功返回适当的值。
```
let obj = {
}
let proxyObj = new Proxy(obj,{
    set(trapTarget,key,val,receiver){
        return Reflect.set(trapTarget,key,val+1,receiver)
    }
})
proxyObj.count = 1
console.log(obj.count)//2
obj.age = 2
console.log(proxyObj.age)//2
```
#### 使用get陷阱验证对象结构
```
let obj = {
    name: '123'
}
let proxyObj = new Proxy(obj,{
    get(trapTarget,key,receiver){
        if(!(key in trapTarget)){
            throw new TypeError(`属性${key}不存在`)
        }
        return Reflect.get(trapTarget,key,receiver)
    }
})
console.log(proxyObj.name)//123
console.log(proxyObj.age)//Uncaught TypeError: 属性age不存在
```
#### 使用has陷阱隐藏已有属性
- 用in操作符检测属性存在时，可以使用has陷阱拦截in操作符的属性返回不同的值。
```
let obj = {
    name: '123',
    age: '11'
}
let proxyObj = new Proxy(obj,{
    has(trapTarget,key){
        if(key === 'name'){
            return false
        }
        return Reflect.has(trapTarget,key)
    }
})
console.log('name' in proxyObj)//false
console.log('age' in proxyObj)//true
```
#### 使用deleteProperty陷阱防止删除属性
- 在严格模式下删除一个不可配置(nonconfigurable)的属性会报错，非严格模式下只会返回false
```
let obj = {
    name: '123',
    age: '11'
}
let proxyObj = new Proxy(obj,{
    deleteProperty(trapTarget,key){
        if(key === 'name'){
            return false
        }
        return Reflect.deleteProperty(trapTarget,key)
    }
})
console.log(delete proxyObj.name)//false
console.log(delete proxyObj.age)//true
```
#### 原型代理陷阱
- 通过代理setPrototypeOf和getPrototypeOf陷阱可以拦截Object.setPrototypeOf()和Object.getPrototypeOf()方法
