'use strict';

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

Element.prototype.removeClass = function (classname) {
  this.classList.remove(classname);
};

var randomizeNumbers = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
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
galleryPopup.removeClass('hidden');

var appendPicture = function (element) {
  element.querySelector('img').setAttribute('src', pictures[0].url);
  element.querySelector('.likes-count').textContent = pictures[0].likes;
  element.querySelector('.comments-count').textContent = pictures[0].comments.length;
};

appendPicture(galleryPopup);
