import CryptoJS from 'crypto-js';
import https from 'https';

class Tomo {

  constructor({ clientId, secretKey }) {
    this.clientId = clientId;
    this.secretKey = secretKey;
  }

  /**
   * @param {Object} params
   * @param {Array<Number>} params.center
   * @param {Number} params.radius
   * @param {Array<String>} [params.tags]
   **/
  search(params, success, error) {
    return this._makeRequest({
      query: params,
      path: 'api/v2/search',
      success,
      error,
    });
  }

  // PRIVATE

  _makeRequest({ path, query, success, error }) {
    path = `/${path}`;
    const queryString = this._createQueryString(query);
    if (queryString.length > 0) {
      path += `?${queryString}`;
    }
    const requestBody = JSON.stringify({});
    const hmac = CryptoJS.HmacSHA256(`${path}-${requestBody}`, this.secretKey).toString(CryptoJS.enc.Hex);

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'RT-ORG-APP-CLIENT-ID': this.clientId,
        'RT-ORG-APP-HMAC': hmac,
      },
      host: 'api.roadtrippers.com',
      method: 'GET',
      path: path,
    };

    const request = https.request(options, function (response) {
      let responseBody = '';

      response.on('data', function(chunk) {
        responseBody += chunk;
      });

      response.on('error', function(error) {
        error(error);
      });

      response.on('end', function() {
        const json = JSON.parse(responseBody);
        success(json);
      });
    });
    request.end();
  }

  /**
   * @param {Object} params
   */
  _createQueryString(query) {
    return Object.keys(query).reduce(function (pairs, name) {
      const value = query[name];
      if (value) {
        pairs.push(`${name}=${value}`);
      }
      return pairs;
    }, []).join('&');
  }
}

export default Tomo;
