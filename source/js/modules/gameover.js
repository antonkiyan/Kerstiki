import {LINES} from './constants.js';
import {domUtil} from './util.js';
import {Reset} from './reset.js';
import {gameMode} from './gameMode.js';
import {stepCounter} from './stepCounter.js';

const gameover = document.querySelector('.gameover');
const winner = document.querySelector('.gameover__text');
const close = document.querySelector('.gameover__close');
const menu = document.querySelector('.gameover__to-start');

const cells = document.querySelectorAll('.field__cell');

const getCellName = (cell) => {
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
      getCellName(cells[line[0]]) !== 'empty'
      && getCellName(cells[line[0]]) === getCellName(cells[line[1]])
      && getCellName(cells[line[1]]) === getCellName(cells[line[2]])
    ) {
      this._name = getCellName(cells[line[0]]);
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

// GameOver.prototype.check = function () {
//   let name = '';

//   LINES.forEach((line) => {
//     if (
//       getCellName(cells[line[0]]) !== 'empty'
//       && getCellName(cells[line[0]]) === getCellName(cells[line[1]])
//       && getCellName(cells[line[1]]) === getCellName(cells[line[2]])
//     ) {
//       name = getCellName(cells[line[0]]);
//     }
//   });

//   if (!name && stepCounter.step === 9) {
//     name = 'tie';
//   }

//   if (name) {
//     this._open(name);
//   }

//   console.log(name);

// };

// const onCloseClick = function () {
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

// const onMenuClick = function () {
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

export {GameOver};
