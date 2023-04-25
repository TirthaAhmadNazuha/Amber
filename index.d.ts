// Type definitions for [~AmberJs~]
// Project: [~Amber~]
// Definitions by: [~Tirtha Ahmad Nazuha~]
import AmberJsx from './amberJsx';

export declare class BaseComponent {
  /**
   * Abstract class for create component in AmberJs
   * @throws Error Abstract class not allowed to instantiate
   */
  constructor(props: Object, childs?: Element[]);

  /**
   * Abstact method, must return JSX or Node
   * @throws Error when not implements
   */
  render(): JSX.Element;

  /**
   * Is method to processing JSX in AmberJsx.createElement for small task processing in menthod create().
   * @description if processJSX not called, processing JSX will run in method create().
   */
  processJSX(): void;

  /**
   * Called when element has insert on document 
   * @description can using element (property)
   */
  onConnected(): void;

  create(): HTMLElement;

  /**
   * Is the parent of the output of the render method.
   * 
   * When the parent is Fragment (parentless) is return array.
   * @description output will null If use before onConnected (method) has called or outside onConnected block code.
  */
  element: (Element | Element[]);

  /** Are arguments that are initialized when the BaseComponent instance is created. */
  props: Object;

  /**
   * Is childs on component Tag in JSX.
   * @example
   * // [...childs] is like text or Element
   * <MyComponent>[...childs]</MyComponent>
   */
  childs: Element[];
}

type State = {
  key: any;
  get val(): any;
  /** called when the state has changed */
  modifyCallback(): void;
}

type ArrayState = {
  key: any;
  get val(): any;
  set val(state: any);
  add(...items: any): void;
  remove(target: any): void;
  preAdd(...items: any): void;
  removeLast(): void;
  /** called when the state has changed */
  modifyCallback(): void;
  get length(): State;
}

type state = {
  [K: string]: (State | ArrayState),
}
export declare class StateComponent extends BaseComponent {
  /**
   * Use to create an initial state
   * @example
   * this.makeStates({
   *  count: 0,
   *  items: <h3>There are no items here yet!</h3>,
   * })
   */
  makeStates(states: Object): void;

  /**
   * a state has initial on makeStates (method)
   * @example
   * this.makeStates({
   *  count: 0
   * })
   * 
   * console.log(this.state.count) // output: State {state: 0, key: 'count', ...}
   * console.log(this.state.items) // output: undefined
   * 
   * @description Dont assign state, do using makeStates (method)
   * 
   * Using state
   * @example
   * render() {
   *  this.makeStates({
   *    greeting: 'Hello AmberJs'
   *  })
   *  return (
   *  <div>
   *    <h1>{this.state.greeting}</h1>
   *    <button onClick={() => this.setState({ greeting: 'Hello [Your name]' })}>click</button>
   *  </div>
   *  )
   * }
   */
  state: state;

  /** Use it to update state (property) and update JSX.Element that uses state */
  setState(states: Object): void;
}

export default {
  AmberJsx,
  BaseComponent,
  StateComponent,
}

declare module 'amber' {
  AmberJsx;
  BaseComponent;
  StateComponent;
}
