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
            let parsed = 'PARSE_ERROR';
            try {
              parsed = JSON.parse(this.xhttp.responseText);
            } catch (e) {
              console.error('Response could not be parsed to JSON: ', this.xhttp.responseText);
            }
            resolve(parsed, this.xhttp.status);
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
    if(this.method === 'GET') {
      if(this.query) {
        this.open('GET', this.url + '?' + this.makeQuery());
      } else {
        this.open('GET', this.url);
      }
      this.send();
    } else {
      this.xhttp.open('POST', this.url);
      this.xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      this.xhttp.send(this.makeQuery());
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
    const metaCSRF = $('head>meta[name="csrf"]');
    if(metaCSRF && this.isLocal && this.method === 'POST') {
      if(!this.query) {
        this.query = { _csrf : metaCSRF.attr('value') };
      } else {
        this.query._csrf = metaCSRF.attr('value');
      }
    }
    let query = [];
    for(let key in this.query) {
      query.push(encodeURIComponent(key) + '=' + encodeURIComponent(this.query[key]));
    }
    return query.join('&');
  }
}


export function put(url, query = false, toJSON = true) 
{
  if(!query) {
    query = { _method : 'PUT' };
  } else {
    query._method = 'PUT';
  }

  const ajax = new Ajax(url, 'POST', query, toJSON);

  return ajax.execute();
}

export function _delete(url, query = false, toJSON = true) 
{
  if(!query) {
    query = { _method : 'DELETE' };
  } else {
    query._method = 'DELETE';
  }

  const ajax = new Ajax(url, 'POST', query, toJSON);

  return ajax.execute();
}

export function get(url, query = false, toJSON = true) 
{
  const ajax = new Ajax(url, 'GET', query, toJSON);

  return ajax.execute();
}

export function post(url, query = false, toJSON = true)
{
  const ajax = new Ajax(url, 'POST', query, toJSON);

  return ajax.execute();
}

