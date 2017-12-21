'use strict';

(function () {

  var request = function (url, type, onLoad, onError) {

    var statusText = {
      error: 'Ошибка сервера',
      timeoutError: 'Истекло время ожидания сервера'
    };

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;

    xhr.open(type, url);

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(statusText.error);
      }
    });
    xhr.addEventListener('error', function () {
      onError(statusText.error);
    });
    xhr.addEventListener('timeout', function () {
      onError(statusText.timeoutError);
    });

    return xhr;
  };

  window.loadPictures = function (onLoad, onError) {
    var xhr = request('https://js.dump.academy/kekstagram/data', 'GET', onLoad, onError);
    xhr.send();
  };

  window.formSumbit = function (data, onLoad, onError) {
    var xhr = request('https://js.dump.academy/kekstagram', 'POST', onLoad, onError);
    xhr.send(data);
  };

})();
