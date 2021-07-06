"use hopscript"


// ***************** OPUS 2 - 2019 *****************************

/* Configuration de l'architecture IP, OSC, Websocket ====================

                websocket en 8080
   SERVEUR <----------------------> CLIENT  OSC OUT: 10000 (vers Processing Visu)
      ^ OSC IN:13000                  ^  ^  OSC OUT: 12000 (vers Processing Midi)
      |                                            |  |
      |         |----------------------------|  |
      |         |         OSC                    | OSC
      v         V                                  |
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
exports.inportLumiere =       9999;
exports.portOSCFromAbleton =  9000;

var ipConfig = require("./ipConfig.json");
exports.remoteIPAddressImage = ipConfig.remoteIPAddressImage; // IP du serveur Processing pour la Visu
exports.remoteIPAddressSound = ipConfig.remoteIPAddressSound; // IP du serveur Procesing pour les commandes MIDI REAPER
exports.remoteIPAddressAbleton = ipConfig.remoteIPAddressAbleton; // IP du serveur Procesing pour les commandes MIDI Ableton
exports.remoteIPAddressLumiere = ipConfig.remoteIPAddressLumiere; // Application QLC+
exports.serverIPAddress = ipConfig.serverIPAddress; // IP du serveur pour les Websockets, donc de cette machine
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
exports.timer1  = 3000;  // Opus1, 80 sur une mesure 4/4
exports.timer2  = 450 * 4; // Techno Pour un tempo de 120 sur une mesure 4/4
exports.timer3  = 550 * 4; // Tempo 108

// Ces données sont trés sensibles sur le bon déroulement de l'interaction
// Nombre de noires dans un pattern.
exports.timerDivision1  = 4; 
exports.timerDivision2  = 4; 
exports.timerDivision3  = 8; 

exports.reactOnPlay = false;

/********************************************************
AUTOMATE HIPHOP
*********************************************************/
// Les fichiers Hiphop que décrivent les trajets
// Les signaux à utiliser dans ces programmes sont décrirs dans groupeDesSons

exports.automate1 = './autoOpus2-2';
exports.automate2 = '';
exports.automate3 = '';

// L'automate est conforme à un rechargement selon les déclarations de module HipHop
exports.canBeReloaded = false;

/************************************
FICHIERS DES CLIPS CSV
************************************/
// Fichiers CSV à mettre dans l'ordre selon les choix dans le controleur
// mise à jour dans websocketServer, sur demande client "loadAbletonTable"

exports.configClips = [
"./pieces/opus2.csv",
"",
""
];

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans la contrôleur.
*************************************/
exports.soundFilesPath1 = "opus2";
exports.soundFilesPath2 = "";
exports.soundFilesPath3 = "";

exports.algoGestionFifo = 0;

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
  // La scéne Tonal n'est pas utilisé au 25/08/2019
