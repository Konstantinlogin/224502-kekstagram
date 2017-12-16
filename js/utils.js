'use strict';

(function () {
  Element.prototype.removeClass = function (classname) {
    this.classList.remove(classname);
  };

  Element.prototype.addClass = function (classname) {
    this.classList.add(classname);
  };

  window.addMultipleEvents = function (array) {
    for (var i = 0; i < array.length; i++) {
      array[i].element.addEventListener(array[i].action, array[i].eventFunction);
    }
  };

  window.removeMultipleEvents = function (array) {
    for (var i = 0; i < array.length; i++) {
      array[i].element.removeEventListener(array[i].action, array[i].eventFunction);
    }
  };

})();
