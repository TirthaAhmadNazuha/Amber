import BaseComponent from '../base';
import stateApi from '../../stateApi';

export const State = class {
  constructor(state, key) {
    /** @private */
    this.state = state;
    this.key = key;
    this.users = [];
    this.settedCallback = this.settedCallback.bind(this);
  }
  set val(state) {
    this.state = state;
    this.settedCallback();
  }
  get val() {
    return this.state;
  }
  settedCallback() { }
  setUser(descriptionState) {
    this.users.push(descriptionState);
  }
};

/** @class */
const ArrayState = class extends State {
  add(...items) {
    items.forEach((item) => {
      this.state.push(item);
      this.users.forEach((user) => {
        switch (user.arrayType) {
          case 'children':
            user.elem().append(item);
            break;
        }
      });
    });
    this.settedCallback();
  }
  remove(target) {
    if (typeof target === 'number') {
      this.state.splice(target, 1);
    } else this.state.splice(this.state.indexOf(target), 1);
    this.users.forEach((user) => {
      switch (user.arrayType) {
        case 'children':
          if (typeof target === 'number') {
            user.elem().children[target].remove();
          } else target.remove();
          break;
      }
    });
    this.settedCallback();
  }
  preAdd(...items) {
    this.state.unshift(...items);
    this.users.forEach((user) => {
      switch (user.arrayType) {
        case 'children':
          user.elem().prepend(...items);
          break;
      }
    });
    this.settedCallback();
  }
  removeLast() {
    this.remove(this.state[this.state.length - 1]);
    this.settedCallback();
  }
  settedCallback() {
    if (this.lengthState === undefined) return;
    stateTask.setStateMethod({ [this.lengthState.key]: this.state.length }, this.lengthState.key, { [this.lengthState.key]: this.lengthState });
  }
  get length() {
    this.lengthState = new State(this.state.length, this.key + '_length');
    return this.lengthState;
  }
};

const stateTask = {
  setInState(states) {
    let state = {};
    Object.keys(states).forEach((key) => {
      if (states[key] instanceof Array) {
        state[key] = new ArrayState(states[key], key);
      } else {
        state[key] = new State(states[key], key);
      }
    });
    return state;
  },

  setStateMethod(newStates, isState) {
    Object.keys(newStates).forEach((keyState) => {
      isState[keyState].users.forEach((user) => {
        stateApi[user.apiKey](newStates[keyState], isState[keyState], ...(user.arg || []));
      });
    });
  }
};
const StateComponent = class extends BaseComponent {
  constructor(prop, childs) {
    super(prop, childs);
    this.state;
  }

  makeStates(states) {
    if (!states instanceof Object) {
      throw new Error('state must be an object');
    }
    this.state = stateTask.setInState(states);
  }

  setState(newStates) {
    if (!newStates instanceof Object) {
      throw new Error('newStates must be an object');
    }
    stateTask.setStateMethod(newStates, this.state);
  }
};

export default StateComponent;

