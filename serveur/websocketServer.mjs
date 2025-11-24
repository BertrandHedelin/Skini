/**
 * @fileOverview Websocket management. This is the main part of Skini for messages
 * management and control. Something like a main switch.
 * Most of the API and functions here are local.
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
 * 
 * avec capteurIZTest.csv et TestCapteurIZ.als
 * 
 * @author Bertrand Petit-Hédelin <bertrand@hedelin.fr>
 * @version 1.4
 */
// @ts-check
'use strict'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { compile } from "@hop/hiphop/lib/hhc-compiler.mjs";
import * as fs from "fs";
import * as compScore from './computeScore.mjs';
import * as gameOSC from './gameOSC.mjs';
import * as oscMidiLocal from './OSCandMidi.mjs';
import * as saveParam from './saveParam.mjs';

const ipConfig = require('./ipConfig.json');
const midiConfig = require("./midiConfig.json");

const decache = require('decache');
const { stringify } = require('querystring');
import { Worker } from 'worker_threads';
import { fork } from "child_process";

const defaultOrchestrationName = "orchestrationHH.mjs";
let par;
let DAW;
let midimix;
let sessionFile; // Pour le chemin complet de la session en cours (descripteur en ".csv")
let parametersFile;
let parametersFileGlobal;
const origine = "./serveur/defaultSkiniParametres.js";
const defaultSession = "./serveur/defaultSession.csv";
let HipHopSrc; // Fichier HipHop éditer en texte et à compiler
let decacheParameters;
let childSimulator;
const targetHH = "./myReact/orchestrationHH.mjs"; // Redondant à revoir
// Attention en dur car le chemin est utilisé ailleurs, dans groupClientsSons.js
// pour orchestrationHH.js
const generatedDir = "./myReact/";

// Declarations to move from CJS to ES6
let _getBroadCastServer, _sendSignalFromDAW, _sendSignalFromMIDI, _sendSignalStopFromMIDI;
let _sendSignalStartFromMIDI, _sendSignalFromMidiMix, _sendOSCTick, _getAutomatePossible;
let _setPatternListLength;

export {
  _getBroadCastServer as getBroadCastServer,
  _sendSignalFromDAW as sendSignalFromDAW,
  _sendSignalFromMIDI as sendSignalFromMIDI,
  _sendSignalStopFromMIDI as sendSignalStopFromMIDI,
  _sendSignalStartFromMIDI as sendSignalStartFromMIDI,
  _sendSignalFromMidiMix as sendSignalFromMidiMix,
  _sendOSCTick as sendOSCTick,
  _getAutomatePossible as getAutomatePossible,
  _setPatternListLength as setPatternListLength
};

// Répertoires par défaut, ils sont à fixer dans le fichier de configuration.
// Où se trouvent les fichiers XML d'orchestration
// On ne peut pas donner de chemin absolu dans un browser.
// Ce sont les fichiers csv "descripteurs" des patterns
// et les fichiers de configuration ".js"
// Bug de principe (21/06/2022): On ne peut pas changer ces paramètres dans le fichier .js
// puisque ces paramètres sont fixés avant tous choix de pièces ....
// Il devrait s'agir de paramètres globaux et non liés aux fichiers de config de chaque pièce.
const sessionPath = ipConfig.sessionPath; //"./pieces/";
const piecePath = ipConfig.piecePath; //"./pieces/";

import * as groupesClientSon from './groupeClientsSons.mjs';

/**
 * To load some modules.
 * Used only at Skini launch.
 * @param {Object} midimixage reference
 */
export async function setParameters(midimixage) {
  midimix = midimixage;
  await import('./controleDAW.mjs').then((daw) => {
    DAW = daw;
    groupesClientSon.setMidimix(midimix);
    initMidiPort();
    startWebSocketServer();
  });
}

/**
 * The simulator can be updated at serveral places
 */
function updateSimulatorParameters(param) {

  if (childSimulator !== undefined) {
    let message = {
      type: "PARAMETERS",
      data: param
    }
    try {
      childSimulator.send(message);
    } catch (err) {
      console.log("ERR: websocketserver: updateSimulatorParameters:", err);
    }
  } else {
    if (debug1) console.log("INFO: websocketServer: updateSimulatorParameters :No Fork Simulator");
  }
}

/**
 * Convert data in the good format 
 * and reload new parametrers in the different 
 * modules during a Skini session.
 * 
 * Cette fonction n'est pas bonne.
 * Il faut regénerer complétement les paramètres et envoyer 
 * la nouvelle version.
 * 
 * @param {object} param 
 */
function reloadParametersOld(param) {
  let par = param; // C'est seulement pour la lecture car on a le même objet

  // Le transfert des parametre passe tout en chaine de caractère qui ne
  // sont pas traduite en int.
  par.nbeDeGroupesClients = parseInt(param.nbeDeGroupesClients, 10);
  par.algoGestionFifo = parseInt(param.algoGestionFifo, 10);
  par.tempoMax = parseInt(param.tempoMax, 10);
  par.tempoMin = parseInt(param.tempoMin, 10);
  par.limiteDureeAttente = parseInt(param.limiteDureeAttente, 10);

  // Pas vraiment utile pour les booléens ?
  par.shufflePatterns = param.shufflePatterns;
  par.avecMusicien = param.avecMusicien;
  par.reactOnPlay = param.reactOnPlay;

  // Typage pour les antécédents dans Score. En rechargeant depuis le client
  // de parametrage on a une chaine de caractères et pas un tableau.
  for (let i = 0; i < param.groupesDesSons.length; i++) {
    if (typeof param.groupesDesSons[i][7] === 'string' || param.groupesDesSons[i][7] instanceof String) {
      par.groupesDesSons[i][7] = param.groupesDesSons[i][7].split(',');
    }
    for (let j = 0; j < par.groupesDesSons[i][7].length; j++) {
      par.groupesDesSons[i][7][j] = parseInt(par.groupesDesSons[i][7][j]);
    }
  }

  oscMidiLocal.setParameters(par);
  DAW.setParameters(par);
  groupesClientSon.setParameters(par);
  midimix.setParameters(par);
  updateSimulatorParameters(par);

  initMidiPort();
}

function reloadParameters(param) {
  // Création manuelle d'une copie
  let parlocal = {
    ...param, // copie superficielle : fonctions et propriétés simples sont conservées
    groupesDesSons: param.groupesDesSons.map(group => [...group]) // copie des sous-tableaux
  };

  // Conversion des types
  parlocal.nbeDeGroupesClients = parseInt(param.nbeDeGroupesClients, 10);
  parlocal.algoGestionFifo = parseInt(param.algoGestionFifo, 10);
  parlocal.tempoMax = parseInt(param.tempoMax, 10);
  parlocal.tempoMin = parseInt(param.tempoMin, 10);
  parlocal.limiteDureeAttente = parseInt(param.limiteDureeAttente, 10);

  parlocal.shufflePatterns = param.shufflePatterns;
  parlocal.avecMusicien = param.avecMusicien;
  parlocal.reactOnPlay = param.reactOnPlay;

  // Traitement des antécédents (index 7)
  for (let i = 0; i < parlocal.groupesDesSons.length; i++) {
    const entry = parlocal.groupesDesSons[i][7];
    if (typeof entry === 'string') {
      parlocal.groupesDesSons[i][7] = entry.split(',').map(x => parseInt(x, 10));
    } else if (Array.isArray(entry)) {
      parlocal.groupesDesSons[i][7] = entry.map(x => parseInt(x, 10));
    }
  }

  // Envoi aux modules
  oscMidiLocal.setParameters(parlocal);
  DAW.setParameters(parlocal);
  groupesClientSon.setParameters(parlocal);
  midimix.setParameters(parlocal);
  updateSimulatorParameters(parlocal);

  // Il faut remettre à jour les paramètre de 
  // la variable global de websocketServer
  par = parlocal;

  initMidiPort();
}

/**
 * Simple conversion from Array to csv
 * @param {Array} arr 
 * @param {String} delimiter 
 * @returns {String} csv
 */
const arrayToCSV = (arr, delimiter = ',') =>
  arr.map(v => v.join(delimiter)
  ).join('\n');

// INITIALISATION DES DONNEES D'INTERACTION DU SEQUENCEUR
const tripleCrocheTR = 2;
const tripleCrocheR = 3;
const doubleCrocheTR = 4;
const doubleCrocheR = 6;
const crocheTR = 8;
const crocheR = 12;
const noireTR = 16;
const noireR = 24;
const blancheTR = 32;
const blancheR = 48;
const rondeTR = 64;
const rondeR = 96;

let tempsMesure = 4;    		// Partie haute de la mesure, nombre de temps dans la mesure
let divisionMesure = noireR; 	// Partie basse de la mesure
let nbeDeMesures = 1;
let tempo = 60; 				// à la minute
let canalMidi = 1;
let dureeDuTick = ((60 / tempo) / divisionMesure) * 1000; // Exprimé ici en millisecondes

let previousTime = 0;
let currentTime = 0;
let timeToPlay = 0;
let previousTimeToPlay = 0;
let defautDeLatence;

const debug = false;
const debug1 = true;
const warnings = false;
let timerSynchro;

