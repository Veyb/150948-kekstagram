/**
 * @fileoverview Вспомогательные методы
 * @author Oleg Tsyro (Veyb)
 */

'use strict';

module.exports = {
  picturesContainer: document.querySelector('.pictures'),

  /** @type {number} */
  IMAGE_SIZE: 182,

  /** @type {number} */
  PAGE_SIZE: 12,

  /** @type {Array.<Object>} */
  filteredPictures: [],

  /** @type {Array.<Object>} */
  pictures: [],

  /** @type {number} */
  pageNumber: 0,

  isBottomReached: function() {
    return document.body.offsetHeight - window.innerHeight - 100 <= document.body.scrollTop;
  },

  isNextPageAvailable: function(elements, page, pageSize) {
    return page < Math.floor(elements.length / pageSize);
  }
};
