export = BaseComponent;
declare class BaseComponent {
  constructor(props: object, childs?: Array);
  render(): HTMLElement;
  processJSX(): void;
  isConneted(): void;
  create(): HTMLElement;
}
