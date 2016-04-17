'use strict';

(function() {

  var filtersForm = document.querySelector('.filters');
  var picturesContainer = document.querySelector('.pictures');

  /** @type {Array.<Object>} */
  var pictures = [];

  /** @enum {number} */
  var Filter = {
    'POPULARS': 'filter-popular',
    'NEWS': 'filter-new',
    'DISCUSSED': 'filter-discussed'
  };

  /** @constant {Filter} */
  var DEFAULT_FILTER = Filter.POPULARS;


  /** @constant {string} */
  var PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';

  var SECOND = 1000;
  var MINUTE = 60 * SECOND;
  var HOUR = 60 * MINUTE;
  var DAY = 24 * HOUR;

  if (!filtersForm.classList.contains('hidden')) {
    filtersForm.classList.add('hidden');
  }

  function getTemplateElement(data) {
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
  var renderPictures = function(elements) {
    picturesContainer.innerHTML = '';

    elements.forEach(function(picture) {
      picturesContainer.appendChild(getTemplateElement(picture));
    });
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

  var setFilterEnable = function(filter) {
    var filteredPictures = getFilteredPictures(pictures, filter);
    renderPictures(filteredPictures);
  };

  filtersForm.addEventListener('click', function(event) {
    switch (event.target.id) {
      case Filter.POPULARS:
        setFilterEnable(event.target.id);
        break;
      case Filter.NEWS:
        setFilterEnable(event.target.id);
        break;
      case Filter.DISCUSSED:
        setFilterEnable(event.target.id);
        break;
    }
  });

  getPictures(function(loadedPictures) {
    pictures = loadedPictures;
    setFilterEnable(DEFAULT_FILTER);
  });

  filtersForm.classList.remove('hidden');
})();
