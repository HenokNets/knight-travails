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

// walk parents from target back to start, then reverse
function reconstructPath(parent, endKey, endSquare) {
  const path = [endSquare];
  let key = endKey;

  while (parent.has(key)) {
    const prev = parent.get(key);
    path.push(prev);
    key = prev.join(",");
  }

  return path.reverse();
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
        return reconstructPath(parent, endKey, next);
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

// demo 

// assignment examples (they are formatted)

printKnightMoves([0, 0], [1, 2]); // 1 move
printKnightMoves([0, 0], [3, 3]); // 2 moves
printKnightMoves([3, 3], [0, 0]); // 2 moves, reversed
printKnightMoves([3, 3], [4, 3]); // 3 moves
printKnightMoves([0, 0], [7, 7]); // 6 moves

// same square
printKnightMoves([4, 4], [4, 4]); // 0 moves

// raw array for eyeballing during dev
console.log("raw:", knightMoves([0, 0], [7, 7]));

// tests

function sameSquare(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function assert(cond, msg) {
  if (!cond) throw new Error("FAIL: " + msg);
}

// starts at start, ends at end, every step is a legal knight move,
// every square is on the board, total moves <= 6
function testPath(start, end) {
  const path = knightMoves(start, end);

  assert(sameSquare(path[0], start), `path starts at [${start}]`);
  assert(sameSquare(path[path.length - 1], end), `path ends at [${end}]`);

  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    const dx = Math.abs(a[0] - b[0]);
    const dy = Math.abs(a[1] - b[1]);

    const legal = (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
    assert(legal, `step [${a}] -> [${b}] is a legal knight move`);
    assert(isOnBoard(b), `step [${b}] is on the board`);
  }

  // max distance on an 8x8 is 6 moves
  assert(path.length - 1 <= 6, `[${start}] -> [${end}] is at most 6 moves`);

  return path.length - 1;
}

// assignment examples with known distances
assert(testPath([0, 0], [1, 2]) === 1, "[0,0] -> [1,2] is 1 move");
assert(testPath([0, 0], [3, 3]) === 2, "[0,0] -> [3,3] is 2 moves");
assert(testPath([3, 3], [0, 0]) === 2, "[3,3] -> [0,0] is 2 moves");
assert(testPath([3, 3], [4, 3]) === 3, "[3,3] -> [4,3] is 3 moves");
assert(testPath([0, 0], [7, 7]) === 6, "[0,0] -> [7,7] is 6 moves");
assert(testPath([0, 0], [0, 0]) === 0, "same square is 0 moves");

// fuzz,  random pairs, same checks
for (let i = 0; i < 200; i++) {
  const start = [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
  const end = [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
  testPath(start, end);
}

console.log("all tests passed");