/**
 * @fileOverview
 * <H3>CODE CLIENT DE GENERATION DE SEQUENCES
 * UTILISANT LE CLIENT AVEC LISTE (clientListe)</H3>
 * <BR>
 * Les clips sont appelés de façon aléatoire selon la liste disponible.
 * Ceci correspond à une audience qui fait n'importe quoi sur les clips
 * disponibles.
 * @version 1.2
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
 */
'use strict'

const par = require('../../serveur/skiniParametres');
const ipConfig = require('../../serveur/ipConfig');
const WebSocket = require('ws');
const debug = false;
const debug1 = true;

let tempoMax, tempoMin, limiteDureeAttente, dureeAttente = 10;
let derniersPatternsJoues = [];
let derniersInstrumentsJoue = [-1, -1, -1];
const nbeInstruments = 100; // Attention c'est en dur...

function setTableDerniersPatterns(nbeInstr) {
  return Array(nbeInstr).fill().map(() => [-1, -1, -1]);
}

function initTempi() {
  console.log("------------------------------------------------");
  
  // Initialisation avec valeurs par défaut
  tempoMax = par.tempoMax ?? 500;
  tempoMin = par.tempoMin ?? 100;
  limiteDureeAttente = par.limiteDureeAttente ?? 100;
  
  // Logs des valeurs par défaut utilisées
  if (par.tempoMax === undefined) console.log("tempoMax par défaut");
  if (par.tempoMin === undefined) console.log("tempoMin par défaut");
  if (par.limiteDureeAttente === undefined) console.log("limiteDureeAttente par défaut");
  
  derniersPatternsJoues = setTableDerniersPatterns(nbeInstruments);
  if (debug) console.log("derniersPatternsJoues:", derniersPatternsJoues);
  
  console.log(`Paramètres tempo: Min=${tempoMin} Max=${tempoMax} limiteDureeAttente=${limiteDureeAttente}`);
}

initTempi();

if (ipConfig.websocketServeurPort !== undefined) {
  var port = ipConfig.websocketServeurPort;
} else {
  var port = 8080;
}

console.log("----------------------------------------------\n");
console.log("serveur:", ipConfig.serverIPAddress, " port:", ipConfig.websocketServeurPort);

let ws;
let id = Math.floor((Math.random() * 1000000) + 1); // Pour identifier le client
let monGroupe = -1; // non initialisé
let DAWON = 0;
let pseudo = "sim" + id;

let listClips; // Devient une array avec toutes les infos sur les clips selectionnes
let nombreDePatternsPossible = 1;

let numClip;
let myArgs = process.argv.slice(2);

// Décodage du paramètre pour une simulation indépendante de l'audience
let jeSuisUneAudience = true;
if (myArgs.includes("-sim")) {
  jeSuisUneAudience = false;
}

/*******************************************************************
 * GESTION DES TYPES
 * Traitement des listes reçues pour s'adapter à une séquence de types.
 * En utilisant les types avec des tanks on n'a pas besoin de gérer 
 * la mémoires des patterns sélectionnés, ni de revoir les FIFOs.
 *******************************************************************/
// Table of positions for the types in listOfPatterns
// The index correpond to the type.
let types = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
let processTypes = false;
let listOfTypes = [[]];

// Ou version plus explicite :
function resetListOfTypes() {
  listOfTypes = Array(types.length + 1).fill(null).map(() => []);
  if (debug) console.log("resetListOfTypes:", listOfTypes);
}

resetListOfTypes();

/**
 * Initialize the list of patterns according to their types 
 * The index correponds to the type.
 * @param {Array} list of patterns
 */
