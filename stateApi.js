import attrChecker from './attrChecker';
import typeChecker, { isIterable } from './typeChecker';

export const ChildState = (newValue, user) => {
  const [element] = user.arg;
  if (newValue instanceof Array) {
    if (newValue.length === 0) newValue.push(new Text(''));
  }
  const newChild = typeChecker(newValue);
  if (element instanceof Array) {
    element[element.findIndex((c) => c?.parentElement)]
      .replaceWith(...(isIterable(newChild) ? newChild : [newChild]));
    element.forEach((c) => c.remove());
  } else if (element?.elem) {
    element.elem[element.elem.findIndex((c) => c?.parentElement)]
      .replaceWith(...(isIterable(newChild) ? newChild : [newChild]));
    element.elem.forEach((c) => c.remove());
  } else if (isIterable(element)) {
    element.forEach((c) => {
      if (c?.parentElement) {
        c.replaceWith(...(isIterable(newChild) ? newChild : [newChild]));
      }
    });
    element.forEach((c) => c.remove());
  } else {
    element?.replaceWith(...(isIterable(newChild) ? newChild : [newChild]));
  }
  user.arg[0] = newChild;
};

export const multilevelAttribute = (newValue, user, oldValue) => {
  const [key, element, replaceValue] = user.arg;
  if (oldValue.length === 0) {
    attrChecker(replaceValue + newValue, key, element);
  } else attrChecker(replaceValue.replace(oldValue, newValue), key, element);
};

export const attribute = (newValue, user) => {
  const [key, element] = user.arg;
  attrChecker(newValue, key, element);
};

const stateApi = {
  ChildState,
  multilevelAttribute,
  attribute,
};
export default stateApi;
