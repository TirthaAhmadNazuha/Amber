import componentElement from './fragmentComponent/component-element';

const BaseComponent = class {
  constructor(props, childs) {
    this.props = props || {};
    this.childs = childs || [];
    /** @type {HTMLElement & { usedState: { [key: string]: {parent: () => HTMLElement, elem: () => HTMLElement, prop: any[]} } }} */
    this.element;
  }
  render() { }
  processJSX() {
    this._elem = this.render();
  }

  isConneted() { }

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
