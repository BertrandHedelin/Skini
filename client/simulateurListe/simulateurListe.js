/**
 * @fileOverview
 * <H3>CODE CLIENT DE SIMULATION D'UNE AUDIENCE
 * UTILISANT LE CLIENT AVEC LISTE (clientListe)</H3>
 * <BR>
 * Les clips sont appelés de façon aléatoire selon la liste disponible.
 * Ceci correspond à une audience qui fait n'importe quoi sur les clips
 * disponibles.
 * @version 1.0
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
 */
'use strict'

var par = require('../../serveur/skiniParametres');
var ipConfig = require('../../serveur/ipConfig');
const WebSocket = require('ws');
var debug = false;
var debug1 = true;

var tempoMax, tempoMin, limiteDureeAttente;
var derniersPatternsJoues = [];
var derniersInstrumentsJoue = [-1, -1, -1];
var nbeInstruments = 100; // Attention c'est en dur...

function setTableDerniersPatterns() {
  var tablederniersPatterns = [];
  var tableVide = [-1, -1, -1];

  for (var i = 0; i < nbeInstruments; i++) {
    tablederniersPatterns.push(tableVide);
  }
  return tablederniersPatterns;
}

function initTempi() {
  console.log("------------------------------------------------");
  if (par.tempoMax !== undefined) {
    tempoMax = par.tempoMax; // en ms
  } else {
    tempoMax = 500;
    console.log("tempoMax par défaut")
  }

  if (par.tempoMin !== undefined) {
    tempoMin = par.tempoMin; // en ms
  } else {
    tempoMin = 100;
    console.log("tempoMin par défaut")
  }

  if (par.limiteDureeAttente !== undefined) {
    limiteDureeAttente = par.limiteDureeAttente; // en ms
  } else {
    limiteDureeAttente = 100;
    console.log("tempoMin par défaut")
  }

  derniersPatternsJoues = setTableDerniersPatterns();
  if (debug) console.log("derniersPatternsJoues: ", derniersPatternsJoues);

  console.log("Paramètres tempo: Min=", tempoMin, " Max=", tempoMax, " limiteDureeAttente=", limiteDureeAttente);
};

initTempi();

if (ipConfig.websocketServeurPort !== undefined) {
  var port = ipConfig.websocketServeurPort;
} else {
  var port = 8080;
}

console.log("----------------------------------------------\n");
console.log("serveur:", ipConfig.serverIPAddress, " port:", ipConfig.websocketServeurPort);

var ws;
var id = Math.floor((Math.random() * 1000000) + 1); // Pour identifier le client
var monGroupe = -1; // non initialisé
var DAWON = 0;
var pseudo = "sim" + id;

var listClips; // Devient une array avec toutes les infos sur les clips selectionnes
var nombreDePatternsPossible = 1;

var numClip;
var msg = { // On met des valeurs pas defaut
  type: "configuration",
  text: "ECRAN_NOIR",
  pseudo: "Anonyme",
  value: 0,
};

var myArgs = process.argv.slice(2);
//console.log('myArgs: ', myArgs);

// Décodage du paramètre pour une simulation indépendante de l'audience
var jeSuisUneAudience = true;
for (var i = 0; i < myArgs.length; i++) {
  if (myArgs[i] === "-sim") {
    jeSuisUneAudience = false;
  }
}
/************************ NON REPETITION DES CLIPS ********************
Table des commandes donnée par les listes de patterns

 0= note, 1=note stop, 2=flag, 3=nom, 4=fichier son, 5=instrument, 6=Slot, 7=niveau2, 8=niveau3, 9=groupe, 10=durée
 11= réservé client, 12= pseudo

**********************************************************************/

function isInList(element, list) {
  for (var i = 0; i < list.length; i++) {
    if (list[i] === element) return true;
  }
  return false;
}

function sendPseudo(texte) {
  if (debug) console.log("sendPseudo: ", texte);
  msg.type = "clientPseudo";
  msg.pseudo = texte;
  ws.send(JSON.stringify(msg));
}

/* --------------------------------------------------------------------
 * On évite de reprendre un élément de la liste qui serait dans mémoire.
 * Nous avons les cas particuliers où la liste est de taille équivalente
 * ou inferieure à la mémoire.
 * retourne un élément de la liste.
 * --------------------------------------------------------------------*/
