import { SIZE } from '../constants/board';
import { opponent } from '../constants/type';

export function evaluate(board, aiType) {
  const userType = opponent(aiType);
  const b = board.map(({ type }) => type);
  const grid = []
  for (let i=0; i<SIZE; ++i) {
    grid.push(b.slice(i*SIZE, (i+1)*SIZE));
  }

  function hasFive(type) {
    let count = 0;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        if (
          (j + 4) in grid &&
          grid[i][j] === type &&
          grid[i][j + 1] === type &&
          grid[i][j + 2] === type &&
          grid[i][j + 3] === type &&
          grid[i][j + 4] === type
        ) count++;
        else if (
          (i + 4) in grid &&
          grid[i][j] === type &&
          grid[i + 1][j] === type &&
          grid[i + 2][j] === type &&
          grid[i + 3][j] === type &&
          grid[i + 4][j] === type
        ) count++;
        else if (
          (i + 4) in grid &&
          (j + 4) in grid &&
          grid[i][j] === type &&
          grid[i + 1][j + 1] === type &&
          grid[i + 2][j + 2] === type &&
          grid[i + 3][j + 3] === type &&
          grid[i + 4][j + 4] === type
        ) count++;
        else if (
          (i - 4) in grid &&
          (j + 4) in grid &&
          grid[i][j] === type &&
          grid[i - 1][j + 1] === type &&
          grid[i - 2][j + 2] === type &&
          grid[i - 3][j + 3] === type &&
          grid[i - 4][j + 4] === type
        ) count++;
      }
    }
    return count;
  }

  function hasOpenFour(type) {
    let count = 0;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        if (
          (j + 5) in grid &&
          !grid[i][j] &&
          grid[i][j + 1] === type &&
          grid[i][j + 2] === type &&
          grid[i][j + 3] === type &&
          grid[i][j + 4] === type &&
          !grid[i][j + 5]
        ) count++;
        else if (
          (i + 5) in grid &&
          !grid[i][j] &&
          grid[i + 1][j] === type &&
          grid[i + 2][j] === type &&
          grid[i + 3][j] === type &&
          grid[i + 4][j] === type &&
          !grid[i + 5][j]
        ) count++;
        else if (
          (i + 5) in grid &&
          (j + 5) in grid &&
          !grid[i][j] &&
          grid[i + 1][j + 1] === type &&
          grid[i + 2][j + 2] === type &&
          grid[i + 3][j + 3] === type &&
          grid[i + 4][j + 4] === type &&
          !grid[i + 5][j + 5]
        ) count++;
        else if (
          (i - 5) in grid &&
          (j + 5) in grid &&
          !grid[i][j] &&
          grid[i - 1][j + 1] === type &&
          grid[i - 2][j + 2] === type &&
          grid[i - 3][j + 3] === type &&
          grid[i - 4][j + 4] === type &&
          !grid[i - 5][j + 5]
        ) count++;
      }
    }
    return count;
  }

  function hasFour(type) {
    let count = 0;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        if (
          ((j + 4) in grid &&
          !grid[i][j] &&
          grid[i][j + 1] === type &&
          grid[i][j + 2] === type &&
          grid[i][j + 3] === type &&
          grid[i][j + 4] === type) ||

          ((j + 4) in grid &&
          grid[i][j] === type &&
          grid[i][j + 1] === type &&
          grid[i][j + 2] === type &&
          grid[i][j + 3] === type &&
          !grid[i][j + 4])
        ) count++;
        if (
          ((i + 4) in grid &&
          !grid[i][j] &&
          grid[i + 1][j] === type &&
          grid[i + 2][j] === type &&
          grid[i + 3][j] === type &&
          grid[i + 4][j] === type) ||

          ((i + 4) in grid &&
          grid[i][j] === type &&
          grid[i + 1][j] === type &&
          grid[i + 2][j] === type &&
          grid[i + 3][j] === type &&
          !grid[i + 4][j])
        ) count++;
        if (
          ((i + 4) in grid &&
          (j + 4) in grid &&
          !grid[i][j] &&
          grid[i + 1][j + 1] === type &&
          grid[i + 2][j + 2] === type &&
          grid[i + 3][j + 3] === type &&
          grid[i + 4][j + 4] === type) ||

          ((i + 4) in grid &&
          (j + 4) in grid &&
          grid[i][j] === type &&
          grid[i + 1][j + 1] === type &&
          grid[i + 2][j + 2] === type &&
          grid[i + 3][j + 3] === type &&
          !grid[i + 4][j + 4])
        ) count++;
        if (
          ((i - 4) in grid &&
          (j + 4) in grid &&
          !grid[i][j] &&
          grid[i - 1][j + 1] === type &&
          grid[i - 2][j + 2] === type &&
          grid[i - 3][j + 3] === type &&
          grid[i - 4][j + 4] === type) ||

          ((i - 4) in grid &&
          (j + 4) in grid &&
          grid[i][j] === type &&
          grid[i - 1][j + 1] === type &&
          grid[i - 2][j + 2] === type &&
          grid[i - 3][j + 3] === type &&
          !grid[i - 4][j + 4])
        ) count++;
      }
    }
    return count;
  }

  function hasOpenThree(type) {
    let count = 0;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        if ((
          (j + 5) in grid &&
          !grid[i][j] &&
          !grid[i][j + 1] &&
          grid[i][j + 2] === type &&
          grid[i][j + 3] === type &&
          grid[i][j + 4] === type &&
          !grid[i][j + 5]) ||

          ((j + 5) in grid &&
          !grid[i][j] &&
          grid[i][j + 1] === type &&
          grid[i][j + 2] === type &&
          grid[i][j + 3] === type &&
          !grid[i][j + 4] &&
          !grid[i][j + 5]
        ))count++;
        if (
          ((i + 5) in grid &&
          !grid[i][j] &&
          !grid[i + 1][j] &&
          grid[i + 2][j] === type &&
          grid[i + 3][j] === type &&
          grid[i + 4][j] === type &&
          !grid[i + 5][j]) ||

          ((i + 5) in grid &&
          !grid[i][j] &&
          grid[i + 1][j] === type &&
          grid[i + 2][j] === type &&
          grid[i + 3][j] === type &&
          !grid[i + 4][j] &&
          !grid[i + 5][j])
        ) count++;
        if (
          ((i + 5) in grid &&
          (j + 5) in grid &&
          !grid[i][j] &&
          !grid[i + 1][j + 1] &&
          grid[i + 2][j + 2] === type &&
          grid[i + 3][j + 3] === type &&
          grid[i + 4][j + 4] === type &&
          !grid[i + 5][j + 5]) ||

          ((i + 5) in grid &&
          (j + 5) in grid &&
          !grid[i][j] &&
          grid[i + 1][j + 1] === type &&
          grid[i + 2][j + 2] === type &&
          grid[i + 3][j + 3] === type &&
          !grid[i + 4][j + 4] &&
          !grid[i + 5][j + 5])
        ) count++;
        if (
          ((i - 5) in grid &&
          (j + 5) in grid &&
          !grid[i][j] &&
          !grid[i - 1][j + 1] &&
          grid[i - 2][j + 2] === type &&
          grid[i - 3][j + 3] === type &&
          grid[i - 4][j + 4] === type &&
          !grid[i - 5][j + 5]) ||

          ((i - 5) in grid &&
          (j + 5) in grid &&
          !grid[i][j] &&
          grid[i - 1][j + 1] === type &&
          grid[i - 2][j + 2] === type &&
          grid[i - 3][j + 3] === type &&
          !grid[i - 4][j + 4] &&
          !grid[i - 5][j + 5])
        ) count++;
      }
    }
    return count;
  }

  function hasThree(type) {
    let count = 0;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        if (
          ((j + 4) in grid &&
          !grid[i][j] &&
          !grid[i][j + 1] &&
          grid[i][j + 2] === type &&
          grid[i][j + 3] === type &&
          grid[i][j + 4] === type) ||

          ((j + 4) in grid &&
          grid[i][j] === type &&
          grid[i][j + 1] === type  &&
          grid[i][j + 2] === type &&
          !grid[i][j + 3] &&
          !grid[i][j + 4])
        ) count++;
        if (
          ((i + 4) in grid &&
          !grid[i][j] &&
          !grid[i + 1][j] &&
          grid[i + 2][j] === type &&
          grid[i + 3][j] === type &&
          grid[i + 4][j] === type) ||

          ((i + 4) in grid &&
          grid[i][j] === type &&
          grid[i + 1][j] === type  &&
          grid[i + 2][j] === type &&
          !grid[i + 3][j] &&
          !grid[i + 4][j])
        ) count++;
        if (
          ((i + 4) in grid &&
          (j + 4) in grid &&
          !grid[i][j] &&
          !grid[i + 1][j + 1] &&
          grid[i + 2][j + 2] === type &&
          grid[i + 3][j + 3] === type &&
          grid[i + 4][j + 4] === type) ||

          ((i + 4) in grid &&
          (j + 4) in grid &&
          grid[i][j] === type &&
          grid[i + 1][j + 1] === type &&
          grid[i + 2][j + 2] === type &&
          !grid[i + 3][j + 3] &&
          !grid[i + 4][j + 4])
        ) count++;
        if (
          ((i - 4) in grid &&
          (j + 4) in grid &&
          !grid[i][j] &&
          !grid[i - 1][j + 1] &&
          grid[i - 2][j + 2] === type &&
          grid[i - 3][j + 3] === type &&
          grid[i - 4][j + 4] === type) ||

          ((i - 4) in grid &&
          (j + 4) in grid &&
          grid[i][j] === type &&
          grid[i - 1][j + 1] === type &&
          grid[i - 2][j + 2] === type &&
          !grid[i - 3][j + 3] &&
          !grid[i - 4][j + 4])
        ) count++;
      }
    }
    return count;
  }

  function hasOpenTwo(type) {
    let count = 0;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        if (
          (j + 7) in grid &&
          !grid[i][j] &&
          !grid[i][j + 1] &&
          !grid[i][j + 2] &&
          grid[i][j + 3] === type &&
          grid[i][j + 4] === type &&
          !grid[i][j + 5] &&
          !grid[i][j + 6] &&
          !grid[i][j + 7]
        ) count++;
        if (
          (i + 7) in grid &&
          !grid[i][j] &&
          !grid[i + 1][j] &&
          !grid[i + 2][j] &&
          grid[i + 3][j] === type &&
          grid[i + 4][j] === type &&
          !grid[i + 5][j] &&
          !grid[i + 6][j] &&
          !grid[i + 7][j]
        ) count++;
        if (
          (i + 7) in grid &&
          (j + 7) in grid &&
          !grid[i][j] &&
          !grid[i + 1][j + 1] &&
          !grid[i + 2][j + 2] &&
          grid[i + 3][j + 3] === type &&
          grid[i + 4][j + 4] === type &&
          !grid[i + 5][j + 5] &&
          !grid[i + 6][j + 6] &&
          !grid[i + 7][j + 7]
        ) count++;
        if (
          (i - 7) in grid &&
          (j + 7) in grid &&
          !grid[i][j] &&
          !grid[i - 1][j + 1] &&
          !grid[i - 2][j + 2] &&
          grid[i - 3][j + 3] === type &&
          grid[i - 4][j + 4] === type &&
          !grid[i - 5][j + 5] &&
          !grid[i - 6][j + 6] &&
          !grid[i - 7][j + 7]
        ) count++;
      }
    }
    return count;
  }

  function hasTwo(type) {
    let count = 0;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        if (
          ((j + 4) in grid &&
          !grid[i][j] &&
          !grid[i][j + 1] &&
          !grid[i][j + 2] &&
          grid[i][j + 3] === type &&
          grid[i][j + 4] === type) ||

          ((j + 4) in grid &&
          grid[i][j] === type &&
          grid[i][j + 1] === type  &&
          !grid[i][j + 2] &&
          !grid[i][j + 3] &&
          !grid[i][j + 4])
        ) count++;
        if (
          ((i + 4) in grid &&
          !grid[i][j] &&
          !grid[i + 1][j] &&
          !grid[i + 2][j] &&
          grid[i + 3][j] === type &&
          grid[i + 4][j] === type) ||

          ((i + 4) in grid &&
          grid[i][j] === type &&
          grid[i + 1][j] === type  &&
          !grid[i + 2][j] &&
          !grid[i + 3][j] &&
          !grid[i + 4][j])
        ) count++;
        if (
          ((i + 4) in grid &&
          (j + 4) in grid &&
          !grid[i][j] &&
          !grid[i + 1][j + 1] &&
          !grid[i + 2][j + 2] &&
          grid[i + 3][j + 3] === type &&
          grid[i + 4][j + 4] === type) ||

          ((i + 4) in grid &&
          (j + 4) in grid &&
          grid[i][j] === type &&
          grid[i + 1][j + 1] === type &&
          !grid[i + 2][j + 2] &&
          !grid[i + 3][j + 3] &&
          !grid[i + 4][j + 4])
        ) count++;
        if (
          ((i - 4) in grid &&
          (j + 4) in grid &&
          !grid[i][j] &&
          !grid[i - 1][j + 1] &&
          !grid[i - 2][j + 2] &&
          grid[i - 3][j + 3] === type &&
          grid[i - 4][j + 4] === type) ||

          ((i - 4) in grid &&
          (j + 4) in grid &&
          grid[i][j] === type &&
          grid[i - 1][j + 1] === type &&
          !grid[i - 2][j + 2] &&
          !grid[i - 3][j + 3] &&
          !grid[i - 4][j + 4])
        ) count++;
      }
    }
    return count;
  }

  const openFours =  hasOpenFour(aiType);
  const closedFours = hasFour(aiType) - openFours;
  const openThrees = hasOpenThree(aiType);
  const closedThrees = hasThree(aiType) - openThrees;
  const openTwos = hasOpenTwo(aiType);
  const closedTwos = hasTwo(aiType) - openTwos;

  const oppOpenFours = hasOpenFour(userType);
  const oppClosedFours = hasFour(userType) - oppOpenFours;
  const oppOpenThrees = hasOpenThree(userType);
  const oppClosedThrees = hasThree(userType) - oppOpenThrees;
  const oppOpenTwos = hasOpenTwo(userType);
  const oppClosedTwos = hasTwo(userType) - oppOpenTwos;

  return (
    ((2 * openTwos) + (1 * closedTwos) +
    (200 * openThrees) + (2 * closedThrees) +
    (2000 * openFours) + (200 * closedFours) +
    (2000 * hasFive(aiType))) -

    ((2 * oppOpenTwos) + (1 * oppClosedTwos) +
    (2000 * oppOpenThrees) + (20 * oppClosedThrees) +
    (20000 * oppOpenFours) + (2000 * oppClosedFours) +
    (20000 * hasFive(userType)))
  );
}
