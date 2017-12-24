'use strict';

(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var addMultipleEvents = function (array) {
    array.forEach(function (item) {
      item.element.addEventListener(item.action, item.eventFunction);
    });
  };

  var removeMultipleEvents = function (array) {
    array.forEach(function (item) {
      item.element.removeEventListener(item.action, item.eventFunction);
    });
  };

  var getTemplateContent = function (template, element) {
    var templateContent = document.querySelector(template).querySelector(element);
    if ('content' in document.createElement('template')) {
      templateContent = document.querySelector(template).content.querySelector(element);
    }
    return templateContent;
  };

  var errorDialog = function (message) {
    var template = document.createElement('div');
    template.textContent = message;
    var styles = [
      'position: fixed',
      'top: 50%',
      'left: 50%',
      'transform: translate(-50%, -50%)',
      'padding: 15px',
      'border-radius: 4px',
      'color: white',
      'background-color: rgba(215, 44, 44, 0.8)',
      'color: white',
      'max-width: 680px',
      'z-index: 3'
    ];
    template.style.cssText = styles.join(';');
    document.body.appendChild(template);
  };

  Element.prototype.removeClass = function (classname) {
    this.classList.remove(classname);
  };

  Element.prototype.addClass = function (classname) {
    this.classList.add(classname);
  };

  window.utils = {
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE,
    addMultipleEvents: addMultipleEvents,
    removeMultipleEvents: removeMultipleEvents,
    getTemplateContent: getTemplateContent,
    errorDialog: errorDialog
  };

})();
