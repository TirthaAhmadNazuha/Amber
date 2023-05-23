import { BaseComponent } from '..';
import CreateState from './createState';

const usingState = (initialValue) => {
  const state = new CreateState(initialValue);
  const setState = (newValue) => {
    if (newValue?.isElementFragment) {
      state.value = newValue.isElementFragment;
    } else if (newValue instanceof BaseComponent) {
      state.value = newValue.create();
    } else state.value = newValue;
    state.dispatch();
  };

  return [state, setState];
};

export default usingState;
