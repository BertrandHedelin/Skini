
// Generated by Skini: Sat Mar 25 2023 15:10:12 GMT+0100 (heure normale d’Europe centrale)
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
exports.directMidiON = true;

// Pour charger les fonctions et modules de scenes de type GOLEM
exports.scenesON = false;

exports.english = true;

/***********************************
  Paramètres du simulateur
  Si ces valeurs ne sont pas données c'est celle qui
  sont dans le simulateur qui sont utilisées
************************************/
exports.tempoMax = 2000; // En ms
exports.tempoMin = 1000; // En ms
exports.limiteDureeAttente = 500; // En pulsations

/********************************************************
AUTOMATE
*********************************************************/
// Pour un automate conforme à un rechargement selon les déclarations de module HipHop
exports.reactOnPlay = false;

// Pour une réaction à chaque pulsation
exports.pulsationON = false;

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Nom du sous répartoire ./sounds/xxxx
*************************************/
exports.soundFilesPath1 = "moduleIZ";

/***************************************
CHEMIN DES PARTITIONS DES PATTERNS ET CONFIG AVEC MUSICIENS
****************************************/
exports.avecMusicien = false; // Pour mettre en place les spécificités au jeu avec des musiciens.
exports.decalageFIFOavecMusicien = 4; // Décalage de la FIFO vide avant le premier pattern dans une FIFO.
exports.patternScorePath1 ="";

/****************************************
ACTIVATION D'ALGORITHME D'ORGANISATION DES FIFOs
Si 0 ou undefined pas d'algorithme.
Si 1 algorithme de réorganisation Début, Milieu, Fin, Neutre (DFMN)
Dans le csv, D -> 1, M -> 2, F->3, N->4 (c'est fixé dans controleAbleton.js)
Si autre ... à créer...
ATTENTION: NE JAMAIS UTILISER EN SITUATION D'INTERACTION SI L'ALGORITHME
PEUT SUPPRIMER DES PATTERNS DES FIFOs
*****************************************/
exports.algoGestionFifo = 0;
exports.shufflePatterns = false;
/*****************************************************************************

Gestion de la Matrice des possibles
Automate de gestion de la matrice des possibles

******************************************************************************/
exports.nbeDeGroupesClients = 3;

function setnbeDeGroupesClients(num) {
  this.nbeDeGroupesClients = num;
}
exports.setnbeDeGroupesClients = setnbeDeGroupesClients;

exports.simulatorInAseperateGroup = false; // Si true, le dernier groupe client est réservé au simulateur.

// Pour un contrôle des Raspberries
exports.useRaspberries = false;
exports.playBufferMessage = "play";
exports.raspOSCPort = 4000;

// La synchro Midi, Link. Synchro Bitwig OSC par défaut si Midi et Link false.
exports.synchoOnMidiClock = false;
exports.synchroLink = true;
exports.synchroSkini = false;
exports.timer = 500;
exports.gameOSCSignals = false;

exports.sensorOSC = true;
exports.tempoSensorsInit = [10,10,10,10,10,10,10,10];
exports.sensorsSensibilities = [100,100,100,100,100,100,100,500];

const groupesDesSons = [
  [ "zone1",1, "group",170,100,20,"#CF1919",[],1 ],
  [ "zone2",2, "group",170,300,20,"#4CAF50",[],1 ],
  [ "zone3",3, "group",350,100,20,"#5F6262",[],1 ],
  [ "zone4",4, "group",350,300,20,"#797bbf",[],1 ],
  [ "",, "",,,,"",[], ],
  ];
exports.groupesDesSons = groupesDesSons;
