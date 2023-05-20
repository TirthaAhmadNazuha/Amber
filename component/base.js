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
      textForGettingParent.isElementFragment = elem;
      const DOMNodeInserted = () => {
        this.parent = textForGettingParent.parentElement;
        textForGettingParent.replaceWith(...elem);
        this.element = elem;
        this.onConnected();
        textForGettingParent.removeEventListener('DOMNodeInserted', DOMNodeInserted);
      };
      textForGettingParent.addEventListener('DOMNodeInserted', DOMNodeInserted);
      return textForGettingParent;
    }
    const Inserted = () => {
      this.parent = elem.parentElement;
      this.element = elem;
      this.onConnected();
      this.element.removeEventListener('DOMNodeInserted', Inserted);
    };
    elem.addEventListener('DOMNodeInserted', Inserted);
    return elem;
  }
};

export default BaseComponent;
