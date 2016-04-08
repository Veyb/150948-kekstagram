function getSum(a) {
  var arrSum = 0;
  for (var i = 0; i < a.length; i++) {
    arrSum += a[i];
  }
  return arrSum
};

function getMult(a, b) {
  var arrMult = 0;
  for (var i = 0; i < a.length; i++) {
    arrMult += a[i] * b[i];
  }
  return arrMult
};

function getMessage(a, b) {
  var typeA = typeof a;

  switch (typeA) {
    case 'boolean':
      return (a)
        ? 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров'
        : 'Переданное GIF-изображение не анимировано';
      break;
    case 'number':
      return 'Переданное SVG-изображение содержит ' + a + ' объектов и '+ (b * 4) + ' атрибутов';
      break;
    default:
      if (Array.isArray(a)) {
        var sum = getSum(a);
        return 'Количество красных точек во всех строчках изображения: ' + sum;
      } else if (Array.isArray(a) && Array.isArray(b)) {
        var c = getMult(a, b);
        var square = getSum(c);
        return 'Общая площадь артефактов сжатия: ' + square + ' пикселей';
      }
  }
};
