declare class BaseComponent {
  constructor(props: object, childs?: Array);
  render(): HTMLElement;
  processJSX(): void;
  isConneted(): void;
  create(): HTMLElement;
}
var keyStates = []
type state = {
  [keyStates]: object;
}
declare class StateComponent extends BaseComponent {
  state: state;
  makeStates(states: object): void {
    Object.keys(states).forEach((key) => {
      keyStates.push(keyStates)
    })
  };
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
