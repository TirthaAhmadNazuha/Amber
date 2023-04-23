/* eslint-disable new-cap */
/* eslint-disable no-param-reassign */
import BaseComponent from './component/base';

export const ElementChild = (newState, isState, user) => {
  if (user.element?.elem instanceof HTMLElement) {
    if (newState instanceof BaseComponent) {
      try {
        user.element.elem.replaceWith(new newState().create());
      } catch (err) {
        try {
          user.element.elem.replaceWith(newState.create());
        } catch (er) {
          user.element.elem.replaceWith(newState());
        }
      }
    } else if (newState instanceof Array) {
      user.element.elem.replaceWith(...newState);
    } else if (typeof newState === 'function') {
      user.element.elem.replaceWith(newState());
    } else {
      user.element.elem.replaceWith(newState);
    }
    isState.state = newState;
    return;
  }
  if (user.element?.elem instanceof Array) {
    if (newState instanceof BaseComponent) {
      try {
        user.element.elem[0].insertAdjacentElement('beforebegin', new newState().create());
        user.element.elem.forEach((c) => c?.remove());
      } catch (err) {
        try {
          user.element.elem[0].insertAdjacentElement('beforebegin', newState.create());
          user.element.elem.forEach((c) => c?.remove());
        } catch (er) {
          user.element.elem[0].insertAdjacentElement('beforebegin', newState());
          user.element.elem.forEach((c) => c?.remove());
        }
      }
    } else if (newState instanceof Array) {
      user.element.elem[0].insertAdjacentElement('beforebegin', ...newState);
      user.element.elem.forEach((c) => c?.remove());
    } else if (typeof newState === 'function') {
      user.element.elem[0].insertAdjacentElement('beforebegin', newState());
      user.element.elem.forEach((c) => c?.remove());
    } else {
      user.element.elem[0].insertAdjacentElement('beforebegin', newState);
      user.element.elem.forEach((c) => c?.remove());
    }
    isState.state = newState;
    return;
  }
  if (newState instanceof BaseComponent) {
    try {
      user.element.replaceWith(new newState().create());
    } catch (err) {
      try {
        user.element.replaceWith(newState.create());
      } catch (er) {
        user.element.replaceWith(newState());
      }
    }
  } else if (newState instanceof Array) {
    user.element.replaceWith(...newState);
  } else if (typeof newState === 'function') {
    user.element.replaceWith(newState());
  } else {
    user.element.replaceWith(newState);
  }
  isState.state = newState;
};

/** @param {{parent: HTMLElement, element: (Element|Text)}} user */
export const ArrayChild = (newState, isState, user) => {
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
};

export const TextChild = (newState, isState, user) => {
  user.element.data = newState;
  isState.state = newState;
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

export const AttributeState = (value, state, key, element) => {
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
};

const stateApi = {
  ElementChild,
  ArrayChild,
  TextChild,
  SetAttribute,
  AttributeState,
};
export default stateApi;
