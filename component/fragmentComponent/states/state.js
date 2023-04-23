/* eslint-disable import/no-cycle */
import { setStateMethod } from './task';

const State = class {
  constructor(state, key) {
    this.state = state;
    this.key = key;
    this.users = [];
    this.modifyCallback = this.modifyCallback.bind(this);
    this.value = state;
  }

  set val(state) {
    setStateMethod(state, this);
    this.modifyCallback();
  }

  get val() {
    return this.value;
  }

  modifyCallback() { }

  setUser(descriptionState) {
    this.users.push(descriptionState);
  }
};

export default State;