function setListOfTypes(list) {
  resetListOfTypes();

  if (debug) console.log("setListOfTypes", list, "\nlistOfTypes :", listOfTypes);

  list.forEach(item => {
    const typeKey = item[7];
    const value = item[3];
    listOfTypes[typeKey].push(value);
  });

  if (debug) console.log("simulateur: setListOfTypes:", listOfTypes);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Get randomly an element in a list and remove it
 * from the list
 * @param {Array} list 
 * @returns {*} an element of the list
 */
function selectOnePattern(list) {
  let randomIndex;
  let selected;
  randomIndex = getRandomInt(list.length);
  selected = list[randomIndex];
  list.splice(randomIndex, 1);
  if (debug) console.log("Simulateur: selectOnePattern:", selected);
  return selected;
}

/**
 * To remove a pattern from the list of patterns
 * where the index is the type
 * @param {Array} list of patterns
 * @param patternName
 */
function removePattern(list, patternName) {
  for (let i = list.length - 1; i >= 0; i--) {
    if (list[i][3] === patternName) {
      list.splice(i, 1);
      if (debug1) console.log("Simulateur: removePattern:", patternName);
    }
  }
}

/**
 * To get the complete pattern description
 * according to a name
 * @param {Array} list of pattern
 * @param patternName
 * @returns {*} a pattern descriptor
 */
function getPattern(list, patternName) {
  if (debug) console.log("Simulateur: getPattern :", list, patternName, listOfTypes);
  for (let i = 0; i < list.length; i++) {
    if (list[i][3] === patternName) {
      return list[i];
    }
  }
}

/**
 * Create a list of "selected patterns" according to 
 * a sequence described in types.
 * @param {Array} list of patterns indexed by present types
 * @param {Array} list of types availaible
 * @param {Array} listOfPatterns
 * @returns {Array} selected list of Skini notes
 */
function getListOfPatternsSelected(list, types, listOfPatterns) {
  let selected = [];
  let indexTypes;
  let patternSelected;
  let numClips = [];
  let gotAPattern;

  if (debug) {
    let testList = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i] !== undefined) {
        testList.push(list[i][0]);
      }
    }
    console.log("** simulateur: getListOfPatternsSelected: listOfTypes:", testList);
  }

  // For each type we select a pattern
  for (let i = 0; i < types.length; i++) {
    indexTypes = types[i];
    // Process the list of pattern with a specific type which is indexTypes
    if (list[indexTypes] !== undefined) {
      if (list[indexTypes].length !== 0) {
        patternSelected = selectOnePattern(list[indexTypes]);

        gotAPattern = getPattern(listOfPatterns, patternSelected);
        selected.push(gotAPattern); // Add the pattern to the selected list

        removePattern(listOfPatterns, patternSelected);
      }
    }
  }

  if (debug) {
    let testList = [];
    for (let i = 0; i < selected.length; i++) {
      if (selected[i] !== undefined) {
        testList.push([selected[i][0], selected[i][7]]);
      }
    }
    console.log("** simulateur: getListOfPatternsSelected: selected:", testList, "\n");
  }

  if (debug) console.log("simulateur: getListOfPatternsSelected: selected", selected);

  // A ce niveau on a une liste des patterns, il nous faut juste la liste des notes
  for (let i = 0; i < selected.length; i++) {
    if (selected[i] !== undefined) {
      numClips.push(selected[i][0]);
    }
  }
  return numClips;
}

/************************ NON REPETITION DES CLIPS ********************
Table des commandes donnée par les listes de patterns

 0= note, 1=note stop, 2=flag, 3=nom, 4=fichier son, 5=instrument, 6=Slot, 7=niveau2, 8=niveau3, 9=groupe, 10=durée
 11= réservé client, 12= pseudo

**********************************************************************/

function isInList(element, list) {
  return list.includes(element);
}

function sendPseudo(texte) {
  if (debug) console.log("sendPseudo:", texte);
  ws.send(JSON.stringify({
    type: "clientPseudo",
    pseudo: texte
  }));
}

/* --------------------------------------------------------------------
 * On évite de reprendre un élément de la liste qui serait dans mémoire.
 * Nous avons les cas particuliers où la liste est de taille équivalente
 * ou inferieure à la mémoire.
 * retourne un élément de la liste.
 * --------------------------------------------------------------------*/
function selectRandomInList(memoire, liste) {
   if (!memoire || !liste?.length) return undefined;
  if (liste.length === 1) return liste[0];

  const isInMemory = (item) => liste.length <= memoire.length 
    ? item === memoire[memoire.length - 1]  // Évite juste le dernier
    : memoire.includes(item);               // Évite tout ce qui est en mémoire

  let selection, attempts = 0;
  do {
    selection = liste[Math.floor(Math.random() * liste.length)];
    if(debug) console.log("Selection:", selection);
  } while (isInMemory(selection) && ++attempts < liste.length * 10);

  memoire.shift();
  memoire.push(selection);
  return selection;
}

