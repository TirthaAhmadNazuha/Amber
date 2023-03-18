const AmberJsx = {

  /**
   * 
   * @param {string} tag 
   * @param {object} attr 
   * @param  {...HTMLElement} child 
   */
  createElement(tag, attr, ...childs) {
    const element = document.createElement(tag);
    let usedState = {};
    if (attr !== null) {
      Object.keys(attr).forEach((key) => {
        if (attr[key] instanceof Object) {
          Object.keys(attr[key]).forEach((property) => {
            if (typeof attr[key][property] === 'function') {
              element[key][property] = attr[key][property]().val;
              if (usedState[property]?.useBy?.length > 0) {
                usedState[property].useBy.push({ element, pos: `attr.${key}.${property}` });
              } else {
                usedState[property] = {
                  useBy: [
                    { element, pos: `${key}.${property}`, }
                  ]
                };
              }
            } else element[key][property] = attr[key][property];
          });
        } else {
          element.setAttribute(key, attr[key]);
        }
      });
    }
    childs.forEach((child, index) => {
      if (child[0] instanceof HTMLElement) {
        const childState = Object.keys(child[1]);
        if (childState.length > 0) {
          childState.forEach((cstate) => {
            if (usedState.hasOwnProperty(cstate)) {
              child[1][cstate].useBy.forEach((use) => {
                usedState[cstate].useBy.push(use);
              });
            } else {
              usedState[cstate] = child[1][cstate];
            }
          });
        }
        element.insertAdjacentElement('beforeend', child[0]);
      } else if (typeof child === 'function' && child()?.val !== undefined) {
        element.insertAdjacentText('beforeend', child().val);
        if (usedState[child().key]?.useBy?.length > 0) {
          usedState[child().key].useBy.push({
            element: element.childNodes[index],
            pos: {
              parent: element,
              index
            }
          });
        } else {
          usedState[child().key] = {
            useBy: [
              {
                element: element.childNodes[index],
                pos: {
                  parent: element,
                  index
                }
              }
            ]
          };
        }
      } else {
        element.insertAdjacentText('beforeend', child);
      }
    });
    return [element, usedState];
  }
};

export default AmberJsx;