function selectRandomInList(memoire, liste) {
  var selection;
  var index;

  if (liste === undefined) {
    console.log("INFO: simuateurFork: selectRandomInList: liste undefined");
    return undefined;
  }

  if (memoire === undefined) {
    console.log("INFO: simuateurFork: selectRandomInList: memoire undefined");
    return undefined;
  }

  if (debug) console.log("*** selectRandomInList:memoire:", memoire, "liste:", liste);

  if (liste.length === 0) {
    return undefined;
  } else if (liste.length < 2) {
    // Quand on a un seul élément pas la peine de se fatiguer.
    return liste[0];
  } else if (liste.length <= memoire.length) {
    while (true) {
      index = Math.floor(Math.random() * liste.length);
      selection = liste[index];
      if (selection === memoire[memoire.length - 1]) {
        if (debug) console.log("reselecte A:", selection, index);
        continue; // On refait un tour pour éviter une répétition immédiate
      } else {
        memoire.shift(selection); // Décale la mémoire
        memoire.push(selection); // Mémorise le choix
        return selection;
      }
    }
  } else {
    while (true) {
      index = Math.floor(Math.random() * liste.length);
      selection = liste[index];
      if (!isInList(selection, memoire)) { // La selection n'est pas dans la mémoire
        memoire.shift(selection); // Décale la mémoire
        memoire.push(selection); // Mémorise le choix
        if (debug) console.log("reselecte fin: ", selection, index);
        return selection;
      } else {	// La sélection est dans la mémoire
        if (debug) console.log("reselecte B:", selection, index);
        continue; // On refait un tour
      }
    }
  }
}

// Retourne la note MIDI (Skini) d'un pattern choisi au hasard
function selectNextClip() {
  var selectionClip;
  var listeSelectionClip = [];
  var listeInstruments = [];
  var instrument;

  //Mettre à jour le nombre d'instruments donnés par la liste
  for (var i = 0; i < listClips.length; i++) {
    if (!isInList(listClips[i][5], listeInstruments)) {
      listeInstruments.push(listClips[i][5]);
    }
  }
  if (debug) console.log("*** selectNextClip:listeInstruments:", listeInstruments);

  //Choisir un instrument au hasard, et pas toujours le même
  instrument = selectRandomInList(derniersInstrumentsJoue, listeInstruments);
  if (debug1) console.log("*** selectNextClip:instrument:", instrument, derniersInstrumentsJoue);
  if (instrument === undefined) {
    console.log("ERR:selectNextClip:instrument undefined");
    return undefined;
  }


  //Choisir les commandes MIDI des patterns pour l'instrument sélectioné
  for (var i = 0; i < listClips.length; i++) {
    if (listClips[i][5] === instrument) {
      listeSelectionClip.push(listClips[i][0]);
    }
  }
  if (debug) console.log("*** selectNextClip:listeSelectionClip:", listeSelectionClip);

  //Choisir un pattern pour l'instrument sélectioné
  selectionClip = selectRandomInList(derniersPatternsJoues[instrument], listeSelectionClip);
  if (selectionClip === undefined) {
    console.log("ERR:selectNextClip:selectionClip undefined : ", derniersPatternsJoues[instrument], "\n  listeSelectionClip :", listeSelectionClip);
    return undefined;
  }
  if (debug) console.log("*** selectNextClip:selectionClip:", selectionClip);

  return selectionClip;
}

/*********************************************

WEBSOCKET AVEC NODE JS

**********************************************/

