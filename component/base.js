import componentElement from './fragmentComponent/component-element';

const BaseComponent = class {
  /** @param {Object<string, any>} props */
  constructor(props, childs) {
    this.props = props || {};
    this.childs = childs || [];
    /** @type {HTMLElement & { usedState: { [key: string]: {parent: () => HTMLElement, elem: () => HTMLElement, prop: any[]} } }} */
    this.element;
  }
  /** @returns {AmberJsx.createElement} */
  render() { }
  /**
   * Move process AmberJsx.createElement to the call.
   * Use for reduce TMB but move to overload
   * @description Must call before create()
  */
  processJSX() {
    this._elem = this.render();
  }

  isConneted() { }

  /** @returns {HTMLElement} */
  create() {
    const parent = document.createElement('div', { is: componentElement });
    const elem = this._elem || this.render();
    parent.onConnected = () => {
      if (elem instanceof Array) {
        elem.forEach((child) => {
          if (child instanceof HTMLElement) {
            parent.insertAdjacentElement('beforebegin', child);
          } else {
            parent.insertAdjacentText('beforebegin', child);
          }
          this.element = parent.parentElement;
        });
      } else if (elem instanceof HTMLElement) {
        parent.insertAdjacentElement('beforebegin', elem);
      } else parent.insertAdjacentText('beforebegin', elem);
      this.element = elem;
      this.isConneted();
      parent.remove();
    };
    return parent;
  }
};

export default BaseComponent;
