'use strict';
(function () {
  // upload form
  var uploadForm = document.querySelector('#upload-select-image');

  var elements = {
    hashTagInput: uploadForm.querySelector('.upload-form-hashtags'),
    uploadInput: uploadForm.querySelector('#upload-file'),
    commentTextarea: uploadForm.querySelector('.upload-form-description'),
    uploadOverlay: document.querySelector('.upload-overlay'),
    uploadOverlayClose: document.querySelector('#upload-cancel'),
    uploadPicture: uploadForm.querySelector('.effect-image-preview'),
    
    resizeControls: uploadForm.querySelector('.upload-resize-controls'),
    resizeDec: uploadForm.querySelector('.upload-resize-controls-button-dec'),
    resizeInc: uploadForm.querySelector('.upload-resize-controls-button-inc'),
    resizeInput: uploadForm.querySelector('.upload-resize-controls-value'),
    effectControls: uploadForm.querySelector('.upload-effect-controls'),

    effectLevel: uploadForm.querySelector('.upload-effect-level'),
    effectLevelPin: uploadForm.querySelector('.upload-effect-level-pin'),
    effectLevelVal: uploadForm.querySelector('.upload-effect-level-val'),
    effectLevelValue: uploadForm.querySelector('.upload-effect-level-value'),
    effectLevelLine: uploadForm.querySelector('.upload-effect-level-line')
  }

  var settings = {
    uploadPicture: {
      size: 100,
      stepSize: 25,
      maxSize: 100,
      minSize: 25,
      effects: ['chrome', 'sepia', 'marvin', 'phobos', 'heat'],
      effectLevel: {
        Min: 0,
        Max: 100,
        Default: elements.effectLevelValue.value
      }
    }
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
    if (settings.uploadPicture.size < settings.uploadPicture.maxSize) {
      settings.uploadPicture.size += settings.uploadPicture.stepSize;
    }
    return settings.uploadPicture.size;
  };

  var decPictureSize = function () {
    if (settings.uploadPicture.size > settings.uploadPicture.minSize) {
      settings.uploadPicture.size -= settings.uploadPicture.stepSize;
    }
    return settings.uploadPicture.size;
  };

  var resizePicture = function (val) {
    elements.resizeInput.value = val + '%';
    if (val === settings.uploadPicture.maxSize) {
      elements.uploadPicture.style.transform = 'scale(1)';
    } else {
      elements.uploadPicture.style.transform = 'scale(0.' + val + ')';
    }
  };

  var onResizeControlsChange = function (evt) {
    if (evt.target === settings.uploadPicture.resizeInc) {
      resizePicture(incPictureSize());
    }
    if (evt.target === settings.uploadPicture.resizeDec) {
      resizePicture(decPictureSize());
    }
  };

  var changeEffect = function (value) {
    var effectClass;
    var effectClassPrefix = 'effect';
    for (var i = 0; i < settings.uploadPicture.effects.length; i++) {
      effectClass = effectClassPrefix + '-' + settings.uploadPicture.effects[i];
      if (value === settings.uploadPicture.effects[i]) {
        elements.uploadPicture.addClass(effectClass);
      } else {
        elements.uploadPicture.removeClass(effectClass);
      }
    }
  };

  var onEffectControlsChange = function (evt) {
    changeEffect(evt.target.value);
  };

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
    changeEffect('default');
    uploadForm.querySelector('#upload-effect-none').checked = true;
    elements.uploadInput.value = '';
    elements.commentTextarea.value = '';
    elements.hashTagInput.value = '';
  };

  var positon = {
    Min: 0,
    Max: 100,
    Default: elements.effectLevelValue.value
  };

  var setDefaultEffectLevel = function () {
    elements.effectLevelPin.style.left = settings.uploadPicture.effectLevel.Default + '%';
    elements.effectLevelVal.style.width = elements.effectLevelPin.style.left;
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
  
      elements.effectLevelPin.style.left = effectLevel + '%';
    };

    var onMouseUp = function (moveEvt) {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  }
  
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
      element: elements.resizeControls,
      action: 'click',
      eventFunction: onResizeControlsChange
    },
    {
      element: elements.effectControls,
      action: 'change',
      eventFunction: onEffectControlsChange
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
    window.removeMultipleEvents(uploadFormEvents)
  };

})();
