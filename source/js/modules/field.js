// import {RenderMove} from './renderMove.js';
// import {ComputerMove} from './computerMove.js';
import {stepCounter} from './stepCounter.js';
import {gameMode} from './gameMode.js';

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

// Field.prototype.compFirstMove = function () {
//   renderMove.set(Random.getItem(cells));
// };

export {Field};
