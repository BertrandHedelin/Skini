"use hopscript"


/***************** Techno ********************************************

A utiliser avec hope.als d'Ableton.
Fonctionne avec le séquenceur distribué.

==========================================================================*/

exports.outportProcessing =  10000; // Automate vers Processing visu
exports.outportForMIDI =     12000; // Automate vers Processing OSC -> Midi
exports.portWebSocket =      13000; // Port de réception des commandes OSC
exports.outportLumiere =      7700;
exports.inportLumiere =       9000;

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
exports.automate2 = '';
exports.automate3 ='./autoHope'; // Avec GrandLoupV3tempo d'Ableton

/************************************
FICHIERS DES CLIPS CSV
************************************/
// Fichiers CSV à mettre dans l'ordre selon les choix dans le controleur
// mise à jour dans websocketServer, sur demande client "loadAbletonTable"

exports.configClips = [
"",
"",
"./pieces/hope.csv"
];

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans la contrôleur.
Nom du sous répartoire ./sounds/xxxx
*************************************/
exports.avecMusicien = false; // Pour mettre en place les spécificités au jeu avec des musiciens.
exports.decalageFIFOavecMusicien = 16; // Décalage de la FIFO vide avant le premier pattern dans une FIFO. Doit être un multiple de timerDivision

exports.patternScorePath1 = "";
exports.patternScorePath2 = "";
exports.patternScorePath3 = "hope";

exports.soundFilesPath1 = "";
exports.soundFilesPath2 = "";
exports.soundFilesPath3 = "hope";

// CC undefined dans la norme MIDI. Le controle du tempo dans Ableton ne se fait pas de façon absolu mais
// selon un minimum et un maximum entre lesquels sont affectées des valeurs au controleur midi.
// Ce n'est pas trés évident comme mécanisme.
exports.tempo_ABL = 20;

/*****************************************************************************

Gestion de la Matrice des possibles
Automate de gestion de la matrice des possibles

******************************************************************************/
exports.nbeDeGroupesClients = 2;
exports.simulatorInAseperateGroup = false; // Si true, le dernier groupe client est réservé au simulateur.

// Ces données sont trés sensibles sur le bon déroulement de l'interaction
exports.timer1  = 3000;  // Opus1, 80 sur une mesure 4/4
exports.timer2  = 450 * 4; // Techno Pour un tempo de 120 sur une mesure 4/4
exports.timer3  = 550 * 4; // Tempo 108

exports.timerDivision1  = 4; 
exports.timerDivision2  = 4;
exports.timerDivision3  = 8; 

// La synchro midi est émise par processing qui la reçoit d'Ableton ou autre source
exports.synchoOnMidiClock = true;
exports.pulsationON = true;

// Nomage des groupes de sons
// Pour group: nom du groupe (0), index (1), type (2), x(3), y(4), nbe d'éléments(5), color(6), prédécesseurs(7), n° de scène graphique(8)
// Pour tank:  nom du groupe(0), index(1), type(2), x(3), y(4), numéro du tank(5), color(6), prédécesseurs(7), n° de scène graphique(8)

const bleu  = '#008CBA';
const rouge = '#CF1919';
const vert  = '#4CAF50';
const marron  = '#666633';
const violet  = '#797bbf';
const orange  = '#b3712d';
const rose = '#E0095F';
const gris = '#5F6262';
const ocre = '#BCA104';
const terre = '#A76611';
const grisvert = '#039879';
const grisbleu = '#315A93';

exports.groupesDesSons = [
[],

[],

[
  ["HopePiano", 0,  "group", 126, 252,  20, bleu,   [] ],
  ["HopeBasseBreak", 1,    "group", 625, 178,  20, rouge,  [], 20 ], // dans une scène pas affichée
  ["HopeWalkingBasse", 2,    "group", 398, 242,  20, vert,   [] ],
  ["HopeBatterie",3, "group", 276, 451,  20, marron, [] ],
  ["HopeSaxo", 4, "group", 401, 77,   20, gris,   [] ],
  ["HopeCornet",     5, "group", 523, 450,  20, ocre,   [] ],
  ["HopeCongas",  6, "group", 702, 325,  20, rose,   [] ],
  ["HopeThemeSax",  7, "group", 702, 325,  20, rose,   [] ],
  ["HopeThemeCornet",  8, "group", 702, 325,  20, rose,   [] ]
]

];

/************************************

CONFIGURATION DU SEQUENCEUR

***********************************/

//  Indexation des bus Midi dans Processing
//  pour les séquenceurs. Max 6 instruments.
exports.busMidiInstrumentSequenceur     = [0, 1, 2, 3, 4, 5]; 	// Ce tableau fixe le nombre d'instruments en plus des bus
exports.canauxMidiInstrumentSequenceur  = [1, 1, 1, 1, 1, 1];

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

// Instruments dans Ableton GrandLoupV3

exports.notesInstrument = [
  ["POLY",[ // POLYPLEX Heavy Fuel
      ["Tounff",  60], // C
      ["Snare",  62], // D
      ["Tink", 64], // E
      ["Kniff",65], // F
      ["Toum",67],  // G
      ["Waouh",  69], // A
      ["Aounn",  71], // H
      ["Yuaaa",   72], // C
    ]
  ],
  ["FM8",[
    ["Debut",61],
    ["Fin",72]
  ]],
  ["MASSIVE",[
    ["Debut",61],
    ["Fin",72]
  ]],
  ["MONARK",[
    ["Debut",49],
    ["Fin",60]
  ] ],
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
      ["Debut",95],
      ["Debut",96]
  ] ],
    ["ABSYNTH",[
      ["Debut",61], // C
      ["Fin",72], // C
  ] ]
];

