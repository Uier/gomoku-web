import { CELL } from '../constants/type';
import { SIZE, BOUND } from '../constants/board';

const ATTACH_WEIGHT = [
  [],
  [10, 1],        // LIVE 1, DEAD 1
  [100, 10],      // LIVE 2, DEAD 2
  [1000, 100],    // LIVE 3, DEAD 3
  [10000, 1000],  // LIVE 4, DEAD 4
  100000,         // 5 in a row!
];
// TODO: 沒算到 O OO、OO OO 這種有間隔的情況
// TODO: 有五的情況下要剪枝
// TODO: 審局其實每經過一步只有少數會需要更新，不用全部重新搜

const DEFENSE_WEIGHT = [
  [],
  [5, 0],
  [50, 5],
  [500, 50],
  [5000, 500],
  50000,
]

/**
 * scoring the pattern
 * @param {number} cnt the number of chesses in a row
 * @param {number} blocking the number of blocking end
 * @return {number}    the score of the pattern
 */
const scorePattern = (cnt, blocking, defense = false) => {
  if (cnt >= 5) return defense ? DEFENSE_WEIGHT[5] : ATTACH_WEIGHT[5];
  if (blocking === 2) return 0;
  return defense ? DEFENSE_WEIGHT[cnt][blocking] : ATTACH_WEIGHT[cnt][blocking];
}

/**
 * evaluation function
 * @param {string} board  current chessboard
 * @param {number} pos    position that will put chess at
 * @param {number} type   CELL.BLACK | CELL.WHITE
 */
export const evaluate = (board, pos, type, defense = false) => {
  let score = 0;
  const col = pos % SIZE;
  score += evaluateVertical(board, pos, type, defense);
  score += evaluateHorizontal(board, pos, type, col, defense);
  score += evaluatePosDiag(board, pos, type, col, defense);
  score += evaluateNegDiag(board, pos, type, col, defense);
  return score;
}

const evaluateVertical = (board, pos, type, defense = false) => {
  let cnt = 1;
  let blocking = 2;
  // top
  for (let i=pos-SIZE; i >= 0; i -= SIZE) {
    if (board[i].type === type)  cnt++;
    else {
      if (board[i].type === CELL.EMPTY)  blocking--;
      break;
    }
  }
  // bottom
  for (let i=pos+SIZE; i < BOUND; i += SIZE) {
    if (board[i].type === type)  cnt++;
    else {
      if (board[i].type === CELL.EMPTY)  blocking--;
      break;
    }
  }
  return scorePattern(cnt, blocking, defense);
}

const evaluateHorizontal = (board, pos, type, col, defense = false) => {
  let cnt = 1;
  let blocking = 2;
  // left
  for (let i=pos-1; i >= 0 && i%SIZE < col; i -= 1) {
    if (board[i].type === type)  cnt++;
    else {
      if (board[i].type === CELL.EMPTY)  blocking--;
      break;
    }
  }
  // right
  for (let i=pos+1; i%SIZE > col; i += 1) {
    if (board[i].type === type)  cnt++;
    else {
      if (board[i].type === CELL.EMPTY)  blocking--;
      break;
    }
  }
  return scorePattern(cnt, blocking, defense);
}

const evaluatePosDiag = (board, pos, type, col, defense = false) => {
  let cnt = 1;
  let blocking = 2;
  // top right
  for (let i=pos-14; i >= 0 && i%SIZE > col; i -= 14) {
    if (board[i].type === type)  cnt++;
    else {
      if (board[i].type === CELL.EMPTY)  blocking--;
      break;
    }
  }
  // bottom left
  for (let i=pos+14; i < BOUND && i%SIZE < col; i += 14) {
    if (board[i].type === type)  cnt++;
    else {
      if (board[i].type === CELL.EMPTY)  blocking--;
      break;
    }
  }
  return scorePattern(cnt, blocking, defense);
}

const evaluateNegDiag = (board, pos, type, col, defense = false) => {
  let cnt = 1;
  let blocking = 2;
  // top left
  for (let i=pos-16; i >= 0 && i%SIZE < col; i -= 16) {
    if (board[i].type === type)  cnt++;
    else {
      if (board[i].type === CELL.EMPTY)  blocking--;
      break;
    }
  }
  // bottom right
  for (let i=pos+16; i < BOUND && i%SIZE > col; i += 16) {
    if (board[i].type === type)  cnt++;
    else {
      if (board[i].type === CELL.EMPTY)  blocking--;
      break;
    }
  }
  return scorePattern(cnt, blocking, defense);
}

export const checkWin = (board, pos, type) => {
  const col = pos % SIZE;
  const positions = [pos];
  if (evaluateVertical(board, pos, type) >= ATTACH_WEIGHT[5]) {
    for (let i=pos-SIZE; i >= 0; i -= SIZE) if (board[i].type === type)  positions.push(i); else break;
    for (let i=pos+SIZE; i < BOUND; i += SIZE) if (board[i].type === type) positions.push(i); else break;
    return [true, positions.slice(0, 5)];
  } else if (evaluateHorizontal(board, pos, type, col) >= ATTACH_WEIGHT[5]) {
    for (let i=pos-1; i >= 0 && i%SIZE < col; i -= 1) if (board[i].type === type)  positions.push(i); else break;
    for (let i=pos+1; i < BOUND && i%SIZE > col; i += 1) if (board[i].type === type) positions.push(i); else break;
    return [true, positions.slice(0, 5)];
  } else if (evaluatePosDiag(board, pos, type, col) >= ATTACH_WEIGHT[5]) {
    for (let i=pos-14; i >= 0 && i%SIZE > col; i -= 14) if (board[i].type === type)  positions.push(i); else break;
    for (let i=pos+14; i < BOUND && i%SIZE < col; i += 14) if (board[i].type === type) positions.push(i); else break;
    return [true, positions.slice(0, 5)];
  } else if (evaluateNegDiag(board, pos, type, col) >= ATTACH_WEIGHT[5]) {
    for (let i=pos-16; i >= 0 && i%SIZE < col; i -= 16) if (board[i].type === type)  positions.push(i); else break;
    for (let i=pos+16; i < BOUND && i%SIZE > col; i += 16) if (board[i].type === type) positions.push(i); else break;
    return [true, positions.slice(0, 5)];
  }
  return [false, []];
}
