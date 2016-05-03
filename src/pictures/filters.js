'use strict';

var utils = require('../utils');
var render = require('./render');
var browserCookies = require('browser-cookies');

var SECOND = 1000;
var MINUTE = 60 * SECOND;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;

/** @enum {number} */
var Filter = {
  'POPULARS': 'filter-popular',
  'NEWS': 'filter-new',
  'DISCUSSED': 'filter-discussed'
};

var getFilteredPictures = function(elements, filter) {
  var picturesToFilter = elements.slice(0);

  switch (filter) {
    case Filter.POPULARS:
      picturesToFilter = elements;
      break;
    case Filter.NEWS:
      picturesToFilter.sort(function(a, b) {
        var firstDate = new Date(a.date);
        var secondDate = new Date(b.date);
        return secondDate - firstDate;
      });

      picturesToFilter = picturesToFilter.filter(function(element) {
        var filterPeriod = 14 * DAY;
        var actualDate = new Date();
        var minFilterDate = actualDate.valueOf() - filterPeriod;
        var filterDate = new Date(element.date);
        return filterDate.valueOf() > minFilterDate;
      });
      break;
    case Filter.DISCUSSED:
      picturesToFilter.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
  }

  return picturesToFilter;
};

var saveFilter = function(filterImage) {
  var actualDate = new Date();
  var actualYear = actualDate.getFullYear();
  var birthdayDate = new Date(actualYear, 11, 27);

  var filterList = filterImage.classList;
  var lastFilter = filterList[filterList.length - 1];

  if (birthdayDate > actualDate) {
    birthdayDate.setFullYear(actualYear - 1, 11, 27);
  }

  var cookieLifetime = Math.ceil((actualDate.valueOf() - birthdayDate.valueOf()) / DAY);

  browserCookies.set('saveFilter', lastFilter, {
    expires: cookieLifetime
  });
};

var getFilter = function(filterImage) {
  var filterNone = document.getElementById('upload-filter-none');
  var filterChrome = document.getElementById('upload-filter-chrome');
  var filterSepia = document.getElementById('upload-filter-sepia');

  var currentFilter = browserCookies.get('saveFilter');

  if (currentFilter) {
    if (currentFilter === 'filter-none') {
      filterNone.setAttribute('checked', '');
    }
    if (currentFilter === 'filter-chrome') {
      filterChrome.setAttribute('checked', '');
    }
    if (currentFilter === 'filter-sepia') {
      filterSepia.setAttribute('checked', '');
    }
  }
  return filterImage.classList.add(currentFilter);
};

var setFilterEnabled = function(filter) {
  utils.filteredPictures = getFilteredPictures(utils.pictures, filter);
  render.renderNextPage(true);

  var selectFilter = document.getElementById(filter);
  selectFilter.setAttribute('checked', '');
};

module.exports = {
  POPULARS: 'filter-popular',
  getFilteredPictures: getFilteredPictures,
  saveFilter: saveFilter,
  getFilter: getFilter,
  setFilterEnabled: setFilterEnabled
};
