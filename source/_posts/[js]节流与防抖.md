---
title: <js>节流与防抖
date: 2018-11-15 00:00:00
tags: [js,节流与防抖]
categories: js
---

### 节流(throttle)

- 在某段时间内，不管你触发了多少次回调，我都只认第一次，并在计时结束时给予响应。

1. 简单的一定时间内只执行一次

```
function throttle(fn, interval = 2000) {
    let lastTime = 0
    return function () {
        let context = this
        let args = arguments
        let nowTime = +new Date()

        if (nowTime - lastTime > interval) {
            fn.apply(context, args)
            lastTime = nowTime
        }
    }
}
```

2. 添加leading参数，配置true在周期开始执行，false在周期结束执行

```
function throttle(fn, interval = 2000, leading = true) {
    let lastTime = 0
    return function () {
        let context = this
        let args = arguments
        let nowTime = +new Date()

        if (nowTime - lastTime > interval) {
            if (leading) {
                fn.apply(context, args)
            } else {
                setTimeout(() => {
                    fn.apply(context, args)
                }, interval)
            }
            lastTime = nowTime
        }
    }
}
```

### 防抖

- 在某段时间内，如果有新的出发那么更新时间，不管你触发了多少次回调，我都只认最后一次。

1. 简单的

```
//2秒内只要有事件，就重新计时
function debounce(fn, delay = 2000) {
    let timer = null
    return function () {
        let context = this
        let args = arguments

        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(context, args)
        }, delay)
    }
}
```

2. 添加leading参数，配置true在周期开始执行，false在周期结束执行

```
function debounce(fn, delay = 2000, leading = true) {
    let timer = null
    let leadOpen = null
    return function () {
        let context = this
        let args = arguments

        if (leading) {
            if (!leadOpen) {
                leadOpen = true
                fn.apply(context, args)
            } else {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                leadOpen = false
            }, delay)
        } else {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                fn.apply(context, args)
            }, delay)
        }
    }
}
```

3. 添加 maxWait 参数，maxWait 时间一定执行一次

```
function debounceWithMaxWait(fn, delay = 2000, maxWait = 3000, leading = true) {
    let timer = null
    let lastTime = null
    let leadOpen = null
    return function () {
        let context = this
        let args = arguments

        if (!lastTime) {
            lastTime = +new Date()
        }

        let newTime = +new Date()

        if(leading){
            if (newTime - lastTime < maxWait) {
                if (!leadOpen) {
                    leadOpen = true
                    fn.apply(context, args)
                } else {
                    clearTimeout(timer)
                }
                timer = setTimeout(() => {
                    lastTime = null
                    leadOpen = false
                }, delay)
            } else {
                lastTime = null
                leadOpen = false
                clearTimeout(timer)
            }
        }else {
            if (newTime - lastTime < maxWait) {
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(() => {
                    lastTime = null
                    fn.apply(context, args)
                }, delay)
            } else {
                lastTime = null
                if (timer) {
                    clearTimeout(timer)
                }
                fn.apply(context, args)
            }
        }
    }
}
```

### lodash的使用

1. throttle

```
document.querySelector('#lodash_throttle').addEventListener('click', _.throttle(() => {
    console.log('lodash throttle')
}, 2000, {
    leading: false,
    // trailing: true
}))
```

2. debounce

```
document.querySelector('#lodash_debounce').addEventListener('click', _.debounce(() => {
    console.log('lodash debounce')
}, 2000, {
    maxWait: 3000,
    leading: false,
    // trailing: true
}))
```
