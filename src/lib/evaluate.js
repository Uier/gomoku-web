import { CELL, opponent } from '../constants/type';
import { SIZE, BOUND, COL } from '../constants/board';

export const evaluatePosition = (board, pos, type) => {
  // attack value + defense value
  return subEvaluate(board, pos, type) + subEvaluate(board, pos, opponent(type), true);
}

const ATTACH_WEIGHT = [
  [],
  [10, 1],        // LIVE 1, DEAD 1
  [100, 10],      // LIVE 2, DEAD 2
  [1000, 100],    // LIVE 3, DEAD 3
  [10000, 1000],  // LIVE 4, DEAD 4
  100000,         // 5 in a row!
];
// TODO: 沒算到 O OO、OO OO 這種有間隔的情況
// TODO: 有五的情況下可以剪枝
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
 * @param {boolean} defense 是否以防守權重來計算，否則以攻擊權重來計算
 */
export const subEvaluate = (board, pos, type, defense = false) => {
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

/**
 * 判斷是否勝利
 * @param {array} board 當前盤面
 * @param {number} pos 要下的位置
 * @param {CELL TYPE} type 要下的棋子是誰的
 * @returns
 */
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

export const evaluateBoard = (board, aiType) => {
  const userType = opponent(aiType);

  function hasFive(type) {
    let count = 0;

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const k = i*SIZE + j;
        if (
          (k + 4) < BOUND &&
          COL[k] < COL[k + 4] && 
          board[k].type === type &&
          board[k + 1].type === type &&
          board[k + 2].type === type &&
          board[k + 3].type === type &&
          board[k + 4].type === type
        ) count++;
        else if (
          (k + 4*SIZE) < BOUND &&
          board[k].type === type &&
          board[k + 1*SIZE].type === type &&
          board[k + 2*SIZE].type === type &&
          board[k + 3*SIZE].type === type &&
          board[k + 4*SIZE].type === type
        ) count++;
        else if (
          (k + 4*SIZE + 4) < BOUND &&
          COL[k] < COL[k + 4*SIZE + 4] && 
          board[k].type === type &&
          board[k + 1*SIZE + 1].type === type &&
          board[k + 2*SIZE + 2].type === type &&
          board[k + 3*SIZE + 3].type === type &&
          board[k + 4*SIZE + 4].type === type
        ) count++;
        else if (
          0 <= (k - 4*SIZE + 4) &&
          COL[k] < COL[k - 4*SIZE + 4] && 
          board[k].type === type &&
          board[k - 1*SIZE + 1].type === type &&
          board[k - 2*SIZE + 2].type === type &&
          board[k - 3*SIZE + 3].type === type &&
          board[k - 4*SIZE + 4].type === type
        ) count++;
      }
    }
    return count;
  }

  function hasOpenFour(type) {
    let count = 0;

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const k = i*SIZE + j;
        if (
          (k + 5) < BOUND &&
          COL[k] < COL[k + 5] && 
          board[k].type === CELL.EMPTY &&
          board[k + 1].type === type &&
          board[k + 2].type === type &&
          board[k + 3].type === type &&
          board[k + 4].type === type &&
          board[k + 5].type === CELL.EMPTY
        ) count++;
        else if (
          (k + 5*SIZE) < BOUND &&
          board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE].type === type &&
          board[k + 2*SIZE].type === type &&
          board[k + 3*SIZE].type === type &&
          board[k + 4*SIZE].type === type &&
          board[k + 5*SIZE].type === CELL.EMPTY
        ) count++;
        else if (
          (k + 5*SIZE + 5) < BOUND &&
          COL[k] < COL[k + 5*SIZE + 5] && 
          board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE + 1].type === type &&
          board[k + 2*SIZE + 2].type === type &&
          board[k + 3*SIZE + 3].type === type &&
          board[k + 4*SIZE + 4].type === type &&
          board[k + 5*SIZE + 5].type === CELL.EMPTY
        ) count++;
        else if (
          0 <= (k - 5*SIZE + 5) &&
          COL[k] < COL[k - 5*SIZE + 5] && 
          board[k].type === CELL.EMPTY &&
          board[k - 1*SIZE + 1].type === type &&
          board[k - 2*SIZE + 2].type === type &&
          board[k - 3*SIZE + 3].type === type &&
          board[k - 4*SIZE + 4].type === type &&
          board[k - 5*SIZE + 5].type === CELL.EMPTY
        ) count++;
        else if (
          (k + 6) < BOUND &&
          COL[k] < COL[k + 6] && 
          board[k].type === CELL.EMPTY &&
          board[k + 1].type === type &&
          board[k + 2].type === type &&
          board[k + 3].type === CELL.EMPTY &&
          board[k + 4].type === type &&
          board[k + 5].type === type &&
          board[k + 6].type === CELL.EMPTY
        ) count++;
        else if (
          (k + 6*SIZE) < BOUND &&
          board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE].type === type &&
          board[k + 2*SIZE].type === type &&
          board[k + 3*SIZE].type === CELL.EMPTY &&
          board[k + 4*SIZE].type === type &&
          board[k + 5*SIZE].type === type &&
          board[k + 6*SIZE].type === CELL.EMPTY
        ) count++;
        else if (
          (k + 6*SIZE + 6) < BOUND &&
          COL[k] < COL[k + 6*SIZE + 6] && 
          board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE + 1].type === type &&
          board[k + 2*SIZE + 2].type === type &&
          board[k + 3*SIZE + 3].type === CELL.EMPTY &&
          board[k + 4*SIZE + 4].type === type &&
          board[k + 5*SIZE + 5].type === type &&
          board[k + 6*SIZE + 6].type === CELL.EMPTY
        ) count++;
        else if (
          0 <= (k - 6*SIZE + 6) &&
          COL[k] < COL[k - 6*SIZE + 6] && 
          board[k].type === CELL.EMPTY &&
          board[k - 1*SIZE + 1].type === type &&
          board[k - 2*SIZE + 2].type === type &&
          board[k - 3*SIZE + 3].type === CELL.EMPTY &&
          board[k - 4*SIZE + 4].type === type &&
          board[k - 5*SIZE + 5].type === type &&
          board[k - 6*SIZE + 6].type === CELL.EMPTY
        ) count++;
      }
    }
    return count;
  }

  function hasFour(type) {
    let count = 0;

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const k = i*SIZE + j;
        if (
          (k + 4) < BOUND &&
          COL[k] < COL[k + 4] && 
          (board[k].type === CELL.EMPTY &&
          board[k + 1].type === type &&
          board[k + 2].type === type &&
          board[k + 3].type === type &&
          board[k + 4].type === type ||

          board[k].type === type &&
          board[k + 1].type === type &&
          board[k + 2].type === type &&
          board[k + 3].type === type &&
          board[k + 4].type === CELL.EMPTY)
        ) count++;
        if (
          (k + 4*SIZE) < BOUND &&
          (board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE].type === type &&
          board[k + 2*SIZE].type === type &&
          board[k + 3*SIZE].type === type &&
          board[k + 4*SIZE].type === type ||

          board[k].type === type &&
          board[k + 1*SIZE].type === type &&
          board[k + 2*SIZE].type === type &&
          board[k + 3*SIZE].type === type &&
          board[k + 4*SIZE].type === CELL.EMPTY)
        ) count++;
        if (
          (k + 4*SIZE + 4) < BOUND &&
          COL[k] < COL[k + 4*SIZE + 4] && 
          (board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE + 1].type === type &&
          board[k + 2*SIZE + 2].type === type &&
          board[k + 3*SIZE + 3].type === type &&
          board[k + 4*SIZE + 4].type === type ||

          board[k].type === type &&
          board[k + 1*SIZE + 1].type === type &&
          board[k + 2*SIZE + 2].type === type &&
          board[k + 3*SIZE + 3].type === type &&
          board[k + 4*SIZE + 4].type === CELL.EMPTY)
        ) count++;
        if (
          0 <= (k - 4*SIZE + 4) &&
          COL[k] < COL[k - 4*SIZE + 4] && 
          (board[k].type === CELL.EMPTY &&
          board[k - 1*SIZE + 1].type === type &&
          board[k - 2*SIZE + 2].type === type &&
          board[k - 3*SIZE + 3].type === type &&
          board[k - 4*SIZE + 4].type === type ||

          board[k].type === type &&
          board[k - 1*SIZE + 1].type === type &&
          board[k - 2*SIZE + 2].type === type &&
          board[k - 3*SIZE + 3].type === type &&
          board[k - 4*SIZE + 4].type === CELL.EMPTY)
        ) count++;
      }
    }
    return count;
  }

  function hasOpenThree(type) {
    let count = 0;

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const k = i*SIZE + j;
        if (
          (k + 5) < BOUND &&
          COL[k] < COL[k + 5] && 
          (board[k].type === CELL.EMPTY &&
          board[k + 1].type === CELL.EMPTY &&
          board[k + 2].type === type &&
          board[k + 3].type === type &&
          board[k + 4].type === type &&
          board[k + 5].type === CELL.EMPTY ||

          board[k].type === CELL.EMPTY &&
          board[k + 1].type === type &&
          board[k + 2].type === type &&
          board[k + 3].type === type &&
          board[k + 4].type === CELL.EMPTY &&
          board[k + 5].type === CELL.EMPTY ||

          board[k].type === CELL.EMPTY &&
          board[k + 1].type === type &&
          board[k + 2].type === CELL.EMPTY &&
          board[k + 3].type === type &&
          board[k + 4].type === type &&
          board[k + 5].type === CELL.EMPTY ||

          board[k].type === CELL.EMPTY &&
          board[k + 1].type === type &&
          board[k + 2].type === type &&
          board[k + 3].type === CELL.EMPTY &&
          board[k + 4].type === type &&
          board[k + 5].type === CELL.EMPTY)
        ) count++;
        if (
          (k + 5*SIZE) < BOUND &&
          (board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE].type === CELL.EMPTY &&
          board[k + 2*SIZE].type === type &&
          board[k + 3*SIZE].type === type &&
          board[k + 4*SIZE].type === type &&
          board[k + 5*SIZE].type === CELL.EMPTY ||

          board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE].type === type &&
          board[k + 2*SIZE].type === type &&
          board[k + 3*SIZE].type === type &&
          board[k + 4*SIZE].type === CELL.EMPTY &&
          board[k + 5*SIZE].type === CELL.EMPTY ||

          board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE].type === type &&
          board[k + 2*SIZE].type === type &&
          board[k + 3*SIZE].type === CELL.EMPTY &&
          board[k + 4*SIZE].type === type &&
          board[k + 5*SIZE].type === CELL.EMPTY ||

          board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE].type === type &&
          board[k + 2*SIZE].type === CELL.EMPTY &&
          board[k + 3*SIZE].type === type &&
          board[k + 4*SIZE].type === type &&
          board[k + 5*SIZE].type === CELL.EMPTY)
        ) count++;
        if (
          (k + 5*SIZE + 5) < BOUND &&
          COL[k] < COL[k + 5*SIZE + 5] && 
          (board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE + 1].type === CELL.EMPTY &&
          board[k + 2*SIZE + 2].type === type &&
          board[k + 3*SIZE + 3].type === type &&
          board[k + 4*SIZE + 4].type === type &&
          board[k + 5*SIZE + 5].type === CELL.EMPTY ||

          board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE + 1].type === type &&
          board[k + 2*SIZE + 2].type === type &&
          board[k + 3*SIZE + 3].type === type &&
          board[k + 4*SIZE + 4].type === CELL.EMPTY &&
          board[k + 5*SIZE + 5].type === CELL.EMPTY ||

          board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE + 1].type === type &&
          board[k + 2*SIZE + 2].type === type &&
          board[k + 3*SIZE + 3].type === CELL.EMPTY &&
          board[k + 4*SIZE + 4].type === type &&
          board[k + 5*SIZE + 5].type === CELL.EMPTY ||

          board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE + 1].type === type &&
          board[k + 2*SIZE + 2].type === CELL.EMPTY &&
          board[k + 3*SIZE + 3].type === type &&
          board[k + 4*SIZE + 4].type === type &&
          board[k + 5*SIZE + 5].type === CELL.EMPTY)
        ) count++;
        if (
          0 <= (k - 5*SIZE + 5) &&
          COL[k] < COL[k - 5*SIZE + 5] && 
          (board[k].type === CELL.EMPTY &&
          board[k - 1*SIZE + 1].type === CELL.EMPTY &&
          board[k - 2*SIZE + 2].type === type &&
          board[k - 3*SIZE + 3].type === type &&
          board[k - 4*SIZE + 4].type === type &&
          board[k - 5*SIZE + 5].type === CELL.EMPTY ||

          board[k].type === CELL.EMPTY &&
          board[k - 1*SIZE + 1].type === type &&
          board[k - 2*SIZE + 2].type === type &&
          board[k - 3*SIZE + 3].type === type &&
          board[k - 4*SIZE + 4].type === CELL.EMPTY &&
          board[k - 5*SIZE + 5].type === CELL.EMPTY ||

          board[k].type === CELL.EMPTY &&
          board[k - 1*SIZE + 1].type === type &&
          board[k - 2*SIZE + 2].type === type &&
          board[k - 3*SIZE + 3].type === CELL.EMPTY &&
          board[k - 4*SIZE + 4].type === type &&
          board[k - 5*SIZE + 5].type === CELL.EMPTY ||

          board[k].type === CELL.EMPTY &&
          board[k - 1*SIZE + 1].type === type &&
          board[k - 2*SIZE + 2].type === CELL.EMPTY &&
          board[k - 3*SIZE + 3].type === type &&
          board[k - 4*SIZE + 4].type === type &&
          board[k - 5*SIZE + 5].type === CELL.EMPTY)
        ) count++;
      }
    }
    return count;
  }

  function hasThree(type) {
    let count = 0;

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const k = i*SIZE + j;
        if (
          (k + 4) < BOUND &&
          COL[k] < COL[k + 4] && 
          (board[k].type === CELL.EMPTY &&
          board[k + 1].type === CELL.EMPTY &&
          board[k + 2].type === type &&
          board[k + 3].type === type &&
          board[k + 4].type === type ||

          board[k].type === type &&
          board[k + 1].type === type  &&
          board[k + 2].type === type &&
          board[k + 3].type === CELL.EMPTY &&
          board[k + 4].type === CELL.EMPTY ||

          board[k].type === type &&
          board[k + 1].type === type  &&
          board[k + 2].type === CELL.EMPTY &&
          board[k + 3].type === type &&
          board[k + 4].type === CELL.EMPTY ||

          board[k].type === type &&
          board[k + 1].type === CELL.EMPTY &&
          board[k + 2].type === type  &&
          board[k + 3].type === type &&
          board[k + 4].type === CELL.EMPTY)
        ) count++;
        if (
          (k + 4*SIZE) < BOUND &&
          (board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE].type === CELL.EMPTY &&
          board[k + 2*SIZE].type === type &&
          board[k + 3*SIZE].type === type &&
          board[k + 4*SIZE].type === type ||

          board[k].type === type &&
          board[k + 1*SIZE].type === type  &&
          board[k + 2*SIZE].type === type &&
          board[k + 3*SIZE].type === CELL.EMPTY &&
          board[k + 4*SIZE].type === CELL.EMPTY ||

          board[k].type === type &&
          board[k + 1*SIZE].type === type  &&
          board[k + 2*SIZE].type === CELL.EMPTY &&
          board[k + 3*SIZE].type === type &&
          board[k + 4*SIZE].type === CELL.EMPTY ||

          board[k].type === type &&
          board[k + 1*SIZE].type === CELL.EMPTY &&
          board[k + 2*SIZE].type === type  &&
          board[k + 3*SIZE].type === type &&
          board[k + 4*SIZE].type === CELL.EMPTY)
        ) count++;
        if (
          (k + 4*SIZE + 4) < BOUND &&
          COL[k] < COL[k + 4*SIZE + 4] && 
          (board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE + 1].type === CELL.EMPTY &&
          board[k + 2*SIZE + 2].type === type &&
          board[k + 3*SIZE + 3].type === type &&
          board[k + 4*SIZE + 4].type === type ||

          board[k].type === type &&
          board[k + 1*SIZE + 1].type === type &&
          board[k + 2*SIZE + 2].type === type &&
          board[k + 3*SIZE + 3].type === CELL.EMPTY &&
          board[k + 4*SIZE + 4].type === CELL.EMPTY ||

          board[k].type === type &&
          board[k + 1*SIZE + 1].type === type &&
          board[k + 2*SIZE + 2].type === CELL.EMPTY &&
          board[k + 3*SIZE + 3].type === type &&
          board[k + 4*SIZE + 4].type === CELL.EMPTY ||

          board[k].type === type &&
          board[k + 1*SIZE + 1].type === CELL.EMPTY &&
          board[k + 2*SIZE + 2].type === type &&
          board[k + 3*SIZE + 3].type === type &&
          board[k + 4*SIZE + 4].type === CELL.EMPTY)
        ) count++;
        if (
          0 <= (k - 4*SIZE + 4) &&
          COL[k] < COL[k - 4*SIZE + 4] && 
          (board[k].type === CELL.EMPTY &&
          board[k - 1*SIZE + 1].type === CELL.EMPTY &&
          board[k - 2*SIZE + 2].type === type &&
          board[k - 3*SIZE + 3].type === type &&
          board[k - 4*SIZE + 4].type === type ||

          board[k].type === type &&
          board[k - 1*SIZE + 1].type === type &&
          board[k - 2*SIZE + 2].type === type &&
          board[k - 3*SIZE + 3].type === CELL.EMPTY &&
          board[k - 4*SIZE + 4].type === CELL.EMPTY ||

          board[k].type === type &&
          board[k - 1*SIZE + 1].type === type &&
          board[k - 2*SIZE + 2].type === CELL.EMPTY &&
          board[k - 3*SIZE + 3].type === type &&
          board[k - 4*SIZE + 4].type === CELL.EMPTY ||

          board[k].type === type &&
          board[k - 1*SIZE + 1].type === CELL.EMPTY &&
          board[k - 2*SIZE + 2].type === type &&
          board[k - 3*SIZE + 3].type === type &&
          board[k - 4*SIZE + 4].type === CELL.EMPTY)
        ) count++;
      }
    }
    return count;
  }

  function hasOpenTwo(type) {
    let count = 0;

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const k = i*SIZE + j;
        if (
          (k + 7) < BOUND &&
          COL[k] < COL[k + 7] && 
          board[k].type === CELL.EMPTY &&
          board[k + 1].type === CELL.EMPTY &&
          board[k + 2].type === CELL.EMPTY &&
          board[k + 3].type === type &&
          board[k + 4].type === type &&
          board[k + 5].type === CELL.EMPTY &&
          board[k + 6].type === CELL.EMPTY &&
          board[k + 7].type === CELL.EMPTY
        ) count++;
        if (
          (k + 7*SIZE) < BOUND &&
          board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE].type === CELL.EMPTY &&
          board[k + 2*SIZE].type === CELL.EMPTY &&
          board[k + 3*SIZE].type === type &&
          board[k + 4*SIZE].type === type &&
          board[k + 5*SIZE].type === CELL.EMPTY &&
          board[k + 6*SIZE].type === CELL.EMPTY &&
          board[k + 7*SIZE].type === CELL.EMPTY
        ) count++;
        if (
          (k + 7*SIZE + 7) < BOUND &&
          COL[k] < COL[k + 7*SIZE + 7] && 
          board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE + 1].type === CELL.EMPTY &&
          board[k + 2*SIZE + 2].type === CELL.EMPTY &&
          board[k + 3*SIZE + 3].type === type &&
          board[k + 4*SIZE + 4].type === type &&
          board[k + 5*SIZE + 5].type === CELL.EMPTY &&
          board[k + 6*SIZE + 6].type === CELL.EMPTY &&
          board[k + 7*SIZE + 7].type === CELL.EMPTY
        ) count++;
        if (
          0 <= (k - 7*SIZE + 7) &&
          COL[k] < COL[k - 7*SIZE + 7] && 
          board[k].type === CELL.EMPTY &&
          board[k - 1*SIZE + 1].type === CELL.EMPTY &&
          board[k - 2*SIZE + 2].type === CELL.EMPTY &&
          board[k - 3*SIZE + 3].type === type &&
          board[k - 4*SIZE + 4].type === type &&
          board[k - 5*SIZE + 5].type === CELL.EMPTY &&
          board[k - 6*SIZE + 6].type === CELL.EMPTY &&
          board[k - 7*SIZE + 7].type === CELL.EMPTY
        ) count++;
      }
    }
    return count;
  }

  function hasTwo(type) {
    let count = 0;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const k = i*SIZE + j;
        if (
          (k + 4) < BOUND &&
          COL[k] < COL[k + 4] && 
          (board[k].type === CELL.EMPTY &&
          board[k + 1].type === CELL.EMPTY &&
          board[k + 2].type === CELL.EMPTY &&
          board[k + 3].type === type &&
          board[k + 4].type === type ||

          board[k].type === type &&
          board[k + 1].type === type  &&
          board[k + 2].type === CELL.EMPTY &&
          board[k + 3].type === CELL.EMPTY &&
          board[k + 4].type === CELL.EMPTY)
        ) count++;
        if (
          (k + 4*SIZE) < BOUND &&
          (board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE].type === CELL.EMPTY &&
          board[k + 2*SIZE].type === CELL.EMPTY &&
          board[k + 3*SIZE].type === type &&
          board[k + 4*SIZE].type === type ||

          board[k].type === type &&
          board[k + 1*SIZE].type === type  &&
          board[k + 2*SIZE].type === CELL.EMPTY &&
          board[k + 3*SIZE].type === CELL.EMPTY &&
          board[k + 4*SIZE].type === CELL.EMPTY)
        ) count++;
        if (
          (k + 4*SIZE + 4) < BOUND &&
          COL[k] < COL[k + 4*SIZE + 4] && 
          (board[k].type === CELL.EMPTY &&
          board[k + 1*SIZE + 1].type === CELL.EMPTY &&
          board[k + 2*SIZE + 2].type === CELL.EMPTY &&
          board[k + 3*SIZE + 3].type === type &&
          board[k + 4*SIZE + 4].type === type ||

          board[k].type === type &&
          board[k + 1*SIZE + 1].type === type &&
          board[k + 2*SIZE + 2].type === CELL.EMPTY &&
          board[k + 3*SIZE + 3].type === CELL.EMPTY &&
          board[k + 4*SIZE + 4].type === CELL.EMPTY)
        ) count++;
        if (
          0 <= (k - 4*SIZE + 4) &&
          COL[k] < COL[k - 4*SIZE + 4] && 
          (board[k].type === CELL.EMPTY &&
          board[k - 1*SIZE + 1].type === CELL.EMPTY &&
          board[k - 2*SIZE + 2].type === CELL.EMPTY &&
          board[k - 3*SIZE + 3].type === type &&
          board[k - 4*SIZE + 4].type === type ||

          board[k].type === type &&
          board[k - 1*SIZE + 1].type === type &&
          board[k - 2*SIZE + 2].type === CELL.EMPTY &&
          board[k - 3*SIZE + 3].type === CELL.EMPTY &&
          board[k - 4*SIZE + 4].type === CELL.EMPTY)
        ) count++;
      }
    }
    return count;
  }

  const openFours = hasOpenFour(aiType);
  const closedFours = hasFour(aiType) - openFours;
  const openThrees = hasOpenThree(aiType);
  const closedThrees = hasThree(aiType) - openThrees;
  const openTwos = hasOpenTwo(aiType);
  const closedTwos = hasTwo(aiType) - openTwos;
  const hasFives = hasFive(aiType);

  // console.log('openFours:', openFours);
  // console.log('closedFours:', closedFours);
  // console.log('openThrees:', openThrees);
  // console.log('closedThrees:', closedThrees);
  // console.log('openTwos:', openTwos);
  // console.log('closedTwos:', closedTwos);
  // console.log('hasFives:', hasFives);
  
  const oppOpenFours = hasOpenFour(userType);
  const oppClosedFours = hasFour(userType) - oppOpenFours;
  const oppOpenThrees = hasOpenThree(userType);
  const oppClosedThrees = hasThree(userType) - oppOpenThrees;
  const oppOpenTwos = hasOpenTwo(userType);
  const oppClosedTwos = hasTwo(userType) - oppOpenTwos;
  const oppHasFives = hasFive(userType);


  return (
    ((2 * openTwos) + (1 * closedTwos) +
    (2000 * openThrees) + (2 * closedThrees) +
    (20000 * openFours) + (2000 * closedFours) +
    (20000 * hasFives)) -

    ((2 * oppOpenTwos) + (1 * oppClosedTwos) +
    (2000 * oppOpenThrees) + (2 * oppClosedThrees) +
    (20000 * oppOpenFours) + (2000 * oppClosedFours) +
    (20000 * oppHasFives))
  );
}

