class JGVue{
  constructor(options) {
    this._data = options.data;
    let elm = document.querySelector(options.el);
    this._template = elm;
    this._parent = elm.parentNode;
    this.initData(); // 将data 响应式化，并映射在实例中
    this.mount(); 
  }
  initData() {
    observe(this._data,this);
    // 将this._data中的属性映射到this中
    for (const key in this._data) {
      proxy(this, '_data',key)
    }
  }
  mount() {
    this.render = this.createRenderFn();
    this.mountComponent()
  }
  createRenderFn() {
    let ast = getVNode(this._template);
    return function render() { // 缓存了一个函数返回结果(等到执行回调时触发)
      return combine(ast,this._data)
    }
  }
  mountComponent() {
    let mount = function () {
      console.log('渲染了');
      this.update(this.render())
    }.bind(this)
  // 这个 Watcher 就是全局的 Watcher, 在任何一个位置都可以访问他了 ( 简化的写法 )
    new Watcher(this, mount); // 将更新函数传入watcher构造函数中(构造函数实例的时候触发更新方法)
  }
  update(vnode) {
    let realDOM = parseVNode(vnode)
    this._parent.replaceChild(realDOM, document.getElementById('root'))
  }
}