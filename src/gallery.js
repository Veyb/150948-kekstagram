'use strict';

var galleryContainer = document.querySelector('.gallery-overlay');
var galleryClose = galleryContainer.querySelector('.gallery-overlay-close');
var galleryImage = galleryContainer.querySelector('.gallery-overlay-image');
var galleryLikes = galleryContainer.querySelector('.likes-count');
var galleryComments = galleryContainer.querySelector('.comments-count');
var galleryPictures = [];
var currentPictureIndex = 0;

var showGalleryPicture = function() {
  var currentPicture = galleryPictures[currentPictureIndex];

  galleryImage.src = currentPicture.url;
  galleryLikes.textContent = currentPicture.likes;
  galleryComments.textContent = currentPicture.comments;
};

var showGallery = function(pictures, index) {
  galleryPictures = pictures;
  currentPictureIndex = index;

  showGalleryPicture();
  galleryImage.addEventListener('click', onPhotoClick);
  document.addEventListener('keydown', onDocumentKeyDown);
  galleryClose.addEventListener('click', onCloseClick);
  galleryContainer.addEventListener('click', onContainerClick);

  galleryContainer.classList.remove('invisible');
};

function hideGallery() {
  galleryImage.removeEventListener('click', onPhotoClick);
  document.removeEventListener('keydown', onDocumentKeyDown);
  galleryClose.removeEventListener('click', onCloseClick);
  galleryContainer.removeEventListener('click', onContainerClick);

  galleryContainer.classList.add('invisible');
}

function onPhotoClick() {
  if (currentPictureIndex < galleryPictures.length) {
    currentPictureIndex++;
  }
  if (currentPictureIndex === galleryPictures.length) {
    currentPictureIndex = 0;
  }
  showGalleryPicture();
}

function onDocumentKeyDown(evt) {
  if (evt.keyCode === 27 && !galleryContainer.classList.contains('invisible')) {
    hideGallery();
  }
}

function onContainerClick(evt) {
  if (evt.target.classList.contains('gallery-overlay')) {
    hideGallery();
  }
}

function onCloseClick(evt) {
  evt.preventDefault();
  hideGallery();
}

module.exports = {
  showGallery: showGallery
};
