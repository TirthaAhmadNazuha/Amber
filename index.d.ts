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

export declare class StateComponent extends BaseComponent {
  setState(states: object): void
}
interface setState<T> {
  (value: T): void;
}
export interface UsingState {
  <T>(value: T extends React.ReactElement ? Element : T): [T extends React.ReactElement ? Element : T, setState<T extends React.ReactElement ? Element : T>]
}

interface AwaitProps {
  resolve: Promise
  onPending: Element
  onReject: Element
}

export const Await = (props: AwaitProps): AmberJsx.createElement => { }


export const usingState: UsingState;
export default {
  AmberJsx,
  BaseComponent,
  StateComponent,
  usingState,
  Await,
}

declare module 'amber' {
  AmberJsx;
  BaseComponent;
  StateComponent;
  usingState;
  Await;
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    then?(elem: T): void;
    theme?: Object;
  }
}
