
/**
 * @fileOverview 
 * <H3>Control of clients groups and sounds</H3>
 * <BR>
 * La matrice des possibles est un tableau à 2 dimensions qui donne pour chaque groupe de clients
 * l'état des  groupes de patterns,  actifs ou pas.
 * Chaque groupe de patterns, groupe d'éléments comporte plusieurs éléments
 * conformément à ce qui est décrit dans le fichier csv de description des patterns.

 * <BR> La mise à jour de la matrice des possibles est faite par l'automate hiphop, par le controleur,
 * ou par les scrutateurs. Elle est la concrétisation de l'orchestration.

 * <BR> Cette matrice est sollicitée en lecture par les clients quand ils emettent le message "selectAllClips" vers le serveur de webSocket.
 * Le clientSelecteurSimple emet ce message à l'initialisation (quand un message de modification du contexte DAW est reçu, DAWON) et à chaque fois
 * qu'il reçoit par broadcast un message 'groupeClientStatus' qui signifie une modification dans la matrice.
 * C'est donc bien à chaque fois qu'une modification est signalée que le client cherche à se mettre à jour.

 * <BR> Le message 'groupeClientStatus' de signalisation d'une modification de la matrice est émis par broadcast:
 * <BR> - soit par le serveur de WebSocket lorsqu'il reçoit une demande de modification de la matrice des possibles de la part du controleur via les messages:
 * "putInMatriceDesPossibles", "ResetMatriceDesPossibles", "setAllMatriceDesPossibles". Pour plus de détail à ce niveau, voir les commentaires dans clientcontroleur.js.
 * <BR> - soit de la part du scrutateur (dans sa version active) via le message:  "propositionScrutateur".
 * <BR> - soit par l'automate via la fonction informSelecteurOnMenuChange() de groupeClientsSons.js. Dans l'automate c'est à la charge du compositeur
 *de signaler une mise à jour de la matrice. Ceci n'est pas automatique.
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
 * @author Bertrand Petit-Hédelin <bertrand@hedelin.fr>
 * @version 1.1
*/
'use strict'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

var debug = false;
var debug1 = true;
var par;

/**
 * Load the parameters and launch the start of the client group management.
 * @param {object} param 
 */
export function setParameters(param) {
  par = param;
  if(debug) console.log("groupeClientsSOns.mjs: setParameters:", param);
  initGroupeClientsSons();
}

import * as DAW from '../controleDAW.mjs';
//var DAW = require('../controleDAW');
import * as oscMidiLocal from '../OSCandMidi.mjs'
//var oscMidiLocal = require('../OSCandMidi'); // Pour OSC vers Game
import * as fs from "fs";

export var serv;

var midimix;
var orchestration;
var groupesClient;
export var matriceDesPossibles;
var timerDivision; // Nombre de pulses par tick, doit rester undefined si pas à jour par les automates
var nbeDeGroupesSons = 0;
var nombreDePatternsPossibleEnListe = [[3, 255]]; // init pour client memorySortable

// Pour les listes de clients memorySortable connectés et les infos sur les types de
// patterns ainsi que les précédentes listes envoyées. Mis à jour dans websocketServeur.
var clientsEnCours = [];
// Devient le tableau des groupes de patterns
var groupesSon;
var groupeName = "";

// On créé ce fichier à partir du xml de Blockly
var myReactOrchestration = "../../myReact/orchestrationHH.mjs";
var socketControleur;
var computeScorePolicy = 0;
var computeScoreClass = 0;

/**
 * Start the client group management according to the parameter file
 */
function initGroupeClientsSons() {
  // Tableau des clients actifs par groupe,
  // Devient un tableau de tableau. Le premier tableau a des index correspondant au groupe.
  // Les tableaux en deuxième position contiennent les id des clients générés à la connexion.
  if (debug1) console.log("groupeClientsSins.js: initGroupeClientsSons: par.nbeDeGroupesClients", par.nbeDeGroupesClients);
  groupesClient = new Array(par.nbeDeGroupesClients);
  for (var i = 0; i < groupesClient.length; i++) {
    groupesClient[i] = new Array();
  }

  matriceDesPossibles = new Array(par.nbeDeGroupesClients);
}

