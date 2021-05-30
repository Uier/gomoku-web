<template>
  <div class="display-container">
    <div v-if="user !== null" class="flex align-center">
      <h2 style="margin-right: 10px">{{ showUser }}</h2>
      <span :class="{ chess: true, black: user === CELL.BLACK, white: user === CELL.WHITE }" />
    </div>

    <div v-if="turn !== null" class="flex align-center">
      <h2 style="margin-right: 10px">{{ showTurn }}</h2>
      <span :class="{ chess: true, black: turn === CELL.BLACK, white: turn === CELL.WHITE }" />
    </div>

    <div v-if="winner !== null" class="flex align-center">
      <h2>遊戲結束</h2>
    </div>

    <div v-if="winner !== null" class="flex align-center">
      <h2 style="margin-right: 10px">{{ showWinner }}</h2>
      <span 
        v-if="winner !== 'tie'"
        :class="{ chess: true, black: winner === CELL.BLACK, white: winner === CELL.WHITE }"
      />
    </div>

    <div class="spacer" />

    <div class="flex justify-end">
      <button type="button" @click="$emit('restart')">重新開始</button>
    </div>
  </div>
</template>

<script>
import { CELL } from '../constants/type';

export default {
  name: 'Display',
  props: ['turn', 'user', 'winner'],
  data() { return { CELL } },
  computed: {
    showUser() {
      if (this.user === null) return '';
      return '您是' + (this.user === CELL.BLACK ? '黑方' : '白方');
    },
    showTurn() {
      if (this.turn === null) return '';
      return '輪到' + (this.turn === CELL.BLACK ? '黑方' : '白方');
    },
    showWinner() {
      if (this.winner === null) return '';
      if (this.winner === 'tie') return '和局';
      return '獲勝者：' + (this.winner === CELL.BLACK ? '黑方' : '白方');
    },
  },
}
</script>

<style scoped>
.display-container {
  margin-left: 50px;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  background-color: rgba(235, 242, 245, 0.75);
}
.spacer {
  flex: 1;
}
.flex {
  display: flex;
}
.align-center {
  align-items: center;
}
.justify-end {
  justify-content: flex-end;
}
.chess {
  width: 32px;
  height: 32px;
}
.black {
  background-image: url('../assets/Black.svg');
  color: #ccc;
}
.white {
  background-image: url('../assets/White.svg');
  color: #333;
}
button {
  background-color: #2c3e50;
  border: none;
  border-radius: 4px;
  color: white;
  padding: 15px 22px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}
</style>
