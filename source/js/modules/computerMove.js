import {Random} from './util.js';
import {stepCounter} from './stepCounter.js';
import {gameMode} from './gameMode.js';
import {LINES} from './constants.js';
import {playerMoves} from './playerMoves.js';
import {DANGER_GROUPS} from './constants.js';
import {CELL_GROUP_1} from './constants.js';
import {CELL_GROUP_2} from './constants.js';
import {CELL_GROUP_3} from './constants.js';

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

export {ComputerMove};
