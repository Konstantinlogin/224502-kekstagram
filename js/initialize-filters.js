'use strict';

(function () {

  window.initializeFilters = function (options) {

    var element = options.element;

    var getClass = function (evt) {

      evt.preventDefault();
      var value = evt.target.value;
      var className = options.classPrefix + '-' + value;

      if (typeof options.callback === 'function') {
        options.callback(className);
      }
      return className;

    };

    element.addEventListener('change', function (evt) {
      getClass(evt);
    });
  };

})();
