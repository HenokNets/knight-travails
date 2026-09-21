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

function knightMoves(start, end) {
  // both squares must be on the board
  if (!isOnBoard(start) || !isOnBoard(end)) {
    throw new Error("start and end must be on the board (0-7)");
  }

  const startKey = start.join(",");
  const endKey = end.join(",");

  // same square, no moves needed
  if (startKey === endKey) return [start];

  const queue = [start];
  const visited = new Set([startKey]);
  const parent = new Map(); // "x,y" -> the square we came from

  while (queue.length > 0) {
    const current = queue.shift();

    for (const next of getValidMoves(current)) {
      const nextKey = next.join(",");

      // already reached this square, so this path isn't shorter
      if (visited.has(nextKey)) continue;

      visited.add(nextKey);
      parent.set(nextKey, current);

      // found the target, walk parents back to start
      if (nextKey === endKey) {
        const path = [next];
        let key = nextKey;

        while (parent.has(key)) {
          const prev = parent.get(key);
          path.push(prev);
          key = prev.join(",");
        }

        return path.reverse();
      }

      queue.push(next);
    }
  }

  return null; // unreachable on an 8x8 board
}

// print in the format the assignment shows
function printKnightMoves(start, end) {
  const path = knightMoves(start, end);
  const moves = path.length - 1;

  console.log(`> knightMoves([${start}],[${end}])`);
  console.log(`=> You made it in ${moves} move${moves === 1 ? "" : "s"}!  Here's your path:`);

  for (const square of path) {
    console.log(`  [${square}]`);
  }
}

// quick tests
console.log(knightMoves([0, 0], [1, 2])); // [[0,0],[1,2]]
console.log(knightMoves([0, 0], [3, 3])); // 3 squares, 2 moves
console.log(knightMoves([3, 3], [0, 0])); // reverse of above
console.log(knightMoves([0, 0], [7, 7])); // 7 squares, 6 moves
console.log(knightMoves([3, 3], [4, 3])); // 4 squares, 3 moves
console.log(knightMoves([0, 0], [0, 0])); // [[0,0]]

// formatted output
printKnightMoves([3, 3], [4, 3]);
printKnightMoves([0, 0], [0, 0]);