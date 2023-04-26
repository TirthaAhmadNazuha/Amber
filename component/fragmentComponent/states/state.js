const State = class {
  constructor(state, key) {
    if (state instanceof Array && state.length === 0) {
      this.value = [''];
    } else this.value = state;
    this.key = key;
    this.users = new Set();
  }

  set val(value) {
    this.value = value;
    this.triger();
  }

  get val() {
    return this.value;
  }

  triger() {
    import('../../../stateApi')
      .then((stateApi) => {
        this.users.forEach(async (user) => {
          if (user.element.isConnected
            || (user.element instanceof Array && user.element?.find((elem) => elem.isConnected))) {
            stateApi[user.apiKey](this.value, user, ...(user?.arg || []));
          } else {
            this.users.delete(user);
          }
        });
        this.changedCallback();
      });
  }

  modifyCallback() { }

  async changedCallback() {
    if (this.lengthState) {
      const stateApi = (await import('../../../stateApi'));
      this.lengthState.users.forEach((user) => {
        stateApi[user.apiKey](this.state.length, this.lengthState, user);
      });
    }
    this.modifyCallback();
  }

  get length() {
    if (this.state.length !== undefined) {
      if (this.lengthState) return this.lengthState;
      this.lengthState = new State(this.state.length, `${this.key}_length`);
      return this.lengthState;
    }
    throw new Error('State.length: state not has length state.length is undefined');
  }

  setUser(descriptionState) {
    this.users.add(descriptionState);
  }
};

export default State;
