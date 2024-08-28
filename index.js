/* eslint-disable import/no-cycle */
import AmberJsx from './amberJsx'
import BaseComponent from './component/base'
import StateComponent from './component/states'
import Await from './buildit/await'
import usingState from './api/usingState'
import Form from './buildit/useForm'
import usingRef from './api/usingRef'
import fullyPrepared from './buildit/fullyPrepared'
import { defineRoot, onConnectedCallback } from './mutation'
import IfState from './buildit/useIfState'

const Amber = {
  AmberJsx,
  BaseComponent,
  StateComponent,
  usingState,
}

export {
  BaseComponent,
  StateComponent,
  AmberJsx,
  Await,
  usingState,
  Form,
  usingRef,
  fullyPrepared,
  defineRoot,
  onConnectedCallback,
  IfState,
  // eslint-disable-next-line no-restricted-exports
  Amber as default,
}
