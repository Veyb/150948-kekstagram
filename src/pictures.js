'use strict';

(function() {

  var filtersForm = document.querySelector('.filters');
  var picturesContainer = document.querySelector('.pictures');

  /** @type {Array.<Object>} */
  var pictures = [];

  /** @type {Array.<Object>} */
  var filteredPictures = [];

  /** @enum {number} */
  var Filter = {
    'POPULARS': 'filter-popular',
    'NEWS': 'filter-new',
    'DISCUSSED': 'filter-discussed'
  };

  /** @constant {Filter} */
  var DEFAULT_FILTER = Filter.POPULARS;

  /** @constant {number} */
  var PAGE_SIZE = 12;

  /** @type {number} */
  var pageNumber = 0;

  /** @constant {string} */
  var PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';

  var SECOND = 1000;
  var MINUTE = 60 * SECOND;
  var HOUR = 60 * MINUTE;
  var DAY = 24 * HOUR;

  if (!filtersForm.classList.contains('hidden')) {
    filtersForm.classList.add('hidden');
  }

  function getTemplateElement(data, container) {
    var template = document.getElementById('picture-template');
    var element;

    if ('content' in template) {
      element = template.content.querySelector('.picture').cloneNode(true);
    } else {
      element = template.querySelector('.picture').cloneNode(true);
    }

    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    var previewImage = new Image();
    var templateImg = element.getElementsByTagName('IMG')[0];

    previewImage.onload = function() {
      templateImg.width = 182;
      templateImg.height = 182;
      templateImg.src = previewImage.src;
    };

    previewImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    previewImage.src = data.url;

    container.appendChild(element);
    return element;
  }

  /** @param {function(Array.<Object>)} callback */
  var getPictures = function(callback) {
    var xhr = new XMLHttpRequest();

    picturesContainer.classList.add('pictures-loading');

    /** @param {ProgressEvent} */
    xhr.onload = function(evt) {
      if (xhr.status === 200) {
        var loadedData = JSON.parse(evt.target.response);
        picturesContainer.classList.remove('pictures-loading');
        callback(loadedData);
      } else {
        picturesContainer.classList.remove('pictures-loading');
        picturesContainer.classList.add('pictures-failure');
      }
    };

    xhr.open('GET', PICTURES_LOAD_URL);
    xhr.send();
  };

  /** @param {Array.<Object>} elements */
  var renderPictures = function(elements, page) {
    var from = page * PAGE_SIZE;
    var to = from + PAGE_SIZE;

    elements.slice(from, to).forEach(function(picture) {
      getTemplateElement(picture, picturesContainer);
    });
  };

  var isBottomReached = function() {
    return document.body.offsetHeight - window.innerHeight - 100 <= document.body.scrollTop;
  };

  var isNextPageAvailable = function(elements, page, pageSize) {
    return page < Math.floor(elements.length / pageSize);
  };

  var renderNextPage = function(reset) {
    if (reset) {
      pageNumber = 0;
      picturesContainer.innerHTML = '';
      renderPictures(filteredPictures, pageNumber);
    }

    while (isBottomReached() &&
          isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
      pageNumber++;
      renderPictures(filteredPictures, pageNumber);
    }
  };

  var getFilteredPictures = function(elements, filter) {
    var picturesToFilter = pictures.slice(0);

    switch (filter) {
      case Filter.POPULARS:
        picturesToFilter = pictures;
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

  var setFilterEnabled = function(filter) {
    filteredPictures = getFilteredPictures(pictures, filter);
    renderNextPage(true);

    var currentFilter = document.getElementById(filter);
    currentFilter.setAttribute('checked', '');
  };

  filtersForm.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      setFilterEnabled(evt.target.id);
    }
  });

  var setScrollEnabled = function() {
    var scrollTimeout;

    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        renderNextPage();
      }, 100);
    });
  };

  getPictures(function(loadedPictures) {
    pictures = loadedPictures;
    setFilterEnabled(DEFAULT_FILTER);
    setScrollEnabled();
  });

  filtersForm.classList.remove('hidden');
})();
