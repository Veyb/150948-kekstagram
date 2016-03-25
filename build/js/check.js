function getSum(arr) {
  var arrSum = 0;
  for (var i = 0; i < arr.length; i++) {
    arrSum += arr[i];
  }
  return arrSum
};

function getMessage(a, b) {
  var sum = getSum(a);
  var c = a * b;
  var square = getSum(c);

  if (typeof a === 'boolean') {
    if (a === true) {return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров'; }
    if (a === false) {return 'Переданное GIF-изображение не анимировано'; }
  }

  if (typeof a === 'number') {return 'Переданное SVG-изображение содержит ' + a + ' объектов и '+ (b * 4) + ' атрибутов'
  }

  if (typeof a === 'object') {return 'Количество красных точек во всех строчках изображения: ' + sum
  }

  if (typeof a === 'object' || typeof b === 'object') {return 'Общая площадь артефактов сжатия: ' + square + ' пикселей'
  }
};
