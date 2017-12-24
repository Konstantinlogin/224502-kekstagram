'use strict';
(function () {

  var EFFECT_MIN_VALUE = 0;
  var EFFECT_MAX_VALUE = 100;
  var SCALE_STEP = 25;
  var SCALE_MIN = 25;
  var SCALE_MAX = 100;
  var HASHES_MAX_COUNT = 5;
  var HASHES_MAX_LENGTH = 21;
  var HASHES_PATTERN = /^#[a-zа-яё]+$/;
  var IMAGE_EXTENTIONS = ['jpg', 'png'];

  var uploadForm = document.querySelector('#upload-select-image');

  var elements = {
    hashTagInput: uploadForm.querySelector('.upload-form-hashtags'),
    uploadInput: uploadForm.querySelector('#upload-file'),
    submitButton: uploadForm.querySelector('.upload-form-submit'),
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

  var onUploadOverlayClose = function () {
    hideUploadForm();
  };

  var onUploadOverlayEscape = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      hideUploadForm();
    }
  };

  var onUploadOverlayCloseEnter = function (evt) {
    if (evt.keyCode === window.utils.ENTER_KEYCODE) {
      hideUploadForm();
    }
  };

  var onUploadOverlayCloseFocus = function () {
    document.addEventListener('keydown', onUploadOverlayCloseEnter);
  };

  var onUploadOverlayCloseFocusOut = function () {
    document.removeEventListener('keydown', onUploadOverlayCloseEnter);
  };

  var onUploadInputChange = function (evt) {
    if (validateExtention(IMAGE_EXTENTIONS, elements.uploadInput.value)) {
      showUploadForm();
      elements.uploadPicture.src = URL.createObjectURL(evt.target.files[0]);
    }
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
    target: elements.resizeControls,
    increment: elements.resizeControls.querySelector('.upload-resize-controls-button-inc'),
    decrement: elements.resizeControls.querySelector('.upload-resize-controls-button-dec'),
    step: SCALE_STEP,
    max: SCALE_MAX,
    min: SCALE_MIN
  });

  var oldEffect;
  var changeEffect = function (className) {
    var currentEffect = className;
    elements.uploadPicture.removeClass(oldEffect);
    elements.uploadPicture.addClass(currentEffect);
    setEffectDefault();
    if (currentEffect !== 'effect-none') {
      elements.effectLevel.removeClass('hidden');
    } else {
      elements.effectLevel.addClass('hidden');
    }
    oldEffect = currentEffect;
  };
  window.initializeFilters({
    callback: changeEffect,
    element: elements.effectControls,
    classPrefix: 'effect'
  });

  elements.uploadInput.addEventListener('change', onUploadInputChange);

  var onUploadFormSubmit = function (evt) {
    var submitData = new FormData(document.querySelector('.upload-form'));

    var validateResult = validateWords(elements.hashTagInput.value, HASHES_MAX_COUNT, HASHES_MAX_LENGTH, HASHES_PATTERN);

    evt.preventDefault();
    if (elements.hashTagInput.value.length > 0 && !validateResult) {
      elements.hashTagInput.style.borderColor = 'red';
    } else {
      elements.hashTagInput.style.removeProperty('border-color');
      var onLoad = function () {
        hideUploadForm();
      };
      var onError = function (message) {
        window.utils.errorDialog(message);
      };

      window.backend.formSumbit(submitData, onLoad, onError);
    }

  };

  var validateWords = function (string, maxWords, maxLength, pattern) {

    var isValid = false;
    var words = string.toLowerCase().split(' ');

    for (var i = 0; i < words.length; i++) {
      if (!pattern.test(words[i])) {
        isValid = false;
        break;
      } else if (words.length > maxWords) {
        isValid = false;
        break;
      } else if (words.indexOf(words[i], i + 1) >= 0) {
        isValid = false;
        break;
      } else if (words[i].length > maxLength) {
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

  var setEffectDefault = function () {
    elements.effectLevelPin.style.left = EFFECT_MAX_VALUE + '%';
    elements.effectLevelVal.style.width = EFFECT_MAX_VALUE + '%';
    elements.effectLevelValue.value = EFFECT_MAX_VALUE;
    elements.uploadPicture.style.removeProperty('filter');
  };

  var changeEffectFilter = function (effectLevel) {
    var effectElement = elements.uploadPicture;
    if (effectElement.classList.contains('effect-chrome')) {
      effectElement.style.filter = 'grayscale(' + effectLevel / 100 + ')';
    } else if (effectElement.classList.contains('effect-sepia')) {
      effectElement.style.filter = 'sepia(' + effectLevel / 100 + ')';
    } else if (effectElement.classList.contains('effect-marvin')) {
      effectElement.style.filter = 'invert(' + effectLevel + '%)';
    } else if (effectElement.classList.contains('effect-phobos')) {
      effectElement.style.filter = 'blur(' + effectLevel * 3 / 100 + 'px)';
    } else if (effectElement.classList.contains('effect-heat')) {
      effectElement.style.filter = 'brightness(' + effectLevel * 3 / 100 + ')';
    }
  };

  window.initializeSlider({
    callback: changeEffectFilter,
    pin: elements.effectLevelPin,
    line: elements.effectLevelLine,
    val: elements.effectLevelVal,
    value: elements.effectLevelValue,
    maxValue: EFFECT_MAX_VALUE,
    minValue: EFFECT_MIN_VALUE
  });


  var uploadFormEvents = [{
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
  }];

  var validateExtention = function (array, string) {
    var position = string.lastIndexOf('.') + 1;
    var extention = string.substring(position, string.length).toLowerCase();
    var isValid = false;

    for (var i = 0; i < array.length; i++) {
      if (array[i] === extention) {
        isValid = true;
        break;
      }
    }
    return isValid;
  };

  var showUploadForm = function () {
    elements.uploadOverlay.removeClass('hidden');
    window.utils.addMultipleEvents(uploadFormEvents);
  };
  var hideUploadForm = function () {
    elements.uploadOverlay.addClass('hidden');
    resetUploadForm();
    setEffectDefault();
    window.utils.removeMultipleEvents(uploadFormEvents);
  };

})();
