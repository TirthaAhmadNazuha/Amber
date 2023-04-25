import componentElement from './fragmentComponent/component-element';

const BaseComponent = class {
  constructor(props, childs) {
    this.props = props || {};
    this.childs = childs || [];
    if (this.constructor.name === 'BaseComponent' || this.constructor.name === 'StateComponent') {
      throw new SyntaxError(`The ${this.constructor.name} is an abstract class, this is not allowed`);
    }
  }

  render() {
    throw new SyntaxError(`The ${this.constructor.name}.render is method not implements!`);
  }

  processJSX() {
    this.elem = this.render();
  }

  onConnected() { }

  create() {
    const parent = document.createElement('div', { is: componentElement });
    const elem = this.elem || this.render();
    parent.elem = elem;
    parent.onConnected = () => {
      parent.parentElement.append(...(elem instanceof Array ? elem : [elem]));
      this.element = elem;
      this.parent = parent.parentElement;
      this.onConnected();
      parent.remove();
    };
    return parent;
  }
};

export default BaseComponent;
