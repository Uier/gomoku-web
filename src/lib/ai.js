import { CELL, opponent } from '../constants/type';
import { checkWin } from './evaluate';
import { minimax, getSearchArea } from './minimax';

// minimax 搜索深度
const AI_SEARCHING_DEPTH = 2;

/**
 * AI 計算下一步
 * @param {array (pass by value)} board 棋盤
 * @param {CELL TYPE} aiType AI 的棋子類別
 * @param {number} curStep 最後一手是第幾次
 * @returns 
 */
const next = async (board, aiType, curStep) => {
  await Promise.resolve();
  // 第一手寫死在外圍 B14
  if (curStep === 0)  return 16;

  // 優化一：縮小搜尋評估範圍
  // getSearchArea 會回傳接下來要搜尋評估的空位，判斷依據是與目前任一個存在的棋子漢米頓距離 <= 2
  const searchArea = getSearchArea(board, aiType);

  // 若有位置下了必勝，則直接下在該位置
  for (const i of searchArea) {
    if (checkWin(board, i, aiType)[0])  return i;
  }
  // 若對手有位置下了必勝，則直接防守該位置
  for (const i of searchArea) {
    if (checkWin(board, i, opponent(aiType))[0])  return i;
  }

  // 從待搜尋評估的空位中進行 minimax 搜尋
  let mxPosition = null;
  let mxScore = -Infinity;
  for (const i of searchArea) {
    // 此處為 minimax 搜尋樹的根節點
    // 假設 AI 接下來要下在 i 點
    board[i] = { type: aiType, step: -Infinity };
    // 往下搜尋，計算下在該點後續經過 minimax 可得到的分數
    const score = minimax(board, AI_SEARCHING_DEPTH, -Infinity, Infinity, aiType, false, searchArea);
    // 搜尋完畢後把下在 i 點的棋子拿走
    board[i] = { type: CELL.EMPTY, step: 0 };
    // 紀錄最高分的步伐
    if (score > mxScore)
      mxPosition = [i], mxScore = score;
    else if (score === mxScore)
      mxPosition.push(i);
  }
  // 若有多個最高分則隨機返回一點，同分的情況僅在一開始棋子數目少時會遇到
  return mxPosition && mxPosition[Math.floor(Math.random() * mxPosition.length)];
}

export default {
  next,
}
