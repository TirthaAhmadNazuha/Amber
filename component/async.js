import BaseComponent from './base';
import AmberJsx from '../amber-jsx';

const SyncComponent = class extends BaseComponent {
  constructor({ buildingValues }) {
    super({ buildingValues });
  }
  /**
   * @param {() => Promise} loader
   */
  loaderData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });
  }

  loading() {
    const e = document.createElement('h2');
    e.innerText = 'Loading...';
    return [e];
  }

  error() {
    return;
  }

  create() {
    const elem = document.createElement('div');
    elem.insertAdjacentElement('beforeend', this.loading()[0]);
    setTimeout(async () => {
      try {
        const dataLoaded = await this.loaderData();
        this.dataLoaded = dataLoaded;
        const r = this.render();
        elem.outerHTML = r[0].outerHTML;
        this.usedState = r[1];
        this.element = elem;
        this.afterRender();
      } catch (err) {
        elem.innerHTML = this.error(err)[0].outerHTML;
      }
    });
    return elem;
  }
};

export default SyncComponent;
