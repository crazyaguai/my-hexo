---
title: ES6-Set&Map
date: 2018-08-22 08:29:44
tags: [ES6,js]
categories: ES6
---
### 简介

- 如果开发者想使用非数值型索引，就会使用数组对象创建数据结构，这是Set&Map早期实现

#### 对象属性的限制

1. map[5]与map['5']是同一个
2. let k1 = {},k2 = {};map[k1]与map[k2]是同一个，因为对象会被转换为默认的字符换表达式
3. map['count'] = 1,检查map.count是否存在很困难
4. in运算符会检索对象原型，只有当原型为null时这个方法才比较稳妥

### Set集合

1. 不会对所存储的值进行强制的类型转换，数字5和字符串'5'可作为两个元素存在（内部使用Object.is()检测），但是-0和+0被认为相等
2. 如果多次调用add()传入相同的参数，后续的调用会被忽略
3. 通过has()方法检测是否含有某个值
4. 使用delete()移除元素
5. 使用clear()清空Set集合

```
let set = new Set([1,1,1,2,2,3])//使用含重复元素的数组初始化Set集合
console.log(set.size)//3
set.add(5)
set.add('5')
set.add(5)//被忽略
console.log(set.has(5))//true
console.log(set.has(6))//false

set.delete(5)
console.log(set.has(5))//false
set.clear()
console.log(set.size)//0
```

#### set的forEach方法

- set的forEach方法（回调参数：1、下一次索引位置，2、与第一次相同的值（为了和数组forEach参数统一），3、Set集合本身）

```
let set2 = new Set([1,2,3])
set2.forEach(function (val,k,set) {
    console.log(val)
    console.log(k)
    console.log(set===set2)//true
},this)//如果不是箭头函数，可以从这里传入this
```

- 不能通过访问数组元素那样直接通过索引访问Set集合元素，需要转换成数组

```
let set3 = new Set([1,1,1,2,2,3,3])
let arr = [...set]//复制数组并且创建一个无重复元素的新数组
```

#### Weak Set

- 只存储对象的弱引用，并且不可以存储原始值，如果集合中弱引用是对象的唯一引用，则回收释放相应内存
- 两种Set的主要区别：
- 1、WeakSet实例中，如果传入非对象参数会报错
- 2、WeakSet对象不可迭代，不能用for-of循环
- 3、WeakSet不暴露任何迭代器（keys()\values()）不能通过程序检测其中内容
- 4、WeakSet不支持forEach方法
- 5、WeakSize不支持size属性

```
let wset4 = new WeakSet()
let k = {}
wset4.add(k)
console.log(wset4.has(k))//true
wset4.delete(k)
console.log(wset4.has(k))//false
```

### Map集合

- Map类型是一种存储许多键值对的有序列表
- 其中键名和对应的值支持所有类型，键名的等价性判断是通过Object.is()判断的
- 添加set(),获取get()

```
let map = new Map()
map.set('aaa','123')
console.log(map.get('aaa'))//123
console.log(map.get(111))//undefined（不存在）

//map总可以使用对象作为键名,对象键名不会强制转换为其他类型，所以这两个键名独立存在
let key1 = {},key2 = {}
map.set(key1,5)
map.set(key2,6)
console.log(map.get(key1))//5
console.log(map.get(key2))//6
```

- has()判断键名是否存在
- delete()删除
- clear()清空
- Map集合中的size属性和Set中的类似，为集合中键值对的数量

#### Map的初始化方法

```
let map1 = new Map([['name',1],['age',2]])
console.log(map1.has('name'))
```

#### Map集合的forEach

- Map集合的forEach方法，三个参数，1、下一次索引位置2、值对应的键名3、Map集合本身 (可以指定forEach的第二个参数作为回调的this)

```
map1.forEach((value,key,ownerMap)=>{
    console.log(value)
    console.log(key)
    console.log(ownerMap === map1)
})
```

#### Weak Map
- 最大用途是保存Web页面中的DOM元素
- ES6中Weak Map是一种存储许多键值对的无序列表，列表的键名必须是非null类型的对象
- has()\delete()
- 不支持键名枚举、不支持clear()方法

```
let wmap = new WeakMap()

let element = document.getElementById('aaa')
wmap.set(element,'123')//element不能为null
console.log(wmap.get(element))
```

#### 私有对象数据

- 尽管Weak Map大多被用来存储DOM元素，但也有其他用处,ES5一般使用_C下划线属性作为私有属性，但是没有任何标准规定如何使用，也会被更改

```
//ES5处理私有变量,缺点无法获知对象何时被摧毁，obj中的数据永远不会消失
var Person = (function () {
    var obj = {}
    var idNum = 0
    function Person(name) {
        Object.defineProperty(this,'_id',{value: idNum++})
        obj[this._id] = {
            name: name
        }
    }
    Person.prototype.getName = function () {
        return obj[this._id].name
    }
    return Person
})()
console.log(new Person(111).getName())
```
```
//使用WeakMap解决此问题,只要对象被摧毁，相关信息也会摧毁
let WPerson = (function () {
    let wmap = new WeakMap()
    function Person(name) {
        wmap.set(this,{name: name})
    }
    Person.prototype.getName = function () {
        return wmap.get(this).name
    }
    return Person
})()
console.log(new WPerson(222).getName())
```

- 如果只使用对象作为键名，那么WeakMap是最好的选择，可以有效避免内存泄漏问题
