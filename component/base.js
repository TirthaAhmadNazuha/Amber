import { isIterable } from '../typeChecker';

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
    const elem = this.elem || this.render();
    if (isIterable(elem)) {
      const textForGettingParent = new Text();
      textForGettingParent.addEventListener('DOMNodeInserted', () => {
        this.parent = textForGettingParent.parentElement;
        textForGettingParent.replaceWith(elem);
        this.element = elem;
        this.onConnected();
      });
      return textForGettingParent;
    }
    elem.addEventListener('DOMNodeInserted', () => {
      this.parent = elem.parentElement;
      this.element = elem;
      this.onConnected();
    });
    return elem;
  }
};

export default BaseComponent;
