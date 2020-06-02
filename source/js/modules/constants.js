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


export {LINES};
export {DANGER_GROUPS};
export {CELL_GROUP_1};
export {CELL_GROUP_2};
export {CELL_GROUP_3};

