/* eslint-disable max-classes-per-file */

import typeChecker from '../../../typeChecker';

const State = class {
  constructor(state, key) {
    this.state = state;
    this.key = key;
    this.users = [];
    this.changedCallback = this.changedCallback.bind(this);
  }

  set val(state) {
    this.users.forEach(async (user) => {
      const stateApi = (await import('../../../stateApi'));
      stateApi[user.apiKey](state, this, user);
    });
    this.changedCallback();
  }

  get val() {
    return this.value || this.state;
  }

  modifyCallback() { }

  changedCallback() {
    this.modifyCallback();
  }

  setUser(descriptionState) {
    this.users.push(descriptionState);
  }
};

export const ArrayState = class extends State {
  add(...items) {
    items.forEach((item) => {
      this.users.forEach((user) => {
        const itemResult = typeChecker(item);
        user.element[user.element.length - 1]
          ?.replaceWith(user.element[user.element.length - 1], itemResult);
        this.state.push(itemResult);
        this.value.push(item);
      });
    });
    this.changedCallback();
  }

  remove(target) {
    this.users.forEach((user) => {
      if (user.element.length === 1) {
        const semitext = document.createTextNode('');
        user.element[0].replaceWith(user.element[0], semitext);
        user.element.push(semitext);
      }
      if (typeof target === 'number') {
        user.element[target].remove();
      } else {
        target.remove();
      }
    });
    if (typeof target === 'number') {
      this.state.splice(target, 1);
    } else this.state.splice(this.state.indexOf(target), 1);
    this.changedCallback();
  }

  preAdd(...items) {
    items.forEach((item) => {
      this.users.forEach((user) => {
        const itemResult = typeChecker(item);
        user.element[0]
          ?.replaceWith(itemResult, user.element[0]);
        this.state.unshift(itemResult);
        this.value.unshift(item);
      });
    });
    this.changedCallback();
  }

  removeLast() {
    this.remove(this.state[this.state.length - 1]);
    this.changedCallback();
  }

  changedCallback() {
    if (this.lengthState) {
      this.lengthState.users.forEach(async (user) => {
        const stateApi = (await import('../../../stateApi'));
        stateApi[user.apiKey](this.state.length, this.lengthState, user);
      });
    }
    this.modifyCallback();
  }

  get length() {
    if (this.lengthState) return this.lengthState;
    this.lengthState = new State(this.state.length, `${this.key}_length`);
    return this.lengthState;
  }
};

export default State;
