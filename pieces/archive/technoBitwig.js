"use hopscript"

/***************** Techno ********************************************

Pièce pour Bitwig Studio

© Copyright 2019-2021, B. Petit-Heidelein

======================================================================*/

var ipConfig = require("./ipConfig.json");

exports.outportProcessing =  ipConfig.outportProcessing;    // Automate vers Processing visu
exports.outportForMIDI =     ipConfig.OutPortOSCMIDItoDAW;  //12000; // Automate vers Processing OSC -> Midi
exports.portWebSocket =      ipConfig.InPortOSCMIDIfromDAW; //13000; // Port de réception des commandes OSC <- MIDI
exports.outportLumiere =     ipConfig.outportLumiere; // 7700;
exports.inportLumiere =      ipConfig.inportLumiere; // 9000;
exports.distribSequencerPort = ipConfig.distribSequencerPort;
exports.webServerPort = ipConfig.webserveurPort;

exports.remoteIPAddressImage = ipConfig.remoteIPAddressImage; // IP du serveur Processing pour la Visu
exports.remoteIPAddressSound = ipConfig.remoteIPAddressSound; // IP du serveur Procesing
exports.remoteIPAddressAbleton = ipConfig.remoteIPAddressAbleton; // IP du serveur Procesing pour les commandes MIDI Ableton
exports.remoteIPAddressLumiere = ipConfig.remoteIPAddressLumiere; // Application QLC+
exports.serverIPAddress = ipConfig.serverIPAddress; // IP du serveur pour les Websockets, donc de cette machine

exports.busMidiFM8  = 0;
exports.busMidiAbsynth  = 1;
exports.busMidiPrism  = 2;
exports.busMidiGuitarRig = 3;
exports.busMidiReaper = 4;
exports.busMidiMassive = 5;
exports.busMidiAbleton = 6; // Indispensable
exports.busMidiEffetVoix1 = 7;
exports.busMidiEffetVoix2 = 8;
exports.busMidiEffetVoix3 = 9;
exports.busMidiEffetVoix4 = 10;
exports.busMidiQuadri1 = 11;

// Pour charger les fonctions et modules de scenes de type GOLEM
exports.scenesON = false;

/********************************************************

AUTOMATE HIPHOP

*********************************************************/
// Les fichiers Hiphop que décrivent les trajets
// Les signaux à utiliser dans ces programmes sont décrirs dans groupeDesSons

exports.automate1 = './autoTechnoBitwig-1';
exports.automate2 = './autoTechnoBitwig-2';
exports.automate3 = './autoTechnoBitwig-3';

// Pour un automate conforme à un rechargement selon les déclarations de module HipHop
exports.canBeReloaded = true;

exports.reactOnPlay = true;

/************************************
FICHIERS DES CLIPS CSV
************************************/
// Fichiers CSV à mettre dans l'ordre selon les choix dans le controleur
// mise à jour dans websocketServer, sur demande client "loadAbletonTable"

exports.configClips = [
"./pieces/techno.csv",
"./pieces/techno.csv",
"./pieces/techno.csv"
];

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans la contrôleur.
Nom du sous répartoire ./sounds/xxxx
*************************************/
exports.soundFilesPath1 = "techno";
exports.soundFilesPath2 = "techno";
exports.soundFilesPath3 = "techno";

/***************************************
CHEMIN DES PARTITIONS DES PATTERNS ET CONFIG AVEC MUSICIENS
****************************************/
exports.avecMusicien = false; // Pour mettre en place les spécificités au jeu avec des musiciens.
exports.decalageFIFOavecMusicien = 4; // Décalage de la FIFO vide avant le premier pattern dans une FIFO.
exports.patternScorePath1 = "techno";
exports.patternScorePath2 = "techno";
exports.patternScorePath3 = "techno";

/*****************************************************************************

Gestion de la Matrice des possibles
Automate de gestion de la matrice des possibles

******************************************************************************/
exports.nbeDeGroupesClients = 2;
exports.simulatorInAseperateGroup = false; // Si true, le dernier groupe client est réservé au simulateur.

// Ces données sont trés sensibles sur le bon déroulement de l'interaction
// si pas de synchro MIDI
exports.timer1  = 0; 
exports.timer2  = 450 * 4; // Techno Pour un tempo de 120 sur une mesure 4/4
exports.timer3  = 450 * 4;

exports.timerDivision1  = 0; 
exports.timerDivision2  = 4; 
exports.timerDivision3  = 4; 

// La synchro midi est émise par processing qui la reçoit d'Ableton ou autre source
exports.synchoOnMidiClock = true;

const bleu  = "#008CBA";
const rouge = '#CF1919';
const vert  = "#4CAF50";
const marron  = '#666633';
const violet  = '#797bbf';
const orange  = '#b3712d';
const rose = '#E0095F';
const gris = '#5F6262';
const ocre = '#BCA104';
const terre = '#A76611';
const grisvert = '#039879';
const grisbleu = '#315A93';

const groups = [
  // nom du groupe, index, type, x, y, nbe d'éléments, color, prédécesseurs
  ["evolve",  0, "group", 500, 240, 20, rouge, [1] ],   //0 index d'objet graphique
  ["poly", 1, "group",300, 240, 20, bleu, [8] ], 		//1
  ["fm", 2, "group", 270, 100, 20, vert, [], 10 ], 		//2
  ["massive",3, "group",450,100,  20, gris, [], 10 ],	//3
  ["round", 4,"group", 630, 100, 20, terre, [], 10 ], 	//4
  ["absynth", 5, "group", 800,100, 20, violet, [], 10 ],//5
  ["drone", 6, "group", 630, 240, 20, orange, [], 10 ], //6
  ["alien", 7, "group", 270, 240, 20, ocre, [], 10 ],	//7
  ["notes", 8, "group", 100, 240, 20, grisvert, [] ],	//8
  ["pitchable", 9, "group", 800, 340, 20, grisvert, [], 10 ], //9
  ["vocosyn", 10, "group", 100, 400, 20, rouge, [] ],	//10
  ["massive2", 11, "group", 300, 400, 20, bleu, [10] ], //11
  ["reaktor5", 12, "group", 270, 440, 20, grisvert, [], 10 ], //12
  ["reaktor6", 13, "group", 450, 440, 20, vert, [], 10 ], //13
  ["melodie", 14, "group", 500, 400, 20, rose, [11] ]	//14
];

// Nomage des groupes de sons
exports.groupesDesSons = [ groups, groups, groups];
