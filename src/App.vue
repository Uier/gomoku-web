<template>
  <div id="app">
    <h2>人工智慧作業三：五子棋 Gomoku</h2>
    <Game />
  </div>
</template>

<script>
import Game from './components/Game.vue'

export default {
  name: 'App',
  components: { Game },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
