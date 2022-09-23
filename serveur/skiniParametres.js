
// Generated by Skini: Fri Sep 23 2022 14:45:14 GMT+0200 (heure d’été d’Europe centrale)
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
exports.tempoMax = 300; // En ms
exports.tempoMin = 100; // En ms
exports.limiteDureeAttente = 33; // En pulsations

/********************************************************
AUTOMATE
*********************************************************/
// Pour un automate conforme à un rechargement selon les déclarations de module HipHop
exports.reactOnPlay = false;

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans la contrôleur.
Nom du sous répartoire ./sounds/xxxx
*************************************/
exports.soundFilesPath1 = "";

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
exports.playBufferMessage = "test";
exports.raspOSCPort = 4000;

// La synchro Midi, Link. Synchro Bitwig OSC par défaut si Midi et Link false.
exports.synchoOnMidiClock = false;
exports.synchroLink = true;
exports.synchroSkini = false;
exports.timer = 500;
exports.gameOSCSignals = false;

exports.sensorOSC = false;
exports.tempoSensorsInit = [0,0,0,0,0,0,0,0];
exports.sensorsSensibilities = [0,0,0,0,0,0,0,0];

const groupesDesSons = [
  [ "groupeVoix0",0, "group",200,100,20,"#CF1919",[],1 ],
  [ "groupeVoix1",1, "group",400,100,20,"#CF1919",[],1 ],
  [ "groupeVoix2",2, "group",600,100,20,"#CF1919",[],1 ],
  [ "groupeVoix3",3, "group",800,100,20,"#CF1919",[],1 ],
  [ "groupeVoix4",4, "group",200,300,20,"#CF1919",[],1 ],
  [ "groupeVoix5",5, "group",400,300,20,"#CF1919",[],1 ],
  [ "percu",6, "group",200,500,20,"#CF1919",[],1 ],
  [ "motif1",7, "group",400,500,20,"#CF1919",[],1 ],
  [ "motif2",8, "group",600,500,20,"#CF1919",[],1 ],
  [ "motif3",9, "group",800,500,20,"#CF1919",[],1 ],
  [ "motif4",10, "group",200,600,20,"#CF1919",[],1 ],
  [ "motif5",11, "group",400,600,20,"#CF1919",[],1 ],
  [ "motif6",12, "group",600,600,20,"#CF1919",[],1 ],
  [ "motif7",13, "group",800,600,20,"#CF1919",[],1 ],
  [ "motif8",14, "group",50,600,20,"#CF1919",[],1 ],
  [ "cloche1",15, "group",150,600,20,"#CF1919",[],1 ],
  [ "cloche2",16, "group",200,600,20,"#CF1919",[],1 ],
  [ "cloche3",17, "group",250,600,20,"#CF1919",[],1 ],
  [ "cloche4",18, "group",300,600,20,"#CF1919",[],1 ],
  [ "Ethereal",19, "group",350,700,20,"#CF1919",[],1 ],
  ];
exports.groupesDesSons = groupesDesSons;
