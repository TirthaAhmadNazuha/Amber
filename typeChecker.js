/* eslint-disable consistent-return */
import { BaseComponent } from '.'
import CreateState from './api/createState'

export const isIterable = (any) => {
  if (any === undefined || any == null) return false

  try {
    if (typeof any[Symbol.iterator] === 'function') return true
    return false
  } catch (_) {
    return false
  }
}

const typeChecker = (item) => {
  if (item === undefined || item == null) return ''
  if (item instanceof CreateState) {
    const result = typeChecker(item.value)
    item.subcribe(isIterable(result) ? result : [result], 'children')
    return result
  }
  if (item instanceof Node) {
    return item
  }
  if (item instanceof BaseComponent) {
    return item.create()
  }
  if (item instanceof Array) {
    return [].concat(...item).map(typeChecker)
  }
  if (typeof item === 'string' || typeof item === 'number') {
    return new Text(item)
  }
  if (typeof item === 'function') {
    if (Function.prototype.toString.call(item).startsWith('class')) {
      if (item.prototype instanceof BaseComponent) {
        return new item().create()
      } else throw new TypeError('JSX Element type class must instanceof BaseComponent')
    } else {
      return item()
    }
  }
  if (item instanceof Promise) {
    const pendingElement = typeChecker(item?.onPending) || new Text('')
    const rejectElement = typeChecker(item?.onReject)
    item.then((response) => {
      const childResult = item.childs.map((ch) => {
        if (typeof ch === 'function') {
          return typeChecker(ch(response))
        }
        return typeChecker(ch)
      })

      pendingElement.replaceWith(...[].concat(...childResult))
    })
      .catch((err) => {
        if (rejectElement) {
          pendingElement
            .replaceWith(...(isIterable(rejectElement) ? rejectElement : [rejectElement]))
        }
        throw new Error(err)
      })
    return pendingElement
  }
  if (isIterable(item)) {
    const result = new Set()
    item.forEach((val) => {
      result.add(typeChecker(val))
    })
    return result
  }
  if (typeof item === 'boolean') {
    return ''
  }
  throw new Error('typeChecker can not find type!')
}

export default typeChecker
