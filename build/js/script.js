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
    'ring': 'Выиграли нолики!',
    'tie': 'Ничья!'
  };

  var winner = 'tie';
  var computer = 'ring';
  var human = 'cross';
  var isCross = true;
  var step = 0;

  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

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
      'empty';
  };

  var checkFullLine = function (line) {
    var isAllSame = false;

    if (
      getCellName(line[0]) !== 'empty'
      && getCellName(line[0]) === getCellName(line[1])
      && getCellName(line[0]) === getCellName(line[2])
    ) {
      winner = getCellName(line[0]);
      isAllSame = true;
    }

    return isAllSame;
  };

  var checkEnd = function () {
    var isEnd = false;

    LINES.forEach(function (line) {
      if (checkFullLine(line) && !isEnd) {
        isEnd = true;
      }
    });

    return isEnd;
  };

  var getPossibleLineCell = function (line, player) {
    if (
      getCellName(line[0]) === player
      && getCellName(line[0]) === getCellName(line[1])
      && getCellName(line[2]) === 'empty'
    ) {
      return line[2];
    }

    if (
      getCellName(line[0]) === player
      && getCellName(line[0]) === getCellName(line[2])
      && getCellName(line[1]) === 'empty'
    ) {
      return line[1];
    }

    if (
      getCellName(line[1]) === player
      && getCellName(line[1]) === getCellName(line[2])
      && getCellName(line[0]) === 'empty'
    ) {
      return line[0];
    }

    return -1;
  };

  var getPossibleFieldCell = function (player) {
    var cell = -1;

    LINES.forEach(function (line) {
      var currentCell = getPossibleLineCell(line, player);

      if (currentCell !== -1 && cell === -1) {
        cell = currentCell;
      }
    });

    return cell;
  };

  var computerMove = function () {
    var dangerNum = getPossibleFieldCell(human);
    var winningNum = getPossibleFieldCell(computer);
    var randomNum = -1;

    if (winningNum !== -1) {
      cells[winningNum].appendChild(render());
      return;
    }

    if (dangerNum !== -1) {
      cells[dangerNum].appendChild(render());
      return;
    }

    while (randomNum === -1) {
      num = getRandomNumber(0, 8);
      randomNum = cells[num].firstChild ? -1 : num;
    }

    cells[randomNum].appendChild(render());
  }

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
    winner = 'tie';
    step = 0;
  }

  var onFieldClick = function (evt) {
    var target = evt.target;

    if (target.classList.contains('field__cell')) {
      target.appendChild(render());
      step += 1;
      changePlayer();

      if (checkEnd()) {
        showMessage();
        return;
      }

      if (step === 9) {
        showMessage();
        return;
      }

      computerMove();
      step += 1;
      changePlayer();

      if (checkEnd()) {
        showMessage();
        return;
      }

      if (step === 9) {
        showMessage();
      }
    }
  }

  field.addEventListener('click', onFieldClick);
  close.addEventListener('click', onCloseClick);
})();
