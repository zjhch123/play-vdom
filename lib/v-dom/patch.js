import _ from './util'

const REPLACE = 0
const REORDER = 1
const PROPS = 2
const TEXT = 3

function patch (node, patches) {
  const walker = { index: 0 }
  dfsWalk(node, walker, patches)
}

function dfsWalk(node, walker, patches) {
  const currentPatches = patches[walker.index]

  const len = node.childNodes
    ? node.childNodes.length
    : 0
  for (let i = 0; i < len; i++) {
    const child = node.childNodes[i]
    walker.index++
    dfsWalk(child, walker, patches)
  }

  if (currentPatches) {
    applyPatches(node, currentPatches)
  }
}

function applyPatches(node, currentPatches) {
  _.each(currentPatches, function(currentPatch) {
    switch (currentPatch.type) {
      case REPLACE:
        const newNode = (typeof currentPatch.node === 'string')
          ? document.createTextNode(currentPatch.node)
          : currentPatch.node.render()
        node.parentNode.replaceChild(newNode, node)
        break
      case REORDER:
        reorderChildren(node, currentPatch.moves)
        break
      case PROPS:
        setProps(node, currentPatch.props)
        break
      case TEXT:
        if (node.textContent) {
          node.textContent = currentPatch.content
        } else {
          // 这是兼容性处理嘛？
          node.nodeValue = currentPatch.content
        }
        break
      default:
        throw new Error('Unknown patch type ' + currentPatch.type)
    }
  })
}

function setProps(node, props) {
  for (let key in props) {
    if (typeof props[key] === 'undefined') {
      node.removeAttribute(key)
    } else {
      const value = props[key]
      _.setAttr(node, key, value)
    }
  }
}

function reorderChildren(node, moves) {
  const staticNodeList = _.toArray(node.childNodes)
  const maps = {}

  _.each(staticNodeList, (node) => {
    if (node.nodeType === 1) { // nodeType: 1代表element, 2代表属性, 3代表内容
      const key = node.getAttribute('key')
      if (key) {
        maps[key] = node
      }
    }
  })

  _.each(moves, (move) => {
    const index = move.index
    switch (move.type) {
      case 0: // remove
        if (staticNodeList[index] === node.childNodes[index]) {
          node.removeChild(node.childNodes[index])
        }
        staticNodeList.splice(index, 1)
        break
      case 1: // insert
        const insertNode = maps[move.item.key]
          ? maps[move.item.key].cloneNode(true)
          : (typeof move.item === 'object')
            ? move.item.render()
            : document.createTextNode(move.item)
        staticNodeList.splice(index, 0, insertNode)
        node.insertBefore(insertNode, node.childNodes[index] || null)
        break
    }
  })
}

patch.REORDER = REORDER
patch.REPLACE = REPLACE
patch.PROPS = PROPS
patch.TEXT = TEXT

export default patch