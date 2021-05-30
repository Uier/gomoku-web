import { CELL } from '../constants/type';
import { SIZE, BOUND } from '../constants/board';

export const WEIGHTS = [
  [],
  [10, 1],        // LIVE 1, DEAD 1
  [100, 10],      // LIVE 2, DEAD 2
  [1000, 100],    // LIVE 3, DEAD 3
  [10000, 1000],  // LIVE 4, DEAD 4
  100000,         // 5 in a row!
];

/**
 * scoring the pattern
 * @param {number} cnt the number of chesses in a row
 * @param {*} blocking the number of blocking end
 * @return {number}    the score of the pattern
 */
const scorePattern = (cnt, blocking) => {
  if (cnt >= 5) return WEIGHTS[5];
  if (blocking === 2) return 0;
  return WEIGHTS[cnt][blocking];
}

/**
 * evaluation function
 * @param {string} board  current chessboard
 * @param {number} pos    position that will put chess at
 * @param {number} type   CELL.BLACK | CELL.WHITE
 */
export const evaluate = (board, pos, type) => {
  let score = 0;
  const col = pos % SIZE;
  score += evaluateVertical(board, pos, type);
  score += evaluateHorizontal(board, pos, type, col);
  score += evaluatePosDiag(board, pos, type, col);
  score += evaluateNegDiag(board, pos, type, col);
  return score;
}

const evaluateVertical = (board, pos, type) => {
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
  return scorePattern(cnt, blocking);
}

const evaluateHorizontal = (board, pos, type, col) => {
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
  return scorePattern(cnt, blocking);
}

const evaluatePosDiag = (board, pos, type, col) => {
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
  return scorePattern(cnt, blocking);
}

const evaluateNegDiag = (board, pos, type, col) => {
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
  return scorePattern(cnt, blocking);
}

export const checkWin = (board, pos, type) => {
  const col = pos % SIZE;
  const positions = [pos];
  if (evaluateVertical(board, pos, type) >= WEIGHTS[5]) {
    for (let i=pos-SIZE; i >= 0; i -= SIZE) if (board[i].type === type)  positions.push(i); else break;
    for (let i=pos+SIZE; i < BOUND; i += SIZE) if (board[i].type === type) positions.push(i); else break;
    return [true, positions.slice(0, 5)];
  } else if (evaluateHorizontal(board, pos, type, col) >= WEIGHTS[5]) {
    for (let i=pos-1; i >= 0 && i%SIZE < col; i -= 1) if (board[i].type === type)  positions.push(i); else break;
    for (let i=pos+1; i < BOUND && i%SIZE > col; i += 1) if (board[i].type === type) positions.push(i); else break;
    return [true, positions.slice(0, 5)];
  } else if (evaluatePosDiag(board, pos, type, col) >= WEIGHTS[5]) {
    for (let i=pos-14; i >= 0 && i%SIZE > col; i -= 14) if (board[i].type === type)  positions.push(i); else break;
    for (let i=pos+14; i < BOUND && i%SIZE < col; i += 14) if (board[i].type === type) positions.push(i); else break;
    return [true, positions.slice(0, 5)];
  } else if (evaluateNegDiag(board, pos, type, col) >= WEIGHTS[5]) {
    for (let i=pos-16; i >= 0 && i%SIZE < col; i -= 16) if (board[i].type === type)  positions.push(i); else break;
    for (let i=pos+16; i < BOUND && i%SIZE > col; i += 16) if (board[i].type === type) positions.push(i); else break;
    return [true, positions.slice(0, 5)];
  }
  return [false, []];
}
