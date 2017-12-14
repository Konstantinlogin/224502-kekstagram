'use strict';

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

Element.prototype.removeClass = function (classname) {
  this.classList.remove(classname);
};

Element.prototype.addClass = function (classname) {
  this.classList.add(classname);
};

var addMultipleEvents = function (array) {
  for (var i = 0; i < array.length; i++) {
    array[i].element.addEventListener(array[i].action, array[i].eventFunction);
  }
};

var removeMultipleEvents = function (array) {
  for (var i = 0; i < array.length; i++) {
    array[i].element.removeEventListener(array[i].action, array[i].eventFunction);
  }
};

var randomizeNumbers = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var addEvents = function (elements, actionName, eventName) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener(actionName, eventName, true);
  }
};

var getTemplateContent = function (template, element) {
  var templateContent;
  if ('content' in document.createElement('template')) {
    templateContent = document.querySelector(template).content.querySelector(element);
  } else {
    templateContent = document.querySelector(template).querySelector(element);
  }
  return templateContent;
};

var generateUrl = function (startCount) {
  var url = 'photos/' + startCount + '.jpg';
  return url;
};

var generatePicturesArray = function (count) {
  var array = [];
  for (var i = 0; i < count; i++) {
    array[i] = {
      url: generateUrl((i + 1)),
      likes: randomizeNumbers(15, 200),
      comments: [
        COMMENTS[randomizeNumbers(0, COMMENTS.length)]
      ]
    };
  }
  return array;
};

var pictures = generatePicturesArray(25);
var picturesTemplate = getTemplateContent('#picture-template', '.picture');

var renderPictures = function (picture) {
  var photoElement = picturesTemplate.cloneNode(true);
  photoElement.querySelector('img').setAttribute('src', picture.url);
  photoElement.querySelector('.picture-likes').textContent = picture.likes;
  photoElement.querySelector('.picture-comments').textContent = picture.comments.length;
  return photoElement;
};

var appendPictures = function (element) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pictures.length; i++) {
    fragment.appendChild(renderPictures(pictures[i]));
  }
  element.appendChild(fragment);
};

appendPictures(document.querySelector('.pictures'));

var galleryPopup = document.querySelector('.gallery-overlay');
var galleryPopupClose = galleryPopup.querySelector('.gallery-overlay-close');
var pictureElements = document.querySelectorAll('.picture');

var appendPicture = function (element, picture) {
  element.querySelector('img').setAttribute('src', picture.url);
  element.querySelector('.likes-count').textContent = picture.likes;
  element.querySelector('.comments-count').textContent = picture.commentsCount;
};

var onPictureCloseClick = function (evt) {
  hidePopup();
  evt.preventDefault();
};

var onPictureCloseEscape = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    hidePopup();
  }
};

var onPictureCloseEnter = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    hidePopup();
  }
};

var onPictureCloseFocus = function () {
  document.addEventListener('keydown', onPictureCloseEnter);
};

var onPictureCloseFocusOut = function () {
  document.removeEventListener('keydown', onPictureCloseEnter);
};

var onPictureClick = function (evt) {
  var isActive = evt.currentTarget;
  isActive.addClass('is-active');
  evt.preventDefault();
  var activePicture = document.querySelector('.is-active');
  var picture = {
    url: activePicture.querySelector('img').getAttribute('src'),
    likes: activePicture.querySelector('.picture-likes').textContent,
    commentsCount: activePicture.querySelector('.picture-comments').textContent
  };
  appendPicture(galleryPopup, picture);
  showPopup();
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
  addMultipleEvents(uploadedPicturesEvents);
};

var hidePopup = function () {
  galleryPopup.addClass('hidden');
  document.querySelector('.is-active').removeClass('is-active');
  removeMultipleEvents(uploadedPicturesEvents);
};

// TODO: функцию addevents заменить на делегирование
addEvents(pictureElements, 'click', onPictureClick);

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
  if (evt.keyCode === ESC_KEYCODE) {
    hideUploadForm();
  }
};

var onUploadOverlayCloseEnter = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
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

// Взаимодействие с upload form

uploadInput.addEventListener('change', onUploadInputChange);

var onUploadFormSubmit = function (evt) {
  if (hashTagInput.value.length > 0 && validateHashTags(hashTagInput.value) === false) {
    hashTagInput.style.borderColor = 'red';
    evt.preventDefault();
  } else {
    hashTagInput.style.removeProperty('border-color');
  }
};

var uploadFormEvents =
  [{
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
  }];


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

var showUploadForm = function () {
  uploadOverlay.removeClass('hidden');
  addMultipleEvents(uploadFormEvents);
};

var hideUploadForm = function () {
  uploadOverlay.addClass('hidden');
  resetUploadForm();
  removeMultipleEvents(uploadFormEvents);
};
