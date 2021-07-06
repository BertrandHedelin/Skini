"use hopscript"


/***************** Psaume 23 ********************************************
Mars-avril 2020

Psaume 23 met en place plusieurs concepts:  
1: musicien 2:groupe avec simulateur
3:réorg des fifos 4:patterns de longueurs différentes
5:timerdivision à 1 donc desynchro des patterns 
==========================================================================*/

exports.outportProcessing =  10000; // Automate vers Processing visu
exports.outportForMIDI =     12000; // Automate vers Processing OSC -> Midi
exports.portWebSocket =      13000; // Port de réception
exports.outportLumiere =      7700;
exports.inportLumiere =       9999;
exports.portOSCFromAbleton =  9000;

var ipConfig = require("./ipConfig.json");
exports.remoteIPAddressImage = ipConfig.remoteIPAddressImage; // IP du serveur Processing pour la Visu
exports.remoteIPAddressSound = ipConfig.remoteIPAddressSound; // IP du serveur Procesing pour les commandes MIDI REAPER
exports.remoteIPAddressAbleton = ipConfig.remoteIPAddressAbleton; // IP du serveur Procesing pour les commandes MIDI Ableton
exports.remoteIPAddressLumiere = ipConfig.remoteIPAddressLumiere; // Application QLC+
exports.serverIPAddress = ipConfig.serverIPAddress; // IP du serveur pour les Websockets, donc de cette machine
						    // Ne pas utiliser 127.0.0.1 ni localshot ça pose pb avec les websockets

// Indexation des bus Midi dans Processing, revoir ce nommage qui est trop statique
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

exports.automate1 = '';
exports.automate2 = './autoPsaume23';
exports.automate3 = '';

/************************************
FICHIERS DES CLIPS CSV
************************************/
// Fichiers CSV à mettre dans l'ordre selon les choix dans le controleur
// mise à jour dans websocketServer, sur demande client "loadAbletonTable"

exports.configClips = [
"",
"./pieces/psaume23.csv",
""
];

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans la contrôleur.
Nom du sous répartoire ./sounds/xxxx
*************************************/
exports.soundFilesPath1 = "";
exports.soundFilesPath2 = "psaume23";
exports.soundFilesPath3 = "";

/***************************************
CHEMIN DES PARTITIONS DES PATTERNS ET CONFIG AVEC MUSICIENS
****************************************/
exports.avecMusicien = true; // Pour mettre en place les spécificités au jeu avec des musiciens.
exports.decalageFIFOavecMusicien = 8; // Décalage de la FIFO vide avant le premier pattern dans une FIFO.
exports.patternScorePath1 = "";
exports.patternScorePath2 = "psaume23";
exports.patternScorePath3 = "";

/****************************************
ACTIVATION D'ALGORITHME D'ORGANISATION DES FIFOs
0 par d'algorithme.
1 algorithme de réorganisation Début, Milieu, Fin, Neutre (DFMN)
Dans le csv, D -> 1, M -> 2, F->3, N->4 (c'est fixé dans controelABleton.js)
undefined pas de traitement
1 premier type d'algorithme
X à créer...
*****************************************/
exports.algoGestionFifo = 1;

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
exports.timer3  = 0;

exports.timerDivision1  = 0; 
exports.timerDivision2  = 4; 
exports.timerDivision3  = 0; 

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
exports.groupesDesSons = [
[],
[  // Psaume23
  // nom du groupe, index, type, x, y, nbe d'éléments, color, prédécesseurs
  ["versets",  0, "group", 10, 100, 18, vert, [] ],          // 0
  ["expressions", 1, "group",330, 100, 18, bleu, [] ],
  ["melodies", 2, "group",560, 100, 12, gris, [] ],
  ["synthe", 3, "group",10, 300, 18, violet, [] ],
  ["effetPur", 4, "group",330, 300, 10, grisvert, [] ],
  ["effets", 5, "group",560, 300, 9, marron, [] ]
],
[]
];

/************************************

CONFIGURATION DU SEQUENCEUR

***********************************/

//  Indexation des bus Midi dans Processing
//  pour les séquenceurs. Max 6 instruments.
exports.busMidiInstrumentSequenceur     = [0, 1, 2, 3, 4, 5];   // Ce tableau fixe le nombre d'instruments en plus des bus
exports.canauxMidiInstrumentSequenceur  = [1, 1, 1, 1, 1, 1];
exports.udpPortForRecorder              = [8000, 8001, 8002, 8003, 8004, 8005]; // Ecoute OSC dans Ableton Live
exports.tracksForRecorder               = [11, 12, 13, 14 , 15, 16]; // Index des tracks d'Ableton où sont les instruments

exports.sequencerFilePath = './sequencesSkini/';
exports.sequencerSoundFilePath = './sounds/techno/';

const tripleCrocheTR = 2;
const tripleCrocheR = 3;
const doubleCrocheTR = 4;
const doubleCrocheR = 6;
const crocheTR = 8;
const crocheR = 12;
const noireTR = 16;
const noireR = 24;
const blancheTR = 32;
const blancheR = 48;
const rondeTR = 64;
const rondeR = 96;

exports.tempsMesure = 4;        // Partie haute de la mesure, nombre de temps dans la mesure
exports.divisionMesure = noireR;  // Partie basse de la mesure
exports.nbeDeMesures = 2;
exports.tempo = 108;    // à la minute

exports.notesInstrument = [
  ["POLY",[ // POLYPLEX Heavy Fuel
      ["Tounff",  60], // C
      ["Snare",  62], // D
      ["Tink", 64], // E
      ["Kniff",65], // F
      ["Toum",67],  // G
      ["Waouh",  69], // A
      ["Aounn",  71], // H
      ["Yuaaa",   72] // C
    ]
  ],
  ["FM8",[
    ["La",57],
	["Do",60],
	["Ré",62],
	["Mi",64],
	["Sol",67],	
    ["La",69],
	["Do",72],
	["Ré",74],
	["Mi",76],
	["Sol",79]	
  ]],
  ["MASSIVE",[
    ["La",57],
	["Do",60],
	["Ré",62],
	["Mi",64],
	["Sol",67],	
    ["La",69],
	["Do",72],
	["Ré",74],
	["Mi",76],
	["Sol",79]
  ]],
  ["MONARK",[
    ["La",45],
	["Do",48],
	["Ré",50],
	["Mi",52],
	["Sol",55],	
    ["La",57],
  ]],
    ["KONTAKT",[
      ["Theuhh",86],
      ["Klang",87],
      ["Kling",88],
      ["Tang",89],
      ["Ting",90],
      ["Tong",91],
      ["Dang",92],
      ["Foua",93],
      ["Cloing",94],
      ["Chlang",95],
      ["Chling",96]
  ] ],
    ["ABSYNTH",[
    ["La",57],
	["Do",60],
	["Ré",62],
	["Mi",64],
	["Sol",67],	
    ["La",69],
	["Do",72],
	["Ré",74],
	["Mi",76],
	["Sol",79]
  ] ]
];

