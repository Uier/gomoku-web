<template>
  <div id="app">
    <h1>人工智慧作業三：五子棋 Gomoku</h1>
    <Game />
    <Footer />
  </div>
</template>

<script>
import Game from './components/Game.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Game, Footer
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
