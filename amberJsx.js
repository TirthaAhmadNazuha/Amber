import { BaseComponent } from '.';
import State from './component/fragmentComponent/states/state';
import { SetAttribute } from './stateApi';
import typeChecker from './typeChecker';

const tasks = [
  (element, childs) => {
    childs.forEach((child) => {
      const childResult = typeChecker(child);
      element.append(...(childResult instanceof Array ? childResult : [childResult]));
    });
    return element;
  },

  (element, attr) => {
    if (attr instanceof Object) {
      Object.keys(attr).forEach((key) => {
        if (attr[key] instanceof State) {
          const value = attr[key].state;
          if (value instanceof Array) {
            SetAttribute.array(value, key, element);
          } else if (typeof value === 'function') {
            SetAttribute.function(value, key, element);
          } else if (value instanceof Object) {
            SetAttribute.object(value, key, element);
          } else {
            SetAttribute.any(value, key, element);
          }
          attr[key].setUser({
            apiKey: 'AttributeState',
            element,
            arg: [key],
          });
        } else if (attr[key] instanceof Array) {
          SetAttribute.array(attr[key], key, element);
        } else if (typeof attr[key] === 'function') {
          SetAttribute.function(attr[key], key, element);
        } else if (attr[key] instanceof Object) {
          SetAttribute.object(attr[key], key, element);
        } else {
          SetAttribute.any(attr[key], key, element);
        }
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
          return new tag(attr, childs);
        }
      }
    }
    if (tag instanceof BaseComponent) {
      if (attr !== null) {
        Object.keys(attr).forEach((key) => {
          tag.props[key] = attr[key];
        });
      }
      return tag.create();
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
