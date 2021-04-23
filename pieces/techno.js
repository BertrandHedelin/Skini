"use hopscript"


/***************** Techno ********************************************

A utiliser avec indusV10 d'Ableton.
Fonctionne avec le séquenceur distribué.
Fonctionne aussi avec opus1 et grandLoupV2

==========================================================================*/

exports.outportProcessing =  10000; // Automate vers Processing visu
exports.outportForMIDI =     12000; // Automate vers Processing OSC -> Midi
exports.portWebSocket =      13000; // Port de réception des commandes OSC
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

exports.automate1 = './autoOpus1V2';
exports.automate2 = './autoTechno';
exports.automate3 ='./autoGrandloupV2'; // Avec GrandLoupV3tempo d'Ableton

/************************************
FICHIERS DES CLIPS CSV
************************************/
// Fichiers CSV à mettre dans l'ordre selon les choix dans le controleur
// mise à jour dans websocketServer, sur demande client "loadAbletonTable"

exports.configClips = [
"./pieces/opus1V2.csv",
"./pieces/techno.csv",
"./pieces/grandloupV2.csv"
];

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans la contrôleur.
Nom du sous répartoire ./sounds/xxxx
*************************************/
exports.soundFilesPath1 = "opus1";
exports.soundFilesPath2 = "";
exports.soundFilesPath3 = "grandloup";

// CC undefined dans la norme MIDI. Le controle du tempo dans Ableton ne se fait pas de façon absolu mais
// selon un minimum et un maximum entre lesquels sont affectées des valeurs au controleur midi.
// Ce n'est pas trés évident comme mécanisme.
exports.tempo_ABL = 20;

/*****************************************************************************

Gestion de la Matrice des possibles
Automate de gestion de la matrice des possibles

******************************************************************************/
exports.nbeDeGroupesClients = 2;

// Ces données sont trés sensibles sur le bon déroulement de l'interaction
exports.timer1  = 3000;  // Opus1, 80 sur une mesure 4/4
exports.timer2  = 450 * 4; // Techno Pour un tempo de 120 sur une mesure 4/4
exports.timer3  = 550 * 4; // Tempo 108

exports.timerDivision1  = 4; 
exports.timerDivision2  = 4; 
exports.timerDivision3  = 8; 

// La synchro midi est émise par processing qui la reçoit d'Ableton ou autre source
exports.synchoOnMidiClock = true;

// Nomage des groupes de sons
// Pour group: nom du groupe (0), index du groupe(1), type (2), x(3), y(4), nbe d'éléments(5), color(6), prédécesseurs(7), n° de scène graphique(8)
// Pour tank:  nom du groupe(0), index du groupe(1), type(2), x(3), y(4), numéro du tank(5), color(6), prédécesseurs(7), n° de scène graphique(8)

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

