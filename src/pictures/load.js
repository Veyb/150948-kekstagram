'use strict';

var utils = require('../utils');

/** @param {function(Array.<Object>)} callback */
var getPictures = function(url, callback) {
  var xhr = new XMLHttpRequest();

  utils.picturesContainer.classList.add('pictures-loading');

  /** @param {ProgressEvent} */
  xhr.onload = function(evt) {
    if (xhr.status === 200) {
      var loadedData = JSON.parse(evt.target.response);
      utils.picturesContainer.classList.remove('pictures-loading');
      callback(loadedData);
    } else {
      utils.picturesContainer.classList.remove('pictures-loading');
      utils.picturesContainer.classList.add('pictures-failure');
    }
  };

  xhr.open('GET', url);
  xhr.send();
};

module.exports = getPictures;
