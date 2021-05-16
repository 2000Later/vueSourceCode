/**
 * 获取虚拟DOM
 * @param {HTMLElement} node
 * @returns Vnode
 */
function getVnode(node) {
  let type = node.nodeType, _vnode = null;
  if (type === 1) {
    let tag = node.nodeName;
    let attr = node.attributes;
    let attrObj = {};
    for (let i = 0; i < attr.length; i++) {
      attrObj[attr[i].nodeName] = attr[i].nodeValue;
    }
    _vnode = new VNode(tag, type, attrObj, undefined);
    node.childNodes.forEach(subnode => void _vnode.appendChild(getVnode(subnode)));
  } else if (type === 3) {
    _vnode = new VNode(undefined, type, undefined, node.nodeValue);
  }
  return _vnode;
}
let vnode = getVnode(document.querySelector('#root'))
/**
 * 将虚拟DOM转换为真实的DOM
 * @param {Vnode} vnode 
 * @returns HTMLElement
 */
function parseVNode(vnode) {
  let {type,tag,data,value,children} = vnode;
  if(type===1) {
    let _node = document.createElement(tag);
    Object.keys(data).forEach(key => {
      _node.setAttribute(key,data[key])
    })
    children.forEach(subVnode => {
      _node.appendChild(parseVNode(subVnode))
    })
    return _node
  }else if(type===3) {
    return document.createTextNode(value)
  }
}

/**
 * 根据路径读取数据 
 * @param {object} o 
 * @param {string} path 
 * @returns 
 */
function getValueByPaths(o,path) {
  let paths = path.split('.');
  let res = o;
  let prop;
  while(prop = paths.shift()) {
    res = res[prop];
  }
  return res
}

let brackets = /\{\{(.+?)\}\}/g;

function combine(vnode,data) {
  let {type,value,data:_data} = vnode;
  let _vnode = null;
  if(type===1) {
    let {tag,children} = vnode;
    _vnode = new VNode(tag,type,_data,undefined);
    children.forEach(subVnode => void _vnode.appendChild(combine(subVnode,data)));
  }else if(type===3) {
    value = value.replace(brackets,(_,g) =>  getValueByPaths(data,g));
    _vnode = new VNode(undefined,type,undefined,value);
  }
  return _vnode
}
let data2 = {
  name: "张三",
  age: 18,
  interest: {
    play: "打游戏",
    eat: "吃饭",
    sing: "唱歌",
  },
  company: [
    { name: "京东", animal: "狗" },
    { name: "阿里", animal: "猫" },
    { name: "百度", animal: "熊" },
  ],
};
// console.log(getVnode(document.querySelector('#root')));
// console.log(combine(vnode,data2));
