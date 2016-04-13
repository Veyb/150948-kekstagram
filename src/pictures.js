'use strict';

(function() {

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
    var templateImg = element.getElementsByTagName('IMG')[0];
    var imageLoadTimeout;

    previewImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      templateImg.width = 182;
      templateImg.height = 182;
    };

    previewImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    previewImage.src = data.url;
    templateImg.src = previewImage.src;

    var IMAGE_TIMEOUT = 10000;

    imageLoadTimeout = setTimeout(function() {
      previewImage.src = '';
      element.classList.add('picture-load-failure');
    }, IMAGE_TIMEOUT);

    return element;
  }

  window.pictures.forEach(function(picture) {
    var picturesContainer = document.querySelector('.pictures');

    picturesContainer.appendChild(getTemplateElement(picture));
  });

  filtersForm.classList.remove('hidden');
})();
