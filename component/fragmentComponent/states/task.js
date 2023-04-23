/* eslint-disable import/no-cycle */
import stateApi from '../../../stateApi';
import State, { ArrayState } from './state';

export const setInState = (states, isState = null) => {
  let state = {};
  if (isState) {
    state = isState;
  }
  Object.keys(states).forEach(async (key) => {
    if (states[key] instanceof Array) {
      state[key] = new ArrayState(states[key], key);
    } else {
      state[key] = new State(states[key], key);
    }
  });
  console.log(state);
  return state;
};

export const setStateMethod = (newStates, isState) => {
  Object.keys(newStates).forEach((keyState) => {
    isState[keyState].users.forEach((user) => {
      stateApi[user.apiKey](newStates[keyState], isState[keyState], user);
    });
  });
};

const stateTask = {
  setInState,
  setStateMethod,
};

export default stateTask;
