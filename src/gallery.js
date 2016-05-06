'use strict';

var Gallery = function() {
  this.galleryContainer = document.querySelector('.gallery-overlay');
  this.galleryClose = this.galleryContainer.querySelector('.gallery-overlay-close');
  this.galleryImage = this.galleryContainer.querySelector('.gallery-overlay-image');
  this.galleryLikes = this.galleryContainer.querySelector('.likes-count');
  this.galleryComments = this.galleryContainer.querySelector('.comments-count');
  this.galleryPictures = [];
  this.currentPictureIndex = 0;

  this._onPhotoClick = this._onPhotoClick.bind(this);
  this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  this._onCloseClick = this._onCloseClick.bind(this);
  this._onContainerClick = this._onContainerClick.bind(this);

  window.addEventListener('hashchange', this._onHashChange.bind(this));
};


Gallery.prototype.setGalleryPictures = function(pictures) {
  this.galleryPictures = pictures;
  return this.galleryPictures;
};

Gallery.prototype.showGalleryPicture = function() {
  var currentPicture = this.galleryPictures[this.currentPictureIndex];

  this.galleryImage.src = currentPicture.url;
  this.galleryLikes.textContent = currentPicture.likes;
  this.galleryComments.textContent = currentPicture.comments;
};

Gallery.prototype.showGallery = function(hash) {
  if (typeof hash === 'number') {
    this.currentPictureIndex = hash;
  }
  if (typeof hash === 'string') {
    this.currentPictureIndex = this.galleryPictures.findIndex(function(picture) {
      return hash.indexOf(picture.url) !== -1;
    });
  }
  this.showGalleryPicture();
  this.galleryImage.addEventListener('click', this._onPhotoClick);
  document.addEventListener('keydown', this._onDocumentKeyDown);
  this.galleryClose.addEventListener('click', this._onCloseClick);
  this.galleryContainer.addEventListener('click', this._onContainerClick);

  this.galleryContainer.classList.remove('invisible');
};

Gallery.prototype.hideGallery = function() {
  this.galleryImage.removeEventListener('click', this._onPhotoClick);
  document.removeEventListener('keydown', this._onDocumentKeyDown);
  this.galleryClose.removeEventListener('click', this._onCloseClick);
  this.galleryContainer.removeEventListener('click', this._onContainerClick);

  this.galleryContainer.classList.add('invisible');
  history.pushState(null, null, window.location.pathname);
};

Gallery.prototype._onHashChange = function() {
  this.regexp = /#photo\/(\S+)/;
  this.currentHash = window.location.hash;
  if (this.currentHash.match(this.regexp)) {
    this.showGallery(this.currentHash);
  } else {
    this.hideGallery();
  }
};

Gallery.prototype._onPhotoClick = function() {
  if (this.currentPictureIndex < this.galleryPictures.length) {
    this.currentPictureIndex++;
  }
  if (this.currentPictureIndex === this.galleryPictures.length) {
    this.currentPictureIndex = 0;
  }
  window.location.hash = 'photo/' + this.galleryPictures[this.currentPictureIndex].url;
};

Gallery.prototype._onDocumentKeyDown = function(evt) {
  if (evt.keyCode === 27 && !this.galleryContainer.classList.contains('invisible')) {
    this.hideGallery();
  }
};

Gallery.prototype._onContainerClick = function(evt) {
  if (evt.target.classList.contains('gallery-overlay')) {
    this.hideGallery();
  }
};

Gallery.prototype._onCloseClick = function(evt) {
  evt.preventDefault();
  this.hideGallery();
};

module.exports = new Gallery();