/*==========================================================================

Pour les broadcasts

============================================================================*/
/**
 * Set the server socket.
 * @param {socket} server 
 */
export function initBroadCastServer(serveur) {
  if (debug) console.log("groupecliensSons: initBroadCastServer ");
  serv = serveur;
}

/**
 * Set midimix to allow access to Ableton Link
 * from the orchestration.
 * @param {object} midimix reference
 */
export function setMidimix(mix) {
  midimix = mix;
}

/*===========================================================================
setClientsEncours et getClientsEncours

Ce sont  des fonctions qui font passerelle entre websocketServerSkini.js
et les orchestrations car il n'y a pas de lien direct de l'orchestration
vers websocketServerSkini. Il y en a dans l'autre sens via des react().

=============================================================================*/
/**
 * Set the list of connected clients
 * @param {array} list of clients
 */
export function setClientsEncours(liste) {
  clientsEnCours = liste;
}

/**
 * Get the list of connected clients
 * @returns {array} list of client
 */
export function getClientsEncours() {
  if (debug) console.log("groupecliensSons: getClientsEncours:", clientsEnCours);
  return clientsEnCours;
}

/*===========================================================================
getWinnerPseudo, getWinnerScore, getTotalGameScore, rankWinners, getGroupScore

Le calcul du ranking des scores se fait ici car ils sont activés par l'orchestration
mais le calcul des scores se fait dans compScore.js qui est activé à partir
de webSocketServeurSkini.js chaque soumission de liste de patterns.

=============================================================================*/

/**
 * For a game session, get the pseudo of the winner at index position.
 * @param {number} index 
 * @returns {string} pseudo or empty string
 */
export function getWinnerPseudo(index) {

  if (debug1) console.log("groupecliensSons: getWinner length:", clientsEnCours.length, index);
  console.log("groupecliensSons: getWinnerPseudo : index :", index);

  var winners = rankWinners(clientsEnCours);

  if (winners === -1 || index >= winners.length) {
    return '';
  }
  return winners[index].pseudo;
}

/**
 * For a game session, get the score of the winner at index position.
 * @param {number} index 
 * @returns {number} score
 */
export function getWinnerScore(index) {
  if (debug) console.log("groupecliensSons: getWinner length:", clientsEnCours.length);
  var winners = rankWinners(clientsEnCours);
  if (winners === -1 || index >= winners.length) {
    return 0;
  }
  return winners[index].score;
}

/**
 * For a game session, get the score of game.
 * @returns {number} score
 */
export function getTotalGameScore() {
  if (debug) console.log("groupecliensSons: getTotalGameScore :", clientsEnCours);
  var totalScore = 0;

  for (var i = 0; i < clientsEnCours.length; i++) {
    totalScore += clientsEnCours[i].score;
  }
  return totalScore;
}

/**
 * For a game session, rank the winner.
 * @param {array} list 
 * @returns {array} list in order according to the scores
 */
function rankWinners(uneListe) {
  if (debug) console.log("groupecliensSons: rankWinners:", uneListe);

  if (uneListe === undefined) {
    console.log("ERR : groupecliensSons: rankWinners: undefined");
    return -1;
  }

  if (uneListe.length === 0) {
    return -1;
  }

  var evaluation = function (a, b) {
    return a.score > b.score;
  }

  var liste = uneListe.slice();

  for (var i = 0; i < liste.length; i++) {
    // le tableau est trié de 0 à i-1
    // La boucle interne recherche le min
    // de i+1 à la fin du tableau. 
    for (var j = i + 1; j < liste.length; j++) {
      if (evaluation(liste[j], liste[i])) {
        var temp = liste[j];
        liste[j] = liste[i];
        liste[i] = temp;
      }
    }
  }
  return liste;
}

