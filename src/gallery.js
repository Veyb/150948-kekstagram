'use strict';

var galleryContainer = document.querySelector('.gallery-overlay');
var galleryClose = galleryContainer.querySelector('.gallery-overlay-close');
var galleryImage = galleryContainer.querySelector('.gallery-overlay-image');
var galleryLikes = galleryContainer.querySelector('.likes-count');
var galleryComments = galleryContainer.querySelector('.comments-count');
var galleryPictures = [];
var currentPictureIndex = 0;

var setGalleryPictures = function(pictures) {
  galleryPictures = pictures;
  return galleryPictures;
};

var showGalleryPicture = function() {
  var currentPicture = galleryPictures[currentPictureIndex];

  galleryImage.src = currentPicture.url;
  galleryLikes.textContent = currentPicture.likes;
  galleryComments.textContent = currentPicture.comments;
};

var showGallery = function(index) {
  currentPictureIndex = index;

  showGalleryPicture();
  galleryImage.addEventListener('click', _onPhotoClick);
  document.addEventListener('keydown', _onDocumentKeyDown);
  galleryClose.addEventListener('click', _onCloseClick);
  galleryContainer.addEventListener('click', _onContainerClick);

  galleryContainer.classList.remove('invisible');
};

function hideGallery() {
  galleryImage.removeEventListener('click', _onPhotoClick);
  document.removeEventListener('keydown', _onDocumentKeyDown);
  galleryClose.removeEventListener('click', _onCloseClick);
  galleryContainer.removeEventListener('click', _onContainerClick);

  galleryContainer.classList.add('invisible');
}

function _onPhotoClick() {
  if (currentPictureIndex < galleryPictures.length) {
    currentPictureIndex++;
  }
  if (currentPictureIndex === galleryPictures.length) {
    currentPictureIndex = 0;
  }
  showGalleryPicture();
}

function _onDocumentKeyDown(evt) {
  if (evt.keyCode === 27 && !galleryContainer.classList.contains('invisible')) {
    hideGallery();
  }
}

function _onContainerClick(evt) {
  if (evt.target.classList.contains('gallery-overlay')) {
    hideGallery();
  }
}

function _onCloseClick(evt) {
  evt.preventDefault();
  hideGallery();
}

module.exports = {
  showGallery: showGallery,
  setGalleryPictures: setGalleryPictures
};
