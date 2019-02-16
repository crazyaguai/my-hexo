---
title: js正则表达式
date: 2018-11-21 22:24:41
tags: [js,正则表达式]
categories: js
---

### 修饰符

- g全局匹配
- i不区分大小写，默认大小写敏感
- m匹配多行

```
let str =
`aA
A
`.replace(/a/igm,'B')
console.log(str)
// `BB
// b`
```

### 元字符
- \t 水平制表符tab
- \v 垂直制表符
- \n 换行符
- \r 回车符
- \0 空字符
- \f 换页符
- \cX ctrl+X

### 字符类

- 使用[]创建一个字符类

```
console.log('1b2'.replace(/[abc]/g,'3'))//132
```

- 使用^符号字符类取反

```
console.log('1b2'.replace(/[^abc]/g,'3'))//3b3
```

### 范围类

- [a-zA-Z0-9]
- 范围类中想包含-符号[a-z-]

```
console.log('a-'.replace(/[a-z-]/g,'1'))//11
```

### 预定义的范围类

- . 除了回车和换行符之外的所有字符--[^\n\r]
- \d 数字字符--[0-9]
- \D 非数字字符--[^0-9]
- \s 空白符--[\t\n\x0B\f\r]
- \S 非空白符--[^\t\n\x0B\f\r]
- \w 单词字符，字母、数字、下划线--[a-zA-Z_0-9]
- \W 非单词字符--[^a-zA-Z_0-9]

### 边界

- ^ 以XXX开始

```
console.log('abc'.replace(/^[abc]/,'A'))//Abc
```

- $ 以XXX结束

```
console.log('abc'.replace(/[abc]$/,'A'))//abA
```

- \b 单词边界

```
console.log('Are you youOK'.replace(/you\b/,'YOU'))//Are YOU youOK
```

- \B 非单词边界

```
console.log('Are you youOK'.replace(/you\B/,'YOU'))//Are you YOUOK
```

### 量词

- ? 出现0次或者一次（最多一次）
- \+ 出现一次或者多次（最少出现一次）
- \* 0次或者多次（任意次）
- {n} 出现n次
- {n,m} n-m次
- {n,} 最少出现n次

```
console.log('aabbcc'.replace(/[abc]{2}/g,'A'))//AAA
```

### 贪婪模式与非贪婪模式

- 贪婪模式，js正则默认贪婪模式

```
console.log('aaa'.replace(/a+/g,'A'))//A
```

- 非贪婪模式，尽可能少的匹配，一旦匹配成功就不再进行尝试
- 非贪婪模式需要在量词后边加 ?

```
console.log('aaa'.replace(/a+?/g,'A'))//AAA
```

### 分组

- 使用()可以实现分组

```
console.log('ababc'.replace(/(ab){2}/g,'A'))//Ac
```

### 忽略分组

- 在分组内加上 ?:

```
console.log('2012-11-01'.replace(/(?:\d{4})-(\d{2})-(\d{2})/,'$3/$2/$1'))//$3/11/2012
```

### 或

- |

```
console.log('abcadc'.replace(/a(b|d)c/g,'A'))//AA
```

### 反向引用

- 分组后使用$1、$2...

```
console.log('2012-11-01'.replace(/(\d{4})-(\d{2})-(\d{2})/,'$3/$2/$1'))//01/11/2012
```

### 前瞻&后顾

- 正则表达式从文本头部向尾部解析，文本尾部称为'前'，前瞻就是匹配规则时候向前（尾部方向）检查是否断言
- js正则不支持后顾
- exp(?=asset) 正向前瞻（符合断言）

```
console.log('a2aa'.replace(/\w(?=\d)/g,'X'))//X2aa
```

- exp(?!asset) 负向前瞻（不符合断言）

```
console.log('a2aa'.replace(/\w(?!\d)/g,'X'))//aXXX
```

### 对象属性

- global\ignoreCase\multiline\lastIndex\source

```
let reg1 = /\w/igm
console.log(reg1.global)//true
console.log(reg1.ignoreCase)//true
console.log(reg1.multiline)//true
console.log(reg1.lastIndex)//0 当前匹配结果最后一个字符的下一个字符
console.log(reg1.source)//\w
```

### 正则表达式方法

#### test()

- RegExp.prototype.test(str) 检测字符串参数中是否存在匹配正则表达式模式的字符串
- 存在返回true不存在返回false
- 注意如果包含全局匹配g那么结果会受到lastIndex影响

```
let reg2 = /\w/g
console.log(reg2.test('ab'))//true
console.log(reg2.lastIndex)//1
console.log(reg2.test('ab'))//true
console.log(reg2.lastIndex)//2
console.log(reg2.test('ab'))//false
console.log(reg2.lastIndex)//0
```

#### exec()

- RegExp.prototype.exec(str)
- 使用正则表达式对字符串执行搜索，并将更新全局RegExp对象的属性以反映匹配结果
- 如果没有匹配文本返回null，否则返回一个结果的数组
- 返回的数组有两个属性index声明第一个匹配字符的位置、input存放被检索的字符串string
- 非全局调用返回的数组：第一项是与正则表达式匹配的文本、第二项（以及以后项）是与分组匹配的文本

```
let reg3 = /\d(\w)(\w)\d/
let res1 = reg3.exec('1aa21aa2')//第一次
console.log(res1.index + '\t' + reg3.lastIndex + '\t' + res1.toString())//0	0	1aa2,a,a
let res2 = reg3.exec('1aa21aa2')//第二次，lastIndex没有变化
console.log(res2.index + '\t' + reg3.lastIndex + '\t' + res2.toString())//0	0	1aa2,a,a
```

- 全局搜索

```
let reg4 = /\d(\w)(\w)\d/g
let r1 = reg4.exec('1aa23bb4')//第一次
console.log(r1.index + '\t' + reg4.lastIndex + '\t' + r1.toString())//0	0	1aa2,a,a
let r2 = reg4.exec('1aa23bb4')//第二次
console.log(r2.index + '\t' + reg4.lastIndex + '\t' + r2.toString())//4	0	3bb4,b,b
let r3 = reg4.exec('1aa23bb4')//第三次
console.log(reg4.lastIndex,r3)//0 null
```

### 字符串对象的方法

#### search()

- String.prototype.search(reg)，返回第一个匹配结果的index，查找不到返回-1，忽略g标志，总是从开始匹配。

```
console.log('abc'.search(/[abc]/g))//0
console.log('abc'.search(/[abc]/g))//0
```

#### match()

- String.prototype.match(reg) 检索字符串，以找到一个或者多个与正则匹配的文本 是否有标志g对结果影响很大
- 非全局调用，返回数组第一个元素存放匹配的文本，其余元素是与正则的子表达式匹配的文本，还有两个对象属性index、input

```
let str1 = '1aa21aa2'
let reg5 = /\d(\w)(\w)\d/
let re1 = str1.match(reg5)//第一次
console.log(re1.index + '\t' + reg5.lastIndex + '\t' + re1.toString())//0	0	1aa2,a,a
let re2 = str1.match(reg5)//第二次
console.log(re2.index + '\t' + reg5.lastIndex + '\t' + re2.toString())//0	0	1aa2,a,a
```

- 全局调用，返回数组中包含所有匹配的字符串，没有找到返回null，没有index、input属性

```
let str2 = '1aa21aa2'
let reg6 = /\d(\w)(\w)\d/g
let re3 = str1.match(reg6)
console.log(re3.index + '\t' + reg6.lastIndex + '\t' + re3.toString())//undefined	0	1aa2,1aa2
```

#### split()

- String.prototype.split(reg)

```
console.log('1a2b3c4d'.split(/\d/g))//['',a,b,c,d]
```

#### replace()

- String.prototype.replace(reg)

```
console.log('aabc'.replace('a','1'))//1abc 转换为/a/正则
console.log('aabc'.replace(/a/g,'1'))//11bc
```

- 传第二个函数参数function有四个参数：匹配字符串、正则表达式分组内容(没有分组就没这个参数)、匹配项的index、原字符串

```
console.log('a1b2c3d4'.replace(/\d/g,function (match,index,str) {
    return parseInt(match) + 1
}))//a2b3c4d5
console.log('a1b2c3d4'.replace(/(\d)/g,function (match,group,index,str) {
    console.log(group)
    return parseInt(match) + 1
}))//a2b3c4d5
```
