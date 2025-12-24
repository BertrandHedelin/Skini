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
var portOSCSend = 1000;
var portOSCReceive= 8888;
var serverAddress = "192.168.1.251";
var myAddress = "192.168.1.251";
var debug = false;
var debug1 = true;

/**
 * Process the OSC messages
 */
sockData = dgram.createSocket("udp4", function (msg, rinfo) {
  var message;

  try {
    message = osc.fromBuffer(msg); // Message OSC recu
    console.log(osc.fromBuffer(msg));
    if (debug1) {
      console.log("Socket reçoit OSC: [", message.address + " : " + message.args[0].value , "]");
      // console.log("Socket reçoit OSC: [", message.address + " : " +
      //   message.args[0].value + " : " +
      //   message.args[1].value + " : " +
      //   message.args[2].value + "]");
    }
    switch (message.address) {
      case "/INTERFACEZ/RC":
        break;

      default:
        console.log("Socket DATA reçoit OSC: [", message.address + " : " + (message.args[0].value), "]");
        break;
    }
    return;
  } catch (error) {
    console.log("ERR dans réception OSC :", message.args, error);
    return;
  }
});

sockData.on('listening', function () {
  var addressData = sockData.address();
  if (debug1) console.log('INFO: UDP Server listening on ' + addressData.address + ":" + addressData.port);
});

sockData.bind(portOSCReceive, myAddress);

// Exemple d'émission vers MIDI =====================================

var count = 1.0;
var flag = false;
function sendHeartbeat() {
  var buf;
  count++;
  console.log("sendHeartbeat:", count);

  if (flag) {
    buf = osc.toBuffer(
      {
        address: "/OSCNOTEON",
        args: [
          { type: 'integer', value: 0 },
          { type: 'integer', value: 70 },
          { type: 'integer', value: 120 }]
      }
    );
  } else {
    buf = osc.toBuffer(
      {
        address: "/OSCNOTEOF",
        args: [
          { type: 'integer', value: 0 },
          { type: 'integer', value: 70 },
          { type: 'integer', value: 120 }]
      }
    );
  }

  flag = !flag;
  return sockData.send(buf, 0, buf.length, portOSCSend, serverAddress);
}

setInterval(sendHeartbeat, 500);
