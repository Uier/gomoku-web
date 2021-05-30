import { CELL } from './type';

export const SIZE = 15;

export const INIT_CNT = 0;

export const BOUND = SIZE * SIZE;

export const getInitBoard = () => Array(BOUND).fill({ type: CELL.EMPTY, step: 0 });

export const getInitIsWin = () => Array(BOUND).fill(false);

export const ROW = (() => {
  return Array(BOUND).fill('').map((_, index) => Math.floor(index / SIZE));
})();

export const ROW_LABEL = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

export const COL = (() => {
  return Array(BOUND).fill('').map((_, index) => index % SIZE);
})();

export const COL_LABEL = 'ABCDEFGHIJKLMNO';
