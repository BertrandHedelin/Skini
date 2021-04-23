"use hopscript"

/* Configuration de l'architecture IP, OSC, Websocket ====================

                websocket en 8080
   SERVEUR <----------------------> CLIENT  OSC OUT: 10000 (vers Processing Visu)
      ^ OSC IN:13000                  ^  ^  OSC OUT: 12000 (vers Processing Midi)
      |                               |  |
      |         |---------------------|  |
      |         |         OSC            | OSC
      v         V                        |
    Processing MIDI                      v
     OSC IN:  12000                  Processing Visu (Uniquement en réception)
     OSC OUT: 13000                   OSC IN: 10000

Le schéma est un peu compliqué car hop ne sait pas traiter le Midi, il
faut passer par Processing (ou autre outil).
L'avantage de Processing est son indépendance vis à vis de l'OS.
Dans cette architecture, il n'y a que le serveur qui doit tourner sous Linux (ou Mac ?).

===========================================================================*/

exports.outportProcessing =  10000; // Automate vers Processing visu
exports.outportForMIDI =     12000; // Automate vers Processing OSC -> Midi
exports.portWebSocket =      13000; // Port de récéption des commandes OSC
exports.outportLumiere =      7700;
exports.inportLumiere =       9000;

var ipConfig = require("./ipConfig.json");
exports.remoteIPAddressImage = ipConfig.remoteIPAddressImage; // IP du serveur Processing pour la Visu
exports.remoteIPAddressSound = ipConfig.remoteIPAddressSound; // IP du serveur Procesing pour les commandes MIDI REAPER
exports.remoteIPAddressAbleton = ipConfig.remoteIPAddressAbleton; // IP du serveur Procesing pour les commandes MIDI Ableton
exports.remoteIPAddressLumiere = ipConfig.remoteIPAddressLumiere; // Application QLC+
exports.serverIPAddress = ipConfig.serverIPAddress; // IP du serveur pour les Websockets, donc de cette machine
						    // Ne pas utiliser 127.0.0.1 ni localshot ça pose pb avec les websockets

// Indexation des bus Midi dans Processing
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

/***************************************************

 Indexation des bus Midi dans Processing
 pour les séquenceurs.

****************************************************/
exports.busMidiInstrumentSequenceur     = [0, 1, 2, 3];
exports.canauxMidiInstrumentSequenceur  = [2, 3, 4, 1];

/*******************************************************

CONTROLE PROCESSING GRAPHIQUE

*******************************************************/
exports.ECRAN_NOIR   = 0;
exports.ATTRACTOR    = 1;
exports.BOUGE_LETTRE = 2;
exports.CAMERA       = 3;
exports.CAMERA_SEUIL = 4;
exports.CAMERA_EDGE  = 5;
exports.CAMERA_BRIGHTNESS = 6;
exports.CAMERA_POINTILLIZE = 7;
exports.CALAME       = 8;
exports.MORPH_LIGNE_CERCLE = 9;
exports.ARAIGNEE  = 10;
exports.CHAOS     = 11;
exports.CHAOS2    = 12;
exports.ABLETON1  = 13;
exports.CHAOS3    = 14;
exports.CHAOS4    = 15;

/********************************************************

AUTOMATE HIPHOP

*********************************************************/
// Les fichiers Hiphop que décrivent les trajets
// Les signaux à utiliser dans ces programmes sont décrirs dans groupeDesSons

exports.automate1 = './autoOrchestre';
exports.automate2 = './autoTechno';
exports.automate3 = './autoWorld';

/*************************************

CHEMIN DES FICHIERS SONS MP3 pour les clients

Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans la contrôleur.

*************************************/

exports.soundFilesPath1 = "";
exports.soundFilesPath2 = "";
exports.soundFilesPath3 = "";

/************************************

FICHIERS DES CLIPS CSV ET MENU CLIENT SELECTEUR

************************************/
// Fichiers CSV à mettre dans l'ordre selon les choix dans le controleur
// mise à jour dans websocketServer, sur demande client "loadAbletonTable"

exports.configClips = [
"./pieces/orchestreV2.csv",
"./pieces/techno.csv",
"./pieces/morinouta.csv",
];

/********************************************************

 ABLETON LIVE

*********************************************************/
exports.tempo_ABL = 20;
// CC undefined dans la norme MIDI. Le controle du tempo dans Ableton ne se fait pas de façon absolu mais
// selon un minimum et un maximum entre lesquels sont affectées des valeurs au controleur midi.
// Ce n'est pas trés évident comme mécanisme.

/*****************************************************************************

Gestion de la Matrice des possibles
Automate de gestion de la matrice des possibles

******************************************************************************/
exports.nbeDeGroupesClients = 2;
exports.simulatorInAseperateGroup = false; // Si true, le dernier groupe client est réservé au simulateur.

