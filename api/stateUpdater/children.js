import { isIterable } from '../../typeChecker';

const children = (isNode, newNode) => {
  isNode.replaceWith(...(isIterable(newNode) ? newNode : [newNode]));
};

export default children;
