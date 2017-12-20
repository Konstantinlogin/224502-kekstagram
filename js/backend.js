'use strict';

(function () {
 

  window.loadPictures = function (onLoad, onError) {
    var url = 'https://js.dump.academy/kekstagram/data';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    var errorMessage = 'Ошибка сервера';

    var getServerStatus = function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
        xhr.removeEventListener('error', onError);
      } else {
        onError(errorMessage);
        xhr.removeEventListener('error', getServerStatus);
      }
    };

    xhr.addEventListener('load', getServerStatus);
    xhr.addEventListener('error', onError);

    xhr.open('GET', url);
    xhr.send();

    return xhr;

  };

})();