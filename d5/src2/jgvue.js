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
    observe(this._data,this);
    // 将_data中所有属性代理在当前实例中
    for (let key in this._data) {
      proxy(this,'_data',key)
    }
  }
  mount() {
    this.render = this.createRenderFn()
    this.mountComponent()
  }
  createRenderFn() {
    let ast = getVnode(this._template);
    return function render() {
      return combine(ast,this._data);
    }
  }
  mountComponent() {
    let mount = () => {
      this.update(this.render())
    };
    mount();
  }
  update(vnode) {
    let realDOM = parseVNode(vnode);
    this._parent.replaceChild(realDOM,document.querySelector('#root'));
  }
}