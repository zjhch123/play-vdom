import _ from './util'

class Element {
  constructor(tagName, props, ...children) {
    this.tagName = tagName
    this.props = props === null ? {} : props
    this.children = children
    this.key = this.props.key

    this.count = 0

    _.each(this.children, (item, index) => {
      if (item instanceof Element) {
        this.count += item.count
      } else {
        this.children[index] = '' + item
      }
      this.count += 1
    })
  }

  render() {
    const el = document.createElement(this.tagName)
    const fragment = document.createDocumentFragment()
    const props = this.props

    for (const propName in props) {
      const propValue = props[propName]
      _.setAttr(el, propName, propValue)
    }

    _.each(this.children, (child) => {
      const childEl = child instanceof Element ? child.render() : document.createTextNode(child)
      fragment.appendChild(childEl)
    })

    el.appendChild(fragment)
    return el
  }
}

// 数组扁平化操作
const flatten = (arr) => {
  return arr.reduce((a, b) => {
    if (_.isArray(b)) {
      a = a.concat(flatten(b))
    } else {
      a = a.concat(b)
    }
    return a
  }, [])
}

export default (tagName, props, ...children) => {
  if (_.isArray(children)) {
    children = flatten(children)
  }
  return new Element(tagName, props, ...children)
}
