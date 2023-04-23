/* eslint-disable new-cap */
/* eslint-disable no-param-reassign */
import BaseComponent from './component/base';

export const ElementChild = (newState, isState, user) => {
  if (isState.state?.elem instanceof HTMLElement) {
    if (newState?.elem instanceof HTMLElement) {
      isState.state.elem.replaceWith(newState.elem);
    } else if (newState?.elem instanceof Array || newState instanceof Array) {
      isState.state.elem
        .replaceWith(...(newState?.elem || newState));
    } else if (newState instanceof HTMLElement || typeof newState === 'string') {
      isState.state.elem.replaceWith(newState);
    } else if (newState instanceof BaseComponent) {
      try {
        isState.state.elem.replaceWith(newState.create());
      } catch (_) {
        isState.state.elem.replaceWith(new newState().create());
      }
    } else if (typeof newState === 'function') {
      isState.state.elem.replaceWith(newState());
    } else {
      isState.state.elem.replaceWith(newState);
    }
    isState.state = newState;
    return;
  }

  if (isState.state?.elem instanceof Array) {
    if (newState?.elem instanceof HTMLElement) {
      isState.state.elem[isState.state.elem.length - 1].replaceWith(newState.elem);
    } else if (newState?.elem instanceof Array || newState instanceof Array) {
      isState.state.elem[isState.state.elem.length - 1]
        .replaceWith(...(newState?.elem || newState));
    } else if (newState instanceof HTMLElement || typeof newState === 'string') {
      isState.state.elem[isState.state.elem.length - 1].replaceWith(newState);
    } else if (newState instanceof BaseComponent) {
      try {
        isState.state.elem[isState.state.elem.length - 1].replaceWith(newState.create());
      } catch (_) {
        isState.state.elem[isState.state.elem.length - 1].replaceWith(new newState().create());
      }
    } else if (typeof newState === 'function') {
      isState.state.elem[isState.state.elem.length - 1].replaceWith(newState());
    } else {
      isState.state.elem[isState.state.elem.length - 1].replaceWith(newState);
    }
    isState.state.elem.forEach((c) => c?.remove());
    isState.state = newState;
    return;
  }
  if (isState.state instanceof HTMLElement) {
    if (newState?.elem instanceof HTMLElement) {
      isState.state.replaceWith(newState);
    } else if (newState?.elem instanceof Array || newState instanceof Array) {
      isState.state
        .replaceWith(...(newState?.elem || newState));
    } else if (newState instanceof HTMLElement || typeof newState === 'string') {
      isState.state.replaceWith(newState);
    } else if (newState instanceof BaseComponent) {
      try {
        isState.state.replaceWith(newState.create());
      } catch (_) {
        isState.state.replaceWith(new newState().create());
      }
    } else if (typeof newState === 'function') {
      isState.state.replaceWith(newState());
    } else {
      isState.state.replaceWith(newState);
    }
    isState.state = newState;
    return;
  }
  const { element } = user;
  const userToNew = user;
  if (newState?.elem instanceof HTMLElement) {
    element.replaceWith(newState.elem);
    userToNew.element = newState.elem;
  } else if (newState?.elem instanceof Array || newState instanceof Array) {
    element
      .replaceWith(...(newState?.elem || newState));
    userToNew.element = {
      elem: newState?.elem || newState,
    };
  } else if (newState instanceof HTMLElement || typeof newState === 'string') {
    element.replaceWith(newState);
    userToNew.element = newState;
  } else if (newState instanceof BaseComponent) {
    try {
      const elem = newState.create();
      element.replaceWith(elem);
      userToNew.element = elem;
    } catch (_) {
      const elem = new newState().create();
      element.replaceWith(elem);
      userToNew.element = elem;
    }
  } else if (typeof newState === 'function') {
    const elem = newState();
    element.replaceWith(elem);
    userToNew.element = elem;
  } else {
    element.replaceWith(newState);
    userToNew.element = newState;
  }
  isState.state = newState;
  isState.users[isState.users.findIndex((us) => us.element === element)] = userToNew;
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
