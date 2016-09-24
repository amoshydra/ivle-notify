const Promise = require('promise');
const request = require('request');
const low = require("lowdb");

const LAPI_KEY = require('../data/config');

var Requester = {
  requestJson: function(service, requestParams) {
    let requestUrl = this.createModuleUrl(service, requestParams);

    return new Promise(function (fulfill, reject) {
      request(requestUrl, function (error, response, body) {
        if (error) {
          return reject(error);
        } else if (response.statusCode !== 200) {
          error = new Error("Unexpected status code: " + response.statusCode);
          error.response = response;
          return reject(error);
        }
        fulfill(JSON.parse(body));
      });
    });
  },

  createModuleUrl: function(service, requestParams) {
    let authObj = {
      apikey: LAPI_KEY,
      token: getUserToken()
    }

    let ivleUrl = `https://ivle.nus.edu.sg/api/Lapi.svc/${service}`;
    let authInfo = `?APIKey=${authObj.apikey}&AuthToken=${authObj.token}`;

    let completeUrl = ivleUrl + authInfo;
    for (var key in requestParams) {
      completeUrl += `&${key}=${requestParams[key]}`;
    }
    return completeUrl;
  }
};

var getUserToken = function getUserToken() {
  return low('./data/userdb.json')
            .get('user.authToken')
            .value();
}

module.exports = Requester;