const groupeOpus2 = [
  ["violonsBleu", 0,  "group",  695,  200, 15, bleu, [6], 3],  //0
  ["violonsRouge1",1, "group",  38,  251, 15,  rouge, [], 2],  //1
  ["violonsRouge2",2,  "group",  551,  52, 15, rouge, [24], 2],  //2
  ["violonsJaune", 3,  "group",  448,  74, 20, ocre, [], 4],    //3
  ["violonsTonal", 4,  "group",  800,  270, 3, rose, [9], 20], //4

  ["violonsNoir1", 5,  "tank",  352,  51, 1, gris, [19], 1], //5
  ["violonsNoir2", 6,  "tank",  ,  , 1,  gris, []],  
  ["violonsNoir3", 7,  "tank",  ,  , 1,  gris, []],
  ["violonsNoir4", 8,  "tank",  ,  , 1,  gris, []],
  ["violonsNoir5", 9,  "tank",  ,  , 1,  gris, []],
  ["violonsNoir6", 10, "tank",  ,  , 1,  gris, []],
  ["violonsNoir7", 11, "tank",  ,  , 1,  gris, []],
  ["violonsNoir8", 12, "tank",  ,  , 1,  gris, []],
  ["violonsNoir9", 13, "tank",  ,  , 1,  gris, []],
  ["violonsNoir10", 14,"tank",  ,  , 1,  gris, []],

  ["altosBleu", 15,  "group",  543,  357, 15, bleu, [14], 3], //6
  ["altosJaune", 16,  "group",  224,  224, 20, ocre, [], 4], // 7

  ["cellosBleu", 17, "group",  82,  198, 15, bleu, [], 3], // 8
  ["cellosRouge1", 18, "group",  250,  198, 15, rouge, [1], 2], //9
  ["cellosRouge2", 19,  "group",  553,  144, 15, rouge, [9], 2], // 10
  ["cellosJaune", 20,  "group",  675,  225, 20, vert, [], 4], // 11
  ["cellosTonal", 21,  "group",  600,  200, 3, vert, [], 20], // 12

  ["cellosNoir1", 22,  "tank",  350,  427, 2, grisbleu, [19], 1], // 13
  ["cellosNoir2", 23,  "tank",  ,  , 2, grisbleu, []],
  ["cellosNoir3", 24,  "tank",  ,  , 2, grisbleu, []],
  ["cellosNoir4", 25,  "tank",  ,  , 2, grisbleu, []],
  ["cellosNoir5", 26,  "tank",  ,  , 2, grisbleu, []],
  ["cellosNoir6", 27,  "tank",  ,  , 2, grisbleu, []],
  ["cellosNoir7", 28,  "tank",  ,  , 2, grisbleu, []],    
  ["cellosNoir8", 29,  "tank",  ,  , 2, grisbleu, []],
  ["cellosNoir9", 30,  "tank",  ,  , 2, grisbleu, []],
  ["cellosNoir10",31,  "tank",  ,  , 2, grisbleu, []],

  ["contrebassesBleu", 32,  "group",  375,  201, 15, vert, [18], 3], //14
  ["contrebassesRouge1", 33,  "group",  391,  398, 15, marron, [1], 2],  //15
  ["contrebassesRouge2", 34,  "group",  546,  242, 15, violet, [15,24], 2],  //16
  ["contrebassesJaune", 35,  "group",  452,  403, 20, orange, [], 4], // 17

  ["pianoBleu1", 36,  "tank",  218,  342, 5, terre, [8], 3], // 18
  ["pianoBleu2", 37,  "tank",  ,  , 5, terre, []],
  ["pianoBleu3", 38,  "tank",  ,  , 5, terre, []],
  ["pianoBleu4", 39,  "tank",  ,  , 5, terre, []],
  ["pianoBleu5", 40,  "tank",  ,  , 5, terre, []],
  ["pianoBleu6", 41,  "tank",  ,  , 5, terre, []],
  ["pianoBleu7", 42,  "tank",  ,  , 5, terre, []],
  ["pianoBleu8", 43,  "tank",  ,  , 5, terre, []],
  ["pianoBleu9", 44,  "tank",  ,  , 5, terre, []],
  ["pianoBleu10", 45,  "tank",  , , 5, terre, []],

  ["pianoNoir1", 46,  "tank",  154,  232, 6, grisvert, [12], 1],  //19
  ["pianoNoir2", 47,  "tank",  ,  , 6, grisvert, []],
  ["pianoNoir3", 48,  "tank",  ,  , 6, grisvert, []],
  ["pianoNoir4", 49,  "tank",  ,  , 6, grisvert, []],

  ["trompettesBleu1", 50, "tank",  871,  99, 7, vert, [0], 3], //20
  ["trompettesBleu2", 51, "tank",  ,  , 7, vert, []],
  ["trompettesBleu3", 52, "tank",  ,  , 7, vert, [9]],
  ["trompettesBleu4", 53, "tank",  ,  , 7, vert, [0]],
  ["trompettesBleu5", 54, "tank",  ,  , 7, vert, [9]],

  ["trompettesRouge1", 55,   "tank",  846,  57, 8, grisbleu, [2,10,16], 2], //21
  ["trompettesRouge2", 56,   "tank",  ,  , 8, grisbleu, []],
  ["trompettesRouge3", 57,   "tank",  ,  , 8, grisbleu, []],
  ["trompettesRouge4", 58,   "tank",  ,  , 8, grisbleu, []],
  ["trompettesRouge5", 59,   "tank",  ,  , 8, grisbleu, []],  
  ["trompettesRouge6", 60,   "tank",  ,  , 8, grisbleu, []],

  ["trompettesTonal", 61,  "group",  420,  410, 7, grisbleu, [], 20], //22

  ["corsBleu1", 62,   "tank",  873,  437, 9, grisbleu, [0], 3], //23
  ["corsBleu2", 63,   "tank",  ,  , 9, grisbleu, []],
  ["corsBleu3", 64,   "tank",  ,  , 9, grisbleu, []],
  ["corsBleu4", 65,   "tank",  ,  , 9, grisbleu, []],    
  ["corsBleu5", 66,   "tank",  ,  , 9, grisbleu, []],

  ["corsRouge1", 67,   "tank",  250,  84, 10, grisbleu, [1], 2], // 24
  ["corsRouge2", 68,   "tank",  ,  , 10, grisbleu, []],
  ["corsRouge3", 69,   "tank",  ,  , 10, grisbleu, []],
  ["corsRouge4", 70,   "tank",  ,  , 10, grisbleu, []],
  ["corsRouge5", 71,   "tank",  ,  , 10, grisbleu, []],  
  ["corsRouge6", 72,   "tank",  ,  , 10, grisbleu, []],

  ["corsTonal1", 73,   "tank",  500,  350, 11, grisbleu, [], 20], //25
  ["corsTonal2", 74,   "tank",  500,  350, 11, grisbleu, []],
  ["corsTonal3", 75,   "tank",  500,  350, 11, grisbleu, []],

  ["trombonesRouge1", 76,   "tank",  846,  240, 12, grisbleu, [2,10,16], 2], //26
  ["trombonesRouge2", 77,   "tank",  ,  , 12, grisbleu, []],
  ["trombonesRouge3", 78,   "tank",  ,  , 12, grisbleu, []],
  ["trombonesRouge4", 79,   "tank",  ,  , 12, grisbleu, []],
  ["trombonesRouge5", 80,   "tank",  ,  , 12, grisbleu, []],
  ["trombonesRouge6", 81,   "tank",  ,  , 12, grisbleu, []],

  ["trombonesTonal1", 82,   "tank",  500,  350, 13, grisbleu, [], 20], //27
  ["trombonesTonal2", 83,   "tank",  500,  350, 13, grisbleu, []],
  ["trombonesTonal3", 84,   "tank",  500,  350, 13, grisbleu, []],

  ["flutesRouge1", 85,   "tank",  536,  528, 14, grisbleu, [15], 2], //28
  ["flutesRouge2", 86,   "tank",  ,  , 14, grisbleu, []],

  ["flutesTonal", 87,   "group",  500,  350, 3, grisbleu, [], 20], //29

  ["flutesNoir1", 88,  "tank",  674,  158, 15, grisbleu, [19], 1], // 30
  ["flutesNoir2", 89,  "tank",  ,  , 15, grisbleu, []],
  ["flutesNoir3", 90,  "tank",  ,  , 15, grisbleu, []],
  ["flutesNoir4", 91,  "tank",  ,  , 15, grisbleu, []],
  ["flutesNoir5", 92,  "tank",  ,  , 15, grisbleu, []],
  ["flutesNoir6", 93,  "tank",  ,  , 15, grisbleu, []],
  ["flutesNoir7", 94,  "tank",  ,  , 15, grisbleu, []],    
  ["flutesNoir8", 95,  "tank",  ,  , 15, grisbleu, []],
  ["flutesNoir9", 96,  "tank",  ,  , 15, grisbleu, []],
  ["flutesNoir10",97,  "tank",  ,  , 15, grisbleu, []],

  ["clarinettesRouge1", 98,   "tank",  620,  465, 16, grisbleu, [15], 2], //31
  ["clarinettesRouge2", 99,   "tank",  ,  , 16, grisbleu, []],

  ["bassonsRouge1", 100,   "tank",  494,  599, 17, grisbleu, [15], 2], //32
  ["bassonsRouge2", 101,   "tank",  ,  , 17, grisbleu, [15]],

  ["bassonsNoir1", 102,  "tank",  674,  328, 18, grisbleu, [19], 1], // 33
  ["bassonsNoir2", 103,  "tank",  ,  , 18, grisbleu, []],
  ["bassonsNoir3", 104,  "tank",  ,  , 18, grisbleu, []],
  ["bassonsNoir4", 105,  "tank",  ,  , 18, grisbleu, []],
  ["bassonsNoir5", 106,  "tank",  ,  , 18, grisbleu, []],
  ["bassonsNoir6", 107,  "tank",  ,  , 18, grisbleu, []],
  ["bassonsNoir7", 108,  "tank",  ,  , 18, grisbleu, []],    
  ["bassonsNoir8", 109,  "tank",  ,  , 18, grisbleu, []],
  ["bassonsNoir9", 110,  "tank",  ,  , 18, grisbleu, []],
  ["bassonsNoir10",111,  "tank",  ,  , 18, grisbleu, []],

  ["percu1", 112,   "tank",  608,  326, 19, grisbleu, [15], 2], //34
  ["percu2", 113,   "tank",  ,  , 19, grisbleu, []],
  ["percu3", 114,   "tank",  ,  , 19, grisbleu, []],

  ["marimba1", 115,   "tank",  500,  350, 20, grisbleu, [], 20], //35
  ["marimba2", 116,   "tank",  500,  350, 20, grisbleu, []],
  ["marimba3", 117,   "tank",  500,  350, 20, grisbleu, []],
  ["marimba4", 118,   "tank",  500,  350, 20, grisbleu, []],
  ["marimba5", 119,   "tank",  500,  350, 20, grisbleu, []],

  ["hautboisRouge1", 120,   "tank",  627,  392, 21, grisbleu, [15], 2], //36
  ["hautboisRouge2", 121,   "tank",  ,  , 21, grisbleu, []],

  // Exemple de choix. Pour ne pas afficher un choix dans score, il suffit de le mettre dans
  // une scene inactive (ici 20)
  ["Noir", 122, "group",  10,  100, 0, grisbleu, [], 20], // 37
  ["Rouge", 123, "group",  520,  600, 0, grisbleu, [], 20], // 38
  ["Bleu", 124, "group",  350,  25, 0, grisbleu, [], 20], //39
  ["Jaune", 125, "group",  350,  25, 0, grisbleu, [], 20] //40
];

