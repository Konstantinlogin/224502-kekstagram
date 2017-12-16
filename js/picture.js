'use strict';

(function () { 
  var renderPictures = function (picture) {
    var photoElement = window.picturesTemplate.cloneNode(true);
    photoElement.querySelector('img').setAttribute('src', picture.url);
    photoElement.querySelector('.picture-likes').textContent = picture.likes;
    photoElement.querySelector('.picture-comments').textContent = picture.comments.length;
    return photoElement;
  };

  var appendPictures = function (element) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.pictures.length; i++) {
      fragment.appendChild(renderPictures(window.pictures[i]));
    }
    element.appendChild(fragment);
  };

  appendPictures(document.querySelector('.pictures'));
})();