import {gameMode} from './gameMode.js';
import {stepCounter} from './stepCounter.js';
import {RenderMove} from './renderMove.js';
import {playerMoves} from './playerMoves.js';

const cells = document.querySelectorAll('.field__cell');
const renderMove = new RenderMove();

var clearField = function () {
  cells.forEach(function (cell) {
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
    renderMove.reset();
  },
  game: () => {
    clearField();
    stepCounter.reset();
    playerMoves.reset();
    gameMode.reset();
    renderMove.reset();
  }
};

export {Reset};
