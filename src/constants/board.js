import { CELL } from './type';

export const SIZE = 15;

export const INIT_CNT = 0;

export const BOUND = SIZE * SIZE;

export const getInitBoard = () => Array(BOUND).fill({ type: CELL.EMPTY, step: 0 });

export const getInitIsWin = () => Array(BOUND).fill(false);

export const firstHand = Array(BOUND).fill('').map((_, index) => {
  const r = Math.floor(index / SIZE);
  const c = index % SIZE;
  return (r < 2 || r > 12 || c < 2 || c > 12);
})

export const ROW = (() => {
  return Array(BOUND).fill('').map((_, index) => Math.floor(index / SIZE));
})();

export const ROW_LABEL = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

export const COL = (() => {
  return Array(BOUND).fill('').map((_, index) => index % SIZE);
})();

export const COL_LABEL = 'ABCDEFGHIJKLMNO';
