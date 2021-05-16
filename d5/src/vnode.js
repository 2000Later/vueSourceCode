class Vnode {
  constructor(tag,type,data,value) {
    this.tag = tag && tag.toLowerCase();
    this.type = type;
    this.data = data;
    this.value = value
    this.children = []
  }
  appendChild(vnode) {
    this.children.push(vnode)
  }
}