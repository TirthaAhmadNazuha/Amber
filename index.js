/* eslint-disable import/no-cycle */
import AmberJsx from './amberJsx';
import BaseComponent from './component/base';
import StateComponent from './component/states';
import Await from './buildit/await';
import usingState from './api/usingState';

const Amber = {
  AmberJsx,
  BaseComponent,
  StateComponent,
  usingState,
};

export {
  BaseComponent,
  StateComponent,
  AmberJsx,
  Await,
  usingState,
  // eslint-disable-next-line no-restricted-exports
  Amber as default,
};
