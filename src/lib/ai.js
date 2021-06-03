/* eslint-disable no-unused-vars */
import { CELL, opponent } from '../constants/type';
import { checkWin } from './evaluate';
import { ROW, ROW_LABEL, COL, COL_LABEL } from '../constants/board';
import { minimax, getSearchArea } from './minimax';

const AI_SEARCHING_DEPTH = 2;

/**
 * 計算下一步
 * @param {array (pass by value)} board 棋盤
 * @param {CELL TYPE} aiType 
 * @param {number} curStep 最後一手是第幾次
 * @returns 
 */
// eslint-disable-next-line no-unused-vars
const next = async (board, aiType, curStep) => {
  await Promise.resolve();
  if (curStep === 0)  return 16;

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
    // console.log(`score at ${ROW_LABEL[ROW[i]]}${COL_LABEL[COL[i]]} is ${score}`);
    board[i] = { type: CELL.EMPTY, step: 0 };
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
