let ARRAY_METHOD = ['push','pop','shift','unshift','resever','splice'];

let array_methods = Object.create(Array.prototype);

ARRAY_METHOD.forEach(method => {
  array_methods[method] = function () {
    console.log(`调用的是拦截的${method}方法`);
    for(let i = 0;i<arguments.length;i++) {
      observe(arguments[i])
    }
    return Array.prototype[method].apply(this,arguments);
  }
})

function defineReactive(target,key,value,enumerable) {
  if(typeof value === 'object' && value!==null) {
    observe(value,this)
  }else {
    let dep = new Dep();
    
    Object.defineProperty(target,key,{
      configurable: true,
      enumerable,
      get() {
        return value
      },
      set: (newVal) => {
        if(typeof newVal === 'object' && newVal!==null) {
          observe(newVal,this)
        }
        console.log(`set:${key}: ${newVal}`);

        value = newVal;
        // 派发更新, 找到全局的 watcher, 调用 update
        dep.notify();
      }
    })
  }
}
/**
 * 将对象变成响应式
 * @param {object} obj 
 * @param {JGVue} vm 
 */
function observe(obj,vm) {
  if(Array.isArray(obj)) {
    obj.__proto__ = array_methods; // 数组中部分方法的响应式化
    for(let i = 0;i<obj.length;i++) {
      observe(obj[i],vm) // 递归处理数组的每一个元素
    }
  }else {
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      let prop = keys[i]; // 属性名
      defineReactive.call(vm,obj,prop,obj[prop],true)
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
      target[prop][key] = newVal;
    }
  })
}
