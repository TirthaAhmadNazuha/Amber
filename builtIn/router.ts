import AmberJsx from "../amber-jsx"
import BaseComponent, { BaseTypes } from "../component/base"
import { SyncTypes } from "../component/async"

type routersTypes = [
  {
    path: string
    element: (BaseTypes | SyncTypes)
    root: Element
  }
]

const Router = class extends BaseComponent {
  routers: routersTypes
  _root: Element
  constructor(routers: routersTypes) {
    super()
    this.routers = routers
  }

  start(): void {
    const result = this.routers.find((router) => {
      if (!router.path.startsWith('/')) router.path = '/' + router.path
      if (window.location.pathname === router.path) {
        return router
      }
    })
    if (result) {
      if (this._root) {
        this.root.innerHTML = ''
        this.root.insertAdjacentElement('beforeend', result.element.create())
        console.log(result)
      }
    } else {
      console.error('not found')
    }
  }

  set root(root) {
    this._root = root
    this.start()
  }
  get root() {
    return this._root
  }

}

export default Router
