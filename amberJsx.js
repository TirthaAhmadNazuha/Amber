/* eslint-disable import/no-cycle */
import BaseComponent from './component/base';
import State from './component/fragmentComponent/states/state';
import { SetAttribute } from './stateApi';

const tasks = [
  (element, childs) => {
    childs.forEach((child) => {
      if (child === undefined) return;
      if (child instanceof HTMLElement) {
        element.append(child);
      } else if (child instanceof Array) {
        element.append(...child);
      } else if (child instanceof Text) {
        element.append(child);
      } else if (child instanceof State) {
        if (child.state instanceof HTMLElement) {
          element.append(child.state);
          child.setUser({
            apiKey: 'ElementChild',
            parent: element,
            element: child.state,
          });
        } else if (child.state instanceof Array) {
          child.state.forEach((state) => {
            if (typeof state === 'string') {
              element.append(state);
            } else if (state instanceof BaseComponent) {
              if (state.create() instanceof Array) {
                element.append(...state.create());
              } else element.append(state.create());
            } else if (typeof state === 'function') {
              if (state() instanceof Array) {
                element.append(...state());
              } else element.append(state());
            } else if (state instanceof HTMLElement) {
              throw Error('Don\'t returned HTMLElement, do function return JSX like this: "() => <tag>"');
            }
          });
          child.setUser({
            apiKey: 'ArrayChild',
            parent: element,
            element: child.state,
          });
        } else if (typeof child.state === 'function') {
          try {
            element.append(child.state());
          } catch (err) {
            // eslint-disable-next-line new-cap
            element.append(new child.state().create());
          }
        } else {
          let TextChild;
          if (child.state instanceof Text) {
            element.append(child.state);
            child.setUser({
              apiKey: 'TextChild',
              parent: element,
              element: TextChild,
            });
          } else {
            TextChild = document.createTextNode(child.state);
            element.append(TextChild);
          }
          child.setUser({
            apiKey: 'TextChild',
            parent: element,
            element: TextChild,
          });
        }
      } else {
        element.insertAdjacentText('beforeend', child);
      }
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
            arg: [key, element],
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
  Fragment(_, childs) {
    return childs;
  },
  createElement(tag, attr, ...childs) {
    if (typeof tag === 'function') {
      try {
        return tag(attr, childs);
      } catch (err) {
        // eslint-disable-next-line new-cap
        return new tag(attr, childs).create();
      }
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
