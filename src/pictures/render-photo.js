'use strict';

var utils = require('../utils');
var gallery = require('../gallery');

function getTemplateElement(data, idNumber) {
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

  return element;
}

var Photo = function(data, container) {
  this.data = data;
  this.element = getTemplateElement(data, utils.counter);
  this.onPhotoClick = function(evt) {
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
  };

  this.remove = function() {
    this.element.addEventListener('click', this.onPhotoClick);
    this.element.parentNode.removeChild(this.element);
  };

  this.element.addEventListener('click', this.onPhotoClick);
  container.appendChild(this.element);
};

module.exports = {
  Photo: Photo
};
