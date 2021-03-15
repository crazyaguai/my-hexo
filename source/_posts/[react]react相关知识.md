---
title: <react>react相关知识
date: 2020-09-12 00:00:00
tags: [js,react]
categories: react
---

#### 主要内容

- 组件基础、状态管理、渲染流程、性能优化、Hooks、react生态

### react是什么

- 概念、用途、思路、优缺点

1. react是网页UI框架，是组件化框架
2. 通过组件化方式解决视图层开发的问题，提升开发效率
3. 设计思路：声明式、组件化、通用性
   声明式：使用jsx描述虚拟dom，更加直观
   组件化：使用函数组件或者类组件，使试图模块可以复用
   通用性：虚拟dom使react适用范围宾大，web、native都可以进行开发
4. 缺点：react只是视图层框架、没有提工完整的工程化开发方案，需要借助社区方案，在技术选型和学习上有一定成本

### react为什么使用jsx

- jsx介绍、核心概念、对比方案

1. jsx是javascript的扩展语法，语法类似xml，react团队不想引入js外的开发体系，希望通过合理的关注点分离保持组件开发的纯粹性。
2. jsx用于声明react元素，在构建时，会被babel编译为React.createElement，jsx更像是React.createElement的语法糖
3. 对比模板：模板会引入模板语法、模板指令等概念，增加学习成本
   对比模板字符串：模板字符串结构会多次内嵌，结构复杂，优化困难
	对比json：代码提示困难

### 类组件生命周期

#### react15生命周期

- 挂载阶段

constructor -> componentWillMount -> render -> componentDidMount

- 更新阶段

只修改state：shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate
修改props内容：componentWillReceiveProps -> shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate

- 卸载阶段

componentWillUnmount

#### react16生命周期

- 挂载阶段

getDerivedStateFromProps -> render -> componentDidMount

- 更新阶段

getDerivedStateFromProps -> shouldComponentUpdate -> render -> getSnapshotBeforeUpdate -> componentDidUpdate

- 卸载阶段

componentWillUnmount


### 函数式组件与类组件区别

- 共同点、不同点

1. 函数式组件与类组件最终呈现效果一致
2. 两者设计模式不同，类组件是面向对象编程，主打继承、生命周期概念。函数式组件是函数式编程，主打immutable、无副作用、引用透明等特点
3. 由于推出Hooks，函数式组件可以替代类组件
4. 性能优化方面，类组件使用shouldComponentUpdate阻断渲染提升性能，函数式组件依靠React.memo缓存渲染结果提升性能
5. 类组件容易上手，函数式组件Hooks思想不容易理解，但函数组件是社区主推方案
6. 类组件在未来时间切片与并发模式中，由于生命周期复杂性，不容易优化，函数组件轻量简单，且在 Hooks 的基础上提供了比原先更细粒度的逻辑组织与复用，更能适应 React 的未来发展

### react组件设计

- 展示组件：专注展示组件本身特性
1. 代理组件，封装常用属性，减少重复代码，例如：封装antd按钮组件
2. 样式组件，封装常用样式
3. 布局组件
- 灵巧组件，专注组合组件
1. 容器组件，例如：ListWrap接受list数据，展示ListItem元素
2. 高阶组件，抽取公共逻辑，链式调用，渲染劫持

- 高阶组件存在的问题以及处理方法
1. 丢失静态函数：通过 hoist-non-react-statics 来处理
2. refs属性不能穿透：使用 React.forwardRef 处理

```javascript
// 抽取公共逻辑
function isLogin(WrappedComponent){
  const isLogin = true
  return (props)=>(
    <Fragment>
      <p>高阶组件检测是否登录</p>
      {isLogin ? <WrappedComponent {...props} /> : (<span>未登录</span>)}
    </Fragment>
  )
}

// 埋点统计
function pageLog(pagename){
  return (WrappedComponent)=>{
    return class Wrapper extends React.Component{
      componentDidMount(){
        console.log(pagename)
      }
      render (){
        return <WrappedComponent {...this.props} />
      }
    }
  }
}

// 高阶组件，链式调用
@pageLog('个人中心')
@isLogin
class UserInfo extends React.Component{
  render (){
    return (<span>已登录，个人中心</span>)
  }
}

// 高阶组件，渲染劫持
function withLoading(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      if (this.props.isLoading) {
        return <div>loading</div>;
      }
      return super.render();
    }
  };
}
@withLoading
class CardWrap extends React.Component {
  render (){
    return (<div>card</div>)
  }
}
```

