const { parentPort } = require('worker_threads')

parentPort.onmessage = function(e) {
  console.log('Worker: Message received from main script', e.data);
  const result = e.data;
  //if (isNaN(result)) {
    parentPort.postMessage(result);
  /*} else {
    const workerResult = 'Result: ' + result;
    console.log('Worker: Posting message back to main script');
    parentPort.postMessage(workerResult);
  }*/
}

// let count = 0
// for (let i = 0; i < 10000000000; i++) {
//   count += 1
// }
// console.log(`FIN: ${count}`)
/*const message = `Tâche intensive terminée, total : ${count}`

// On renvoie un message depuis le worker récupérer lors du worker.on('message'...)
parentPort.postMessage(message)
*/
/*  setInterval( () => { 
    parentPort.postMessage("depuis worker");
    console.log('Tâche principale: la tâche en parallèle peut s\'exécuter')
   }, 1000)*/