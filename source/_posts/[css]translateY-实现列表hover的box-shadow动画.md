---
title: <css>translateY-实现列表hover的box-shadow动画
date: 2018-10-02 00:00:00
tags: [css,css动画]
categories: css
---
### demo
[demo](https://codepen.io/crazyaguai/pen/gQvBdY)

### 代码

```
<style>
    .container{
        transition: box-shadow .28s cubic-bezier(.4,0,.2,1);
        box-shadow: 0 1px 4px 0 rgba(10,16,20,.37);
    }
    .item{
        color: #1a2326;
        border: 1px solid transparent;
        margin: 0;
        padding: 16px 23px;
        position: relative;
        text-decoration: none;
        transition: .3s;
        height: 60px;
    }
    .item:hover{
        cursor: pointer;
        border-color: #2b85e7;
        border-radius: 4px;
        box-shadow: 0 8px 8px rgba(1,67,163,.24), 0 0 8px rgba(1,67,163,.12), 0 6px 18px rgba(43,133,231,.12);
        transform: translateY(-2px);
    }
</style>
<body>
<div class="container">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
</div>
</body>
```


