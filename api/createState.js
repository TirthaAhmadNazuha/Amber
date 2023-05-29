import { BaseComponent } from '..';
import stateUpdater from './stateUpdater';

const CreateState = class {
  constructor(initialValue, parent) {
    if (initialValue?.isElementFragment) {
      this._value = initialValue.isElementFragment;
    } else if (initialValue instanceof BaseComponent) {
      this._value = initialValue.create();
    } else if (typeof initialValue === 'object' && !(initialValue instanceof Node)) {
      const states = {};
      Object.keys(initialValue).forEach((key) => {
        const v = new CreateState(initialValue[key], this);
        states[key] = v;
        this[key] = v;
      });
      this._value = states;
    } else this._value = initialValue;

    this.parent = parent;
    this.users = new Set();
  }

  set value(value) {
    if (typeof this._value === 'object' && !(this._value instanceof Node)) {
      Object.keys(this._value).forEach((key) => {
        this._value[key].value = (value[key]);
      });
    } else this._value = value;
  }

  get value() {
    return this._value;
  }

  subcribe(nodes, type, option = {}) {
    const user = {
      nodes,
      update(newVal) {
        const result = stateUpdater[type](this.nodes, newVal, option);
        if (result) {
          this.nodes = result;
        }
      },
    };
    this.users.add(user);
    if (this.parent === undefined) return;
    this.parent.users.add(user);
  }

  dispatch() {
    this.users.forEach((user) => {
      if (typeof this._value === 'object' && !(this._value instanceof Node) && !(this._value instanceof BaseComponent)) {
        Object.keys(this._value).forEach((key) => {
          this._value[key].dispatch();
        });
      } else user.update(this._value);
    });
  }
};

export default CreateState;
