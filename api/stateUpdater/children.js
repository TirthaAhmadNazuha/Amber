import { isIterable } from '../../typeChecker';

const children = (isUsers, newNode) => {
  const result = newNode instanceof Node ? newNode : null;
  if (isUsers instanceof Array) {
    isUsers[0].replaceWith(...(isIterable(newNode) ? newNode : [newNode]));
    isUsers.forEach((c) => c.remove());
  } else if (typeof newNode !== 'object') {
    isUsers.textChontent = newNode;
  } else isUsers.replaceWith(...(isIterable(newNode) ? newNode : [newNode]));

  return result;
};

export default children;
