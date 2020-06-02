import {Random} from './util.js';
import {RenderMove} from './renderMove.js';
import {ComputerMove} from './computerMove.js';
import {stepCounter} from './stepCounter.js';
import {gameMode} from './gameMode.js';
import {playerMoves} from './playerMoves.js';

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

export {Move};
