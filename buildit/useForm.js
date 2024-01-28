import { BaseComponent, fullyPrepared } from '..';
import AmberJsx from '../amberJsx';

class Form extends BaseComponent {
  render() {
    return AmberJsx.createElement('form-amber', this.props, this.childs);
  }

  async onConnected() {
    const HandlerSubmit = async () => {
      const {
        method, headers, action, mapData,
      } = this.props;
      let data = {};
      this.element.querySelectorAll('input').forEach((child) => {
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
        res = await fetch(`${action}?${querys}}`, { method, headers });
      } else {
        res = await fetch(action, { method, headers, body: JSON.stringify(data) });
      }
      if (typeof this.props?.onResponse === 'function') this.props.onResponse(res);
    };
    await fullyPrepared();

    this.element.querySelector('button[type="submit"]').addEventListener('click', HandlerSubmit);
  }
}

export default Form;
