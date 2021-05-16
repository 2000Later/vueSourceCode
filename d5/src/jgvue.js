class JGVue {
  constructor(options) {
    this._data = options.data;
    let elm = document.querySelector(options.el);
    this._template = elm;
    this._parent = elm.parentNode;
    this.initData(); // 将 data进行响应式转换，进行代理
    this.mount(); // 挂载
  }
  initData() {
    let keys = Object.keys(this._data);
    reactive(this._data, this);
    for (let i = 0; i < keys.length; i++) {
      // 将this._data[keys[i]] 映射到 this[keys[i]] 上
      proxy(this, "_data", keys[i]);
    }
  }
  mount() {
    this.render = this.createRenderFn();
    this.mountComponent();
  }
  // 将模板数据虚拟DOM替换真实数据的虚拟DOM
  createRenderFn() {
    let ast = getVnode(this._template);
    return function render() {
      return combine(ast, this._data);
    };
  }
  // 挂载组件
  mountComponent() {
    let mount = () => {
      this.update(this.render());
    };
    mount();
  }
  // 根据新的虚拟DOM生成真实DOM，替换页面元素
  update(vnode) {
    let realDOM = parseVNode(vnode);
    this._parent.replaceChild(realDOM, document.querySelector("#root"));
  }
}
