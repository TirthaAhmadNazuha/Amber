import BaseComponent from '../component/base';
import { isIterable } from '../typeChecker';

const IfClasses = class extends BaseComponent {
  Else(_, childs) {
    Object.defineProperty(childs, 'conditionsIs', {
      value: 'else',
    });
    return childs;
  }

  Elif(props, childs) {
    Object.defineProperty(childs, 'conditionsIs', {
      value: 'elif',
    });
    if (props.condition) {
      return childs;
    }
  }

  render() {
    if (this.props?.condition) {
      const output = [];
      this.childs.forEach((c) => {
        if (c instanceof Array && c.conditionsIs === undefined) {
          output.push(c);
        } else if (!isIterable(c) && c !== undefined) {
          output.push(c);
        }
      });
      return output;
    }
    const elifs = [];
    let findedElseConditions = null;
    this.childs.forEach((child) => {
      if (child?.conditionsIs === 'elif') {
        elifs.push(child);
      }
      if (child?.conditionsIs === 'else') {
        findedElseConditions = child;
      }
    });
    if (elifs.length > 0) {
      return elifs[0];
    }

    if (findedElseConditions != null) {
      return findedElseConditions;
    }
    return new Text('ini false');
  }
};

const If = new IfClasses();

export default If;
