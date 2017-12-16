'use strict';

(function () {
  window.appendPicture = function () {
    var activePicture = document.querySelector('.is-active');
    var picture = {
      url: activePicture.querySelector('img').getAttribute('src'),
      likes: activePicture.querySelector('.picture-likes').textContent,
      commentsCount: activePicture.querySelector('.picture-comments').textContent
    };
    document.querySelector('.gallery-overlay').querySelector('img').setAttribute('src', picture.url);
    document.querySelector('.gallery-overlay').querySelector('.likes-count').textContent = picture.likes;
    document.querySelector('.gallery-overlay').querySelector('.comments-count').textContent = picture.commentsCount;
  };
})();
