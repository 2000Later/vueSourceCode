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

# 发布订阅模式