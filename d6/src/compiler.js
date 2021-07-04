

let brackets = /\{\{([\s\S]+?)\}\}/g
/**
 * 获取虚拟DOM
 * @param {HTMLElement} node 
 * @returns Vnode
 */
function getVNode(node) {
  let type = node.nodeType;
  let _vnode = null;
  if(type === 1) {
    let tag = node.nodeName;
    let attr = node.attributes;
    let attrObj = {};
    for({nodeName,nodeValue} of attr) {
      attrObj[nodeName] = nodeValue
    }
    _vnode = new Vnode(tag,type,attrObj,undefined)
    node.childNodes.forEach(subnode => void _vnode.appendChild(getVNode(subnode)))
  }else if(type === 3) {
    _vnode = new Vnode(undefined,type,undefined,node.nodeValue)
  }
  return _vnode
}

function parseVNode(vnode) {
  let {type,tag,data,value,children} = vnode;
  let _node = null;
  if(type===1) {
    _node = document.createElement(tag);
    for(let attr in data){
      _node.setAttribute(attr,data[attr]);
    }
    children.forEach(subvnode => void _node.appendChild(parseVNode(subvnode)));
    return _node
  }else if(type===3) {
    return document.createTextNode(value);
  }
}

function getValueByPaths(o,path) {
  let paths = path.split('.');
  let res = o;
  let prop;
  while(prop = paths.shift()) {
    res = res[prop] // 这里获取到了响应式的数据会触发get
  }
  console.log('读取', res);
  return res;
}
/**
 * 
 * @param {Vnode} vnode 
 * @param {object} data
 * @returns 返回替换数据的虚拟DOM
 */
function combine(vnode,data) {
  let {type,tag,data: _data,value,children} = vnode;
  let _vnode = null;
  if(type===1) {
    _vnode = new Vnode(tag,type,_data,undefined)
    children.forEach(subvnode => void _vnode.appendChild(combine(subvnode,data)))
  }else if(type===3) {
    value = value.replace(brackets,(_,g) => getValueByPaths(data,g))
    _vnode = new Vnode(undefined,type,undefined,value)
  }
  return _vnode
}
