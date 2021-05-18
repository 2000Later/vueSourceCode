数据驱动

# Vue与模板

使用步骤:

1. 编写 页面 模板 
   1. 直接在 HTML 标签中写 标签
   2. 使用 template
   3. 使用 单文件 ( <template /> )
2. 创建 Vue 的实例
   1. 在 Vue 的构造函数中提供: data, methods, computed, watcher, props, ...
3. 将 Vue 挂载到 页面中 ( mount )

# 数据驱动模型

Vue 的执行流程
1. 获得模板：模板中有“字符串变量”
2. 利用Vue 构造函数中所提供的数据来“字符串变量”，得到可以在页面中显示的标签
3. 根据字符串变量替换数据

Vue 利用 我们提供的数据 和 页面中 模板 生成了 一个新的 HTML 标签 ( node 元素 ),
替换到了 页面中 放置模板的位置.

如何实现

# 简单的模板渲染

# 虚拟DOM

目标：

1. 怎么将真正的 DOM 转换为 虚拟 DOM
2. 怎么将虚拟 DOM 转换为 真正的 DOM

深拷贝类似

day2

# 函数柯里化

参考资料:

- [函数式编程](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/)
- [维基百科](https://zh.wikipedia.org/wiki/%E6%9F%AF%E9%87%8C%E5%8C%96)

概念:

1. 柯里化： 一个函数原本有多个参数，只传入一个参数，生成**一个**新函数，有新函数接收剩下来的参数来运行得到的结构.
2. 偏函数： 一个函数原本有多个参数，只传入一部分参数，生成**一个**新函数，由新函数接收剩下的参数来运行得到结构.
3. 高阶函数：一个函数参数是一个函数，该函数对参数这个函数进行加工，得到一个函数，这加工用的函数就是高阶函数.

为什么使用柯里化？为了性能，使用柯里化可以缓存一部分能力

使用两个案例来说明:

1. 判断元素
2. 虚拟DOM 的render方法

1. 判断元素： 

Vue本质 上是使用 HTML 的字符串作为模板的，将字符串的 模板 转换为 AST, 在转换为 VNode.

- 模板 -> AST
- AST -> VNode
- Vnode -> DOM

哪一个阶段最消耗性能？

最消耗性能的是字符串解析( 模板 -> AST )

例子：let s = "1 + 2 * ( 3 + 4 ( 5 + 6 ))"
写一个程序，解析这个表达式，得到结果 ( 一般化 )
我们一般会将这个表达式转换为 "波兰式" 表达式，然后使用栈结构来运算

在 Vue 中每一个标签可以是真正的HTML标签, 也可以是自定义组件，如何区分？

在 Vue 源代码中其实将所有可用的 HTML 标签已经存起来了.

假设这里是考虑几个标签：

````js
let tags = 'div,p,a,img,ul,li'.split(',');
````
需要一个函数，判断一个标签名是否为 内置的 标签

````js
function isHTMLTag(tagName) {
    tagName = tagName.toLowerCase();
    return tags.includes(tagName)
}
````

模板是任意编写的，可以写的很简单, 也可以到很复杂，includes 内部也是要循环的

如果 6 中内置标签，而模板中有 10 个标签需要判断，那么就需要执行 60 次循环· 

2. 虚拟DOM 的 render 方法

vue 项目 *模板 转换为 抽象语法* 需要执行几次？？？

- 页面一开始加载需要渲染
- 每一个属性（ 响应式 ）数据在发生变化的时候 要渲染
- watch computed 等等

d1中06的代码 每一次渲染的时候，模板，模板就会被解析一次（简化的解析方法）

render 的作用是将虚拟DOM 转换为 真正的 DOM 加到页面中

- 虚拟 DOM 可以降级理解为AST
- 一个项目运行的时候 模板是不会变的，就表示AST是不会变的 

可以将代码进行优化，将虚拟 DOM 缓存起来，生成一个函数，函数只需要传入数据 就可以得到一个真正的DOM

# 响应式原理

- 我们在使用 Vue 时候，赋值属性获得属性都是直接使用的 Vue 实例
- 我们在设计属性值的时候，页面的数据更新

````js
Object.defineProoerty(对象,属性名,{
   configurable: false, // 是否可配置
   writable: false, // 是否可写入 // 此属性不能与set 和 get 同时存在
   enumerable: false, // 是否可枚举
   get() {},
   set() {} 
})
````
````js
function defineReactive(target,key,value,enumerable) {
   // 函数内部是一个局部作用域,value就在函数内使用的变量 ( 闭包 )
   Object.defineProperty(target,key,{
      configurable: true,
      enumberable,
      get() {
         console.log(`读取o的 ${key} 属性`)
         return value
      },
      set(newVal) {
         console.log(`设置${key}新值为:${newVal}`)
         value = newVal
      }
   })
}
````
处理多级问题
````js
let o = {
   list: [
      {}
   ],
   a: [
      {}
   ],
   b: {}
}
````
递归处理多级


对于对象可以使用 递归来响应式化, 但是数组也需要响应式化

- push
- pop
- shift
- unshift
- resever
- sort
- splice

要做那些处理?

1. 在改变数组的数据时候,发出通知
   - Vue2 中的缺陷, 数组发生变化, 设置length无法通知 (Vue3 使用ES6中 Proxy语法 解决了这个问题)
2. 加入的元素也应该变成响应式的

技巧: 如果函数已经定义, 但是需要扩展功能,一般的处理办法:

1. 使用一个临时的函数名存储函数
2. 重新定义原来的函数
3. 定义扩展的功能
4. 调用临时的那个函数 

扩展数组的push 和 pop 如何处理?

- 直接修改 prototype **不行**
- 修改要进行响应式化的数组的原型 (__proto__)

已经将对象改成响应式的，但是如果直接给对象赋值，赋值另一个对象，那么就不是响应式的了，怎么办？
需要在set中做响应式处理


// 继承关系: arr -> Array.prototype -> Object.prototype -> ...
// 继承关系: arr -> 改写的方法 -> Array.prototype -> Object.prototype -> ...


# 发布订阅模式

- 代理方法 (app.name,app._data.name)
- 事件模型 (node: event模块)
- vue 中的 Observer 与 Watcher 和 Dep

代理方法,就是要将 app._data 中的成员 给 映射到app上

由于需要在更新的时候,更新页面的内容
所以 app._data访问的成员 与 app访问的成员应该是同一个成员

由于 app._data 已经是响应式的对象,所以只需要让app访问的成员去访问 app._data的对应的成员就可以了.

例如:
````js
app.name 转换为 app._data.name
app.xxx 转换为 app._data.xxx
````

引入了一个函数proxy(target,src,prop), 将target的操作 映射到 src.prop上
这里是因为当时没有`Proxy`语法(ES6)

之前处理的reactive方法有许多缺点，数据中属性名不能重复，需要新的方法来处理

提供一个 Observer 的方法，在方法中对 属性进行处理
可以将这个方法封发到initData方法中


## 解释代理
````js
app._data.name
/*
   vue 设计，不希望访问 _ 开头的数据
   vue 中有一个潜规则：
   _开头的数据是私有数据
   $ 开头的是只读数据
*/ 
app.name 
// 将 对 _data.xxx 的访问 交给了实例

// 重点：访问 app 的 xxx 就是在访问 app._data.xxx
````
假设：
````js
var o1 = {name: '张三'}
Object.defineProperty(o2,'name',{
   configurable: true,
   enumerable: true,
   get() {
      return o1.name
   }
})
````
访问的 app 的 xxx 就是在访问 app._data.xxx

````js
Object.defineProperty(app,'name',{
   configurable: true,
   enumerable: true,
   get() {
      return app_data.name
   },
   set(newVal) {
      app._data.name = newVal
   }
})
````

将属性的操作转换为参数
````js
function proxy(app,key) {
   Object.defineProperty(app,key,{
      configurable: true,
      enumerable: true,
      get() {
         return app._data[key]
      },
      set(newVal) {
         app._data[key] = newVal
      }
   })
}
````
问题：

在vue中不仅仅是只有data属性，properties 等等
````js
function proxy(app,prop,key) {
   Object.defineProperty(app,key,{
      configurable: true,
      enumerable: true,
      get() {
         return app[prop][key]
      },
      set(newVal) {
         app[prop][key] = newVal
      }
   })
}
// 如果将_data的成员映射到 实例上
proxy(实例,'_data',属性名)
// 如果要将_properties 的成员映射到实例上
proxy(实例,'_data',属性名)
````

# 发布订阅模式

目标：解耦，让各模块之间没有紧密的联系

现在的处理办法是 属性在更新的时候 调用 mountComponent 方法.

问题：mountComponent更新的 是root根元素 ->当前虚拟DOM对应的页面DOM

在Vue中，整个的更新是按照组件为单位进行**判断**，已节点为单位进行更新.

- 如果代码中没有自定义组件，那么在比较算法的时候，会将全部的模板 对应的 虚拟 DOM 进行比较.
- 如果代码中含有自定义组件，那么在比较算法的时候，就会判断更新的是那一些组件中的属性，只会判断更新数据的组件，其他组件不会更新.

复杂的页面是有很多组件构成. 每一个属性要更新的都要调用更新方法?

**目标，如果修改了什么属性，就尽可能只更新这些属性对应的页面DOM**

这样就一定不能将更新的代码写死.

例子：预售可能一个东西没有现货，告诉老板，如果东西到了 就告诉我.

老板就是发布者
订阅什么东西作为中间媒介
我就是订阅者

使用代码的结构来描述：
1. 老板提供一个帐薄(数组)
2. 我可以根据需求订阅我的商品(老板要记录一下 谁 定了什么东西，数组中存了 某些东西)
3. 等待，可以做其他事情
4. 当货品来的时候，老板就查看 账簿，挨个的打电话(遍历数组，取出数组的元素来使用)

实际上就是事件模型

1. 有一个event对象
2. on,off,emit方法

实现事件模型

1. event 是一个全局对象
2. event.on('事件名',处理函数),订阅事件
   1. 移除所有
   2. 移除某一个类型的事件
   3. 移除某一个类型的某一个处理函数
3. 写别的代码
4. event.emit('事件名',参数), 先注册的事件处理函数就会一次调用

原因：

1. 描述发布订阅模式
2. 后面会使用到事件

发布订阅模式(形式不局限于函数，形式可以是对象等)：
1. 中间的**全局的容器**，用来**存储**可以被触发的东西(函数，对象)
2. 需要一个方法，可以往容器中**传入**东西(函数，对象)
3. 需要一个方法，可以将容器中的东西取出来**使用**(函数调用，对象的方法调用)

Vue 模型

页面中的变更(diff) 是以组件为单位

- 如果页面中只有一个组件 (Vue 实例)，不会有性能损失
- 但是如果页面中有多个组件 (多watcher的一种情况), 第一次会有 多个组件的 watcher 存入到全局watcher中.
   - 如果修改了局部的数据(例如其中一个组件的数据)
   - 表示只会对该组件进行 diff 算法, 也就是说只会重新生成该组件的 抽象语法树
   - 也就表示再次往全局存储的只有该组件的watcher
   - 页面更新的时候也就只需要更新一部分

# 改写 observe 函数

   缺陷：

   - 无法处理数组
   - 响应式无法在中间集成Watcher处理
   - 实现的reactive需要和实例紧紧的绑定在一起，分离(解耦)

## 问题

-- observe 还没有对单独的数组元素进行处理


# 引入 Warcher

问题：

- 模型(图)
- 关于 this 的问题


实现： 

分成两步：

1. 只考虑修改后的刷新(响应式)
2. 再考虑依赖收集(优化)

在Vue中提供一个构造函数Watcher
Watcher 会有一些方法：

- get() 用来进行**计算**或**执行**处理函数
- update() 公共的外部方法，改方法会触发内部的run方法
- run() 运行, 用来判断内部是使用异步运行还是同步运行等, 这个方法最终会调用内部的get方法
- cleanupDep() 简单理解为清楚队列

页面的渲染是上面get方法执行的

watcher实例有个属性vm,表示的就是 当前的vue实例

# 引入 Dep 对象

该对象提供 依赖收集 (depend)的功能,和派发更新(notify)的功能
