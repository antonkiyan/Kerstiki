(function () {
  'use strict';

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

  const stepCounter = {
    step: 0,
    increase: function () { this.step++; },
    get: function () { return this.step; },
    reset: function () { this.step = 0; }
  };

  // РЕЖИМЫ ИГРЫ:
  // 0 - мультиплеер,
  // 1 - игра за крестики, сложность низкая,
  // 2 - игра за крестики, сложность средняя,
  // 3 - игра за крестики, сложность высокая,
  // 4 - игра за нолики, сложность низкая,
  // 5 - игра за нолики, сложность средняя,
  // 6 - игра за нолики, сложность высокая

  const gameMode = {
    mode: 0,
    setMode: function (num) {
      this.mode = num;
    },
    getMode: function () {
      return this.mode;
    },
    reset: function () {
      this.mode = 0;
    }
  };

  const LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const DANGER_GROUPS = [
    {
      line1: [1, 2],
      line2: [3, 6],
      common: 0
    },
    {
      line1: [1, 2],
      line2: [4, 8],
      common: 0
    },
    {
      line1: [3, 6],
      line2: [4, 8],
      common: 0
    },
    {
      line1: [0, 1],
      line2: [5, 8],
      common: 2
    },
    {
      line1: [0, 1],
      line2: [4, 6],
      common: 2
    },
    {
      line1: [5, 8],
      line2: [4, 6],
      common: 2
    },
    {
      line1: [2, 5],
      line2: [6, 7],
      common: 8
    },
    {
      line1: [2, 5],
      line2: [0, 4],
      common: 8
    },
    {
      line1: [0, 4],
      line2: [6, 7],
      common: 8
    },
    {
      line1: [0, 3],
      line2: [7, 8],
      common: 6
    },
    {
      line1: [0, 3],
      line2: [4, 2],
      common: 6
    },
    {
      line1: [4, 2],
      line2: [7, 8],
      common: 6
    },
    {
      line1: [0, 2],
      line2: [4, 7],
      common: 1
    },
    {
      line1: [2, 8],
      line2: [3, 4],
      common: 5
    },
    {
      line1: [1, 4],
      line2: [6, 8],
      common: 7
    },
    {
      line1: [0, 6],
      line2: [4, 5],
      common: 3
    },
  ];

  const CELL_GROUP_1 = {
    cells: ['15', '57', '37', '13'],
    target: [[0, 2, 8], [2, 6, 8], [0, 6, 8], [0, 2 ,6]]
  };

  const CELL_GROUP_2 = {
    cells: ['18', '16', '07', '27', '05', '56', '23', '38'],
    target: [
      [0, 2, 3, 5],
      [0, 2, 3, 5],
      [3, 5, 6, 8],
      [3, 5, 6, 8],
      [1, 2, 7, 8],
      [1, 2, 7, 8],
      [0, 1, 6, 7],
      [0, 1, 6, 7]
    ]
  };

  const CELL_GROUP_3 = {
    cells: [0, 2, 6, 8],
    target: [8, 6, 2, 0]
  };

  const playerMoves = {
    moves: [],
    add: function (cellNum) {
      this.moves.push(cellNum);
    },
    reset: function () {
      this.moves = [];
    }
  };

  const getCellName = (cell) => {
    return cell.firstChild ? cell.firstChild.className.baseVal : 'empty';
  };

  const getRandomEmpty = (items) => {
    while (true) {
      let item = Random.getItem(items);
      if (!item.firstChild) { return item; }
    }
  };

  const ComputerMove = function (cells) {
    this._cells = cells;
  };

  ComputerMove.prototype.getFirstCell = function () {
    if (gameMode.getMode() === 6) {
      return this._cells[4];
    } else {
      return Random.getItem(this._cells);
    }
  };

  ComputerMove.prototype.getCell = function () {
    if (gameMode.getMode() === 1) {
      return getRandomEmpty(this._cells);
    }
  //==========================================
  //==========================================
    if (gameMode.getMode() === 2) {
      if (this._getPossibleCellNum('ring') !== -1) {
        return this._cells[this._getPossibleCellNum('ring')];
      }

      if (this._getPossibleCellNum('cross') !== -1) {
        return this._cells[this._getPossibleCellNum('cross')];
      }

      return getRandomEmpty(this._cells);
    }
    //==========================================
  //==========================================
    if (gameMode.getMode() === 3) {
      if (stepCounter.step === 1) {
        if (playerMoves.moves[0] !== 4) {
          return this._cells[4];
        } else {
          return this._cells[Random.getItem([0, 2, 6, 8])];
        }
      }

      if (stepCounter.step === 3) {
        if (this._isNotEmptyLine(LINES[6]) || this._isNotEmptyLine(LINES[7])) {
          if (playerMoves.moves[0] !== 4) {
            return this._cells[Random.getItem([1, 3, 5, 7])];
          }

          if (playerMoves.moves[0] === 4 && this._isNotEmptyLine(LINES[6])) {
            return this._cells[Random.getItem([2, 6])];
          }

          if (playerMoves.moves[0] === 4 && this._isNotEmptyLine(LINES[7])) {
            return this._cells[Random.getItem([0, 8])];
          }
        }

        if (this._isNotEmptyLine(LINES[4]) || this._isNotEmptyLine(LINES[1])) {
          return this._cells[Random.getItem([0, 2, 6, 8])];
        }

        const moves = playerMoves.moves.sort((a, b) => { return a - b; }).join('');
        const idx1 = CELL_GROUP_1.cells.indexOf(moves);
        const idx2 = CELL_GROUP_2.cells.indexOf(moves);

        if (idx1 !== -1) {
          return this._cells[Random.getItem(CELL_GROUP_1.target[idx1])];
        }

        if (idx2 !== -1) {
          return this._cells[Random.getItem(CELL_GROUP_2.target[idx2])];
        }
      }

      if (this._getPossibleCellNum('ring') !== -1) {
        return this._cells[this._getPossibleCellNum('ring')];
      }

      if (this._getPossibleCellNum('cross') !== -1) {
        return this._cells[this._getPossibleCellNum('cross')];
      }

      if (this._getDangerStateCell('cross') !== -1) {
        console.log(this._getDangerStateCell('cross'));

        return this._cells[this._getDangerStateCell('cross')];
      }

      if (this._getOneOfTwoEmpty('ring') !== -1) {
        return this._cells[this._getOneOfTwoEmpty('ring')];
      }

      return getRandomEmpty(this._cells);
    }
    //==========================================
  //==========================================
    if (gameMode.getMode() === 4) {
      return getRandomEmpty(this._cells);
    }
    //==========================================
  //==========================================
    if (gameMode.getMode() === 5) {
      if (this._getPossibleCellNum('cross') !== -1) {
        return this._cells[this._getPossibleCellNum('cross')];
      }

      if (this._getPossibleCellNum('ring') !== -1) {
        return this._cells[this._getPossibleCellNum('ring')];
      }

      return getRandomEmpty(this._cells);
    }
    //==========================================
  //==========================================
    if (gameMode.getMode() === 6) {
      console.log(stepCounter.step);

      const idx3 = CELL_GROUP_3.cells.indexOf(playerMoves.moves[0]);

      if (stepCounter.step === 2 && idx3 !== -1) {
        if (Random.getNum(1, 4) === 1) {
          return this._cells[CELL_GROUP_3.target[idx3]];
        } else {
          return getRandomEmpty(this._cells);
        }
      }

      if (stepCounter.step === 2 && idx3 === -1) {
        return this._cells[Random.getItem([0, 2, 6, 8])];
      }

      if (this._getPossibleCellNum('cross') !== -1) {
        return this._cells[this._getPossibleCellNum('cross')];
      }

      if (this._getPossibleCellNum('ring') !== -1) {
        return this._cells[this._getPossibleCellNum('ring')];
      }

      if (this._getDangerStateCell('cross') !== -1) {
        console.log(this._getDangerStateCell('cross'));

        return this._cells[this._getDangerStateCell('cross')];
      }

      if (this._getOneOfTwoEmpty('cross') !== -1) {
        return this._cells[this._getOneOfTwoEmpty('cross')];
      }

      return getRandomEmpty(this._cells);
    }
  };

  ComputerMove.prototype._getPossibleCellNum = function (player) {
    let cellNum = -1;

    LINES.forEach((line) => {
      if (
        getCellName(this._cells[line[0]]) === 'empty'
        && getCellName(this._cells[line[1]]) === player
        && getCellName(this._cells[line[1]]) === getCellName(this._cells[line[2]])
      ) {
        cellNum = line[0];
      }

      if (
        getCellName(this._cells[line[1]]) === 'empty'
        && getCellName(this._cells[line[0]]) === player
        && getCellName(this._cells[line[0]]) === getCellName(this._cells[line[2]])
      ) {
        cellNum = line[1];
      }

      if (
        getCellName(this._cells[line[2]]) === 'empty'
        && getCellName(this._cells[line[0]]) === player
        && getCellName(this._cells[line[0]]) === getCellName(this._cells[line[1]])
      ) {
        cellNum = line[2];
      }
    });

    return cellNum;
  };

  ComputerMove.prototype._getOneOfTwoEmpty = function (player) {
    let cellNum = -1;

    LINES.forEach((line) => {
      if (
        getCellName(this._cells[line[0]]) === player
        && getCellName(this._cells[line[1]]) === 'empty'
        && getCellName(this._cells[line[1]]) === getCellName(this._cells[line[2]])
      ) {
        cellNum = Random.getItem([line[1], line[2]]);
      }

      if (
        getCellName(this._cells[line[1]]) === player
        && getCellName(this._cells[line[0]]) === 'empty'
        && getCellName(this._cells[line[0]]) === getCellName(this._cells[line[2]])
      ) {
        cellNum = Random.getItem([line[0], line[2]]);
      }

      if (
        getCellName(this._cells[line[2]]) === player
        && getCellName(this._cells[line[0]]) === 'empty'
        && getCellName(this._cells[line[0]]) === getCellName(this._cells[line[1]])
      ) {
        cellNum = Random.getItem([line[0], line[1]]);
      }
    });

    return cellNum;
  };

  ComputerMove.prototype._isNotEmptyLine = function (line) {
    let isNotEmpty = true;

    line.forEach((cell) => {
      if (!this._cells[cell].firstChild && isNotEmpty) {
        isNotEmpty = false;
      }
    });

    return isNotEmpty;
  };

  ComputerMove.prototype._hasPlayerSingleMove = function (line, player) {
    let hasPlayerMove = false;

    if (
      getCellName(this._cells[line[0]]) === player
      && getCellName(this._cells[line[1]]) === 'empty'
    ) {
      hasPlayerMove = true;
    }

    if (
      getCellName(this._cells[line[1]]) === player
      && getCellName(this._cells[line[0]]) === 'empty'
    ) {
      hasPlayerMove = true;
    }

    return hasPlayerMove;
  };

  ComputerMove.prototype._getDangerStateCell = function (player) {
    let cellNum = -1;

    DANGER_GROUPS.forEach((group) => {
      if (
        cellNum === -1
        && getCellName(this._cells[group.common]) === 'empty'
        && this._hasPlayerSingleMove(group.line1, player)
        && this._hasPlayerSingleMove(group.line2, player)
      ) {
        cellNum = group.common;
      }
    });

    return cellNum;
  };

  //const field = document.querySelector('.field');
  const cells = document.querySelectorAll('.field__cell');

  const renderMove = new RenderMove();

  const isEmptyCell = (target) => { return target.classList.contains('field__cell'); };

  const Move = function () {
    this._computerMove = new ComputerMove(cells);

    this.player = this.player.bind(this);
    this.computer = this.computer.bind(this);
    this.makeFirst = this.makeFirst.bind(this);
  };

  Move.prototype.player = function (target) {
    if (isEmptyCell(target)) {
      renderMove.set(target);
      stepCounter.increase();
      playerMoves.add(+target.getAttribute('data-id'));
    }
  };

  Move.prototype.computer = function (target) {
    if (isEmptyCell(target)) {
      if (gameMode.getMode() !== 0) {
        renderMove.set(this._computerMove.getCell());
        stepCounter.increase();
      }
    }
  };

  Move.prototype.makeFirst = function () {
    renderMove.set(this._computerMove.getFirstCell());
    stepCounter.increase();
  };

  const begin = document.querySelector('.begin');
  const multiplayer = document.querySelector('.begin__button--multiplayer');
  const crossPlayer = document.querySelector('.begin__button--one-player-cross');
  const ringPlayer = document.querySelector('.begin__button--one-player-ring');

  const crossDifficulty = document.querySelector('.difficulty--cross');
  const ringDifficulty = document.querySelector('.difficulty--ring');
  const difficultyCross = document.querySelectorAll('.difficulty__button--cross');
  const difficultyRing = document.querySelectorAll('.difficulty__button--ring');

  const crossEasyMode = document.querySelector('.difficulty__button--cross-easy');
  const crossMediumMode = document.querySelector('.difficulty__button--cross-medium');
  const crossHardMode = document.querySelector('.difficulty__button--cross-hard');
  const ringEasyMode = document.querySelector('.difficulty__button--ring-easy');
  const ringMediumMode = document.querySelector('.difficulty__button--ring-medium');
  const ringHardMode = document.querySelector('.difficulty__button--ring-hard');

  // РЕЖИМЫ ИГРЫ:
  // 0 - мультиплеер,
  // 1 - игра за крестики, сложность низкая,
  // 2 - игра за крестики, сложность средняя,
  // 3 - игра за крестики, сложность высокая,
  // 4 - игра за нолики, сложность низкая,
  // 5 - игра за нолики, сложность средняя,
  // 6 - игра за нолики, сложность высокая

  const Menu = function (onComputerFirst) {
    this._onComputerFirst = onComputerFirst;
    this._onMultiClick = this._onMultiClick.bind(this);
    this._onSingleRingClick = this._onSingleRingClick.bind(this);
    this._onSingleCrossClick = this._onSingleCrossClick.bind(this);
    this._onCrossDifficultyClick = this._onCrossDifficultyClick.bind(this);
    this._onRingDifficultyClick = this._onRingDifficultyClick.bind(this);
  };

  Menu.prototype._setMode = function (modeNum) {
    domUtil.hide(begin);
    gameMode.setMode(modeNum);
  };

  Menu.prototype._onMultiClick = function () {
    this._setMode(0);
  };

  Menu.prototype._onSingleCrossClick = function () {
    domUtil.show(crossDifficulty);
  };

  Menu.prototype._onSingleRingClick = function () {
    domUtil.show(ringDifficulty);
  };

  Menu.prototype._onCrossDifficultyClick = function (evt) {
    const target = evt.target;
    const mode = +target.getAttribute('data-mode');

    domUtil.hide(crossDifficulty);
    this._setMode(mode);
  };

  Menu.prototype._onRingDifficultyClick = function (evt) {
    const target = evt.target;
    const mode = +target.getAttribute('data-mode');

    domUtil.hide(ringDifficulty);
    this._setMode(mode);
    this._onComputerFirst();
  };

  Menu.prototype.show = () => { domUtil.show(begin); };

  Menu.prototype.addEventListeners = function () {
    multiplayer.addEventListener('click', this._onMultiClick);
    ringPlayer.addEventListener('click', this._onSingleRingClick);
    crossPlayer.addEventListener('click', this._onSingleCrossClick);

    difficultyCross.forEach((button) => {
      button.addEventListener('click', this._onCrossDifficultyClick);
    });

    difficultyRing.forEach((button) => {
      button.addEventListener('click', this._onRingDifficultyClick);
    });
  };

  // import {RenderMove} from './renderMove.js';

  const field = document.querySelector('.field');
  // const cells = document.querySelectorAll('.field__cell');

  // const renderMove = new RenderMove();

  // const isEmptyCell = (target) => { return target.classList.contains('field__cell'); };

  const Field = function (playerMove, computerMove, isGameover, gameoverOpen) {
    this._isDelay = false;
    this._playerMove = playerMove;
    this._computerMove = computerMove;
    this._isGameover = isGameover;
    this._gameoverOpen = gameoverOpen;
    this._onFieldClick = this._onFieldClick.bind(this);

    //this._computerMove = new ComputerMove(cells);
  };

  Field.prototype._onFieldClick = function (evt) {
    const target = evt.target;

    console.log(this._isDelay);


    if (!this._isDelay) {
      if (!this._isGameover()) {
          this._playerMove(target);
          if (gameMode.getMode() !== 0) {
            this._isDelay = true;
          }

          console.log('move');

      }

      if (this._isGameover()) {
        this._gameoverOpen();
        this._isDelay = false;
      }

      if (gameMode.getMode() !== 0) {
        setTimeout(() => {
          if (!this._isGameover()) {
              this._computerMove(target);
          }

          if (this._isGameover()) {
            this._gameoverOpen();
          }

          this._isDelay = false;
        }, 500);
      }
    }


    // if (isEmptyCell(target)) {
    //   renderMove.set(target);
    //   stepCounter.increase();

    //   if (gameMode.getMode() !== 0) {
    //     renderMove.set(this._computerMove.getCell());
    //   }
    //}
  };

  Field.prototype.addEventListeners = function () {
    field.addEventListener('click', this._onFieldClick);
  };

  const cells$1 = document.querySelectorAll('.field__cell');
  const renderMove$1 = new RenderMove();

  var clearField = function () {
    cells$1.forEach(function (cell) {
      if (cell.firstChild) {
        cell.removeChild(cell.firstChild);
      }
    });
  };

  const Reset = {
    field: () => {
      clearField();
      stepCounter.reset();
      playerMoves.reset();
      renderMove$1.reset();
    },
    game: () => {
      clearField();
      stepCounter.reset();
      playerMoves.reset();
      gameMode.reset();
      renderMove$1.reset();
    }
  };

  const gameover = document.querySelector('.gameover');
  const winner = document.querySelector('.gameover__text');
  const close = document.querySelector('.gameover__close');
  const menu = document.querySelector('.gameover__to-start');

  const cells$2 = document.querySelectorAll('.field__cell');

  const getCellName$1 = (cell) => {
    return cell.firstChild ? cell.firstChild.className.baseVal : 'empty';
  };

  const GameOver = function (openMenu, onComputerFirst) {
    this._openMenu = openMenu;
    this._onComputerFirst = onComputerFirst;
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onMenuClick = this._onMenuClick.bind(this);
    this.isEnd = this.isEnd.bind(this);
    this.open = this.open.bind(this);

    this._name = '';
    this._class = '';
  };

  GameOver.prototype._addMessage = function (message) {
    let text = '';
    this._class = message;

    if (message === 'tie') {
      text = 'Ничья!';
    }

    if (message === 'ring') {
      text = 'Победили нолики!';
    }

    if (message === 'cross') {
      text = 'Победили крестики!';
    }

    winner.classList.add(this._class);
    winner.textContent = text;
  };

  GameOver.prototype._onCloseClick = function () {
    domUtil.hide(gameover);
    Reset.field();

    if (gameMode.getMode() > 3) {
      this._onComputerFirst();
    }

    this._removeEventListeners();
    winner.classList.remove(this._class);
  };

  GameOver.prototype._onMenuClick = function () {
    domUtil.hide(gameover);
    Reset.game();
    this._openMenu();
    this._removeEventListeners();
    winner.classList.remove(this._class);
  };

  GameOver.prototype._addEventListeners = function () {
    close.addEventListener('click', this._onCloseClick);
    menu.addEventListener('click', this._onMenuClick);
  };

  GameOver.prototype._removeEventListeners = function () {
    close.removeEventListener('click', this._onCloseClick);
    menu.removeEventListener('click', this._onMenuClick);
  };

  GameOver.prototype.isEnd = function () {
    LINES.forEach((line) => {
      if (
        getCellName$1(cells$2[line[0]]) !== 'empty'
        && getCellName$1(cells$2[line[0]]) === getCellName$1(cells$2[line[1]])
        && getCellName$1(cells$2[line[1]]) === getCellName$1(cells$2[line[2]])
      ) {
        this._name = getCellName$1(cells$2[line[0]]);
      }
    });

    if (!this._name && stepCounter.step === 9) {
      this._name = 'tie';
    }

    return !!this._name;
  };

  GameOver.prototype.open = function () {
    this._addMessage(this._name);
    domUtil.show(gameover);
    this._addEventListeners();
    this._name = '';
  };

  const move = new Move();
    const menu$1 = new Menu(move.makeFirst);
    const gameover$1 = new GameOver(menu$1.show, move.makeFirst);
    const field$1 = new Field(move.player, move.computer, gameover$1.isEnd, gameover$1.open);

    menu$1.show();
    menu$1.addEventListeners();
    field$1.addEventListeners();

    // var getRandomNumber = function (min, max) {
    //   return Math.floor(Math.random() * (max - min + 1)) + min;
    // };

    // var onMultiplayerClick = function () {
    //   begin.classList.remove('show');
    //   isMultiplayer = true;
    // };

    // var onCrossPlayerClick = function () {
    //   begin.classList.remove('show');
    // };

    // var onRingPlayerClick = function () {
    //   begin.classList.remove('show');
    //   isRingPlayer = true;
    //   computer = 'cross';
    //   human = 'ring';
    //   setTimeout(computerMove, DELAY);
    // };

    // var changePlayer = function () {
    //   isCross = isCross ? false : true;
    // };

    // var render = function () {
    //   var node = isCross ?
    //     crossTemplate.cloneNode(true) :
    //     ringTemplate.cloneNode(true);
    //   changePlayer();

    //   return node;
    // };

    // var getCellName = function (num) {
    //   return cells[num].firstChild ?
    //     cells[num].firstChild.classList[0] :
    //     'empty';
    // };

    // var checkFullLine = function (line) {
    //   var isAllSame = false;

    //   if (
    //     getCellName(line[0]) !== 'empty'
    //       && getCellName(line[0]) === getCellName(line[1])
    //       && getCellName(line[0]) === getCellName(line[2])
    //   ) {
    //     winner = getCellName(line[0]);
    //     isAllSame = true;
    //   }

    //   return isAllSame;
    // };

    // var checkEnd = function () {
    //   var isEnd = false;

    //   LINES.forEach(function (line) {
    //     if (checkFullLine(line) && !isEnd) {
    //       isEnd = true;
    //     }
    //   });

    //   return isEnd;
    // };

    // var getPossibleLineCell = function (line, player) {
    //   if (
    //     getCellName(line[0]) === player
    //     && getCellName(line[0]) === getCellName(line[1])
    //     && getCellName(line[2]) === 'empty'
    //   ) {
    //     return line[2];
    //   }

    //   if (
    //     getCellName(line[0]) === player
    //     && getCellName(line[0]) === getCellName(line[2])
    //     && getCellName(line[1]) === 'empty'
    //   ) {
    //     return line[1];
    //   }

    //   if (
    //     getCellName(line[1]) === player
    //     && getCellName(line[1]) === getCellName(line[2])
    //     && getCellName(line[0]) === 'empty'
    //   ) {
    //     return line[0];
    //   }

    //   return -1;
    // };

    // var getPossibleFieldCell = function (player) {
    //   var cell = -1;

    //   LINES.forEach(function (line) {
    //     var currentCell = getPossibleLineCell(line, player);

    //     if (currentCell !== -1 && cell === -1) {
    //       cell = currentCell;
    //     }
    //   });

    //   return cell;
    // };

    // var computerMove = function () {
    //   var dangerNum = getPossibleFieldCell(human);
    //   var winningNum = getPossibleFieldCell(computer);
    //   var randomNum = -1;

    //   isDelay = false;

    //   if (winningNum !== -1) {
    //     cells[winningNum].appendChild(render());
    //     step += 1;
    //     stepCounter.increase();
    //     console.log(stepCounter.step);

    //     if (checkEnd()) {
    //       showMessage();
    //       return;
    //     }

    //     if (step === 9) {
    //       showMessage();
    //     }

    //     return;
    //   }

    //   if (dangerNum !== -1) {
    //     cells[dangerNum].appendChild(render());
    //     step += 1;
    //     stepCounter.increase();
    //     console.log(stepCounter.step);

    //     if (checkEnd()) {
    //       showMessage();
    //       return;
    //     }

    //     if (step === 9) {
    //       showMessage();
    //     }

    //     return;
    //   }

    //   while (randomNum === -1) {
    //     let num = getRandomNumber(0, 8);
    //     randomNum = cells[num].firstChild ? -1 : num;
    //   }

    //   cells[randomNum].appendChild(render());
    //   step += 1;
    //   stepCounter.increase();
    //   console.log(stepCounter.step);

    //   if (checkEnd()) {
    //     showMessage();
    //     return;
    //   }

    //   if (step === 9) {
    //     showMessage();
    //   }
    // };

    // var showMessage = function () {
    //   message.className = 'gameover__text';
    //   message.classList.add(winner);
    //   message.textContent = WIN_MESSAGE[winner];
    //   gameover.classList.add('show');
    // };

    // var clearField = function () {
    //   cells.forEach(function (cell) {
    //     if (cell.firstChild) {
    //       cell.removeChild(cell.firstChild);
    //     }
    //   });
    // };

    // var onCloseClick = function () {
    //   clearField();
    //   gameover.classList.remove('show');
    //   message.textContent = '';
    //   isCross = true;
    //   winner = 'tie';
    //   step = 0;
    //   isDelay = false;

    //   if (isRingPlayer) {
    //     setTimeout(computerMove, DELAY);
    //   }
    // };

    // var onMenuClick = function () {
    //   isRingPlayer = false;
    //   isMultiplayer = false;
    //   gameover.classList.remove('show');
    //   clearField();
    //   message.textContent = '';
    //   isCross = true;
    //   winner = 'tie';
    //   step = 0;
    //   isDelay = false;
    //   computer = 'ring';
    //   human = 'cross';

    //   begin.classList.add('show');
    // };

    // var onFieldClick = function (evt) {
    //   var target = evt.target;

    //   if (target.classList.contains('field__cell') && !isDelay) {
    //     isDelay = isMultiplayer ? false : true;
    //     target.appendChild(render());
    //     step += 1;
    //     stepCounter.increase();
    //     console.log(stepCounter.step);


    //     if (checkEnd()) {
    //       showMessage();
    //       return;
    //     }

    //     if (step === 9) {
    //       showMessage();
    //       return;
    //     }

    //     if (!isMultiplayer) {
    //       setTimeout(computerMove, DELAY);
    //     }
    //   }
    // };

    // begin.classList.add('show');
    // multiplayer.addEventListener('click', onMultiplayerClick);
    // crossPlayer.addEventListener('click', onCrossPlayerClick);
    // ringPlayer.addEventListener('click', onRingPlayerClick);
    // field.addEventListener('click', onFieldClick);
    // close.addEventListener('click', onCloseClick);
    // menu.addEventListener('click', onMenuClick);

}());

//# sourceMappingURL=main.js.map
