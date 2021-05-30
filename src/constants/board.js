import { CELL } from './type'

const SIZE = 15

export const INIT_CNT = 0

export const BOUND = SIZE * SIZE;

export const getInitBoard = () => Array(225).fill({ type: CELL.EMPTY, step: 0 })

export const ROW = (() => {
  return Array(BOUND).fill('').map((_, index) => Math.floor(index / SIZE));
})();

export const COL = (() => {
  return Array(BOUND).fill('').map((_, index) => index % SIZE);
})();
