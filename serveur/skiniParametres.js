
// Generated by Skini: Tue May 07 2024 12:04:49 GMT+0200 (heure d’été d’Europe centrale)
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
exports.tempoMax = 5000; // En ms
exports.tempoMin = 4500; // En ms
exports.limiteDureeAttente = 200; // En pulsations

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
exports.soundFilesPath1 = "opus4";

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
exports.algoGestionFifo = 1;
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

exports.sensorOSC = false;
exports.tempoSensorsInit = [0,0,0,0,0,0,0,0,,,,];
exports.sensorsSensibilities = [5,5,5,5,5,5,5,5,,,,];

const groupesDesSons = [
  [ "saxo",1, "group",401,200,21,"#4CAF50",[],10 ],
  [ "nappeViolons",2, "group",100,500,20,"#BCA104",[],1 ],
  [ "nappe2Violons",3, "group",100,600,20,"#797bbf",[],1 ],
  [ "Piano1Intro1",10, "tank",100,51,1,"#5F6262",[],1 ],
  [ "Piano1Intro2",11, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Intro3",12, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Intro4",13, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Intro5",14, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Intro6",15, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Intro7",16, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Milieu1",17, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Milieu2",18, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Milieu3",19, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Milieu4",20, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Milieu5",21, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Milieu6",22, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Milieu7",23, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Fin1",24, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Fin2",25, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Fin3",26, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Fin4",27, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Fin5",28, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Fin6",29, "tank",,,1,"#5F6262",[], ],
  [ "Piano1Fin7",30, "tank",,,1,"#5F6262",[], ],
  [ "SaxIntro1",31, "tank",400,51,2,"#5F6262",[],1 ],
  [ "SaxIntro2",32, "tank",,,2,"#5F6262",[], ],
  [ "SaxIntro3",33, "tank",,,2,"#5F6262",[], ],
  [ "SaxIntro4",34, "tank",,,2,"#5F6262",[], ],
  [ "SaxIntro5",35, "tank",,,2,"#5F6262",[], ],
  [ "SaxIntro6",36, "tank",,,2,"#5F6262",[], ],
  [ "SaxIntro7",37, "tank",,,2,"#5F6262",[], ],
  [ "SaxMilieu1",38, "tank",,,2,"#5F6262",[], ],
  [ "SaxMilieu2",39, "tank",,,2,"#5F6262",[], ],
  [ "SaxMilieu3",40, "tank",,,2,"#5F6262",[], ],
  [ "SaxMilieu4",41, "tank",,,2,"#5F6262",[], ],
  [ "SaxMilieu5",42, "tank",,,2,"#5F6262",[], ],
  [ "SaxMilieu6",43, "tank",,,2,"#5F6262",[], ],
  [ "SaxMilieu7",44, "tank",,,2,"#5F6262",[], ],
  [ "SaxFin1",45, "tank",,,2,"#5F6262",[], ],
  [ "SaxFin2",46, "tank",,,2,"#5F6262",[], ],
  [ "SaxFin3",47, "tank",,,2,"#5F6262",[], ],
  [ "SaxFin4",48, "tank",,,2,"#5F6262",[], ],
  [ "SaxFin5",49, "tank",,,2,"#5F6262",[], ],
  [ "SaxFin6",50, "tank",,,2,"#5F6262",[], ],
  [ "SaxFin7",51, "tank",,,2,"#5F6262",[], ],
  [ "BrassIntro1",52, "tank",700,51,3,"#039879",[],1 ],
  [ "BrassIntro2",53, "tank",,,3,"#039879",[], ],
  [ "BrassIntro3",54, "tank",,,3,"#039879",[], ],
  [ "BrassIntro4",55, "tank",,,3,"#039879",[], ],
  [ "BrassIntro5",56, "tank",,,3,"#039879",[], ],
  [ "BrassIntro6",57, "tank",,,3,"#039879",[], ],
  [ "BrassIntro7",58, "tank",,,3,"#039879",[], ],
  [ "BrassMilieu1",59, "tank",,,3,"#039879",[], ],
  [ "BrassMilieu2",60, "tank",,,3,"#039879",[], ],
  [ "BrassMilieu3",61, "tank",,,3,"#039879",[], ],
  [ "BrassMilieu4",62, "tank",,,3,"#039879",[], ],
  [ "BrassMilieu5",63, "tank",,,3,"#039879",[], ],
  [ "BrassMilieu6",64, "tank",,,3,"#039879",[], ],
  [ "BrassMilieu7",65, "tank",,,3,"#039879",[], ],
  [ "BrassFin1",66, "tank",,,3,"#039879",[], ],
  [ "BrassFin2",67, "tank",,,3,"#039879",[], ],
  [ "BrassFin3",68, "tank",,,3,"#039879",[], ],
  [ "BrassFin4",69, "tank",,,3,"#039879",[], ],
  [ "BrassFin5",70, "tank",,,3,"#039879",[], ],
  [ "BrassFin6",71, "tank",,,3,"#039879",[], ],
  [ "BrassFin7",72, "tank",,,3,"#039879",[], ],
  [ "Percu1",73, "tank",800,600,4,"#039879",[],1 ],
  [ "Percu2",74, "tank",,,4,"#039879",[], ],
  [ "Percu3",75, "tank",,,4,"#039879",[], ],
  [ "Percu4",76, "tank",,,4,"#039879",[], ],
  [ "Percu5",77, "tank",,,4,"#039879",[], ],
  [ "Percu6",78, "tank",,,4,"#039879",[], ],
  [ "Percu7",79, "tank",,,4,"#039879",[], ],
  [ "FluteIntro1",80, "tank",400,400,5,"#039879",[],1 ],
  [ "FluteIntro2",81, "tank",,,5,"#039879",[], ],
  [ "FluteIntro3",82, "tank",,,5,"#039879",[], ],
  [ "FluteIntro4",83, "tank",,,5,"#039879",[], ],
  [ "FluteIntro5",84, "tank",,,5,"#039879",[], ],
  [ "FluteIntro6",85, "tank",,,5,"#039879",[], ],
  [ "FluteIntro7",86, "tank",,,5,"#039879",[], ],
  [ "FluteMilieu1",87, "tank",,,5,"#039879",[], ],
  [ "FluteMilieu2",88, "tank",,,5,"#039879",[], ],
  [ "FluteMilieu3",89, "tank",,,5,"#039879",[], ],
  [ "FluteMilieu4",90, "tank",,,5,"#039879",[], ],
  [ "FluteMilieu5",91, "tank",,,5,"#039879",[], ],
  [ "FluteMilieu6",92, "tank",,,5,"#039879",[], ],
  [ "FluteMilieu7",93, "tank",,,5,"#039879",[], ],
  [ "FluteFin1",94, "tank",,,5,"#039879",[], ],
  [ "FluteFin2",95, "tank",,,5,"#039879",[], ],
  [ "FluteFin3",96, "tank",,,5,"#039879",[], ],
  [ "FluteFin4",97, "tank",,,5,"#039879",[], ],
  [ "FluteFin5",98, "tank",,,5,"#039879",[], ],
  [ "FluteFin6",99, "tank",,,5,"#039879",[], ],
  [ "FluteFin7",100, "tank",,,5,"#039879",[], ],
  [ "Flesh",110, "group",100,350,7,"#008CBA",[],1 ],
  [ "Massive",111, "group",100,400,7,"#008CBA",[],1 ],
  ];
exports.groupesDesSons = groupesDesSons;
