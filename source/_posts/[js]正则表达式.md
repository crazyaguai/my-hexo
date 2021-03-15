---
title: <js>正则表达式
date: 2019-03-20 00:00:00
tags: [js,正则表达式]
categories: js
---

### 模糊匹配

- 横向模糊匹配：长度不固定，比如{m,n}最少出现m次最多出现n次
- 纵向模糊匹配：某一位置字符多种可能，比如[\w]


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

### 字符类（字符组）

- 使用[]创建一个字符类

```
console.log('1b2'.replace(/[abc]/g,'3'))//132
```

- 使用^符号（脱字符）字符类取反，即排除字符组

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
- \d 数字字符--[0-9]，digit（数字）
- \D 非数字字符--[^0-9]
- \s 空白符--[\t\n\x0B\f\r]，space（空格）
- \S 非空白符--[^\t\n\x0B\f\r]
- \w 单词字符，字母、数字、下划线--[a-zA-Z_0-9]，word（单词）
- \W 非单词字符--[^a-zA-Z_0-9]
- . 通配符[^\n\t\u2028\u2029]，表示换行符、回车符、行分隔符、段分隔符之外的任意字符

- 如果想**匹配任意字符**可以使用：[\d\D],[\w\W],[\s\S],[^]中任意一个

### 位置匹配

- 位置（锚）是指相邻字符串之间的位置
- ES5中有6个锚：^,$,\b,\B,(?=p),(?!p)

#### 边界

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

#### 前瞻&后顾

- (?=p) 表示p前面的位置，该位置后边的字符匹配p，可以理解为存在一个位置，该位置后边的字符与p匹配，正向先行断言
- (?!p) 是(?=p)反面的意思，负向先行断言
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
- {m.n}?,{m,}?,+?,*?,??

```
console.log('aaa'.replace(/a+?/g,'A'))//AAA
```

### 分组

- 使用()可以实现分组

```
console.log('ababc'.replace(/(ab){2}/g,'A'))//Ac
```

#### 或（多选分支）

- |

- 分支结构是惰性的，前边的匹配之后，后边的就不在尝试了

```
console.log('abcadc'.replace(/a(b|d)c/g,'A'))//AA
```

#### 反向引用

- 分组后使用$1、$2...

```
console.log('2012-11-01'.replace(/(\d{4})-(\d{2})-(\d{2})/,'$3/$2/$1'))//01/11/2012
```

- 正则表达式中使用\1,\2,\3引用分组
- \10表示第十个分组，如果想匹配\1和0使用(?:\1)0,\1(?:0)
- 引用不存在的分组不会报错，会匹配反向引用字符串本身

```
console.log('aa'.replace(/([a])\1/,'b'))//b
```

#### 分组括号嵌套

```
var regex = /^((\d)(\d(\d)))\1\2\3\4$/;
var string = "1231231233";
console.log( regex.test(string) ); // true
console.log( RegExp.$1 ); // 123,第一个括号对应的
console.log( RegExp.$2 ); // 1，第二个括号对应的
console.log( RegExp.$3 ); // 23，。。。
console.log( RegExp.$4 ); // 3，。。。
```

#### 忽略分组（非捕获括号）

- 在分组内加上 ?: 即(?:)

```
console.log('2012-11-01'.replace(/(?:\d{4})-(\d{2})-(\d{2})/,'$3/$2/$1'))//$3/11/2012
```

#### 分组后边有量词

- 分组后边有量词，分组最终捕获最后一次的匹配

```
let r = /(\d){1,4}/
console.log('123456'.match(r))// ["1234", "4", index: 0, input: "123456", groups: undefined]
```

### 正则表达式回溯法

- 尝试匹配失败时，会退回之前的一步，本质是深度优先算法

#### 产生回溯

- 贪婪量词，{2,4}因为是贪婪的，所以先会尝试尽可能多的匹配
- 惰性量词，匹配少了，不够会回溯，'12345'.match(/^(\d{1,3}?)(\d{1,3})$/)，第一个分组会先尝试匹配一个，但是第二个就不能匹配，于是尝试两个、三个。。。
- 分支结构，'123'.match(/^(12|123)$/)

### 拆分正则

#### 优先级

- 转义符\  >  括号和方括号  >  量词  >  位置和序列（位置、一般字符）  >  管道符

#### 注意要点

- 匹配字符串整体/^(a|b)$/而不是/^a|b&/
- 量词连续：/[abc]{3}+/会报错，应该写成/([abc]{3})+/
- 元字符转义问题：^,$,.,*,+,?,|,\,/,(,),[,],{,},=,!,:,-

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
- 非全局匹配lastindex为0，全局匹配每次调用lastIndex会增加

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
- search会把字符串转换为正则匹配

```
console.log('aaa'.search('.'))//0，转换为正则匹配
console.log('abc'.search(/[abc]/g))//0
console.log('abc'.search(/[abc]/g))//0
```

#### match()

- String.prototype.match(reg) 检索字符串，以找到一个或者多个与正则匹配的文本 是否有标志g对结果影响很大
- match会把字符串转换为正则匹配
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
- 存在第二个参数，表示结果数组最大长度

```
console.log('1a2b3c4d'.split(/\d/g))//['',a,b,c,d]
```

- 正则使用分组时，结果包含分隔符

```
console.log('abc'.split(/(\w)/g))// ["", "a", "", "b", "", "c", ""]
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
//有分组情况
'abc'.replace(/(\w)(\w)/g,function (match,$1,$2,index,str) {
    return match
})
```