// Automate des possibles
let DAWStatus = 0; // 0 inactif, sinon actif (originellement pour distinguer des orchestrations, distinction pas utile à présent)
let setTimer;
let timerDivision = 1; // Default value for the number of pulses for a tick, can evolve during an orchestration
let offsetDivision = 0;
let compteurDivisionMesure = 0;
let nbeDeGroupesSons = 0;
let socketControleur;
let groupeName = "";
let automatePossibleMachine;

// Scoring pour les jeux
let computeScorePolicy = 0;
let computeScoreClass = 0;

// CONTROLEUR
let DAWTableReady = false; // Pour pouvoir vérifier que la pièce a bien été chargée.

let clientsEnCours = [];
let groupeEncours = 0;

let currentTimePrevMidi = 0;
let currentTimeMidi = 0;

/*************************************************
   INITIALISATION DU PORT MIDI OUT (si paramétré)
 **************************************************/
/**
 * Init MIDI OUT port if defined in the parameters
 */
function initMidiPort() {

  // Check the midi config before doing something
  if (midiConfig[0] === undefined) {
    return;
  }

  if (par !== undefined) {
    let directMidi = false;
    if (par.directMidiON !== undefined) {
      directMidi = par.directMidiON;
    }
    if (directMidi) {
      oscMidiLocal.initMidiOUT();
    }
  }
}

/************************************************
   WEBSOCKET
 **************************************************/
/**
 * Main function to manage the websocket
 */
