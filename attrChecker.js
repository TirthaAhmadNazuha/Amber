import CreateState from './api/createState';
import { isIterable } from './typeChecker';

const specialAttributes = [
  {
    key: 'then',
    val(callback, elem) {
      setTimeout(() => {
        callback(elem);
      });
    },
  },
  {
    key: 'theme',
    val(props, elem) {
      Object.keys(props).forEach((key) => {
        // eslint-disable-next-line no-use-before-define
        attrChecker(props[key], key, elem);
      });
    },
  },
];

const checkFrontProp = (element, key) => {
  if (element[key] !== undefined) return false;
  return true;
};

export const remakeArray = (arr) => {
  try {
    return arr.toString().replaceAll(',', ' ');
  } catch (_) { /* empty */ }
};

const checkValAttr = (val, key, element) => {
  if (val instanceof Array) {
    const result = [];
    const states = new Set();
    val.forEach((v) => {
      if (v instanceof CreateState) {
        states.add(v);
        result.push(v.value);
      } else {
        result.push(v);
      }
    });
    states.forEach((state) => {
      state.subcribe(element, 'arrAttr', {
        key,
        mergingVal: result.map((res) => {
          if (res === state.value) {
            return '{{}}';
          }
          return res;
        }),
      });
    });
    if (checkFrontProp(element, key)) {
      element.setAttribute(key, remakeArray(result));
    } else {
      element[key] = result;
    }
    return;
  }
  if (val instanceof CreateState) {
    if (checkFrontProp(element, key)) {
      val.subcribe(element, 'frontAttr', { key });
    } else {
      val.subcribe(element, 'property', { key });
    }
    checkValAttr(val.value, key, element);
    return;
  }
  if (typeof val === 'object') {
    Object.keys(val).forEach((k) => {
      if (val[k] instanceof CreateState) {
        val[k].subcribe(element, 'objectAttr', {
          key,
          k,
        });
        element[key][k] = val[k].value;
      } else element[key][k] = val[k];
    });
    return;
  }
  if (checkFrontProp(element, key)) {
    element.setAttribute(key, isIterable(val) ? remakeArray(val) : val);
    return;
  }
  element[key] = val;
};
const reMakeKey = (key) => {
  if (key === 'className') return 'class';
  if (key.startsWith('on') && key.slice(2).toLowerCase() !== key.slice(2)) {
    return { key: key.slice(2).toLowerCase(), desc: 'event' };
  }
  return key;
};

const attrChecker = async (value, key, element) => {
  const specialAttribute = specialAttributes.find((attr) => attr.key === key);
  const val = await value;
  if (specialAttribute) {
    specialAttribute.val(val, element);
    return;
  }
  const rekey = reMakeKey(key);
  if (typeof rekey === 'string') {
    checkValAttr(val, key, element);
  } else if (typeof rekey === 'object') {
    if (rekey.desc === 'event') {
      const AmberEvent = (e) => {
        val(e, element);
      };
      element.addEventListener(rekey.key, AmberEvent);
    }
  }
};

export default attrChecker;
