'use strict';

(function () {

  window.KEYCODES = {
    escape: 27,
    enter: 13
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

  window.randomizeNumbers = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };


  window.getTemplateContent = function (template, element) {
    var templateContent;
    if ('content' in document.createElement('template')) {
      templateContent = document.querySelector(template).content.querySelector(element);
    } else {
      templateContent = document.querySelector(template).querySelector(element);
    }
    return templateContent;
  };

  Element.prototype.removeClass = function (classname) {
    this.classList.remove(classname);
  };

  Element.prototype.addClass = function (classname) {
    this.classList.add(classname);
  };
})();
