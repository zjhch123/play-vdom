const optc = (o) => Object.prototype.toString.call(o)

export default {
  isArray(o) {
    return optc(o) === '[object Array]'
  },
  isFunction(o) {
    return optc(o) === '[object Function]'
  },
  isString(o) {
    return optc(o) === '[object String]'
  },
  truth(o) {
    return !!o
  },
  slice(arrLike, n) {
    return Array.prototype.slice.call(arrLike, n)
  },
  each(arrLike, cb) {
    Array.prototype.forEach.call(arrLike, cb)
  },
  setAttr(el, propName, propValue) {
    switch (propName) {
      case 'style':
        el.style.cssText = propValue
        break
      case 'value':
        if (el.tagName === 'input' || el.tagName === 'textarea') {
          el.value = propValue
          break
        }
        el.setAttribute(propName, propValue)
        break
      default:
        el.setAttribute(propName, propValue)
        break
    }
  },
  toArray(arrLike) {
    return Array.prototype.slice.call(arrLike, 0)
  }
}