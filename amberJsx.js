import { BaseComponent } from '.'
import attrChecker from './attrChecker'
import typeChecker, { isIterable } from './typeChecker'

const tasks = [
  (element, childs) => {
    childs.forEach((child) => {
      const childResult = typeChecker(child)
      element.append(...(isIterable(childResult) ? childResult : [childResult]))
    })
    return element
  },

  (element, attr) => {
    if (attr instanceof Object) {
      Object.keys(attr).forEach((key) => {
        attrChecker(attr[key], key, element)
      })
    }
    return element
  },
]

const AmberJsx = {
  Fragment(childs) {
    const result = []
    childs.forEach((child) => {
      const item = typeChecker(child)
      result.push(...(item instanceof Array ? item : [item]))
    })
    return result
  },
  createElement(tag, attr, ...childs) {
    if (typeof tag === 'function') {
      if (Function.prototype.toString.call(tag).startsWith('class')) {
        if (tag.prototype.create) {
          return new tag(attr, childs).create()
        } else throw new TypeError('JSX Element type class must have create method and return element html')
      } else {
        if (tag?.name === 'Fragment') {
          return tag(childs)
        }
        return tag(attr, childs)
      }
    }
    if (tag instanceof BaseComponent) {
      if (attr !== null) {
        Object.keys(attr).forEach((key) => {
          tag.props[key] = attr[key]
          tag.childs = childs
        })
      }
      return tag.create()
    }

    const param = [childs, attr]
    let element = document.createElement(tag)

    tasks.forEach((task, i) => {
      element = task(element, param[i])
    })
    return element
  },
}

export default AmberJsx
