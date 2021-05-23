let ARRAY_METHOD = [
  "push",
  "pop",
  "shift",
  "unshift",
  "reverse",
  "sort",
  "splice",
];

let array_methods = Object.create(Array.prototype);

ARRAY_METHOD.forEach((method) => {
  array_methods[method] = function () {
    for (let i = 0; i < arguments.length; i++) {
      observe(arguments[i]);
    }
    return Array.prototype[method].apply(this, arguments);
  };
});

function defineReactive(target, key, value, enumerable) {
  if (typeof value === "object" && value !== null) {
    observe(value, this);
  } else {
    let dep = new Dep();
    dep.__propName = key;
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable,
      get() {
        // console.log(`获取${key}值为: ${value}`);
        // 依赖收集 (收集模板中使用了的数据)
        dep.depend()
        return value;
      },
      set: (newVal) => {
        // console.log(`设置${key}值为: ${newVal}`);
        if(newVal === value) return;
        if (typeof newVal === "object" && newVal !== null) {
          observe(newVal, this);
        }
        value = newVal;
        // 派发更新，找到全局的watcher，调用update
        dep.notify()
      },
    });
  }
}

function observe(obj, vm) {
  if (Array.isArray(obj)) {
    obj.__proto__ = array_methods;
    for (let i = 0; i < obj.length; i++) {
      observe(obj[i], vm);
    }
  } else {
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      let prop = keys[i];
      defineReactive.call(vm, obj, prop, obj[prop], true);
    }
  }
}

// 映射属性
function proxy(target, prop, key) {
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: true,
    get() {
      return target[prop][key];
    },
    set(newVal) {
      target[prop][key] = newVal;
    },
  });
}
