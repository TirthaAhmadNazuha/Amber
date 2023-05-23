import { BaseComponent } from '..';
import stateUpdater from './stateUpdater';

const CreateState = class {
  constructor(initialValue, parent) {
    if (initialValue?.isElementFragment) {
      this.value = initialValue.isElementFragment;
    } else if (initialValue instanceof BaseComponent) {
      this.value = initialValue.create();
    } else if (typeof initialValue === 'object' && !(initialValue instanceof Node)) {
      const states = {};
      Object.keys(initialValue).forEach((key) => {
        const v = new CreateState(initialValue[key], this);
        states[key] = v;
        this[key] = v;
      });
      this.Value = states;
    } else this.value = initialValue;

    this.parent = parent;
    this.users = new Set();
  }

  set value(value) {
    if (typeof this.Value === 'object' && !(this.Value instanceof Node)) {
      Object.keys(this.Value).forEach((key) => {
        this.Value[key].value = (value[key]);
      });
    } else this.Value = value;
  }

  get value() {
    return this.Value;
  }

  subcribe(nodes, type, option = {}) {
    const user = {
      nodes,
      update(newVal) {
        stateUpdater[type](this.nodes, newVal, option);
        if (type === 'children') this.nodes = newVal;
      },
    };
    this.users.add(user);
    if (this.parent === undefined) return;
    this.parent.users.add(user);
  }

  dispatch() {
    this.users.forEach((user) => {
      if (typeof this.Value === 'object' && !(this.Value instanceof Node) && !(this.Value instanceof BaseComponent)) {
        Object.keys(this.Value).forEach((key) => {
          this.Value[key].dispatch();
        });
      } else user.update(this.value);
    });
  }
};

export default CreateState;
