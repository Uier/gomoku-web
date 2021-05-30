<template>
  <div class="modal" v-if="show">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1>請選擇先後手</h1>
        </div>
        <div class="modal-footer">
          <button type="button" @click="answer(CELL.BLACK)">先手（執黑）</button>
          <button type="button" @click="answer(CELL.WHITE)">後手（執白）</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CELL } from '../constants/type'

export default {
  name: 'Ask',
  data() {
    return {
      show: true,
      CELL,
    }
  },
  methods: {
    answer(type) {
      this.$emit('answer', type);
      this.show = false;
    },
  }
}
</script>

<style scoped>
.modal-dialog {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.modal-content {
  align-self: center;
  padding: 30px 100px 50px;
  background-color: #fff;
}
button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  margin: 0px 10px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}
</style>
