---
title: <react>学习笔记
date: 2019-03-27 00:00:00
tags: [js,react]
categories: react
---

### JSX

1. 最外层只允许被一个标签包裹
2. 标签一定要闭合
3. DOM元素和组件元素（组件元素要大写开头）,也可以使用命名空间方式使用组件(<MUI.Button />)
4. 注释：

```
{/* 注释 */}
/*
多行注释
*/
```

5. 元素属性：特殊：class->calssName  for->htmlfor，自定义属性需要小驼峰写法
6. Boolean 属性：省略的话默认为true 比如 disabled
7. 展开属性：<Component {...data} />，使用ES6展开运算符
8. DOM元素自定义HTML属性： data- 无障碍属性 aria-
9. JavaScript属性表达式：

```
const person = <Person name={window.isLoggedIn ? window.name : ''} />
```

10. HTML转义：react会将所有显示到DOM的字符串转义，防止xss

### react数据流

#### state

- 使用setState更新state

#### props

- 是properties的简写
- props默认值

```
import React,{Component} from 'react'

export default class DefaultProps extends Component{
    static defaultProps = {
        name: '123'
    }
    render(){
        return(
            <div>{this.props.name}</div>
        )
    }
}
```

- 子组件prop--children：代表组件的子组件集合
- 组件props：props可以传入DOM节点，组件节点
- 子组件修改props，通过父组件传递的prop函数修改

### react生命周期

```
componentWillMount(){
}
componentDidMount(){
}
componentWillUnmount(){
}
componentWillReceiveProps(nextProps){
}
shouldComponentUpdate(nextProps, nextState) {
    return true
}
componentWillUpdate(nextProps, nextState){
}
componentDidUpdate(prevProps, prevState) {
}
```

#### 组件挂载时

- componentWillMount与componentDidMount会在初始化时运行一次
- 如果在componentDidMount中运行setState那么组件会再次更新，在初始化过程中会渲染两次组件

#### 组件卸载时

- componentWillUnmount执行，可以执行一些清理方法，比如时间回收、定时器清除

#### 组件自身state更新

- 会依次执行shouldComponentUpdate、componentWillUpdate、componentDidUpdate
- shouldComponentUpdate接收需要更新的props和state，可以通过返回true/false判断是否更新组件
- 注意：不能在componentWillUpdate中执行setState

#### 父组件更新props的更新

- 依次执行componentWillReceiveProps、shouldComponentUpdate、componentWillUpdate、componentDidUpdate

### ReactDom

### 事件系统

#### 合成事件

- React基于Virtual DOM实现了合成事件
- 合成事件支持事件冒泡机制，可以使用stoPropagation()和preventDefault()中断
- JSX中必须使用小驼峰书写事件属性名：onClick
- 合成事件实现机制

1. 事件委托：react不会把事件处理直接绑定到真实节点上，而是把所有事件绑定到结构的最外层，使用统一的事件监听器，简化了事件处理和回收机制，提升效率。
2. 自动绑定：使用ES6 class和纯函数时，事件方法上下文不会指向该组件，需要手动绑定this

```
//bing绑定
render(){
    return(
        <div onClick={this.clickFun.bind(this)}>son</div>
    )
}
//只绑定、不传参可以使用双冒号方法
render(){
    return(
        <div onClick={::this.clickFun}>son</div>
    )
}
//构造器内声明
constructor(props){
    super(props)
    this.clickFun = this.clickFun.bind(this)
}
//箭头函数
render(){
    return(
        <div onClick=()=>{this.clickFun()}>son</div>
    )
}
```

#### 原生事件

- componentDidMount中可以绑定原生事件
- 注意一定要手动移除原生事件绑定，否则会造成内存泄漏

```
componentWillUnmount(){
    this.refs.button.removeEventListener('click')
}
```

#### 合成与原生混用

- 绑定相同元素原生事件先调用
- 合成事件阻止冒泡只对合成事件起作用
- 原生事件阻止冒泡会影响合成事件

### 组件建通信

#### 父向子通信

- 通过props传递

#### 子向父

- 利用回调函数：
- 利用自定义事件机制：

#### 跨级通信

- 使用context实现：

#### 没有嵌套关系的组件通信

- 使用EventEmitter

