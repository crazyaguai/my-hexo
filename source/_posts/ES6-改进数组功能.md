---
title: ES6-改进数组功能
date: 2018-11-10 10:30:30
tags: [ES6,js,Array]
categories: ES6
---

## 常用数组方法
#### 检测数组

```
let arr1 = [1,2,3]
console.log(Array.isArray(arr1))//true
```

#### 转换方法

```
console.log(arr1.valueOf())//[1,2,3]
console.log(arr1.toString())//1,2,3
console.log(arr1.toLocaleString())//1,2,3（每一项调用的是toLocalString()方法）
console.log(arr1.join('#'))//1#2#3
```

#### 栈方法

```
let arr2 = [1,2,3]
arr2.push(4)
console.log(arr2)//[1,2,3,4]
arr2.pop(4)
console.log(arr2)//[1,2,3]
```

#### 对列方法

```
let arr3 = [1,2,3]
arr3.unshift(0)//[0,1,2,3,4]
console.log(arr3)
arr3.shift()
console.log(arr3)
```

#### 排序方法

```
let arr4 = [3,2,1]
arr4.reverse()//反转数组顺序
console.log(arr4)
arr4.sort((a,b)=>{
    return a - b
})//由小到大
console.log(arr4)
arr4.sort((a,b)=>{
    return b - a
})//由大到小
console.log(arr4)

let arr5 = [1,2,'10']
console.log(arr5.sort())//[1,'10',2]sort默认先toString()再排序
```


#### 操作方法

```
let a1 = [1]
let a2 = [2]
let a3 = a1.concat(a2)
console.log(a1)//[1]
console.log(a2)//[2]
console.log(a3)//[1,2]

let aa1 = [1,2,3,4,5]
let aa2 = aa1.slice(1,4)//slice()左闭右开
let aa3 = aa1.slice(1)
console.log(aa1)//[1,2,3,4,5]
console.log(aa2)//[2,3,4]
console.log(aa3)//[2,3,4,5]
```

#### 删除、插入、替换
删除splice(1,2)\插入splice(2,0,'a','b')\替换splice(1,2,3,4)

```
let sa1 = [1,2,3,4,5]
let sa2 = sa1.splice(1,2,'a','b')//从1位置开始，删除两项，并添加'a'\'b'两项
console.log(sa1)
console.log(sa2)//返回删除的数组
```

#### 位置方法

```
let la = [1,2,3,2,1]
console.log(la.indexOf(2))//1
console.log(la.lastIndexOf(2))//3
```


#### 迭代方法
- every()对数组中每一项进行运行给定函数，如果都返回true，则返回true
- filter()对数组中每一项进行运行给定函数，如果都返回true，则返回true项组成的数组
- forEach()对数组中每一项执行给定函数，没有返回值
- map()对数组中每一项执行给定函数，返回每次函数调用结果返回的数组

```
let ma = [1,2,3]
let ma1 = ma.map((item,index,arr)=>{
    return 2
})
console.log(ma)//[1,2,3]
console.log(ma1)//[2,2,2]
```

#### some()

#### 归并方法reduce(),reduceRight()

```
let ra = [1,2,3]
let res = ra.reduce((pre,cur,index,arr)=>{
    return pre+cur
})
console.log(ra)
console.log(res)
```


## ES6方法
-  ES6标准继续改进数组，添加了许多新功能，比如创建数组新方法、几个实用的方法、创建定型数组
#### Array.of()
- Array构造函数传入参数问题

```
let arr = new Array(2)
console.log(arr)//[undefined,undefined]
arr = new Array('2')
console.log(arr)//['2']
arr = new Array(1,2)
console.log(arr)//[1,2]
arr = new Array(2,'2')
console.log(arr)//[2,'2']
```

- Array.of()方法总会创建一个包含所有参数的数组

```
let arr1 = Array.of(1,2,3)
console.log(arr1)//[1,2,3]
```

- 注意：Array.of()不使用Sympol.species属性返回确定的类型，而是使用of()方法中this()的值来返回数据类型

#### Array.from()
- js不支持直接将非数组对象转换为真实数组，如arguments，如果把它当做数组使用必须先转换该对象的类型
- es5中的转换方法

```
function makeArray(arrayLike) {
    var res = []
    for(var i = 0;i<arrayLike.length;i++){
        res.push(arrayLike[i])
    }
    //或者
    // res = Array.prototype.slice().call(arrayLike)
    return res
}
(function f(a,b,c) {
    var arr = makeArray(arguments)
    console.log(arr)//[1,2,3]
})(1,2,3)
```

- Array.from()用来将对象转化为数组，可以接受可迭代对象或类数组对象作为第一个参数，第二个参数可以提供一个映射关系，将每一个值转换为其他形式，第三个参数用来表示映射函数this的值

```
function f1(a,b,c) {
    let arr = Array.from(arguments,function (item) {
        return item+this.a
    },{a:1})
    console.log(arr)//[3,4,5]
}
f1(2,3,4)
```

- 转换可迭代对象，如果一个对象即是类数组又是可迭代对象，那么会根据迭代器来决定转换哪个值

```
let nums = {
    *[Symbol.iterator](){
        yield 1;
        yield 2;
        yield 3;
    }
}
let i_arr = Array.from(nums)
console.log(i_arr)//[1,2,3]
```

#### find()\findIndex()
- find()返回找到的值、findIndex()返回找到值的位置，接收两个参数，一个是回调函数、一个是可选参数

```
let n = [1,2,3,4,5]
console.log(n.find(item=>item>2))//3
console.log(n.findIndex(item=>item>2))//2
```

- 如果在数组中查找根据某个条件匹配的元素，使用find()，如果只是匹配某个元素值使用indexOf()

#### fill()
- fill()可以用指定的值填充一致多个数组元素

```
let f_arr = [1,2,3,4]
f_arr.fill(1)
console.log(f_arr)//[1,1,1,1]
f_arr.fill(0,1,3)
console.log(f_arr)//[1,0,0,1]左闭右开
```

#### copyWithin()
- copyWithin()从数组中复制元素的值

```
let c_arr = [1,2,3,4,5]
c_arr.copyWithin(2,0)
```

- console.log(c_arr)//[1,2,1,2,3]从索引2开始粘贴值，从索引0开始复制并持续到没有更多可复制的值


#### 定型数组
- 用于处理数值类型数据专用的数组
- [定型数组](http://www.shaoqun.com/a/318331.html)

#### Array.prototype.includes()
- ES7语法
```
let val = [1,2,3]
console.log(val.includes(1))//true
```
