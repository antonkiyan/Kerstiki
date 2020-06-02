import {domUtil} from './util.js';
import {gameMode} from './gameMode.js';

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

export {Menu};