// Retourne la note MIDI (Skini) d'un pattern choisi au hasard
function selectNextClip() {
  // Check that listClips and derniersPatternsJoues are defined and valid arrays
  if (!Array.isArray(listClips) || typeof derniersPatternsJoues !== 'object' || derniersPatternsJoues === null) {
    console.log("ERR:selectNextClip: listClips or derniersPatternsJoues is not a valid array/object");
    return undefined;
  }

  let selectionClip;
  let listeSelectionClip = [];
  let listeInstruments = [];
  let instrument;

  // Use named constants for clip indices
  const CLIP_ID_INDEX = 0;
  const CLIP_INSTRUMENT_INDEX = 5;

  //Mettre à jour le nombre d'instruments donnés par la liste
  listeInstruments = Array.from(new Set(listClips.map(clip => clip[CLIP_INSTRUMENT_INDEX])));
  if (debug) console.log("*** selectNextClip:listeInstruments:", listeInstruments);

  //Choisir un instrument au hasard, et pas toujours le même
  instrument = selectRandomInList(derniersInstrumentsJoue, listeInstruments);
  if (debug) console.log("*** selectNextClip:instrument:", instrument, derniersInstrumentsJoue);
  if (instrument === undefined) {
    console.log("ERR:selectNextClip:instrument undefined");
    return undefined;
  }

  //Choisir les commandes MIDI des patterns pour l'instrument sélectioné
  listeSelectionClip = listClips
    .filter(clip => clip[CLIP_INSTRUMENT_INDEX] === instrument)
    .map(clip => clip[CLIP_ID_INDEX]);
  if (debug) console.log("*** selectNextClip:listeSelectionClip:", listeSelectionClip);

  //Choisir un pattern pour l'instrument sélectionné
  selectionClip = selectRandomInList(derniersPatternsJoues[instrument], listeSelectionClip);
  if (selectionClip === undefined) {
    console.log("ERR:selectNextClip:selectionClip undefined : ", derniersPatternsJoues[instrument], "\n  listeSelectionClip :", listeSelectionClip);
    return undefined;
  }
  if (debug) console.log("*** selectNextClip:selectionClip:", selectionClip);

  return selectionClip;
}

/**
 * To get the number of pattern the simulator can send
 * @param {Array} list of pattern posible by type
 * @param  {number} my goup
 * @returns {number} a number of pattern
 */
function getnombreDePatternsPossible(listOfLengthPerType, myGroup) {
  // Cherche d'abord le groupe spécifique
  const specificGroup = listOfLengthPerType.find(item => item[1] === myGroup);
  if (specificGroup) return specificGroup[0];
  
  // Sinon cherche le groupe broadcast (255)
  const broadcastGroup = listOfLengthPerType.find(item => item[1] === 255);
  return broadcastGroup?.[0];
}

/*********************************************

WEBSOCKET AVEC NODE JS

**********************************************/

