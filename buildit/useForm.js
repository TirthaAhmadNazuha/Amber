import { BaseComponent, fullyPrepared } from '..';
import AmberJsx from '../amberJsx';

class Form extends BaseComponent {
  render() {
    return AmberJsx.createElement('form-amber', this.props, this.childs);
  }

  async onConnected() {
    const HandlerSubmit = async () => {
      if (!(this.props.headers instanceof Object)) {
        this.props.headers = {};
      }
      if (!(this.props.requestInit instanceof Object)) {
        this.props.requestInit = {};
      }
      const {
        method, headers, action, mapData, requestInit,
      } = this.props;
      if (action === undefined) {
        throw new Error('Action is required prop');
      }
      let data = {};
      this.element.querySelectorAll('input, textarea, select, button').forEach((child) => {
        if (child?.name?.length > 0) {
          data[child.name] = child.type === 'number' ? Number(child.value) : child.value;
        }
      });
      if (typeof mapData === 'function') {
        data = await mapData(data);
      }
      let res = null;
      if (method === 'get') {
        const querys = Object.keys(data).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
        res = await fetch(`${action}?${querys}}`, { method, headers, ...requestInit });
      } else {
        if (!headers['Content-Type']) {
          headers['Content-Type'] = 'application/json';
        }
        res = await fetch(action, {
          method, headers, body: JSON.stringify(data), ...requestInit,
        });
      }
      if (typeof this.props?.onResponse === 'function') this.props.onResponse(res);
    };
    await fullyPrepared();

    this.element.querySelectorAll('input').forEach((inp) => {
      inp.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) HandlerSubmit();
      });
    });
    this.element.querySelector('button[type="submit"]')?.addEventListener('click', HandlerSubmit);
  }
}

export default Form;
