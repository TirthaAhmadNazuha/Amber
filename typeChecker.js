/* eslint-disable consistent-return */
/* eslint-disable new-cap */
import { BaseComponent } from '.';
import State from './component/fragmentComponent/states/state';

const typeChecker = (item) => {
  if (item === undefined || item == null) return;
  if (item instanceof HTMLElement) {
    return item;
  }
  if (item instanceof State) {
    const result = typeChecker(item.value);
    try {
      if (result?.onConnected) {
        result.setStateUser = () => {
          item.setUser({
            apiKey: 'ChildState',
            element: result,
          });
        };
      } else {
        setTimeout(() => {
          item.setUser({
            apiKey: 'ChildState',
            element: result,
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
  if (item instanceof Text) {
    return item;
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
  throw new Error('typeChecker can not find type!');
};

export default typeChecker;
