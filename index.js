/* eslint-disable import/no-cycle */
import AmberJsx from './amberJsx';
import BaseComponent from './component/base';
import StateComponent from './component/states';

const Amber = {
  AmberJsx,
  BaseComponent,
  StateComponent,
};

export {
  // eslint-disable-next-line no-restricted-exports
  BaseComponent, StateComponent, AmberJsx, Amber as default,
};
