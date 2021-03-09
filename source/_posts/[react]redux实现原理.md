---
title: react-redux实现原理
date: 2020-06-11 00:00:00
tags: [react,redux]
categories:  react
---

#### flux架构

- Flux 架构中，一个应用将被拆分为以下 4 个部分：view(视图层)、action(动作)、dispatcher(派发器)、store(数据层)
- Flux 工作流：用户与 View 之间产生交互，通过 View 发起一个 Action；Dispatcher 会把这个 Action 派发给 Store，通知 Store 进行相应的状态更新。Store 状态更新完成后，会进一步通知 View 去更新界面
- 特点：单向数据流，Flux 最核心的地方在于严格的单向数据流，在单向数据流下，状态的变化是可预测的

#### redux组成

- Store：它是一个单一的数据源，而且是只读的
- Action 是“动作”的意思，它是对变化的描述
- Reducer 是一个函数，它负责对变化进行分发和处理，最终将新的数据返回给 Store

#### redux实现的功能

- 将状态统一放在一个state中，由store来管理
- 这个store按照reducer的“shape”（形状）创建
- reducer的作用：接收到action后，输出一个新的状态，对应地更新store上的状态
- 外部改变state的最佳方式是通过调用store的dispatch方法，触发一个action，这个action被对应的reducer处理，完成state更新
- 可以通过subscribe在store上添加一个监听函数。每当调用dispatch方法时，会执行所有的监听函数
- 可以添加中间件处理副作用

#### redux api

- createStore：创建store，store 提供 subscribe，dispatch，getState 等方法
- combineReducers：合并reducer
- applyMiddleware：应用中间件

#### createStore实现

- creatorStore参数：reducer，initial_state（初始状态内容），applyMiddleware(middleware1, middleware2, ...)（指定中间件）

- createStore处理流程
1. 调用createStore
2. 处理没有传入初始状态情况，两个参数都是function
3. 如果enhancer不为空，调用enhancer包装creatorState
4. 定义内部变量
5. 定义ensureCanMutateNextListeners方法，保证currentListeners与nextListeners不指向统一引用
6. 定义getState方法，用来返回当前状态
7. 定义subscribe方法，用来注册监听函数
8. 定义dispatch方法，用于派发action，调用reducer，触发订阅
9. 定义replaceReducer方法，用于替换reducer
10. 执行一次dispatch，初始化状态
11. 定义observable方法
12. 将getState\subscribe\dispatch等方法返回

- dispatch处理流程

- subscribe处理流程

```javascript
// createStore参数reducer，initial_state，applyMiddleware(middleware1, middleware2, ...)
function createStore(reducer, preloadedState, enhancer) {
  // 处理没有初始state，有中间件情况
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = undefined;
  }
  // 处理中间件情况
  if (enhancer) {
    return enhancer(createStore)(reducer, preloadedState);
  }

  let currentReducer = reducer; // 当前store中的reducer，replaceReducer 会修改 reducer 的内容
  let currentState = preloadedState; // 当前store中存储的状态
  let currentListeners = []; // 当前store中放置的监听函数
  let nextListeners = currentListeners; // 下一次dispatch时的监听函数
  // 注意：当我们新添加一个监听函数时，只会在下一次dispatch的时候生效。
  // 该变量用于记录当前是否正在进行 dispatch
  let isDispatching = false;

  // 该方法用于确认快照是 currentListeners 的副本，而不是 currentListeners 本身
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  // 获取state
  function getState() {
    return currentState;
  }

  // 添加一个监听函数，每当dispatch被调用的时候都会执行这个监听函数
  function subscribe(listener) {
    // 防止在reducer执行过程中调用
    if (isDispatching) {
      throw new Error();
    }

    let isSubscribe = true; //设置一个标志，标志该监听器已经订阅了
    nextListeners.push(listener); // 注册监听函数
    // 返回取消订阅的函数，即从数组中删除该监听函数
    return function unsubscribe() {
      if (!isSubscribe) {
        return; // 如果已经取消订阅过了，直接返回
      }

      isSubscribe = false;
      // 从下一轮的监听函数数组（用于下一次dispatch）中删除这个监听器。
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  // 触发了一个action，因此我们调用reducer，得到的新的state，并且执行所有添加到store中的监听函数。
  function dispatch() {
    // 若当前已经位于 dispatch 的流程中，则不允许再度发起 dispatch（禁止套娃）
    if (isDispatching) {
      throw new Error("Reducers may not dispatch actions.");
    }
    try {
      // 执行 reducer 前，先"上锁"，标记当前已经存在 dispatch 执行流程
      isDispatching = true;
      // 调用 reducer，计算新的 state
      currentState = currentReducer(currentState, action);
    } finally {
      // 执行结束后，把"锁"打开，允许再次进行 dispatch
      isDispatching = false;
    }

    // 触发订阅，更新监听函数
    const listeners = (currentListeners = nextListeners);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
    return action;
  }

  // replaceReducer 可以更改当前的 reducer
  function replaceReducer(nextReducer) {
    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.REPLACE });
    return store;
  }

  // 初始化state
  dispatch({ type: ActionTypes.INIT });

  // observable 方法可以忽略，它在 redux 内部使用，开发者一般不会直接接触
  function observable() {
    // observable 方法的实现
  }

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable,
  };
}
```

