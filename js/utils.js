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

  window.errorDialog = function (message) {
    var template = document.createElement('div');
    template.textContent = message;
    template.style.cssText="\
      position: fixed; \
      top: 50%; \
      left: 50%; \
      transform: translate(-50%, -50%); \
      padding: 15px; \
      border-radius: 4px; \
      color: white; \
      background-color: rgba(215, 44, 44, 0.8); \
      color: white; \
      max-width: 680px; \
      z-index: 3;\
    ";
    document.body.appendChild(template);
  };

  Element.prototype.removeClass = function (classname) {
    this.classList.remove(classname);
  };

  Element.prototype.addClass = function (classname) {
    this.classList.add(classname);
  };
})();