function initWSSocket(port) {
  var tempoInstantListClip = 0;

  ws = new WebSocket("ws://" + ipConfig.serverIPAddress + ":" + ipConfig.websocketServeurPort); // NODE JS

  // Par défaut je suis hors audience
  let monIdentite = "simulateur";
  if (jeSuisUneAudience) monIdentite = "sim";

  ws.onopen = function (event) {
    console.log("simulateur.js Websocket : ", "ws://" + ipConfig.serverIPAddress + ":" + port + "/hop/serv");
    const messages = [
      { type: "startSpectateur", text: monIdentite, id },
      { type: "getNombreDePatternsPossibleEnListe" }
    ];

    messages.forEach(msg => ws.send(JSON.stringify(msg)));
  };

  //Traitement de la Réception sur le client
  ws.onmessage = function (event) {
    let msgRecu = JSON.parse(event.data);
    //console.log( "Client: received [%s]", event.data );
    switch (msgRecu.type) {

      case "DAWON":
        DAWON = msgRecu.value;
        actionSurDAWON();
        break;

      case "DAWStatus":
        if (debug) console.log("Reçu DAWStatus:", event.value);
        DAWON = msgRecu.value;
        actionSurDAWON();
        break;

      case "demandeDeSonParPseudo":
        if (debug) console.log("Reçu Texte Broadcast demande de son par pseudo:", msgRecu.value);
        break;

      case "dureeAttente": // Quand le son a été demandé
        if (debug) console.log("dureeAttente:", msgRecu.text, msgRecu.son);
        dureeAttente = parseInt(msgRecu.text);
        break;

      case "groupe":
        //Si le simulateur doit être dissocicé de l'audience,
        // il sera dans le dernier groupe de la table des possibles.
        if (jeSuisUneAudience) {
          // Le simulateur simule l'audience.
          // Il se comporte comme tout le monde, avec le groupe que le serveur assigne
          monGroupe = msgRecu.noDeGroupe;
          console.log("SIMULATION DE L'AUDIENCE");
        } else if (!par.simulatorInAseperateGroup) {
          // Je suis ne pas un simulateur de l'audience 
          // et la config n'a pas prévu de simulateur indépendant de l'audience.
          // On force un comportement de simulateur d'audience.
          console.log("WARN: le simulateur demande à être indépendant, mais ce n'est pas prévu dans la configuration");
          monGroupe = msgRecu.noDeGroupe;
        } else {
          // La config a prévu un simulateur indépendant de l'audience
          // et je ne suis pas un simulateur d'audience.
          // Je définis mon groupe en m'attribuant donc le dernier groupe de client
          // Ceci est redondant avec le serveur dans ce cas qui fournit aussi le même groupe
          // resérvé.
          console.log("SIMULATION INDEPENDANTE DE L'AUDIENCE");
          monGroupe = par.nbeDeGroupesClients - 1;
        }
        console.log("Je suis dans le groupe:", monGroupe, "pseudo:", pseudo);
        actionSurDAWON();
        break;

      case "groupeClientStatus":
        if (debug) console.log("Reçu Broadcast: groupeClientStatus:", msgRecu, msgRecu.groupeClient);
        if (msgRecu.groupeClient == monGroupe || msgRecu.groupeClient == 255) {
          actionSurGroupeClientStatus(msgRecu.groupeName, msgRecu.status);
        }
        break;

      case "infoPlayDAW":
        if (debug) console.log("Reçu Texte Broadcast infoPlayDAW:", msgRecu.value);
        break;

      case "listClips":
        listClips = msgRecu.listClips;
        if (listClips === -1) {
          if (debug) console.log("WS Recu : listClips: groupe de client inexistant", listClips);
          break;
        }

        if (listClips === undefined) {
          if (debug) console.log("WS Recu : listClips: undefined, pas de clip");
          break;
        }

        if (listClips.length === 0) {
          if (debug) console.log("WS Recu : listClips vide");
          if (tempoMax === tempoMin) {
            console.log("WARN: tempoMin and tempoMax are equal");
            tempoInstantListClip = tempoMax;
          }
          else {
            tempoInstantListClip = Math.floor((Math.random() * (tempoMax - tempoMin)) + tempoMin);
          }
          if (debug) console.log("Tempo avant prochaine demande 2:", tempoInstantListClip);
          if (DAWON) setTimeout(function () {
            selectListClips();
          },
            tempoInstantListClip);
          break;
        }

        // Selection de clips dans la liste
        if (debug1) console.log("\n--- WS Recu : listClips 1ere ligne:", listClips[0][4], "Nombre clip dispo:", listClips.length);
        var sequenceLocale = [];

        if (processTypes) {
          setListOfTypes(listClips);
          sequenceLocale = getListOfPatternsSelected(listOfTypes, types, listClips);
          if (debug1) console.log("Simulateur: sequence selon les types:", sequenceLocale);
        } else {
          for (let i = 0; i < nombreDePatternsPossible; i++) {
            //Version qui évite trop de répétitions
            numClip = selectNextClip();
            sequenceLocale[i] = numClip;
            // On a une liste
            if (debug) console.log("--- Simulateur Recu : listClips: choisi", numClip, " : ", listClips[numClip][4], "\n");
          }
        }

        // Emission de la liste        
        if (debug) console.log("-- sendPatternSequence: attente:", dureeAttente, limiteDureeAttente);
        if (dureeAttente < limiteDureeAttente) { // On est dans des délais raisonnables
          if (debug1) console.log("-- sendPatternSequence", sequenceLocale, pseudo);
          ws.send(JSON.stringify({
            type: "sendPatternSequence",
            patternSequence: sequenceLocale,
            pseudo: pseudo,
            groupe: monGroupe,
            idClient: id
          }));
        } else {
          dureeAttente = 0;
        }

        tempoInstantListClip = Math.floor((Math.random() * (tempoMax - tempoMin)) + tempoMin);
        if (debug1) console.log("Tempo avant prochaine demande 1:", tempoInstantListClip);
        if (DAWON) setTimeout(function () {
          selectListClips();
        },
          tempoInstantListClip);
        break;

      case "listeDesTypes":
        types = msgRecu.text.split(',').map(str => parseInt(str));
        if (debug1) console.log("Simulator: List of Types:", types);
        break;

      case "message":
        if (debug) console.log(msgRecu.text);
        break;

      case "nombreDePatternsPossible":
        nombreDePatternsPossible = getnombreDePatternsPossible(msgRecu.value, monGroupe);
        if (debug1) console.log("Simulator: nombreDePatternsPossible:", nombreDePatternsPossible);
        break;

      case "nombreDePatternsPossibleEnListe":
        nombreDePatternsPossible = getnombreDePatternsPossible(msgRecu.nombreDePatternsPossible, monGroupe);
        if (debug1) console.log("Simulator : nombreDePatternsPossible:nombreSonsPossibleInit ", nombreDePatternsPossible);
        break;

      case "patternSequenceAck":
        if (debug1) console.log("Simulator : patternSequenceAck: score ", msgRecu.score);
        break;

      case "setListeDesTypes":
        if (debug1) console.log("Simulator: Set the type list")
        processTypes = true;
        break;

      case "unsetListeDesTypes":
        if (debug1) console.log("Simulator: Unset the type list")
        processTypes = false;
        break;

      case "texteServeur":
        if (debug) console.log("Reçu Broadcast:", msgRecu.value);
        break;

      default: if (debug) console.log("Le simulateur reçoit un message inconnu", msgRecu);
        break;
    }
  };

  ws.onerror = function (event) {
    console.log("simulateur.js : received ERROR on WS");
    /*		console.log( "reconnecting...");
        setTimeout(function() {
          initTempi();
          initWSSocket(port);
        }, 5000);*/
  }

  ws.onclose = function (event) {
    //console.log( "simulateur.js : on CLOSE on WS");
    setTimeout(function () { initWSSocket(port); }, 3000);
  }
}

