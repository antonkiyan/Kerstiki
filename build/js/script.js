(function () {
  var field = document.querySelector('.field');
  var cells = document.querySelectorAll('.field__cell');
  var gameover = document.querySelector('.gameover');
  var message = document.querySelector('.gameover__text');
  var close = document.querySelector('.gameover__close');
  var crossTemplate = document.querySelector('#cross').content.querySelector('.cross');
  var ringTemplate = document.querySelector('#ring').content.querySelector('.ring');

  var LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  var WIN_MESSAGE = {
    'cross': 'Выиграли крестики!',
    'ring': 'Выиграли нолики!'
  };

  var winner = '';

  var isCross = true;

  var changePlayer = function () {
    isCross = isCross ? false : true;
  }

  var render = function () {
    var node = isCross ?
      crossTemplate.cloneNode(true) :
      ringTemplate.cloneNode(true);

    return node;
  };

  var getCellName = function (num) {
    return cells[num].firstChild ?
      cells[num].firstChild.classList[0] :
      '';
  };

  var checkLine = function (num1, num2, num3) {
    var isAllSame = false;

    if (
      getCellName(num1) !== ''
      && getCellName(num1) === getCellName(num2)
      && getCellName(num1) === getCellName(num3)
    ) {
      winner = getCellName(num1);
      isAllSame = true;
    }

    return isAllSame;
  };

  var checkField = function () {
    var isEnd = false;

    LINES.forEach(function (line) {
      if (checkLine(line[0], line[1], line[2]) && !isEnd) {
        isEnd = true;
      }
    });

    return isEnd;
  };

  var showMessage = function () {
    message.textContent = WIN_MESSAGE[winner];
    gameover.classList.add('show');
  };

  var clearField = function () {
    cells.forEach(function (cell) {
      if (cell.firstChild) {
        cell.removeChild(cell.firstChild);
      }
    })
  };

  var onCloseClick = function () {
    clearField();
    gameover.classList.remove('show');
    message.textContent = '';
    isCross = true;
  }

  var onFieldClick = function (evt) {
    var target = evt.target;

    if (target.classList.contains('field__cell')) {
      target.appendChild(render());
      changePlayer();
    }

    if (checkField()) {
      showMessage();
    }


  }

  field.addEventListener('click', onFieldClick);
  close.addEventListener('click', onCloseClick);
})();
