import BaseComponent from './base';

const SyncComponent = class extends BaseComponent {
  constructor({ buildingValues }) {
    super({ buildingValues });
  }

  async loader() { }

  loadingElement() {
    const e = document.createElement('h2');
    e.innerText = 'Loading...';
    return [e];
  }

  errorElement(err) {
    return;
  }

  create() {
    const elem = document.createElement('div');
    elem.insertAdjacentElement('beforeend', this.loadingElement()[0]);
    setTimeout(async () => {
      if (typeof this.afterLoadingShow === 'function') this.afterLoadingShow();
      try {
        const dataLoaded = await this.loader();
        this.dataLoaded = dataLoaded;
        const r = this.render();
        elem.outerHTML = r[0].outerHTML;
        this.usedState = r[1];
        this.element = elem;
        this.afterRender();
      } catch (err) {
        elem.innerHTML = this.errorElement(err)[0].outerHTML;
      }
    });
    return elem;
  }
};

export default SyncComponent;
