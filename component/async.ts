import BaseComponent from './base'

export type SyncTypes = {
  dataLoaded: any
  afterLoadingShow?: VoidFunction
  render(): any
  afterRender(): void
  create(): Element
  loader(): Promise<any>
  loadingElement(): any
  errorElement(): any
}

const SyncComponent = class extends BaseComponent {
  dataLoaded: any
  afterLoadingShow?: VoidFunction

  constructor({ buildingValues }) {
    super({ buildingValues })
  }

  async loader(): Promise<any> { }

  loadingElement() {
    const e = document.createElement('h2')
    e.innerText = 'Loading...'
    return [e]
  }

  errorElement(err: string) {
    return
  }

  create() {
    const elem = document.createElement('div')
    elem.insertAdjacentElement('beforeend', this.loadingElement()[0])
    setTimeout(async () => {
      if (typeof this.afterLoadingShow === 'function') this.afterLoadingShow()
      try {
        const dataLoaded = await this.loader()
        this.dataLoaded = dataLoaded
        const r = this.render()
        elem.outerHTML = r[0].outerHTML
        this.usedState = r[1]
        this.element = elem
        this.afterRender()
      } catch (err) {
        elem.innerHTML = this.errorElement(err)[0].outerHTML
      }
    })
    return elem
  }
}

export default SyncComponent
