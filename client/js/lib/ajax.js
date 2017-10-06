
export default {

  /**
   * @param {Object} params
   */
  createQueryString: function (params) {
    return Object.keys(params).reduce(function (pairs, name) {
      if (params[name]) {
        pairs.push(`${name}=${params[name]}`);
      }
      return pairs;
    }, []).join('&');
  },

  /**
   * @param {String} url
   * @return {Object} result
   * @return {Promise<Function(XMLHttpRequest.response), Function(XMLHttpRequest)>} result.promise
   * @return {XMLHttpRequest} result.xhr
   */
  getJSON: function (url) {
    const xhr = new XMLHttpRequest();
    const promise = new Promise(function (resolve, reject) {
      const handleError = function (event) {
        reject(event.currentTarget);
      }
      const handleLoad = function (event) {
        const xhr = event.currentTarget;
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(xhr);
        }
      };
      xhr.addEventListener('load', handleLoad, false);
      xhr.addEventListener('error', handleError, false);
      xhr.open('GET', url);
      xhr.send();
    });
    return {
      promise: promise,
      xhr: xhr
    };
  }
};
