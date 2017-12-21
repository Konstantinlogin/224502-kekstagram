'use strict';
(function () {

  var galleryPopup = document.querySelector('.gallery-overlay');
  var galleryPopupClose = galleryPopup.querySelector('.gallery-overlay-close');
  var filterSwitcher = document.querySelector('.filters');
  var debounceInterval = 500;
  var data = [];

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
    data = pictures;
    window.renderPhotos(pictures);
    document.querySelector('.pictures').addEventListener('click', onPictureClick, true);
    filterSwitcher.classList.remove('filters-inactive');
    filterSwitcher.addEventListener('click', onFilterChange);
  };
  

  var onError = function (errorMessage) {
    window.errorDialog(errorMessage);
  };

  window.loadPictures(onLoad, onError);
  
  var lastTimeout;
  var debounce = function (action) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(action, debounceInterval);
  };

  var removePictures = function () {
    var pictureElements = document.querySelectorAll('.picture');
    for (var i = 0; i < pictureElements.length; i++) {
      document.querySelector('.pictures').removeChild(pictureElements[i]);
    }
  };

  var getPopularPhotos = function (data) {
    return data.slice().sort(function (first, second) {
      if (first.likes < second.likes) {
        return 1;
      } else if (first.likes > second.likes) {
        return -1;
      } else {
        return 0;
      }
    });
  };

  var getDiscussedPhotos = function (data) {
    return data.slice().sort(function (first, second) {
      if (first.comments.length < second.comments.length) {
        return 1;
      } else if (first.comments.length > second.comments.length) {
        return -1;
      } else {
        return 0;
      }
    });
  };

  var getRandomPhotos = function (data) {
    return data.slice().sort(function (first, second) {
      return Math.random() - 0.5;
    });
  };

   var onFilterChange = function (evt) {
     
    var currentFilter = evt.target.id;

    if (currentFilter === 'filter-recommend') {
      debounce(function () {
        removePictures();
        window.renderPhotos(data);
      });
    } else if (currentFilter === 'filter-popular') {
      debounce(function () {
        removePictures();
        window.renderPhotos(getPopularPhotos(data));
      });
    } else if (currentFilter === 'filter-discussed') {
      debounce(function () {
        removePictures();
        window.renderPhotos(getDiscussedPhotos(data));
      });
    } else if (currentFilter === 'filter-random') {
      debounce(function () {
        removePictures();
        window.renderPhotos(getRandomPhotos(data));
      });
    }
  }

})();
