"use hopscript"


/***************** OPUS 4 - 2020 *****************************

© Copyright 2019-2020, B. Petit-Heidelein

==============================================================*/

exports.outportProcessing =  10000; // Automate vers Processing visu
exports.outportForMIDI =     12000; // Automate vers Processing OSC -> Midi
exports.portWebSocket =      13000; // Port de récéption des commandes OSC
exports.outportLumiere =      7700;
exports.inportLumiere =       9999;
exports.portOSCFromAbleton =  9000;
exports.portOSCToGame =       9002;
exports.portOSCFromGame =     9001;

var ipConfig = require("./ipConfig.json");
exports.remoteIPAddressImage = ipConfig.remoteIPAddressImage; // IP du serveur Processing pour la Visu
exports.remoteIPAddressSound = ipConfig.remoteIPAddressSound; // IP du serveur Procesing pour les commandes MIDI REAPER
exports.remoteIPAddressAbleton = ipConfig.remoteIPAddressAbleton; // IP du serveur Procesing pour les commandes MIDI Ableton
exports.remoteIPAddressLumiere = ipConfig.remoteIPAddressLumiere; // Application QLC+
exports.serverIPAddress = ipConfig.serverIPAddress; // IP du serveur pour les Websockets, donc de cette machine
exports.remoteIPAdressGame = ipConfig.remoteIPAddressGame;

// Dans ipConfig, ne pas utiliser 127.0.0.1 ni localshot si vous souhaitez utiliser des clients sur des marchines autres que le serveur.

// Indexation des bus Midi dans Processing, revoir ce nomage qui est trop statique
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

// La synchro midi est émise par processing qui la reçoit d'Ableton ou autre source
exports.synchoOnMidiClock = true;

// Les timers ne sont utilisés que si la synchro MIDI est inactive.
exports.timer1  = 3000;  // 80 sur une mesure 4/4
exports.timer2  = 450 * 4; // Tempo de 120 sur une mesure 4/4
exports.timer3  = 550 * 4; // Tempo 108

// Ces données sont trés sensibles sur le bon déroulement de l'interaction
// Elles sont gérables depuis l'automate
// Nombre de noires dans un pattern.
exports.timerDivision1  = 4; 
exports.timerDivision2  = 4; 
exports.timerDivision3  = 8; 

exports.reactOnPlay = true;

/********************************************************
AUTOMATE HIPHOP
*********************************************************/
// Les fichiers Hiphop que décrivent les trajets
// Les signaux à utiliser dans ces programmes sont décrirs dans groupeDesSons

exports.automate1 = './autoGaming1-2';
exports.automate2 = '';
exports.automate3 = '';

exports.canBeReloaded = true;

/************************************
FICHIERS DES CLIPS CSV
************************************/
// Fichiers CSV à mettre dans l'ordre selon les choix dans le controleur
// mise à jour dans websocketServer, sur demande client "loadAbletonTable"

exports.configClips = [
"./pieces/gaming1.csv",
"",
""
];

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans le contrôleur.
*************************************/
exports.soundFilesPath1 = "gaming1";
exports.soundFilesPath2 = "";
exports.soundFilesPath3 = "";

/***************************************
CHEMIN DES PARTITIONS DES PATTERNS ET CONFIG AVEC MUSICIENS
****************************************/
exports.avecMusicien = false; // Pour mettre en place les spécificités au jeu avec des musiciens.
exports.decalageFIFOavecMusicien = 4; // Décalage de la FIFO vide avant le premier pattern dans une FIFO.
exports.patternScorePath1 = "";
exports.patternScorePath2 = "";
exports.patternScorePath3 = "";

/****************************************
ACTIVATION D'ALGORITHME D'ORGANISATION DES FIFOs
Si 0 ou undefined pas d'algorithme.
Si 1 algorithme de réorganisation Début, Milieu, Fin, Neutre (DFMN)
Dans le csv, D -> 1, M -> 2, F->3, N->4 (c'est fixé dans controelABleton.js)
Si autre ... à créer...
*****************************************/
exports.algoGestionFifo = 1;

/*****************************************************************************
Gestion de la Matrice des possibles
Automate de gestion de la matrice des possibles
******************************************************************************/
exports.nbeDeGroupesClients = 2;
exports.simulatorInAseperateGroup = false; // Si true, le dernier groupe client est réservé au simulateur.

/* Nomage des groupes de sons

  Pour group: nom du groupe (0), index du groupe dans csv (1), type (2), x(3), y(4), nbe d'éléments(5), color(6), prédécesseurs(7), n° de scène graphique
  Pour tank:  nom du groupe(0), index du groupe dans csv  (1), type(2), x(3), y(4), numéro du tank(5), color(6), prédécesseurs(7), n° de scène graphique

  CONTAINTES:
  Les index des groupes doivent se suivre. On ne peut pas ajouter un groupe n'importe où dans le tableau.
  (l'index est utilisé pour les correspondance avec le fichier csv).

  Les éléments d'un même tank doivent impérativement se suivre.
  Les antécédents ne sont pas les index du tableau ci-dessous, ni le n° du groupe.
  En effet, les index du tableau disparaissent dans score quand les "groupes de sons" font partie d'un même tanks 
  sauf pour la première référence au tank.
  Il n'y a pas de correpondance directe entre les index des éléments graphique dans score et ceux 
  du tableau des groupesDesSons.
  
  REMARQUE:
  Les n° des scène graphique sont mis à 0 dans score s'il sont indéfinis dans le tableau groupesDesSons
  Ceci permet une compatibilité ascendante si on ne veut pas gérer plusieurs niveaux de graphisme dans score.

*/

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

  // Pour group: nom du groupe (0), index (1), type (2), x(3), y(4), nbe d'éléments(5), color(6), prédécesseurs(7), n° de scène graphique
  // Pour tank:  nom du groupe(0), index du groupe(1), type(2), x(3), y(4), numéro du tank(5), color(6), prédécesseurs(7), n° de scène graphique
  // Les pédécésseurs sont les index en commentaires.

