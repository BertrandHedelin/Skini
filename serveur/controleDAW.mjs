/**
 * @fileOverview Control of the DAW
 * @author Bertrand Petit-Hédelin <bertrand@hedelin.fr>
 * @copyright (C) 2022-2025 Bertrand Petit-Hédelin
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
 * @version node.js 1.5
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const csv = require('csv-array');
import * as oscMidi from './OSCandMidi.mjs'
import * as fs from "fs";

// Index de la table des commandes (des clips ou patterns).
const NOTE_ID = 0;
const NOTESTOP_ID = 1;
const FLAG_ID = 2;
const TEXT_ID = 3;
const SOUND_ID = 4;
const INSTR_ID = 5;
const SLOT_ID = 6;
const TYPE_ID = 7;
const TYPE_V_ID = 8;
const GROUP_ID = 9;
const DURATION_ID = 10;
const IP_ID = 11;
const BUF_ID = 12;
const LEVEL_ID = 13;

// Index des éléments de file d'attente, commande DAW
const CD_BUS_ID = 0;
const CD_CHANNEL_ID = 1;
const CD_NOTE_ID = 2;
const CD_VEL_ID = 3;
const CD_WS_ID = 4;
const CD_PSEUDO_ID = 5;
const CD_DUREE_ID = 6;
const CD_NOM_ID = 7;
const CD_SIG_ID = 8;
const CD_TYPE_ID = 9;
const CD_IP_ID = 10;
const CD_BUF_ID = 11;
const CD_LEVEL_ID = 12;
const CD_TYPE_V_ID = 13;

var par;
export function setParameters(param) {
  par = param;
}

import * as groupesClientSon from './groupeClientsSons.mjs'
const { Socket } = require('dgram');

const debug = false;
const debug1 = true;

let serv;
let tableDesCommandes;

// Il faut initialiser le tableau pour displayQueue au départ.
// Une file d'attente est composée d'arrays (de format différent de la table des commandes):
// [bus(0), channel(1), note(2), velocity(3), wsid(4),
// pseudo(5), dureeClip(6), nom(7), signal(8), type(9), IP(10), bufnum(11), level(12)]

let filesDattente = Array(20).fill().map(() => []);
let filesDattenteJouables = new Array(filesDattente.length);

// Il y en aura autant que de files d'attente
let compteursDattente = [];

let nbeDeFileDattentes = 0;
let nbeDeGroupesSons = 0;
let nombreInstruments = 0;
let automatePossibleMachine;

const avecMusicien = false;
let decalageFIFOavecMusicien = 0;

const typeDebut = 1;
const typeMilieu = 2;
const typeFin = 3;
const typeNeutre = 4;
const typeMauvais = 5;

/**
 * Set locally the reference to the HipHop automaton
 * @param  {automaton} - HipHop machine
 */
export function setAutomatePossible(automate) {
  automatePossibleMachine = automate;
}

function logInfoDAW(message) {
  message.date = getDateTime();
  fs.appendFile('skinilog.json', JSON.stringify(message) + "\n", "UTF-8", function (err) {
    if (err) {
      console.error(err);
      throw err;
    }
  });
}

function getDateTime() {
  function padZero(num) {
    return (num < 10 ? "0" : "") + num;
  }

  var date = new Date();

  var hour = padZero(date.getHours());
  var min = padZero(date.getMinutes());
  var sec = padZero(date.getSeconds());

  var year = date.getFullYear();
  var month = padZero(date.getMonth() + 1);
  var day = padZero(date.getDate());

  // Return ISO 8601 formatted string for better interoperability
  return `${year}-${month}-${day}T${hour}:${min}:${sec}`;
}

/**
 * Load the patterns description from a file
 * @param  {string} fichier - file name of csv patterns description
 */
