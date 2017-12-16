'use strict';
(function () {
  // upload form

  var uploadForm = document.querySelector('#upload-select-image');
  var hashTagInput = uploadForm.querySelector('.upload-form-hashtags');
  var uploadInput = uploadForm.querySelector('#upload-file');
  var commentTextarea = uploadForm.querySelector('.upload-form-description');
  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadOverlayClose = document.querySelector('#upload-cancel');

  var uploadPicture = {
    element: uploadForm.querySelector('.effect-image-preview'),
    size: 100,
    stepSize: 25,
    maxSize: 100,
    minSize: 25,
    resizeControls: uploadForm.querySelector('.upload-resize-controls'),
    resizeDec: uploadForm.querySelector('.upload-resize-controls-button-dec'),
    resizeInc: uploadForm.querySelector('.upload-resize-controls-button-inc'),
    resizeInput: uploadForm.querySelector('.upload-resize-controls-value'),
    effectControls: uploadForm.querySelector('.upload-effect-controls'),
    effects: ['chrome', 'sepia', 'marvin', 'phobos', 'heat']
  };

  var onUploadOverlayClose = function () {
    hideUploadForm();
  };

  var onUploadOverlayEscape = function (evt) {
    if (evt.keyCode === window.KEYCODES.escape) {
      hideUploadForm();
    }
  };

  var onUploadOverlayCloseEnter = function (evt) {
    if (evt.keyCode === window.KEYCODES.enter) {
      hideUploadForm();
    }
  };

  var onUploadOverlayCloseFocus = function () {
    document.addEventListener('keydown', onUploadOverlayCloseEnter);
  };

  var onUploadOverlayCloseFocusOut = function () {
    document.removeEventListener('keydown', onUploadOverlayCloseEnter);
  };

  var onUploadInputChange = function () {
    showUploadForm();
  };

  var onCommentTextareaFocusOut = function () {
    document.addEventListener('keydown', onUploadOverlayEscape);
  };

  var onCommentTextareaFocus = function () {
    document.removeEventListener('keydown', onUploadOverlayEscape);
  };

  // Взаимодействие с upload picture

  var incPictureSize = function () {
    if (uploadPicture.size < uploadPicture.maxSize) {
      uploadPicture.size += uploadPicture.stepSize;
    }
    return uploadPicture.size;
  };

  var decPictureSize = function () {
    if (uploadPicture.size > uploadPicture.minSize) {
      uploadPicture.size -= uploadPicture.stepSize;
    }
    return uploadPicture.size;
  };

  var resizePicture = function (val) {
    uploadPicture.resizeInput.value = val + '%';
    if (val === uploadPicture.maxSize) {
      uploadPicture.element.style.transform = 'scale(1)';
    } else {
      uploadPicture.element.style.transform = 'scale(0.' + val + ')';
    }
  };

  var onResizeControlsChange = function (evt) {
    if (evt.target === uploadPicture.resizeInc) {
      resizePicture(incPictureSize());
    }
    if (evt.target === uploadPicture.resizeDec) {
      resizePicture(decPictureSize());
    }
  };

  var changeEffect = function (value) {
    var effectClass;
    var effectClassPrefix = 'effect';
    for (var i = 0; i < uploadPicture.effects.length; i++) {
      effectClass = effectClassPrefix + '-' + uploadPicture.effects[i];
      if (value === uploadPicture.effects[i]) {
        uploadPicture.element.addClass(effectClass);
      } else {
        uploadPicture.element.removeClass(effectClass);
      }
    }
  };

  var onEffectControlsChange = function (evt) {
    changeEffect(evt.target.value);
  };

  uploadInput.addEventListener('change', onUploadInputChange);

  var onUploadFormSubmit = function (evt) {
    if (hashTagInput.value.length > 0 && validateHashTags(hashTagInput.value) === false) {
      hashTagInput.style.borderColor = 'red';
      evt.preventDefault();
    } else {
      hashTagInput.style.removeProperty('border-color');
    }
  };


  var validateHashTags = function (string) {

    var validate = {
      tags: 5,
      pattern: /^#[a-zа-яё]+$/,
      maxLength: 21
    };

    var isValid = false;

    var hashes = string.toLowerCase().split(' ');

    for (var i = 0; i < hashes.length; i++) {
      if (validate.pattern.test(hashes[i]) === false) {
        isValid = false;
        break;
      } else if (hashes.length > validate.tags) {
        isValid = false;
        break;
      } else if (hashes.indexOf(hashes[i], i + 1) >= 0) {
        isValid = false;
        break;
      } else if (hashes[i].length > validate.maxLength) {
        isValid = false;
        break;
      } else {
        isValid = true;
      }
    }

    return isValid;
  };

  var resetUploadForm = function () {
    resizePicture(100);
    changeEffect('default');
    uploadForm.querySelector('#upload-effect-none').checked = true;
    uploadInput.value = '';
    commentTextarea.value = '';
    hashTagInput.value = '';
  };

  var uploadFormEvents = [
    {
      element: uploadOverlayClose,
      action: 'click',
      eventFunction: onUploadOverlayClose
    },
    {
      element: uploadOverlayClose,
      action: 'focus',
      eventFunction: onUploadOverlayCloseFocus
    },
    {
      element: uploadOverlayClose,
      action: 'blur',
      eventFunction: onUploadOverlayCloseFocusOut
    },
    {
      element: commentTextarea,
      action: 'focus',
      eventFunction: onCommentTextareaFocus
    },
    {
      element: commentTextarea,
      action: 'blur',
      eventFunction: onCommentTextareaFocusOut
    },
    {
      element: document,
      action: 'keydown',
      eventFunction: onUploadOverlayEscape
    },
    {
      element: uploadPicture.resizeControls,
      action: 'click',
      eventFunction: onResizeControlsChange
    },
    {
      element: uploadPicture.effectControls,
      action: 'change',
      eventFunction: onEffectControlsChange
    },
    {
      element: uploadForm,
      action: 'submit',
      eventFunction: onUploadFormSubmit
    }
  ];

  var showUploadForm = function () {
    uploadOverlay.removeClass('hidden');
    window.addMultipleEvents(uploadFormEvents);
  };

  var hideUploadForm = function () {
    uploadOverlay.addClass('hidden');
    resetUploadForm();
    window.removeMultipleEvents(uploadFormEvents);
  };
})();
