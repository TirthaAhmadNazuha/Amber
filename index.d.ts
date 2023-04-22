declare class BaseComponent {
  constructor(props: Object, childs?: Array);
  render(): HTMLElement;
  processJSX(): void;
  isConneted(): void;
  create(): HTMLElement;
  element: HTMLElement;
  props: Object;
  childs: Array;
}

type State = {
  key: any;
  get val(): any;
}

type ArrayState = {
  key: any;
  get val(): any;
  set val(state: any);
  add(...items: any): void;
  remove(target: any): void;
  preAdd(...items: any): void;
  removeLast(): void;
  get length(): State;
}

type state = {
  [K: string]: (State | ArrayState),
}
declare class StateComponent extends BaseComponent {
  state: state;
  makeStates(states: Object): void;
  setState(states: Object): void;
}
export = {
  BaseComponent,
  StateComponent,
}

declare module 'amber' {
  BaseComponent;
  StateComponent;
}
