/**
 * @fileOverview 
 * <H3> CONTROLE DEPUIS LES COMMANDES MIDI OU OSC </H3>
 * <BR>Ce programme est utilisé:
 * <BR>1) Dans le cas d'Ableton, pour recevoir et traiter les commandes OSC venant de Processing qui sert de pont MIDI.
 * Processing reçoit le MIDI qui envoie ces données MIDI de façon assez brute: NoteOn, NoteOff et ControlChange.
 * <BR>2) Dans le cas de Bitwig, pour traité les message OSC envoyé directement par le controleur Bitwig.
 * <BR>3) Dans le cas de Bitwig ou ABleton, pour traiter les messages MIDI envoyés directement pas la DAW.
 * <BR><BR>On peut émettre des signaux HipHop d'ici.
 * <BR>Le port de réception des commandes OSC est portWebSocket de la config IP
 * <BR>Remarque: la chaine peut être complexe pour MIDIMIX:
 * <BR>MIDIMIX =(midi)=> Processing =(OSC)=> Serveur =(OSC)=> Processing (VISU)
 * @author Bertrand Hédelin  © Copyright 2017-2022, B. Petit-Hédelin
 * @version 1.3
 */
"use strict"
var debug = false;
var debug1 = true;

var param;
var synchroLink = false;
var websocketServer;
var socketOpen = false;

/**
* Set the parameters
* @param  {array} list of parameters
*/
function setParameters(parameters) {
  param = parameters;
}
exports.setParameters = setParameters;

/**
* Set the websocket server module
* @param  {object} module
*/
function setWebSocketServer(socketServer) {
  websocketServer = socketServer;
}
exports.setWebSocketServer = setWebSocketServer;

/** @namespace midimix */
/**
 * Process the MIDI and OSC messages received from the DAW to send it to the orchestration.
 * @memberof midimix
 * @param {object} machineServeur
 * @param {websocket} websocketServer 
 */
