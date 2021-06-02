export function print(board) {
  console.log(board.map(({ type }) => String(type)).join(''));
}