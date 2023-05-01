/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */
import stateApi from '../stateApi';

const LengthState = class extends Number {
  constructor(val, parentState, users = false) {
    super(val);
    this.aStateValue = val || null;
    this.parentState = parentState;
    this.setLength = new DefineSetState(this).setState;
    this.users = users || new Set();
  }

  set stateValue(val) {
    this.aStateValue = val;
  }

  get stateValue() {
    return this.aStateValue;
  }

  setUser(user) {
    this.users.add(user);
  }

  set(val) {
    const oldValue = this.stateValue;
    this.stateValue = val instanceof Node ? () => val.cloneNode(true) : val;
    this.users.forEach((user) => {
      stateApi[user.apiKey](this.stateValue, user, oldValue);
    });
  }
};

export const createState = (initialValue, users = false, lengthState = false) => {
  if (initialValue instanceof Node) {
    const state = initialValue;
    state.stateValue = () => initialValue.cloneNode(true);
    state.users = users || new Set();
    state.setUser = (user) => {
      state.users.add(user);
    };
    return state;
  }
  const State = class extends initialValue.constructor {
    constructor(val) {
      super(...(val instanceof Array ? val : [val]));
      this.aStateValue = val;
      this.users = users || new Set();
      if (lengthState) this.lengthState = lengthState;

      if (val instanceof Array) {
        this.map = ((callbackfn) => {
          const result = new State([]);
          this.forEach((item, i) => {
            const c = callbackfn(item, i);
            result.push(c);
            result.stateValue.push(c);
          });
          return result;
        });
      }
    }

    set stateValue(val) {
      this.aStateValue = val;
      if (this.lengthState) this.lengthState.set(val.length || val.size);
    }

    get stateValue() {
      return this.aStateValue;
    }

    setUser(user) {
      this.users.add(user);
    }

    get isLength() {
      if (this.lengthState instanceof LengthState) return this.lengthState;
      if (this.length === undefined && this.size === undefined) return undefined;
      const lengthStateInstance = new LengthState(this.length || this.size);
      lengthStateInstance.parentState = this;
      this.lengthState = lengthStateInstance;
      return lengthStateInstance;
    }
  };
  return new State(initialValue);
};

export const DefineSetState = class {
  constructor(state) {
    this.state = state;
    this.setState = this.setState.bind(this);
  }

  setState(value) {
    const oldValue = this.state.stateValue;
    this.state.stateValue = value instanceof Node ? () => value.cloneNode(true) : value;
    this.state.users.forEach((user) => {
      stateApi[user.apiKey](this.state.stateValue, user, oldValue);
    });
  }
};

const usingState = (initialValue) => {
  const state = createState(initialValue);
  const { setState } = new DefineSetState(state);
  return [state, setState];
};

export default usingState;
