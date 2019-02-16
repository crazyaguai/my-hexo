---
title: flexible布局以及1px边框解决方案
date: 2019-01-20 23:11:44
tags: [flexible,h5]
categories: flexible
---

### 视口概念

- https://crazyaguai.github.io/2019/01/20/%E8%A7%86%E5%8F%A3%E6%A6%82%E5%BF%B5/

### flexble布局

1. 把布局视口分为10份，设置html元素font-size大小。

```
var rem = docEl.clientWidth / 10
docEl.style.fontSize = rem + 'px'
```

2. 基本宽度 = UI设计稿宽度 / 10，元素尺寸使用rem单位，即元素尺寸 = 元素设计稿尺寸 / 基本宽度，这样实现按比例自适应尺寸。
3. 转换rem尺寸方式

- 使用postcss插件：[postcss-plugin-px2rem](https://github.com/pigcan/postcss-plugin-px2rem)

```
//.postcssrc.js文件配置
module.exports = {
    "plugins": {
        "postcss-import": {},
        "postcss-url": {},
        "postcss-plugin-px2rem": {
            rootValue: 37.5,
            propBlackList: ['border'],//border不转换
            exclude: [/((src)|(node_modules))/],//特定文件夹不转换
        },
        // 浏览器兼容部分在package.json中
        "autoprefixer": {}
    }
}
```

- 编写sass函数转换

```
@function px2em($px, $base-font-size: 37.5px) {
    @return ($px / $base-font-size) * 1rem;
}
```

### 1px边框解决方法

```
function fix1px() {
    var metas = document.querySelectorAll('meta')
    metas.forEach(item=>{
        if(item.name == 'viewport'){
            document.getElementsByTagName('head')[0].removeChild(item)
        }
    })

    //解决1px线问题
    var scale = 1/dpr
    var meta = document.createElement('meta')
    meta.setAttribute('name', 'viewport')
    meta.setAttribute('content', 'width=device-width,initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no')
    document.getElementsByTagName('head')[0].appendChild(meta)
}
```

- dpr=2时meta

```
<meta name="viewport" content="width=device-width initial-scale=0.5 maximum-scale=0.5 minimum-scale=0.5 user-scalable=no">
```

- 解读：首先设置width=device-width，布局视口=理想视口（此时1css像素=2物理像素），同时理想视口=视觉视口，因此布局视口=视觉视口，initial-scale=0.5，会使布局视口和视觉视口扩大为原来2倍，布局视口仍然=视觉视口，所以会在整个屏幕显示，同时1css像素=1物理像素，解决了边框问题。
- 开发时，如果使用postcss插件，配置不转换边框，需要转换的border属性（比如用border画三角形）可以自己转换成rem尺寸。

### 方案代码

```
(function flexible(window, document) {
    var docEl = document.documentElement
    var dpr = window.devicePixelRatio || 1
    // adjust body font size
    function setBodyFontSize() {
        if (document.body) {
            document.body.style.fontSize = (12 * dpr) + 'px'
        }
        else {
            document.addEventListener('DOMContentLoaded', setBodyFontSize)
        }
    }

    setBodyFontSize();

    // set 1rem = viewWidth / 10
    function setRemUnit() {
        fix1px()
        var rem = docEl.clientWidth / 10
        docEl.style.fontSize = rem + 'px'
    }

    setRemUnit()

    // reset rem unit on page resize
    window.addEventListener('resize', setRemUnit)
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            setRemUnit()
        }
    })

    // detect 0.5px supports
    if (dpr >= 2) {
        var fakeBody = document.createElement('body')
        var testElement = document.createElement('div')
        testElement.style.border = '.5px solid transparent'
        fakeBody.appendChild(testElement)
        docEl.appendChild(fakeBody)
        if (testElement.offsetHeight === 1) {
            docEl.classList.add('hairlines')
        }
        docEl.removeChild(fakeBody)
    }

    function fix1px() {
        var metas = document.querySelectorAll('meta')
        metas.forEach(item=>{
            if(item.name == 'viewport'){
                document.getElementsByTagName('head')[0].removeChild(item)
            }
        })

        //解决1px线问题
        var scale = 1/dpr
        var meta = document.createElement('meta')
        meta.setAttribute('name', 'viewport')
        meta.setAttribute('content', 'width=device-width,initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no')
        document.getElementsByTagName('head')[0].appendChild(meta)
    }
}(window, document))
```
