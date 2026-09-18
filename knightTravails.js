// all 8 knight moves, as [dx, dy] offsets
const KNIGHT_MOVES = [
  [2, 1], [2, -1], [-2, 1], [-2, -1],
  [1, 2], [1, -2], [-1, 2], [-1, -2],
];

// true if [x, y] is on the 8x8 board
function isOnBoard([x, y]) {
  return x >= 0 && x <= 7 && y >= 0 && y <= 7;
}

// every square a knight can reach from [x, y] in one move
function getValidMoves([x, y]) {
  const moves = [];

  for (const [dx, dy] of KNIGHT_MOVES) {
    const next = [x + dx, y + dy];
    if (isOnBoard(next)) moves.push(next);
  }

  return moves;
}

// quick test
console.log(getValidMoves([0, 0])); // expected = [[2,1],[1,2]]
console.log(getValidMoves([3, 3])); // expected = 8 squares
console.log(getValidMoves([7, 7])); // expected = [[5,6],[6,5]]