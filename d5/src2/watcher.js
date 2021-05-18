/* Watcher 观察者, 用于 发射更新的行为 */
class Watcher {
  /**
   * 
   * @param {Object} vm   JGVue实例
   * @param {String|Function} expOrFn 如果是渲染watcher, 传入的就是渲染函数，如果是计算Watcher传入的就是路径表达式, 暂时只考虑exOrFn为函数的情况 
   */
  constructor(vm,expOrFn) {
    this.vm = vm;
    this.getter = expOrFn;
    this.deps = []; // 依赖项
    this.depIds = {}; // 是一个 Set类型, 用于保证 依赖项的唯一性(简化的代码目前没有实现)

    // 一开始需要渲染：真实的vue中：this.lazy ? undefined: this.get()
    this.get();
  }
  get() {
    this.getter.call(this.vm,this.vm)
  }
  /**
   * 执行, 并判断是懒加载,还是同步执行,还是异步执行:
   * 我们现在只考虑 异步执行(简化的是 同步执行)
   */
  run() {
    this.get()
  }
  // 对外公开的函数，用于在属性发生变化时触发的接口
  update() {
    this.run();
  }
  // 清空依赖队列
  cleanupDep() {
    
  }
}