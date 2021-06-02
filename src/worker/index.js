const worker = new Worker('./aiWorker.js', { type: 'module' });

const send = message => worker.postMessage({
  message
})

export default {
  worker,
  send
}