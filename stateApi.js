/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import { BaseComponent } from '.';

const ElementChild = (newState, isState, user) => {
  user.element.replaceWith(newState);
  isState.state = newState;
  isState.value = newState;
};

/** @param {{parent: HTMLElement, element: (Element|Text)}} user */
const ArrayChild = (newState, isState, user) => {
  user.parent.replaceChildren();
  const preState = [];
  newState.forEach((newItem) => {
    if (newItem instanceof BaseComponent) {
      user.parent.append(newItem.create());
      if (newItem instanceof Array) {
        preState.push(...newItem.element);
      } else {
        preState.push(newItem.element);
      }
    } else if (typeof newItem === 'function') {
      const elem = newItem();
      user.parent.append(elem);
      preState.push(elem);
    } else {
      preState.push(newItem);
      user.parent.append(newItem);
    }
  });
  isState.state = preState;
  isState.value = preState;
};

const TextChild = (newState, isState, user) => {
  user.element.data = newState;
  isState.state = newState;
  isState.value = newState;
};

export const SetAttribute = {
  object(value, key, elem) {
    Object.keys(value).forEach((property) => {
      try {
        elem[key][property] = value[property];
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
    }
  },
  any(value, key, elem) {
    key = key === 'className' ? 'class' : key;
    elem.setAttribute(key, value);
  },
};

const AttributeState = (value, state, key, element) => {
  SetAttribute.element = element;
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
  state.value = value;
};

const stateApi = {
  ElementChild,
  ArrayChild,
  TextChild,
  SetAttribute,
  AttributeState,
};
export default stateApi;
