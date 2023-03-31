"use strict"
/**
 * @fileOverview Utilisation de Node.Js avec la carte 16 entrées réseau OSC d'interface Z.
 * La config doit se faire via une adresse IP fixe en 10.0.0.X
 * en mettant les interrupteurs de config IP sur off et en se
 * connectant directement sur la carte.
 * 
 * La carte ne connait que des paramètrages en IP fixes.
 * C'est simple mais contraignant.
 * 
 * On se connecte sur la carte en 10.0.0.30/OSC1, 2 ou 3 en fonction de la config
 * que l'on veut changer sur la carte.
 * On éteint la carte et met les interrupteurs sur la config que l'on veut
 * voir p.3 de la doc 8-Ana_OSC.pdf
 * 
 * Attention le port 1000 est dédié à la réception MIDI par la carte.
 * @author Bertrand Hédelin  © Copyright 2017-2022, B. Petit-Hédelin
 * @version 1.3
 */

var osc = require('osc-min');
var dgram = require("dgram");
var sockData = dgram.createSocket('udp4');
var sockMidi = dgram.createSocket('udp4');
var sockMiniWI = dgram.createSocket('udp4');

var dataPort = 3005;
var midiPort = 3006;
var miniWiPort = 8888;

var serverAddress = "192.168.1.251";
var interfaceZAddress = "192.168.1.250";
var interfaceZMidiPort = 1000;

var debug = false;
var debug1 = true;

/****************************************
0 lumière           -----> sensibilité 200
1,2,3,4 : distance  -----> sensibilité 100
5, 6 : chaleur mouvement  -----> sensibilité 200
7 : Bouton           -----> sensibilité sans importance

8-11: MiniWi

*****************************************/

var tempoSensorsInit = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,];
var tempoSensors = tempoSensorsInit.slice();
var previousSensorsValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var sensorsSensibilities = [100, 100, 100, 100, 100, 200, 200, 200, 100, 200, 200, 200];

function displaySignal(sensor, value) {
  var val = value / 100;
  process.stdout.write(sensor.toString() + ': ');
  for (var i = 0; i < val; i++) {
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

/**
 * Process the OSC messages of the Data port from the Interface Z cards.
 */
sockData = dgram.createSocket("udp4", function (msg, rinfo) {
  var message;

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
      case "/INTERFACEZ/RC":
        for (var i = 0; i < 8; i++) {
          if (tempoSensors[i] === 0) { // 0 means "Do not process the sensor"
          }
          else if (tempoSensors[i] === 1) {
            if (
              message.args[i].value < previousSensorsValues[i] - sensorsSensibilities[i] ||
              message.args[i].value > previousSensorsValues[i] + sensorsSensibilities[i]) {
              displaySignal(i, Math.round(message.args[i].value));
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


/**
 * Process the OSC messages of the MiniWi port.
 * We consider that the MinWi sensors start from 8 to 11.
 * 0 to 7 is for the 8 Ana/8 Num OSC Card
 */
sockMiniWI = dgram.createSocket("udp4", function (msg, rinfo) {
  var message;
  var messMiniWi = [0, 0, 0, 0];

  try {
    message = osc.fromBuffer(msg); // Message OSC recu
    // console.log(osc.fromBuffer(msg));
    if (debug) {
      //console.log("OSCetZ.js: socket reçoit OSC: [", message.address + " : " + message.args[0].value , "]");
      console.log("Z socket reçoit OSC: [", message.address + " : " +
        message.args[0].value + " : " +
        message.args[1].value + " : " +
        message.args[2].value + " : " +
        message.args[3].value + "]");
    }
    switch (message.address) {
      case "/CA":
        // Process the Sensor from 8 to 11
        for (var i = 8; i < 12; i++) {
          if (tempoSensors[i] === 0) { // 0 means "Do not process the sensor"
          }
          else if (tempoSensors[i] === 1) {
            if (
              message.args[i - 8].value < previousSensorsValues[i] - sensorsSensibilities[i] ||
              message.args[i - 8].value > previousSensorsValues[i] + sensorsSensibilities[i]) {
              messMiniWi[i - 8] = message.args[i - 8].value;
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
        console.log("OSCetZ.js: socket MiniWi reçoit OSC: [", message.address + " : " + (message.args[0].value), "]");
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

sockMiniWI.on('listening', function () {
  var addressMidi = sockMiniWI.address();
  if (debug1) console.log('INFO: OSCetZ.js: UDP Server listening on ' + addressMidi.address + ":" + addressMidi.port);
});

sockData.bind(dataPort, serverAddress);
sockMidi.bind(midiPort, serverAddress);
sockMiniWI.bind(miniWiPort, serverAddress);

// Exemple d'émission vers MIDI =====================================

var count = 1.0;
var flag = false;
function sendHeartbeat() {
  var buf;
  count++;
  console.log("OSCetZjs:", count);

  if (flag) {
    buf = osc.toBuffer(
      {
        address: "/CA", ///OSCNOTEON",
        args: [
          { type: 'integer', value: 0 },
          { type: 'integer', value: 70 },
          { type: 'integer', value: 120 }]
      }
    );
  } else {
    buf = osc.toBuffer(
      {
        address: "/CA", ///OSCNOTEOF",
        args: [
          { type: 'integer', value: 0 },
          { type: 'integer', value: 70 },
          { type: 'integer', value: 120 }]
      }
    );
  }

  flag = !flag;
  return sockData.send(buf, 0, buf.length, interfaceZMidiPort, interfaceZAddress);
}

//setInterval(sendHeartbeat, 500);
