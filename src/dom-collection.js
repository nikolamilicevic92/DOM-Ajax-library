import { DOMSelector } from './dom';

export class DOMCollection
{
  constructor(nodes)
  {
    this.nodes = nodes;
  }


  empty()
  {
    this.html('');
    return this;
  }

  get(selector)
  {
    const nodes = DOMSelector(selector, this.nodes[0]);
    if(nodes.length) {
      return new DOMCollection(nodes);
    }
    return null;
  }

  prepend(nodes)
  {
    const firstChild = this.nodes[0].childNodes[0];
    nodes.forEach(node => {
      if(node instanceof DOMCollection) {
        this.nodes[0].insertBefore(node.nodes[0], firstChild);
      } else {
        this.nodes[0].insertBefore(node, firstChild);
      }
    })
    return this;
  }

  append(nodes)
  {
    if(nodes.constructor === Array) {
      nodes.forEach(node => {
        if(node instanceof DOMCollection) {
          this.nodes[0].appendChild(node.nodes[0]);
        } else {
          this.nodes[0].appendChild(node);
        }
      })
    } else {
      const node = nodes;
      if(node instanceof DOMCollection) {
        this.nodes[0].appendChild(node.nodes[0]);
      } else {
        this.nodes[0].appendChild(node);
      }
    }
   
    return this;
  }

  appendTo(parent)
  {
    if(parent instanceof DOMCollection) {
      this.each(node => parent.nodes[0].appendChild(node.dom()));
    } else {
      this.each(node => parent.appendChild(node.dom()));
    }
    return this;
  }

  text(text = false)
  {
    if(text) {
      for(let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].textContent = text;
      }
    } else {
      if(this.nodes.length == 1) {
        return this.nodes[0].textContent;
      } else {
        const texts = [];
        for(let i = 0; i < this.nodes.length; i++) {
          texts.push(this.nodes[i].textContent);
        }
        return texts;
      }
    }
    return this;
  }

  html(html = false)
  {
    if(html) {
      for(let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].innerHTML = html;
      }
    } else {
      if(this.nodes.length == 1) {
        return this.nodes[0].innerHTML;
      } else {
        const texts = [];
        for(let i = 0; i < this.nodes.length; i++) {
          texts.push(this.nodes[i].innerHTML);
        }
        return texts;
      }
    }
    return this;
  }

  value(value = false)
  {
    if(value) {
      for(let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].value = value;
      }
    } else {
      if(this.nodes.length == 1) {
        return this.nodes[0].value;
      } else {
        const values = [];
        for(let i = 0; i < this.nodes.length; i++) {
          values.push(this.nodes[i].value);
        }
        return values;
      }
    }
    return this;
  }

  dom()
  {
    return this.nodes.length === 1 ? this.nodes[0] : this.nodes;
  }

  hide()
  {
    this.each(node => {
      node.addClass('hidden');
      node.css({display: 'none'});
    })
    return this;
  }

  show()
  {
    this.each(node => {
      node.removeClass('hidden');
      node.css({display: null});
    })
    return this;
  }

  hasClass(className)
  {
    return this.nodes[0].classList.contains(className);
  }

  addClass(className)
  {
    for(let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].classList.add(className);
    }
    return this;
  }

  removeClass(className)
  {
    for(let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].classList.remove(className);
    }
    return this;
  }
 
  toggleClass(className)
  {
    for(let i = 0; i < this.nodes.length; i++) {
      if(this.nodes[i].classList.contains(className)) {
        this.nodes[i].classList.remove(className);
      } else {
        this.nodes[i].classList.add(className);
      }
    }
    return this;
  }

  die()
  {
    this.each(wrapper => {
      const node = wrapper.dom();
      node.parentNode.removeChild(node);
    });
  }

  remove(node)
  {
    this.each(wrapper => {
      if(node instanceof DOMCollection) {
        node.each(single => {
          wrapper.dom().removeChild(single.dom());
        });
      } else {
        wrapper.dom().removeChild(node);
      }
    });
  }

  each(closure)
  {
    if(this.nodes.length === 1) {
      closure(this, 0);
    } else {
      for(let i = 0; i < this.nodes.length; i++) {
        closure(new DOMCollection([this.nodes[i]]), i);
      }
    }
    return this;
  }


  css(styles)
  {
    this.each(node => {
      for(let property in styles) {
        node.dom().style[property] = styles[property];
      }
    });
    return this;
  }

  attr(name, value = false)
  {
    if(value) {
      this.each(node => node.dom().setAttribute(name, value));
    } else {
      if(this.nodes.length == 1) {
        return this.nodes[0].getAttribute(name);
      } else {
        const attrs = [];
        this.each(node => attrs.push(node.dom().getAttribute(name)));
        return attrs;
      }
    }
    return this;
  }

  on(event, closure, delay = 0)
  {
    this.each(node => { 
      let timeoutHandle;
      node.dom().addEventListener(event, ev => {
        if(delay) {
          clearTimeout(timeoutHandle);
          timeoutHandle = setTimeout(() => closure(node, ev), delay);
        } else {
          closure(node, ev)
        }
      });
    });
    return this;
  }

  slideDown()
  {
    this.each(node => {
      node.dom().style.maxHeight = node.dom().scrollHeight + 'px';
    });
    return this;
  }

  toggleSlide()
  {
    this.each(node => {
      if(node.dom().style.maxHeight){
        node.dom().style.maxHeight = null;
      } else {
        node.dom().style.maxHeight = node.dom().scrollHeight + "px";
      } 
    });
    return this;
  }

  slideUp()
  {
    this.each(node => {
      node.dom().style.maxHeight = null;
    });
    return this;
  }
}