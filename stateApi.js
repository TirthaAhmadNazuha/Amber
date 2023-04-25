import State from './component/fragmentComponent/states/state';
import typeChecker from './typeChecker';

export const ChildState = (newValue, isState, user) => {
  const newChild = typeChecker(newValue);
  if (user.element instanceof Array) {
    user.element[user.element.findIndex((c) => c?.parentElement)]
      .replaceWith(...(newChild instanceof Array ? newChild : [newChild]));
    user.element.forEach((c) => c.remove());
  } else if (user.element?.elem) {
    user.element.elem[user.element.elem.findIndex((c) => c?.parentElement)]
      .replaceWith(...(newChild instanceof Array ? newChild : [newChild]));
    user.element.elem.forEach((c) => c.remove());
  } else {
    user.element.replaceWith(...(newChild instanceof Array ? newChild : [newChild]));
  }
  user.element = newChild;
  isState.state = newChild;
  isState.value = newValue;
  isState.changedCallback();
};

export const SetAttribute = {
  object(value, key, elem) {
    Object.keys(value).forEach((property) => {
      try {
        if (value[property] instanceof State) {
          elem[key][property] = value[property].val;
          value[property].setUser({
            apiKey: 'AttributeStateObject',
            arg: [key, elem, property],
          });
        } else {
          elem[key][property] = value[property];
        }
      } catch (err) {
        elem[key] = {};
        elem[key][property] = value[property];
      }
    });
  },
  array(value, key, elem) {
    const isString = value.filter((val) => typeof val === 'string').length === value.length;
    if (isString) {
      this.any(value.toString().replaceAll(',', ' '), key, elem);
    } else {
      elem[key] = value;
    }
  },
  function(value, key, elem) {
    if (key.startsWith('on') && key.charAt(2).toUpperCase() === key.charAt(2)) {
      elem.addEventListener(key.slice(2).toLowerCase(), (e) => value(e, elem));
    } else if (key === 'then') {
      value(elem);
    } else {
      elem.key = value();
    }
  },
  any(value, key, elem) {
    key = key === 'className' ? 'class' : key;
    elem.setAttribute(key, value);
  },
};

export const AttributeState = (value, state, user, key) => {
  SetAttribute.element = user.element;
  if (value instanceof Array) {
    SetAttribute.array(value, key);
  } else if (typeof value === 'function') {
    SetAttribute.function(value, key);
  } else if (value instanceof Object) {
    SetAttribute.object(value, key);
  } else {
    SetAttribute.any(value, key);
  }
  state.state = value;
  state.changedCallback();
};

const AttributeStateObject = (value, state, _, key, element, property) => {
  element[key][property] = value;
  state.state = value;
  state.changedCallback();
};

const stateApi = {
  ChildState,
  SetAttribute,
  AttributeState,
  AttributeStateObject,
};
export default stateApi;
