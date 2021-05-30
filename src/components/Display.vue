<template>
  <div class="display-container">
    <h1>{{ winnerName }}</h1>
  </div>
</template>

<script>
import { CELL } from '../constants/type';

export default {
  name: 'Display',
  props: ['turn', 'winner'],
  computed: {
    winnerName() {
      if (this.winner === null) return '';
      return '獲勝者：' + (this.winner === CELL.BLACK ? '黑方' : '白方');
    },
  },
}
</script>

<style scoped>
.display-container {
  
}
</style>
