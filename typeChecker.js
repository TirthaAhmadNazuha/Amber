/* eslint-disable consistent-return */
import { BaseComponent } from '.';
import CreateState from './api/createState';

export const isIterable = (any) => {
  if (any === undefined || any == null) return false;

  try {
    if (typeof any[Symbol.iterator] === 'function') return true;
    return false;
  } catch (_) {
    return false;
  }
};

const HandlerState = class {
  constructor() {
    this.users = [];
    this.createState = null;
    setTimeout(() => {
      if (this.createState == null) return;
      this.subcribing();
    }, 50);
  }

  add(node) {
    if (this.users.find((n) => n === node)) return;
    this.users.push(node);
  }

  subcribing() {
    this.createState.subcribe(this.users, 'children');
  }
};
const typeChecker = (item) => {
  const handlerState = new HandlerState();
  if (item === undefined || item == null) return '';
  if (item instanceof CreateState) {
    handlerState.createState = item;
    const result = typeChecker(item.value);
    handlerState.add(result);
    return result;
  }
  if (item instanceof Node) {
    return item;
  }
  if (item instanceof BaseComponent) {
    return item.create();
  }
  if (item instanceof Array) {
    return item.map(typeChecker);
  }
  if (typeof item === 'string' || typeof item === 'number') {
    return new Text(item);
  }
  if (typeof item === 'function') {
    try {
      return typeChecker(item());
    } catch (_) {
      return new item().create();
    }
  }
  if (item instanceof Promise) {
    const pendingElement = typeChecker(item?.onPending) || new Text('');
    const rejectElement = typeChecker(item?.onReject);
    item.then((response) => {
      const childResult = item.childs.map((ch) => {
        if (typeof ch === 'function') {
          return typeChecker(ch(response));
        }
        return typeChecker(ch);
      });

      pendingElement.replaceWith(...childResult);
    })
      .catch((err) => {
        if (rejectElement) {
          pendingElement
            .replaceWith(...(isIterable(rejectElement) ? rejectElement : [rejectElement]));
        }
        throw new Error(err);
      });
    return pendingElement;
  }
  if (isIterable(item)) {
    const result = new Set();
    item.forEach((val) => {
      result.add(typeChecker(val));
    });
    return result;
  }
  if (typeof item === 'boolean') {
    return '';
  }
  throw new Error('typeChecker can not find type!');
};

export default typeChecker;
