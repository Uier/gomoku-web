// import AI from './ai';

onmessage = function(e) {
  console.log('Message received from main script', e.data);
  
  // AI.next(e.data[0], e.data[1], e.data[2])
  //   .then((pos) => {
  //     console.log('Posting message back to main script');
  //     postMessage(pos);
  //   })
}
