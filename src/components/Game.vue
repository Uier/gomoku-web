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
          win: isWin[i],
        }"
      >
        <span v-if="step !== 0" class="step" v-text="step" />
        <div v-else class="click-area" @click="place(i, userType)" />
      </div>
    </div>
    <Ask @answer="start" />
    <Display v-if="turn !== null || winner != null" :turn="turn" :winner="winner" />
  </div>
</template>

<script>
import Ask from './Ask';
import Display from './Display';
import { CELL, opponent } from '../constants/type';
import { BOUND, ROW, COL, getInitBoard, INIT_CNT, getInitIsWin } from '../constants/board';
import { evaluate, checkWin } from '../lib/evaluate';

export default {
  name: 'Game',
  components: { Ask, Display },
  data() {
    return {
      CELL,
      ROW,
      COL,
      board: getInitBoard(),
      isWin: getInitIsWin(),
      cnt: INIT_CNT,
      turn: null,
      winner: null,
      userType: null,
      aiType: null,
    }
  },
  watch: {
    turn() {
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
      this.isWin = getInitIsWin();
      this.cnt = INIT_CNT;
    },
    place(i, type) {
      // 檢查下棋的人是正確的
      if (type !== this.turn) return;
      // 下棋
      this.$set(this.board, i, { type: this.turn, step: ++this.cnt });
      // 檢查勝利
      const [isWin, positions] = checkWin(this.board, i, this.turn);
      if (isWin) {
        // 顯示勝利
        this.winner = this.turn;
        this.turn = null;
        this.cnt = INIT_CNT;
        this.showWin(positions);
      } else {
        // 換人下
        this.turn = opponent(this.turn);
      }
    },
    ai() {
      let mxPosition = null;
      let mxScore = -Infinity;
      for (let i=0; i<BOUND; ++i) {
        if (this.board[i].type !== CELL.EMPTY) continue;
        const attack = evaluate(this.board, i, this.aiType);
        const defence = evaluate(this.board, i, this.userType);
        const e = attack + defence;
        if (e > mxScore)  mxPosition = [i], mxScore = e;
        else if (e === mxScore)  mxPosition.push(i);
      }
      if (mxPosition === null) {
        alert('審局時發生錯誤 😢');
        return
      }
      this.place(mxPosition[Math.floor(Math.random() * mxPosition.length)], this.aiType);
    },
    showWin(positions) {
      for (const pos of positions) {
        this.$set(this.isWin, pos, true);
      }
    },
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
.win {
  border-radius: 50%;
  animation: winning 1.5s infinite;
}
@keyframes shine {
  0% {
    box-shadow: 0 0 0 0 rgb(32, 255, 170);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(255, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
}
@keyframes winning {
  0% {
    box-shadow: 0 0 0 0 rgb(255, 50, 111);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(255, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
}
</style>
