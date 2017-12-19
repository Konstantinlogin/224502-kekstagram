'use strict';
(function () {
  var uploadForm = document.querySelector('#upload-select-image');

  var elements = {
    hashTagInput: uploadForm.querySelector('.upload-form-hashtags'),
    uploadInput: uploadForm.querySelector('#upload-file'),
    commentTextarea: uploadForm.querySelector('.upload-form-description'),
    uploadOverlay: document.querySelector('.upload-overlay'),
    uploadOverlayClose: document.querySelector('#upload-cancel'),
    uploadPicture: uploadForm.querySelector('.effect-image-preview'),
    resizeControls: uploadForm.querySelector('.upload-resize-controls'),
    resizeInput: uploadForm.querySelector('.upload-resize-controls-value'),
    effectControls: uploadForm.querySelector('.upload-effect-controls'),
    effectLevel: uploadForm.querySelector('.upload-effect-level'),
    effectLevelPin: uploadForm.querySelector('.upload-effect-level-pin'),
    effectLevelVal: uploadForm.querySelector('.upload-effect-level-val'),
    effectLevelValue: uploadForm.querySelector('.upload-effect-level-value'),
    effectLevelLine: uploadForm.querySelector('.upload-effect-level-line')
  };

  var effectSlider = {
    Min: 0,
    Max: 100,
    Default: elements.effectLevelValue.value
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

  var resizePicture = function (value) {
    elements.uploadPicture.style.transform = 'scale(' + value / 100 + ')';
    elements.resizeInput.value = value + '%';
  };

  window.initializeScale({
    callback: resizePicture,
    target: '.upload-resize-controls',
    increment: '.upload-resize-controls-button-inc',
    decrement: '.upload-resize-controls-button-dec',
    step: 25,
    max: 100,
    min: 25
  });

  var oldEffect;
  var changeEffect = function (className) {
    var currentEffect = className;
    elements.uploadPicture.removeClass(oldEffect);
    elements.uploadPicture.addClass(currentEffect);
    setDefaultEffectLevel();
    if (currentEffect !== 'effect-none') {
      elements.effectLevel.removeClass('hidden');
    } else {
      elements.effectLevel.addClass('hidden');
    }
    oldEffect = currentEffect;
  };
  window.initializeFilters({
    callback: changeEffect,
    element: '.upload-effect-controls',
    classPrefix: 'effect'
  });

  elements.uploadInput.addEventListener('change', onUploadInputChange);

  var onUploadFormSubmit = function (evt) {
    if (elements.hashTagInput.value.length > 0 && validateHashTags(elements.hashTagInput.value) === false) {
      elements.hashTagInput.style.borderColor = 'red';
      evt.preventDefault();
    } else {
      elements.hashTagInput.style.removeProperty('border-color');
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
    changeEffect('effect-none');
    uploadForm.querySelector('#upload-effect-none').checked = true;
    elements.uploadInput.value = '';
    elements.commentTextarea.value = '';
    elements.hashTagInput.value = '';
    elements.uploadInput.value = '';
  };

  var setDefaultEffectLevel = function () {
    elements.effectLevelPin.style.left = effectSlider.Default + '%';
    elements.effectLevelVal.style.width = elements.effectLevelPin.style.left;
    elements.effectLevelValue.value = effectSlider.Max;
    elements.uploadPicture.style.removeProperty('filter');
  };

  var changeEffectFilter = function (value) {
    var effectElement = elements.uploadPicture;
    if (effectElement.classList.contains('effect-chrome')) {
      effectElement.style.filter = 'grayscale(' + value / 100 + ')';
    } else if (effectElement.classList.contains('effect-sepia')) {
      effectElement.style.filter = 'sepia(' + value / 100 + ')';
    } else if (effectElement.classList.contains('effect-marvin')) {
      effectElement.style.filter = 'invert(' + value + '%)';
    } else if (effectElement.classList.contains('effect-phobos')) {
      effectElement.style.filter = 'blur(' + value * 3 / 100 + 'px)';
    } else if (effectElement.classList.contains('effect-heat')) {
      effectElement.style.filter = 'brightness(' + value * 3 / 100 + ')';
    }
  };

  var onEffectLevelChange = function (evt) {
    evt.preventDefault();
    var startCoords = evt.clientX;
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = startCoords - moveEvt.clientX;
      startCoords = moveEvt.clientX;
      var lineWidth = parseInt(getComputedStyle(elements.effectLevelLine).width, 10);
      var effectLevel = (elements.effectLevelPin.offsetLeft - shift) / lineWidth * 100;

      if (effectLevel >= effectSlider.Max) {
        elements.effectLevelPin.style.left = effectSlider.Max + '%';
        effectLevel = effectSlider.Max;
        elements.effectLevelValue.value = effectSlider.Max;
      } else if (effectLevel <= effectSlider.Min) {
        elements.effectLevelPin.style.left = effectSlider.Min + '%';
        effectLevel = effectSlider.Min;
        elements.effectLevelValue.value = effectSlider.Min;
      } else {
        elements.effectLevelPin.style.left = (effectLevel) + '%';
        elements.effectLevelValue.value = Math.round(effectLevel);
      }
      elements.effectLevelVal.style.width = effectLevel + '%';
      elements.effectLevelPin.style.left = effectLevel + '%';

      changeEffectFilter(effectLevel);
    };

    var onMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  };
  var uploadFormEvents = [
    {
      element: elements.uploadOverlayClose,
      action: 'click',
      eventFunction: onUploadOverlayClose
    },
    {
      element: elements.uploadOverlayClose,
      action: 'focus',
      eventFunction: onUploadOverlayCloseFocus
    },
    {
      element: elements.uploadOverlayClose,
      action: 'blur',
      eventFunction: onUploadOverlayCloseFocusOut
    },
    {
      element: elements.commentTextarea,
      action: 'focus',
      eventFunction: onCommentTextareaFocus
    },
    {
      element: elements.commentTextarea,
      action: 'blur',
      eventFunction: onCommentTextareaFocusOut
    },
    {
      element: document,
      action: 'keydown',
      eventFunction: onUploadOverlayEscape
    },
    {
      element: uploadForm,
      action: 'submit',
      eventFunction: onUploadFormSubmit
    },
    {
      element: elements.effectLevelPin,
      action: 'mousedown',
      eventFunction: onEffectLevelChange
    }
  ];

  var showUploadForm = function () {
    elements.uploadOverlay.removeClass('hidden');
    window.addMultipleEvents(uploadFormEvents);
    setDefaultEffectLevel();
  };
  var hideUploadForm = function () {
    elements.uploadOverlay.addClass('hidden');
    resetUploadForm();
    setDefaultEffectLevel();
    window.removeMultipleEvents(uploadFormEvents);
  };

})();