function startWebSocketServer() {
  /** @namespace Websocketserver */
  const WebSocketServer = require('ws');
  const serv = new WebSocketServer.Server({ port: ipConfig.websocketServeurPort });

  /*************************************************************************************
    Worker for synchro if no DAW (ne fonctionne pas dans VSC mais dans le terminal)
  **************************************************************************************/
  var workerSync;

  /**
  * Function to start a worker for the synchro when not using a midi sync coming from a DAW
  * @function
  * @memberof Websocketserver
  * @param {string} filepath path
  * @param {number} timer
  * @inner
  */
  function workerSynchroInit(filepath, timer) {
    if (workerSync !== undefined) {
      workerSync.postMessage(['startSynchro', timer]);
      return;
    }

    return new Promise((resolve, reject) => {
      workerSync = new Worker(filepath);
      if (debug) console.log('Launching worker Synchro', filepath);

      workerSync.on('online', () => {
        workerSync.postMessage(['startSynchro', timer]);
        if (debug) console.log('Launching worker Synchro');
      })
      workerSync.on('message', messageFromWorker => {
        switch (messageFromWorker) {
          case "synchroWorker":
            receivedTickFromSynchro();
            break;

          default:
            break;
        }
        return resolve;
      });
      workerSync.on('error', reject);
      workerSync.on('exit', code => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code:` + code));
        }
      });
    });
  }

  /*************************************************************************************
    Worker for the Interface Z management
  **************************************************************************************/
  var workerInterfaceZ;
  var workerInterfaceZRunning = false;

  /**
  * Function to start a worker for the Interface Z management
  * @function
  * @memberof Websocketserver
  * @param {string} filepath worker path
  * @inner
  */
  function workerInterfaceZInit(filepath,
    serverAddress,
    interfaceZIPaddress,
    portOSCFromInterfaceZData,
    portOSCFromInterfaceZMidi,
    portOSCFromInterfaceZMiniWi,
    portOSCToInterfaceZ,
    tempoSensorsInit,
    sensorsSensibilities) {

    if (workerInterfaceZRunning) {
      if (debug1) console.log("INFO: workerInterfaceZRunning");
      if (workerInterfaceZ !== undefined) {
        workerInterfaceZ.postMessage(['startInterfaceZ',
          serverAddress,
          interfaceZIPaddress,
          portOSCFromInterfaceZData,
          portOSCFromInterfaceZMidi,
          portOSCFromInterfaceZMiniWi,
          portOSCToInterfaceZ,
          tempoSensorsInit,
          sensorsSensibilities]);
        return;
      }
    }
    workerInterfaceZRunning = true;

    if (
      interfaceZIPaddress === undefined ||
      portOSCFromInterfaceZData === undefined ||
      portOSCFromInterfaceZMiniWi === undefined ||
      tempoSensorsInit === undefined ||
      sensorsSensibilities === undefined) {
      console.log("WARN: You try to use the Interface Z sensors but do not configure ipConfig");
      return;
    }

    return new Promise((resolve, reject) => {
      workerInterfaceZ = new Worker(filepath);
      if (debug) console.log('Launching worker InterfaceZ', filepath);

      workerInterfaceZ.on('online', () => {
        workerInterfaceZ.postMessage(['startInterfaceZ',
          serverAddress,
          interfaceZIPaddress,
          portOSCFromInterfaceZData,
          portOSCFromInterfaceZMidi,
          portOSCFromInterfaceZMiniWi,
          portOSCToInterfaceZ,
          tempoSensorsInit,
          sensorsSensibilities]);
        if (debug) console.log('Launching worker InterfaceZ');
      })
      workerInterfaceZ.on('message', messageFromWorker => {
        if (debug) console.log("Websoclketserver: messageFromWorker: ", messageFromWorker);

        switch (messageFromWorker.type) {
          case "INTERFACEZ_RC":
            if (debug) console.log("websocketServer:message from worker:", messageFromWorker);
            inputAutomatePossible({ INTERFACEZ_RC: [messageFromWorker.sensor, messageFromWorker.value] });
            break;

          case "INTERFACEZ_RC0":
            if (debug) console.log("websocketServer:message from worker:", messageFromWorker);
            reactAutomatePossible({ INTERFACEZ_RC0: [messageFromWorker.sensor, messageFromWorker.value] });
            break;
          case "INTERFACEZ_RC1":
            if (debug) console.log("websocketServer:message from worker:", messageFromWorker);
            reactAutomatePossible({ INTERFACEZ_RC1: [messageFromWorker.sensor, messageFromWorker.value] });
            break;
          case "INTERFACEZ_RC2":
            if (debug) console.log("websocketServer:message from worker:", messageFromWorker);
            reactAutomatePossible({ INTERFACEZ_RC2: [messageFromWorker.sensor, messageFromWorker.value] });
            break;
          case "INTERFACEZ_RC3":
            if (debug) console.log("websocketServer:message from worker:", messageFromWorker);
            reactAutomatePossible({ INTERFACEZ_RC3: [messageFromWorker.sensor, messageFromWorker.value] });
            break;
          case "INTERFACEZ_RC4":
            if (debug) console.log("websocketServer:message from worker:", messageFromWorker);
            reactAutomatePossible({ INTERFACEZ_RC4: [messageFromWorker.sensor, messageFromWorker.value] });
            break;
          case "INTERFACEZ_RC5":
            if (debug) console.log("websocketServer:message from worker:", messageFromWorker);
            reactAutomatePossible({ INTERFACEZ_RC5: [messageFromWorker.sensor, messageFromWorker.value] });
            break;
          case "INTERFACEZ_RC6":
            if (debug) console.log("websocketServer:message from worker:", messageFromWorker);
            reactAutomatePossible({ INTERFACEZ_RC6: [messageFromWorker.sensor, messageFromWorker.value] });
            break;
          case "INTERFACEZ_RC7":
            if (debug) console.log("websocketServer:message from worker:", messageFromWorker);
            reactAutomatePossible({ INTERFACEZ_RC7: [messageFromWorker.sensor, messageFromWorker.value] });
            break;
          case "INTERFACEZ_RC8":
            if (debug) console.log("websocketServer:message from worker:", messageFromWorker);
            reactAutomatePossible({ INTERFACEZ_RC8: [messageFromWorker.sensor, messageFromWorker.value] });
            break;
          case "INTERFACEZ_RC9":
            if (debug) console.log("websocketServer:message from worker:", messageFromWorker);
            reactAutomatePossible({ INTERFACEZ_RC9: [messageFromWorker.sensor, messageFromWorker.value] });
            break;
          case "INTERFACEZ_RC10":
            if (debug) console.log("websocketServer:message from worker:", messageFromWorker);
            reactAutomatePossible({ INTERFACEZ_RC10: [messageFromWorker.sensor, messageFromWorker.value] });
            break;
          case "INTERFACEZ_RC11":
            if (debug) console.log("websocketServer:message from worker:", messageFromWorker);
            reactAutomatePossible({ INTERFACEZ_RC11: [messageFromWorker.sensor, messageFromWorker.value] });
            break;

          default:
            break;
        }
        return resolve;
      });
      workerInterfaceZ.on('error', reject);
      workerInterfaceZ.on('exit', code => {
        if (code !== 0) {
          reject(new Error(`Worker InterfaceZ stopped with exit code:` + code));
        }
      });
    });
  }

  /**
  * Define the function in order to Broadcast to all clients.
  * @function
  * @memberof Websocketserver
  * @param {string} data message
  * @inner
  */
  serv.broadcast = function broadcast(data) {
    //if(debug) console.log("Web Socket Server: broadcast: ", data);
    serv.clients.forEach(function each(client) {
      if (client.readyState === WebSocketServer.OPEN) {
        try {
          client.send(data);
        } catch (err) {
          console.log("ERR: websocketserver.js: broadcast", err);
          throw err;
        }
      }
    });
  }

  // Pour les broadcasts depuis controle DAW, c'est la structure dans HOP que je garde.
  DAW.initBroadCastServer(serv);
  groupesClientSon.initBroadCastServer(serv);

  /**
   * In order to get the server used for broadcasting
   * @returns {serv} - return the server for Broadcasting
   * @function
   * @memberof Websocketserver
   * @inner
   */
  function getBroadCastServer() {
    if (serv === undefined) {
      console.log("ERR: websocketServer: getBroadCastServer: serv undefined");
      return false;
    }
    return serv;
  }
  _getBroadCastServer = getBroadCastServer;

  /************************************************************************************
    Fonction pour emission de signaux depuis Ableton vers l'automatePossibleMachine.
  *************************************************************************************/
  /**
   * Send a signal to the orchestration according to the skini note
   * @function
   * @memberof Websocketserver
   * @param  {number} noteSkini
   * @inner
   */
  function sendSignalFromDAW(noteSkini) {
    if (debug) console.log("websocketserver.js: sendSignalFromDAW:", noteSkini);
    var patternName = DAW.getPatternNameFromNote(noteSkini);
    if (debug) console.log("INFO: websocketserver.js: sendSignalFromDAW:", noteSkini, patternName);
    if (patternName !== undefined) {
      reactAutomatePossible({ patternSignal: [noteSkini, patternName] });
    } else {
      if (warnings) console.log("WARN: webSocketServeur: sendSignalFromDAW:", noteSkini, patternName);
    }
  }
  _sendSignalFromDAW = sendSignalFromDAW;

  /**
   * Send a signal "midiSignal" to the orchestration
   * tanks to a skini note.
   * @function
   * @memberof Websocketserver
   * @inner
   * @param  {number} noteSkini
   */
  function sendSignalFromMIDI(noteSkini) {
    if (debug1) console.log("webSocketServeur: sendSignalFromMIDI:", noteSkini);
    if (!reactAutomatePossible({ midiSignal: [noteSkini] })) {
      console.log("WARN: webSocketServeur: sendSignalFromMIDI:", noteSkini);
    }
  }
  _sendSignalFromMIDI = sendSignalFromMIDI;

  /** 
   * Send a signal "halt" to the orchestration.
   * @memberof Websocketserver
   * @function
   * @inner
   */
  function sendSignalStopFromMIDI() {
    if (!reactAutomatePossible({ halt: undefined })) {
      if (warnings) console.log("WARN: webSocketServeur: sendSignalStopFromMIDI");
    }
  }
  _sendSignalStopFromMIDI = sendSignalStopFromMIDI;

  /** 
   * Send a signal "start" to the orchestration.
   * @memberof Websocketserver
   * @function
   * @inner
   */
  function sendSignalStartFromMIDI() {
    if (!reactAutomatePossible({ start: undefined })) {
      if (warnings) console.log("WARN: webSocketServeur: sendSignalStartFromMIDI");
    }
  }
  _sendSignalStartFromMIDI = sendSignalStartFromMIDI;

  /************************************************************************************
  Fonction pour émission de signaux depuis midimix.js vers l'automatePossibleMachine.
  Utilisable pour synchro vidéo ou jeu via des notes Midi
  *************************************************************************************/
  /**
   * Send a signal "controlFromVideo" to the orchestration
   * tanks to a skini note.
   * @memberof Websocketserver
   * @function
   * @inner
   * @param  {number} noteSkini
   */
  function sendSignalFromMidiMix(noteSkini) {
    reactAutomatePossible({ controlFromVideo: [noteSkini] });
  }
  _sendSignalFromMidiMix = sendSignalFromMidiMix;

  /*************************************************************************************
    RECEPTION DES TICK MIDI OU BITWIG
  **************************************************************************************/
  var previousTimeClockMidi = 0;
  var currentTimeClockMidi = 0;
  var tempoTime = 0;

  // Vient de midiMix.js et directement de Bitwig ou de processing
  /**
   * Called by midimix.js, for OSC, MIDI, and Link messages.
   * @memberof Websocketserver
   * @function
   * @inner
   */
  function sendOSCTick() {
    if (debug1) {
      //console.log("websocketserver: sendOSCTick");
      serv.broadcast(JSON.stringify({
        type: "synchroSkini",
        text: ""
      }));
    }
    receivedTickFromSynchro();
  }
  _sendOSCTick = sendOSCTick;

  /**
   * Called on synchro messages received each quarter note
   * emitted by the DAW using MIDI or OSC, or the synchro worker.
   * No parameters the variables are global to the whole module.
   * @memberof Websocketserver
   * @function
   * @inner
   */
  function receivedTickFromSynchro() {
    if (debug) console.log("websocketserver : receivedTickFromSynchro: tick received");
    currentTimeClockMidi = Date.now();
    tempoTime = currentTimeClockMidi - previousTimeClockMidi; // Real duration of a quarter note
    if (debug) console.log("websocketserver:dureeDuTickHorlogeMidi:tempoTime=", tempoTime,
      compteurDivisionMesure,
      groupesClientSon.getTimerDivision());
    previousTimeClockMidi = currentTimeClockMidi;

    if (par.pulsationON) {
      reactAutomatePossible({ pulsation: undefined });
    }
    // La remise à jour de la durée des ticks est possible depuis les automates.
    // Si les automates ne mettent pas timerDivision à jour, on garde la valeur par défaut
    // donnée dans le fichier de config de la pièce. (compatibilté ascendante)
    var timerLocal = groupesClientSon.getTimerDivision();
    if (debug) console.log("websocketserver: receivedTickFromSynchro: timerLocal:", timerLocal);

    if (timerLocal !== undefined) {
      timerDivision = timerLocal;
    } else {
      //console.log("WARN: websocketServer: receivedTickFromSynchro: timerDivision undefined");
    }

    if (debug) console.log("websocketserver: receivedTickFromSynchro: timerDivision:", timerDivision);

    //offsetDivision = timerDivision/2;
    // actionOnTick() is called based on the tick not the pulse issued from the synchro.
    if (compteurDivisionMesure === 0) {  // offsetDivision
      actionOnTick(timerDivision);
    }
    // Ceci est la définition du tick de l'orchestration
    // Il s'agit d'une conversion de la pulsation MIDI ou worker en "tick".
    compteurDivisionMesure = (compteurDivisionMesure + 1) % timerDivision;
  }

  /*************************************************************************************
    MATRICE DES POSSIBLES, AUTOMATE
  **************************************************************************************/
  /**
   * Get the HipHop machine.
   * @memberof Websocketserver
   * @function
   * @inner
   * @returns {automatePossibleMachine} - the HipHop machine
   */
  function getAutomatePossible() {
    if (automatePossibleMachine !== undefined) {
      return automatePossibleMachine;
    } else {
      console.log("ERR: websocketserverSini.js: getAutomatePossible: automatePossibleMachine undefined")
    }
  }
  _getAutomatePossible = getAutomatePossible;

  /**
   * React on the orchestration
   * @memberof Websocketserver
   * @param {*} signal 
   * @returns {boolean} true if no problem
   */
  function reactAutomatePossible(signal) {

    if (debug) console.log("reactAutomatePossible 1:", signal, automatePossibleMachine);
    if (debug) console.log("reactAutomatePossible 1:", signal);

    if (automatePossibleMachine !== undefined) {
      try {
        if (debug) console.log("INFO: webSocketServer.js: reactAutomatePossible 2:", signal);
        automatePossibleMachine.react(signal);
      } catch (err) {
        console.log("ERROR: webSocketServer.js: reactAutomatePossible: Error on react for signal:", signal, err.toString());
        var msg = {
          type: "alertBlocklySkini",
          text: err.toString()
        }
        //throw err;
        serv.broadcast(JSON.stringify(msg));
        return false;
      }
      return true;
    } else {
      if (warnings) console.log("WARN: websocketserver: reactAutomatePossible: automate undefined");
      return false;
    }
  }

  function inputAutomatePossible(signal) {
    if (automatePossibleMachine !== undefined) {
      try {
        if (debug) console.log("INFO: webSocketServer.js: inputAutomatePossible:", signal);
        automatePossibleMachine.input(signal);
      } catch (err) {
        console.log("ERROR: webSocketServer.js: inputAutomatePossible: Error on react:", signal, err.toString());
        serv.broadcast(JSON.stringify({
          type: "alertBlocklySkini",
          text: err.toString()
        }));
        return false;
      }
      return true;
    } else {
      if (warnings) console.log("WARN: websocketserver: inputAutomatePossible: automate undefined");
      return false;
    }
  }

  // Pas au bon endroit, musicien pas en place dans cette version
  //if (par.avecMusicien !== undefined && par.decalageFIFOavecMusicien !== undefined) {p.
  //DAW.setAvecMusicien(par.avecMusicien, par.decalageFIFOavecMusicien);
  //}

  /**
   * Initialisation if the "matrice des possibles" which is a two dimensional array for
   * the groups of pattern according to the groups of users. It represents the status
   * of the orchestration.
   * @memberof Websocketserver
   * @param {number} DAWState Informs if an orchestration has been selected or not
   */
  function initMatriceDesPossibles(DAWState) {

    if (warnings) console.log("WARNING: websocketserver:initMatriceDesPossibles:DAWState:", DAWState);

    if (DAWState == 0) {
      if (warnings) console.log("WARNING: websocketserver:initMatriceDesPossibles:DAWState à 0");
      return;
    }
    nbeDeGroupesSons = DAW.getNbeDeGroupesSons();
    if(debug1) if (!Number.isInteger(nbeDeGroupesSons) || nbeDeGroupesSons <= 0 ) 
      {
        console.log("websocketServer:initMatriceDesPossibles:pb nbeDeGroupesons", nbeDeGroupesSons );
        return;
      }

    groupesClientSon.setNbeDeGroupesSons(nbeDeGroupesSons);
    if (groupesClientSon.setGroupesSon(DAWState) == -1) {
      if (warnings) console.log("WARNING: websocketserveur:initMatriceDesPossibles: setGroupesSon: vide");
    }
    groupesClientSon.createMatriceDesPossibles();

    let mesReponse = {
      type: "setControlerPadSize",
      nbeDeGroupesClients: par.nbeDeGroupesClients,
      nbeDeGroupesSons: nbeDeGroupesSons
    }

    if (socketControleur !== undefined) {
      if (socketControleur.readyState == 1) {
        socketControleur.send(JSON.stringify(mesReponse));
      } else {
        if (debug) console.log("WARN: websocketserveur:initMatriceDesPossibles: socketControler status:", socketControleur.readyState);
      }
    }
  }

  /**
   * Action called every quarter note of the MIDI synchro or worker synchro if no MIDI sync.
   * @memberof Websocketserver
   * @param {number} timerDivision 
   * @returns {boolean} true if the reaction of the orchestration is ok
   */
  function actionOnTick(timerDivision) {
    if (debug) {
      currentTimePrevMidi = currentTimeMidi;
      currentTimeMidi = Date.now();
      console.log("webSocketServeur:actionOnTick:diff de temps:", currentTimeMidi - currentTimePrevMidi, ":", timerDivision);
    }

    if (!reactAutomatePossible({ tick: undefined })) {
      if (warnings) console.log("WARN: websocketserver: actionOnTick: automate not ready");
      return false;
    }

    if (timerDivision == undefined) console.log("WARN:websocketServer:actionOnTick:timerDivision undefined")

    DAW.playAndShiftEventDAW(timerDivision);
    DAW.displayQueues();
    return true;
  }

  /**
   * Fix the timer when using the synchro from Node.js
   * not used when the worker runs.
   * @memberof Websocketserver
   * @function
   * @inner
   * @param {number} timer in ms
   */
  function setMonTimer(timer) {
    if (!par.synchoOnMidiClock) {
      setTimer = setInterval(function () {
        if (debug1) { let v0 = Date.now(); }
        actionOnTick(timerDivision);
        if (debug1) {
          console.log("websocketserver: setMonTimer timer:", timer, "ms,Temps de réaction de l'automate:", Date.now() - v0, "ms");
        }
      }, timer);
    }
  }

  /**
   * To update the variable on the list lengths of memorySortable
   * Clients need this variable when connecting. It can change during an orchestration.
   * @memberof Websocketserver
   * @function
   * @inner
   * @param {number} value length of the list of the client
   */
  function setPatternListLength(value) {
    if (debug1) console.log("websocketserver.js : setPatternListLength : value :", value);
  }
  _setPatternListLength = setPatternListLength;

  /*************************************************************************************
    WEB SOCKET MANAGEMENT
  **************************************************************************************/
  serv.on('connection', function (ws) {

    let messageLog = {
      date: "",
      source: "websocketServerSkini.js",
      type: "log",
      note: "",
      pseudo: "",
      id: ""
    }

    // Pour informer que l'on est bien connecté
    if (debug) console.log("INFO: Web Socket Server: a connection established");
    ws.send(JSON.stringify({
      type: "message",
      value: "Bienvenue chez Skini !"
    }));

    /*    // Pour dire à l'ouverture au client si on est ou pas dans une scène où DAW est actif.
        if (debug) console.log("Web Socket Server: DAWON:", par.DAWON);
      var msg = {
          msg.type: "DAWON",
        msg.value: DAWON
      }
    
        msg.type = "DAWON";
        msg.value = par.DAWON; // variable true, false, ou un chiffre
      ws.send(JSON.stringify(msg));*/

    // DONNEES DE TEMPO pour les séquenceurs.
    ws.send(JSON.stringify({
      type: "setConfigSequenceur",
      tempsMesure: tempsMesure,
      divisionMesure: divisionMesure,
      nbeDeMesures: nbeDeMesures,
      tempo: tempo,
      canalMidi: canalMidi,
      dureeDuTick: dureeDuTick
    }));
    ws.on('close', function () {
      if (debug) console.log("Web Socket Server: Socket closed by client.");
    });

    ws.on('error', function (event) {
      console.log("Web Socket Server: Erreur sur socket:", ws.socket, " ", event);
    });

    /**
     * This is where the pattern (clip) descriptor becomes an element in a FIFO.
     * @memberof Websocketserver
     * @function
     * @inner
     * @param {array} clip pattern description according to the csv file.
     * @param {string} signal Hiphop signal
     * @param {number} leGroupe user group (web client group)
     * @param {string} pseudo 
     * @param {number} monId
     * @returns {number} waiting time
     */
    function pushClipDAW(clip, signal, leGroupe, pseudo, monId) {
      let DAWNote = clip[0];
      let DAWChannel = Math.floor(DAWNote / 127) + 1;
      DAWNote = DAWNote % 127;
      if (DAWChannel > 15) {
        if (debug) console.log("Web Socket Server.js : pushNoteOnDAW: Nombre de canaux midi dépassé.");
        return 0;
      }
      let nom = clip[3];
      let DAWInstrument = clip[5];
      let typePattern = clip[7];
      let dureeClip = clip[10];
      let adresseIP = clip[11];
      let numeroBuffer = clip[12];
      let patternLevel = clip[13];
      let typeVertPattern = clip[8];

      let signalComplet = { [signal]: clip[3] }; // on ajouté le nom du pattern au signal
      let dureeAttente = DAW.pushEventDAW(par.busMidiDAW, DAWChannel,
        DAWInstrument, DAWNote, 125, monId, pseudo, dureeClip, nom,
        signalComplet, typePattern, adresseIP,
        numeroBuffer, patternLevel, typeVertPattern);

      // Envoi du signal vers l'automate au moment de la demande si reactOnPlay n'existe pas ou est false.
      // Il y a un autre scénario dans controleAbleton.js où on envoie le signal au moment ou la commande Midi part
      // Ce sont deux scénarios différents, celui fonctionne mieux en termes de synchro Midi car les demandes sont réparties dans
      // le temps au fur et à mesure qu'elles arrivent. Il n'y a pas de risque de react successifs au même moment du tick midi.
      // Il traite les activations avant que les patterns aient été jouées.
      if (par.reactOnPlay === undefined) {
        reactAutomatePossible(signalComplet);
      } else if (!par.reactOnPlay) {
        if (debug) console.log("websocketServeur: pushClipDAW: reactOnPlay:", par.reactOnPlay, signalComplet);
        reactAutomatePossible(signalComplet);
      }
      if (debug) console.log("Web Socket Server.js : pushClipDAW :nom ", nom, " pseudo: ", pseudo);

      if (debug) console.log("Web Socket Server.js: pushClipDAW: DAWInstrument", DAWInstrument, " durée: ", dureeAttente);

      return dureeAttente;
    }

    /**
     * HipHop reaction on the orchestration and compute delay.
     * @memberof Websocketserver
     * @function
     * @inner
     * @param {string} unPseudo 
     * @param {number} groupe 
     * @param {array} pattern 
     * @param {number} monId 
     */
    function playPattern(unPseudo, groupe, pattern, monId) {

      if (pattern === undefined) return; // Protection si pas de selection sur le client
      if (debug) console.log("Web Socket Serveur: playPattern: clipChoisi", pattern, " pour ID: ", monId);
      if (debug) console.log('Websocket serveur : playPattern: demandeDeSonParPseudo : ', unPseudo, "groupe:", groupe, "pattern:", pattern[4]);
      if (debug) console.log("-----webSocketServeur: playPattern: Pattern reçu:", pattern[0]);

      let signal = groupesClientSon.getSignalFromGroup(pattern[9]) + "IN";

      if (signal === "-1IN") {
        console.log("WARN: websocketserveur: playPattern : no group declared :", groupe);
        return;
      }
      if (debug) console.log("webSocketServeur: playPattern, signal reçu:", pattern, signal);

      let legroupe = groupe; // groupe d'utilisateur

      // Pour la gestion des messages qui ne sont pas des patterns, on utilise des patterns dont les
      // commandes MIDI sont négatives. Dans ce cas on émet des signaux sans faire appel au player de patterns
      // On appelle jamais pushClipAbleton avec une note négative issue de la config.
      if (pattern[0] < 0) {
        // Pour associer le nom du pattern au signal de groupe IN
        // C'est plus pour être cohérent que par besoin.
        reactAutomatePossible({ [signal]: pattern[3] });
        return;
      }

      let dureeAttente = pushClipDAW(pattern, signal, legroupe, unPseudo, monId);

      // DureeAttente est la somme des durées de la FIFO de l'instrument.
      if (dureeAttente === -1) {
        return; // On est dans un cas de note sans durée
      }

      // Conversion in real waiting time
      dureeAttente = Math.floor(dureeAttente * tempoTime / 1000);
      if (debug) console.log("Web Socket Serveur: abletonStartClip:dureeAttente", dureeAttente);
      // On communique au client le temps d'attente en sec. avant d'entendre.
      ws.send(JSON.stringify({
        type: "dureeAttente",
        text: dureeAttente,
        son: pattern[3]
      }));

      /*
          // Informe tout le monde
          var messageBroadcast = {
            soundName:  pattern[3],
            soundFileName: pattern[4],
            instrument: pattern[5],
            group:  pattern[9],
            pseudo: unPseudo,
            idClient: monId
          }
      
          hop.broadcast('demandeDeSonParPseudo', JSON.stringify(messageBroadcast));
      
          var messageInstrument = {
            instrument: pattern[5],
            attente : dureeAttente
          }
          hop.broadcast('attenteInstrument', JSON.stringify(messageInstrument));
      */
      // Log la manip
      messageLog.note = pattern[3];
      messageLog.id = ws.id;
      messageLog.pseudo = unPseudo;
      logInfoSocket(messageLog);

      delete messageLog.note;
      delete messageLog.text;
    }

    /**
     * Build the HipHop Programm.
     * @memberof Websocketserver
     * @function
     * @inner
     */
    async function compileHH() {
      DAWTableReady = false;
      try {
        automatePossibleMachine = await groupesClientSon.makeOneAutomatePossibleMachine();
      } catch (err) {
        //console.log("ERR: websocketserver.js: pb makeOneAutomatePossibleMachine", err);
        console.log("\n-------------------------------------------------------------");
        console.log(`ATTENTION: 
Problem when compiling the Orchestration
maybe an hiphop compile Error`);
        console.log("-------------------------------------------------------------");

        serv.broadcast(JSON.stringify({
          type: "consoleBlocklySkini",
          text: "See your console, pb on compilation"
        }));
        return;
      }

      DAW.setAutomatePossible(automatePossibleMachine);
      console.log("INFO: websocketServer: loadDAWTable: table loaded\n");
      serv.broadcast(JSON.stringify({
        type: "consoleBlocklySkini",
        text: "Orchestration loaded"
      }));

      // Pour l'emission des commandes OSC entre l'orchestration et un jeu ou des capteurs
      if (par.gameOSCSignals) {
        gameOSC.setOrchestration(automatePossibleMachine);
        gameOSC.init();
      } else {
        // Pour fermer la socket si on change pour une pièce sans gameOSC
        gameOSC.closeSocket();
      }

      try {
        //reactAutomatePossible( {DAWON: 1} ); // !!! en cours
      } catch (e) {
        console.log("websocketServerSkini:loadDAWTable:catch react:", e);
      }
      DAWTableReady = true;
    }

    /**
   * Load the parameters
   * @memberof Websocketserver
   * @function
   * @inner
   */
    function loadParameters(fileName) {
      // Chargement des paramètres
      // à partir du fichier de config de la pièce
      // qui a le même nom que le fichier d'orchestration

      if (debug1) console.log("INFO: loadBlocks: parametersFile: ", fileName);
      // Attention decache n'utilise pas le même path que parametersFile
      decacheParameters = "../" + fileName;

      try {
        if (fs.existsSync(fileName)) {
          let extension = fileName.slice(-3);
          if (extension !== ".js") {
            console.log("ERR: Not an js file:", fileName);
            ws.send(JSON.stringify({
              type: "alertBlocklySkini",
              text: "Parameter not an JavaScript file " + fileName
            }));
            return;
          }
        } else {
          console.log("ERR: No parameter file:", fileName);
          ws.send(JSON.stringify({
            type: "alertBlocklySkini",
            text: "The parameter file " + fileName + " is not updated, don't run the program before modifying it."
          }));
          // Initialise un fichier de parametres par défaut
          // C'est à dire en copie un dans un parametersFile temporaire
          try {
            fs.copyFileSync(origine, fileName);
          } catch (err) {
            console.log("websocketServer: Pb ecriture: ", fileName, err);
          }
          return;
        }
      } catch (err) {
        console.log("ERR: Pb Reading parameter file:", fileName, err);
        ws.send(JSON.stringify({
          type: "alertBlocklySkini",
          text: "Pb Reading parameter file " + fileName
        }));
        return;
      }

      decache(decacheParameters);
      // Le fait de faire un require ici, annule la référence de par dans 
      // les autres modules. Il faut faire un reload dans tous les modules.
      par = require(decacheParameters);
      if (debug) console.log("websocketserveur.js: loadbloaks; après require de dechacheParameters:", par.groupesDesSons);
      reloadParameters(par);

      // On initialise les interfaces Midi ou via OSC et Synchro quand les paramètres sont chargés.
      midimix.midimix(automatePossibleMachine);
      ws.send(JSON.stringify({
        type: "consoleBlocklySkini",
        text: "Orchestration loaded"
      }));
    }

    /**
     * Process the websocket messages. The protocols are here.
     * @memberof Websocketserver
     * @function
     * @inner
     */
    ws.on('message', async function (message) {
      if (debug) console.log('received: %s', message);
      var msgRecu = JSON.parse(message);

      // Pour le Log des messages reçus
      messageLog.date = getDateTime();
      messageLog.type = msgRecu.type;

      switch (msgRecu.type) {

        case "checkSession":
          DAW.displaySession();
          console.log("------------------------------------");
          console.log(par);
          break;

        case "cleanQueues":
          DAW.cleanQueues();
          break;

        case "clientPseudo":
          if (debug) console.log("websocketserver: clientPseudo", msgRecu);
          compScore.putInClientsEnCours(msgRecu.pseudo, ws.id, msgRecu.groupe, clientsEnCours);
          if (debug) console.log("websocketserver: clientPseudo : clientsEnCours:", clientsEnCours);
          break;

        case "clientScenes": // Pas trés utile, c'est dans scenes.js
          ws.id = msgRecu.value;
          break;

        case "closeSpectateur":
          if (debug) console.log("Web Socket Server: received message system : [%s]",
            msgRecu.text, " from Client ID:", ws.id);
          //DAW.libereDansTableDesCommandes(ws.id);

          messageLog.id = ws.id;
          messageLog.pseudo = msgRecu.pseudo;
          delete messageLog.text;
          delete messageLog.note;
          logInfoSocket(messageLog);

          ws.close();
          break;

        case "combienDeSpectateurs":
          var value = DAW.nbeDeSpectateursConnectes();
          ws.send(JSON.stringify({ type: "nbeDeSpectateurs", value }));
          break;

        case "configuration": // Message converti en signal pour l'automate central
          if (debug) console.log("Web Socket Server: received message configuration : [%s]",
            msgRecu.text, " from Client ID:", ws.id);
          //machineServeur.inputAndReact( msgRecu.text, msgRecu.extra ); // ENVOI DU SIGNAL VERS HIPHOP
          break;

        case "configDAWMidiNote":
          if (debug1) console.log("websocketServer: configDAWMidiNote:", msgRecu);
          //Rappel des paramètres: par.busMidiDAW, DAWChannel, DAWNote, velocity
          oscMidiLocal.sendNoteOn(msgRecu.bus, msgRecu.channel, msgRecu.note, 120);
          break;

        case "configDAWCC":
          if (debug1) console.log("websocketServer: configDAWCC:", msgRecu);
          oscMidiLocal.sendControlChange(msgRecu.bus, msgRecu.channel, msgRecu.CC, msgRecu.CCValue);
          break;

        case "compileHH":
          try {
            compileHH();
          } catch (err) {
            console.error(err);
          }
          break;

        case "compileHHEditionFile":
          if (debug1) console.log("websocketServer: compileHHEditionFile:", msgRecu,
            ":", piecePath + HipHopSrc, ":", targetHH);

          try {
            // Etape de parsing vers targetHH 
            let fragment = compile(piecePath + HipHopSrc, {});
            await fragment.output(targetHH);
            await fragment.sourcemap(targetHH);
          } catch (err) {
            console.log("ERR: Erreur dans la compilation du programme hiphop")
            console.log("websocketServerSkini:compileHHEditionFile:fragment:", err);
            break; // Pas la peine d'aller plus loin dans la compilation
          }

          // Compilation du programme généré en dur dans targetHH.
          // On utilise le même procédé que pour les programmes générés par Blockly 
          try {
            compileHH();
          } catch (err) {
            console.log("websocketServerSkini:compileHHEditionFile:compileHH:", err);
          }
          break;

        case "createSession":
          if (msgRecu.fileName === '') {
            console.log("WARN: No descriptor file name");
            break;
          }
          if (debug1) console.log("createSession:", sessionPath + msgRecu.fileName + ".csv");
          sessionFile = sessionPath + msgRecu.fileName + ".csv";
          // Initialise un fichier de parametres par défaut
          // C'est à dire en copie un dans un parametersFile temporaire
          try {
            fs.copyFileSync(defaultSession, sessionFile);
          } catch (err) {
            console.log("websocketServer: Pb ecriture: ", sessionFile, err);
          }
          try {
            DAW.loadDAWTable(sessionFile);
          } catch (err) {
            console.log("websocketServer: erreur de chargement:createSession: ", sessionFile, err);
          }

          ws.send(JSON.stringify({ type: "consoleBlocklySkini", text: "session loaded: " + sessionFile }));
          break;

        case "DAWPseudo":
          break;

        case "DAWSelectListClips":
          let listAllClips = new Array(); // Devient alors utilisable pour les controles dans DAW
          listAllClips = DAW.getListClips(msgRecu.niveaux);
          //if (debug) console.log("Web Socket Serveur: niveaux pour recherche ", msgRecu.niveaux, listClips);   
          ws.send(JSON.stringify({
            type: "listClips",
            listAllClips
          }));
          break;

        /*	    case "DAWStartClip":
                pseudo = msgRecu.pseudo;
                if (msgRecu.clipChoisi === undefined ) break; // Protection si pas de selection sur le client
                    if (debug) console.log("Web Socket Serveur: DAWStartClip: clipChoisi", msgRecu.clipChoisi, " pour ID: ", msgRecu.id);
              if (debug) console.log('Websocket serveur : DAWStartClip: demandeDeSonParPseudo : ', msgRecu.pseudo, msgRecu.clipChoisi[4]);
        
              // !! Attention pas à jour dans les paramètre de pushClipDAW
              var dureeAttente = pushClipDAW(msgRecu.clipChoisi);
              if ( dureeAttente === -1) {
                break; // On est dans un cas de note répétée
              }
        
                    var msg = {
                      type: "dureeAttente",
                      text: dureeAttente,
                      son: msgRecu.clipChoisi[3]
                    }
              // On communique au client le temps d'attente avant d'entendre.
                ws.send(JSON.stringify(msg));
        
              oscMidiLocal.sendProcessing( "/DAWPseudo", msgRecu.pseudo );
        
                // Informe tout le monde
              var messageBroadcast = msgRecu.pseudo + " a choisi " + msgRecu.clipChoisi[3];
              msg.type = "demandeDeSonParPseudo";
              msg.text = messageBroadcast;
              delete msg.listClips;
              serv.broadcast(JSON.stringify(msg));
        
              // Log la manip
              messageLog.note = msgRecu.clipChoisi[3];
              messageLog.id = ws.id;
              messageLog.pseudo = msgRecu.pseudo;
              messageLog.text = msg.text;
              logInfoSocket(messageLog);
              break;*/

        case "dureeDuTickHorlogeMidi": // Reçu de Processing chaque 24 pulses de l'horloge Midi (une noire)
          receivedTickFromSynchro();
          break;

        case "getDelayInstrument":
          if (debug) console.log("Web Socket Serveur: getDelayInstrument", msgRecu.clipChoisi, " pour ID: ", ws.id);
          let msgDelay = {
            type: "delaiInstrument"
          }

          if (msgRecu.clipChoisi === undefined) {
            msgDelay.text = -1;
            msgDelay.son = "pattern undefined";
            ws.send(JSON.stringify(msgDelay));
            break;
          } else {
            let dureeAttente = DAW.getDelayEventDAW(msgRecu.clipChoisi[5]);
            if (dureeAttente === -1) {
              break; // On est dans un cas de note répétée
            }
            msgDelay.text = dureeAttente;
          }
          // On communique au client le délai avant d'entendre.
          msgDelay.son = msgRecu.clipChoisi[3];
          ws.send(JSON.stringify(msgDelay));
          break;

        case "getGroupesClientLength":
          var longueurs = groupesClientSon.getGroupesClientLength();

          if (debug) console.log("websocketserver: getGroupesClientLength: ", longueurs);
          ws.send(JSON.stringify({ type: "groupesClientLength", longueurs }));

          break;

        case "getNombreDePatternsPossibleEnListe": // Pour l'initialisation de memorySortable
          let nombreDePatternsPossible = groupesClientSon.getNombreDePatternsPossibleEnListe();
          ws.send(JSON.stringify({
            type: "nombreDePatternsPossibleEnListe",
            nombreDePatternsPossible: nombreDePatternsPossible
          }));
          break;

        case "getPatternGroups":
          // It happends when calling this function before loading a piece
          if (par === undefined) break;

          if (DAWStatus !== undefined) {
            ws.send(JSON.stringify({
              type: "setPatternGroups",
              value: par.groupesDesSons
            }));
          } else {
            if (warnings) console.log("WARN: websocketserver: getPatternGroups: DAWStatus not yet defined");
          }
          break;

        case "loadBlocks":
          //
          // Il manque ici un ménage de ce qui peut se trouver déjà chargé !!!
          //
          if (msgRecu.fileName === '') {
            console.log("WARN: No orchestration");
            break;
          }

          let orchestrationFile = piecePath + msgRecu.fileName;

          try {
            if (fs.existsSync(orchestrationFile)) {
              let extension = orchestrationFile.slice(-4);
              if (extension !== ".xml") {
                console.log("ERR: Not an xml file:", orchestrationFile);
                ws.send(JSON.stringify({
                  type: "consoleBlocklySkini",
                  text: "Not an XML file " + orchestrationFile
                }));
                break;
              }
            } else {
              console.log("ERR: No orchestration file:", orchestrationFile);
              ws.send(JSON.stringify({
                type: "consoleBlocklySkini",
                text: "No orchestration file " + orchestrationFile
              }));
              break;
            }
          } catch (err) {
            console.log("ERR: No orchestration file:", orchestrationFile, err);
            ws.send(JSON.stringify({
              type: "consoleBlocklySkini",
              text: "Error reading orchestration file " + orchestrationFile
            }));
            break;
          }

          fs.readFile(orchestrationFile, 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            if (debug1) console.log("INFO: loadBlocks: orchestrationFile:", orchestrationFile);
            ws.send(JSON.stringify({
              type: "blocksLoaded",
              data
            }));
          });

          // Chargement des paramètres
          // à partir du fichier de config de la pièce
          // qui a le même nom que le fichier d'orchestration avec un extension js 
          // au lieu de xml

          // Entre autre pour la mise à jour des parametres dans le browser
          parametersFileGlobal = msgRecu.fileName.slice(0, -4) + ".js";
          parametersFile = sessionPath + msgRecu.fileName;
          // Construction du nom à partir du fichier xml
          parametersFile = parametersFile.slice(0, -4) + ".js";
          loadParameters(parametersFile);
          break;

        case "loadHHFile":
          if (msgRecu.fileName === '') {
            console.log("WARN: No Hiphop file selected");
            break;
          }
          if (debug1) console.log("INFO: loadHHFile:", msgRecu.fileName);
          HipHopSrc = msgRecu.fileName;

          let extension = HipHopSrc.slice(-6);
          if (extension !== ".hh.js") {
            console.log("ERR: Not an HipHop js file:", HipHopSrc);
            ws.send(JSON.stringify({
              type: "alertBlocklySkini",
              text: "You try to load a not HipHop JavaScript file : " + HipHopSrc
            }));
          }
          
          // try {
          //   compileHH();
          // } catch (err) {
          //   console.log("websocketServerSkini:loadHHFile:catch:", err);
          // }

          // Chargement des paramètres
          // à partir du fichier de config de la pièce
          // qui a le même nom que le fichier d'orchestration avec un extension js 
          // au lieu de hh.js
          // Entre autre pour la mise à jour des parametres dans le browser
          parametersFileGlobal = msgRecu.fileName.slice(0, -6) + ".js";
          parametersFile = sessionPath + msgRecu.fileName;
          // Construction du nom à partir du fichier hh.js
          parametersFile = parametersFile.slice(0, -6) + ".js";
          loadParameters(parametersFile);
          break;

        case "loadSession": // Pour les descripteurs de clips
          if (msgRecu.fileName === '') {
            console.log("WARN: No descriptor selected");
            break;
          }

          if (debug1) console.log("INFO: loadSession:", sessionPath + msgRecu.fileName);
          sessionFile = sessionPath + msgRecu.fileName;

          try {
            if (fs.existsSync(sessionFile)) {
              let extension = sessionFile.slice(-4);
              if (extension !== ".csv") {
                console.log("ERR: Not an csv file:", sessionFile);
                ws.send(JSON.stringify({
                  type: "alertBlocklySkini",
                  text: "Descriptor not a CSV file " + sessionFile
                }));
                break;
              }
            } else {
              console.log("ERR: No session file:", sessionFile);
              ws.send(JSON.stringify({
                type: "alertBlocklySkini",
                text: "No session file " + sessionFile
              }));
              break;
            }
          } catch (err) {
            console.log("ERR: Pb Reading session file:", sessionFile, err);
            ws.send(JSON.stringify({
              type: "alertBlocklySkini",
              text: "Pb Reading session file " + sessionPath
            }));
            break;
          }

          try {
            DAW.loadDAWTable(sessionPath + msgRecu.fileName);
          } catch (err) {
            console.log("websocketServer: erreur de chargement:loadSession: ", sessionFile, err);
          }
          ws.send(JSON.stringify({
            type: "consoleBlocklySkini",
            text: "session loaded: " + msgRecu.fileName
          }));
          break;

        case "putInMatriceDesPossibles":
          if (debug) console.log("websocketserver:putInMatriceDesPossibles:", msgRecu);
          groupesClientSon.setInMatriceDesPossibles(msgRecu.clients, msgRecu.sons, msgRecu.status);   // groupe de clients, n° du groupe de sons, booleen
          groupeName = groupesClientSon.getNameGroupeSons(msgRecu.sons);

          if (debug) groupesClientSon.displayMatriceDesPossibles();

          serv.broadcast(JSON.stringify({
            type: "groupeClientStatus",
            groupeClient: msgRecu.clients, // Pour identifier le groupe de clients
            groupeName,
            status: msgRecu.status
          }));
          break;

        case "ResetMatriceDesPossibles":
          if (debug1) console.log("websocketserver: ResetMatriceDesPossibles");
          groupesClientSon.resetMatriceDesPossibles();
          groupeName = "";
          serv.broadcast(JSON.stringify({
            type: "groupeClientStatus",
            groupeClient: 255,
            groupeName,
            status: false
          }));
          break;

        case "saveBlocklyGeneratedFile":
          if (msgRecu.fileName === '') {
            console.log("WARN: No Orchestration");
            break;
          }

          // Si on crée une orchestration à partir de rien le fichier de paramètre n'existe pas
          // On en crée un par défaut.
          parametersFileGlobal = msgRecu.fileName + ".js";
          try {
            if (!fs.existsSync(sessionPath + parametersFileGlobal)) {
              console.log("ERR: No parameter file:", parametersFileGlobal);
              ws.send(JSON.stringify({
                type: "alertBlocklySkini",
                text: "The parameter file " + parametersFileGlobal + " is created, don't run the program before modifying it."
              }));
              // Initialise un fichier de parametres par défaut
              try {
                fs.copyFileSync(origine, sessionPath + parametersFileGlobal);
                // On recharge les nouveaux paramètres avant la compilation.
                // Attention decache n'utilise pas le même path que parametersFile
                decacheParameters = "../" + sessionPath + parametersFileGlobal;
                decache(decacheParameters);
                par = require(decacheParameters);
                reloadParameters(par);
              } catch (err) {
                console.log("websocketServer: Pb ecriture: ", parametersFileGlobal, err.toString());
                break;
              }
            } else {
              if (debug) console.log("websocketserveur.js: saveBlocklyGeneratedFile: si OK:", par.groupesDesSons);
            }
          } catch (err) {
            console.log("ERR: Pb creating parameter file:", parametersFileGlobal, err.toString());
            ws.send(JSON.stringify({
              type: "alertBlocklySkini",
              text: "Pb creating parameter file " + parametersFileGlobal
            }));
            break;
          }

          // Ecrit le programme HH pour compilation
          fs.writeFile(generatedDir + defaultOrchestrationName, msgRecu.text, function (err) {
            if (err) {
              ws.send(JSON.stringify({
                type: "alertBlocklySkini",
                text: err.toString()
              }));
              return console.log(err);
            }
            if (debug1) console.log("INFO: websocketServer:", generatedDir + defaultOrchestrationName, " written");
          });

          // Ecrit le fichier XML Blockly
          fs.writeFile(piecePath + msgRecu.fileName + ".xml", msgRecu.xmlBlockly, function (err) {
            if (err) {
              return console.log(err.toString());
            }
            console.log("INFO: websocketServer:", msgRecu.fileName + ".xml", " written");
            ws.send(JSON.stringify({
              type: "consoleBlocklySkini",
              text: msgRecu.fileName + ".xml written"
            }));
            // Compile l'orchestration
            try {
              compileHH();
            } catch (err) {
              console.log("websocketServerSkini:saveBlocklyGeneratedFile:catch:", err.toString());
            }
          });
          break;

        case "saveSessionAs":
          if (debug1) console.log("save descriptors as: ", msgRecu.fileName);
          try {
            fs.copyFileSync(sessionFile, sessionPath + msgRecu.fileName);
          } catch (err) {
            console.log("websocketServer: Pb ecriture save descriptors as: ", msgRecu.fileName, err);
          }
          break;

        case "selectAllClips":
          var listClips = DAW.getAllClips(msgRecu.groupe, groupesClientSon.matriceDesPossibles);
          if (listClips !== -1) {
            if (debug) console.log("Web Socket Serveur: selectAllClips for id:", ws.id, "groupe:", msgRecu.groupe, " premier pattern:", listClips[0]);
            ws.send(JSON.stringify({
              type: "listClips",
              listClips
            }));
          }
          break;

        case "sendOSC":
          oscMidiLocal.sendOSCRasp(msgRecu.message, msgRecu.value1,
            par.raspOSCPort, msgRecu.IpAddress);
          break;

        case "sendPatternSequence":
          var patternSequence = msgRecu.patternSequence;
          if (debug) console.log("websocketserver: reçu : sendPatternSequence", patternSequence, msgRecu.pseudo);

          // Pour définir la façon dont sera calculé le score pour cette séquence de patterns
          computeScorePolicy = groupesClientSon.getComputeScorePolicy();
          computeScoreClass = groupesClientSon.getComputeScoreClass();
          if (debug) console.log("websocketserver: reçu : sendPatternSequence: computeScorePolicy, computeScoreClass:", computeScorePolicy, computeScoreClass);

          let maPreSequence = compScore.getPreSequence(msgRecu.pseudo, clientsEnCours); //Une liste d'index (notes Skini midi)
          if (debug) console.log("websocketserver: reçu : sendPatternSequence", patternSequence, msgRecu.pseudo, maPreSequence);

          let monScore = compScore.evaluateSequenceOfPatterns(patternSequence, maPreSequence, computeScorePolicy, computeScoreClass);

          // Met à jour la mémorisation des listes des index de pattern associée au pseudo pour
          // le calcul du score.
          compScore.setPreSequence(msgRecu.pseudo, patternSequence, clientsEnCours);

          //Mise à jour du score total en fonction du pseudo
          let scoreTotal = compScore.updateScore(msgRecu.pseudo, monScore, clientsEnCours);

          for (let i = 0; i < patternSequence.length; i++) {
            let pattern = DAW.getPatternFromNote(patternSequence[i]);
            if (pattern === undefined) {
              if (warnings) console.log("WARN: websocketserver: sendPatternSequence: pattern undefined");
              ws.send(JSON.stringify({
                type: "patternSequenceAck",
                value: false
              }));
            }
            if (debug) console.log("websocketserver: sendPatternSequence: pattern: ", patternSequence[i], pattern);
            playPattern(msgRecu.pseudo, msgRecu.groupe, pattern, msgRecu.idClient);
          }

          // On a besoin d'un acknowledge car on pourrait perdre des commandes du client (?? en TCP)
          // On envoie le score pour la séquence choisie
          ws.send(JSON.stringify({
            type: "patternSequenceAck",
            score: scoreTotal,
            value: true
          }));
          // On passe par groupeClientSon pour informer l'orchestration
          // Il n'y a pas de lien depuis l'orchestration vers websocketServer.js
          // (Il y en a dans l'autre sens via des react())
          groupesClientSon.setClientsEncours(clientsEnCours);
          break;

        case "setAllMatriceDesPossibles":
          if (debug1) console.log("websocketserver: setAllMatriceDesPossibles");
          groupesClientSon.setMatriceDesPossibles();
          groupeName = "";
          serv.broadcast(JSON.stringify({
            type: "groupeClientStatus",
            groupeClient: 255,
            groupeName,
            status: true
          }));
          break;

        // DAWON est le SIGNAL d'activation ou désactivation de l'orchestration
        // DAWStatus est une VARIABLE qui permet de savoir quelle est l'orchestration choisie
        // (Dans cette version on n'utilise qu'une seule orchestration
        // mais dans une première version DAWStatus pouvait avoir des valeurs de 1 à 3.)
        // DAWStatus = 0 signifie pas d'orchestration en cours.
        case "setDAWON":
          // msgRecu.value > 0 => DAW Active
          DAWStatus = msgRecu.value;
          if (DAWTableReady) {
            if (debug) console.log("websocketServer:setDAWON:", DAWStatus);
            DAW.cleanQueues();
            serv.broadcast(JSON.stringify({
              type: "DAWStatus",
              value: msgRecu.value
            }));
            initMatriceDesPossibles(DAWStatus);
            // Pour être en phase avec la création du pad controleur
            groupesClientSon.resetMatriceDesPossibles();
          } else {
            if (warnings) console.log("WARNING: Table des commandes DAW pas encore chargée: ", DAWStatus);
            ws.send(JSON.stringify({
              type: "DAWTableNotReady",
              text: "Table des commandes DAW pas encore chargée"
            }));
          }
          break;

        case "startAutomate": // Lance l'automate orchestrateur de la matrice des possibles
          if (par.timer !== undefined) {
            timerSynchro = par.timer;
          }

          if (DAWTableReady) {
            if (debug1) console.log("INFO: webSocketServeur:startAutomate: DAWstatus:", DAWStatus);
            reactAutomatePossible({ start: undefined });

            // S'il n'y a pas de synchro Midi ni Link on lance un worker
            if (!par.synchoOnMidiClock && !par.synchroLink && par.synchroSkini) {
              //setMonTimer(timerSynchro); // Pour un timer dans le thread principal, pas utile avec les workers
              if (debug1) console.log("websocketserver: startAutomate:worker synchro");
              workerSynchroInit('./serveur/workerSynchro.mjs', timerSynchro); // Avec un worker
            }

            if (par.sensorOSC) {
              if (debug1) console.log("INFO: webSocketServeur: With Interface Z sensors");
              workerInterfaceZInit('./serveur/workerInterfaceZ.mjs',
                ipConfig.serverIPAddress,
                ipConfig.interfaceZIPaddress,
                ipConfig.portOSCFromInterfaceZData,
                ipConfig.portOSCFromInterfaceZMidi,
                ipConfig.portOSCFromInterfaceZMiniWi,
                ipConfig.portOSCToInterfaceZ,
                par.tempoSensorsInit,
                par.sensorsSensibilities);
            } else {
              if (debug) console.log("INFO: webSocketServeur: stopInterfaceZ", workerInterfaceZ);
              if (workerInterfaceZ !== undefined) {
                workerInterfaceZ.postMessage(["stopInterfaceZ"]);
              }
            }
          }

          compScore.resetClientEnCours(clientsEnCours);
          groupesClientSon.setClientsEncours(clientsEnCours);

          // Sinon n'est envoyé qu'au onopen de la Socket
          // nécessaire pour les couleurs sur les clients
          serv.broadcast(JSON.stringify({
            type: "setPatternGroups",
            value: par.groupesDesSons
          }));
          // Au cas où le client serait connecté avant le début de l'orchestration.
          if (debug) console.log("Web Socket Server: startAutomate DAWON:", DAWStatus);
          ws.send(JSON.stringify({
            type: "DAWON",
            value: DAWStatus
          }));
          break;

        case "startByMidiClock":
          //compteurDivisionMesure = 0; // Remise à zero de la position dans le motif
          break;

        case "startSpectateur": // On récupère l'ID du client
          // On autorise la configuration des patterns même sans piece chargée
          if (msgRecu.text === "configurateur") {
            if (debug1) console.log("INFO: webSocketServeur: startSpectateur: un configurateur connecté", msgRecu.id);
            ws.send(JSON.stringify({
              type: "skiniParametres",
              descriptors: DAW.getSession(),
              value: par
            }));
          }

          if (par === undefined) {
            console.log("WARN: A client try to connect but no piece launched");
            break;
          }

          ws.id = msgRecu.id;
          if (debug) console.log("INFO: websocketserbeur: startSpectateur: ", msgRecu.id);

          // On ne permet donc qu'un seul controleur.
          // Attention: La connexion d'un deuxième contrôleur, fait perdre la première et réinitialise la matrice des possible.
          if (msgRecu.text === "controleur") {
            if (debug1) console.log("INFO: webSocketServeur: startSpectateur: un controleur connecté");
            socketControleur = ws;
            groupesClientSon.setSocketControleur(ws);
            initMatriceDesPossibles(DAWStatus);
            ws.send(JSON.stringify({
              type: "skiniParametres",
              value: par
            }));
            break;
          }

          if (msgRecu.text === "pieceParameters") {
            if (debug1) console.log("INFO: webSocketServeur: startSpectateur: Parametre connecté", msgRecu.id);
            ws.send(JSON.stringify({
              type: "skiniParametres",
              value: par
            }));
          }

          if (msgRecu.text === "clientListe") {
            if (debug1) console.log("INFO: webSocketServeur: startSpectateur: un clientListe connecté", msgRecu.id);
            ws.send(JSON.stringify({
              type: "skiniParametres",
              value: par
            }));
          }

          if (msgRecu.text === "simulateur") {
            if (par.simulatorInAseperateGroup) {
              // Assignation d'un groupe au client
              ws.send(JSON.stringify({
                type: "groupe",
                noDeGroupe: par.nbeDeGroupesClients - 1
              }));
              groupesClientSon.putIdInGroupClient(ws.id, par.nbeDeGroupesClients - 1);

              // Pour dire à l'ouverture au simulateur si on est ou pas dans une scène où DAW est actif.
              if (debug1) console.log("INFO: Web Socket Server: startSpectateur: simulateur: DAWON:", DAWStatus);
              ws.send(JSON.stringify({
                type: "DAWON",
                value: DAWStatus
              }));
              break;
            }
          }

          if (debug) console.log("websocket serveur: startSpectateur: ", ws.id, "dans groupe:", groupeEncours, msgRecu, clientsEnCours);

          // Assignation d'un groupe au client
          ws.send(JSON.stringify({
            type: "groupe",
            noDeGroupe: groupeEncours
          }));
          groupesClientSon.putIdInGroupClient(ws.id, groupeEncours);

          if (debug) console.log("websocket serveur: startSpectateur: groupesClientSon:", groupesClientSon.getGroupesClient());

          // Pour une distribution équilibrée entre les groupes
          // Si on souhaite avoir le simulateur sur un groupe non distribué à l'audience,
          // dans le fichier de configuration on met simulatorInAseperateGroup = true;
          // Ceci réserve le dernier groupe Client pour le simulateur puisque groupeEnCours n'aura jamais
          // la valeur maximale nbeDeGroupesClients
          if (par.nbeDeGroupesClients === 1 && par.simulatorInAseperateGroup) {
            if (warnings) console.log("WARN: ATENTION PAS DE GROUPE ASSIGNE A L'AUDIENCE !");
          }

          groupeEncours++;
          if (par.simulatorInAseperateGroup) {
            groupeEncours %= par.nbeDeGroupesClients - 1;
          }
          else {
            groupeEncours %= par.nbeDeGroupesClients;
          }
          // Pour dire à l'ouverture au client si on est ou pas dans une scène où DAW est actif.
          if (debug) console.log("Web Socket Server: startSpectateur: emission DAWStatus:", DAWStatus);
          ws.send(JSON.stringify({
            type: "DAWStatus",
            value: DAWStatus
          }));
          break;

        case "startSimulator":
          if (debug) console.log("Web Socket Server: start Simulator");
          childSimulator = fork("./client/simulateurListe/simulateurFork.mjs");
          childSimulator.send({ type: "START_SIMULATOR" });
          updateSimulatorParameters(par);
          break;

        case "stopAutomate":
          if (DAWTableReady) {
            //if (setTimer !== undefined && !par.synchoOnMidiClock) clearInterval(setTimer);
            reactAutomatePossible({ halt: undefined });
            DAWStatus = 0;
            serv.broadcast(JSON.stringify({
              type: "DAWStatus",
              value: false
            }));
          }
          break;

        case "stopSimulator":
          if (debug) console.log("INFO: Web Socket Server: stop Simulator");
          childSimulator.send({ type: "STOP_SIMULATOR" });
          break;

        case "system": // Message converti en signal pour l'automate central
          if (debug) console.log("Web Socket Server: received message : [%s]",
            msgRecu.text, " from Client ID:", ws.id);
          machineServeur.inputAndReact(msgRecu.text, ws.id); // ENVOI DU SIGNAL VERS HIPHOP
          break;

        case "updateSession":
          if (sessionFile !== undefined) {
            if (debug) console.log("updateSession pour:", sessionFile, ": ", arrayToCSV(msgRecu.data));
            // Ecrire le fichier
            fs.writeFile(sessionFile, arrayToCSV(msgRecu.data), function (err) {
              if (err) {
                ws.send(JSON.stringify({
                  type: "alertBlocklySkini",
                  text: err.toString()
                }));
                return console.log("ERR: websocketserver.js: updateSession: ", err);
              } else {
                // Le recharger dans DAW
                try {
                  DAW.loadDAWTable(sessionFile);
                } catch (err) {
                  console.log("websocketServer: erreur de chargement:createSession: ", sessionFile, err);
                }
                ws.send(JSON.stringify({
                  type: "consoleBlocklySkini",
                  text: "session loaded: " + sessionFile
                }));
              }
            });
          } else {
            console.log("WARN: No descriptor file specified");
            break;
          }
          break;

        case "updateParameters":
          // Save the previous parameters
          fs.copyFile(sessionPath + parametersFileGlobal, "./backup/" + parametersFileGlobal + ".back", function (err) {
            if (err) {
              return console.log(err);
            }
            if (debug1) console.log("INFO: websocketServer: updateParameters", parametersFileGlobal + ".back written");
          });

          if (debug1) console.log("INFO: websocketserveur: Update of the piece parameters", msgRecu.data, "in", sessionPath + parametersFileGlobal);
          if (parametersFileGlobal !== undefined) {
            saveParam.saveParameters(sessionPath + parametersFileGlobal, msgRecu.data);
            reloadParameters(msgRecu.data);
          }

          // On recrée le fichier pour son utilisation par l'orchestration
          // avant recompilation.
          // let destinationUpdate = "./serveur/skiniParametres.js";
          // try {
          //   fs.copyFileSync(sessionPath + parametersFileGlobal, destinationUpdate);
          // } catch (err) {
          //   console.log("ERR: websocketserver: destinationUpdate : Pb ecriture", destinationUpdate, err);
          // }

          // Recompile the orchestration pour intégrer les modifications
          // des paramétres de groupes et tanks.
          try {
            compileHH();
          } catch (err) {
            console.log("websocketServerSkini:updateParameters:catch:", err);
          }
          break;

        default: console.log("INFO: Web Socket Serveur: Type de message inconnu : ", msgRecu);
      }
    });
  });

  /****** FIN WEBSOCKET ************/
}

function logInfoSocket(message) {
  fs.appendFile('skinilog.json', JSON.stringify(message) + "\n", "UTF-8", function (err) {
    if (err) {
      console.error(err);
      throw err;
    }
  });
}

function getDateTime() {
  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return day + ":" + month + ":" + year + ":" + hour + ":" + min + ":" + sec;
}
