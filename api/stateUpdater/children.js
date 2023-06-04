import typeChecker from '../../typeChecker';

const children = (isUsers, newNode) => {
  newNode = typeChecker(newNode);
  isUsers.forEach((user) => {
    user.replaceWith(newNode);
  });
  return [newNode];
};

export default children;
