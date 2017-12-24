'use strict';

(function () {


  window.initializeScale = function (options) {

    var targetElement = options.target;
    var incrementElement = options.increment;
    var decrementElement = options.decrement;
    var step = options.step;
    var max = options.max;
    var min = options.min;
    var size = max;

    var getValue = function (evt) {

      evt.preventDefault();
      if (evt.target === incrementElement) {
        size = size !== max ? size += step : max;
      } else if (evt.target === decrementElement) {
        size = size !== min ? size -= step : min;
      }
      if (typeof options.callback === 'function') {
        options.callback(size);
      }
      return size;
    };

    targetElement.addEventListener('click', function (evt) {
      getValue(evt);
    });
  };

})();
