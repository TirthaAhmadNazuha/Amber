const BaseComponent = class {
  /**
   * 
   * @param {string} nameElement Must 2 word and space using dash
   * @param {string} extend
   * @param {HTMLElement} defineConstructor
   */
  constructor({ buildingValues }) {
    this.buildingValues = buildingValues || {};
    this.stateInit = true;
    this._state = {};
  }
  /**
   *  
   * @returns {[HTMLElement, usedState]}
   */
  render() {
    return;
  }

  set state(states) {
    if (!this.stateInit) {
      Object.keys(states).forEach((newStateKey) => {
        this.usedState[newStateKey].useBy.forEach((user) => {
          if (typeof user.pos === 'string') {
            const posSplited = user.pos.split('.');
            const realElements = this.element.querySelectorAll(user.element.localName);
            realElements.forEach((realElement) => {
              if (realElement[posSplited[0]][posSplited[1]] === this._state[newStateKey]().val) {
                realElement[posSplited[0]][posSplited[1]] = states[newStateKey];
              }
            });
          } else {
            const realElements = this.element.querySelectorAll(`${user.pos.parent.localName}`);
            realElements.forEach((realElement) => {
              if ((Number(realElement.childNodes[user.pos.index].data) || realElement.childNodes[user.pos.index].data) === this._state[newStateKey]().val) {
                realElement.childNodes[user.pos.index].data = states[newStateKey];
              }
            });
          }
        });
      });
    }
    Object.keys(states).forEach((stateKey) => {
      this._state[stateKey] = () => {
        return { val: states[stateKey], key: stateKey };
      };
    });
    this.stateInit = null;
  }

  get state() {
    return this._state;
  }

  afterRender() { }

  create() {
    const r = this.render();
    const elem = r[0];
    this.usedState = r[1];
    setTimeout(() => {
      this.element = elem;
      this.afterRender();
    });
    return elem;
  }
};

export default BaseComponent;
