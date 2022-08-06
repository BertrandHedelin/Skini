/**
 * @fileOverview Control by video game or sensors using OSC.
 * @author Bertrand Hédelin  © Copyright 2017-2022, B. Petit-Hédelin
 * @version 1.2
 */

'use strict'

var dgram = require("dgram");
var osc = require('osc-min');
var sock = dgram.createSocket('udp4');
var ipConfig = require('./ipConfig');

var debug = false;
var debug1 = true;

var orchestration;
var message;
/**
 * Set the orchestration for the dialog with a game engine.
 * @param  {machine} orch - the orchestration
 */
function setOrchestration(orch) {
  orchestration = orch;
}
exports.setOrchestration = setOrchestration;

/**
 * Launch the communication with the video game
 */
function init() {

  // Sécurité si reprise de l'orchestration
  sock.close(ipConfig.portOSCFromGame);

  sock = dgram.createSocket("udp4", function (msg, rinfo) {
    try {
      message = osc.fromBuffer(msg);
      // Voir pour plus de paramètres reçus du jeu ou du controleur OSC !!

      var signal = message.address.slice(1); // pour enlever le slash du message
      signal = signal.replace(/\//g, "_"); // On n'aime pas les slashs dans des signaux

      if (debug1) console.log("gameOSC.js: init :", signal, ":", message);
      orchestration.react({ [signal]: message.args[0].value });
      return;
    } catch (error) {
      return console.log("ERR: gameOSC.js:invalid OSC packet", error);
    }
  });

  sock.on('listening', function () {
    var address = sock.address();
    console.log('GameOSC.js: 1 : UDP Server listening on ' + address.address + ":" + address.port);
  });

  try {
    var readyState = sock.readyState;
    if (readyState !== 1) {
      sock.bind(ipConfig.portOSCFromGame, ipConfig.serverIPAddress);
      console.log('GameOSC.js: 2 : UDP Server listening on ' + ipConfig.portOSCFromGame + ":" + ipConfig.serverIPAddress);
    }
  } catch (err) {
    console.log("ERR: gameOSC: socket ready:", err);
  }
}
exports.init = init;

/**
 * Close the socket. Use when we move from a piece with gameOSC
 * to one without gameOSC. It is not necessary to receive the 
 * InterfaceZ messages. Hence, websocketServer can close the socket.
 */
function closeSocket() {
  try {
    if (sock.readyState === 1) {
      sock.close(ipConfig.portOSCFromGame);
    }
  } catch (err) {
    console.log("No socket to close for OSCgame:", err);
  }
}
exports.closeSocket = closeSocket;