function initWSSocket(port) {
  var tempoInstantListClip = 0;

  ws = new WebSocket("ws://" + ipConfig.serverIPAddress + ":" + ipConfig.websocketServeurPort); // NODE JS

  // Par défaut je suis hors audience
  var monIdentite = "simulateur";
  if (jeSuisUneAudience) monIdentite = "sim";

  ws.onopen = function (event) {
    console.log("simulateur.js Websocket : ", "ws://" + ipConfig.serverIPAddress + ":" + port + "/hop/serv");
    msg.type = "startSpectateur";
    msg.text = monIdentite;
    msg.id = id;
    // Node est super rapide
    //setTimeout( ()=> ws.send(JSON.stringify(msg)), 500 );
    ws.send(JSON.stringify(msg));

    msg.type = "getNombreDePatternsPossibleEnListe";
    // Node est super rapide
    //setTimeout( ()=> ws.send(JSON.stringify(msg)), 500 );
    ws.send(JSON.stringify(msg));
  };

  //Traitement de la Réception sur le client
  ws.onmessage = function (event) {
    var msgRecu = JSON.parse(event.data);
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
        if (debug) console.log("dureeAttente:", msgRecu.text, msgRecu.son);;
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
          tempoInstantListClip = Math.floor((Math.random() * (tempoMax - tempoMin)) + tempoMin);
          if (debug) console.log("TEMPO INSTANT LIST CLIP:", tempoInstantListClip);
          if (DAWON) setTimeout(function () {
            selectListClips();
          },
            tempoInstantListClip);
          break;
        }

        // Selection de clips dans la liste
        if (debug) console.log("\n--- WS Recu : listClips 1ere ligne:", listClips[0][4], "Nombre clip dispo:", listClips.length);
        var sequenceLocale = [];

        for (var i = 0; i < nombreDePatternsPossible; i++) {
          //Version qui évite trop de répétitions
          numClip = selectNextClip();
          sequenceLocale[i] = numClip;
          if (debug) console.log("--- WS Recu : listClips: choisi", numClip, " : ", listClips[numClip][4], "\n");
        }

        if (debug1) console.log("-- sendPatternSequence", sequenceLocale);
        if (sequenceLocale[0] !== undefined) { // Protection if mistake on the controler
          msg.type = "sendPatternSequence";
          msg.patternSequence = sequenceLocale;
          msg.pseudo = pseudo;
          msg.groupe = monGroupe;
          msg.idClient = id;
          ws.send(JSON.stringify(msg));
        }

        tempoInstantListClip = Math.floor((Math.random() * (tempoMax - tempoMin)) + tempoMin);
        if (debug1) console.log("TEMPO INSTANT LIST CLIP:", tempoInstantListClip);
        if (DAWON) setTimeout(function () {
          selectListClips();
        },
          tempoInstantListClip);
        break;

      case "message":
        if (debug) console.log(msgRecu.text);
        break;

      case "nombreDePatternsPossibleEnListe":
        if (debug) console.log("socket : nombreDePatternsPossibleEnListe: msgRecu: ", msgRecu.nombreDePatternsPossible);
        var nombreDePatternsPossibleEnListe = msgRecu.nombreDePatternsPossible;
        var flagFin = false;

        // Mise à jour du suivi des longueurs de listes d'abord / au groupe
        for (var i = 0; i < nombreDePatternsPossibleEnListe.length; i++) {
          if (nombreDePatternsPossibleEnListe[i][1] === monGroupe) {
            nombreDePatternsPossible = nombreDePatternsPossibleEnListe[i][0];
            flagFin = true;
            break;
          }
        }
        if (!flagFin) {
          // Sinon en fonction du broadcast 255
          for (var i = 0; i < nombreDePatternsPossibleEnListe.length; i++) {
            if (nombreDePatternsPossibleEnListe[i][1] === 255) {
              nombreDePatternsPossible = nombreDePatternsPossibleEnListe[i][0];
              break;
            }
          }
        }
        if (debug1) console.log("Reçu socket : nombreDePatternsPossible:nombreSonsPossibleInit ", nombreDePatternsPossible);
        break;

      case "patternSequenceAck":
        if (debug1) console.log("Reçu socket : patternSequenceAck: score ", msgRecu.score);
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
  //var index = monGroupe;
  //msg.pseudo = pseudo;
  if (debug) console.log("simulateur.js:initialisation: PSEUDO ", pseudo);
  sendPseudo(pseudo);
}
exports.initialisation = initialisation;

function init(port) {
  //listenMachine = makeListenMachine();
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

  msg.type = "selectAllClips";
  msg.groupe = monGroupe;
  ws.send(JSON.stringify(msg));
}

// Demande au serveur de lancer le clip
var compteurTest = 0;
function startClip(indexChoisi) {

  if (indexChoisi == -1) return -1; // Protection sur un choix sans selection au départ
  msg.pseudo = pseudo; //noms[index];

  msg.type = "DAWStartClip";
  msg.clipChoisi = listClips[indexChoisi];

  compteurTest++;
  console.log("startClip:", compteurTest, " :", listClips[indexChoisi][3], "par", pseudo);
  //msg.pseudo = pseudo;
  msg.groupe = monGroupe;
  ws.send(JSON.stringify(msg));
  indexChoisi = -1;
}
exports.startClip = startClip;

// ========================= Lancement du simulateur =================
init(port);

// Le principe est de demander la liste des clips périodiquement.
// Le serveur renvoie la liste avec le message "listClips" et on envoie alors 
// un clip au hasard dans la liste disponible.
// C'est bavard au niveau réseau cas on sollicite abusivement le serveur sur les listes de clip
// mais c'est une simulation.

setTimeout(() => selectListClips(), 1000);

//selectListClips();