/**
 * Get the score of a group of winner score according to a rank.
 * @param {number} rank 
 * @returns {array}
 */
export function getGroupScore(rank) {
  if (debug) console.log("groupecliensSons: getGroupScore:", clientsEnCours);
  var scores = new Array();
  var indexMaxDeGroupe = 0;

  // On calcule l'index max pour les groupes
  for (var i = 0; i < clientsEnCours.length; i++) {
    if (clientsEnCours[i].groupe > indexMaxDeGroupe) {
      indexMaxDeGroupe = clientsEnCours[i].groupe;
    }
  }

  // On crée le tableau d'objet scores pour pouvoir le trier après.
  for (var i = 0; i < indexMaxDeGroupe + 1; i++) {
    var el = {
      groupe: i,
      score: 0
    }
    scores.push(el);
  }
  // On remplit scores avec les totaux de chaque groupe
  // score est encore organisé avec comme index les groupes.
  for (var i = 0; i < clientsEnCours.length; i++) {
    if (clientsEnCours[i].groupe >= 0) { // On ne prend pas en compte les simulateurs hors audience dont le groupe est -1
      scores[clientsEnCours[i].groupe].score += clientsEnCours[i].score;
    }
  }
  // Classement des scores
  var winners = rankWinners(scores);

  if (debug) console.log("groupecliensSons: getGroupScore:scores", scores, "winners", winners);
  return winners[rank].score;
}

/*===========================================================================
getTimerDivision, getComputeScorePolicy, getComputeScoreClass

Fonctions passerelle entre websocketServerSkini.js, controleDAW.mjs
et les orchestrations car il n'y a pas de lien direct de l'orchestration
vers websocketServerSkini. Il y en a dans l'autre sens via des react().

Les setTimerDivision, setComputeScorePolicy, setComputeScoreClass 
sont faits directement depuis l'orchestration avec des addEventListeners.

=============================================================================*/
export function testGCS(text) {
  console.log("testGCS+++++++++++++:", text, serv);
  return serv;
}

/**
 * Get the ongoing timer division
 * @returns {number} timer division
 */
export function getTimerDivision() {
  if (debug) console.log("groupecliensSons: getTimerDivision:", timerDivision);
  return timerDivision;
}

/**
 * Get the ongoing score policy
 * @returns {number} score policy
 */
export function getComputeScorePolicy() {
  return computeScorePolicy;
}

/**
 * Get the ongoing score class
 * @returns {number} score class
 */
export function getComputeScoreClass() {
  return computeScoreClass;
}

/**
 * Set the score policy
 * @param {number} score policy
 */
export function setComputeScorePolicy(policy) {
  computeScorePolicy = policy;
}

/**
 * Set the score class
 * @param {number} score class
 */
export function setComputeScoreClass(scoreClass) {
  computeScoreClass = scoreClass;
}

/**
 * Set the timer division
 * @param {number} timer division
 */
export function setTimerDivision(timer) {
  timerDivision = timer;
}

/**
 * Set the controler socket
 * @param {socket} controler socket
 */
export function setSocketControleur(socket) {
  socketControleur = socket;
}

/**
 * Call the reset of the rcoehstration matrix.
 */
export function resetMatrice() {
  resetMatriceDesPossibles();
}

/**
 * Set the length of the list of patterns for the web clients
 * where a list of pattern can be selected.
 * @param {array} param 
 */
export function setpatternListLength(param) {

  function sendMessage(nbePatternsListes) {
    if (debug) console.log("groupecliensSons.js: patternListLength:", nbePatternsListes);
    var msg = {
      type: 'nombreDePatternsPossible',
      value: nbePatternsListes
    }
    serv.broadcast(JSON.stringify(msg));
  }

  // Mise à jour du suivi des longueurs de listes
  for (var i = 0; i < nombreDePatternsPossibleEnListe.length; i++) {
    if (nombreDePatternsPossibleEnListe[i][1] === param[1]) {
      nombreDePatternsPossibleEnListe[i][0] = param[0];
      sendMessage(nombreDePatternsPossibleEnListe);
      return;
    }
  }
  nombreDePatternsPossibleEnListe.push([param[0], param[1]]);
  sendMessage(nombreDePatternsPossibleEnListe);
}

