/**
 * Worker to send a synchro when not using a midi sync coming from a DAW
 * @author Bertrand Hédelin  © Copyright 2022, B. Petit-Hédelin
 * @version 1.0
 */
'use strict'

const { parentPort } = require('worker_threads');

var debug = false;
var debug1 = true;
var synchroTimer;

console.log("INFO: Start Synchro worker");

parentPort.onmessage = function (mess) {
  var result = mess.data[0];
  var timer = mess.data[1];
  switch (result) {
    case "startSynchro":
      if (debug1) console.log('INFO: Start Worker synchro with timer: ', timer);
      if (synchroTimer !== null) {
        clearInterval(synchroTimer);
        synchroTimer = null;
      }
      synchroTimer = setInterval(function () {
        const message = 'synchroWorker';
        parentPort.postMessage(message);
        if (debug) console.log("workerSynchro:", timer);
      }, timer);
      break;
    default:
      break;
  }
}