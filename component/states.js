import BaseComponent from './base';
import usingState from '../api/usingState';

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
    });
  }
};

export default StateComponent;
