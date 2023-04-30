const specialAttributes = [
  {
    key: 'test',
    val() {
      setTimeout(() => {
        console.log('test');
      });
    },
  },
];

const checkValAttr = (val, key, element) => {
  if (val?.stateValue !== undefined || val.constructor.name === 'State' || val.constructor.name === 'LengthState') {
    val.setUser({
      apiKey: 'attribute',
      arg: [key, element],
    });
    return val.stateValue;
  }
  if (val instanceof Array) {
    const states = new Set();
    const result = val.map((v) => {
      if (typeof v === 'function') {
        return checkValAttr(v());
      }
      if (v?.stateValue !== undefined || v.constructor.name === 'State' || v.constructor.name === 'LengthState') {
        states.add(v);
        return v.stateValue;
      }
      return v;
    }).toString().replace(',', ' ');
    states.forEach((state) => {
      state.setUser({
        apiKey: 'multilevelAttribute',
        arg: [key, element, result],
      });
    });
    return result;
  }
  return val;
};

const reMakeKey = (key) => {
  if (key === 'className') return 'class';
  if (key.startsWith('on') && key.slice(2).toLowerCase() !== key.slice(2)) {
    return { key: key.slice(2).toLowerCase(), desc: 'event' };
  }
  return key;
};

const attrChecker = (val, key, element) => {
  const specialAttribute = specialAttributes.find((attr) => attr.key === key);
  if (specialAttribute) {
    specialAttribute.val(element, checkValAttr(val, key, element));
  } else {
    const remakeKey = reMakeKey(key);
    const AmberEvent = (event) => {
      checkValAttr(val, key, element)(event, element);
    };
    if (typeof remakeKey === 'object') {
      switch (remakeKey.desc) {
        case 'event':
          element.addEventListener(remakeKey.key, AmberEvent);
          break;
        default: break;
      }
    } else {
      element.setAttribute(remakeKey, checkValAttr(val, key, element));
    }
  }
};

export default attrChecker;
