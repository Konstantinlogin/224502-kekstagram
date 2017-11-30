'use strict';

var picturesData = [];

var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
]

var randomizeNumbers = function (min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var randomizeArray = function (array, itemsCount) {
  var randomizedItems = [];
  for (var i = 0; i < itemsCount; i++) {
    var randomNumber = Math.floor(Math.random() * array.length);
    randomizedItems.push(array[randomNumber]);
    array.splice(randomNumber, 1);
  }
  return randomizedItems;
};

var photosCount = 25;
var commentsCount = 2;

for (var i = 0; i < photosCount; i++) {
    picturesData[i] = {
      url: 'photos/'+ (i + 1) + '.jpg',
      likes: randomizeNumbers(15, 200),
      comments: randomizeArray(comments, commentsCount)
    }
}

var picturesTemplate = document.querySelector('#picture-template').content.querySelector('.picture');
var picturesList = document.querySelector('.pictures');

var renderPictures = function (obj) {
  var picturesElement = picturesTemplate.cloneNode(true);
  picturesElement.querySelector('img').setAttribute('src', obj.url);
  picturesElement.querySelector('.picture-comments').textContent = obj.comments.length;
  picturesElement.querySelector('.picture-likes').textContent = obj.likes;
  return picturesElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < picturesData.length; i++) {
  fragment.appendChild(renderPictures(picturesData[i]));
  picturesList.appendChild(fragment);
}

// console.log(picturesData);

// document.querySelector('.gallery-overlay').classList.remove('hidden');