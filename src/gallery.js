'use strict';

var Gallery = function() {
  var self = this;

  this.galleryContainer = document.querySelector('.gallery-overlay');
  this.galleryClose = this.galleryContainer.querySelector('.gallery-overlay-close');
  this.galleryImage = this.galleryContainer.querySelector('.gallery-overlay-image');
  this.galleryLikes = this.galleryContainer.querySelector('.likes-count');
  this.galleryComments = this.galleryContainer.querySelector('.comments-count');
  this.galleryPictures = [];
  this.currentPictureIndex = 0;

  this.setGalleryPictures = function(pictures) {
    self.galleryPictures = pictures;
    return self.galleryPictures;
  };

  this.showGalleryPicture = function() {
    var currentPicture = self.galleryPictures[self.currentPictureIndex];

    self.galleryImage.src = currentPicture.url;
    self.galleryLikes.textContent = currentPicture.likes;
    self.galleryComments.textContent = currentPicture.comments;
  };

  this.showGallery = function(hash) {
    if (typeof hash === 'number') {
      self.currentPictureIndex = hash;
    }
    if (typeof hash === 'string') {
      self.currentPictureIndex = self.galleryPictures.findIndex(function(picture) {
        return hash.indexOf(picture.url) !== -1;
      });
    }
    self.showGalleryPicture();
    self.galleryImage.addEventListener('click', self._onPhotoClick);
    document.addEventListener('keydown', self._onDocumentKeyDown);
    self.galleryClose.addEventListener('click', self._onCloseClick);
    self.galleryContainer.addEventListener('click', self._onContainerClick);

    self.galleryContainer.classList.remove('invisible');
  };

  this.hideGallery = function() {
    self.galleryImage.removeEventListener('click', self._onPhotoClick);
    document.removeEventListener('keydown', self._onDocumentKeyDown);
    self.galleryClose.removeEventListener('click', self._onCloseClick);
    self.galleryContainer.removeEventListener('click', self._onContainerClick);

    self.galleryContainer.classList.add('invisible');
    history.pushState(null, null, window.location.pathname);
  };

  this._onHashChange = function() {
    var regexp = /#photo\/(\S+)/;
    var currentHash = window.location.hash;
    if (currentHash.match(regexp)) {
      self.showGallery(currentHash);
    } else {
      self.hideGallery();
    }
  };

  this._onPhotoClick = function() {
    if (self.currentPictureIndex < self.galleryPictures.length) {
      self.currentPictureIndex++;
    }
    if (self.currentPictureIndex === self.galleryPictures.length) {
      self.currentPictureIndex = 0;
    }
    window.location.hash = 'photo/' + self.galleryPictures[self.currentPictureIndex].url;
  };

  this._onDocumentKeyDown = function(evt) {
    if (evt.keyCode === 27 && !self.galleryContainer.classList.contains('invisible')) {
      self.hideGallery();
    }
  };

  this._onContainerClick = function(evt) {
    if (evt.target.classList.contains('gallery-overlay')) {
      self.hideGallery();
    }
  };

  this._onCloseClick = function(evt) {
    evt.preventDefault();
    self.hideGallery();
  };

  window.addEventListener('hashchange', this._onHashChange);
};

module.exports = new Gallery();