export function loadDAWTable(fichier) {
  return new Promise(function (resolve, reject) {
    if (fichier == undefined) {
      reject("controleDAW: initDAWTable: pas de fichier à lire");
    }

    nbeDeFileDattentes = 0;
    tableDesCommandes = new Array();
    csv.parseCSV(fichier, function (data) {
      try {
        // Pour reformater le tableau stocké en CSV
        for (let i = 0; i < data.length; i++) {
          data[i][0] = parseInt(data[i][NOTE_ID], 10);
          data[i][1] = parseInt(data[i][NOTESTOP_ID], 10);
          data[i][2] = parseInt(data[i][FLAG_ID], 10);
          // On ne refomate pas les 3 et 4 qui restent des chaines de caractères

          for (let j = 5; j < 11; j++) {
            data[i][j] = parseInt(data[i][j], 10);
          }

          // On ne reformate pas l'adresse IP en 11, mais le numéro de buffer en 12
          // et le niveau en 13
          if (data[i][BUF_ID] !== undefined) data[i][BUF_ID] = parseInt(data[i][BUF_ID], 10);
          if (data[i][LEVEL_ID] !== undefined) data[i][LEVEL_ID] = parseInt(data[i][LEVEL_ID], 10);

          tableDesCommandes.push(data[i]); // ajoute la ligne au tableau
          // Met à jour le nombre de files d'attente selon le numéro max des synthé dans le fichier de config
          if (tableDesCommandes[i][INSTR_ID] > nbeDeFileDattentes) nbeDeFileDattentes = tableDesCommandes[i][INSTR_ID];
        }

        // Calcul du nombre de groupe de sons et du nombre d'instruments
        nbeDeGroupesSons = Math.max(...par.groupesDesSons.map(groupe => groupe[1])); // 1 = Index dans le tableau des paramètres
        if (debug1) console.log("INFO: controleDAW.mjs: loadDAWTable: nbeDeGroupesSons: ", nbeDeGroupesSons);
        nombreInstruments = Math.max(...tableDesCommandes.map(commande => commande[INSTR_ID]))
        if (debug1) console.log("INFO: controleDAW.mjs: loadDAWTable: Nbe d'instruments: ", nombreInstruments);

        // On convertit l'index issu de la config des pattern en nombre de FIFO
        nombreInstruments++;
        // Initialisation
        filesDattente = new Array(nombreInstruments).fill().map(() => []);
        compteursDattente = new Array(nombreInstruments).fill(0);
        filesDattenteJouables = new Array(nombreInstruments).fill(true);

        if (debug) console.log("controleDAW.mjs: loadDAWTable: Lecture une ligne de: ", fichier, tableDesCommandes[0]);
        if (debug) console.log("controleDAW.mjs: loadDAWTable: Nbe de files d'attente: ", nbeDeFileDattentes);
        if (debug) console.log("controleDAW.mjs: filesDattenteJouables: ", filesDattenteJouables);
        if (debug) console.log("controleDAW.mjs: nbeDeGroupesSons:", nbeDeGroupesSons);
        resolve();
      }
      catch (e) {
        console.log("controlDAW:loadDAW:catch", e);
        throw (e);
      }
    }, false);
  });
}

/**
 * Display on the console the patterns description
 */
export function displaySession() {
  console.log(tableDesCommandes);
}

/**
 * Get the ongoing pattern description (of the csv file loaded). 
 * @returns {array} patterns descriptors
 */
export function getSession() {
  return tableDesCommandes;
}

// ======================= Initialisation pour Broadcast =============================
/**
 * Set the server to manage the Broadcast on the clients
 * @param  {Socket} serveur
 */
export function initBroadCastServer(serveur) {
  if (debug) console.log("controleDAW: initBroadCastServer ");
  serv = serveur;
}

// ======================= Grestion des fichiers de config ===========================
// Au format CSV: 0= note, 1=note stop, 2=flag, 3=nom, 4=fichier son, 5=instrument, 6=Niveau1, 7=niveau2, 8=niveau3, 9=groupe, 10=durée

/**
 * Give the number of groups of pattern
 * @returns {number} - number of groups
 */
export function getNbeDeGroupesSons() {
  return nbeDeGroupesSons;
}

/**
 * Retrieves the pattern name associated with a given note identifier.
 *
 * @param {string|number} noteSkini - The note identifier to search for.
 * @returns {string|undefined} The corresponding pattern name if found, otherwise undefined.
 */
export function getPatternNameFromNote(noteSkini) {
  const ligne = tableDesCommandes.find(cmd => cmd[0] === parseInt(noteSkini, 10));
  return ligne?.[TEXT_ID];
}

/**
 * Get a complete pattern from a note
 * @param  {number | string} noteSkini
 * @returns {Array} pattern
 */
export function getPatternFromNote(noteSkini) {
  return tableDesCommandes.find(cmd => cmd[NOTE_ID] === parseInt(noteSkini, 10));
}

/**
 * <BR> - Pour mettre des patterns en file d'attente sans interaction.
 * Cette fonction permet d'utiliser Skini comme un séquenceur sans interaction.
 * Le mécanisme de FIFO est utilisé, ce qui permet une combinaison avec les interactions
 * et permet tous les usages des mécanismes de lecture des FIFO.
 * Assez similaire à pushClipDAW() de websocketServer.
 * <BR> - To queue patterns without interaction. This function allows 
 * to use Skini as a sequencer without interaction. 
 * The FIFO mechanism is used, which allows a combination with 
 * the interactions and allows all the uses of the FIFO reading mechanisms. 
 * Quite similar to pushClipDAW() of websocketServer.
 * @param  {string} patternName
 * @returns {number} Duree d'attente sur la queue.
 */
