import _ from '../v-dom/util'

const getItemKey = (obj, key) => {
  if (!obj || !key) {
    return
  }
  return _.isFunction(key) ? key(obj) : obj[key]
}

const makeKeyIndexAndFree = (list, key) => {
  const keyIndex = {}
  const free = []
  for (let i = 0, l = list.length; i < l; i++) {
    const item = list[i]
    const itemKey = getItemKey(item, key)
    if (itemKey) {
      keyIndex[itemKey] = i
    } else {
      free.push(item)
    }
  }
  return {
    keyIndex,
    free
  }
}

const diff = (oldList, newList, key) => {
  const oldMap = makeKeyIndexAndFree(oldList, key)
  const newMap = makeKeyIndexAndFree(newList, key)

  const newFree = newMap.free

  const oldKeyIndex = oldMap.keyIndex
  const newKeyIndex = newMap.keyIndex

  const moves = []

  const children = []

  let i = 0
  let item, itemKey, freeIndex = 0

  while (i < oldList.length) {
    item = oldList[i]
    itemKey = getItemKey(item, key)

    if (itemKey) {
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        children.push(null)
      } else {
        const newItemIndex = newKeyIndex[itemKey]
        children.push(newList[newItemIndex])
      }
    } else {
      const freeItem = newFree[freeIndex++]
      children.push(freeItem || null)
    }

    i++
  }

  let simulateList = children.slice(0)


  // 移除老数组中存在但是新数组中不存在的项
  i = 0
  while (i < simulateList.length) {
    if (simulateList[i] === null) {
      remove(i)
      removeSimulate(i)
    } else {
      i++
    }
  }

  let j = i = 0

  // i指向新数组，j指向模拟数组
  while (i < newList.length) {
    item = newList[i]
    itemKey = getItemKey(item, key)

    const simulateItem = simulateList[j]
    const simulateItemKey = getItemKey(simulateItem, key)

    if (simulateItem) {
      if (itemKey === simulateItemKey) {
        j++
      } else {
        if (!oldKeyIndex.hasOwnProperty(itemKey)) {
          insert(i, item)
        } else {
          const nextItemKey = getItemKey(simulateItem[j + i], key)
          if (nextItemKey === itemKey) {
            remove(i)
            removeSimulate(j)
            j++
          } else {
            insert(i, item)
          }
        }
      }
    } else {
      insert(i, item)
    }

    i++
  }

  let k = simulateList.length - j

  while (j++ < simulateList.length) {
    k--
    remove(k + i)
  }


  function remove(index) {
    moves.push({
      index, type: 0
    })
  }

  function insert(index, item) {
    moves.push({
      index, type: 1, item
    })
  }

  function removeSimulate(index) {
    simulateList.splice(index, 1)
  }

  return {
    moves, 
    children
  }
}

export default diff