export const checkTerminated = (board) => {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const k = i*SIZE + j;
      if (
        (k + 4) < BOUND &&
        COL[k] < COL[k + 4] && 
        (board[k] === CELL.BLACK &&
        board[k + 1] === CELL.BLACK &&
        board[k + 2] === CELL.BLACK &&
        board[k + 3] === CELL.BLACK &&
        board[k + 4] === CELL.BLACK ||

        board[k] === CELL.WHITE &&
        board[k + 1] === CELL.WHITE &&
        board[k + 2] === CELL.WHITE &&
        board[k + 3] === CELL.WHITE &&
        board[k + 4] === CELL.WHITE)
      ) return true;
      if (
        (k + 4*SIZE) < BOUND &&
        (board[k] === CELL.BLACK &&
        board[k + 1*SIZE] === CELL.BLACK &&
        board[k + 2*SIZE] === CELL.BLACK &&
        board[k + 3*SIZE] === CELL.BLACK &&
        board[k + 4*SIZE] === CELL.BLACK ||

        board[k] === CELL.WHITE &&
        board[k + 1*SIZE] === CELL.WHITE &&
        board[k + 2*SIZE] === CELL.WHITE &&
        board[k + 3*SIZE] === CELL.WHITE &&
        board[k + 4*SIZE] === CELL.WHITE)
      ) return true;
      if (
        (k + 4*SIZE + 4) < BOUND &&
        COL[k] < COL[k + 4*SIZE + 4] && 
        (board[k] === CELL.BLACK &&
        board[k + 1*SIZE + 1] === CELL.BLACK &&
        board[k + 2*SIZE + 2] === CELL.BLACK &&
        board[k + 3*SIZE + 3] === CELL.BLACK &&
        board[k + 4*SIZE + 4] === CELL.BLACK ||

        board[k] === CELL.WHITE &&
        board[k + 1*SIZE + 1] === CELL.WHITE &&
        board[k + 2*SIZE + 2] === CELL.WHITE &&
        board[k + 3*SIZE + 3] === CELL.WHITE &&
        board[k + 4*SIZE + 4] === CELL.WHITE)
      ) return true;
      if (
        0 <= (k - 4*SIZE + 4) &&
        COL[k] < COL[k - 4*SIZE + 4] && 
        (board[k] === CELL.BLACK &&
        board[k - 1*SIZE + 1] === CELL.BLACK &&
        board[k - 2*SIZE + 2] === CELL.BLACK &&
        board[k - 3*SIZE + 3] === CELL.BLACK &&
        board[k - 4*SIZE + 4] === CELL.BLACK ||

        board[k] === CELL.WHITE &&
        board[k - 1*SIZE + 1] === CELL.WHITE &&
        board[k - 2*SIZE + 2] === CELL.WHITE &&
        board[k - 3*SIZE + 3] === CELL.WHITE &&
        board[k - 4*SIZE + 4] === CELL.WHITE)
      ) return true;
    }
  }
}