### setState是同步还是异步

- react合成事件：挂载在document（17之后挂载在渲染节点），dom事件出发后冒泡到document，react找到对应组件，创造合成事件
- react中通过isBatchingUpdates 来判断setState是否异步，当值为true时异步，当值为false时直接更新
- 异步场景：react可以控制的地方，如生命周期、合成事件中
- 同步场景：react无法控制的地方，如ddEventListener 、setTimeout、setInterval 等事件中，就只能同步更新
- 异步设计为了性能优化、减少渲染次数、保持内部一致性（如果setSatte是同步的，但是props更新还是异步的）、启用并发完成异步渲染

```
class Test extends React.Component {
  state  = {
      count: 0
  };

    componentDidMount() {
	// 异步
    this.setState({count: this.state.count + 1});
    console.log(this.state.count);

    this.setState({count: this.state.count + 1});
    console.log(this.state.count);
	// 同步 
    setTimeout(() => {
      this.setState({count: this.state.count + 1});
      console.log(this.state.count);

      this.setState({count: this.state.count + 1});
      console.log(this.state.count);
    }, 0);
  }
 
  render() {
    return null;
  }
};
```

### react组件间通信

- 父->子：props
- 子->夫：回调函数、实例函数(React.createRef)
- 兄弟组件：父组件中转
- 多层：Context，全局变量与事件、状态管理框架（flux、redux、Mobx）

### react状态管理框架

### Vitural Dom 原理

- 概念、用途、思路、优缺点

1. 原理：虚拟DOM原理是通过js对象模拟DOM节点，为了要提升代码抽象能力、避免人为DOM操作、降低代码整体风险等因素，react引入了虚拟DOM
2. 实现：react在render函数中写的JSX会在babel编译下，转换为React.createElement执行JSX中的参数
3. 过程：React.createElement执行后，会返回一个描述自己当前tag类型、props等属性以及children等情况的对象，通过树结构形成一颗虚拟DOM树，当状态发生变化时，对比更新前后虚拟DOM的差异，整个过程成为diff，生成的结果为patch，计算后，渲染patch完成真实dom更新
4. 优点：改善大规模DOM操作的性能、避免XSS风险、以较低成本实现跨平台开发
5. 缺点：内存占用高、高性能场景存在难以优化情况（如Google Earth等高性能应用）

### react diff算法

### react 渲染流程

### react 渲染异常

### react 性能优化

### 避免重复渲染

#### 重复渲染分析
- 步骤：选择优化时机、定位重复渲染的问题、引入解决方案
- 优化时机：需要确认当前性能问题与业务的关系，是否有必要优化
- 定位问题：还原用户使用环境的方式进行复现，然后使用 Performance 与 React Profiler 工具进行分析，对照卡顿点与组件重复渲染次数及耗时排查性能问题

#### 解决方案
- 组件使用 React.memo、pureComponent、shouldComponentUpdate 缓存 API，减少重新渲染
- 注意问题：
1. 箭头函数props会触发更新，需要改为传递类方法

```javascript
<ListItem
 key={id}
 id={id}
 text={text}
 onMoveUp={(id) => { //... }} // 会触发更新
 onMoveDown={this.handleMoveDown} // 不会触发更新
/>
```

2. props参数是对象时会触发更新，可以使用reselect库解决，增加缓存

```javascript
render() {
 const data = this.props.list.map((item) => { /*... */ })
 return (
    <FlatList
      data={data}
      renderItem={this.renderItem}
    />
 )
}

// 解决方法
import { createSelector } fr om 'reselect'
const listSelector = props => props.list || []
const dataSelector = createSelector(
  listSelector,
  list => list.map((item) => { /*... */ })
)
render() {
 return (
    <FlatList
      data={dataSelector(this.props)}
      renderItem={this.renderItem}
    />
 )
}
```

3. 使用不可变数据处理：ImmutableJS、immerjs

### 提升 react 代码可维护性

