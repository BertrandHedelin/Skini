/**
 * @fileOverview Websocket management. This is the main part of Skini for messages
 * management and control. Something like a main switch.
 * Most of the API and functions here are local.
 * @author Bertrand Hédelin  © Copyright 2017-2022, B. Petit-Hédelin
 * @version 1.3
 */
'use strict'

var par;
var oscMidiLocal;
var DAW;
var groupesClientSon;
var midimix;
var sessionFile; // Pour le chemin complet de la session en cours (descripteur en ".csv")
var parametersFileGlobal;

// Attention en dur car le chemin est utilisé ailleurs, dans groupClientsSons.js
// pour orchestrationHH.js
var generatedDir = "./myReact/";

// Répertoires par défaut, ils sont à fixer dans le fichier de configuration de la piece.
// Où se trouvent les fichiers XML d'orchestration
// On ne peut pas donner de chemin absolu dans un browser.
// Ce sont les fichiers csv "descripteurs" des patterns
// et les fichiers de configuration ".js"
var sessionPath = "./pieces/";

var piecePath = "./pieces/";

/**
 * To load some modules.
 * Used only at Skini launch.
 * @param {Object} midimix reference
 */
function setParameters(midimixage) {
  midimix = midimixage;
  oscMidiLocal = require('./OSCandMidi');
  DAW = require('./controleDAW');
  groupesClientSon = require('./autocontroleur/groupeClientsSons');
  groupesClientSon.setMidimix(midimix);
  initMidiPort();
  startWebSocketServer();
}
exports.setParameters = setParameters;

/**
 * In order to reload new parametrers in the different modules during a Skini session.
 * @param {object} param 
 */
function reloadParameters(param) {
  par = param;

  if (param.sessionPath !== undefined) {
    sessionPath = param.sessionPath;
  }
  if (param.piecePath !== undefined) {
    piecePath = param.piecePath;
  }

  oscMidiLocal.setParameters(param);
  DAW.setParameters(param);
  groupesClientSon.setParameters(param);
  midimix.setParameters(param);

  initMidiPort();
}

// const arrayToCSV = (arr, delimiter = ',') =>
//   arr
//     .map(v =>
//       v.map(x => (isNaN(x) ? `"${x.replace(/"/g, '')}"` : x)).join(delimiter)
//     )
//     .join('\n');

/**
 * Simple conversion from Array to csv
 * @param {Array} arr 
 * @param {String} delimiter 
 * @returns {String} csv
 */
const arrayToCSV = (arr, delimiter = ',') =>
  arr.map(v => v.join(delimiter)
  ).join('\n');

var fs = require("fs");
var oscMidiLocal = require('./OSCandMidi');
var ipConfig = require('./ipConfig');
var compScore = require('./computeScore');
var gameOSC = require('./gameOSC');
const decache = require('decache');
const { stringify } = require('querystring');
const { Worker } = require('worker_threads');
const saveParam = require('./saveParam.js');

var defaultOrchestrationName = "orchestrationHH.js";

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

var tempsMesure = 4;    		// Partie haute de la mesure, nombre de temps dans la mesure
var divisionMesure = noireR; 	// Partie basse de la mesure
var nbeDeMesures = 1;
var tempo = 60; 				// à la minute
var canalMidi = 1;
var dureeDuTick = ((60 / tempo) / divisionMesure) * 1000; // Exprimé ici en millisecondes

var previousTime = 0;
var currentTime = 0;
var timeToPlay = 0;
var previousTimeToPlay = 0;
var defautDeLatence;

var debug = false;
var debug1 = true;
var warnings = false;
var timerSynchro;

// Automate des possibles
var DAWStatus = 0; // 0 inactif, sinon actif (originellement pour distinguer des orchestrations, distinction pas utile à présent)
var setTimer;
var timerDivision = 4; // Default value for the number of pulses for a tick, can evolve during an orchestration
var offsetDivision = 0;
var compteurDivisionMesure = 0;
var nbeDeGroupesSons = 0;
var socketControleur;
var groupeName = "";
var automatePossibleMachine;

// Scoring pour les jeux
var computeScorePolicy = 0;
var computeScoreClass = 0;

// CONTROLEUR
var DAWTableReady = false; // Pour pouvoir vérifier que la pièce a bien été chargée.

var clientsEnCours = [];
var groupeEncours = 0;

var currentTimePrevMidi = 0;
var currentTimeMidi = 0;

/*************************************************
   INITIALISATION DU PORT MIDI OUT (si paramétré)
 **************************************************/
/**
 * Init MIDI OUT port if defined in the parameters
 */
