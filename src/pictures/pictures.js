'use strict';

var utils = require('../utils');
var load = require('./load');
var filters = require('./filters');
var render = require('./render');

var filtersForm = document.querySelector('.filters');

/** @constant {Filter} */
var DEFAULT_FILTER = filters.POPULARS;

/** @constant {string} */
var PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';

if (!filtersForm.classList.contains('hidden')) {
  filtersForm.classList.add('hidden');
}

filtersForm.addEventListener('click', function(evt) {
  if (evt.target.classList.contains('filters-radio')) {
    filters.setFilterEnabled(evt.target.id);
  }
});

var setScrollEnabled = function() {
  var scrollTimeout;

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      render.renderNextPage();
    }, 100);
  });
};

load(PICTURES_LOAD_URL, function(loadedPictures) {
  utils.pictures = loadedPictures;
  filters.setFilterEnabled(DEFAULT_FILTER);
  setScrollEnabled();
});

filtersForm.classList.remove('hidden');
