const crossTemplate = document.querySelector('#cross').content.querySelector('.cross');
const ringTemplate = document.querySelector('#ring').content.querySelector('.ring');

let isCross = true;

const t1 = gsap.timeline();

const getClassName = (cell) => {
  return '.' + cell.classList[1] + ' .' + cell.firstChild.classList[0];
};

const RenderMove = function () {};

RenderMove.prototype._setCross = function (cell) {
  const node = crossTemplate.cloneNode(true);

  cell.appendChild(node);

  const name = getClassName(cell);

  t1.fromTo(name, {
    scale: 0.5
  }, {
    scale: 1.2,
    duration: 0.1
  }).to(name, {
    scale: 1,
    duration: 0.1
  });
};

RenderMove.prototype._setRing = function (cell) {
  const node = ringTemplate.cloneNode(true);

  cell.appendChild(node);

  const name = getClassName(cell);

  t1.fromTo(name, {
    scale: 0.5
  }, {
    scale: 1.2,
    duration: 0.1
  }).to(name, {
    scale: 1,
    duration: 0.1
  });
};

RenderMove.prototype.set = function (cell) {
  isCross ? this._setCross(cell) : this._setRing(cell);
  isCross = isCross ? false : true;
};

RenderMove.prototype.reset = function () {
  isCross = true;
};

export {RenderMove};
