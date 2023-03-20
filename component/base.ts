export type BaseTypes = {
  params?: string[]
  render(): any
  afterRender(): void
  create(): Element
}

const BaseComponent = class {
  params?: string[]
  buildingValues: object
  stateInit: boolean
  _state: {
    [x: string]: () => ({ val: any })
  }
  element: HTMLElement
  usedState: {
    [x: string]: {
      useBy: [
        {
          pos: any
          element: HTMLElement
        }
      ]
    }
  }

  constructor(buildingValues?: object) {
    this.buildingValues = buildingValues || {}
    this.stateInit = true
    this._state = {}
  }
  render(): any { }

  set state(states: object) {
    if (!this.stateInit) {
      Object.keys(states).forEach((newStateKey) => {
        this.usedState[newStateKey].useBy.forEach((user) => {
          if (typeof user.pos === 'string') {
            const posSplited = user.pos.split('.')
            const realElements = this.element.querySelectorAll(user.element.localName)
            realElements.forEach((realElement) => {
              if (realElement[posSplited[0]][posSplited[1]] === this._state[newStateKey]().val) {
                realElement[posSplited[0]][posSplited[1]] = states[newStateKey]
              }
            })
          } else {
            const realElements = this.element.querySelectorAll(`${user.pos.parent.localName}`)

            realElements.forEach((realElement) => {

              let isText = realElement.childNodes[user.pos.index].textContent
              if ((Number(isText) || isText) === this._state[newStateKey]().val) {
                realElement.childNodes[user.pos.index].textContent = states[newStateKey]
              }
            })
          }
        })
      })
    }
    Object.keys(states).forEach((stateKey) => {
      this._state[stateKey] = () => {
        return { val: states[stateKey], key: stateKey }
      }
    })
    this.stateInit = false
  }

  get state() {
    return this._state
  }

  afterRender(): void { }

  create(): Element {
    const r = this.render()
    const elem = r[0]
    this.usedState = r[1]
    setTimeout(() => {
      this.element = elem
      this.afterRender()
    })
    return elem
  }
}

export default BaseComponent
