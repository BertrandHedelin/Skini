/**
 * @fileOverview For the creation of the parameters of the Skini piece
 * @author Bertrand Petit-Hédelin <bertrand@hedelin.fr>
 * @copyright (C) 2022-2024 Bertrand Petit-Hédelin
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
 * @version 1.4
 */
'use strict'
import * as fs from "fs";

var today = new Date();
var debug1= true;
var debug = false;

export function saveParameters(paramFile, params) {

  var paramText = `
// Generated by Skini: `+ today.toString() + `
"use strict"

var midiConfig = require("../serveur/midiConfig.json");

var countBusOUT = 0;
for (var i = 0; i < midiConfig.length; i++) {
  if (midiConfig[i].type === "OUT") {
    if (midiConfig[i].spec === "clipToDAW") {
      exports.busMidiDAW = countBusOUT;
    }
    countBusOUT++;
  }
}

// Piece Bitwig en OSC si la paramètre est false
// Sinon Skini parle MIDI
exports.directMidiON = `+ params.directMidiON + `;

// Pour charger les fonctions et modules de scenes de type GOLEM
exports.scenesON = `+ params.scenesON + `;

exports.english = `+ params.english + `;

/***********************************
  Paramètres du simulateur
  Si ces valeurs ne sont pas données c'est celle qui
  sont dans le simulateur qui sont utilisées
************************************/
exports.tempoMax = `+ params.tempoMax + `; // En ms
exports.tempoMin = `+ params.tempoMin + `; // En ms
exports.limiteDureeAttente = `+ params.limiteDureeAttente + `; // En pulsations

/********************************************************
AUTOMATE
*********************************************************/
// Pour un automate conforme à un rechargement selon les déclarations de module HipHop
exports.reactOnPlay = `+ params.reactOnPlay + `;

// Pour une réaction à chaque pulsation
exports.pulsationON = `+ params.pulsationON + `;

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Nom du sous répartoire ./sounds/xxxx
*************************************/
exports.soundFilesPath1 = "`+ params.soundFilesPath1 + `";

/***************************************
CHEMIN DES PARTITIONS DES PATTERNS ET CONFIG AVEC MUSICIENS
****************************************/
exports.avecMusicien = `+ params.avecMusicien + `; // Pour mettre en place les spécificités au jeu avec des musiciens.
exports.decalageFIFOavecMusicien = `+ params.decalageFIFOavecMusicien + `; // Décalage de la FIFO vide avant le premier pattern dans une FIFO.
exports.patternScorePath1 ="`+ params.patternScorePath1 + `";

/****************************************
ACTIVATION D'ALGORITHME D'ORGANISATION DES FIFOs
Si 0 ou undefined pas d'algorithme.
Si 1 algorithme de réorganisation Début, Milieu, Fin, Neutre (DFMN)
Dans le csv, D -> 1, M -> 2, F->3, N->4 (c'est fixé dans controleAbleton.js)
Si autre ... à créer...
ATTENTION: NE JAMAIS UTILISER EN SITUATION D'INTERACTION SI L'ALGORITHME
PEUT SUPPRIMER DES PATTERNS DES FIFOs
*****************************************/
exports.algoGestionFifo = `+ params.algoGestionFifo + `;
exports.shufflePatterns = `+ params.shufflePatterns + `;
/*****************************************************************************

Gestion de la Matrice des possibles
Automate de gestion de la matrice des possibles

******************************************************************************/
exports.nbeDeGroupesClients = `+ params.nbeDeGroupesClients + `;

function setnbeDeGroupesClients(num) {
  this.nbeDeGroupesClients = num;
}
exports.setnbeDeGroupesClients = setnbeDeGroupesClients;

exports.simulatorInAseperateGroup = `+ params.simulatorInAseperateGroup + `; // Si true, le dernier groupe client est réservé au simulateur.

// Pour un contrôle des Raspberries
exports.useRaspberries = `+ params.useRaspberries + `;
exports.playBufferMessage = "`+ params.playBufferMessage + `";
exports.raspOSCPort = `+ params.raspOSCPort + `;

// La synchro Midi, Link. Synchro Bitwig OSC par défaut si Midi et Link false.
exports.synchoOnMidiClock = `+ params.synchoOnMidiClock + `;
exports.synchroLink = `+ params.synchroLink + `;
exports.synchroSkini = `+ params.synchroSkini + `;
exports.timer = `+ params.timer + `;
exports.gameOSCSignals = `+ params.gameOSCSignals + `;

exports.sensorOSC = `+ params.sensorOSC + `;
exports.tempoSensorsInit = [`+ params.tempoSensorsInit + `];
exports.sensorsSensibilities = [`+ params.sensorsSensibilities + `];

const groupesDesSons = [
  `;

  for (var i = 0; i < params.groupesDesSons.length; i++) {
    paramText += `[`;
    paramText += ` "` + params.groupesDesSons[i][0].toString() + `",`;
    paramText += params.groupesDesSons[i][1].toString() + `,`;
    paramText += ` "` + params.groupesDesSons[i][2].toString() + `",`;
    for (var j = 3; j < 6; j++) {
      paramText += params.groupesDesSons[i][j].toString() + `,`;
    }
    paramText += `"` + params.groupesDesSons[i][6].toString() + `",`;
    paramText += `[` + params.groupesDesSons[i][7].toString() + `],`;
    paramText += params.groupesDesSons[i][8].toString();
    paramText += ` ],
  `;
  }

  paramText += `];
exports.groupesDesSons = groupesDesSons;
`
  // On écrit en synchrone pour ne pas avoir de pb avec la compilation qui suit
  // dans websocketServer. On n'aurait pu mettre la compilation dans un callback
  // sans synchro. Ce serait plus joli, mais pas utile dans ce cas.

  // Donne un message d'erreur alors que ça fonctionne !!!
  try {
    fs.writeFileSync(paramFile, paramText);
    if(debug1) console.log("INFO: saveParam.js: saveParameters: file wrtitten :", paramFile);
  } catch (err) {
    //console.log("ERR: saveParam.js: saveParameters: Pb ecriture", paramFile, err);
  }
}