export function putPatternInQueue(patternName) {
  // On identifie le pattern par son nom, cad le texte du champ "nom"
  let commande = tableDesCommandes.find(cmd => cmd[TEXT_ID] === patternName);

  if (debug) console.log("INFO: controleDAW: putPatternInQueue: commande :", commande);

  if (commande !== undefined) {
    let DAWNote = commande[NOTE_ID];
    let DAWChannel = Math.floor(DAWNote / 127) + 1;
    DAWNote = DAWNote % 127;
    if (DAWChannel > 15) {
      if (debug1) console.log("Web Socket Server.js : pushClipDAW: Nombre de canaux midi dépassé.");
      return;
    }
    let nom = commande[TEXT_ID];
    let DAWInstrument = commande[INSTR_ID];
    let dureeClip = commande[DURATION_ID];
    let signal = groupesClientSon.getSignalFromGroup(commande[GROUP_ID]) + "IN";
    let id = 0;
    let adresseIP = commande[IP_ID];
    let numeroBuffer = commande[BUF_ID];
    let patternLevel = commande[LEVEL_ID];
    let patternVertType = commande[TYPE_V_ID];
    let patternType = commande[TYPE_ID];

    // Contient le signal et le pattern
    let signalComplet = { [signal]: nom };

    if (debug) console.log("controleDAW:putPatternInQueue: signalComplet:", signalComplet);
    if (debug) console.log("controleDAW:putPatternInQueue:", par.busMidiDAW, DAWChannel, DAWInstrument, DAWNote, 125, id, "Automate", dureeClip, nom);
    let dureeAttente = pushEventDAW(par.busMidiDAW, DAWChannel, DAWInstrument,
      DAWNote, 125, id, "Automate", dureeClip, nom, signalComplet, patternType,
      adresseIP, numeroBuffer, patternLevel, patternVertType);
    return dureeAttente;
  } else {
    console.log("WARN: constroleDAW.js: Le pattern n'existe pas:", patternName);
    return undefined;
  }
}

// ================= Gestion des files d'attente ===========================
/**
 * Push the patterns parameters in the queue of the instrument.
 * The queue is not as the pattern description. 
 * There are more parameters such as
 * pseudo, signal, websocket id.
 * 
 * @param  {number} bus (0)
 * @param  {number} channel (1)
 * @param  {number} note (2)
 * @param  {number} velocity (3)
 * @param  {number} wsid (4)
 * @param  {string} pseudo (5)
 * @param  {number} dureeClip (6)
 * @param  {string} nom (7)
 * @param  {string} signal (8)
 * @param  {number} typePattern (9)
 * @param  {string} IPaddress (10)
 * @param  {number} bufferNumber (11)
 * @param  {number} pattern level (12)
 * @param  {number} vertical type (13)
 */
export function pushEventDAW(bus, channel, instrument, note, velocity,
  wsid, pseudo, dureeClip, nom, signal, typePattern,
  adresseIP, numeroBuffer, patternLevel, typeVertPattern) {

  let dureeAttente = 0;
  if (debug) console.log("controleDAW.mjs: pushEventDAW ", bus, channel,
    instrument, note, velocity, wsid, pseudo, nom, signal, typePattern,
    adresseIP, numeroBuffer, patternLevel, typeVertPattern);

  let longeurDeLafile = filesDattente[instrument].length;

  // Scénario spécifique pour les interfaces avec les musiciens.
  if (longeurDeLafile === 0 && avecMusicien) {
    // On met une demande vide dans la file d'attente pour décaler le démarrage du premier élément de la FIFO
    // et laisser au musicien le temps de se préparer au pattern.
    // file d'attente = [bus, channel, note, velocity, wsid, pseudo, dureeClip, nom, signal]
    // On met une note négative qui ne sera pas jouée, bien que dans la FIFO.

    // ATTENTION: Le pseudo devient l'instrument pour le décodage par les clients musiciens.
    // Le serveur nomme le pattern "void" quand il s'agit d'un pattern qu'on ne doit pas jouer.
    // et qui sert à permettre au musicien de se préparer.
    // [bus, channel, note, velocity, wsid, pseudo, dureeClip, nom, signal]
    filesDattente[instrument].push([0, 0, -1, 0, 0, instrument, decalageFIFOavecMusicien, "void", "void", "void", "void", "void"]);
  }

  if (par.algoGestionFifo === 1) {
    // Ici on prend en compte le type de pattern pour le placer dans la Fifo
    ordonneFifo(filesDattente[instrument], [bus, channel, note, velocity,
      wsid, pseudo, dureeClip, nom, signal, typePattern,
      adresseIP, numeroBuffer, patternLevel, typeVertPattern]);
  } else {
    // On met la demande dans la file d'attente sans traitement et sans tenir compte du type qui n'a pas de sens.
    filesDattente[instrument].push([bus, channel, note, velocity,
      wsid, pseudo, dureeClip, nom, signal, '',
      adresseIP, numeroBuffer, patternLevel, typeVertPattern]); // Push à la fin du tableau
  }

  //Structure de la file: par.busMidiDAW en 0, DAW channel en 1, DAWNote en 2, velocity en 3, wsid 4, pseudo en 5, durée en 6
  // Calcul de la durée d'attente en sommant les durées dans la file d'un instrument
  for (let i = 0; i < longeurDeLafile; i++) {
    dureeAttente = dureeAttente + filesDattente[instrument][i][CD_DUREE_ID];
  }

  // On retourne la longueur de la file d'attente pour une estimation de la durée d'attente qui sera transmise au spectateur
  return dureeAttente;
}

