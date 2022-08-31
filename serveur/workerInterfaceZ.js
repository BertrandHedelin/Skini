/**
 * @fileOverview 
 * Worker to manage the Interface Z
 * @author Bertrand Hédelin  © Copyright 2022, B. Petit-Hédelin
 * @version 1.0
 */
'use strict'

const { parentPort } = require('worker_threads');

var debug = false;
var debug1 = true;

var osc = require('osc-min');
var dgram = require("dgram");
var sockData = dgram.createSocket('udp4');
var sockMidi = dgram.createSocket('udp4');
var dataPort = 3005;
var midiPort = 3006;
var serverAddress = "192.168.1.251";
var interfaceZAddress = "192.168.1.250";
var interfaceZMidiPort = 1000;
var debug = false;
var debug1 = true;
var tempoSensorsInit = [5, 0, 10, 0, 0, 0, 0, 0];
var tempoSensors = tempoSensorsInit.slice();
var previousSensorsValues = [0, 0, 0, 0, 0, 0, 0, 0];
var sensorsSensibilities = [100, 5, 100, 5, 5, 5, 5, 5];

console.log("INFO: workerInterfaceZ: Start Interface Z worker");

function displaySignal(sensor, value) {
  process.stdout.write(sensor.toString() + ': ');
  for (var i = 0; i < value; i++) {
    process.stdout.write("*");
  }
  console.log(value);
}

parentPort.onmessage = function (mess) {
  var result = mess.data[0];
  switch (result) {

    case "startInterfaceZ":
      serverAddress = mess.data[1];
      interfaceZAddress = mess.data[2];
      dataPort = mess.data[3];
      midiPort = mess.data[4];
      interfaceZMidiPort = mess.data[5];
      tempoSensorsInit = mess.data[6];
      sensorsSensibilities = mess.data[7];

      if (debug) console.log('INFO: workerInterfaceZ: receive message: Start Worker startInterfaceZ',
        serverAddress, interfaceZAddress, dataPort, midiPort, interfaceZMidiPort,
        tempoSensorsInit, sensorsSensibilities);

      const message = 'message';
      parentPort.postMessage(message);

      initWorker();
      break;

    default:
      break;
  }
}

function initWorker() {
  /**
   * Process the OSC messages of the Data port from the Interface Z cards.
   */

  // Necessary if relaunched
  sockData.close(dataPort);
  sockMidi.close(midiPort);

  sockData = dgram.createSocket("udp4", function (msg, rinfo) {
    var message;
    var messageToSend;
    try {
      message = osc.fromBuffer(msg); // Message OSC recu
      if (debug) {
        //console.log("OSCetZ.js: socket reçoit OSC: [", message.address + " : " + message.args[0].value , "]");
        if (debug) console.log("Z socket reçoit OSC: [", message.address + " : " +
          message.args[0].value + " : " +
          message.args[1].value + " : " +
          message.args[2].value + "]");
      }
      switch (message.address) {
        case "/INTERFACEZ/RC":
          for (var i = 0; i < 8; i++) {
            if (tempoSensors[i] === 0) { // 0 means "Do not process the sensor"
            }
            else if (tempoSensors[i] === 1) {
              if (
                message.args[i].value < previousSensorsValues[i] - sensorsSensibilities[i] ||
                message.args[i].value > previousSensorsValues[i] + sensorsSensibilities[i]) {
                if (debug) displaySignal(i, Math.round(message.args[i].value / 100));

                messageToSend = {
                  type: "INTERFACEZ_RC",
                  sensor: i,
                  value: Math.round(message.args[i].value / sensorsSensibilities[i])
                }
                parentPort.postMessage(messageToSend);
              }
              previousSensorsValues[i] = message.args[i].value;
              tempoSensors[i] = tempoSensorsInit[i];
            } else {
              tempoSensors[i]--;
            }
          }
          break;

        default:
          console.log("OSCetZ.js: socket DATA reçoit OSC: [", message.address + " : " + (message.args[0].value), "]");
          break;
      }
      return;
    } catch (error) {
      console.log("OSCetZ.js: ERR dans réception OSC :", message.args, error);
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

  sockData.on('listening', function () {
    var addressData = sockData.address();
    if (debug1) console.log('INFO: OSCetZ.js: UDP Server listening on ' + addressData.address + ":" + addressData.port);
  });

  sockMidi.on('listening', function () {
    var addressMidi = sockData.address();
    if (debug1) console.log('INFO: OSCetZ.js: UDP Server listening on ' + addressMidi.address + ":" + addressMidi.port);
  });

  sockData.bind(dataPort, serverAddress);
  sockMidi.bind(midiPort, serverAddress);
}