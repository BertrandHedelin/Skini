'use strict'

const { parentPort } = require('worker_threads');

var debug1 = true;
var timer = 1000;

console.log("start worker");

parentPort.onmessage = function (mess) {

  const result = mess.data;

  switch (result) {
    case "startSynchro":
      console.log('**** Worker: Message received from main script', mess.data);
      setInterval(function () {
        if (debug1) { var v0 = Date.now(); }
        const message = 'Send synchro';
        parentPort.postMessage(message)
        if (debug1) {
          console.log("websocketserver:worker: setMonTimer timer:", timer, "ms,Temps de réaction de l'automate:", Date.now() - v0, "ms");
        }
      }, 1000);
      break;

    default:
      break;
  }
}