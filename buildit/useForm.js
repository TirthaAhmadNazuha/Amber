import { BaseComponent, fullyPrepared } from '..'
import AmberJsx from '../amberJsx'

class Form extends BaseComponent {
  render() {
    return AmberJsx.createElement('form-amber', this.props, this.childs)
  }

  /**
   * 
   * @param {File} file 
   */
  static async fileToBase64(file) {
    const res = {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      base64: ''
    }
    const reader = new FileReader()
    res.base64 = await new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    res.base64 = res.base64.split('base64,', 2)[1]
    return res
  }

  async onConnected() {
    const HandlerSubmit = async () => {
      if (!(this.props.headers instanceof Object)) {
        this.props.headers = {}
      }
      if (!(this.props.requestInit instanceof Object)) {
        this.props.requestInit = {}
      }
      let {
        method, headers, action, mapData, requestInit,
      } = this.props
      if (action === undefined) {
        throw new Error('Action is required prop')
      }
      let res = null
      const keys = Object.keys(headers)
      const cpHeaders = headers
      headers = {}
      keys.forEach((k) => {
        headers[k.toLowerCase()] = cpHeaders[k]
      })
      if (headers['content-type'] == 'multipart/form-data') {
        const form = document.createElement('form')
        this.element.querySelectorAll('input, textarea, select').forEach(inp => {
          form.appendChild(inp.cloneNode(true))
        })
        delete headers['content-type']
        const formData = new FormData(form)
        res = await fetch(action, {
          method,
          headers,
          body: formData,
          ...requestInit
        })
      } else {
        let data = {}
        for (const child of this.element.querySelectorAll('input, textarea, select, button')) {
          if (child?.name?.length > 0) {
            if (child.type == 'file') {
              data[child.name] = await Promise.all(Array.from(child.files).map(Form.fileToBase64))
            } else {
              data[child.name] = child.type === 'number' ? Number(child.value) : child.value
            }
          }
        }
        if (typeof mapData === 'function') {
          data = await mapData(data)
        }
        if (method === 'get') {
          const querys = Object.keys(data).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&')
          res = await fetch(`${action}?${querys}}`, { method, headers, ...requestInit })
        } else {
          if (!headers['content-type']) {
            headers['content-type'] = 'application/json'
          }
          res = await fetch(action, {
            method, headers, body: JSON.stringify(data), ...requestInit,
          })
        }
      }
      if (typeof this.props?.onResponse === 'function') this.props.onResponse(res)
    }
    await fullyPrepared()

    this.element.querySelectorAll('input').forEach((inp) => {
      inp.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) HandlerSubmit()
      })
    })
    this.element.querySelector('button[type="submit"]')?.addEventListener('click', HandlerSubmit)
  }
}

export default Form
