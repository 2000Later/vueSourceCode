/**
 * 获取虚拟DOM
 * @param {HTMLElement} node 
 * @returns Vnode
 */
function getVnode(node) {
  let type = node.nodeType;
  let _vnode = null;
  if (type === 1) {
    // dom节点
    let tag = node.nodeName;
    let attr = node.attributes;
    let attrObj = {};
    for (let { nodeName, nodeValue } of attr) {
      // 遍历属性的值，并解构赋值出里面的属性
      attrObj[nodeName] = nodeValue;
    }
    _vnode = new Vnode(tag, type, attrObj, undefined);
    node.childNodes.forEach(
      (subNode) => void _vnode.appendChild(getVnode(subNode))
    );
  } else if (type == 3) {
    // 文本节点
    _vnode = new Vnode(undefined, type, undefined, node.nodeValue);
  }
  return _vnode;
}

let vnode = getVnode(document.querySelector("#root"));

/**
 * 将虚拟DOM转换为真实的DOM
 * @param {Vnode} vnode 
 * @returns HTMLElement
 */
function parseVNode(vnode) {
  let { type } = vnode;
  if (type === 1) {
    let { tag, data, children } = vnode;
    let _node = document.createElement(tag);
    for (const key in data) {
      // 设置属性
      _node.setAttribute(key, data[key]);
    }
    // 遍历子节点并递归追加
    children.forEach((subVode) => void _node.appendChild(parseVNode(subVode)));
    return _node;
  } else if (type === 3) {
    // 文本属性
    return document.createTextNode(vnode.value);
  }
}
let node = parseVNode(vnode);

let brackets = /\{\{([\s\S]+?)\}\}/g;

/**
 * 根据路径读取数据 
 * @param {object} o 
 * @param {string} path 
 * @returns 
 */
function getValueByPaths(o, path) {
  let paths = path.split(".");
  return paths.reduce((pre, current) => pre ? pre = pre[current] : pre = o[current],null);
}

/**
 * 将数据与虚拟DOM结合，替换真实的值
 * @param {object} data 
 * @param {Vnode} vnode 
 * @returns Vnode
 */
function combine(vnode,data) {
  let {tag,type,data:_data,value,children} = vnode;
  let _vnode;
  if(type===1) {
    _vnode = new Vnode(tag,type,_data,undefined)
    children.forEach(subVNode => {
      _vnode.appendChild(combine(subVNode,data))
    })
  }else if(type===3) {
    value = value.replace(brackets,(_,g) => getValueByPaths(data,g))
    _vnode = new Vnode(undefined,type,undefined,value)
  }
  return _vnode
}
