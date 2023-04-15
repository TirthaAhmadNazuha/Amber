import AmberJsx from './amberJsx';
import BaseComponent from "./component/base";
import StateComponent from './component/fragmentComponent/stateComponent';

const Amber = {
  AmberJsx,
  BaseComponent,
  StateComponent,
};

declare module 'amber' {
  declare export default Amber
  declare AmberJsx
  declare BaseComponent
  declare StateComponent
  export function getArrayLength(arr: any[]): number;
}