/**
 * To get the total duration of the patterns in a queue (instrument).
 * @param  {number} instrument
 * @returns {number} a delay
 */
export function getDelayEventDAW(instrument) {
  if (debug) console.log("controleDAW.mjs: getDelayEventDAW ", instrument);
  return filesDattente[instrument].reduce((total, evt) => total + evt[CD_DUREE_ID], 0);
}

/**
 * To broadcast the content of all the queues to the audience.
 */
export function displayQueues() {
  let file = [];
  let contenuDeLaFile = [];

  let messageLog = { date: "" };
  for (let i = 0; i < filesDattente.length; i++) {
    if (filesDattente[i].length > 0) {

      /*    messageLog.source = "controleDAW.mjs";
            messageLog.type = "Etat de la file d'attente";
            messageLog.longeurFileAttente = filesDattente[i].length;
            messageLog.file = filesDattente[i];
            logInfoDAW(messageLog);*/

      contenuDeLaFile = [];
      for (let j = 0; j < filesDattente[i].length; j++) {
        contenuDeLaFile.push([filesDattente[i][j][CD_PSEUDO_ID], filesDattente[i][j][CD_NOM_ID]]);
      }
      if (debug) console.log(" controleDAW: displayQueues: File:", i, "--", contenuDeLaFile);
      file.push([i, filesDattente[i].length, contenuDeLaFile]);
    }
  }

  serv.broadcast(JSON.stringify({ type: "etatDeLaFileAttente", value: file }));
  // Pour les musiciens
  serv.broadcast(JSON.stringify({ type: "lesFilesDattente", value: filesDattente }));
}

// Fonction appelée de façon régulière avec Td = Intervalle d'appel dans HOP > Tqa = Temps de quantization dans Ableton
let compteurTest = 0; // Pour controler la transmission depuis les clients, on le compte.
let laClef;
let leSignal;
let emptyQueueSignal;
let timerDivisionLocal;

/**
 * Play the queues according to timerDivision which defines the speed of the tick
 * filesDattente and filesDattenteJouables are global variables.
 * This function is called every pulse generated by the synchro either MIDI or 
 * worker. It means every quarter note. TimerDivision is the number of pulse used
 * to decrement the "compteurDattente" array of counters of waiting times.
 * The principle is:
 * - check the compteurDAttente
 * - if it is 0 we take the next clip (take it and supress it from the list)
 * - send the command to the DAW or Module
 * - load the new value of compteurDattente for the clip sent
 * - decrement all the compteurDAttente
 * 
 * In the FIFO we only have the clips to be played.
 * 
 * @param {number} timerDivision 
 */
