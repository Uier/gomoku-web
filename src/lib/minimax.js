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
  // 優化二：cache 一些搜尋過的盤面，若之後有需要搜尋相同的盤面則直接返回之前搜尋過的結果
  const hb = hashing(board);
  if (hash[hb]) return hash[hb];

  // minimax 遞迴終止條件
  if (depth === 0 || checkTerminated(board)) {
    hash[hb] = evaluateBoard(board.slice(), aiType);
    return hash[hb];
  }

  // type 表示在這一層輪到誰下棋
  const type = maximizing ? aiType : opponent(aiType);
  // 重新計算待搜尋評估的空位有哪些
  const searchArea = getSearchArea(board, type);
  let ret;
  if (maximizing) {
    let mxScore = -Infinity;
    for (const i of searchArea) {
      // 一樣假設要下在這步
      board[i] = {type: type, step: -Infinity};
      // 往下搜尋，看這步之後能獲得的分數
      const score = minimax(board, depth-1, alpha, beta, aiType, false);
      // 搜尋完畢，把棋子收回來
      board[i] = {type: CELL.EMPTY, step: 0};
      // 紀錄最高分
      mxScore = Math.max(mxScore, score);
      alpha = Math.max(alpha, score);
      // alpha beta 剪枝
      if (alpha >= beta)  break;
    }
    ret = mxScore;
  } else {
    // 過程同 maximizing，不再贅述
    let mnScore = Infinity;
    for (const i of searchArea) {
      board[i] = {type: type, step: -Infinity};
      const score = minimax(board, depth-1, alpha, beta, aiType, true);
      board[i] = {type: CELL.EMPTY, step: 0};
      mnScore = Math.min(mnScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha)  break;
    }
    ret = mnScore;
  }
  hash[hb] = ret;
  return ret;
}

// hash function
const hashing = (board) => {
  return board.map(({ type }) => type).join('');
}

// 搜尋範圍
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
  // 優化三：啟發式評估函數
  uniqueArea.sort((a, b) => {
    const scoreA = evaluatePosition(board, a, type);
    const scoreB = evaluatePosition(board, b, type);
    return scoreB - scoreA;
  })
  return uniqueArea;
}
