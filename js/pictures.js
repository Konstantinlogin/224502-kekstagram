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
  addEvent(galleryPopupClose, 'focusout', onPictureCloseFocusOut);
};

var hidePopup = function () {
  galleryPopup.addClass('hidden');
  removeEvent(galleryPopupClose, 'click', onPictureCloseClick);
  removeEvent(document, 'keydown', onPictureCloseEscape);
  removeEvent(galleryPopupClose, 'focus', onPictureCloseFocus);
  removeEvent(galleryPopupClose, 'focusout', onPictureCloseFocusOut);
  document.querySelector('.is-active').removeClass('is-active');
};

addEvents(pictureElements, 'click', onPictureClick);
