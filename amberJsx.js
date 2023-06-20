import { BaseComponent } from '.';
import attrChecker from './attrChecker';
import typeChecker, { isIterable } from './typeChecker';

const tasks = [
  (element, childs) => {
    childs.forEach((child) => {
      const childResult = typeChecker(child);
      element.append(...(isIterable(childResult) ? childResult : [childResult]));
    });
    return element;
  },

  (element, attr) => {
    if (attr instanceof Object) {
      Object.keys(attr).forEach((key) => {
        attrChecker(attr[key], key, element);
      });
    }
    return element;
  },
];

const AmberJsx = {
  Fragment(childs) {
    const result = [];
    childs.forEach((child) => {
      const item = typeChecker(child);
      result.push(...(item instanceof Array ? item : [item]));
    });
    return result;
  },
  createElement(tag, attr, ...childs) {
    if (typeof tag === 'function') {
      try {
        return new tag(attr, childs).create();
      } catch (err) {
        if (tag?.name === 'Fragment') {
          return tag(childs);
        }
        try {
          return tag(attr, childs);
        } catch (_) {
          try {
            return new tag(attr, childs);
          } catch (e) {
            throw new Error('tag is not defined');
          }
        }
      }
    }
    if (tag instanceof BaseComponent) {
      if (attr !== null) {
        Object.keys(attr).forEach((key) => {
          tag.props[key] = attr[key];
          tag.childs = childs;
        });
      }
      return tag.create();
    }
    if (tag instanceof HTMLElement) {
      return tag;
    }

    const param = [childs, attr];
    let element = document.createElement(tag);

    tasks.forEach((task, i) => {
      element = task(element, param[i]);
    });
    return element;
  },
};

export default AmberJsx;
