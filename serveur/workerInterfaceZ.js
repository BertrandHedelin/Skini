/**
 * @fileOverview 
 * Worker to manage the Interface Z
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

var osc = require('osc-min');
var dgram = require("dgram");
var sockData; // = dgram.createSocket('udp4');
var sockMidi; // = dgram.createSocket('udp4');
var sockMiniWI;

var dataPort = 3005;
var midiPort = 3006;
var miniWiPort = 8888;

var serverAddress = "192.168.1.251";
var interfaceZAddress = "192.168.1.250";
var interfaceZMidiPort = 1000;

var debug = false;
var debug1 = true;
var tempoSensorsInit = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,];
var tempoSensors = tempoSensorsInit.slice();
var previousSensorsValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var sensorsSensibilities = [100, 100, 100, 100, 100, 200, 200, 200, 100, 200, 200, 200];
var sensorsRunning = false;

console.log("INFO: workerInterfaceZ: Start Interface Z worker");

function displaySignal(sensor, value) {
  process.stdout.write(sensor.toString() + ': ');
  for (var i = 0; i < value; i++) {
    process.stdout.write("*");
  }
  console.log(value);
}

function displaySignalMiniWi(value) {
  var val;
  for (var j = 0; j < 4; j++) {

    val = value[j] / 100;
    if (val !== 0) {
      process.stdout.write(j + 8 + ': ');
      for (var i = 0; i < val; i++) {
        process.stdout.write("*");
      }
      console.log(val);
    }
  }
}

function closeOSCsockets() {
  try {
    if (sockData !== undefined) sockData.close();
    if (sockMidi !== undefined) sockMidi.close();
    if (sockMiniWI !== undefined) sockMiniWI.close();
  } catch (err) {
    console.log("ERR: workerInterfaceZ: closeOSCsockets: ", err);
  }
}

// Data received from the Server launching the worker
parentPort.onmessage = function (mess) {
  var result = mess.data[0];
  if (debug) console.log("workerInterfaceZ: message:", mess.data);

  switch (result) {

    case "startInterfaceZ":
      serverAddress = mess.data[1];
      interfaceZAddress = mess.data[2];
      dataPort = mess.data[3];
      midiPort = mess.data[4];
      miniWiPort = mess.data[5];
      interfaceZMidiPort = mess.data[6];
      tempoSensorsInit = mess.data[7];
      sensorsSensibilities = mess.data[8];

      if (debug1) console.log('INFO: workerInterfaceZ: receive message: Start Worker startInterfaceZ',
        serverAddress, interfaceZAddress, dataPort, midiPort, miniWiPort, interfaceZMidiPort,
        tempoSensorsInit, sensorsSensibilities);

      const message = 'message';
      parentPort.postMessage(message);

      sensorsRunning = true;
      initWorker();
      break;

    case "stopInterfaceZ":
      if (debug1) console.log('INFO: workerInterfaceZ: receive message: Stop OSC sockets');
      sensorsRunning = false;
      break;

    default:
      break;
  }
}

function initWorker() {
  /**
   * Process the OSC messages of the Data port from the Interface Z cards.
   */
  if (debug) console.log("initWorker Interface Z");

  // Necessary if relaunched
  closeOSCsockets();

  sockData = dgram.createSocket("udp4", function (msg, rinfo) {
    var message;
    var messageToSend;

    try {
      message = osc.fromBuffer(msg); // Message OSC recu
      if (debug) {
        console.log("Z socket reçoit OSC: [", message.address + " : " +
          message.args[0].value + " : " +
          message.args[1].value + " : " +
          message.args[2].value + " : " +
          message.args[3].value + " : " +
          message.args[4].value + " : " +
          message.args[5].value + " : " +
          message.args[6].value + " : " +
          message.args[7].value + "]");
      }
      switch (message.address) {
        case "/INTERFACEZ/RC":
          for (var i = 0; i < 8; i++) {
            if (tempoSensorsInit[i] === 0) { // Dont process this sensor
              //continue;
              if (debug) console.log("workerInterfaceZ: Dont process this sensor[", i, "]");
            }
            else if (tempoSensors[i] > 1) {
              tempoSensors[i]--;
            } else {
              if (debug) console.log("workerInterfaceZ: tempoSensors[", i, "] = 1");
              if (
                message.args[i].value < previousSensorsValues[i] - sensorsSensibilities[i] ||
                message.args[i].value > previousSensorsValues[i] + sensorsSensibilities[i]) {
                if (debug1) displaySignal(i, Math.round(message.args[i].value / 100));

                messageToSend = {
                  type: "INTERFACEZ_RC" + i,
                  sensor: i,
                  value: Math.round(message.args[i].value)
                }
                if (sensorsRunning) parentPort.postMessage(messageToSend);
              }
              previousSensorsValues[i] = message.args[i].value;
              tempoSensors[i] = tempoSensorsInit[i];
              if (debug) console.log("workerInterfaceZ: tempoSensors :", tempoSensors, "tempoSensorsInit :", tempoSensorsInit);
            }
          }
          break;

        default:
          console.log("Interface Z: socket DATA reçoit OSC: [", message.address + " : " + (message.args[0].value), "]");
          break;
      }
      return;
    } catch (error) {
      console.log("Interface Z: ERR dans réception OSC :", message.args, error);
      return;
    }
  });

  /**
  * Process the OSC messages of the Midi port from the Interface Z cards.
  */
  sockMidi = dgram.createSocket("udp4", function (msg, rinfo) {
    var message;
    var buf;

    try {
      message = osc.fromBuffer(msg); // Message OSC recu
      // console.log(osc.fromBuffer(msg));
      if (debug) {
        //console.log("OSCetZ.js: socket reçoit OSC: [", message.address + " : " + message.args[0].value , "]");
        console.log("Z socket reçoit OSC: [", message.address + " : " +
          message.args[0].value + " : " +
          message.args[1].value + " : " +
          message.args[2].value + "]");
      }
      switch (message.address) {
        case "/OSCSYSEXC":
          break;

        case "/OSCNOTEON":
          console.log("Z socket reçoit OSC: [", message.address + " : " +
            message.args[0].value + " : " +
            message.args[1].value + " : " +
            message.args[2].value + "]");

          // Exemple de reroutage du MIDI IN converti en OSC vers MIDI OUT
          // buf = osc.toBuffer(
          //   {
          //     address: "/OSCNOTEON",
          //     args: [
          //       { type: 'integer', value: message.args[0].value },
          //       { type: 'integer', value: message.args[1].value },
          //       { type: 'integer', value: message.args[2].value }]
          //   }
          // );
          // Le port 1000 est fixe.
          //sockMidi.send(buf, 0, buf.length, 1000, "192.168.1.250");
          break;

        default:
          console.log("OSCetZ.js: socket MIDI reçoit OSC: [", message.address + " : " + (message.args[0].value), "]");
          break;
      }
      return;
    } catch (error) {
      console.log("OSCetZ.js: ERR dans réception OSC :", message.args, error);
      return;
    }
  });

  /**
   * Process the OSC messages of the MiniWi port.
   * We consider that the MinWi sensors start from 8 to 11.
   * 0 to 7 is for the 8 Ana/8 Num OSC Card
   */
  sockMiniWI = dgram.createSocket("udp4", function (msg, rinfo) {
    var message;
    var messMiniWi = [0, 0, 0, 0];
    var messageToSend;

    try {
      message = osc.fromBuffer(msg); // Message OSC recu
      // console.log(osc.fromBuffer(msg));
      if (debug) {
        //console.log("OSCetZ.js: socket reçoit OSC: [", message.address + " : " + message.args[0].value , "]");
        console.log("Z socket reçoit OSC from MiniWi: [", message.address + " -> " +
          message.args[0].value + " : " +
          message.args[1].value + " : " +
          message.args[2].value + " : " +
          message.args[3].value + "]");
      }
      switch (message.address) {
        case "/CA":
          // Process the Sensor of the MiniWi as sensors from 8 to 11
          for (var i = 8; i < 12; i++) {
            if (tempoSensors[i] === 0) { // 0 means "Do not process the sensor"
            }
            else if (tempoSensors[i] === 1) {
              if (
                message.args[i - 8].value < previousSensorsValues[i] - sensorsSensibilities[i] ||
                message.args[i - 8].value > previousSensorsValues[i] + sensorsSensibilities[i]) {
                messMiniWi[i - 8] = message.args[i - 8].value;

                messageToSend = {
                  type: "INTERFACEZ_RC" + i,
                  sensor: i,
                  value: Math.round(message.args[i - 8].value)
                }
                if (sensorsRunning) parentPort.postMessage(messageToSend);
                if(debug) console.log("workerInterfaceZ.js: socket MiniWi post:", messageToSend);
              }
              previousSensorsValues[i] = message.args[i - 8].value;
              tempoSensors[i] = tempoSensorsInit[i];
            } else {
              tempoSensors[i]--;
            }
          }
          displaySignalMiniWi(messMiniWi);
          break;

        default:
          console.log("workerInterfaceZ.js: socket MiniWi reçoit OSC: [", message.address + " : " + (message.args[0].value), "]");
          break;
      }
      return;
    } catch (error) {
      console.log("workerInterfaceZ.js: ERR dans réception OSC :", message.args, error);
      return;
    }
  });

  sockData.on('listening', function () {
    var addressData = sockData.address();
    if (debug1) console.log('INFO: OSCetZ.js: UDP Server listening on ' + addressData.address + ":" + addressData.port);
  });

  sockMidi.on('listening', function () {
    var addressMidi = sockMidi.address();
    if (debug1) console.log('INFO: OSCetZ.js: UDP Server listening on ' + addressMidi.address + ":" + addressMidi.port);
  });

  sockMiniWI.on('listening', function () {
    var addressMidi = sockMiniWI.address();
    if (debug1) console.log('INFO: OSCetZ.js: UDP Server listening on ' + addressMidi.address + ":" + addressMidi.port);
  });

  try {
    sockData.bind(dataPort, serverAddress);
    sockMidi.bind(midiPort, serverAddress);
    sockMiniWI.bind(miniWiPort, serverAddress);
  } catch (err) {
    console.log("Pb on binding socket in workerInterfaceZ");
  }
}