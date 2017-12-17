'use strict';

(function () {
  window.appendPicture = function (element) {
    var activePicture = document.querySelector('.is-active');
    var picture = {
      url: activePicture.querySelector('img').getAttribute('src'),
      likes: activePicture.querySelector('.picture-likes').textContent,
      commentsCount: activePicture.querySelector('.picture-comments').textContent
    };
    element.querySelector('img').setAttribute('src', picture.url);
    element.querySelector('.likes-count').textContent = picture.likes;
    element.querySelector('.comments-count').textContent = picture.commentsCount;
  };
})();