//function midimix(machineServeur, websocketServer) {
function midimix(machineServeur) {
  var par = require('./ipConfig');
  var osc = require('osc-min');
  var dgram = require("dgram");
  var sock = dgram.createSocket('udp4');
  var midiConfig = require("./midiConfig.json");

  var previousNote = 0;
  var previousNotes = [0, 0, 0];
  var previousChannel = 0;
  var previousTimeStamp = 0;

  var note;
  var canal;
  var timeStamp;
  var noteSkini;

  // Pour la synchro via Ableton Link.
  if (param.synchroLink !== undefined) {
    if (param.synchroLink) synchroLink = true;
  }

  if (synchroLink && !socketOpen) {
    console.log("INFO: Synchro Ableton Link");
    const abletonlink = require('abletonlink');
    const link = new abletonlink();
    let localBeat = 0;
    let instantBeat = 0;

    link.startUpdate(100, (beat, phase, bpm) => {
      instantBeat = Math.round(beat);
      if (localBeat !== instantBeat) {
        if (debug1) console.log("midimix.js: Synchro Link ", Math.round(beat), Math.round(phase), Math.round(bpm));
        localBeat = instantBeat;
        websocketServer.sendOSCTick();
      }
    });
  }

  // Pour la synchro MIDI
  var synchroMidi = false;
  if (param.synchoOnMidiClock !== undefined) {
    if (param.synchoOnMidiClock) synchroMidi = true;
  }

  // Pour commande direct de Skini en MIDI sans passer par une passerèle ====================
  // Par défaut on communique en OSC avec la DAW ou la passerèle
  var directMidi = false;
  if (param.directMidiON !== undefined) {
    if (param.directMidiON) directMidi = true;
  }

  if (synchroMidi && synchroLink) console.log("WARN: Two synchronisations activated MIDI and Link");

  if (debug) console.log("========= directMidi dans midimix:", directMidi);

  if (directMidi) {
    // Le require est fait ici car on doit pouvoir fonctionner en OSC sans MIDI du tout
    // midi-node est dépendant de l'OS. Il faut installer le bon npm.
    var midi = require('midi');

    var midiInput = new midi.Input();
    var midiSync = new midi.Input();

    // Les controleurs
    var controlers = [];
    var controlerIndex;
    var midiPortSync;
    var midiPortClipFromDAW;
    var tempoTickDuration = 0;

    /**
    * Update the list of MIDI controlers according the MIDI configuration file.
    * @function
    * @memberof midimix
    * @inner
    */
    function getMidiPortControlers() {
      for (var i = 0; i < midiConfig.length; i++) {
        if (midiConfig[i].spec === "controler") {
          var input = new midi.Input();
          var controler = {
            "input": input,
            "name": midiConfig[i].name
          }
          controlers.push(controler);

          if (debug) console.log("getMidiPortControlers: Midi" +
            midiConfig[i].type + ", usage:" + midiConfig[i].spec +
            ", bus: " + midiConfig[i].name + ", " + midiConfig[i].comment, controlers);
        }
      }
    }

    /**
    * Get the index of a MIDI controler in te list of MIDI controlers
    * of the MIDI configuration file.
    * @function
    * @memberof midimix
    * @param {string} Midi port name
    * @return {number} index
    * @inner
    */
    function getControlerIndex(portName) {
      for (var j = 0; j < midiInput.getPortCount(); ++j) {
        if (midiInput.getPortName(j) === portName) {
          if (debug) console.log("getControlerIndex: Midi", j);
          return j;
        }
      }
      return -1;
    }

    /**
    * To process MIDI message comming from the MIDI controlers.
    * @function
    * @memberof midimix
    * @inner
    */
    function createControlerMessageOn() {
      for (var i = 0; i < controlers.length; i++) {
        controlerIndex = getControlerIndex(controlers[i].name);
        if (controlerIndex === -1) {
          console.log("WARN: controler :", controlers[i].name, " does not exist");
          continue;
        }
        controlers[i].input.openPort(controlerIndex);
        controlers[i].input.ignoreTypes(false, false, false);
        if (debug1) console.log("create Controler listener : ",
          controlers[i].input.getPortName(controlerIndex));

        controlers[i].input.on('message', function (deltaTime, message) {
          if (debug1) console.log('Input recieved : ' + message + ' d:' + deltaTime);

          // Ici les actions sur commande MIDI
          // On ne distingue pas les controleurs.

        });
        controlerIndex++;
      }
    }

    /**
    * Get the MIDI port used by the DAW for receiving the clips (patterns)
    * command from Skini.
    * @function
    * @memberof midimix
    * @return {number} index of the MIDI port
    * @inner
    */
    function getMidiPortForClipFromDAW() {
      for (var i = 0; i < midiConfig.length; i++) {
        if (midiConfig[i].spec === "clipFromDAW") {
          for (var j = 0; j < midiInput.getPortCount(); ++j) {
            if (midiInput.getPortName(j) === midiConfig[i].name) {
              if (debug) console.log("getPortForClipFromDAW: Midi" +
                midiConfig[i].type + ", usage:" + midiConfig[i].spec +
                ", bus: " + midiConfig[i].name + ", " + midiConfig[i].comment);
              return j;
            }
          }
        }
      }
      console.log("ERR: getPortForClipFromDAW: no Midi port for receiving from DAW");
      return -1;
    }

    /**
    * Get the MIDI port used by the DAW for sending the MIDI synchro.
    * @function
    * @memberof midimix
    * @return {number} index of the MIDI port
    * @inner
    */
    function getMidiPortForSyncFromDAW() {
      for (var i = 0; i < midiConfig.length; i++) {
        if (midiConfig[i].spec === "syncFromDAW") {
          1
          for (var j = 0; j < midiInput.getPortCount(); ++j) {
            if (midiSync.getPortName(j) === midiConfig[i].name) {
              if (debug) console.log("getMidiPortForSyncFromDAW: Midi" +
                midiConfig[i].type + ", usage:" + midiConfig[i].spec +
                ", bus: " + midiConfig[i].name + ", " + midiConfig[i].comment);
              return j;
            }
          }
        }
      }
      console.log("ERR: getMidiPortForSyncFromDAW: no Midi port for receiving sync from DAW");
      return -1;
    }

    /**
    * Initialize the MIDI ports for processing the MIDI messages/commands.
    * Put two MIDI listeners one on NoteOn and one on Synchro.
    * @function
    * @memberof midimix
    * @inner
    */
    function initMidiIN() {
      midiPortSync = getMidiPortForSyncFromDAW();
      midiPortClipFromDAW = getMidiPortForClipFromDAW();

      getMidiPortControlers();
      createControlerMessageOn();

      midiInput.openPort(midiPortClipFromDAW);
      midiInput.ignoreTypes(false, true, false);
      //console.log("ClipToDaw: ", midiPortClipFromDAW, midiInput.getPortName(midiPortClipFromDAW));

      midiSync.openPort(midiPortSync);
      midiSync.ignoreTypes(false, false, false);
      //console.log("midiSync: ", midiPortSync, midiSync.getPortName(midiPortSync));

      // Traitement des commande Midi reçues d'Ableton Live
      // pour les patterns lancés.
      midiInput.on('message', function (deltaTime, message) {
        // On ne traite que les noteON, de 1001 0000 (144) à 1001 1111 (159)
        if (message[0] >= 144 && message[0] <= 159) {
          if (debug) console.log('midimix.js: initMidiIN: Input recieved :' + message + ' d:' + deltaTime);
          note = message[1];
          canal = message[0] - 144;
          //timeStamp = deltaTime; 

          // Ableton envoie les commandes MIDI en comptant depuis le canal 1 (et pas 0 comme d'autres contrôleurs)
          // Il faut donc faire attention à la gestion des canaux MIDI en fonction du contrôleur.
          noteSkini = note + (canal - 1) * 127;

          // Ableton répéte 1 fois le message NoteON une première fois (deux envois) avec un léger décalage temporel.
          // Si le pattern tourne, et qu'il est activé, Ableton envoie 4 commandes MIDI noteON avec le même timestamp.
          // Le timestamp est proche de la micro-seconde.
          if (isInPreviousNotes(noteSkini) && Math.round(deltaTime) === 0) {
            //if (isInPreviousNotes(noteSkini) && previousTimeStamp === Math.round(timeStamp)){ // à peu près une seconde
            if (debug) console.log("midimix.js: REPETITION : ", noteSkini, timeStamp, previousTimeStamp);
          } else {
            //previousTimeStamp = Math.round(timeStamp); 

            if (debug) console.log("midimix.js: noteSkini: ", noteSkini, note, canal);
            if (debug) console.log("midimix.js: isInPreviousNotes:", isInPreviousNotes(noteSkini));

            // Avec PUSH branché, Ableton Live envoie des notes négatives...
            // dont je ne connais pas la signification
            if (noteSkini > 0) {
              insertInPreviousNotes(noteSkini);
              if (debug) console.log("midimix.js: Note de pattern reçue d'Ableton:", noteSkini);
              websocketServer.sendSignalFromDAW(noteSkini);
            }
          }
        }
      });

      // Traitement des messages de synchro Midi (24 messages pour une noire)
      let v0 = 0;
      midiSync.on('message', function (deltaTime, message) {
        tempoTickDuration++;
        if (message[0] === 248) {
          if (tempoTickDuration > 23) {
            if (debug) console.log("midimix.js: midiSync.on:", Date.now() - v0, "ms");
            //console.log('Sync recieved :' + message + ' d:' + deltaTime);
            if (debug) console.log("midimix 1 : Tick", message[0]);
            // Test pour éviter une "double synchro en OSC est en MIDI"
            if (synchroMidi) {
              websocketServer.sendOSCTick();
            }
            tempoTickDuration = 0;
            if (debug) { v0 = Date.now(); }
          }
        }
      });
    }
    exports.initMidiIN = initMidiIN;

    initMidiIN();
  } // Fin fonction si MIDI

  /**
  * Insert a node in the table previousNotes[] which is used
  * to process the MIDI message send by Ableton Live. 
  * Ableton repeats the NoteON message once (two times) with a slight time delay.
  * If the pattern is running, and it is activated, Ableton sends 4 MIDI noteON commands with the same timestamp.
  * The timestamp is close to the micro-second.
  * @function
  * @memberof midimix
  * @param {number} Skini Note
  * @inner
  */
  function insertInPreviousNotes(laNote) {
    for (var i = 1; i < previousNotes.length; i++) {
      previousNotes[i - 1] = previousNotes[i];
    }
    previousNotes[previousNotes.length - 1] = laNote;
    if (debug) console.log("midimix: insInPreviousNote: ", previousNotes);
  };

  /**
  * Check if the Skini Note is in the previousNotes table.
  * to process the MIDI message send by Ableton Live. 
  * @function
  * @memberof midimix
  * @param {number} Skini Note
  * @inner
  */
  function isInPreviousNotes(laNote) {
    for (var i = 0; i < previousNotes.length; i++) {
      if (previousNotes[i] === laNote) return true;
    }
    return false;
  };

  /**
  * Management of the UDP socket for OSC and OSC messages.
  * @function
  * @memberof midimix
  * @param {number} Skini Note
  * @inner
  */
  sock.close();

  sock = dgram.createSocket("udp4", function (msg, rinfo) {
    var error, message;
    try {
      message = osc.fromBuffer(msg); // Message OSC recu
      //msgloc.type  = message.address;
      //msgloc.value1 =  message.args[0].value; // C'est compliqué le parsing OSC
      //ws.send(JSON.stringify(msgloc));        // Pas utile pour le moment
      if (debug) {
        console.log("midimix.js: socket reçoit OSC: [", message.address + " : " + message.args[0].value, "]");
      }
      switch (message.address) {

        case "/AkaiControlerChange": // Emission des signaux en fonction des CC reçus
          switch (message.args[0].value) {
            case 62: // Ce CC de MIDIMIX est suivi de la configuration complète de la table...
              machineServeur.inputAndReact("scene", 4); // Pour démo, pas utilisable en l'état
              break;
            default:
              return;
          }
          break;

        case "/AkaiNoteOff":
          if (debug) console.log("midimix.js: Commande NoteOFF OSC:", message.args[0].value);
          break;

        case "/nanoKEY2NoteOff":
          if (debug) console.log("midimix.js: Commande NoteOFF OSC:", message.args[0].value);
          break;

        case "/AbletonNoteOn":
        case "/BitwigNoteOn":
        case "/AkaiNoteOn": // Emission des signaux en fonction des notes Midi reçues
        case "/nanoKEY2NoteOn":
          if (debug) console.log("midimix.js: Commande NoteON OSC:", message.args[0].value);
          switch (message.args[0].value) {

            case 25:
              websocketServer.sendSignalStartFromMIDI();
              break;

            case 26:
              websocketServer.sendSignalStopFromMIDI();
              break;

            default:
              websocketServer.sendSignalFromMIDI(message.args[0].value);
              break;
          }
          break;

        case "/MPK25NoteOn":
        case "/Session1NoteOn":
          break;

        // Traitement des commandes MIDI reçues d'Ableton lorsqu'un clip est lancé.
        // C'est un mécanisme utilisé pour traiter des "patterns pivots", cad qui peuvent être utilisés
        // dans l'orchestration comme événements.
        // Il y a ici un filtrage un peu particulier lié à la façon dont Ableton envoie les commandes MIDI
        // à l'activation d'un clip.
        case "/StartClipNoteOn":
          note = parseInt(message.args[0].value);
          canal = parseInt(message.args[1].value);
          timeStamp = parseFloat(message.args[2].value); // String car pb avec les Floats
          // Ableton envoie les commandes MIDI en comptant depuis le canal 1 (et pas 0 comme d'autres contrôleurs)
          // Il faut donc faire attention à la gestion des canaux MIDI en fonction du contrôleur.
          noteSkini = note + (canal - 1) * 127;

          // Ableton répéte 1 fois le message NoteON une première fois (deux envois) avec un léger décalage temporel.
          // Si le pattern tourne, et qu'il est activé, Ableton envoie 4 commandes MIDI noteON avec le même timestamp.
          // En divisant le timestamp par 1 000 000, on est proche de la seconde. Le timestamp est proche de la micro-seconde.
          if (isInPreviousNotes(noteSkini) && previousTimeStamp === Math.round(timeStamp / 1000000)) { // à peu près une seconde
            if (debug) console.log("midimix.js: REPETITION : ", noteSkini, timeStamp, previousTimeStamp);
            break;
          }

          previousTimeStamp = Math.round(timeStamp / 1000000);

          if (debug) {
            console.log("midimix.js: socket reçoit OSC: [", message.address + " : " +
              message.args[0].value,
              +message.args[1].value,
              +message.args[2].value,
              "]");
          }

          if (debug) console.log("midimix.js: noteSkini: ", noteSkini, note, canal);
          if (debug) console.log("isInPreviousNotes:", isInPreviousNotes(noteSkini));

          // Avec PUSH branché, Ableton Live envoie des notes négatives...
          // dont je ne connais pas la signification
          if (noteSkini > 0) {
            insertInPreviousNotes(noteSkini);
            websocketServer.sendSignalFromDAW(noteSkini);
          }

          break;

        case "/StopClipNoteOff":
          break;

        case "/ClipControlerChange":
          if (debug) console.log("Valeur du CC=", message.args[1].value);
          break;

        case "/videoNoteOn":
          websocketServer.sendSignalFromMidiMix(message.args[0].value);
          break;

        case "/AbletonTick":
        case "/BitwigTick":
          if (debug) console.log("midimix 2: bitwig tick: ", message.args[0].value);
          // Test pour éviter une "double synchro en OSC et en MIDI ou Link, si on oublie
          // de désactiver l'une ou l'autre dans la DAW.
          if (!synchroMidi && !synchroLink) {
            websocketServer.sendOSCTick();
          }
          break;

        default:
          console.log("midimix.js: socket reçoit OSC: [", message.address + " : " + (message.args[0].value), "]");
          break;
      }
      return; // console.log(osc.fromBuffer(msg));
    } catch (error) {
      console.log("midimix.js: ERR dans réception OSC :", message.args, error);
      return;
    }
  });

  sock.on('listening', function () {
    var address = sock.address();
    if (debug1) console.log('INFO: midimix.js: UDP Server listening on ' + address.address + ":" + address.port);
  });

  if (!socketOpen) {
    sock.bind(par.InPortOSCMIDIfromDAW, par.serverIPAddress);
    socketOpen = true;
  }
}
exports.midimix = midimix;