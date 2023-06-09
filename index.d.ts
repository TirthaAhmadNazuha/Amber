// Type definitions for [~AmberJs~]
// Project: [~Amber~]
// Definitions by: [~Tirtha Ahmad Nazuha~]
import AmberJsx from './amberJsx'

export declare class BaseComponent {
  /**
   * Abstract class for create component in AmberJs
   * @throws Error Abstract class not allowed to instantiate
   */
  constructor(props: Object, childs?: Element[])

  /**
   * Abstact method, must return JSX or Node
   * @throws Error when not implements
   */
  render(): JSX.Element

  /**
   * Is method to processing JSX in AmberJsx.createElement for small task processing in menthod create().
   * @description if processJSX not called, processing JSX will run in method create().
   */
  processJSX(): void

  /**
   * Called when element has insert on document 
   * @description can using element (property)
   */
  onConnected(): void

  create(): HTMLElement

  /**
   * Is the parent of the output of the render method.
   * 
   * When the parent is Fragment (parentless) is return array.
   * @description output will null If use before onConnected (method) has called or outside onConnected block code.
  */
  element: (Element | Element[])

  /** Are arguments that are initialized when the BaseComponent instance is created. */
  props: Object

  /**
   * Is childs on component Tag in JSX.
   * @example
   * // [...childs] is like text or Element
   * <MyComponent>[...childs]</MyComponent>
   */
  childs: Element[]

  parent: HTMLElement
}

export declare class StateComponent extends BaseComponent {
  setState(states: object): void
}

interface setState<T> {
  (value: T): void
  (callback: (value: T) => T): void
}
interface CreateState<T> {
  value: T
  users: Set
}
interface UsingState {
  <T>(value: T extends React.ReactElement ? Element : T): [T extends React.ReactElement ? CreateState<Element> : CreateState<T>, setState<T extends React.ReactElement ? Element : T>]
}
export const usingState: UsingState

interface AwaitProps {
  resolve: Promise
  onPending: Element
  onReject: Element
}
interface AwaitInterface {
  (props: AwaitProps): AmberJsx.createElement
}
export const Await: AwaitInterface

interface IfProps {
  condition: boolean
}
interface IfInterface {
  (props: IfProps): AmberJsx.createElement
  Else: AmberJsx.createElement
  Elif: IfInterface
}
export const If: IfInterface

interface FullyPreparedInterface {
  (): Promise<boolean>
}

export const fullyPrepared: FullyPreparedInterface

export default {
  AmberJsx,
  BaseComponent,
  StateComponent,
  usingState,
  Await,
  If,
  fullyPrepared
}


declare module 'amber' {
  AmberJsx
  BaseComponent
  StateComponent
  usingState
  Await
  If
  fullyPrepared
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    then?(elem: T): void
    theme?: Object
    onHover?(event: MouseEvent, elem: T): void
    onClick?(event: MouseEvent, elem: T): void
  }
  Await
  If
}


