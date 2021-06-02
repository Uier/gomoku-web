import { CELL, opponent } from '../constants/type';
import { SIZE, BOUND, ROW, COL } from '../constants/board';
import { evaluateBoard, checkTerminated, evaluatePosition } from '../lib/evaluate';

let hash = {};

/**
 * minimax searching & alpha-beta pruning
 * @param {array} board 當前盤面 (pass by sharing)
 * @param {number} pos 要下的位置（陣列的 index）
 * @param {number} curStep 要下的步數
 * @param {number} depth 
 * @param {number} alpha 
 * @param {number} beta 
 * @param {CELL TYPE} type 
 * @param {boolean} maximizing 
 * @returns number
 */
export function minimax(board, depth, alpha, beta, aiType, maximizing) {
  const hb = hashing(board);
  if (hash[hb]) return hash[hb];

  if (depth === 0 || checkTerminated(board)) {
    hash[hb] = evaluateBoard(board.slice(), aiType);
    return hash[hb];
  }
  const type = maximizing ? aiType : opponent(aiType);
  const searchArea = getSearchArea(board, type);
  if (maximizing) {
    let mxScore = -Infinity;
    for (const i of searchArea) {
      if (board[i].type !== CELL.EMPTY) continue;
      board[i] = {type: type, step: -Infinity};
      const score = minimax(board, depth-1, alpha, beta, aiType, false);
      board[i] = {type: CELL.EMPTY, step: 0};
      mxScore = Math.max(mxScore, score);
      alpha = Math.max(alpha, score);
      if (alpha >= beta)  break;
    }
    return mxScore;
  } else {
    let mnScore = Infinity;
    for (const i of searchArea) {
      if (board[i].type !== CELL.EMPTY) continue;
      board[i] = {type: type, step: -Infinity};
      const score = minimax(board, depth-1, alpha, beta, aiType, true);
      board[i] = {type: CELL.EMPTY, step: 0};
      mnScore = Math.min(mnScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha)  break;
    }
    return mnScore;
  }
}

const hashing = (board) => {
  return board.map(({ type }) => type).join('');
}

export const getSearchArea = (board, type) => {
  const area = [];
  for (let i=0; i<BOUND; ++i) {
    if (board[i].type === CELL.EMPTY) continue;
    const row = ROW[i], col = COL[i];
    for (let _i=Math.max(0, row-2); _i<=Math.min(row+2, SIZE-1); ++_i) {
      for (let _j=Math.max(0, col-2); _j<=Math.min(col+2, SIZE-1); ++_j) {
        if (board[_i*SIZE + _j].type === CELL.EMPTY) {
          area.push(_i*SIZE + _j);
        }
      }
    }
  }
  const uniqueArea = [...new Set(area)];
  uniqueArea.sort((a, b) => {
    const scoreA = evaluatePosition(board, a, type);
    const scoreB = evaluatePosition(board, b, type);
    return scoreB - scoreA;
  })
  return uniqueArea;
}