exports.groupesDesSons = [
[  // Opus 1
  ["violonsEchelle", 0,  "group",  323,  176, 12, ocre, [3,8], 1],  //0
  ["violonsChrom",1, "group",  800,  180, 16, ocre, [9], 2],  //1
  ["violonsTonal",2,  "group",  450,  25, 24, ocre, [30], 3],  //2
  ["altosEchelle", 3,  "group",  200,  114, 12, violet, [5], 1],    //3
  ["altosChrom", 4,  "group",  800,  270, 16, violet, [9], 2], //4
  ["cellosEchelle", 5,  "group",  52,  173, 10, vert, [], 1], //5
  ["cellosChrom", 6, "group",  800,  360, 16, vert, [9],2],  //6
  ["cellosTonal", 7,  "group",  650,  100, 8, vert, [2], 3],   //7
  ["ctrebassesEchelle", 8,  "group",  200,  244, 12, bleu, [5], 1], //8
  ["ctrebassesChrom", 9,  "group",  590,  430, 16, bleu, [25, 29], 2], //9
  ["ctrebassesTonal", 10,  "group",  650,  160, 6, bleu, [2], 3],  //10
  ["trompettesEchelle1", 11, "tank",  273,  374, 1, orange, [5,0], 1], //11
  ["trompettesEchelle2", 12,  "tank",  200,  10, 1, orange, [],],
  ["trompettesEchelle3", 13,  "tank",  200,  10, 1, orange, [],],
  ["trompettesEchelle4", 14,  "tank",  200,  10, 1, orange, [],],
  ["trompettesTonal1", 15,  "tank",  650,  280, 2, orange, [2], 3], //12
  ["trompettesTonal2", 16,  "tank",  200,  100, 2, orange, []],
  ["trompettesTonal3", 17, "tank",  200,  100, 2, orange, []],
  ["corsEchelle1", 18, "tank",  350,  527, 3, gris, [11], 1], //13
  ["corsEchelle2", 19,  "tank",  600,  200, 3, gris, []],
  ["corsEchelle3", 20,  "tank",  600,  200, 3, gris, []],
  ["corsEchelle4", 21,  "tank",  600,  200, 3, gris, []],
  ["corsEchelle5", 22,  "tank",  600,  200, 3, gris, []],
  ["corsEchelle6", 23,  "tank",  600,  200, 3, gris, []],
  ["corsEchelle7", 24,  "tank",  600,  200, 3, gris, []],
  ["trombonesEchelle1", 25,  "tank",  500,  528, 4, terre, [13], 1],  //14
  ["trombonesEchelle2", 26,  "tank",  600,  300, 4, terre, []],
  ["trombonesEchelle3", 27,  "tank",  600,  300, 4, terre, []],    
  ["trombonesEchelle4", 28,  "tank",  600,  300, 4, terre, []],
  ["trombonesEchelle5", 29,  "tank",  600,  300, 4, terre, []],
  ["trombonesEchelle6", 30,  "tank",  600,  300, 4, terre, []],
  ["trombonesEchelle7", 31,  "tank",  600,  300, 4, terre, []],
  ["flutesEchelle1", 32,  "tank",  627,  113, 5, rose, [22,24,14], 1],  //15
  ["flutesEchelle2", 33,  "tank",  500,  400, 5, rose, []],  
  ["flutesEchelle3", 34,  "tank",  500,  400, 5, rose, []],
  ["flutesEchelle4", 35,  "tank",  500,  400, 5, rose, []],
  ["flutesEchelle5", 36,  "tank",  500,  400, 5, rose, []],
  ["flutesChrom", 37,  "group",  800,  450, 16, rose, [9], 2],  //16
  ["flutesTonal", 38,  "group",  800,  30, 24, rose, [2], 3],  //17
  ["hautboisEchelle1", 39,  "tank",  789, 130, 6, marron, [15], 1],  //18
  ["hautboisEchelle2", 40,  "tank",  500,  700, 6, marron, []],
  ["hautboisEchelle3", 41,  "tank",  500,  700, 6, marron, []],
  ["hautboisEchelle4", 42,  "tank",  500,  700, 6, marron, []],
  ["hautboisEchelle5", 43,  "tank",  500,  700, 6, marron, []],
  ["hautboisTonal", 44,  "group",  650,  220, 8, marron, [2], 3],  //19
  ["clarinettesEchelle1", 45,  "tank",  768,  376, 7, violet, [15], 1],    //20
  ["clarinettesEchelle2", 46,   "tank",  600,  900, 7, violet, []],
  ["clarinettesEchelle3", 47,   "tank",  600,  900, 7, violet, []],
  ["clarinettesEchelle4", 48,   "tank",  600,  900, 7, violet, []],
  ["clarinettesEchelle5", 49,   "tank",  600,  900, 7, violet, []],
  ["clarinettesChrom", 50, "group",  800,  630, 16, violet, [9], 2], //21
  ["bassonsEchelle", 51, "group",  464,  143, 10, grisvert, [0], 1],   //22
  ["bassonsChrom", 52, "group",  800,  540, 16, grisvert, [9], 2],  //23
  ["pianoEchelle1", 53,   "tank",  497,  306, 8, grisbleu, [22,13], 1], //24
  ["pianoEchelle2", 54,   "tank",  300,  400, 8, grisbleu, []],
  ["pianoEchelle3", 55,   "tank",  300,  400, 8, grisbleu, []],
  ["pianoEchelle4", 56,   "tank",  300,  400, 8, grisbleu, []],
  ["pianoEchelle5", 57,   "tank",  300,  400, 8, grisbleu, []],  
  ["pianoEchelle6", 58,   "tank",  300,  400, 8, grisbleu, []],
  ["percu1", 59,   "tank",  420,  410, 9, orange, [], 4], //25  !! sur deux scénes on la voit pas dans la sène 1 !!
  ["percu2", 60,   "tank",  300,  500, 9, orange, []],
  ["percu3", 61,   "tank",  300,  500, 9, orange, []],
  ["percu4", 62,   "tank",  300,  500, 9, orange, []],
  ["percu5", 63,   "tank",  300,  500, 9, orange, []],    
  ["percu6", 64,   "tank",  300,  500, 9, orange, []],
  ["percu7", 65,   "tank",  300,  500, 9, orange, []],
  ["percu8", 66,   "tank",  300,  500, 9, orange, []],
  ["percu9", 67,   "tank",  300,  500, 9, orange, []],
  ["kinetic1", 68,   "tank",  650,  340, 10, bleu, [2], 3], //26
  ["kinetic2", 69,   "tank",  650,  500, 10, bleu, []],  
  ["kinetic3", 70,   "tank",  300,  500, 10, bleu, []],
  ["rise1", 71,   "tank",  500,  350, 11, bleu, [], 4], //27
  ["rise2", 72,   "tank",  300,  700, 11, bleu, []],
  // Exemple de choix. Pour ne pas afficher un choix, il suffit de le mettre dans
  // une scene inactive
  ["Messiaen", 73, "group",  10,  100, 0, rouge, [], 10], // 28
  ["Shostakovich", 74, "group",  520,  600, 0, rouge, [], 10], // 29
  ["Britten", 75, "group",  350,  25, 0, rouge, [], 10], //30

  ["Altos", 76, "group",  350,  25, 0, violet, [], 10],
  ["Contrebasses", 77, "group",  350,  25, 0, bleu, [], 10],
  ["Trompettes", 78, "group",  350,  25, 0, orange, [], 10],
  ["Bassons", 79, "group",  350,  25, 0, grisvert, [], 10],
  ["Piano", 80, "group",  350,  25, 0, grisbleu, [], 10],
  ["Trombones", 81, "group",  350,  25, 0, terre, [], 10],
  ["Flutes", 82, "group",  350,  25, 0, rose, [], 10],
  ["Fin", 83, "group",  922,  499, 0, bleu, [18,20,14], 1],
  ["Clarinettes", 84, "group",  350,  25, 0, violet, [], 10],
  ["Hautbois", 85, "group",  350,  25, 0, marron, [], 10]
],

[  // Techno
  // Pour group: nom du groupe (0), index (1), type (2), x(3), y(4), nbe d'éléments(5), color(6), prédécesseurs(7)
  // Pour tank:  nom du groupe(0), index(1), type(2), x(3), y(4), numéro du tank(5), color(6), prédécesseurs(7)
  // Deux groupes dans le même tank doivent se suivre, les index de groupe n'ont pas besoin d'être en séquence.

  ["evolve",  0, "group", 500, 240, 20, rouge, [1] ],   // 0 index d'objet graphique
  ["poly", 1, "group",300, 240, 20, bleu, [8] ],  //1
  ["fm", 2, "group", 270, 100, 20, vert, [], 10 ],  //2
  ["massive",3, "group",450,100,  20, gris, [], 10 ], //3
  ["round", 4,"group", 630, 100, 20, terre, [], 10 ],  //4
  ["absynth", 5, "group", 800,100, 20, violet, [], 10 ], // 5
  ["drone", 6, "group", 630, 240, 20, orange, [], 10 ],  //6
  ["alien", 7, "group", 270, 240, 20, ocre, [], 10 ], //7
  ["notes", 8, "group", 100, 240, 20, grisvert, [] ],  //8
  ["pitchable", 9, "group", 800, 340, 20, grisvert, [], 10 ], //9
  ["vocosyn", 10, "group", 100, 400, 20, rouge, [] ], //10
  ["massive2", 11, "group", 300, 400, 20, bleu, [10] ],  //11
  ["reaktor5", 12, "group", 270, 440, 20, grisvert, [], 10 ], //12
  ["reaktor6", 13, "group", 450, 440, 20, vert, [], 10 ], //13
  ["melodie", 14, "group", 500, 400, 20, rose, [11] ] //14
],

[  // Grandloup
  ["GLpiano", 0,    "group", 126, 252,  20, bleu,   [] ],
  ["GLpercu", 1,    "group", 625, 178,  20, rouge,  [], 20 ], // dans une scène pas affichée
  ["GLbasse", 2,    "group", 398, 242,  20, vert,   [] ],
  ["GLtrompette",3, "group", 276, 451,  20, marron, [] ],
  ["GLbatterie", 4, "group", 401, 77,   20, gris,   [] ],
  ["GLsaxo",     5, "group", 523, 450,  20, ocre,   [] ],
  ["GLguitare",  6, "group", 702, 325,  20, rose,   [] ]
]

];

