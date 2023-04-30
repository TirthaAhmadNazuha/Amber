/* eslint-disable max-classes-per-file */
import { usingState } from '..';
import { DefineSetState, createState } from '../api/usingState';
import BaseComponent from './base';

const StateComponent = class extends BaseComponent {
  constructor(prop, childs) {
    super(prop, childs);
    this.aState = {};
    this.aSetState = {};
  }

  set state(states) {
    Object.keys(states).forEach((key) => {
      const [state, setState] = usingState(states[key]);
      this.aState[key] = state;
      this.aSetState[key] = setState;
    });
  }

  get state() {
    return this.aState;
  }

  setState(newStates) {
    Object.keys(newStates).forEach((key) => {
      this.aSetState[key](newStates[key]);
      const { users, lengthState } = this.aState[key];
      this.aState[key] = createState(newStates[key], users, lengthState);
      this.aSetState[key] = new DefineSetState(this.aState[key]).setState;
    });
  }
};

export default StateComponent;
