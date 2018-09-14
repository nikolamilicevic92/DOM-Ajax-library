/**
 * This class is a wrapper around the built in XMLHttpRequest API.
 */

class Ajax 
{
  constructor(url, method, query, toJSON = true)
  {
    this.xhttp = new XMLHttpRequest();
    this.protocol = window.location.protocol + '//';
    this.host = window.location.host + '/';
    this.isLocal = false;
    this.url = this.makeURL(url);
    this.method = method;
    this.parseToJSON = toJSON;
    this.query = query;
  }

  execute()
  {
    return new Promise((resolve, reject) => {
      this.xhttp.onreadystatechange = () => {
        if(this.xhttp.readyState == 4) {
          if(this.parseToJSON) {
            resolve(JSON.parse(this.xhttp.responseText), this.xhttp.status);
          } else {
            resolve(this.xhttp.responseText, this.xhttp.status);
          }
        }
      }
      this.sendRequest();
    });
  }

  sendRequest()
  {
    if(this.method === 'GET' && this.query.length) {
      this.url += '?' + this.makeQuery();
    }
    this.xhttp.open(this.method, this.url);
    if(['POST', 'PUT', 'PATCH'].includes(this.method)) {
      this.xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      this.xhttp.send(this.makeQuery());
    } else {
      this.xhttp.send();
    }
  }

  makeURL(url)
  {
    if(url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    this.isLocal = true;
		if(url.startsWith('/')) {
			return this.protocol + this.host + url.substring(1);
    }
    return this.protocol + this.host + url;
  }
  
  makeQuery()
  {
    let query = this.isLocal ? ['_csrf=' + csrf()] : [];
    for(let key in this.query) {
      query.push(encodeURIComponent(key) + '=' + encodeURIComponent(this.query[key]));
    }
    return query.join('&');
  }

}

export function get(url, query = {}, toJSON = true) 
{
  const ajax = new Ajax(url, 'GET', query, toJSON);

  return ajax.execute();
}

export function post(url, query = {}, toJSON = true)
{
  const ajax = new Ajax(url, 'POST', query, toJSON);

  return ajax.execute();
}

