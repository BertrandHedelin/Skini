/**
 * @fileOverview 
 * Worker to send a (good) synchro when not using a midi sync coming from a DAW.
 * @author Bertrand Petit-Hédelin <bertrand@hedelin.fr>
 * @copyright (C) 2022 Bertrand Petit-Hédelin
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
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