/* eslint-disable consistent-return */
import { BaseComponent } from '.';

export const isIterable = (any) => {
  if (any === undefined || any == null) return false;

  try {
    if (typeof any[Symbol.iterator] === 'function') return true;
    return false;
  } catch (_) {
    return false;
  }
};

const typeChecker = (item) => {
  if (item === undefined || item == null) return;
  if (item instanceof Node && item?.stateValue === undefined) {
    return item;
  }
  if (item.constructor.name === 'State' || item?.stateValue !== undefined || item.constructor.name === 'LengthState') {
    const result = typeChecker(item.stateValue);
    try {
      if (result?.onConnected) {
        result.setStateUser = () => {
          item.setUser({
            apiKey: 'ChildState',
            arg: [result],
          });
        };
      } else {
        setTimeout(() => {
          item.setUser({
            apiKey: 'ChildState',
            arg: [result],
          });
        });
      }
    } catch (err) {
      throw new Error('Cant set user in typeChecker');
    }
    return result;
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
  if (isIterable(item)) {
    const result = new Set();
    item.forEach((val) => {
      result.add(typeChecker(val));
    });
    return result;
  }
  throw new Error('typeChecker can not find type!');
};

export default typeChecker;
