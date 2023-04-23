/* eslint-disable import/no-cycle */
import { setStateMethod } from './task';

const State = class {
  constructor(state, key) {
    this.state = state;
    this.key = key;
    this.users = [];
    this.settedCallback = this.settedCallback.bind(this);
    this.value = state;
  }

  set val(state) {
    setStateMethod(state, this);
    this.settedCallback();
  }

  get val() {
    return this.value;
  }

  settedCallback() { }

  setUser(descriptionState) {
    this.users.push(descriptionState);
  }
};

export default State;
