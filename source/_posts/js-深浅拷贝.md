---
title: js-深浅拷贝
date: 2019-01-06 10:53:30
tags: [js,深拷贝]
categories: js
---
##### 概念
- https://mp.weixin.qq.com/s/scz9gRJeh7PM6GJ7wvnTsA
##### 方法1：不考虑循环情况
```
function clone(value) {
    if (Array.isArray(value)) {
        return value.map(clone)
    } else if (value && typeof value === 'object') {
        const res = {}
        for (const key in value) {
            res[key] = clone(value[key])
        }
        return res
    } else {
        return value
    }
}
```
##### 方法1：考虑循环嵌套情况
```
function deepCopy(obj, cache = []) {
    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    // if obj is hit, it is in circular structure
    const hit = cache.filter(c => c.original === obj)[0]
    if (hit) {
        return hit.copy
    }

    const copy = Array.isArray(obj) ? [] : {}
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
        original: obj,
        copy
    })

    Object.keys(obj).forEach(key => {
        copy[key] = deepCopy(obj[key], cache)
    })

    return copy
}
```
