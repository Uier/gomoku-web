import AI from '../lib/ai';

addEventListener("message", event => {

  const args = event.data.message;
  AI.next(args[0], args[1], args[2])
    .then((pos) => {
      postMessage(pos);
    })
});
