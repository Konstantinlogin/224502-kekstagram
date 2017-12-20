'use strict';

(function () {
 

  var request = function (url, type, onLoad, onError) {

    var statusText = {
      success: 'Данные успешно отправлены',
      error: 'Ошибка сервера'
    }

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open(type, url);

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        if (type === 'GET') {
          onLoad(xhr.response);
        } else if (type === 'POST') {
          onLoad(statusText.success);
        }
      } else {
        onError(statusText.error);
      }
    });

    return xhr;
  };

  window.loadPictures = function (onLoad, onError) {
    var xhr = request('https://js.dump.academy/kekstagram/data', 'GET', onLoad, onError);
    xhr.send();
  }

  window.formSumbit = function (data, onLoad, onError) {
    var xhr = request('https://js.dump.academy/kekstagram', 'POST', onLoad, onError);
    xhr.send(data);
  }

})();