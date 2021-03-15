---
title: <js>继承
date: 2029-03-03 00:00:00
tags: [js,js继承]
categories: js
---

#### 原型链继承

- 构造函数、原型、实例的关系：构造函数都有一个原型对象，原型对象又包含一个指向构造函数的指针，而实例则包含一个原型对象的指针
- 原型链继承问题：实例使用同一个原型对象，更改原型对象上的属性会影响所有实例

```javascript
function Father(){
  this.arr = [1,2,3]
}
function Child(lastName = ''){
}

Child.prototype = new Father()
Child.prototype.constructor = Child

const child1 = new Child()
const child2 = new Child()

child1.arr.push(4)
console.log(child2.arr) // [1, 2, 3, 4]
```

#### 构造函数继承(call)

- 存在问题：子类无法继承父类原型中存在的方法

```javascript
function Father() {
  this.arr = [1, 2, 3];
}
Father.prototype.say = function () {
  console.log(this.arr);
};
function Child(name) {
  Father.call(this);
  this.name = name;
}
const child = new Child();
console.log(child.arr); // [1, 2, 3]
child.say(); // 会报错，没有继承该属性
```

#### 组合继承

- 原型继承 + 构造函数继承
- 存在问题：父构造函数会执行两次

```javascript
function Father() {
  this.arr = [1, 2, 3];
}
Father.prototype.say = function () {
  console.log(this.arr);
};
function Child(name) {
  Father.call(this); // 执行一次
  this.name = name;
}
Child.prototype = new Father() // 执行一次
Child.prototype.constructor = Child

const child = new Child();
console.log(child.arr); // [1, 2, 3]
child.say();
```

#### 原型式继承Object.create

- Object.create，两个参数：新对象的原型对象、对象的属性类型参照Object.defineProperties()的第二个参数（可选）
- 存在问题：使用浅拷贝方式复制属性，引用类型属性共用

```javascript
const parent = {
  arr: [1,2,3]
}
const parent1 = Object.create(parent)
parent1.name = '1'
parent1.arr.push(4)

console.log(parent.arr) // [1, 2, 3, 4]
console.log(parent.name) // undefined
console.log(parent1.arr) // [1, 2, 3, 4]
```

#### 寄生式继承

- 可以在父类基础上添加方法
- 存在问题：父类引用类型共用

```javascript
const parent = {
  arr: [1, 2, 3],
};
function clone() {
  const obj = Object.create(parent);
  // 在父类基础上添加方法
  obj.say = function () {
    console.log(this.arr);
  };
  return obj;
}
const parent1 = clone(parent);
```

#### 组合寄生式继承

- 通过寄生方式较少父类构造函数调用，通过组合方式避免父类引用类型互相影响
- es6 extends关键字使用类似方式实现

```javascript
// 通过寄生方式较少父类构造函数调用
function clone(parent, child) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}
function Father() {
  this.arr = [1, 2, 3];
}
Father.prototype.say = function () {
  console.log(this.arr);
};
function Child(name) {
  Father.call(this); // 父构造函数只执行一遍
  this.name = name;
}
clone(Father, Child);

const child1 = new Child("张三");
const child2 = new Child("李四");

child1.arr.push(4);
child2.say(); // [1, 2, 3] 不会改变
```





