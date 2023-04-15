const ComponentElement = class extends HTMLDivElement {
  connectedCallback() {
    this.onConnected();
  }
};
customElements.define('component-element', ComponentElement, { extends: 'div' });

export default 'component-element';
