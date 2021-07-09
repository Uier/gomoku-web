<template>
  <div id="game-container">
    <div id="chessboard" ref="chessboard">
      <div
        v-for="({ type, step }, i) in board"
        :style="{ top: 34 + 40 * ROW[i] + 'px', left: 34 + 40 * COL[i] +'px'}"
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
        <div v-else
          :class="{ 'click-area': cnt !== 0 || firstHand[i]}"
          @click="place(i, userType)"
        />
      </div>
    </div>
    <Ask v-if="askModal" @answer="start" />
    <Display :turn="turn" :user="userType" :winner="winner" :history="history" @restart="restart" @back="back" />
  </div>
</template>

<script>
import Ask from './Ask';
import Display from './Display';
import { CELL, opponent } from '../constants/type';
import { firstHand, BOUND, ROW, COL, getInitBoard, INIT_CNT, getInitIsWin } from '../constants/board';
import { checkWin } from '../lib/evaluate';
import aiWorker from '@/worker';

export default {
  name: 'Game',
  components: { Ask, Display },
  data() {
    return {
      CELL,
      ROW,
      COL,
      firstHand,
      board: [],
      isWin: [],
      history: [],
      cnt: null,
      turn: null,
      winner: null,
      userType: null,
      aiType: null,
      askModal: true,
      twoAI: false,
      myWorker: null,
    }
  },
  watch: {
    turn() {
      if (this.turn === this.aiType) {
        aiWorker.send([this.board.slice(), this.aiType, this.cnt]);
      }
    },
  },
  mounted() {
    aiWorker.worker.onmessage = e => {
      this.handleAIResponse(e.data);
    }
  },
  methods: {
    start(type) {
      // 初始化並開始遊戲
      this.askModal = false;
      this.userType = type
      this.aiType = opponent(type)
      this.turn = CELL.BLACK;
      this.board = getInitBoard();
      this.isWin = getInitIsWin();
      this.history = [];
      this.cnt = INIT_CNT;
    },
    restart() {
      // 重新開始
      this.turn = null;
      this.winner = null;
      this.askModal = true;
    },
    back() {
      if (this.userType !== this.turn) {
        alert('輪到你的時候才能用');
      }
      const two = this.history.slice(-2);
      this.history.pop();
      this.history.pop();
      this.$set(this.board, two[1].pos, { type: CELL.EMPTY, cnt: 0 });
      this.$set(this.board, two[0].pos, { type: CELL.EMPTY, cnt: 0 });
    },
    place(i, type) {
      // 檢查下棋的人是正確的
      if (type !== this.turn) return;
      // 檢查第一手在外圍
      if (this.cnt === 0 && !firstHand[i]) {
        alert('外圍開局五子棋第一手僅能下在外圍兩圈！');
        return;
      }
      // 下棋
      this.$set(this.board, i, { type: this.turn, step: ++this.cnt });
      this.history.push({ pos: i, type: this.turn });
      // 檢查勝利
      const [isWin, positions] = checkWin(this.board.slice(), i, this.turn);
      if (isWin) {
        // 顯示勝利
        this.winner = this.turn;
        this.turn = null;
        this.cnt = INIT_CNT;
        this.showWin(positions);
      } else if (this.cnt >= BOUND) {
        // 顯示平手
        this.winner = 'tie';
        this.turn = null;
        this.cnt = INIT_CNT;
      } else {
        // 換人下
        this.turn = opponent(this.turn);
      }
    },
    handleAIResponse(pos) {
      // 處理 AI 回覆的訊息（要下的位置）
      if (pos === null) {
        alert('天啊！AI 出錯了 😢');
        return;
      }
      // AI 下棋
      this.place(pos, this.aiType);
    },
    showWin(positions) {
      // 顯示勝利
      for (const pos of positions) {
        this.$set(this.isWin, pos, true);
      }
    },
  },
}
</script>

<style scoped>
#chessboard {
  width: 660px;
  height: 660px;
  background-image: url('../assets/Chessboard.svg');
  background-size: contain;
  background-repeat: no-repeat;
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
  height: 100%;
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
