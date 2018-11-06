import _ from './util'

class Element {
  constructor(tagName, props, children) {
    if (_.isArray(props)) {
      [ children, props ] = [ props, {} ];
    }
    if (!_.isArray(children) && children !== null) {
      children = _.slice(arguments, 2).filter(_.truth)
    }
    this.tagName = tagName
    this.props = props
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
    const props = this.props

    for (const propName in props) {
      const propValue = props[propName]
      _.setAttr(el, propName, propValue)
    }

    _.each(this.children, (child) => {
      const childEl = child instanceof Element ? child.render() : document.createTextNode(child)
      el.appendChild(childEl)
    })

    return el
  }
}


export default (tagName, props = {}, children = []) => {
  return new Element(tagName, props, children)
}