const groupeOpus4 = [
  ["Percu",   10,  "group",  10,  100, 20, vert, [], 1],
  ["Evolve",  11,  "group",  200,  100, 20, ocre, [], 1],

  ["Massive1", 15,  "tank",  400, 100, 1, gris, [], 1],
  ["Massive2", 16,  "tank",  ,  , 1,  gris, []],  
  ["Massive3", 17,  "tank",  ,  , 1,  gris, []],
  ["Massive4", 18,  "tank",  ,  , 1,  gris, []],
  ["Massive5", 19,  "tank",  ,  , 1,  gris, []],
  ["Massive6", 20,  "tank",  ,  , 1,  gris, []],

  ["RiseHit1", 31,  "tank",  ,  , 2,  gris, []], 
  ["RiseHit2", 32,  "tank",  ,  , 2,  gris, []],  
  ["RiseHit3", 33,  "tank",  ,  , 2,  gris, []],
  ["RiseHit4", 34,  "tank",  ,  , 2,  gris, []],
  ["RiseHit5", 35,  "tank",  ,  , 2,  gris, []],
  ["RiseHit6", 36,  "tank",  ,  , 2,  gris, []],

  ["Damage",  40,  "group",  500,  100, 20, ocre, [], 1],
  ["Violons", 41,  "group",  700,  100, 20, ocre, [], 1],

  ["Cors1", 50, "tank",  10,  300, 3, gris, [], 1],
  ["Cors2", 51, "tank",  ,  , 3,  gris, []],  
  ["Cors3", 52, "tank",  ,  , 3,  gris, []],
  ["Cors4", 53, "tank",  ,  , 3,  gris, []],
  ["Cors5", 54, "tank",  ,  , 3,  gris, []],
  ["Cors6", 55, "tank",  ,  , 3,  gris, []],
  ["Cors7", 56, "tank",  ,  , 3,  gris, []],
  ["Cors8", 57, "tank",  ,  , 3,  gris, []],
  ["Cors9", 58, "tank",  ,  , 3,  gris, []],
  ["Cors10",59, "tank",  ,  , 3,  gris, []],

  ["Round1", 60,  "tank",  300,  300, 4,  gris, []], 
  ["Round2", 61,  "tank",  ,  , 4,  gris, []],  
  ["Round3", 62,  "tank",  ,  , 4,  gris, []],
  ["Round4", 63,  "tank",  ,  , 4,  gris, []],
  ["Round5", 64,  "tank",  ,  , 4,  gris, []],

  ["FluteIntro1", 80,  "tank",  500,  250, 5, grisvert, [], 1],
  ["FluteIntro2", 81,  "tank",  ,  , 5,  grisvert, []],  
  ["FluteIntro3", 82,  "tank",  ,  , 5,  grisvert, []],
  ["FluteIntro4", 83,  "tank",  ,  , 5,  grisvert, []],
  ["FluteIntro5", 84,  "tank",  ,  , 5,  grisvert, []],
  ["FluteIntro6", 85, "tank",  ,  , 5,  grisvert, []],
  ["FluteIntro7", 86, "tank",  ,  , 5,  grisvert, []],

  ["FluteMilieu1", 87,  "tank",  ,  , 5,  grisvert, []], 
  ["FluteMilieu2", 88,  "tank",  ,  , 5,  grisvert, []],  
  ["FluteMilieu3", 89,  "tank",  ,  , 5,  grisvert, []],
  ["FluteMilieu4", 90,  "tank",  ,  , 5,  grisvert, []],
  ["FluteMilieu5", 91,  "tank",  ,  , 5,  grisvert, []],
  ["FluteMilieu6", 92, "tank",  ,  , 5,  grisvert, []],
  ["FluteMilieu7", 93, "tank",  ,  , 5,  grisvert, []],

  ["FluteFin1", 94,  "tank",  ,  , 5,  grisvert, []],
  ["FluteFin2", 95,  "tank",  ,  , 5,  grisvert, []],  
  ["FluteFin3", 96,  "tank",  ,  , 5,  grisvert, []],
  ["FluteFin4", 97,  "tank",  ,  , 5,  grisvert, []],
  ["FluteFin5", 98,  "tank",  ,  , 5,  grisvert, []],
  ["FluteFin6", 99, "tank",  ,  , 5,  grisvert, []],
  ["FluteFin7", 100, "tank",  ,  , 5,  grisvert, []]

];

exports.groupesDesSons = [ groupeOpus4, [], [] ];

exports.gameOSCIn = [
"porte1",
"porte2",
"porte3",
"porte4",
"porte5",
"porte6",
"porte7",
"porte8",
"porte9",
"porte10",

"bouleTombe",
"jumpOSCIN"
];

exports.gameOSCOut = [
"jumpOsc",
"moveBelicaOsc",
"pillarHeight",
"pillarWidth"
];