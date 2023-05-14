/* eslint-disable import/no-cycle */
import AmberJsx from './amberJsx';
import BaseComponent from './component/base';
import StateComponent from './component/states';
import usingState from './api/usingState';
import Await from './buildit/await';

const Amber = {
  AmberJsx,
  BaseComponent,
  StateComponent,
  usingState,
};

export {
  BaseComponent,
  StateComponent,
  usingState,
  AmberJsx,
  Await,
  // eslint-disable-next-line no-restricted-exports
  Amber as default,
};
