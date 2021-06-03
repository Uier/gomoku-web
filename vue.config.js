const WorkerPlugin = require('worker-plugin')
module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? '/gomoku-web' : '/',
  configureWebpack: {
    output: {
      globalObject: "this"
    },
    plugins: [
      new WorkerPlugin()
    ]
  }
}