// Ces données sont trés sensibles sur le bon déroulement de l'interaction
// Des timers trop lents induisent des "trous" dans l'exécution.
exports.timer1 = 1000 * 4; // Orchestre 1100 * 4 Pour un tempo de 50 sur une mesure 4/4
exports.timer2 = 450 * 4; // Techno Pour un tempo de 120 sur une mesure 4/4
exports.timer3 = 500 * 4; // World 100 à la noire => 0.6s à la noire =>  2.4s


// Ces données sont trés sensibles sur le bon déroulement de l'interaction
// Elles sont gérables depuis l'automate
// Nombre de noires dans un pattern.
exports.timerDivision1  = 4; 
exports.timerDivision2  = 4;
exports.timerDivision3  = 8; 

/***************************************
CHEMIN DES PARTITIONS DES PATTERNS ET CONFIG AVEC MUSICIENS
****************************************/
exports.avecMusicien = false; // Pour mettre en place les spécificités au jeu avec des musiciens.
exports.decalageFIFOavecMusicien = 4; // Décalage de la FIFO vide avant le premier pattern dans une FIFO.

// Dénomination des groupes de sons

exports.groupesDesSons = [
[  // Orchestre
  ["violonsStac", 0],
  ["violonsTrem", 1],
  ["violonsSord", 2],
  ["celloSord",   3],
  ["celloPizz",   4],
  ["celloSust",   5],
  ["contrebasseSust", 6],
  ["contrebassePizz", 7],
  ["clarinettesP", 8],
  ["clarinettesStac", 9],
  ["clarinettesSfz", 10],
  ["flutesSfz", 11],
  ["flutesPhrases", 12],
  ["boisSfz", 13],
  ["corsF", 14],
  ["corsSfz", 15],
  ["trombonesP", 16],
  ["trompettesF", 17],
  ["xylo", 18],
  ["percu", 19],
  ["harpe", 20],
  ["rise", 21]
],
[  // Techno
  ["evolve", 0],
  ["poly", 1],
  ["fm", 2],
  ["massive", 3],
  ["round", 4],
  ["absynth", 5],
  ["drone", 6],
  ["alien", 7],
  ["notes", 8]
],
[  // Morinouta
  ["kettleLa", 0],
  ["kettleSol", 1],
  ["kettleMi", 2],
  ["kettleRe", 3],
  ["kettleDo", 4],
  ["kettleLaGrave", 5],
  ["gong", 6],
  ["cloche", 7],
  ["gangsa", 8],
  ["taikoSimple", 9],
  ["taikoRiche", 10],
  ["flute", 11],
  ["shakuAttaque", 12],
  ["shakuDoux", 13],
  ["FinaleHit", 14]
]
];

/************************************

CONFIGURATION DES INSTUMENTS DU SEQUENCEUR

***********************************/

exports.notesInstrument = [
  ["Drum",[ // POLYPLEX
      ["Kick",  60], // C
      ["KICK",  62], // D
      ["SNARE", 64], // E
      ["HITHAT",65], // F
      ["HITHAT",67],  // G
      ["KICK",  69], // A
      ["CLAP",  71], // H
      ["CYM",   72], // C
    ]
  ],
  ["Lead",[
    ["Debut",50],
    ["Fin",80]
  ]],
  ["Pad",[
    ["Debut",0],
    ["Fin",127]
  ]],
  ["Bass",[
    ["Debut",41],
    ["Fin",65]
  ]],
    ["",[
    ["Debut",10],
    ["Fin",127]
  ]],
   ["",[
    ["Debut",10],
    ["Fin",127]
  ]]
];


// Arbres utilisé dans le selecteur uniquement.
// Arborescences du client selecteur qui doit être en phase avec configClips
// arbre1 <=> configClips[0] ...
// Orchestre
exports.arbre1 = [
  [ // N0
  "cordes", "vents", "percuharpe"
  ],
  [ // N1
    ["violons", "cellos", "contrebasses" ],
    ["bois", "cuivres", "clarinettes"],
    ["percu","xylo","harpe"]
  ]
];

exports.arbre2 = [
  [ // N0
  "gamelan", "percu", "flutes"
  ],
  [ // N1
    ["kettleLaSol", "kettleMiRe", "kettleDoLa" ],
    ["GongCloche", "gangsa", "taiko"],
    ["afrique","shakuAttaque","shakuDoux"]
  ]
];

// Techno
exports.arbre3 = [
  [ // N0
  "beats", "sequences", "sounds"
  ],
  [ // N1
    ["evolve", "poly", "FM" ],
    ["massive", "round", "absynth"],
    ["drone","alien","notes"]
  ]
];

