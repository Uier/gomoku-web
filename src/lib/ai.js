/* eslint-disable no-unused-vars */
import { CELL } from '../constants/type';
import { checkWin } from './evaluate';
import { opponent } from '../constants/type';
// import { evaluatePosition } from './evaluate';
import { minimax, getSearchArea } from './minimax';

const AI_SEARCHING_DEPTH = 2

/**
 * 計算下一步
 * @param {array (pass by value)} board 棋盤
 * @param {CELL TYPE} aiType 
 * @param {number} curStep 最後一手是第幾次
 * @returns 
 */
// eslint-disable-next-line no-unused-vars
const next = (board, aiType, curStep) => {
  if (curStep === 0)  return 16;
  // if (curStep === 1)  return 112;

  const searchArea = getSearchArea(board, aiType);

  for (const i of searchArea) {
    if (checkWin(board, i, aiType)[0])  return i;
  }
  for (const i of searchArea) {
    if (checkWin(board, i, opponent(aiType))[0])  return i;
  }

  let mxPosition = null;
  let mxScore = -Infinity;
  for (const i of searchArea) {
    if (board[i].type !== CELL.EMPTY)
      continue;
    board[i] = { type: aiType, step: -Infinity };
    const score = minimax(board, AI_SEARCHING_DEPTH, -Infinity, Infinity, aiType, false, searchArea);
    // console.log(i, score);
    board[i] = { type: CELL.EMPTY, step: 0 };
    // const score = evaluatePosition(board, i, aiType);
    if (score > mxScore)
      mxPosition = [i], mxScore = score;
    else if (score === mxScore)
      mxPosition.push(i);
  }
  return mxPosition && mxPosition[Math.floor(Math.random() * mxPosition.length)];
}

export default {
  next,
}
