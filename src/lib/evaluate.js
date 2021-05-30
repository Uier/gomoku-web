import { CELL } from '../constants/type';

export const weights = [
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
  if (cnt >= 5) return weights[5];
  if (blocking === 2) return 0;
  return weights[cnt][blocking];
}

/**
 * evaluation function
 * @param {string} board  current chessboard
 * @param {number} pos    position that will put chess at
 * @param {number} type   CELL.BLACK | CELL.WHITE
 */
export const evaluate = (board, pos, type) => {
  let score = 0;
  const col = pos % 15;
  const cnt = {
    VERTICAL: 1,
    HORIZONTAL: 1,
    POS_DIAG: 1,
    NEG_DIAG: 1,
  }
  const endding = {
    VERTICAL: 2,
    HORIZONTAL: 2,
    POS_DIAG: 2,
    NEG_DIAG: 2,
  }
  // top
  for (let i=pos-15, j=1; i >= 0 && j <= 4; i -= 15, ++j) {
    if (board[i].type === type)  cnt.VERTICAL++;
    else {
      if (board[i].type === CELL.EMPTY)  endding.VERTICAL--;
      break;
    }
  }
  // bottom
  for (let i=pos+15, j=1; i < board.length && j <= 4; i += 15, ++j) {
    if (board[i].type === type)  cnt.VERTICAL++;
    else {
      if (board[i].type === CELL.EMPTY)  endding.VERTICAL--;
      break;
    }
  }
  score += scorePattern(cnt.VERTICAL, endding.VERTICAL);
  // left
  for (let i=pos-1, j=1; i >= 0 && i%15 < col && j <= 4; i -= 1, ++j) {
    if (board[i].type === type)  cnt.HORIZONTAL++;
    else {
      if (board[i].type === CELL.EMPTY)  endding.HORIZONTAL--;
      break;
    }
  }
  // right
  for (let i=pos+1, j=1; i%15 > col && j <= 4; i += 1, ++j) {
    if (board[i].type === type)  cnt.HORIZONTAL++;
    else {
      if (board[i].type === CELL.EMPTY)  endding.HORIZONTAL--;
      break;
    }
  }
  score += scorePattern(cnt.HORIZONTAL, endding.HORIZONTAL);
  // top right
  for (let i=pos-14, j=1; i >= 0 && i%15 > col && j <= 4; i -= 14, ++j) {
    if (board[i].type === type)  cnt.POS_DIAG++;
    else {
      if (board[i].type === CELL.EMPTY)  endding.POS_DIAG--;
      break;
    }
  }
  // bottom left
  for (let i=pos+14, j=1; i < board.length && i%15 < col && j <= 4; i += 14, ++j) {
    if (board[i].type === type)  cnt.POS_DIAG++;
    else {
      if (board[i].type === CELL.EMPTY)  endding.POS_DIAG--;
      break;
    }
  }
  score += scorePattern(cnt.POS_DIAG, endding.POS_DIAG);
  // top left
  for (let i=pos-16, j=1; i >= 0 && i%15 < col && j <= 4; i -= 16, ++j) {
    if (board[i].type === type)  cnt.NEG_DIAG++;
    else {
      if (board[i].type === CELL.EMPTY)  endding.NEG_DIAG--;
      break;
    }
  }
  // bottom right
  for (let i=pos+16, j=1; i < board.length && i%15 > col && j <= 4; i += 16, ++j) {
    if (board[i].type === type)  cnt.NEG_DIAG++;
    else {
      if (board[i].type === CELL.EMPTY)  endding.NEG_DIAG--;
      break;
    }
  }
  score += scorePattern(cnt.NEG_DIAG, endding.NEG_DIAG);
  return score;
}