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
  (props: AwaitProps): import('react').JSX.Element
}
export const Await: AwaitInterface

interface FormInterface {
  (props: import('react').FromProps): import('react').JSX.Element
}
export const Form: FormInterface

interface Ref<T> {
  value: T
  onChange(value: T): void
}

interface UsingRef {
  <T>(initialValue: T extends null ? HTMLElement : T): Ref<T extends null ? HTMLElement : T>
}

export const usingRef: UsingRef

interface FullyPreparedInterface {
  (): Promise<boolean>
}

interface defineRootInterface {
  /**
   * Make method BaseComponent.onConnected() working.
   */
  (rootElement: HTMLElement): void
}
export const defineRoot: defineRootInterface

interface onConnectedCallbackFunctionInterface {
  (element: (HTMLElement | JSX.Element | Element | Node)): void
}
interface onConnectedCallbackInterface {
  (element: (HTMLElement | JSX.Element | Element | Node), callback: onConnectedCallbackFunctionInterface): void
}

export const onConnectedCallback: onConnectedCallbackInterface

export const fullyPrepared: FullyPreparedInterface

export default {
  AmberJsx,
  BaseComponent,
  StateComponent,
  usingState,
  Await,
  Form,
  fullyPrepared,
  usingRef,
  defineRoot,
  onConnectedCallback,
}


declare module 'amber' {
  AmberJsx
  BaseComponent
  StateComponent
  usingState
  Await
  Form
  fullyPrepared
  usingRef
  defineRoot
  onConnectedCallback
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    then?(elem: T): void
    theme?: Object
    onHover?(event: MouseEvent, elem: T): void
    onClick?(event: MouseEvent, elem: T): void
  }

  namespace JSX {
    interface Element extends HTMLElement {
    }
  }
  Await
  interface FromProps extends HTMLAttributes<HTMLFormElement> {
    action: string | '/',
    method: string | 'get',
    requestInit: RequestInit
    onResponse(response: Response): void,
    mapData?(data: { [field: string]: string }): { [field: string]: string }
  }
  Form
}
