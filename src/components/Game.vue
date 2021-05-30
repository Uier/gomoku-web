<template>
  <div id="game-container">
    <div id="chessboard" ref="chessboard">
      <div
        v-for="({ type, step }, i) in board"
        :style="{ top: 24 + 40 * ROW[i] + 'px', left: 24 + 40 * COL[i] +'px'}"
        :key="i"
        :class="{
          chess: true,
          black: type === CELL.BLACK,
          white: type === CELL.WHITE,
          focus: step === cnt && cnt !== 0,
        }"
      >
        <span v-if="step !== 0" class="step" v-text="step" />
        <div v-else class="click-area" @click="place(i)" />
      </div>
    </div>
    <Ask @answer="start" />
    <Display />
  </div>
</template>

<script>
import Ask from './Ask';
import Display from './Display';
import { CELL, opponent } from '../constants/type';
import { BOUND, ROW, COL, getInitBoard, INIT_CNT } from '../constants/board';
import { evaluate } from '../lib/evaluate';

export default {
  name: 'Game',
  components: { Ask, Display },
  data() {
    return {
      CELL,
      ROW,
      COL,
      board: getInitBoard(),
      cnt: INIT_CNT,
      turn: null,
      userType: null,
      aiType: null,
    }
  },
  watch: {
    turn() {
      // if (checkWin(board)) {

      // }
      if (this.turn === this.aiType) {
        this.ai();
      }
    },
  },
  methods: {
    /**
     * type is the answer from Ask component
     * CELL.BLACK means user wanna black and go first
     * CELL.WHITE means user wanna white and let AI go first
     */
    start(type) {
      this.userType = type
      this.aiType = opponent(type)
      this.turn = CELL.BLACK;
      this.board = getInitBoard();
      this.cnt = INIT_CNT;
    },
    place(i) {
      this.$set(this.board, i, { type: this.turn, step: ++this.cnt });
      this.turn = opponent(this.turn);
    },
    ai() {
      let mxPosition = null;
      let mxScore = -Infinity;
      for (let i=0; i<BOUND; ++i) {
        if (this.board[i].type !== CELL.EMPTY) continue;
        const attack = evaluate(this.board, i, CELL.WHITE);
        const defence = evaluate(this.board, i, CELL.BLACK);
        const e = attack + defence;
        if (e > mxScore)  mxPosition = [i], mxScore = e;
        else if (e === mxScore)  mxPosition.push(i);
      }
      if (mxPosition === null) {
        alert('審局時發生錯誤 😢');
        return
      }
      this.place(mxPosition[Math.floor(Math.random() * mxPosition.length)]);
    }
  },
}
</script>

<style scoped>
#chessboard {
  width: 640px;
  height: 640px;
  background-image: url('../assets/Chessboard.svg');
  position: relative;
}
.chess {
  width: 32px;
  height: 32px;
  position: absolute;
  display: flex;
  justify-content: center;
}
.black {
  background-image: url('../assets/Black.svg');
  color: #ccc;
}
.white {
  background-image: url('../assets/White.svg');
  color: #333;
}
.step {
  align-self: center;
  font-size: 14px;
}
.click-area {
  cursor: pointer;
  width: 30px;
  height: 30px;
}
#game-container {
  display: flex;
  justify-content: center;
}
.focus {
  border-radius: 50%;
  animation: shine 1.2s infinite;
}
@keyframes shine {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.6);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(255, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
}
</style>