/*********************************************************

Gestion des logs de l'automate

**********************************************************/

function logInfoAutomate(message) {
  message.date = getDateTime();
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

/******************

Gestion des info vers les clients

******************/
/**
 * Clean the list of the pattern choson of web client
 * using lists.
 * @param {number} groupe 
 */
export function cleanChoiceList(groupe) {
  var message = {
    type: 'cleanClientChoiceList',
    group: groupe
  };
  serv.broadcast(JSON.stringify(message));
}

/**
 * To display a message on the score client
 * @param {string} text
 */
export function alertInfoScoreON(texte) {
  var message = {
    type: 'alertInfoScoreON',
    text: texte
  };
  serv.broadcast(JSON.stringify(message));
}

/**
 * To clean the message on the score client.
 */
export function alertInfoScoreOFF() {
  var message = {
    type: 'alertInfoScoreOFF',
  };
  serv.broadcast(JSON.stringify(message));
}

// Cette fonction est dupliquée avec Blockly, on perd le serveur avec
// les rechargements des orchestrations.
/**
 * To inform the web client when something changes in the
 * orchestration
 * @param {number} group number
 * @param {string} group name
 * @param {number} status 
 */
export function informSelecteurOnMenuChange(groupe, sons, status) {
  if (sons == undefined) {
    groupeName = "";
  } else {
    groupeName = sons;
  }
  var message = {
    type: 'groupeClientStatus',
    groupeClient: groupe,
    groupeName: groupeName,
    status: status
  };
  // Informe les selecteurs et simulateurs
  if (debug) console.log("groupecliensSons:informSelecteurOnMenuChange:", groupe, sons, status);

  if (serv !== undefined) {
    serv.broadcast(JSON.stringify(message));
  } else {
    console.log("ERR: groupecliensSons: informSelecteurOnMenuChange: serv undefined");
  }
}

/**
 * To display the tick on the controler client.
 * @param {number} tick 
 */
export function setTickOnControler(tick) {
  var message = {
    type: "setTickAutomate",
    tick: tick
  }
  //console.log("groupecliensSons:socketControleur automate:", socketControleur);
  if (socketControleur !== undefined) {
    if (socketControleur.readyState == 1) {
      socketControleur.send(JSON.stringify(message));
    } else {
      if (debug) console.log("ERR: groupecliensSons: informControleur: socketControleur not ready;", socketControleur.readyState);
    }
  }
}

/**
 * To get thelength of the list on the web client using lists of patterns
 * (memorySortable)
 * @returns {number} list length
 */
export function getNombreDePatternsPossibleEnListe() {
  if (debug) console.log("groupecliensSons: getNombreDePatternsPossibleEnListe:", nombreDePatternsPossibleEnListe);
  return nombreDePatternsPossibleEnListe;
}

/******************

Gestion des Groupes de clients

*******************/
// for (var i = 0; i < groupesClient.length; i++) {
//   groupesClient[i] = new Array();
// }

/**
 * Add an id to a group of client.
 * @param {number} id 
 * @param {array} group
 */
export function putIdInGroupClient(id, groupe) {
  if (debug) console.log("groupecliensSons:", id, groupe);
  groupesClient[groupe].push(id);
}

/**
 * Remove an id to a group of client.
 * @param {number} id 
 */
export function removeIdInGroupClient(id) {
  var position;

  for (var i = 0; i < groupesClient.length; i++) {
    for (var j = 0; j < groupesClient[i].length; j++) {
      if (groupesClient[i][j] == id) {
        position = groupesClient[i].splice(j, 1);
        return position; // Pour contrôle
      }
    }
  }
}

/**
 * Get a group of client according to an id
 * @param {number} id 
 * @returns {array} group of client
 */
export function getGroupClient(id) {
  for (var i = 0; i < groupesClient.length; i++) {
    for (var j = 0; j < groupesClient[i].length; j++) {
      if (groupesClient[i][j] == id) {
        return i;
      }
    }
  }
}

/**
 * Get a group according to an id.
 * @param {id} group id
 * @returns {array} the group
 */
export function getIdsClient(groupe) {
  return groupesClient[groupe];
}

/**
 * 
 * @returns Get all the client groups.
 */
export function getGroupesClient() {
  return groupesClient;
}

/**
 * Get the length of all the client groups
 * @returns {array} lengths
 */
export function getGroupesClientLength() {
  // It happends when calling this function before loading a piece
  if (par === undefined) return 0;

  var longueurs = new Array(par.nbeDeGroupesClients);
  for (var i = 0; i < groupesClient.length; i++) {
    longueurs[i] = groupesClient[i].length;
  }
  return longueurs;
}

/************************************

Groupes de sons (patterns)

************************************/
/**
 * Get the list of patterns
 * @returns {array} ongoing group of patterns
 */
export function getOnGoingGroupeSons() {
  return groupesSon;
}

/**
 * Get the name of the group used for the signal in the orchestration
 * according to group number assign to a pattern.
 * @param {number} group number in a pattern description
 * @returns {string|number} group name or -1
 */
export function getSignalFromGroup(groupe) {
  if (debug) console.log("groupecliensSons.js : getSignalFromGroup : ", groupe);

  var ongoingGroupe = getOnGoingGroupeSons();
  if (debug) console.log("groupecliensSons.js : ongoingGroupe : ", ongoingGroupe);

  for (var i = 0; i < ongoingGroupe.length; i++) {
    if (ongoingGroupe[i][1] == groupe) {
      return ongoingGroupe[i][0];
    }
  }
  if (debug) console.log("ERR: groupecliensSons : getSignalFromGroup : groupe inconnu :", groupe);
  return -1;
}

/**
 * Set the number of pattern groups.
 * @param {number} number of pattern groups
 */
export function setNbeDeGroupesSons(groupesSons) {
  // Nbe de groupe de son est donné par controleDAW sur la base de ce qui est décrit dans les fichiers csv
  // il s'agit donc de la valeur max dans des groupes qui vont de 0 à X. Il y a donc X + 1 groupe de sons. 
  nbeDeGroupesSons = groupesSons + 1;
}

/**
 * Get the pattern group number from a signal
 * @param {string} signal 
 * @returns {number} group number
 */
function getGroupeSons(signal) {

  var signalLocal = signal.slice(0, -3); // Pour enlever OUT

  if (debug) console.log("groupeClientSons.mjs: getGroupeSons: signal:", signal, "signalLocal:", signalLocal, "nbeDeGroupesSons:", nbeDeGroupesSons);

  for (var i = 0; i < nbeDeGroupesSons; i++) {
    if (groupesSon[i][0] === undefined) {
      console.log("ERR: getGroupeSons: groupesSon[", i, "i][0]: undefined, table groupesSon pas encore à jour");
      return -1;
    }
    if (groupesSon[i][0] === signalLocal) {
      return groupesSon[i][1];
    }
  }
  console.log("ERR: groupeClientSons.mjs: getGroupeSons: signal inconnu", signalLocal);
  return -1;
}

/*function getGroupeSons(signal) {

  var signalLocal = signal.slice(0, -3); // Pour enlever OUT

  if (debug1) console.log("groupeClientSons.mjs: getGroupeSons: signal:", signal, "signalLocal:", signalLocal, "groupesDesSons.length:", par.groupesDesSons.length);

  for (var i = 0; i < par.groupesDesSons.length ; i++) {
    if  ( par.groupesDesSons[i][0] === undefined) {
      console.log("ERR: getGroupeSons: groupesSon[", i ,"i][0]: undefined, table groupesSon pas encore à jour");
      return -1;
    }
    if ( par.groupesDesSons[i][0] === signalLocal) {
      return par.groupesDesSons[i][1];
    }
  }
  console.log("ERR: groupeClientSons.mjs: getGroupeSons: signal inconnu", signalLocal);
  return -1;
}*/

/**
 * Get the name of a group from its index.
 * @param {number} index 
 * @returns {string|number} name or -1
 */
export function getNameGroupeSons(index) {
  for (var i = 0; i < groupesSon.length; i++) {
    if (groupesSon[i][1] == index) { // Attention pas de === ici, il y a changementde type
      return groupesSon[i][0];
    }
  }
  if (groupesSon[index] === undefined) {
    console.log("ERR: groupeClientSons.mjs: getNameGroupeSons: index inconnu", index, groupesSon);
    return -1;
  }
}

/**
 * Set the group of pattern as described in the configuration file
 * of the piece.
 * @param {number} Flag of the orchestration loaded
 * @returns {number} 0 is OK -1 otherwise
 */
export function setGroupesSon(DAWState) {
  if (DAWState == 0) {
    if (debug) console.log("groupeClientsSons: setGroupesSon:DAWStatus:", DAWState);
    return -1;
  }

  groupesSon = par.groupesDesSons;
  if (groupesSon == undefined) {
    console.log("ERR: groupeClientSons.mjs: setGroupesSon: groupesSon:undefined:DAWStatus:", DAWState);
    return -1;
  }

  if (groupesSon.length == 0) {
    console.log("WARNING: groupeClientSons.mjs: setGroupesSon: groupesSon vide");
    return -1;
  }

  var msg = {
    type: "setPatternGroups",
    text: groupesSon
  }
  serv.broadcast(JSON.stringify(msg));

  if (debug) console.log("groupeClientsSons: setGroupesSon:groupesSon ", groupesSon, "DAWStatus:", DAWState);
  return 0;
}

/*************************

Matrice des possibles, pour le contrôle
des liens entre groupes de clients et groupes de sons (patterns)

**************************/
/**
 * Create the matrix giging the status of the orchestration.
 */
export function createMatriceDesPossibles() {
  for (var i = 0; i < matriceDesPossibles.length; i++) {
    matriceDesPossibles[i] = new Array(nbeDeGroupesSons);
  }
  // Info pour les scrutateurs
  var msg = {
    type: "createMatriceDesPossibles",
    matrice: matriceDesPossibles
  }
  serv.broadcast(JSON.stringify(msg));
}

/**
 * Change the status of a group of pattern for a group of web client
 * @param {number} groupeClient 
 * @param {number} groupeDeSons 
 * @param {number} status 
 * @returns {number} 0 is OK, -1 is a problem
 */
export function setInMatriceDesPossibles(groupeClient, groupeDeSons, status) {
  if (debug) console.log("groupeClientSons.mjs: setInMatriceDesPossibles ", groupeClient, groupeDeSons, status);
  if (debug) console.log("groupeClientSons.mjs: setInMatriceDesPossibles:", matriceDesPossibles);

  if (groupeClient === 255) { // On traite tous les groupes
    for (var i = 0; i < par.nbeDeGroupesClients; i++) {
      matriceDesPossibles[i][groupeDeSons] = status;
    }
    return 0;
  }
  if (groupeClient >= par.nbeDeGroupesClients) {
    console.log("ERR: groupeClientSons.mjs:setInMatriceDesPossibles:groupeClient size exceeded:", groupeClient);
    return -1;
  }
  matriceDesPossibles[groupeClient][groupeDeSons] = status;

  var message = [groupeClient, groupeDeSons, status];
  var msg = {
    type: "setInMatriceDesPossibles",
    value: message
  }
  serv.broadcast(JSON.stringify(msg));
  return 0;
}

/**
 * Get the status of group of pattern for a group of client.
 * @param {number} groupeClient 
 * @param {number} groupeSon 
 * @returns {number}
 */
export function getStatusInMatriceDesPossibles(groupeClient, groupeSon) {
  if (matriceDesPossibles[groupeClient][groupeSon] != undefined) {
    return matriceDesPossibles[groupeClient][groupeSon];
  }
}

/**
 * Broadcast the matrix.
 */
export function setMatriceDesPossibles() {
  for (var i = 0; i < matriceDesPossibles.length; i++) {
    for (var j = 0; j < matriceDesPossibles[i].length; j++) {
      matriceDesPossibles[i][j] = true;
    }
  }
  // Info pour les scrutateurs
  var msg = {
    type: "setMatriceDesPossibles",
    message: "Set"
  }
  serv.broadcast(JSON.stringify(msg));
  if (debug) console.log("groupeClientSons:setMatriceDesPossibles:", matriceDesPossibles);
}

/**
 * Clean the matrix.
 */
export function resetMatriceDesPossibles() {
  for (var i = 0; i < matriceDesPossibles.length; i++) {
    for (var j = 0; j < matriceDesPossibles[i].length; j++) {
      matriceDesPossibles[i][j] = false;
    }
  }
  if (debug) console.log("groupeClientSons:resetMatriceDesPossibles:", matriceDesPossibles);
  // Info pour les scrutateurs
  var msg = {
    type: "resetMatriceDesPossibles",
    message: "Reset"
  }
  serv.broadcast(JSON.stringify(msg));
}

/**
 * Display the matrix on the console.
 */
export function displayMatriceDesPossibles() {
  console.log("groupecliensSons: displayMatriceDesPossibles : DEBUT ---------------------------");
  console.log(matriceDesPossibles);
  console.log("groupecliensSons: displayMatriceDesPossibles : FIN ---------------------------");
}

/*************************************************************

AUTOMATE DE GESTION DE LA MATRICE DES POSSIBLES

**************************************************************/
/**
 * Create and compile the hipHop.js orchestration from the blocky generated code.
 * @returns {object} the HipHop.js machine
 */
var machine;
export function getMachine() {
  return machine;
}

/**
 * Create and compile the hipHop.js orchestration from the blocky generated code.
 * update machine
 */
var tempIndex = 0;
export async function makeOneAutomatePossibleMachine() {
  if (debug) console.log("groupeClientsSons.js: makeOneAutomatePossibleMachine");
  // Recharge l'orchestration depuis le fichier généré par Blockly,
  // fichier éventuellement mis à jour à la main pour test.
  await import(myReactOrchestration + '?foo=bar' + tempIndex).then((orchestration) => {
    // if (orchestration.setServ === undefined) {
    //   console.log("ERR: groupecliensSons: makeAutomatePossibleMachine:", "Pb on acces to:", myReactOrchestration);
    //   throw "Pb on acces to:" + myReactOrchestration;
    // }
    tempIndex++;
    // Pour permettre les broadcasts et autres depuis l'orchestration
    orchestration.setServ(serv, DAW, this, oscMidiLocal, midimix);

    // C'est là que se fait la compilation HipHop.js
    try {
      machine = orchestration.setSignals(par);
      makeSignalsListeners(machine);
    } catch (err) {
      console.log("ERR: groupecliensSons: makeAutomatePossibleMachine: makeSignalsListeners", err.toString());
      throw err;
    }
    if (debug) console.log("------------- groupecliensSons: makeOneAutomatePossibleMachine:machine: ", machine);
  }).catch(err => console.log("makeOneAutomatePossibleMachine err:", err));;
};

let messageLog = {
  date: "",
  source: "groupeClientSons.mjs",
  type: "log"
}

/**
 * Create the listeners for the HipHop.js orchestration
 * @param {object} HipHop.js machine 
 */
function makeSignalsListeners(machine) {
  // Création des listeners des signaux
  for (var i = 0; i < par.groupesDesSons.length; i++) {

    if (par.groupesDesSons[i][0] !== "") {
      var signal = par.groupesDesSons[i][0] + "OUT";

      if (debug) console.log("Addeventlisterner:signal:", signal);

      machine.addEventListener(signal, function (evt) {
        // Rappel: setInMatriceDesPossibles(groupeClient, groupeSon, status)
        if (debug) console.log("groupeClientSons: listerner:signal:", evt.signalName);

        var groupeSonLocal = getGroupeSons(evt.signalName);
        if (groupeSonLocal == -1) {
          console.log("ERR: groupeClientsSons.js:Addeventlisterner: signal inconnu:", evt.signalName);
          return;
        }
        if (debug) console.log("groupeClientSons.mjs:Addeventlisterner: groupeSons:", groupeSonLocal,
          "signalName:", evt.signalName,
          "groupeClientsNo:", evt.signalValue[1],
          "statut:", evt.signalValue[0],
          "signalValue:", evt.signalValue);

        if (setInMatriceDesPossibles(evt.signalValue[1], groupeSonLocal, evt.signalValue[0]) === -1) {
          return;
        }

        // INFORMATION VERS CLIENT CONTROLEUR POUR AFFICHAGE (son, groupe, status)
        var message = {
          type: "setInMatrix",
          son: groupeSonLocal,
          groupe: evt.signalValue[1],
          status: evt.signalValue[0]
        }
        //console.log("groupecliensSons:socketControleur automate:", socketControleur);
        if (socketControleur !== undefined) {
          if (socketControleur.readyState == 1) {
            socketControleur.send(JSON.stringify(message));
          } else {
            if (debug) console.log("WARN: groupecliensSons:socketControleur: status:", socketControleur.readyState);
          }
        }
        // Info pour les scrutateurs et score [groupeClient, groupeDeSons, status];
        var messageScrut = [evt.signalValue[1], groupeSonLocal, evt.signalValue[0]];
        var msg = {
          type: "setInMatriceDesPossibles",
          value: messageScrut
        }
        serv.broadcast(JSON.stringify(msg));
        messageLog.type = "signal";
        messageLog.value = evt.type;
        logInfoAutomate(messageLog);
      });
    }
  }

  // Listener des signaux pour les commandes OSC direct
  // Inutile si les message OSC sont envoyés sans passer par des signaux, ce qui est plus simple.
  /*	if(par.gameOSCOut !== undefined){
      for (var i=0; i < par.gameOSCOut.length; i++) {
        var signal = par.gameOSCOut[i];
        if(debug1) console.log("Signal OSC ajouté:", signal);
        machine.addEventListener( signal , function(evt) {
          if(debug1) console.log("groupeClientsSons:Emission d'une commande OSC depuis orchestration:", evt.signalName);
          oscMidiLocal.sendOSCGame(evt.signalName, evt.signalValue);
        });
      }
    }*/
}

function makeListener(machine) {

  /*
  // Listener des signaux pour les jeux avec commandes OSC 
  if(par.gameOSCOut !== undefined){
    for (var i=0; i < par.gameOSCOut.length; i++) {
      var signal = par.gameOSCOut[i];
      if(debug) console.log("Signal OSC ajouté:", signal);
      machine.addEventListener( signal , function(evt) {
        if(debug) console.log("groupeClientsSons:Emission d'une commande OSC depuis orchestration:", evt.signalName);
        oscMidiLocal.sendOSCGame(evt.signalName, evt.signalValue);
      });
    }
  }

  machine.addEventListener( "patternListLength" , function(evt) {

    function sendMessage(nbePatternsListes){
      if(debug) console.log("groupecliensSons.js: patternListLength:", nbePatternsListes);
      hop.broadcast('nombreDePatternsPossible', nbePatternsListes);
    }

    // Mise à jour du suivi des longueurs de listes
    for (var i=0; i < nombreDePatternsPossibleEnListe.length; i++){
      if(	nombreDePatternsPossibleEnListe[i][1] === evt.signalValue[1]){
        nombreDePatternsPossibleEnListe[i][0] = evt.signalValue[0];
        sendMessage(nombreDePatternsPossibleEnListe);
        return;
      }
    }
    nombreDePatternsPossibleEnListe.push([evt.signalValue[0], evt.signalValue[1]]);
    sendMessage(nombreDePatternsPossibleEnListe);
  });

  */
}