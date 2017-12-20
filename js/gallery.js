'use strict';
(function () {
  
  var galleryPopup = document.querySelector('.gallery-overlay');
  var galleryPopupClose = galleryPopup.querySelector('.gallery-overlay-close');

  var onPictureCloseClick = function (evt) {
    hidePopup();
    evt.preventDefault();
  };

  var onPictureCloseEscape = function (evt) {
    if (evt.keyCode === window.KEYCODES.escape) {
      hidePopup();
    }
  };

  var onPictureCloseEnter = function (evt) {
    if (evt.keyCode === window.KEYCODES.enter) {
      hidePopup();
    }
  };

  var onPictureCloseFocus = function () {
    document.addEventListener('keydown', onPictureCloseEnter);
  };

  var onPictureCloseFocusOut = function () {
    document.removeEventListener('keydown', onPictureCloseEnter);
  };

  var uploadedPicturesEvents = [
    {
      element: galleryPopupClose,
      action: 'click',
      eventFunction: onPictureCloseClick
    },
    {
      element: document,
      action: 'keydown',
      eventFunction: onPictureCloseEscape
    },
    {
      element: galleryPopupClose,
      action: 'focus',
      eventFunction: onPictureCloseFocus
    },
    {
      element: galleryPopupClose,
      action: 'blur',
      eventFunction: onPictureCloseFocusOut
    }
  ];

  var showPopup = function () {
    galleryPopup.removeClass('hidden');
    window.addMultipleEvents(uploadedPicturesEvents);
  };

  var hidePopup = function () {
    galleryPopup.addClass('hidden');
    window.removeMultipleEvents(uploadedPicturesEvents);
  };


  var selectedImage;

  var onPictureClick = function (evt) {
    toggleActiveImage(evt.target);
    window.appendPicture(galleryPopup);
    showPopup();
    evt.preventDefault();
  };

  var toggleActiveImage = function (node) {
    if (selectedImage) {
      selectedImage.parentNode.removeClass('is-active');
    }
    selectedImage = node;
    selectedImage.parentNode.addClass('is-active');
  };

  var onLoad = function (pictures) {
    window.renderPhotos(pictures);
    document.querySelector('.pictures').addEventListener('click', onPictureClick, true);
  };
  var onError = function (errorMessage) {
    alert(errorMessage);
  };
  window.loadPictures(onLoad, onError);
  
})();
