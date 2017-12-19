'use strict';

(function () {


  window.initializeScale = function (options) {

    var targetElement = document.querySelector(options.target);
    var incrementElement = targetElement.querySelector(options.increment);
    var decrementElement = targetElement.querySelector(options.decrement);
    var step = options.step;
    var max = options.max;
    var min = options.min;
    var size = max;

    var getValue = function (evt) {

      evt.preventDefault();

      if (evt.target === incrementElement) {
        if (size !== max) {
          size += step;
        } else {
          size = max;
        }
      } else if (evt.target === decrementElement) {
        if (size !== min) {
          size -= step;
        } else {
          size = min;
        }
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
