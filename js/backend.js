'use strict';

(function () {

  var URL_POST = 'https://js.dump.academy/kekstagram';
  var URL_GET = 'https://js.dump.academy/kekstagram/data';
  var SERVER_TIMEOUT = 10000;

  var sendRequest = function (url, type, onLoad, onError) {

    var statusText = {
      error: 'Ошибка сервера',
      timeoutError: 'Истекло время ожидания сервера'
    };

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = SERVER_TIMEOUT;

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
    var xhr = sendRequest(URL_GET, 'GET', onLoad, onError);
    xhr.send();
  };

  window.formSumbit = function (data, onLoad, onError) {
    var xhr = sendRequest(URL_POST, 'POST', onLoad, onError);
    xhr.send(data);
  };

})();
