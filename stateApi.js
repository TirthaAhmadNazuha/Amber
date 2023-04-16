const ElementChild = (newState, isState) => {
  isState.state.insertAdjacentElement('afterend', newState);
  isState.state.remove();
  isState.state = newState;
  isState._val = newState;
};

const ArrayChild = (newState, isState, element) => {
  const childElem = isState.state.find((child) => child instanceof HTMLElement);
  if (newState instanceof Array) {
    const childNew = [];
    newState.forEach((newChild) => {
      if (childElem) {
        if (typeof newChild === 'string') {
          childElem.insertAdjacentText('beforebegin', newChild);
        } else {
          childElem.insertAdjacentElement('beforebegin', newChild);
        }
      } else element.append(newChild);
      childNew.push(newChild);
    });
    let childsText = [];
    element.childNodes.forEach((child) => {
      if (child instanceof Text) {
        childsText.push(child);
      }
    });
    isState.state.forEach((child) => {
      try {
        child.remove();
      } catch (err) {
        childsText.find((c) => c.data === child).remove();
      }
    });
    isState.state = childNew;
    isState._val = childNew;
  }
};

const TextChild = (newState, isState) => {
  isState.state.data = newState;
  isState._val = newState;
};

export const SetAttribute = {
  element: null,
  object(value, key) {
    Object.keys(value).forEach((property) => {
      try {
        this.element[key][property] = value[property];
      } catch (err) {
        this.element[key] = {};
        this.element[key][property] = value[property];
      }
    });
  },
  array(value, key) {
    let isString = value.filter((val) => typeof val === 'string').length === value.length;
    if (isString) {
      this.any(value.toString().replaceAll(',', ' '), key);
    } else {
      this.element[key] = value;
    }
  },
  function(value, key) {
    if (key.startsWith('on') && key.charAt(2).toUpperCase() === key.charAt(2)) {
      this.element.addEventListener(key.slice(2).toLowerCase(), (e) => value(e, this.element));
    }
  },
  any(value, key) {
    key = key === 'className' ? 'class' : key;
    this.element.setAttribute(key, value);
  }
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
  state._val = value;
};

const stateApi = {
  'ElementChild': ElementChild,
  'ArrayChild': ArrayChild,
  'TextChild': TextChild,
  'SetAttribute': SetAttribute,
  'AttributeState': AttributeState,
};
export default stateApi;
