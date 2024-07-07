import { isIterable } from '../typeChecker';
import { onConnectedCallback } from '../mutation'

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
    this.element = this.render();
  }
  onConnected() { }

  create() {
    const elem = this.element || this.render();
    if (typeof this.onConnected == 'function') {
      if (isIterable(elem)) {
        const textForGettingPosition = new Text();
        textForGettingPosition.isElementFragment = elem;
        const DOMNodeInserted = () => {
          this.parent = textForGettingPosition.parentElement;
          textForGettingPosition.replaceWith(...elem);
          this.element = elem;
          this.onConnected();
        };
        onConnectedCallback(textForGettingPosition, DOMNodeInserted)
        console.log('return', textForGettingPosition)
        return textForGettingPosition;
      }
      onConnectedCallback(elem, (elem) => {
        this.parent = elem.parentElement
        this.element = elem
        this.onConnected()
      })

    }
    return elem;
  }
};

export default BaseComponent;
