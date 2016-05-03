'use strict';

var utils = require('../utils');
var gallery = require('../gallery');
var counter = 0;

function getTemplateElement(data, container, idNumber) {
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
    templateImg.id = idNumber;
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
      index = evt.target.id;
      evt.preventDefault();
      gallery.setGalleryPictures(list);
      gallery.showGallery(index);
    } else {
      evt.preventDefault();
    }
  });

  container.appendChild(element);
  return element;
}

// var Photo = function(data, container) {
//   this.data = data;
//   this.element = getTemplateElement(data, container, counter);
//   this.onPhotoClick = function(evt) {
//     var list = utils.filteredPictures;
//     var index = 0;
//
//     if (evt.target.nodeName === 'IMG') {
//       index = evt.target.id;
//       evt.preventDefault();
//       gallery.setGalleryPictures(list);
//       gallery.showGallery(index);
//     } else {
//       evt.preventDefault();
//     }
//   };
//
//   this.remove = function() {
//     this.element.addEventListener('click', this.onPhotoClick);
//     this.element.parentNode.removeChild(this.element);
//   };
//
//   this.element.addEventListener('click', this.onPhotoClick);
//   container.appendChild(this.element);
// };

/** @param {Array.<Object>} elements */
var renderPictures = function(elements, page) {
  var from = page * utils.PAGE_SIZE;
  var to = from + utils.PAGE_SIZE;

  elements.slice(from, to).forEach(function(picture) {
    getTemplateElement(picture, utils.picturesContainer, counter);
    // utils.renderedPictures.push(new Photo(picture, utils.picturesContainer));
    counter++;
  });
};

var renderNextPage = function(reset) {
  if (reset) {
    utils.pageNumber = 0;
    utils.picturesContainer.innerHTML = '';
    // utils.renderedPictures.forEach(function(picture) {
    //   picture.remove();
    // });
    // utils.renderedPictures = [];
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
  // Photo: Photo
};
