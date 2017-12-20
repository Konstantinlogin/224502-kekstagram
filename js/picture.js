'use strict';

(function () {

  var pictureTemplate = window.getTemplateContent('#picture-template', '.picture');
  var picturesContainer = document.querySelector('.pictures');

  var createPictureNode = function (picture) {
    var pictureBlock = pictureTemplate.cloneNode(true);
    pictureBlock.querySelector('img').src = picture.url;
    pictureBlock.querySelector('.picture-likes').textContent = picture.likes;
    pictureBlock.querySelector('.picture-comments').textContent = picture.comments.length;
    return pictureBlock;
  };

  window.renderPhotos = function (pictures) {
    var fragment = document.createDocumentFragment();

    pictures.forEach(function (picture) {
      fragment.appendChild(createPictureNode(picture));
    });

    picturesContainer.appendChild(fragment);
  };

})();
