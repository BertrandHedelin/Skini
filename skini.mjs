/**
 * @fileOverview 
 * Entry point to Skini which allow to control interactive and generative 
 * music based on clips (patterns).
 * @copyright (C) 2024 Bertrand Petit-Hédelin
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
 * 
 * @version 1.4
 * @author Bertrand Petit-Hédelin <bertrand@hedelin.fr>
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var express = require('express');
var ipConfig = require("./serveur/ipConfig.json");
var midiConfig = require("./serveur/midiConfig.json");

// Websocket dans le Serveur
import * as ws from './serveur/websocketServer.mjs';
import * as oscReceiveDAW from "./serveur/midimix.mjs";

function startSkini() {

  // Nettoyage du log précédents
  try {
    if (fs.existsSync("./skinilog.json")) {
      try {
        fs.unlinkSync("./skinilog.json")
      } catch (err) {
        console.error("WARN: Pas de log précédents:", err)
      }
    }
  } catch (err) {
    console.error(err)
  }

  // Load the necessary modules in the websocket server at launch
  ws.setParameters(oscReceiveDAW);

  // Share ws server in midimix
  oscReceiveDAW.setWebSocketServer(ws);

  // AFFICHAGE DU CONTEXTE =================================================

  function displayContext(ipConfig) {
    console.log("----------- NETWORK --------------------------------------");
    console.log("Port OUT OSC pour MIDI:", ipConfig.OutPortOSCMIDItoDAW, "IP:", ipConfig.remoteIPAddressSound); // DAW ou Processing
    console.log("Port IN  OSC pour MIDI:", ipConfig.InPortOSCMIDIfromDAW, "IP:", ipConfig.remoteIPAddressSound); // DAW ou Processing
    console.log("Port IN  OSC pour M4L :", ipConfig.portOSCFromAbleton, "IP:", ipConfig.remoteIPAddressAbleton); // Pour M4L
    //console.log("Port OUT OSC pour Jeu :", ipConfig.portOSCToGame, "IP:", ipConfig.remoteIPAdressGame);
    //console.log("Port IN  OSC pour Jeu :", ipConfig.portOSCFromGame, "IP:", ipConfig.remoteIPAdressGame);
    console.log("Port IN  OSC pour QLC :", ipConfig.inportLumiere, "IP:", ipConfig.remoteIPAddressLumiere);
    console.log("Port OUT OSC pour QLC :", ipConfig.outportLumiere, "IP:", ipConfig.remoteIPAddressLumiere);
    console.log("Port OUT pour Visu    :", ipConfig.outportProcessing, "IP:", ipConfig.remoteIPAddressImage);
    console.log("Port OUT seq. distrib.:", ipConfig.distribSequencerPort, "IP:", ipConfig.remoteIPAddressSound); // Processing
    console.log("Serveur HTTP port:", ipConfig.webserveurPort, "IP:", ipConfig.serverIPAddress);
    console.log("Serveur WS port:", ipConfig.websocketServeurPort, "IP:", ipConfig.serverIPAddress);
    if (ipConfig.serverIPAddressPublic !== undefined) {
      console.log("Serveur publique HTTP et Websocket IP:", ipConfig.serverIPAddressPublic);
    } else {
      console.log("Serveur pas accessible depuis Internet");
    }
    console.log("----------- DIRECTORIES --------------------------------------");
    console.log("Session Path:", ipConfig.sessionPath);
    console.log("Piece Path:", ipConfig.piecePath);

    console.log("----------- MIDI --------------------------------------");
    for (var i = 0; i < midiConfig.length; i++) {
      console.log("Midi" + midiConfig[i].type + ", usage:" + midiConfig[i].spec + ", bus: " + midiConfig[i].name + ", " + midiConfig[i].comment);
    }

    console.log("=========================================================");
  }

  var app = express();
  app.use(express.static('./'));

  app.get('/sequenceur', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/sequencer.html'));
  });

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/clientListe/clientListe.html'));
  });

  app.get('/block', function (req, res) {
    res.sendFile(path.join(__dirname + '/blocklySkini/blocklySkini.html'));
  });

  // Avec /controleur ça plante le client ???
  app.get('/contr', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/controleur/controleur.html'));
  });

  app.get('/contrHH', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/controleurHH/controleurHH.html'));
  });

  app.get('/skini', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/clientListe/clientListe.html'));
  });

  app.get('/score', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/score/score.html'));
  });

  app.get('/conf', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/configurateur/configurateur.html'));
  });

  app.get('/param', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/parametrage/parametrage.html'));
  });

  var port = ipConfig.webserveurPort;
  var addressServer = ipConfig.serverIPAddress;
  app.listen(port, () => {
    console.log(`INFO: Skini listening at http://${addressServer}:${port}`);
  });
  displayContext(ipConfig);
}

startSkini();
