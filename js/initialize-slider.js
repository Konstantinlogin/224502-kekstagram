'use strict';

(function () {

  window.initializeSlider = function (options) {

    var maxValue = options.maxValue;
    var minValue = options.minValue;

    var elementPin = options.pin;
    var elementLine = options.line;
    var elementVal = options.val;
    var elementValue = options.value;

    var moveSlider = function (evt) {

      evt.preventDefault();
      var startCoords = evt.clientX;
      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();
        var shift = startCoords - moveEvt.clientX;
        startCoords = moveEvt.clientX;
        var lineWidth = parseInt(getComputedStyle(elementLine).width, 10);
        var effectLevel = (elementPin.offsetLeft - shift) / lineWidth * 100;

        if (effectLevel >= maxValue) {
          elementPin.style.left = maxValue + '%';
          effectLevel = maxValue;
          elementValue.value = maxValue;
        } else if (effectLevel <= minValue) {
          elementPin.style.left = minValue + '%';
          effectLevel = minValue;
          elementValue.value = minValue;
        } else {
          elementPin.style.left = (effectLevel) + '%';
          elementValue.value = Math.round(effectLevel);
        }
        elementVal.style.width = effectLevel + '%';
        elementPin.style.left = effectLevel + '%';

        if (typeof options.callback === 'function') {
          options.callback(effectLevel);
        }
        return effectLevel;
      };

      var onMouseUp = function () {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    elementPin.addEventListener('mousedown', function (evt) {
      moveSlider(evt);
    });

  };
})();
