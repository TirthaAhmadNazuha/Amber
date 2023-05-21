import CreateState from './createState';

const usingState = (initialValue) => {
  const state = new CreateState(initialValue);
  const setState = (newValue) => {
    if (newValue?.isElementFragment) {
      state.value = newValue.isElementFragment;
    } else state.value = newValue;
    state.dispatch();
  };

  return [state, setState];
};

export default usingState;
