'use strict';

(function () {
  var COMMENTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var generateUrl = function (startCount) {
    var url = 'photos/' + startCount + '.jpg';
    return url;
  };
  var generatePicturesArray = function (count) {
    var array = [];
    for (var i = 0; i < count; i++) {
      array[i] = {
        url: generateUrl((i + 1)),
        likes: window.randomizeNumbers(15, 200),
        comments: [
          COMMENTS[window.randomizeNumbers(0, COMMENTS.length)]
        ]
      };
    }
    return array;
  };
  window.pictures = generatePicturesArray(25);
  window.picturesTemplate = window.getTemplateContent('#picture-template', '.picture');
})();