#### combineReducers

#### 中间件

- 中间件相关的信息将作为 createStore 函数的一个 function 类型的入参被传入
- 工作模式：action->middleware1->middleware2...->dispatch->reducer->nextState
- applyMiddleware 将会对 dispatch 函数进行改写，使得 dispatch 在触发 reducer 之前，会首先执行对 Redux 中间件的链式调用

#### redux-thunk

- 若 action 是一个函数，那么 redux-thunk 就会执行它并且返回执行结果；若 action 不是一个函数，那么它就不是 redux-thunk 的处理目标，直接调用 next
- 所有的 Redux 中间件都必须是高阶函数。在高阶函数中，我们习惯于将原函数称为“外层函数”，将 return 出来的函数称为“内层函数”

```javascript
// createThunkMiddleware 用于创建 thunk
function createThunkMiddleware(extraArgument) {
  // 返回值是一个 thunk，它是一个函数
  return ({ dispatch, getState }) => (next) => (action) => {
    // thunk 若感知到 action 是一个函数，就会执行 action
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }
    // 若 action 不是一个函数，则不处理，直接放过
    return next(action);
  };
}
const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;
export default thunk;
```

#### applyMiddleware

- applyMiddleware 是 enhancer 的一种，而 enhancer 的意思是“增强器”，它增强的正是 createStore 的能力
- 调用 enhancer 时，传入 createStore 及其相关的入参信息是非常必要的

```javascript
// applyMiddlerware 会使用“...”运算符将入参收敛为一个数组
export default function applyMiddleware(...middlewares) {
  // 它返回的是一个接收 createStore 为入参的函数
  return createStore => (...args) => {
    // 首先调用 createStore，创建一个 store
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`
      )
    }

    // middlewareAPI 是中间件的入参
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    // 遍历中间件数组，调用每个中间件，并且传入 middlewareAPI 作为入参，得到目标函数数组 chain
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    // 改写原有的 dispatch：将 chain 中的函数按照顺序“组合”起来，调用最终组合出来的函数，传入 dispatch 作为入参
    dispatch = compose(...chain)(store.dispatch)

    // 返回一个新的 store 对象，这个 store 对象的 dispatch 已经被改写过了
    return {
      ...store,
      dispatch
    }
  }
}
```

1. 与creatorStore配合

```javascript
function createStore(reducer, preloadedState, enhancer) {
    // 这里处理的是没有设定初始状态的情况，也就是第一个参数和第二个参数都传 function 的情况
    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
        // 此时第二个参数会被认为是 enhancer（中间件）
        enhancer = preloadedState;
        preloadedState = undefined;
    }
    // 当 enhancer 不为空时，便会将原来的 createStore 作为参数传入到 enhancer 中
    if (typeof enhancer !== 'undefined') {
        return enhancer(createStore)(reducer, preloadedState);
    }
    ......
}
```

2. 改写dispatch函数

```javascript
// middlewareAPI 是中间件的入参
const middlewareAPI = {
  getState: store.getState,
  dispatch: (...args) => dispatch(...args)
}
// 遍历中间件数组，调用每个中间件，并且传入 middlewareAPI 作为入参，得到目标函数数组 chain
const chain = middlewares.map(middleware => middleware(middlewareAPI))
// 改写原有的 dispatch：将 chain 中的函数按照顺序“组合”起来，调用最终组合出来的函数，传入 dispatch 作为入参
dispatch = compose(...chain)(store.dispatch)
```

3. compose 源码，合成函数

```javascript
// compose 会首先利用“...”运算符将入参收敛为数组格式
export default function compose(...funcs) {
  // 处理数组为空的边界情况
  if (funcs.length === 0) {
    return arg => arg
  }

  // 若只有一个函数，也就谈不上组合，直接返回
  if (funcs.length === 1) {
    return funcs[0]
  }
  // 若有多个函数，那么调用 reduce 方法来实现函数的组合
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
// compose(f1, f2, f3, f4)
// (...args) =>  f1(f2(f3(f4(...args))))
```

```javascript
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }
  const f = funcs.reduce((a, b) => (...args) => a(b(...args)));
  return f;
}

const f1 = (next) => {
  return (action) => {
    console.log(1);
    next(action);
  };
};
const f2 = (next) => {
  return (action) => {
    console.log(2);
    next(action);
  };
};
const f3 = (next) => {
  return (action) => {
    console.log(3);
    next(action);
  };
};

// compose(f1, f2, f3, f4)
// (...args) =>  f1(f2(f3(f4(...args))))
const fun = compose(...[f1, f2, f3]);
const f = fun((action) => {
  console.log(action);
});
f("action");
```

#### 面向切面编程AOP

- AOP 是一种典型的 “非侵入式”的逻辑扩充思路
- 面向切面编程带来的利好是非常明显的。从 Redux 中间件机制中，不难看出，面向切面思想在很大程度上提升了我们组织逻辑的灵活度与干净度，帮助我们规避掉了逻辑冗余、逻辑耦合这类问题。通过将“切面”与业务逻辑剥离，开发者能够专注于业务逻辑的开发，并通过“即插即用”的方式自由地组织自己想要的扩展功能











