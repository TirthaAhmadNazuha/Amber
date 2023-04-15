declare class BaseComponent {
  constructor(props: object, childs?: Array);
  render(): HTMLElement;
  processJSX(): void;
  isConneted(): void;
  create(): HTMLElement;
}
type state = {
  [K: string]: object;
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
