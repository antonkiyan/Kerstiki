const playerMoves = {
  moves: [],
  add: function (cellNum) {
    this.moves.push(cellNum);
  },
  reset: function () {
    this.moves = [];
  }
};

export {playerMoves};