exports.groupesDesSons = [ groupeOpus2, [], [] ];

/************************************
CONFIGURATION DU SEQUENCEUR
***********************************/

//  Indexation des bus Midi dans Processing
//  pour les séquenceurs. Max 6 instruments.
exports.busMidiInstrumentSequenceur     = [0, 1, 2, 3, 4, 5]; 	// Ce tableau fixe le nombre d'instruments en plus des bus
exports.canauxMidiInstrumentSequenceur  = [2, 3, 4, 1, 1, 1];

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
  ["POLY",[ // POLYPLEX Leg Day
      ["SON 1",  60], // C
      ["SON 2",  62], // D
      ["SON 3", 64], // E
      ["SON 4",65], // F
      ["SON 5",67],  // G
      ["SON 6",  69], // A
      ["SON 7",  71], // H
      ["SON 8",   72], // C
    ]
  ],
  ["FM8",[
    ["Debut",60],
    ["Fin",72]
  ]],
  ["MASSIVE",[
    ["Debut",40],
    ["Fin",70]
  ]],
  ["PRISM",[
    ["Debut",60],
    ["Fin",72]
  ] ],
    ["KONTAKT",[
      ["Debut",29],
      ["Fin",80]
  ] ],
    ["ABSYNTH",[
      ["SON 1",  60], // C
      ["SON 2",  62], // D
      ["SON 3", 64], // E
      ["SON 4",65], // F
      ["SON 5",67],  // G
      ["SON 6",  69], // A
      ["SON 7",  71], // H
      ["SON 8",   72], // C
  ] ]
];
