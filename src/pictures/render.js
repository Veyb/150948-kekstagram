'use strict';

var utils = require('../utils');
var gallery = require('../gallery');

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
    templateImg.width = utils.IMAGE_SIZE;
    templateImg.height = utils.IMAGE_SIZE;
    templateImg.src = previewImage.src;
  };

  previewImage.onerror = function() {
    element.classList.add('picture-load-failure');
  };

  previewImage.src = data.url;

  element.addEventListener('click', function(evt) {
    var list = utils.filteredPictures;
    var index = 0;

    if (evt.target.nodeName === 'IMG') {
      for (var i = 0; i < list.length; i++) {
        if (data.url === list[i].url) {
          index = i;
        }
      }
      evt.preventDefault();
      gallery.showGallery(list, index);
    } else {
      evt.preventDefault();
    }
  });

  container.appendChild(element);
  return element;
}

/** @param {Array.<Object>} elements */
var renderPictures = function(elements, page) {
  var from = page * utils.PAGE_SIZE;
  var to = from + utils.PAGE_SIZE;

  elements.slice(from, to).forEach(function(picture) {
    getTemplateElement(picture, utils.picturesContainer);
  });
};

var renderNextPage = function(reset) {
  if (reset) {
    utils.pageNumber = 0;
    utils.picturesContainer.innerHTML = '';
    renderPictures(utils.filteredPictures, utils.pageNumber);
  }

  while (utils.isBottomReached() &&
        utils.isNextPageAvailable(utils.pictures, utils.pageNumber, utils.PAGE_SIZE)) {
    utils.pageNumber++;
    renderPictures(utils.filteredPictures, utils.pageNumber);
  }
};

module.exports = {
  getTemplateElement: getTemplateElement,
  renderPictures: renderPictures,
  renderNextPage: renderNextPage
};
