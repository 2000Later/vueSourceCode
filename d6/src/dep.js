let depid = 0;

class Dep {
  constructor() {
    this.id = depid++;
    this.subs = [];
  }
  // 添加一个watcher
  addSub(sub) {
    this.subs.push(sub);
  }
  // 移除
  removeSub(sub) {
    for (let i = this.subs.length - 1; i >= 0; i--) {
      if(sub===this.subs[i]) {
        this.subs.splice(i,1)
      }
    }
  }
  depend() {
    if (Dep.target) {
      this.addSub(Dep.target); // 将当前的watcher关联到dep上
      Dep.target.addDep(this); // 将当前的 dep 与 当前渲染 watcher 关联起来
    }
  }
  notify() {
    let deps = this.subs.slice();
    deps.forEach(watcher => {
      watcher.update()
    })
  }
}
// 全局的容器存储渲染 Watcher
Dep.target = null;

let targetStack = [];
// 将当前的操作watcher 存储到全局的 watcher中, 参数target就是当前 watcher
function pushTarget(target) {
  targetStack.unshift(Dep.target); // vue源码使用的是push
  Dep.target = target;
}

// 将当前的watcher移除
function popTarget() {
  Dep.target = targetStack.shift(); // 移除到最后是undefined
}

/**
 * 在watcher调用get方法的时候，调用pushTarget(this)
 * 在watcher的get方法结束的时候，调用popTarget()
 */