export function playAndShiftEventDAW(timerDivision) {
  let commandeDAW;
  let messageLog = { date: "" };

  // Contournement d'un pb de timerDivision parfois undefined sans raison apparente
  if (timerDivision !== undefined) {
    timerDivisionLocal = timerDivision;
  }

  if (debug) console.log(" controleDAW : playAndShiftEventDAW: timerDivisionLocal: ", timerDivisionLocal);
  if (debug) console.log(" controleDAW : playAndShiftEventDAW: filesDattente: ", filesDattente);
  if (filesDattente === undefined) return; // Protection

  for (let i = 0; i < filesDattente.length; i++) {  // Pour chaque file d'attente
    // Mécanisme de pause d'une file d'attente
    if (filesDattenteJouables[i] !== undefined) {
      if (filesDattenteJouables[i] === false) {
        continue;
      }
    }
    if (debug) console.log("--- controleDAW.mjs:FIFO", i, " length:", filesDattente[i].length);

    if (debug) console.log("---0 controleDAW.mjs:compteursDattente:", i, ":", compteursDattente[i]);
    // file d'attente = [bus(0), channel(1), note(2), velocity(3), wsid(4),
    // pseudo(5), dureeClip(6), nom(7), signal(8), type(9), IP(10), bufnum(11), level(12), typeVert(13)]
    // Si la file n'est pas vide
    if (filesDattente[i] !== undefined) {
      if (filesDattente[i].length !== 0) {
        if (debug) console.log("--- controleDAW.mjs:FIFO:", i, ":", filesDattente[i][0][CD_NOM_ID]);
        if (debug) console.log("--- controleDAW.mjs:FIFO:", i, ":", filesDattente[i]);
        if (debug) console.log("\n---0 controleDAW.mjs:FIFO:", i, " Durée d'attente du clip:", compteursDattente[i], " timer:", timerDivision);

        // Si l'attente est à 0 on joue le clip suivant
        if (compteursDattente[i] === 0) {

          //Passe au clip suivant
          commandeDAW = filesDattente[i].shift();  // On prend l'évenement en tête de la file "i"

          if (commandeDAW === undefined) continue;

          if (debug) console.log("---1 controleDAW.mjs:commande:", commandeDAW[CD_NOM_ID], "compteursDattente[i]:", compteursDattente[i]);

          // On peut envoyer l'évènement à DAW
          if (debug) console.log("--- controleDAW.mjs : playAndShiftEventDAW : COMMANDE DAW A JOUER:", commandeDAW);

          // Log pour analyse a posteriori
          messageLog.source = "controleDAW.mjs";
          messageLog.type = "COMMANDE DAW ENVOYEE";
          messageLog.note = commandeDAW[CD_NOTE_ID];
          messageLog.instrumentNo = i;
          messageLog.pseudo = commandeDAW[CD_PSEUDO_ID];
          messageLog.id = commandeDAW[CD_WS_ID];
          messageLog.nomSon = commandeDAW[CD_NOM_ID];
          logInfoDAW(messageLog);

          compteurTest++;

          // Joue le clip, mais pas si la note n'est pas négative et que l'on est avec des musiciens.
          // si Note < 0 on est dans le cas d'un pattern d'info pour les musiciens.
          // On fait rien pour la DAW.
          // !! à vérifier.
          if (commandeDAW[CD_NOTE_ID] >= 0) {

            // Pour jouer les buffers sur Raspberries
            if (par.useRaspberries !== undefined) {
              // On teste chaque pattern avant playOSCRasp(message, value, port, IPaddress, level, durée)
              if (debug) console.log("controleDAW.mjs: playAndShiftEventDAW:", par.playBufferMessage,
                commandeDAW[CD_BUF_ID], par.raspOSCPort, commandeDAW[CD_IP_ID], commandeDAW[CD_LEVEL_ID]);

              if (par.useRaspberries && !isNaN(commandeDAW[CD_BUF_ID])) {
                oscMidi.playOSCRasp(par.playBufferMessage,
                  commandeDAW[CD_BUF_ID], par.raspOSCPort, commandeDAW[CD_IP_ID],
                  commandeDAW[CD_LEVEL_ID], commandeDAW[CD_DUREE_ID]);
              } else {
                oscMidi.sendNoteOn(commandeDAW[CD_BUS_ID], commandeDAW[CD_CHANNEL_ID],
                  commandeDAW[CD_NOTE_ID], commandeDAW[CD_VEL_ID]);
              }
            } else {
              // On est dans le cas sans Raspberry
              oscMidi.sendNoteOn(commandeDAW[CD_BUS_ID], commandeDAW[CD_CHANNEL_ID], commandeDAW[CD_NOTE_ID], commandeDAW[CD_VEL_ID]);
            }
          }

          if (commandeDAW[CD_DUREE_ID] % timerDivisionLocal !== 0) {
            console.log("WARN: controleDAW.mjs: playAndShiftEventDAW: pattern",
              commandeDAW[CD_NOM_ID], " a une durée: ", commandeDAW[CD_DUREE_ID], "non multiple de timer division:", timerDivisionLocal);
          }
          if (debug) console.log("---2 controleDAW.mjs:sendNoteOn:", commandeDAW[CD_NOM_ID], " de durée: ", commandeDAW[CD_DUREE_ID], "avec timerDivisionLocal:", timerDivisionLocal);

          // Via OSC on perd les accents, donc on passe pas une WebSocket
          if (debug) console.log("playAndShiftEventDAW: ", compteurTest, ": ", commandeDAW[CD_NOM_ID], ":", commandeDAW[CD_PSEUDO_ID]);

          // Pour affichage avec un programme Processing
          // oscMidi.sendProcessingDisplayNames( "demandeDeSonParPseudo", commandeDAW[7] );

          // La ligne automatePossibleMachine.react(commandeDAW[8]) est activé selon reactOnPlay
          // Si reactOnPlay existe à true on envoie le signal, qui correspond au lancement d'un pattern, au moment de le jouer
          // Au niveau timing cela signifie que l'on prend en compte une activation au moment où elle est jouée
          // et pas au moment où elle est demandée.
          // L'autre scénario est dans websocketserver où on envoie le signal au moment de la demande
          // Ce sont deux scénarios différents. Celui-ci peut poser des pb de performance si les react s'enchainent
          // quand on joue la file d'attente.

          // Pour associer le nom du pattern au signal de groupe
          laClef = Object.keys(commandeDAW[CD_SIG_ID]);
          leSignal = JSON.parse('{"' + laClef[0] + '":"' + commandeDAW[CD_NOM_ID] + '"}');

          if (debug) console.log("controleDAW:playAndShiftEventDAW: laclef:", laClef, ", leSignal: ", leSignal, commandeDAW[CD_SIG_ID]);

          if (par.reactOnPlay !== undefined) {
            if (par.reactOnPlay) {
              if (debug) console.log("controleDAW: playAndShiftEventDAW: reactOnPlay: ", par.reactOnPlay, leSignal);
              automatePossibleMachine.react(leSignal);
            }
          }

          // Pour avertir le browser du demandeur du son et les musiciens s'il y en a.
          serv.broadcast(JSON.stringify({ type: "infoPlayDAW", value: commandeDAW }));
          if (debug) console.log("controleDAW:playAndShiftEventDAW: broadcast commandeDAW", commandeDAW);

          //Met à jour l'attente quand on a joué le pattern.
          compteursDattente[i] = commandeDAW[CD_DUREE_ID]; // On recharge le compteur d'attente pour le pattern en cours, en comptant le tick en cours

          //Gestion d'une erreur possible dans la programmation de l'orchestration
          //si des patterns ont des durées < timeDivision, donc inférieures au tick.
          // Ce cas n'est plus traité à cause de la ligne 508, mais le pb reste
          if (compteursDattente[i] < 0) {
            console.log("WARN: Problème sur Pattern", commandeDAW[CD_NOM_ID], ", sa durée est inférieure au timerDivision");
            compteursDattente[i] = 0;
          }
          if (debug) console.log("---3 controleDAW.mjs:compteursDattente:", i, ":", compteursDattente[i]);

        } else {
          if (compteursDattente[i] > 0) {
            if (debug) console.log("---4 controleDAW.mjs:compteursDattente:", compteursDattente[i]);
          }
        }
      } else {
        emptyQueueSignal = JSON.parse('{"emptyQueueSignal":"' + i + '"}');
        if (automatePossibleMachine !== undefined) {
          automatePossibleMachine.react(emptyQueueSignal);
          if (debug) console.log("controleDAW.mjs: playAndShiftEventDAW:", emptyQueueSignal);
        }
      }
    }
  } // Fin du for

  // -- Mettre à jour les attentes
  // On décrémente les compteurs d'attente de la durée du tick
  // Dans la file d'attente la durée du pattern devient le temps d'attente en fonction de la durée du tick.
  // C'est une façon de gérer des patterns plus longs que le tick.
  for (let i = 0; i < compteursDattente.length; i++) {
    if (avecMusicien && decalageFIFOavecMusicien < timerDivisionLocal) {
      console.log("ERR: Le décalage pour musicien doit être un multiple de timerDivision !");
    }
    if (compteursDattente[i] >= timerDivisionLocal) {
      compteursDattente[i] -= timerDivisionLocal;
    }
  }
  if (debug) console.log("--- controleDAW.mjs:FIFO:Durée d'attente des clips:", compteursDattente, " timer:", timerDivisionLocal);
  return;
}

