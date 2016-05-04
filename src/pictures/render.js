'use strict';

var utils = require('../utils');
var renderPhoto = require('./render-photo');

/** @param {Array.<Object>} elements */
var renderPictures = function(elements, page) {
  var from = page * utils.PAGE_SIZE;
  var to = from + utils.PAGE_SIZE;

  elements.slice(from, to).forEach(function(picture) {
    utils.renderedPictures.push(new renderPhoto.Photo(picture, utils.picturesContainer));
    utils.counter++;
  });
};

var renderNextPage = function(reset) {
  if (reset) {
    utils.pageNumber = 0;
    utils.counter = 0;
    utils.renderedPictures.forEach(function(picture) {
      picture.remove();
    });
    utils.renderedPictures = [];
    renderPictures(utils.filteredPictures, utils.pageNumber);
  }

  while (utils.isBottomReached() &&
        utils.isNextPageAvailable(utils.pictures, utils.pageNumber, utils.PAGE_SIZE)) {
    utils.pageNumber++;
    renderPictures(utils.filteredPictures, utils.pageNumber);
  }
};

module.exports = {
  renderNextPage: renderNextPage
};
