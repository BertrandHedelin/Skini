/**
 * @fileOverview Control by video game or sensors using OSC.
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
 * @version 1.2
 */

'use strict'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

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
export function setOrchestration(orch) {
  orchestration = orch;
}

/**
 * Launch the communication with the video game
 */
export function init() {

  // Sécurité si reprise de l'orchestration
  sock.close(ipConfig.portOSCFromGame);

  sock = dgram.createSocket("udp4", function (msg, rinfo) {
    try {
      message = osc.fromBuffer(msg);
      // Voir pour plus de paramètres reçus du jeu ou du controleur OSC !!

      var signal = message.address.slice(1); // pour enlever le slash du début message
      signal = signal.replace(/\//g, "_"); // On n'aime pas les slashs dans des signaux on met des _ à la place.

      if (debug) console.log("gameOSC.js: init :", signal, ":", message);
      orchestration.react({ [signal]: message.args[0].value });
      return;
    } catch (error) {
      return console.log("ERR: gameOSC.js:invalid OSC packet", error);
    }
  });

  sock.on('listening', function () {
    var address = sock.address();
    if(debug) console.log('GameOSC.js: 1 : UDP Server listening on ' + address.address + ":" + address.port);
  });

  try {
    var readyState = sock.readyState;
    if (readyState !== 1) {
      sock.bind(ipConfig.portOSCFromGame, ipConfig.serverIPAddress);
      if(debug1) console.log('GameOSC.js: 2 : UDP Server listening on ' + ipConfig.portOSCFromGame + ":" + ipConfig.serverIPAddress);
    }
  } catch (err) {
    console.log("ERR: gameOSC: socket ready:", err);
  }
}

/**
 * Close the socket. Use when we move from a piece with gameOSC
 * to one without gameOSC. It is not necessary to receive the 
 * InterfaceZ messages. Hence, websocketServer can close the socket.
 */
export function closeSocket() {
  try {
    if (sock.readyState === 1) {
      sock.close(ipConfig.portOSCFromGame);
    }
  } catch (err) {
    console.log("No socket to close for OSCgame:", err);
  }
}