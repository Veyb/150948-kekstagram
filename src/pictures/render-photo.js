'use strict';

var utils = require('../utils');

var Photo = function(data, container) {
  this.data = data;
  // this.container = container;
  this.getTemplateElement(data, utils.counter);
  this.onPhotoClick = this.onPhotoClick.bind(this);

  this.element.addEventListener('click', this.onPhotoClick);
  container.appendChild(this.element);
};

Photo.prototype.onPhotoClick = function(evt) {
  var list = utils.filteredPictures;
  var index = 0;

  if (evt.target.nodeName === 'IMG') {
    index = evt.target.id;
    evt.preventDefault();
    window.location.hash = 'photo/' + list[index].url;
  } else {
    evt.preventDefault();
  }
};


Photo.prototype.getTemplateElement = function(data, idNumber) {
  var template = document.getElementById('picture-template');

  if ('content' in template) {
    this.element = template.content.querySelector('.picture').cloneNode(true);
  } else {
    this.element = template.querySelector('.picture').cloneNode(true);
  }

  this.element.querySelector('.picture-comments').textContent = data.comments;
  this.element.querySelector('.picture-likes').textContent = data.likes;

  var previewImage = new Image();
  var templateImg = this.element.getElementsByTagName('IMG')[0];

  previewImage.onload = function() {
    templateImg.id = idNumber;
    templateImg.width = utils.IMAGE_SIZE;
    templateImg.height = utils.IMAGE_SIZE;
    templateImg.src = previewImage.src;
  };

  previewImage.onerror = function() {
    templateImg.classList.add('picture-load-failure');
  };

  previewImage.src = data.url;

  return this.element;
};

Photo.prototype.remove = function() {
  this.element.removeEventListener('click', this.onPhotoClick);
  this.element.parentNode.removeChild(this.element);
};

module.exports = Photo;
