const domUtil = {
  show: (element) => { element.classList.add('show'); },
  hide: (element) => { element.classList.remove('show'); }
};

const getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomItem = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

const Random = {
  getNum: getRandomNumber,
  getItem: getRandomItem,
};

export {domUtil};
export {Random};
