/* eslint-disable import/no-cycle */
import AmberJsx from './amberJsx';
import BaseComponent from './component/base';
import StateComponent from './component/states';
import usingState from './api/usingState';

const Amber = {
  AmberJsx,
  BaseComponent,
  StateComponent,
  usingState,
};

export {
  // eslint-disable-next-line no-restricted-exports
  BaseComponent, StateComponent, usingState, AmberJsx, Amber as default,
};
