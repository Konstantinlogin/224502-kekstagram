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

var randomizeNumbers = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var addEvents = function (elements, actionName, eventName) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener(actionName, eventName, true);
  }
};

var addEvent = function (element, actionName, eventName) {
  element.addEventListener(actionName, eventName, true);
};

var removeEvent = function (element, actionName, eventName) {
  element.removeEventListener(actionName, eventName, true);
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
  addEvent(document, 'keydown', onPictureCloseEnter);
};

var onPictureCloseFocusOut = function () {
  removeEvent(document, 'keydown', onPictureCloseEnter);
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

var showPopup = function () {
  galleryPopup.removeClass('hidden');
  addEvent(galleryPopupClose, 'click', onPictureCloseClick);
  addEvent(document, 'keydown', onPictureCloseEscape);
  addEvent(galleryPopupClose, 'focus', onPictureCloseFocus);
  addEvent(galleryPopupClose, 'blur', onPictureCloseFocusOut);
};

var hidePopup = function () {
  galleryPopup.addClass('hidden');
  removeEvent(galleryPopupClose, 'click', onPictureCloseClick);
  removeEvent(document, 'keydown', onPictureCloseEscape);
  removeEvent(galleryPopupClose, 'focus', onPictureCloseFocus);
  removeEvent(galleryPopupClose, 'blur', onPictureCloseFocusOut);
  document.querySelector('.is-active').removeClass('is-active');
};

addEvents(pictureElements, 'click', onPictureClick);

// upload form

var uploadForm = document.querySelector('#upload-select-image');
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

// Закрытие и закрытие upload picture

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
  addEvent(document, 'keydown', onUploadOverlayCloseEnter);
};

var onUploadOverlayCloseFocusOut = function () {
  removeEvent(document, 'keydown', onUploadOverlayCloseEnter);
};

var onUploadInputChange = function () {
  showUploadForm();
};

var onCommentTextareaFocusOut = function () {
  addEvent(document, 'keydown', onUploadOverlayEscape);
};

var onCommentTextareaFocus = function () {
  removeEvent(document, 'keydown', onUploadOverlayEscape);
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
    }
    else {
      uploadPicture.element.removeClass(effectClass); 
    }
  }
}

var onEffectControlsChange = function (evt) {
  changeEffect(evt.target.value);
};

var resetUploadForm = function () {
  resizePicture(100);
  changeEffect('default');
  uploadForm.querySelector('#upload-effect-none').checked = true;
};

var showUploadForm = function () {
  uploadOverlay.removeClass('hidden');
  addEvent(uploadOverlayClose, 'click', onUploadOverlayClose);
  addEvent(uploadOverlayClose, 'focus', onUploadOverlayCloseFocus);
  addEvent(uploadOverlayClose, 'blur', onUploadOverlayCloseFocusOut);
  addEvent(commentTextarea, 'focus', onCommentTextareaFocus);
  addEvent(commentTextarea, 'blur', onCommentTextareaFocusOut);
  addEvent(document, 'keydown', onUploadOverlayEscape);
  addEvent(uploadPicture.resizeControls, 'click', onResizeControlsChange);
  addEvent(uploadPicture.effectControls, 'change', onEffectControlsChange);
};

var hideUploadForm = function () {
  uploadOverlay.addClass('hidden');
  removeEvent(uploadOverlayClose, 'click', onUploadOverlayClose);
  removeEvent(uploadOverlayClose, 'focus', onUploadOverlayCloseFocus);
  removeEvent(uploadOverlayClose, 'blur', onUploadOverlayCloseFocusOut);
  removeEvent(commentTextarea, 'focus', onCommentTextareaFocus);
  removeEvent(commentTextarea, 'blur', onCommentTextareaFocusOut);
  removeEvent(document, 'keydown', onUploadOverlayEscape);
  removeEvent(uploadPicture.resizeControls, 'click', onResizeControlsChange);
  removeEvent(uploadPicture.effectControls, 'change', onEffectControlsChange);
  resetUploadForm();
};


addEvent(uploadInput, 'change', onUploadInputChange);

var validateHashTags = function (string) {
  var maxLength = {
    tags: 5
  }
  var errorTxt = {
    sameTags: 'один и тот же хэш-тег не может быть использован дважды',
    tooMuchTags: 'нельзя указать больше пяти хэш-тегов',
    tooLargeTag: 'максимальная длина одного хэш-тега 20 символов'
  }
  var hashes = string.toLowerCase().split(' ');
  var errorMessagess = [];
  if (hashes.length > maxLength.tags) {
    errorMessagess.push(errorTxt.tooMuchTags);
  }
  console.log(errorMessagess);
};

validateHashTags('hashtag HASHTAG haShTag otherHash otherHash otherHash');

// =================
// TODO: удалить после завершения задания
showUploadForm();