import { DOMCollection } from './dom-collection';
import { get, post } from './ajax';
import { DOMSelector, nodeMaker } from './dom';


window.make = function(tag, text = '') {
  return new DOMCollection([ nodeMaker(tag, text) ]);
} 

window.csrf = function()
{
  return $('meta[name="csrf"]').attr('value');
}

window._get = get;
window._post = post;

window.$ = function(selector)
{
  return new DOMCollection(DOMSelector(selector));
}

