import ajax from './ajax';

class Tomo {

  constructor({ proxyUrl }) {
    this.proxyUrl = proxyUrl;
  }

  /**
   * @param {Object} params
   * @param {Array<Number>} params.center
   * @param {Number} params.radius
   * @param {Array<String>} [params.tags]
   **/
  search(params) {
    return this._makeRequest({
      params: params,
      path: 'search'
    });
  }

  // PRIVATE

  _makeRequest({ params, path }) {
    const queryString = ajax.createQueryString(Object.assign({}, params, {
      client_id: this.clientId
    }));
    const url = `${this.proxyUrl}/${path}?${queryString}`;
    return ajax.getJSON(url);
  }
}

export default Tomo;