//- Attention d'avoir initialisation avant de faire server.addEventListener('DAWStatus', function( event )---
// Cette fonction de remise à jour de l'affichage est appelée sur plusieurs évènements :
// onload, Modif DAW, Modif sur groupe de sons, reconnexion, rechargement de la page.

function initialisation() {
  if (debug) console.log("simulateur.js:initialisation: PSEUDO ", pseudo);
  sendPseudo(pseudo);
}
exports.initialisation = initialisation;

function init(port) {
  initWSSocket(port);
}
exports.init = init;

function actionSurDAWON() {
  if (DAWON == false) {
    if (debug) console.log("simulateur.js:actionSurDAWON:false");
    initialisation();
    return;
  }

  if (debug) console.log("simulateur.js:actionSurDAWON:true:", DAWON);
  initialisation(); //Pour le cas où le client recharge sa page en cours d'interaction
  selectListClips(); // Pour le déclenchement de la simulation
}

function actionSurGroupeClientStatus(sons, status) {
  if (DAWON == false) {
    if (debug) console.log("simulateur.js:actionSurGroupeClientStatus:DAWON:false");
    initialisation();
    return;
  }
  if (debug) console.log("WS actionSurGroupeClientStatus:", monGroupe);

  if (sons == "" || sons == undefined) {
  } else {
    if (status) {
    }
  }
}

//========== Controle des CLIPS =================================
function selectListClips() { // selecteurV2
  if (debug) console.log("selectListClips: groupe", monGroupe);
  ws.send(JSON.stringify({
    type: "selectAllClips",
    groupe: monGroupe
  }));
}

// ========================= Lancement du simulateur =================
init(port);

// Le principe est de demander la liste des clips périodiquement.
// Le serveur renvoie la liste avec le message "listClips" et on envoie alors 
// un clip au hasard dans la liste disponible.
// C'est bavard au niveau réseau cas on sollicite abusivement le serveur sur les listes de clip
// mais c'est une simulation.

setTimeout(() => selectListClips(), 1000);


