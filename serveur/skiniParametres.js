
// Generated by Skini: Thu Apr 04 2024 09:19:42 GMT+0200 (heure d’été d’Europe centrale)
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
exports.tempoMax = 400; // En ms
exports.tempoMin = 500; // En ms
exports.limiteDureeAttente = 33; // En pulsations

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
exports.nbeDeGroupesClients = 2;

function setnbeDeGroupesClients(num) {
  this.nbeDeGroupesClients = num;
}
exports.setnbeDeGroupesClients = setnbeDeGroupesClients;

exports.simulatorInAseperateGroup = false; // Si true, le dernier groupe client est réservé au simulateur.

// Pour un contrôle des Raspberries
exports.useRaspberries = false;
exports.playBufferMessage = "test";
exports.raspOSCPort = 4000;

// La synchro Midi, Link. Synchro Bitwig OSC par défaut si Midi et Link false.
exports.synchoOnMidiClock = false;
exports.synchroLink = true;
exports.synchroSkini = false;
exports.timer = 500;
exports.gameOSCSignals = false;

exports.sensorOSC = true;
exports.tempoSensorsInit = [10,10,10,10,10,10,10,10,10,10,10,20];
exports.sensorsSensibilities = [10,200,200,200,200,100,100,500,100,100,100,100];

const groupesDesSons = [
  [ "sensor0",0, "group",350,400,20,"#5F6262",[],1 ],
  [ "sensor1",1, "group",170,100,20,"#CF1919",[],1 ],
  [ "sensor2",2, "group",170,300,20,"#4CAF50",[],1 ],
  [ "sensor3",3, "group",350,100,20,"#5F6262",[],1 ],
  [ "sensor4",4, "group",350,300,20,"#797bbf",[],1 ],
  [ "sensor5",5, "group",550,300,20,"#4CAF50",[],1 ],
  ];
exports.groupesDesSons = groupesDesSons;
