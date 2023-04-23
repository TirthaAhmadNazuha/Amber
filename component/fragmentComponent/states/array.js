/* eslint-disable import/no-cycle */
import { setStateMethod } from './task';
import State from './state';

const ArrayState = class extends State {
  add(...items) {
    items.forEach((item) => {
      this.state.push(item);
      this.users.forEach((user) => {
        user.elem().append(item);
      });
    });
    this.setLengthStates();
    this.modifyCallback();
  }

  remove(target) {
    if (typeof target === 'number') {
      this.state.splice(target, 1);
    } else this.state.splice(this.state.indexOf(target), 1);
    this.users.forEach((user) => {
      if (typeof target === 'number') {
        user.elem().children[target].remove();
      } else target.remove();
    });
    this.setLengthStates();
    this.modifyCallback();
  }

  preAdd(...items) {
    this.state.unshift(...items);
    this.users.forEach((user) => {
      user.elem().prepend(...items);
    });
    this.setLengthStates();
    this.modifyCallback();
  }

  removeLast() {
    this.remove(this.state[this.state.length - 1]);
    this.setLengthStates();
    this.modifyCallback();
  }

  setLengthStates() {
    if (this.lengthState === undefined) return;
    setStateMethod(
      { [this.lengthState.key]: this.state.length },
      { [this.lengthState.key]: this.lengthState },
    );
  }

  get length() {
    this.lengthState = new State(this.state.length, `${this.key}_length`);
    return this.lengthState;
  }
};

export default ArrayState;