/**
 * Empty the queues. No parameters.
 */
export function cleanQueues() {
  let messageLog = { date: "" };
  if (debug) console.log("controleDAW.mjs : cleanQueues", filesDattenteJouables, compteursDattente, filesDattente);

  for (let i = 0; i < filesDattente.length; i++) {
    filesDattenteJouables[i] = true;
    compteursDattente[i] = 0;
    filesDattente[i] = [];
  }
  messageLog.source = "controleDAW.mjs";
  messageLog.type = "VIDAGE FILES ATTENTES";
  logInfoDAW(messageLog);
  if (debug) console.log("controleDAW: cleanQueues");
  serv.broadcast(JSON.stringify({ type: "etatDeLaFileAttente", value: filesDattente }));
}

/**
 * Empty a specific queue.
 * @param {number} instrument 
 * @returns {void}
 */
export function cleanQueue(instrument) {
  let messageLog = { date: "" };

  if (instrument === 255) {
    cleanQueues();
    return;
  }

  if (filesDattente[instrument] === undefined) {
    console.log("ERR: controleDAW.mjs: cleanQueue d'un instrument inexistant: ", instrument);
    return;
  }

  filesDattente[instrument] = [];
  compteursDattente[instrument] = 0;

  messageLog.source = "controleDAW.js";
  messageLog.type = "VIDAGE FILE ATTENTE " + instrument;
  logInfoDAW(messageLog);
  if (debug) console.log("controleDAW: cleanQueue: ", instrument);

  // Avec l'instrument concerné
  serv.broadcast(JSON.stringify({ type: "cleanQueues", instrument }));
}

/**
 * Pause all the queues. Can be used during a game for example in order
 * to let the audience do some action.
 */
export function pauseQueues() {
  let messageLog = { date: "" };
  if (debug) console.log("controleDAW.mjs : pauseQueues", filesDattenteJouables, compteursDattente, filesDattente);

  filesDattenteJouables.fill(false);
  messageLog.source = "controleDAW.mjs";
  messageLog.type = "PAUSE DES FILES ATTENTES";
  logInfoDAW(messageLog);
  if (debug1) console.log("controleDAW: pauseQueues");
  serv.broadcast(JSON.stringify({ type: "pauseQueues", instrument: 255 }));
}

/**
 * For restarting all the queues after a pauseQueues()
 */
export function resumeQueues() {
  let messageLog = { date: "" };
  if (debug) console.log("controleDAW.mjs : pauseQueues", filesDattenteJouables, compteursDattente, filesDattente);

  filesDattenteJouables.fill(true);
  messageLog.source = "controleDAW.mjs";
  messageLog.type = "REPRISE DES FILES ATTENTES";
  logInfoDAW(messageLog);
  if (debug1) console.log("controleDAW: resumeQueues");
  // 255 => tous les instruments
  serv.broadcast(JSON.stringify({ type: "resumeQueues", instrument: 255 }));
}

