export const CELL = {
  EMPTY: 2,
  BLACK: 0,
  WHITE: 1,
  FORBID: 3,
}

export const opponent = (type) => type === CELL.BLACK ? CELL.WHITE : CELL.BLACK;
