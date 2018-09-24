import { DOMCollection } from './dom-collection';
import { get, post, put, _delete } from './ajax';
import { DOMSelector, nodeMaker } from './dom';


window.make = function(tag, text = '') {
  return new DOMCollection([ nodeMaker(tag, text) ]);
} 

window.csrf = function(value = false)
{
  if(value) {
    $('head>meta[name="csrf"]').attr('value', value);
  } else {
    return $('head>meta[name="csrf"]').attr('value');
  }
}

window._get = get;
window._post = post;
window._put = put;
window._delete = _delete;

window.$ = function(selector)
{
  const nodes = DOMSelector(selector);
  if(nodes.length) {
    return new DOMCollection(nodes);
  }
  return null;
}

