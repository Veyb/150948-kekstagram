'use strict';

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

module.exports = {
  hideTooltip: hideTooltip,
  showTooltip: showTooltip,
  ZERO: 0,
  MORE: 1,
  SUM: 2
};