/**
 * Pause a specific queue. Can be used for a game to keep some music playing
 * when the audience has some actions to do.
 * @param {number} instrument 
 */
export function pauseQueue(instrument) {
  let messageLog = { date: "" };
  filesDattenteJouables[instrument] = false;
  messageLog.source = "controleDAW.mjs";
  messageLog.type = "PAUSE FILE ATTENTE " + instrument;
  logInfoDAW(messageLog);
  if (debug1) console.log("controleDAW: pauseQueue: ", instrument);
  serv.broadcast(JSON.stringify({ type: "pauseOneQueue", instrument }));
}

/**
 * Restart a specific queue after pauseQueue(instrument).
 * @param {number} instrument 
 */
export function resumeQueue(instrument) {
  let messageLog = { date: "" };
  filesDattenteJouables[instrument] = true;
  messageLog.source = "controleDAW.mjs";
  messageLog.type = "REPRISE FILE ATTENTE " + instrument;
  logInfoDAW(messageLog);
  if (debug1) console.log("controleDAW: resumeQueue: ", instrument);
  serv.broadcast(JSON.stringify({ type: "resumeOneQueue", instrument }));
}

// ================= Visualisation de la table des commandes ===============

/**
 * To get the number of people connected to Skini
 * @returns {number} number of people connected
 */
export function nbeDeSpectateursConnectes() {
  return tableDesCommandes.filter(cmd => cmd[2] !== 0).length;
}

/**
 * To get the complete list of all active patterns (or clips)
 * for a group of clients.
 * @param {number} groupeDeClients 
 * @param {array} matriceDesPossibles
 * @returns {array} array of clips as in tableDesCommandes
 */
export function getAllClips(groupeDeClients, matriceDesPossibles) {
  // Protection
  if (matriceDesPossibles === undefined) return -1
  if (groupeDeClients === -1) return -1;

  // Vérification de l'existence du groupe dans la matrice
  if (!matriceDesPossibles[groupeDeClients]) {
    if (debug) console.log("WARN:controleDAW :getAllClips:cannot get groupeDeClients:", groupeDeClients, "from matriceDesPossibles");
    return -1;
  }

  // Récupération des groupes actifs une seule fois
  const groupesActifs = matriceDesPossibles[groupeDeClients]
    .map((estActif, index) => estActif ? index : -1)
    .filter(index => index !== -1);

  // Si aucun groupe n'est actif, retourner un tableau vide
  if (groupesActifs.length === 0) {
    return [];
  }

  // Filtrage direct des commandes avec les groupes actifs
  return tableDesCommandes.filter(commande =>
    commande[GROUP_ID] !== undefined &&
    groupesActifs.includes(commande[GROUP_ID])
  );
}

//================== Algorithmes de sélection V2 ===============================
export function getListClips(niv) {
  var clipsNiveau1 = new Array();
  var clipsNiveau2 = new Array();
  var clipsNiveau3 = new Array();

  //if (debug) console.log("controleDAW.mjs: getListClips: niveaux", niv);

  if (niv[0] == 0) return tableDesCommandes;

  // Remplir avec le niveau 1
  var tableLength = tableDesCommandes.length;
  for (var i = 0; i < tableLength; i++) {
    if (tableDesCommandes[i][6] === niv[0]) { // Niveau1
      clipsNiveau1.push(tableDesCommandes[i]);
    }
  }

  //if (debug) console.log("controleDAW.mjs: getListClips: niveau1", clipsNiveau1 );

  if (niv[1] == 0) return clipsNiveau1; // Si pas de niveau2 on renvoie le niveau1

  // Filtrer le niveau 2
  var tableLength = clipsNiveau1.length;
  for (var i = 0; i < tableLength; i++) {
    if (clipsNiveau1[i][7] === niv[1]) { // Niveau2
      clipsNiveau2.push(clipsNiveau1[i]);
    }
  }

  //if (debug) console.log("controleDAW.mjs: getListClips: niveau2", clipsNiveau2 );

  if (niv[2] == 0) return clipsNiveau2; // Si pas de niveau3 on renvoie le niveau2

  // Filtrer le niveau 3
  var tableLength = clipsNiveau2.length;
  for (var i = 0; i < tableLength; i++) {
    if (clipsNiveau2[i][8] === niv[2]) { // Niveau3
      clipsNiveau3.push(clipsNiveau2[i]);
    }
  }

  //if (debug) console.log("controleDAW.mjs: getListClips: niveau3", clipsNiveau3 );

  return clipsNiveau3;
}

//************** Réorganisation des Fifos **************
// Le mécanisme est décrit dans la doc utilisateur de Skini.
// 
/**
 * Insert a pattern between two types of patterns.
 * Starts from the end of the FIFO.
 */
