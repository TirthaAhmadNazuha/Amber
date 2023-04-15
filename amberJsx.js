import { State } from './component/fragmentComponent/stateComponent';
import { SetAttribute } from './stateApi';

const tasks = [
  (element, childs) => {
    childs.forEach((child) => {
      if (child === undefined) return;
      if (child instanceof State) {
        if (child.state instanceof HTMLElement) {
          element.insertAdjacentElement('beforeend', child.state);
          child.setUser({
            apiKey: 'ElementChild',
          });
        } else if (child.state instanceof Array) {
          element.append(...child.state);
          child.setUser({
            apiKey: 'ArrayChild',
            arg: [element]
          });
        } else {
          const TextChild = document.createTextNode(child.state);
          element.append(TextChild);
          child.state = TextChild;
          child.setUser({
            apiKey: 'TextChild',
          });
        }
      } else if (child instanceof HTMLElement) {
        element.append(child);
      } else if (child instanceof Array) {
        element.append(...child);
      } else {
        element.insertAdjacentText('beforeend', child);
      }
    });
    return element;
  },

  (element, attr) => {
    if (attr instanceof Object) {
      SetAttribute.element = element;
      Object.keys(attr).forEach((key) => {
        if (attr[key] instanceof State) {
          const value = attr[key].state;
          if (value instanceof Array) {
            SetAttribute.array(value, key);
          } else if (typeof value === 'function') {
            SetAttribute.function(value, key);
          } else if (value instanceof Object) {
            SetAttribute.object(value, key);
          } else {
            SetAttribute.any(value, key);
          }
          attr[key].setUser({
            apiKey: 'AttributeState',
            arg: [key, element]
          });
          console.log(attr[key]);
        } else if (attr[key] instanceof Array) {
          console.log('array', attr[key], key);
          SetAttribute.array(attr[key], key);
        } else if (typeof attr[key] === 'function') {
          SetAttribute.function(attr[key], key);
        } else if (attr[key] instanceof Object) {
          SetAttribute.object(attr[key], key);
        } else {
          SetAttribute.any(attr[key], key);
        }
      });
    }
    return element;
  },
];

const AmberJsx = {
  Fragment(childs) {
    return childs;
  },
  createElement(tag, attr, ...childs) {
    if (tag.name === 'Fragment') {
      return tag(childs);
    } else if (typeof tag === 'function') {
      try {
        return tag(attr, childs);
      } catch (err) {
        return new tag(attr, childs).create();
      }
    };
    const param = [childs, attr];
    let element = document.createElement(tag);

    tasks.forEach((task, i) => {
      element = task(element, param[i]);
    });
    return element;
  }
};

export default AmberJsx;
