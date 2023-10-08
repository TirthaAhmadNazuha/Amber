import AmberJsx from '../amberJsx';

function Form(props, childs) {
  const elem = AmberJsx.createElement('form-amber', props, childs);
  const { action, method, headers } = {
    action: props?.action || '/',
    headers: props?.headers,
    method: (props?.method || 'get').toLowerCase(),
  };

  const HandlerSubmit = async () => {
    const data = {};
    childs.forEach((child) => {
      if (child?.name?.length > 0) {
        data[child.name] = child.type === 'number' ? Number(child.value) : child.value;
      }
    });
    let res = null;
    if (method === 'get') {
      const querys = Object.keys(data).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
      res = await fetch(`${action}?${querys}}`, { method, headers });
    } else {
      res = await fetch(action, { method, headers, body: JSON.stringify(data) });
    }
    if (typeof props?.onResponse === 'function') props.onResponse(res);
  };

  childs.forEach((child) => {
    // eslint-disable-next-line default-case
    switch (child.tagName.toLowerCase()) {
      case 'button':
        child.addEventListener('click', () => {
          HandlerSubmit();
        });
        break;
      case 'input':
        child.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') HandlerSubmit();
        });
    }
  });
  return elem;
}

export default Form;
