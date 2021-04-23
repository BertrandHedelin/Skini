"use hopscript"

/***************** Blues ********************************************

Pour bitwig

==========================================================================*/
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
exports.serverIPAddressPublic = ipConfig.serverIPAddressPublic; // IP du serveur pour les Websockets, donc de cette machine

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

exports.automate1 = './autoBluesSkini-1';
exports.automate2 = './autoBluesSkini-2';
exports.automate3 = './autoBluesSkini-3';

// Pour un automate conforme à un rechargement selon les déclarations de module HipHop
exports.canBeReloaded = true;

exports.reactOnPlay = false;

/************************************
FICHIERS DES CLIPS CSV
************************************/
// Fichiers CSV à mettre dans l'ordre selon les choix dans le controleur
// mise à jour dans websocketServer, sur demande client "loadAbletonTable"

exports.configClips = [
"./pieces/bluesSkini.csv",
"./pieces/bluesSkini.csv",
"./pieces/bluesSkini.csv"
];

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans la contrôleur.
Nom du sous répartoire ./sounds/xxxx
*************************************/
exports.soundFilesPath1 = "bluesSkini";
exports.soundFilesPath2 = "bluesSkini";
exports.soundFilesPath3 = "bluesSkini";

/***************************************
CHEMIN DES PARTITIONS DES PATTERNS ET CONFIG AVEC MUSICIENS
****************************************/
exports.avecMusicien = false; // Pour mettre en place les spécificités au jeu avec des musiciens.
exports.decalageFIFOavecMusicien = 4; // Décalage de la FIFO vide avant le premier pattern dans une FIFO.
exports.patternScorePath1 = "bluesSkini";
exports.patternScorePath2 = "bluesSkini";
exports.patternScorePath3 = "bluesSkini";

/*****************************************************************************

Gestion de la Matrice des possibles
Automate de gestion de la matrice des possibles

******************************************************************************/
exports.nbeDeGroupesClients = 4;
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

// Nomage des groupes de sons
var groupeBluesSkini = [
  // nom du groupe, index, type, x, y, nbe d'éléments, color, prédécesseurs
  ["basse",  0, "group", 126, 176, 30, rouge, [1], 1 ],   // 0 index d'objet graphique
  ["guitareAcc", 1, "group",199, 572, 30, bleu, [], 1 ],  //1
  ["batterie", 2, "group", 420, 50, 30, vert, [0], 1 ],  //2
  ["hammond",3, "group",628,574,  30, gris, [4], 1 ], //3
  ["cuivre", 4,"group", 756, 176, 30, terre, [2], 1 ],  //4

  ["saxo1", 6,  "tank",  427,  200, 1, orange, [], 1], // 5
  ["saxo2", 7,  "tank",  ,  , 1,  orange, []],  
  ["saxo3", 8,  "tank",  ,  , 1,  orange, []],
  ["saxo4", 9,  "tank",  ,  , 1,  orange, []],
  ["saxo5", 10,  "tank",  ,  , 1,  orange, []],
  ["saxo6", 11,  "tank",  ,  , 1,  orange, []], 
  ["saxo7", 12,  "tank",  ,  , 1,  orange, []],  
  ["saxo8", 13,  "tank",  ,  , 1,  orange, []],
  ["saxo9", 14,  "tank",  ,  , 1,  orange, []],
  ["saxo10", 15,  "tank",  ,  , 1,  orange, []],
  ["saxo11", 16, "tank",  ,  , 1,  orange, []],
  ["saxo12", 17, "tank",  ,  , 1,  orange, []],
  ["saxo13", 18,  "tank",  ,  , 1,  orange, []],

  ["guitareSolo1", 20,  "tank",  427,  400, 2, violet, [], 1],// 6
  ["guitareSolo2", 21,  "tank",  ,  , 2,  violet, []],  
  ["guitareSolo3", 22,  "tank",  ,  , 2,  violet, []],
  ["guitareSolo4", 23,  "tank",  ,  , 2,  violet, []],
  ["guitareSolo5", 24,  "tank",  ,  , 2,  violet, []],
  ["guitareSolo6", 25,  "tank",  ,  , 2,  violet, []], 
  ["guitareSolo7", 26,  "tank",  ,  , 2,  violet, []],  
  ["guitareSolo8", 27,  "tank",  ,  , 2,  violet, []],
  ["guitareSolo9", 28,  "tank",  ,  , 2,  violet, []],
  ["guitareSolo10", 29,  "tank",  ,  , 2,  violet, []],
  ["guitareSolo11", 30, "tank",  ,  , 2,  violet, []],
  ["guitareSolo12", 31, "tank",  ,  , 2,  violet, []],
  ["guitareSolo13", 32,  "tank",  ,  , 2,  violet, []]
];

exports.groupesDesSons = [ groupeBluesSkini, groupeBluesSkini, groupeBluesSkini ];