function putPatternBetween(fifo, avant, apres, pattern) {
  // Recherche de la position où insérer le pattern
  const insertIndex = fifo.findIndex((item, i) =>
    i > 0 &&
    item[CD_TYPE_ID] === apres &&
    fifo[i - 1][CD_TYPE_ID] === avant
  );

  // Si une position valide est trouvée, insérer le pattern
  if (insertIndex !== -1) {
    if (debug) {
      console.log("---- putPatternBetween: On met le pattern:", pattern[CD_NOM_ID],
        "de type:", pattern[CD_TYPE_ID], "en", insertIndex,
        " (entre types", apres, " et ", avant, ")");
    }
    fifo.splice(insertIndex, 0, pattern);
    return true;
  }
  return false;
}

/**
 * Insert a pattern before a type of pattern.
 * Starts from the end of the FIFO.
 */
function putPatternBefore(fifo, apres, pattern) {
  if (debug1) console.log("---- putPatternBefore");

  // Recherche de la dernière occurrence du type "apres"
  for (let i = fifo.length - 1; i >= 0; i--) {
    if (fifo[i][CD_TYPE_ID] === apres) {
      if (debug1) {
        console.log("---- putPatternBefore: On met le pattern:", pattern[CD_NOM_ID],
          "de type:", pattern[CD_TYPE_ID], "en", i, " (avant: ", apres, ")");
      }
      fifo.splice(i, 0, pattern);
      return true;
    }
  }
  return false;
}

/**
 * Reorder a queue according to the pattern types DMFN. (Début, Milieu, Fin, Neutre)
 * 
 * Note : The simulator offer the possibility to do that in a more
 * powerfull way with the list of types.
 * 
 * @param  {Array} fifo - of the "queue" or "instrument"
 * @param  {Array} pattern
 */
function ordonneFifo(fifo, pattern) {
  // On ordonne la fifo en partant de l'indice haut qui correspond au denier pattern entré
  // ceci évite de trop perturber le timing d'éntrée des patterns dans la fifo.
  // pattern en fifo => [bus, channel, note, velocity, wsid, pseudo, dureeClip, nom, signal, typePattern]
  if (debug1) console.log("---- ordonneFifo", pattern[CD_SIG_ID], pattern[CD_TYPE_ID]);

  if (fifo.length === 0 || pattern[CD_TYPE_ID] === typeNeutre) {
    if (debug1) console.log("---- ordonneFifo: Fifo vide ou pattern N");
    fifo.push(pattern);
    return;
  }

  if (fifo.length === 0 && pattern[CD_TYPE_ID] === typeMilieu) {
    if (debug1) console.log("---- ordonneFifo: M tout seul");
    fifo.push(pattern);
    return;
  }

  switch (pattern[CD_TYPE_ID]) {
    case typeDebut:
      if (fifo.length > 1) { // Au moins 2 elements
        if (putPatternBetween(fifo, typeFin, typeFin, pattern)) { return; }
        if (putPatternBetween(fifo, typeFin, typeMilieu, pattern)) { return; }
        if (putPatternBetween(fifo, typeMilieu, typeFin, pattern)) { return; }
        if (putPatternBetween(fifo, typeMilieu, typeMilieu, pattern)) { return; }
        fifo.push(pattern);
        return;
      } else { // Un seul élément
        if (fifo[0][CD_TYPE_ID] === typeFin || fifo[0][CD_TYPE_ID] === typeMilieu) {
          if (debug1) console.log("---- ordonneFifo: Permuttons F ou M et D");
          fifo.splice(0, 0, pattern);
          return;
        } else { // ça fait 2 débuts de suite
          fifo.push(pattern);
          return;
        }
      }

    case typeMilieu:
      if (fifo.length > 1) {
        if (putPatternBetween(fifo, typeDebut, typeFin, pattern)) { return; }
        if (putPatternBetween(fifo, typeMilieu, typeFin, pattern)) { return; }
        if (putPatternBetween(fifo, typeFin, typeFin, pattern)) { return; }
      } else { // Il n'y a qu'un élément dans la Fifo.
        if (fifo[0][CD_TYPE_ID] === typeFin) { // Si c'est une fin
          if (debug1) console.log("---- ordonneFifo: Permuttons F et M");
          fifo.splice(0, 0, pattern); // Insère un élément en début de fifo
          return;
        }
        else { // C'est qu'on a un debut avant, mais on pourra avoir un début apres ou un autre milieu
          if (debug1) console.log("---- ordonneFifo: Un pattern Milieu seul dans la fifo");
          fifo.splice(0, 0, pattern); // Insère un élément en début de fifo
          return;
        }
      }

    case typeFin:
      if (fifo.length > 1) {
        if (putPatternBetween(fifo, typeDebut, typeDebut, pattern)) { return; }
        if (putPatternBetween(fifo, typeMilieu, typeMilieu, pattern)) { return; }
        if (fifo[fifo.length - 1][CD_TYPE_ID] === typeFin) { // le dernier élément est déjà une fin F
          if (putPatternBetween(fifo, typeDebut, typeMilieu, pattern)) { return; }
        }
      } else {
        // ça fait une fin toute seule
        fifo.push(pattern);
        return;
      }

    case typeMauvais:
      // On ne fait rien dans ce cas.
      break;

    default: if (debug1) console.log("---- ordonneFifo:Pattern de type inconnu");
  }
}
