
export function DOMSelector(selector, parent = false) {
  if(!parent) parent = document;
  switch(getSelectMethod(selector)) {
    case 'id': 
      const node = document.getElementById(selector.substr(1));
      return node ? [node] : [];
    case 'class': 
      return parent.getElementsByClassName(selector.substr(1));
    default: 
      return parent.querySelectorAll(selector);
  }
}

function getSelectMethod(selector) {
  const pattern = /[^a-zA-Z0-9\-_]/;
  if(!pattern.test(selector.substr(1))) {
    if(selector.charAt(0) === '#') {
      return 'id';
    } else if(selector.charAt(0) === '.') {
      return 'class';
    } else {
      return 'query';
    }
  } else {
    return 'query';
  }
}

export function nodeMaker(tag, text) {
  const args = tag.split('.');
  let id = false;
  if(args[0].includes('#')) {
    args[0] = args[0].split('#');
    id = args[0][1];
    tag = args[0][0];
  } else {
    tag = args[0];
  }
  const node = document.createElement(tag);
  node.innerText = text;
  if(id) {
    node.setAttribute('id', id);
  }
  for(let i = 1; i < args.length; i++) {
    node.classList.add(args[i]);
  }
  return node;
}