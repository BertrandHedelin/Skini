"use hopscript"

/***************** Techno ********************************************

Pièce pour Bitwig Studio

© Copyright 2019-2021, B. Petit-Hédelin

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
exports.serverIPAddressPublic = ipConfig.serverIPAddressPublic;

exports.busMidiAbleton = 6; // Indispensable

// Pour charger les fonctions et modules de scenes de type GOLEM
exports.scenesON = false;

/********************************************************

AUTOMATE HIPHOP

*********************************************************/
// Les fichiers Hiphop que décrivent les trajets
// Les signaux à utiliser dans ces programmes sont décrirs dans groupeDesSons

exports.automate1 = './autoJouerLeBonInstrument1-1';
exports.automate2 = './autoJouerLeBonInstrument1-2';
exports.automate3 = './autoJouerLeBonInstrument1-3';

// Pour un automate conforme à un rechargement selon les déclarations de module HipHop
exports.canBeReloaded = true;

exports.reactOnPlay = false;

exports.shufflePatterns = true;

/************************************
FICHIERS DES CLIPS CSV
************************************/
// Fichiers CSV à mettre dans l'ordre selon les choix dans le controleur
// mise à jour dans websocketServer, sur demande client "loadAbletonTable"

exports.configClips = [
"./pieces/jouerLeBonInstrument1.csv",
"./pieces/jouerLeBonInstrument1.csv",
"./pieces/jouerLeBonInstrument1.csv"
];

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans la contrôleur.
Nom du sous répartoire ./sounds/xxxx
*************************************/
exports.soundFilesPath1 = "funkBitwig";
exports.soundFilesPath2 = "funkBitwig";
exports.soundFilesPath3 = "funkBitwig";

/***************************************
CHEMIN DES PARTITIONS DES PATTERNS ET CONFIG AVEC MUSICIENS
****************************************/
exports.avecMusicien = false; // Pour mettre en place les spécificités au jeu avec des musiciens.
exports.decalageFIFOavecMusicien = 4; // Décalage de la FIFO vide avant le premier pattern dans une FIFO.
exports.patternScorePath1 = "jouerLeBonInstrument1";
exports.patternScorePath2 = "jouerLeBonInstrument1";
exports.patternScorePath3 = "jouerLeBonInstrument1";

/*****************************************************************************

Gestion de la Matrice des possibles
Automate de gestion de la matrice des possibles

******************************************************************************/
exports.nbeDeGroupesClients = 3;
exports.simulatorInAseperateGroup = true; // Si true, le dernier groupe client est réservé au simulateur.

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
  // Pour group: nom du groupe (0), index du groupe (1), type (2), x(3), y(4), nbe d'éléments(5), color(6), prédécesseurs(7), n° de scène graphique
  ["solo1",  1, "group", 170,100, 20, rouge, 	[], 1 ], 
  ["solo2",  2, "group", 20, 240, 20, orange, 	[], 1 ], 
  ["solo3",  3, "group", 170,580, 20, gris, 	[], 1 ], 
  ["solo4",  4, "group", 20, 380, 20, terre, 	[], 1 ], 
  ["solo5",  5, "group", 350,580, 20, rouge, 	[], 1 ], 
  ["piano",  6, "group", 540,100, 20, violet, 	[], 1 ],
  ["bass", 	 7, "group", 740,480, 20, bleu, 	[], 1 ], 		
  ["drums",	 8, "group", 540,580, 20, vert, 	[], 1 ]
]

// Nomage des groupes de son
exports.groupesDesSons = [ groups, groups, groups];
