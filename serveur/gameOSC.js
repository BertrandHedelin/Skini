'use strict'
"use hopscript";

/**************************************

Contrôle de jeu Vidéo via OSC

© Copyright 2019-2021, B. Petit-Heidelein

****************************************/

var dgram = require("dgram");
var osc = require('osc-min');
var sock = dgram.createSocket('udp4');
var ipConfig = require('./ipConfig');

var debug = false;
var debug1 = true;

var orchestration;
var message;

function setOrchestration(orch) {
  orchestration = orch;
}
exports.setOrchestration = setOrchestration;

function init() {

  // Sécurité si reprise de l'orchestration
  sock.close(ipConfig.portOSCFromGame);

  sock = dgram.createSocket("udp4", function (msg, rinfo) {
    var error, error1;
    try {
      message = osc.fromBuffer(msg);
      // Voir pour plus de paramètres reçus du jeu ou du controleur OSC !!

      var signal = message.address.slice(1); // pour enlever le slash du message
      signal = signal.replace(/\//g, ""); // On n'aime pas les slashs dans des signaux

      if (debug) console.log("gameOSC.js: init :", signal, ":", message);
      orchestration.react({ [signal]: message.args[0].value });
      return;
    } catch (error1) {
      error = error1;
      return console.log("ERR: gameOSC.js:invalid OSC packet", error);
    }
  });

  sock.on('listening', function () {
    var address = sock.address();
    console.log('GameOSC.js: UDP Server listening on ' + address.address + ":" + address.port);
  });

  try {
    var readyState = sock.readyState;
    if (readyState != 1) {
      sock.bind(ipConfig.portOSCFromGame, ipConfig.serverIPAddress);
    }
  } catch (err) {
    console.log("ERR: gameOSC: socket ready:", err);
  }
}
exports.init = init;