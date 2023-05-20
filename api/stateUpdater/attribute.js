import { remakeArray } from '../../attrChecker';

const frontAttr = (node, val, option) => {
  node.setAttribute(option.key, val);
};

export const property = (node, val, option) => {
  node[option.key] = val;
};

export const arrAttr = (node, val, option) => {
  if (node[option.key] !== undefined) {
    const result = option.mergingVal.map((v) => {
      if (v === '{{}}') {
        return val;
      }
      return v;
    });
    property(node, result, { key: option.key });
  } else {
    const result = remakeArray(option.mergingVal).replaceAll('{{}}', val);
    frontAttr(node, result, { key: option.key });
  }
};

export const objectAttr = (node, val, option) => {
  node[option.key][option.k] = val;
};

export default frontAttr;
