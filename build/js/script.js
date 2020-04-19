(function () {
  var field = document.querySelector('.field');
  var cells = document.querySelectorAll('.field__cell');
  var gameover = document.querySelector('.gameover');
  var message = document.querySelector('.gameover__text');
  var close = document.querySelector('.gameover__close');
  var menu = document.querySelector('.gameover__to-start');

  var begin = document.querySelector('.begin');
  var multiplayer = document.querySelector('.begin__button--multiplayer');
  var crossPlayer = document.querySelector('.begin__button--one-player-cross');
  var ringPlayer = document.querySelector('.begin__button--one-player-ring');

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

  var DELAY = 500;

  var isDelay = false;

  var WIN_MESSAGE = {
    'cross': 'Выиграли крестики!',
    'ring': 'Выиграли нолики!',
    'tie': 'Ничья!'
  };

  var winner = 'tie';
  var computer = 'ring';
  var human = 'cross';
  var isCross = true;
  var isMultiplayer = false;
  var isRingPlayer = false;
  var step = 0;

  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var onMultiplayerClick = function () {
    begin.classList.remove('show');
    isMultiplayer = true;
  };

  var onCrossPlayerClick = function () {
    begin.classList.remove('show');
  };

  var onRingPlayerClick = function () {
    begin.classList.remove('show');
    isRingPlayer = true;
    computer = 'cross';
    human = 'ring';
    setTimeout(computerMove, DELAY);
  };

  var changePlayer = function () {
    isCross = isCross ? false : true;
  };

  var render = function () {
    var node = isCross ?
      crossTemplate.cloneNode(true) :
      ringTemplate.cloneNode(true);
    changePlayer();

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

    isDelay = false;

    if (winningNum !== -1) {
      cells[winningNum].appendChild(render());
      step += 1;
      return;
    }

    if (dangerNum !== -1) {
      cells[dangerNum].appendChild(render());
      step += 1;
      return;
    }

    while (randomNum === -1) {
      num = getRandomNumber(0, 8);
      randomNum = cells[num].firstChild ? -1 : num;
    }

    cells[randomNum].appendChild(render());
    step += 1;

    if (checkEnd()) {
      showMessage();
      return;
    }

    if (step === 9) {
      showMessage();
    }
  }

  var showMessage = function () {
    message.className = 'gameover__text';
    message.classList.add(winner);
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
    isDelay = false;

    if (isRingPlayer) {
      setTimeout(computerMove, DELAY);
    }
  };

  var onMenuClick = function () {
    isRingPlayer = false;
    isMultiplayer = false;
    gameover.classList.remove('show');
    clearField();message.textContent = '';
    isCross = true;
    winner = 'tie';
    step = 0;
    isDelay = false;
    computer = 'ring';
    human = 'cross';

    begin.classList.add('show');
  }

  var onFieldClick = function (evt) {
    var target = evt.target;

    if (target.classList.contains('field__cell') && !isDelay) {
      isDelay = isMultiplayer ? false : true;
      target.appendChild(render());
      step += 1;

      if (checkEnd()) {
        showMessage();
        return;
      }

      if (step === 9) {
        showMessage();
        return;
      }

      if (!isMultiplayer) {
        setTimeout(computerMove, DELAY);
      }
    }
  }

  begin.classList.add('show');
  multiplayer.addEventListener('click', onMultiplayerClick);
  crossPlayer.addEventListener('click', onCrossPlayerClick);
  ringPlayer.addEventListener('click', onRingPlayerClick);
  field.addEventListener('click', onFieldClick);
  close.addEventListener('click', onCloseClick);
  menu.addEventListener('click', onMenuClick);
})();
