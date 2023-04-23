/* eslint-disable max-classes-per-file */

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
    return this.state;
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
      this.state.push(item);
      this.users.forEach((user) => {
        user.elem().append(item);
      });
    });
    this.changedCallback();
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
    this.changedCallback();
  }

  preAdd(...items) {
    this.state.unshift(...items);
    this.users.forEach((user) => {
      user.elem().prepend(...items);
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
