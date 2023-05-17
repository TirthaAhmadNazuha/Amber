import typeChecker from '../typeChecker';
import children from './stateUpdater/children';

const CreateState = class {
  constructor(initialValue) {
    this.value = initialValue;
    this.users = new Set();
    this.type = 'children';
  }

  subcribe(node) {
    node.update = (newValue) => {
      if (this.type === 'children') {
        children(node, typeChecker(newValue));
      }
    };
    this.users.add(node);
  }

  dispatch() {
    this.users.forEach((node) => {
      node.update(this.value);
    });
  }
};

export default CreateState;
