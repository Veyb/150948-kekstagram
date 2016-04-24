/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

var browserCookies = require('browser-cookies');

(function() {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  var btnNextForm = document.getElementById('resize-fwd');
  var leftSize = document.getElementById('resize-x');
  var topSize = document.getElementById('resize-y');
  var squareSize = document.getElementById('resize-size');

  var tooltipMessage = document.querySelector('.tooltip-message');

  /** @enum {number} */
  var Tooltip = {
    ZERO: 0,
    MORE: 1,
    SUM: 2
  };

  function showTooltip(action, message) {

    switch (action) {
      case Tooltip.ZERO:
        message = message || 'Все поля должны быть заполены';
        break;

      case Tooltip.MORE:
        message = message || 'Поля &laquo;сверху&raquo; и &laquo;слева&raquo; не могут быть отрицательными, а поле &laquo;сторона&raquo; должно быть больше нуля';
        break;

      case Tooltip.SUM:
        message = message || '&laquo;Кадр&raquo; должен находиться в пределах исходного изображения.';
        break;
    }

    tooltipMessage.innerHTML = message;
    tooltipMessage.classList.remove('invisible');
    return tooltipMessage;
  }

  function hideTooltip() {
    tooltipMessage.classList.add('invisible');
  }
  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  function resizeFormIsValid() {
    var imgWidth = currentResizer._image.naturalWidth;
    var imgHeight = currentResizer._image.naturalHeight;
    var xSize = (parseInt(leftSize.value, 10) + parseInt(squareSize.value, 10));
    var ySize = (parseInt(topSize.value, 10) + parseInt(squareSize.value, 10));

    if (!leftSize.value || !topSize.value || !squareSize.value) {
      btnNextForm.setAttribute('disabled', '');
      hideTooltip();
      showTooltip(Tooltip.ZERO);
      return false;
    } else if ((leftSize.value < 0) || (topSize.value < 0) || (squareSize.value < 1)) {
      btnNextForm.setAttribute('disabled', '');
      hideTooltip();
      showTooltip(Tooltip.MORE);
      return false;
    } else if ((xSize > imgWidth) || (ySize > imgHeight)) {
      btnNextForm.setAttribute('disabled', '');
      hideTooltip();
      showTooltip(Tooltip.SUM);
      return false;
    } else {
      btnNextForm.removeAttribute('disabled');
      hideTooltip();
      return true;
    }
  }

  function setResizeForm() {
    window.addEventListener('resizerchange', function() {
      var constraint = currentResizer.getConstraint();

      leftSize.value = constraint.x;
      topSize.value = constraint.y;
      squareSize.value = constraint.side;
      resizeFormIsValid();
    });
  }

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];
  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.addEventListener('change', function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.addEventListener('load', function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          setResizeForm();
          hideMessage();
        });

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если загружаемый файл, не является
        // поддерживаемым изображением.
        showMessage(Action.ERROR);
      }
    }
  });

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  resizeForm.addEventListener('input', function() {
    var x = parseInt(leftSize.value, 10);
    var y = parseInt(topSize.value, 10);
    var side = parseInt(squareSize.value, 10);

    currentResizer.setConstraint(x, y, side);
    resizeFormIsValid();
  });

  var SECOND = 1000;
  var MINUTE = 60 * SECOND;
  var HOUR = 60 * MINUTE;
  var DAY = 24 * HOUR;

  function saveFilter() {
    var actualDate = new Date();
    var actualYear = actualDate.getFullYear();
    var birthdayDate = new Date(actualYear, 11, 27);

    var filterList = filterImage.classList;
    var lastFilter = filterList[filterList.length - 1];

    if (birthdayDate > actualDate) {
      birthdayDate.setFullYear(actualYear - 1, 11, 27);
    }

    var cookieLifetime = Math.ceil((actualDate.valueOf() - birthdayDate.valueOf()) / DAY);

    browserCookies.set('saveFilter', lastFilter, {
      expires: cookieLifetime
    });
  }

  function getFilter() {
    var filterNone = document.getElementById('upload-filter-none');
    var filterChrome = document.getElementById('upload-filter-chrome');
    var filterSepia = document.getElementById('upload-filter-sepia');

    var currentFilter = browserCookies.get('saveFilter');

    if (currentFilter) {
      if (currentFilter === 'filter-none') {
        filterNone.setAttribute('checked', '');
      }
      if (currentFilter === 'filter-chrome') {
        filterChrome.setAttribute('checked', '');
      }
      if (currentFilter === 'filter-sepia') {
        filterSepia.setAttribute('checked', '');
      }
    }
    return filterImage.classList.add(currentFilter);
  }

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      filterImage.src = currentResizer.exportImage().src;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');

      getFilter();
    }
  });

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  });

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    saveFilter();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.addEventListener('change', function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  });

  cleanupResizer();
  updateBackground();
})();
