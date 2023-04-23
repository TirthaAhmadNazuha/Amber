/* eslint-disable import/no-cycle */
import BaseComponent from './base';
import { setInState, setStateMethod } from './fragmentComponent/states/task';

const StateComponent = class extends BaseComponent {
  constructor(prop, childs) {
    super(prop, childs);
    this.state = null;
  }

  makeStates(states) {
    if (states instanceof Object) {
      this.state = setInState(states, this.state);
    } else throw new Error('state must be an object');
  }

  setState(newStates) {
    if (newStates instanceof Object) {
      setStateMethod(newStates, this.state);
    } else throw new Error('newStates must be an object');
  }
};

export default StateComponent;
