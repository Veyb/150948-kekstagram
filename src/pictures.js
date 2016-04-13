'use strict';

var filtersForm = document.querySelector('.filters');

if (!filtersForm.classList.contains('hidden')) {
  filtersForm.classList.add('hidden');
}

function getTemplateElement(data) {
  var template = document.getElementById('picture-template');

  if ('content' in template) {
    var element = template.content.querySelector('.picture').cloneNode(true);
  } else {
    element = template.querySelector('.picture').cloneNode(true);
  }

  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;

  var previewImage = new Image();

  previewImage.onload = function() {
    element.getElementsByTagName('IMG')[0].width = 182;
    element.getElementsByTagName('IMG')[0].height = 182;
  };

  previewImage.onerror = function() {
    element.classList.add('picture-load-failure');
  };

  previewImage.src = data.url;
  element.getElementsByTagName('IMG')[0].src = previewImage.src;

  return element;
}

window.pictures.forEach(function(picture) {
  var picturesContainer = document.querySelector('.pictures');

  picturesContainer.appendChild(getTemplateElement(picture));
});

filtersForm.classList.remove('hidden');
