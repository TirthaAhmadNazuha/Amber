import stateApi from '../../../stateApi';
import State from './state';

export const setInState = (states, isState = null) => {
  let state = {};
  if (isState) {
    state = isState;
  }
  Object.keys(states).forEach(async (key) => {
    state[key] = new State(states[key], key);
  });
  return state;
};

export const setStateMethod = (newStates, isState) => {
  Object.keys(newStates).forEach((keyState) => {
    isState[keyState].value = newStates[keyState];
    isState[keyState].users.forEach((user) => {
      if (user.element.isConnected
        || (user.element instanceof Array && user.element?.find((elem) => elem.isConnected))) {
        stateApi[user.apiKey](isState[keyState].value, user, ...(user?.arg || []));
        isState[keyState].changedCallback();
      } else {
        isState[keyState].users.delete(user);
      }
    });
  });
};

const stateTask = {
  setInState,
  setStateMethod,
};

export default stateTask;