```
//event.js
import {EventEmitter} from 'events'
export default new EventEmitter()
```
```
//组件中使用
import React,{Component} from 'react'
import emitter from '../common/event'
export default class EventEmitter extends Component{
    componentDidMount() {
        this.myEvent = function(res){
            console.log(res)
        }
        emitter.on('my-event',this.myEvent)
    }
    componentWillUnmount() {
        if(this.myEvent){
            emitter.removeListener('my-event',this.myEvent)
        }
    }
    emitData(){
        emitter.emit('my-event',123)
    }
    render(){
        return(
            <div>
                <button type="button" onClick={()=>{this.emitData()}}>emit</button>
            </div>
        )
    }
}
```

### 组件间抽象

#### mixin

1. 使用createClass构建组件时提供了mixin属性

- 官方pureRenderMixin
- 如果是React的生命周期方法，会叠加在一起顺序执行
- React中不允许出现普通方法的mixin，会包ReactClassInterface错误
- createClass使用mixin做了两件事：1.共享工具方法 2.生命周期继承（props与state合并，生命周期方法合并）

2. ES6 Classes与decorator

- ES6可以使用[decorator](http://caibaojian.com/es6/decorator.html)实现mixin

#### mixin存在的问题

- 破坏原有组件封装性，需要维护‘不可见’状态
- 命名冲突，尤其对于第三方引用
- 增加复杂性，生命周期过多

### 高阶组件

- 高阶函数：函数接收函数作为输入，或者输出一个函数
- 高阶组件会返回一个增强的React组件

#### 属性代理

```
import React,{Component} from 'react'
class HigherOrder extends Component{
    render(){
        return(
            <div>
                <p>456</p>
            </div>
        )
    }
}
const MyContainer = (WrappedComponent)=>{
    return class ContainerComponent extends Component {
        //获取子组件引用
        proc(comObj){
            console.log(comObj)
        }
        render(){
            const props = Object.assign({},this.props,{
                ref: this.proc.bind(this)
            })
            return (
                <div>
                    <span>123</span>
                    <WrappedComponent {...props}></WrappedComponent>
                </div>
            )
        }
    }
}
export default MyContainer(HigherOrder)
```

- 可以通过高阶组件传递props，这种方式成为属性代理
- 原始组件具备高阶组件对他的修饰，保持单个组件的封装同时还保持了易用性
- 功能

1. 控制props
2. 通过refs使用引用
3. 抽象state
4. 使用其他元素包裹WrappedComponent

#### 反向继承

```
import React,{Component} from 'react'
class Super extends Component{
    constructor(props){
        super(props)
        this.state = {
            show: true
        }
    }
    render(){
        return(
            <div>123</div>
        )
    }
}
class Sub extends Super{
    changeState(){
        this.setState({
            show: !this.state.show
        })
    }
    render(){
        return(
            <div>
                <button type="button" onClick={()=>{this.changeState()}}>toggle</button>
                {this.state.show ? super.render() : ''}
            </div>
        )
    }
}
export default Sub
```

- 渲染劫持
- 控制state

#### 高阶组件命名

- 高阶组件会失去原始WrappedComponent的displayName
- 可以参照react-redux中getDiaplayName实现
- 可以使用[recompose](https://github.com/acdlite/recompose)库，已经停止更新。。。可以使用Hooks解决这些问题

#### 高阶组件参数

- 使用闭包传参

### PureRender

#### 纯函数

- 三大原则：1.给定相同的输入，总是返回相同的输出 2.过程没有副作用（不改变外部状态） 3.没有额外的状态依赖（不与第三方共享变量）

- 组件满足纯函数条件：被相同的props和state渲染得到相同的结果

### Hooks

#### useState

```
import React, { useState,useEffect } from "react";
function MyStateHook(props) {
    const [num,setNum] = useState(1)
    return(
        <div>
            <p>{num}</p>
            <button type="button" onClick={()=>{setNum(num+1)}}>num+1</button>
        </div>
    )
}
```

#### useEffect

```
import React, { useState,useEffect } from "react";
function MyEffetHook(props) {
    const [num,setNum] = useState(1)
    useEffect(()=>{
        if(num == 1){
            setTimeout(()=>{
                setNum(2)
            },1000)
        }
        //componentWillUnmount时调用
        return ()=>{
        }
    },[])//第二个参数传递一个数组，在这些值没有更改时不会触发，如果传空数组，相当于只在componentDidMount触发

    return(
        <div>
            <p>{num}</p>
            <button type="button" onClick={()=>{setNum(1)}}>num+1</button>
        </div>
    )
}
```

