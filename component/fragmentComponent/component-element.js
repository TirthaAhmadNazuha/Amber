const ComponentElement = class extends HTMLDivElement {
  anyRunFunc() {
    try {
      this?.setStateUser();
    } catch (_) {
      // Ignore
    }
  }

  connectedCallback() {
    this.onConnected();
    this.anyRunFunc();
  }
};
customElements.define('component-element', ComponentElement, { extends: 'div' });

export default 'component-element';
