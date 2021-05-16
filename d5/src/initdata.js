let ARRAY_METHOD = [
  "push",
  "pop",
  "shift",
  "unshift",
  "reverse",
  "sotr",
  "splice",
];

let array_methods = Object.create(Array.prototype);

ARRAY_METHOD.forEach((method) => {
  array_methods[method] = function () {
    // 将数组进行响应式化
    for(let i = 0;i<arguments.length;i++) {
      reactive(arguments[i])
    }
    return Array.prototype[method].apply(this, arguments);
  };
});

function defineReactive(target,key,value,enumerable) {
  // console.log(target);
  if(typeof value === 'object' && value!=null &&!Array.isArray(value)) {
    reactive(value,this)
  }else {
    Object.defineProperty(target,key,{
      configurable: true,
      enumerable,
      set: (newVal) => {
        if(typeof newVal === 'object' && newVal!=null) {
          reactive(newVal,this)
        }
        value = newVal;
        typeof this.mountComponent === 'function' && this.mountComponent()
        /*
          临时：数组现在没有参与页面的渲染
          所以在数组上进行响应式的处理，不需要页面的刷新
          那么 即使 这里无法调用 也没又关系
        */
      },
      get() {
        console.log(`获取${value}`);
        return value
      }
    })
  }
}
// 响应式化
function reactive(o, vm) {
  let keys = Object.keys(o);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let value = o[key];
    if (Array.isArray(value)) {
      for (let j = 0; j < value.length; j++) {
        value.__proto__ = array_methods;
        reactive(value[j], vm);
      }
    } else {
      defineReactive.call(vm, o, key, value, true);
    }
  }
}

/**
 * 将某个对象的属性 访问 映射到 对象的某个属性成员上  
 * @param {object} target 
 * @param {string} prop 
 * @param {string} key 
 */
function proxy(target,prop,key) {
  Object.defineProperty(target,key,{
    configurable: true,
    enumerable: true,
    get() {
      return target[prop][key]
    },
    set(newVal) {
      target[prop][key] = newVal
    }
  })
}