function initMidiPort() {
  if (par !== undefined) {
    var directMidi = false;
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
  * @param {string} worker path
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
          reject(new Error(`Worker stopped with exit code:`, code));
        }
      });
    });
  }

  /**
  * Define the function in order to Broadcast to all clients.
  * @function
  * @memberof Websocketserver
  * @param {string} message
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
          return;
        }
      }
    });
  }

  // Pour les broadcasts depuis controle DAW, c'est la structure dans HOP que je garde.
  DAW.initBroadCastServer(serv);
  groupesClientSon.initBroadCastServer(serv);

  /**
   * In order to get the server used for broadcasting
   * @returns {Server} - return the server for Broadcasting
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
  exports.getBroadCastServer = getBroadCastServer;

  /************************************************************************************
    Fonction pour emission de signaux depuis Ableton vers l'automatePossibleMachine.
  *************************************************************************************/
  /**
   * Send a signal to the orchestration according to the skini note
   * @param  {number} noteSkini
   * @function
   * @memberof Websocketserver
   * @inner
   */
  function sendSignalFromDAW(noteSkini) {
    if (debug) console.log("websocketserver.js: sendSignalFromDAW:", noteSkini);
    var patternName = DAW.getPatternNameFromNote(noteSkini);
    if (debug1) console.log("websocketserver.js: sendSignalFromDAW:", noteSkini, patternName);
    if (patternName !== undefined) {
      reactAutomatePossible({ patternSignal: [noteSkini, patternName] });
    } else {
      if (warnings) console.log("WARN: webSocketServeur: sendSignalFromDAW:", noteSkini, patternName);
    }
  }
  exports.sendSignalFromDAW = sendSignalFromDAW;

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
  exports.sendSignalFromMIDI = sendSignalFromMIDI;

  /** 
   * Send a signal "halt" to the orchestration.
   * @memberof Websocketserver
   * @function
   * @inner
   * @param  {number} noteSkini
   */
  function sendSignalStopFromMIDI() {
    if (!reactAutomatePossible({ halt: undefined })) {
      if (warnings) console.log("WARN: webSocketServeur: sendSignalStopFromMIDI");
    }
  }
  exports.sendSignalStopFromMIDI = sendSignalStopFromMIDI;

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
  exports.sendSignalStartFromMIDI = sendSignalStartFromMIDI;

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
  exports.sendSignalFromMidiMix = sendSignalFromMidiMix;

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
    if (debug) console.log("websocketserver: sendOSCTick");
    receivedTickFromSynchro();
  }
  exports.sendOSCTick = sendOSCTick;

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
   * @returns {machine} - the HipHop machine
   */
  function getAutomatePossible() {
    if (automatePossibleMachine !== undefined) {
      return automatePossibleMachine;
    } else {
      console.log("ERR: websocketserverSini.js: getAutomatePossible: automatePossibleMachine undefined")
    }
  }
  exports.getAutomatePossible = getAutomatePossible;

  /**
   * React on the orchestration
   * @memberof Websocketserver
   * @param {*} signal 
   * @returns {boolean} true if no problem
   */
  function reactAutomatePossible(signal) {
    if (automatePossibleMachine !== undefined) {
      try {
        automatePossibleMachine.react(signal);
      } catch (err) {
        console.log("ERROR: webSocketServer.js: reactAutomatePossible: Error on react:", err.toString());

        var msg = {
          type: "alertBlocklySkini",
          text: err.toString()
        }
        serv.broadcast(JSON.stringify(msg));

        return false;
      }
      return true;
    } else {
      if (warnings) console.log("WARN: websocketserver: reactAutomatePossible: automate undefined");
      return false;
    }
  }

  if (debug) console.log("websocketserver:automatePossibleMachine: passé");

  // Pas au bon endroit, musicien pas en place dans cette version
  //if (par.avecMusicien !== undefined && par.decalageFIFOavecMusicien !== undefined) {
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
    groupesClientSon.setNbeDeGroupesSons(nbeDeGroupesSons);
    if (groupesClientSon.setGroupesSon(DAWState) == -1) {
      if (warnings) console.log("WARNING: websocketserveur:initMatriceDesPossibles: setGroupesSon: vide");
    }
    groupesClientSon.createMatriceDesPossibles();

    var mesReponse = {
      type: "setControlerPadSize",
      nbeDeGroupesClients: par.nbeDeGroupesClients,
      nbeDeGroupesSons: nbeDeGroupesSons
    }

    if (socketControleur !== undefined) {
      if (socketControleur.readyState == 1) {
        socketControleur.send(JSON.stringify(mesReponse));
      } else {
        console.log("ERR: websocketserveur:initMatriceDesPossibles:", socketControleur.readyState);
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
   * @param {number} syncho in ms
   */
  function setMonTimer(timer) {
    if (!par.synchoOnMidiClock) {
      setTimer = setInterval(function () {
        if (debug1) { var v0 = Date.now(); }
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
   * @param {number} length of the list of the client
   */
  function setPatternListLength(value) {
    if (debug1) console.log("websocketserver.js : setPatternListLength : value :", value);
  }
  exports.setPatternListLength = setPatternListLength;

  /*************************************************************************************
    WEB SOCKET MANAGEMENT
  **************************************************************************************/
  serv.on('connection', function (ws) {

    /*  	// Pas trés jolie... mais ça lance le mécanisme de lecture du buffer de commande midi.
    
        if (premiereConnexion) {
          playerBuffer = setInterval( function() { 
          nextEventInBuffer();
          }, resolutionDuBuffer );
          premiereConnexion = false;
      }
    */
    // Variables locales à la session websocket
    //var ws = event.value;

    var msg = {
      type: "message",
      text: "Server: Connection Websocket OK",
      value: 2,
    };

    var messageLog = {
      date: "",
      source: "websocketServerSkini.js",
      type: "log",
      note: "",
      pseudo: "",
      id: ""
    }

    // Pour informer que l'on est bien connecté
    if (debug1) console.log("INFO: Web Socket Server: connection established:");
    var msg = {
      type: "message",
      value: "Bienvenue chez Skini !"
    }
    ws.send(JSON.stringify(msg));

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
    var msgTempo = {
      type: "setConfigSequenceur",
      tempsMesure: tempsMesure,
      divisionMesure: divisionMesure,
      nbeDeMesures: nbeDeMesures,
      tempo: tempo,
      canalMidi: canalMidi,
      dureeDuTick: dureeDuTick
    }
    ws.send(JSON.stringify(msgTempo));

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
     * @param {array} pattern description according to the csv file.
     * @param {string} Hiphop signal
     * @param {number} user group (web client group)
     * @param {string} pseudo 
     * @param {number} monId
     * @returns {number} waiting time
     */
    function pushClipDAW(clip, signal, leGroupe, pseudo, monId) {
      var DAWNote = clip[0];
      var DAWChannel = Math.floor(DAWNote / 127) + 1;
      DAWNote = DAWNote % 127;
      if (DAWChannel > 15) {
        if (debug) console.log("Web Socket Server.js : pushNoteOnDAW: Nombre de canaux midi dépassé.");
        return;
      }
      var nom = clip[3];
      var DAWInstrument = clip[5];
      var typePattern = clip[7];
      var dureeClip = clip[10];
      var adresseIP = clip[11];
      var numeroBuffer = clip[12];
      var patternLevel = clip[13];

      var signalComplet = { [signal]: clip[3] }; // on ajouté le nom du pattern au signal
      var dureeAttente = DAW.pushEventDAW(par.busMidiDAW, DAWChannel, DAWInstrument,
        DAWNote, 125, monId, pseudo, dureeClip, nom,
        signalComplet, typePattern, adresseIP, numeroBuffer, patternLevel);

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

      var signal = groupesClientSon.getSignalFromGroup(pattern[9]) + "IN";
      if (debug) console.log("webSocketServeur: playPattern, signal reçu:", pattern, signal);

      var legroupe = groupe; // groupe d'utilisateur

      // Pour la gestion des messages qui ne sont pas des patterns, on utilise des patterns dont les
      // commandes MIDI sont négatives. Dans ce cas on émet des signaux sans faire appel au player de patterns
      // On appelle jamais pushClipAbleton avec une note négative issue de la config.
      if (pattern[0] < 0) {
        // Pour associer le nom du pattern au signal de groupe IN
        // C'est plus pour être cohérent que par besoin.
        reactAutomatePossible({ [signal]: pattern[3] });
        return;
      }

      var dureeAttente = pushClipDAW(pattern, signal, legroupe, unPseudo, monId);

      // DureeAttente est la somme des durées de la FIFO de l'instrument.
      if (dureeAttente === -1) {
        return; // On est dans un cas de note sans durée
      }

      // Conversion in real waiting time
      dureeAttente = Math.floor(dureeAttente * tempoTime / 1000);
      if (debug) console.log("Web Socket Serveur: abletonStartClip:dureeAttente", dureeAttente);
      // On communique au client le temps d'attente en sec. avant d'entendre.
      var msg = {
        type: "dureeAttente",
        text: dureeAttente,
        son: pattern[3]
      }
      ws.send(JSON.stringify(msg));

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
     * Compile the HipHop Programm.
     * @memberof Websocketserver
     * @function
     * @inner
     */
    function compileHH() {
      DAWTableReady = false;
      if (debug1) console.log("INFO: websocketServer: loadDAWTable OK:");

      try {
        automatePossibleMachine = groupesClientSon.makeOneAutomatePossibleMachine();
      } catch (err) {
        //console.log("ERR: websocketserver.js: pb makeOneAutomatePossibleMachine", err);
        console.log("\n-------------------------------------------------------------");
        console.log(`ATTENTION: 
Problem when compiling the Orchestration
maybe an hiphop compile Error`);
        console.log("-------------------------------------------------------------");

        var msg = {
          type: "consoleBlocklySkini",
          text: "See your console, pb on compilation"
        }
        serv.broadcast(JSON.stringify(msg));
        throw err;
        //return;
      }

      DAW.setAutomatePossible(automatePossibleMachine);
      console.log("INFO: websocketServer: loadDAWTable: table loaded\n");

      var msg = {
        type: "consoleBlocklySkini",
        text: "Orchestration loaded"
      }
      serv.broadcast(JSON.stringify(msg));

      // Pour l'emission des commandes OSC depuis l'orchestration vers un jeu
      if (par.gameOSCIn !== undefined) {
        gameOSC.setOrchestration(automatePossibleMachine);
        gameOSC.init();
      }

      try {
        //reactAutomatePossible( {DAWON: 1} ); // !!! en cours
      } catch (e) {
        console.log("websocketServerSkini:loadDAWTable:catch react:", e);
      }
      DAWTableReady = true;
    }

    /**
     * Process the websocket messages. The protocols are here.
     * @memberof Websocketserver
     * @function
     * @inner
     */
    ws.on('message', function (message) {
      if (debug) console.log('received: %s', message);

      var msgRecu = JSON.parse(message);
      var mixReaper;

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
          var msg = {
            type: "nbeDeSpectateurs",
            value: value
          }
          ws.send(JSON.stringify(msg));
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

        case "DAWPseudo":
          break;

        case "DAWSelectListClips":
          var listClips = new Array(); // Devient alors utilisable pour les controles dans DAW
          listClips = DAW.getListClips(msgRecu.niveaux);
          //if (debug) console.log("Web Socket Serveur: niveaux pour recherche ", msgRecu.niveaux, listClips);   
          var msg = {
            type: "listClips",
            listClips: listClips
          }
          ws.send(JSON.stringify(msg));
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
          var msg = {
            type: "delaiInstrument"
          }

          if (msgRecu.clipChoisi === undefined) {
            msg.text = -1;
            msg.son = "pattern undefined";
            ws.send(JSON.stringify(msg));
            break;
          } else {
            var dureeAttente = DAW.getDelayEventDAW(msgRecu.clipChoisi[5]);
            if (dureeAttente === -1) {
              break; // On est dans un cas de note répétée
            }
            msg.text = dureeAttente;
          }
          // On communique au client le délai avant d'entendre.
          msg.son = msgRecu.clipChoisi[3];
          ws.send(JSON.stringify(msg));
          break;

        case "getGroupesClientLength":
          var longueurs = groupesClientSon.getGroupesClientLength();

          if (debug) console.log("websocketserver: getGroupesClientLength: ", longueurs);
          var msg = {
            type: "groupesClientLength",
            longueurs: longueurs
          }
          ws.send(JSON.stringify(msg));
          break;

        case "getNombreDePatternsPossibleEnListe": // Pour l'initialisation de memorySortable
          var nombreDePatternsPossible = groupesClientSon.getNombreDePatternsPossibleEnListe();
          var mesReponse = {
            type: "nombreDePatternsPossibleEnListe",
            nombreDePatternsPossible: nombreDePatternsPossible
          }
          ws.send(JSON.stringify(mesReponse));
          break;

        case "getPatternGroups":
          // It happends when calling this function before loading a piece
          if (par === undefined) break;

          if (DAWStatus !== undefined) {
            var msg = {
              type: "setPatternGroups",
              value: par.groupesDesSons
            }
            ws.send(JSON.stringify(msg));
          } else {
            if (warnings) console.log("WARN: websocketserver: getPatternGroups: DAWStatus not yet defined");
          }
          break;

        case "loadDAWTable": // Piloté par le controleur, charge une config et les automates
          // Controle de l'existence de la table (déclaration du fichier csv) avant de la charger
          loadDAWTableFunc(msgRecu.value);
          break;

        case "loadBlocks":
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
                let msg = {
                  type: "consoleBlocklySkini",
                  text: "Not an XML file " + orchestrationFile
                }
                serv.broadcast(JSON.stringify(msg));
                break;
              }
            } else {
              console.log("ERR: No orchestration file:", orchestrationFile);
              let msg = {
                type: "consoleBlocklySkini",
                text: "No orchestration file " + orchestrationFile
              }
              serv.broadcast(JSON.stringify(msg));
              break;
            }
          } catch (err) {
            console.log("ERR: No orchestration file:", orchestrationFile, err);
            let msg = {
              type: "consoleBlocklySkini",
              text: "Error reading orchestration file " + orchestrationFile
            }
            serv.broadcast(JSON.stringify(msg));
            break;
          }

          fs.readFile(orchestrationFile, 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            if (debug1) console.log("loadBlocks:", orchestrationFile);
            var msg = {
              type: "blocksLoaded",
              data: data,
            }
            ws.send(JSON.stringify(msg));
          });

          // Essai de chargement des paramètres
          // à partir du fichier de config de la pièce
          // qui a le même nom que le fichier d'orchestration avec un extension js 
          // au lieu de xml

          // Pour ma mise à jour des parametres dans le browser
          parametersFileGlobal = msgRecu.fileName.slice(0, -4) + ".js";

          let parametersFile = sessionPath + msgRecu.fileName;
          parametersFile = parametersFile.slice(0, -4) + ".js";
          // Attention decache n'utilise pas le même path que parametersFile
          let decacheParameters = "../" + parametersFile;

          try {
            if (fs.existsSync(parametersFile)) {
              let extension = parametersFile.slice(-3);
              if (extension !== ".js") {
                console.log("ERR: Not an js file:", parametersFile);
                let msg = {
                  type: "alertBlocklySkini",
                  text: "Parameter not an JavaScript file " + parametersFile
                }
                serv.broadcast(JSON.stringify(msg));
                break;
              }
            } else {
              console.log("ERR: No parameter file:", parametersFile);
              let msg = {
                type: "alertBlocklySkini",
                text: "The parameter file " + parametersFile + " is not updated, don't run the program before modifying it."
              }
              serv.broadcast(JSON.stringify(msg));
              // Initialise un fichier de parametres par défaut
              // C'est à dire en copie un dans un parametersFile temporaire
              let origine = "./serveur/defaultSkiniParametres.js";
              try {
                fs.copyFileSync(origine, parametersFile);
              } catch (err) {
                console.log("websocketServer: Pb ecriture: ", parametersFile, err);
              }
              break;
            }
          } catch (err) {
            console.log("ERR: Pb Reading parameter file:", parametersFile, err);
            let msg = {
              type: "alertBlocklySkini",
              text: "Pb Reading parameter file " + parametersFile
            }
            serv.broadcast(JSON.stringify(msg));
            break;
          }

          decache(decacheParameters);

          // Le fait de faire un require ici, annule la référence de par dans 
          // les autres modules. Il faut faire un reload dans tous les modules.
          par = require(decacheParameters);
          reloadParameters(par);

          // On crée le fichier pour son utilisation par l'orchestration.
          let destination = "./serveur/skiniParametres.js";
          try {
            fs.copyFileSync(sessionPath + msgRecu.fileName.slice(0, -4) + ".js", destination);
          } catch (err) {
            console.log("Pb ecriture", destination, err);
          }

          // On initialise les interfaces Midi ou via OSC et Synchro quand les paramètres sont chargés.
          midimix.midimix(automatePossibleMachine);

          msg = {
            type: "consoleBlocklySkini",
            text: "Orchestration loaded"
          }
          serv.broadcast(JSON.stringify(msg));
          break;

        case "loadSession":
          if (msgRecu.fileName === '') {
            console.log("WARN: No descriptor selected");
            break;
          }

          if (debug1) console.log("loadSession:", sessionPath + msgRecu.fileName);
          sessionFile = sessionPath + msgRecu.fileName;

          try {
            if (fs.existsSync(sessionFile)) {
              let extension = sessionFile.slice(-4);
              if (extension !== ".csv") {
                console.log("ERR: Not an csv file:", sessionFile);
                let msg = {
                  type: "alertBlocklySkini",
                  text: "Descriptor not an csv file " + sessionFile
                }
                serv.broadcast(JSON.stringify(msg));
                break;
              }
            } else {
              console.log("ERR: No session file:", sessionFile);
              let msg = {
                type: "alertBlocklySkini",
                text: "No session file " + sessionFile
              }
              serv.broadcast(JSON.stringify(msg));
              break;
            }
          } catch (err) {
            console.log("ERR: Pb Reading session file:", sessionFile, err);
            let msg = {
              type: "alertBlocklySkini",
              text: "Pb Reading session file " + sessionPath
            }
            serv.broadcast(JSON.stringify(msg));
            break;
          }

          DAW.loadDAWTable(sessionPath + msgRecu.fileName);

          var mesReponse = {
            type: "consoleBlocklySkini",
            text: "session loaded: " + msgRecu.fileName
          }
          ws.send(JSON.stringify(mesReponse));
          break;

        case "putInMatriceDesPossibles":
          if (debug) console.log("websocketserver:putInMatriceDesPossibles:", msgRecu);
          groupesClientSon.setInMatriceDesPossibles(msgRecu.clients, msgRecu.sons, msgRecu.status);   // groupe de clients, n° du groupe de sons, booleen
          groupeName = groupesClientSon.getNameGroupeSons(msgRecu.sons);

          if (debug) groupesClientSon.displayMatriceDesPossibles();

          var msg = {
            type: "groupeClientStatus",
            groupeClient: msgRecu.clients, // Pour indentifier le groupe de clients
            groupeName: groupeName,
            status: msgRecu.status
          }
          serv.broadcast(JSON.stringify(msg));
          //hop.broadcast('groupeClientStatus',JSON.stringify(msg));
          break;

        case "ResetMatriceDesPossibles":
          if (debug1) console.log("websocketserver: ResetMatriceDesPossibles");
          groupesClientSon.resetMatriceDesPossibles();
          groupeName = "";
          var msg = {
            type: "groupeClientStatus",
            groupeClient: 255,
            groupeName: groupeName,
            status: false
          }
          serv.broadcast(JSON.stringify(msg));
          //hop.broadcast('groupeClientStatus',JSON.stringify(mesReponse));
          break;

        case "saveBlocklyGeneratedFile":
          if (msgRecu.fileName === '') {
            console.log("WARN: No Orchestration");
            break;
          }

          if (debug) console.log("saveBlocklyGeneratedFile: fileName", msgRecu.fileName, "\n--------------------");
          if (debug) console.log(msgRecu.text);

          // Ecrit le programme HH pour compilation
          fs.writeFile(generatedDir + defaultOrchestrationName, msgRecu.text, function (err) {
            if (err) {
              var msg = {
                type: "alertBlocklySkini",
                text: err.toString()
              }
              serv.broadcast(JSON.stringify(msg));
              return console.log(err);
            }
            if (debug1) console.log("INFO: websocketServer:", generatedDir + defaultOrchestrationName, " written");
          });

          // Ecrit le fichier XML Blockly
          fs.writeFile(piecePath + msgRecu.fileName + ".xml", msgRecu.xmlBlockly, function (err) {
            if (err) {
              return console.log(err);
            }
            console.log("INFO: websocketServer:", msgRecu.fileName + ".xml", " written");
            var msg = {
              type: "consoleBlocklySkini",
              text: msgRecu.fileName + ".xml written"
            }
            serv.broadcast(JSON.stringify(msg));

            // Compile the orchestration
            try {
              compileHH();
            } catch (err) {
              console.log("websocketServerSkini:saveBlocklyGeneratedFile:catch:", err);
            }
          });
          break;

        case "selectAllClips":
          var listClips = DAW.getAllClips(msgRecu.groupe, groupesClientSon.matriceDesPossibles);
          if (listClips !== -1) {
            if (debug) console.log("Web Socket Serveur: selectAllClips:", ws.id, "groupe:", msgRecu.groupe, listClips[0]);
            var msg = {
              type: "listClips",
              listClips: listClips
            }
            ws.send(JSON.stringify(msg));
          }
          break;

        case "sendOSC":
          oscMidiLocal.sendOSCRasp(msgRecu.message, msgRecu.value1,
            par.raspOSCPort, msgRecu.IpAddress);
          break;

        case "sendPatternSequence":
          var patternSequence = msgRecu.patternSequence;

          // Pour définir la façon dont sera calculé le score pour cette séquence de patterns
          computeScorePolicy = groupesClientSon.getComputeScorePolicy();
          computeScoreClass = groupesClientSon.getComputeScoreClass();
          if (debug) console.log("websocketserver: reçu : sendPatternSequence: computeScorePolicy, computeScoreClass:", computeScorePolicy, computeScoreClass);

          var maPreSequence = compScore.getPreSequence(msgRecu.pseudo, clientsEnCours); //Une liste d'index (notes Skini midi)
          if (debug) console.log("websocketserver: reçu : sendPatternSequence", patternSequence, msgRecu.pseudo, maPreSequence);

          var monScore = compScore.evaluateSequenceOfPatterns(patternSequence, maPreSequence, computeScorePolicy, computeScoreClass);

          // Met à jour la mémorisation des listes des index de pattern associée au pseudo pour
          // le calcul du score.
          compScore.setPreSequence(msgRecu.pseudo, patternSequence, clientsEnCours);

          //Mise à jour du score total en fonction du pseudo
          var scoreTotal = compScore.updateScore(msgRecu.pseudo, monScore, clientsEnCours);

          for (var i = 0; i < patternSequence.length; i++) {
            var pattern = DAW.getPatternFromNote(patternSequence[i]);
            if (pattern === undefined) {
              if (warnings) console.log("WARN: websocketserver: sendPatternSequence: pattern undefined");
              var msg = {
                type: "patternSequenceAck",
                value: false
              }
              ws.send(JSON.stringify(msg));
            }
            if (debug) console.log("websocketserver: sendPatternSequence: pattern: ", patternSequence[i], pattern);
            playPattern(msgRecu.pseudo, msgRecu.groupe, pattern, msgRecu.idClient);
          }

          // On a besoin d'un acknowledge car on pourrait perdre des commandes du client (?? en TCP)
          // On envoie le score pour la séquence choisie
          var msg = {
            type: "patternSequenceAck",
            score: scoreTotal,
            value: true
          }
          ws.send(JSON.stringify(msg));

          // On passe par groupeClientSon pour informer l'orchestration
          // Il n'y a pas de lien depuis l'orchestration vers websocketServer.js
          // (Il y en a dans l'autre sens via des react())
          groupesClientSon.setClientsEncours(clientsEnCours);
          break;

        case "setAllMatriceDesPossibles":
          if (debug1) console.log("websocketserver: setAllMatriceDesPossibles");
          groupesClientSon.setMatriceDesPossibles();
          groupeName = "";
          var msg = {
            type: "groupeClientStatus",
            groupeClient: 255,
            groupeName: groupeName,
            status: true
          }
          serv.broadcast(JSON.stringify(msg));
          break;

        // DAWON est le signal d'activation ou désactivation de l'orchestration
        // DAWStatus est une variable qui permet de savoir quelle était l'orchestration choisie
        // danc cette version on n'utilise qu'une seule orchestration. DAWStatus pouvait avoir des valeur de 1 à 3.
        // Il y a redondance entre les deux puisque DAWStatus = 0 signifie pas d'orchestration en cours.
        case "setDAWON":
          // msgRecu.value > 0 => DAW Active
          DAWStatus = msgRecu.value;
          if (DAWTableReady) {
            if (debug) console.log("websocketServer:setDAWON:", DAWStatus);

            DAW.cleanQueues();

            var msg = {
              type: "DAWStatus",
              value: msgRecu.value
            }
            serv.broadcast(JSON.stringify(msg));
            initMatriceDesPossibles(DAWStatus);
            // Pour être en phase avec la création du pad controleur
            groupesClientSon.resetMatriceDesPossibles();
          } else {
            if (warnings) console.log("WARNING: Table des commandes DAW pas encore chargée: ", DAWStatus);
            var msg = {
              type: "DAWTableNotReady",
              text: "Table des commandes DAW pas encore chargée"
            }
            ws.send(JSON.stringify(msg));
          }
          break;

        case "startAutomate": // Lance l'automate orchestrateur de la matrice des possibles
          if (par.timer !== undefined) {
            timerSynchro = par.timer;
          }

          if (DAWTableReady) {
            if (debug) console.log("INFO: webSocketServeur:startAutomate: DAWstatus:", DAWStatus);
            reactAutomatePossible({ start: undefined });

            // S'il n'y a pas de synchro Midi ni Link on lance un worker
            if (!par.synchoOnMidiClock && !par.synchroLink && par.synchroSkini) {
              //setMonTimer(timerSynchro); // Pour un timer dans le thread principal, pas utile avec les workers
              if (debug1) console.log("websocketserver: startAutomate:worker synchro");
              workerSynchroInit('./serveur/workerSynchro.js', timerSynchro); // Avec un worker
            }
          }

          compScore.resetClientEnCours(clientsEnCours);
          groupesClientSon.setClientsEncours(clientsEnCours);

          // Sinon n'est envoyé qu'au onopen de la Socket
          // nécessaire pour les couleurs sur les clients
          var msg = {
            type: "setPatternGroups",
            value: par.groupesDesSons
          }
          serv.broadcast(JSON.stringify(msg));

          // Au cas où le client serait connecté avant le début de l'orchestration.
          if (debug) console.log("Web Socket Server: startAutomate DAWON:", DAWStatus);
          var msg = {
            type: "DAWON",
            value: DAWStatus
          }
          ws.send(JSON.stringify(msg));
          break;

        case "startByMidiClock":
          //compteurDivisionMesure = 0; // Remise à zero de la position dans le motif
          break;

        case "startSpectateur": // On récupère l'ID du client
          if (par === undefined) {
            console.log("WARN: A client try to connect but no piece launched");
            break;
          }

          ws.id = msgRecu.id;
          if (debug1) console.log("INFO: websocketserbeur: startSpectateur: ", msgRecu.id);

          // On ne permet donc qu'un seul controleur.
          // Attention: La connexion d'un deuxième contrôleur, fait perdre la première et réinitialise la matrice des possible.
          if (msgRecu.text === "controleur") {
            if (debug1) console.log("INFO: webSocketServeur: startSpectateur: un controleur connecté");
            socketControleur = ws;
            groupesClientSon.setSocketControleur(ws);
            initMatriceDesPossibles(DAWStatus);
            var mesReponse = {
              type: "skiniParametres",
              value: par
            }
            ws.send(JSON.stringify(mesReponse));
            break;
          }

          if (msgRecu.text === "configurateur") {
            if (debug1) console.log("INFO: webSocketServeur: startSpectateur: un configurateur connecté", msgRecu.id);
            var mesReponse = {
              type: "skiniParametres",
              descriptors: DAW.getSession(),
              value: par
            }
            ws.send(JSON.stringify(mesReponse));
          }

          if (msgRecu.text === "pieceParameters") {
            if (debug1) console.log("INFO: webSocketServeur: startSpectateur: Parametre connecté", msgRecu.id);
            var mesReponse = {
              type: "skiniParametres",
              value: par
            }
            ws.send(JSON.stringify(mesReponse));
          }

          if (msgRecu.text === "clientListe") {
            if (debug1) console.log("INFO: webSocketServeur: startSpectateur: un clientListe connecté", msgRecu.id);
            var mesReponse = {
              type: "skiniParametres",
              value: par
            }
            ws.send(JSON.stringify(mesReponse));
          }

          if (msgRecu.text === "simulateur") {
            if (par.simulatorInAseperateGroup) {
              // Assignation d'un groupe au client
              var mesReponse = {
                type: "groupe",
                noDeGroupe: par.nbeDeGroupesClients - 1
              }
              ws.send(JSON.stringify(mesReponse));

              groupesClientSon.putIdInGroupClient(ws.id, par.nbeDeGroupesClients - 1);

              // Pour dire à l'ouverture au simulateur si on est ou pas dans une scène où DAW est actif.
              if (debug1) console.log("INFO: Web Socket Server: startSpectateur: simulateur: DAWON:", DAWStatus);
              var msg = {
                type: "DAWON",
                value: DAWStatus
              }
              ws.send(JSON.stringify(msg));
              break;
            }
          }

          if (debug) console.log("websocket serveur: startSpectateur: ", ws.id, "dans groupe:", groupeEncours, msgRecu, clientsEnCours);

          // Assignation d'un groupe au client
          var mesReponse = {
            type: "groupe",
            noDeGroupe: groupeEncours
          }
          ws.send(JSON.stringify(mesReponse));

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
          var msg = {
            type: "DAWStatus",
            value: DAWStatus
          }
          ws.send(JSON.stringify(msg));
          break;

        case "stopAutomate":
          if (DAWTableReady) {
            //if (setTimer !== undefined && !par.synchoOnMidiClock) clearInterval(setTimer);
            reactAutomatePossible({ halt: undefined });
            DAWStatus = 0;

            var msg = {
              type: "DAWStatus",
              value: false
            }
            serv.broadcast(JSON.stringify(msg));
          }
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
                var msg = {
                  type: "alertBlocklySkini",
                  text: err.toString()
                }
                serv.broadcast(JSON.stringify(msg));
                return console.log("ERR: websocketserver.js: updateSession: ", err);
              } else {
                // Le recharger dans DAW
                DAW.loadDAWTable(sessionFile);
                var mesReponse = {
                  type: "consoleBlocklySkini",
                  text: "session loaded: " + sessionFile
                }
                ws.send(JSON.stringify(mesReponse));
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

          if (debug1) console.log("INFO: Update of the piece parameters", msgRecu.data, "in", msgRecu.parametersDir + parametersFileGlobal);
          if (parametersFileGlobal !== undefined) {
            saveParam.saveParameters(msgRecu.parametersDir + parametersFileGlobal, msgRecu.data);
            reloadParameters(msgRecu.data);
          }

          // On recrée le fichier pour son utilisation par l'orchestration
          // avant recompilation.
          let destinationUpdate = "./serveur/skiniParametres.js";
          try {
            fs.copyFileSync(msgRecu.parametersDir + parametersFileGlobal, destinationUpdate);
          } catch (err) {
            console.log("Pb ecriture", destinationUpdate, err);
          }

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