/************************************

CONFIGURATION DU SEQUENCEUR

***********************************/

//  Indexation des bus Midi dans Processing
//  pour les séquenceurs. Max 6 instruments.
exports.busMidiInstrumentSequenceur     = [0, 1, 2, 3, 4, 5]; 	// Ce tableau fixe le nombre d'instruments en plus des bus
exports.canauxMidiInstrumentSequenceur  = [1, 1, 1, 1, 1, 1];
exports.udpPortForRecorder              = [8000, 8001, 8002, 8003, 8004, 8005]; // Ecoute OSC dans Ableton Live
exports.tracksForRecorder               = [11, 12, 13, 14 , 15, 16]; // Index des tracks d'Ableton où sont les instruments
exports.portOSCFromAbleton = 9000;
exports.sequencerFilePath = './sequencesSkini/';
exports.sequencerSoundFilePath = './patternsSkini/';

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

// Instruments dans reaper freeSynths.rpp
/*
  ["PERCU",[ 
      ["DOUM",  36], 
      ["SNARE",  38], 
      ["CLAC", 39], 
      ["TIC",42], 
      ["DOM",43],
      ["TOUM",  45],
      ["TOC",  46],
      ["POUM",   48],
      ["FLASH",   50],
     ]
  ],
  ["BASS",[
    ["Debut",36],
    ["Fin",60]
  ]],
  ["LEAD",[
    ["Debut",60],
    ["Fin",84]
  ]],
  ["MELODY",[
    ["Debut",60],
    ["Fin",84]
  ] ],
    ["FUNK",[
      ["Debut",50],
      ["Fin",110]
  ] ],
    ["ROBOT",[
      ["SON 1",  60],
      ["SON 2",  72],
      ["SON 3", 84],
  ] ]
*/
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
      ["Yuaaa",   72] // C
    ]
  ],
  ["FM8",[
    ["Debut",59],
    ["Fin",73]
  ]],
  ["MASSIVE",[
    ["Debut",59],
    ["Fin",73]
  ]],
  ["MONARK",[
    ["Debut",47],
    ["Fin",70]
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
      ["Chlang",95],
      ["Chling",96]
  ] ],
    ["ABSYNTH",[
      ["Debut",59],
      ["Fin",80]
  ] ]
];

