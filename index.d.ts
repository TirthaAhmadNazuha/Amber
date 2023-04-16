declare class BaseComponent {
  constructor(props: object, childs?: Array);
  render(): HTMLElement;
  processJSX(): void;
  isConneted(): void;
  create(): HTMLElement;
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
  makeStates(states: object): void;
  setState(states: object): void;
}
export = {
  BaseComponent,
  StateComponent,
}

declare module 'amber' {
  BaseComponent;
  StateComponent;
}