1. 可分析性：从预防与兜底两个维度展开工作，预防依靠Lint工具与团队内部Code Review，兜底主要是在流水线中加入 sourcemap，能够通过线上报错快速定位源码
2. 可改变性：使代码易于拓展，业务易于迭代，工作主要从设计模式与架构设计展开，设计模式指通过组件设计，使容器组件与展示组件划分边界，隔绝业务逻辑，整体架构设计，采用了 rematch 方案，rematch 中可以设计的 model 概念可以很好地收敛 action、reducer 及副作用，同时支持动态引入 model，保障业务横向拓展的能力
3. 稳定性：通过提升核心业务代码的测试覆盖率来完成，
4. 易测试性：采用 Rematch 的架构完成模块分离，整体业务逻辑挪到了 model 中，且 model 自身是一个 Pure Object，附加了多个纯函数。纯函数只要管理好输入与输出，在测试上就很容易
5. 可维护性的依从性：建立团队规范，遵循代码约定，提升代码可读性。这方面的工作就是引入工具，减少人为犯错的概率，使用ESLint、stylelint、commitlint、配置编辑器的 editorconfig，配置样式的 prettier

### react hooks 限制

- 限制：
1. 不能在循环，条件判断，嵌套函数中使用Hook
2. 在 react 函数式组件中使用Hook
- 存在限制的原因
1. react旧开发模式存在的问题：（1）组件间难以复用状态逻辑（需要使用高阶组件、props、状态管框架），复杂组件难以理解（生命周期与业务耦合太深，关键功能难以拆分），人和机器容易混淆类（this问题，类难以优化）
2. Hook是基于链表实现的，在调用时按顺序加入数组中，如果使用循环、条件或嵌套函数很有可能导致取值错位，执行错误的 Hook
3. 可以引入Eslint的Hook检查插件预防错误

### useEffect 与 useLayoutEffect

- 相同点：底层签名函数一直，都是调用的 mountEffectImpl，在使用上也没什么差异，基本可以直接替换，也都是用于处理副作用
- 不同点：useEffect 在 React 的渲染过程中是被异步调用的，用于绝大多数场景，而 LayoutEffect 会在所有的 DOM 变更之后同步调用，主要用于处理 DOM 操作、调整样式、避免页面闪烁等问题。也正因为是同步处理，所以需要避免在 LayoutEffect 做计算量较大的耗时任务从而造成阻塞
- 趋势：在未来的趋势上，两个 API 是会长期共存的，暂时没有删减合并的计划，需要开发者根据场景去自行选择。React 团队的建议非常实用，如果实在分不清，先用 useEffect，一般问题不大；如果页面有异常，再直接替换为 useLayoutEffect 即可

### react hooks设计模式

1. react hooks开发要抛弃生命周期的思考模式，以effects的角度思考，类组件的开发模式中，在componentDidMount 中放置一个监听事件，还需要考虑在 componentWillUnmount 中取消监听，甚至可能由于部分值变化，还需要在其他生命周期函数中对监听事件做特殊处理，可以将这一系列监听与取消监听放置在一个 useEffect 中，useEffect 可以不关心组件的生命周期，只需要关心外部依赖的变化即可，对于开发心智而言是极大的减负。这是 Hooks 的设计根本
2. React.useMemo 取代 React.memo，因为 React.memo 并不能控制组件内部共享状态的变化，而 React.useMemo 更适合于 Hooks 的场景
3. 常量处理，类组件中，经常将常量定义在类中，在组件函数中，由于每次渲染都会重新声明常量，组件内的函数每次会被重新创建，如果这个函数需要使用函数组件内部的变量，那么可以用 useCallback 包裹下这个函数
4. useEffect第二个参数容易错误使用，使用值类型而不是引用类型，引用类型容易被篡改
5. 将业务逻辑封装到各自的自定义 Hook 中，组件内部是抽空不放置业务逻辑，只是调用单个hooks暴漏的接口

### react router原理

- 实现原理
1. HASH方式：依靠浏览器Hash变换
2. 切换地址中的path：需要使用 HTML5 的 history API 中的 pushState、replaceState，使用时还需要服务端完成 historyApiFallback 配置
- react router实现：内部靠自己封装的history库实现，提供两套基础history，一套直接使用浏览器history api，用于支持react-dom。另一套基于内存实现，自己做一个存储数组，用于支持react-router-native
- 工作方式：
1. 设计模式：在架构上通过Monorepo进行项目管理，具有团队间透明、迭代便利有点，整体的数据通信，通过react Content Api实现
2. 关键模块：主要分为三类组件，（1）Context容器，比如 Router 与 MemoryRouter。（2）消费者组件，用于匹配路由，有Route、Redirect、Switch 等。（3）平台相关功能组件，如 Link、NavLink、DeepLinking 等