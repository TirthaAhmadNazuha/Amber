import stateUpdater from './stateUpdater';

const CreateState = class {
  constructor(initialValue) {
    if (initialValue?.isElementFragment) {
      this.value = initialValue.isElementFragment;
    } else this.value = initialValue;

    this.users = new Set();
  }

  subcribe(node, type, option) {
    this.users.add({
      update(newVal) {
        stateUpdater[type](node, newVal, option);
      },
    });
  }

  dispatch() {
    this.users.forEach((user) => {
      user.update(this.value);
    });
  }
};

export default CreateState;
