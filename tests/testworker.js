const { Worker } = require('worker_threads')

process.stdin.resume();
process.stdin.setEncoding("utf-8");
var input_data = "";

/** 
* Crée un worker
* @param file On donne à l'objet Worker le chemin d'accès au fichier contenant la tâche à exécuter en parallèle.
*/
function executeWorker (file) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(file)

    // Une fois le worker actif
    worker.on('online', () => { 
      worker.postMessage('startSynchro');
      console.log('DEBUT : Execution de la tâche intensive en parallèle') 
/*      setInterval( () => { 
        console.log('Send synchro from main') 
        worker.postMessage('******************* Synchro');
        }, 1000)*/
      })

    // Si un message est reçu du worker
    worker.on('message', workerMessage => {
      console.log(workerMessage) // OK on reçoit

      worker.postMessage('******************* Synchro');
      return resolve
    })

    worker.on('error', reject)
    worker.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`))
      }
    })
  })
}

/**
 * Le main écrit dans la console
 */
 function prog () {
  let worker;

  // Tâche en parallèle
  executeWorker('./workerSynchro.js')

  // Tâche principale
/*  setInterval( () => { 
    console.log('Tâche principale: la tâche en parallèle peut s\'exécuter')
   }, 1000)*/

/*process.stdin.on("data", function(input) {
  input_data += input; // Reading input from STDIN
  if (input === "exit\n") {
    process.exit();
  }
});*/


}

prog()