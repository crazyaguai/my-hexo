---
title: decimal处理数字问题
date: 2019-01-31 20:39:49
tags: [大数,js,小数]
categories: decimal
---
#### 简介
数字货币交易所项目，需要处理大量小数、大数展示问题，使用decimal库处理js中的数字运算，包括大数展示为字符串、小数向上取整、小数向下取整、小数四舍五入、小数补零、加减乘除、取余运算。也可改为vue filter使用。
#### 安装依赖
```
npm install --save decimal.js-light
```
#### 基本配置
```
Decimal.set({
    precision: 1e+9,//（计算结果）小数精度位数
    rounding: Decimal.ROUND_HALF_UP,//小数舍去配置
    minE: -9e15,//负指数极限（比较转换成指数后指数部分值<这个值转换为0）
    maxE: 9e15,//正指数极限（比较转换成指数后指数部分值>这个值转换为Infinity）
    toExpNeg: -9e15,//toString()负指数表示配置（比较转换成指数后指数部分值<=这个值用指数表示）
    toExpPos: 9e15,//toString()正指数表示配置（比较转换成指数后指数部分值>=这个值用指数表示）
});
```
#### 代码
```
import Decimal from 'decimal.js-light'

Decimal.set({
    precision: 20,
    rounding: Decimal.ROUND_HALF_UP,//默认使用四舍五入
    toExpNeg: -9e15,
    toExpPos: 9e15,
});

export default {
    //数字转换为字符串显示
    format(num){
        num = num ? num : 0
        return new Decimal(num).toString()
    },
    //保留小数向上取整
    formatUp(num,len){
        return new Decimal(num).toDecimalPlaces(len,Decimal.ROUND_UP).toString()
    },
    //保留小数向下取整
    formatDown(num,len){
        return new Decimal(num).toDecimalPlaces(len,Decimal.ROUND_DOWN).toString()
    },
    //保留小数四舍五入
    formatHalf(num,len){
        return new Decimal(num).toDecimalPlaces(len,Decimal.ROUND_HALF_UP).toString()
    },
    //小数舍去0
    remove0(num){
        num = num ? num : 0
        return new Decimal(num).toString()
    },
    //小数补零
    add0(num,len){
        return new Decimal(num).toFixed(len,Decimal.ROUND_DOWN).toString()
    },
    //加
    add(num1, num2, len) {
        let a = new Decimal(num1)
        let b = new Decimal(num2)
        let c = a.plus(b)
        if(len > 0){
            return c.toDecimalPlaces(len).toString()
        }else{
            return c.toString()
        }
    },
    //减
    minus(num1, num2, len) {
        let a = new Decimal(num1)
        let b = new Decimal(num2)
        let c = a.minus(b)
        if(len > 0){
            return c.toDecimalPlaces(len).toString()
        }else{
            return c.toString()
        }
    },
    //乘
    mult(num1, num2, len) {
        let a = new Decimal(num1)
        let b = new Decimal(num2)
        let c = a.times(b)
        if(len > 0){
            return c.toDecimalPlaces(len).toString()
        }else{
            return c.toString()
        }
    },
    //除
    div(num1, num2, len) {
        let a = new Decimal(num1)
        let b = new Decimal(num2)
        let c = a.dividedBy(b)
        if(len > 0){
            return c.toDecimalPlaces(len).toString()
        }else{
            return c.toString()
        }
    },
    //取余
    mod(num1, num2, len) {
        let a = new Decimal(num1)
        let b = new Decimal(num2)
        let c = a.modulo(b)
        if(len > 0){
            return c.toDecimalPlaces(len).toString()
        }else{
            return c.toString()
        }
    }
}
```
