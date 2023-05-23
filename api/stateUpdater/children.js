import { isIterable } from '../../typeChecker';

const children = (isUsers, newNode) => {
  if (typeof isUsers === 'string' || typeof isUsers === 'number') {
    isUsers = new Text(isUsers);
  }
  if (isIterable(isUsers)) {
    isUsers.forEach((user) => {
      if (isIterable(user)) {
        user[0].replaceWith(...(isIterable(newNode) ? newNode : [newNode]));
        user.forEach((us) => us.remove());
      } else {
        user.replaceWith(...(isIterable(newNode) ? newNode : [newNode]));
      }
    });
  } else {
    isUsers.replaceWith(...(isIterable(newNode) ? newNode : [newNode]));
  }
};

export default children;
