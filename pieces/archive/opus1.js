"use hopscript"


// ***************** FETE DE LA SCIENCE 2018 *****************************

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

/********************************************************
AUTOMATE HIPHOP
*********************************************************/
// Les fichiers Hiphop que décrivent les trajets
// Les signaux à utiliser dans ces programmes sont décrirs dans groupeDesSons

exports.automate1 = './autoOpus1V2';
exports.automate2 = './autoTechno';
exports.automate3 ='./autoNucera';

/************************************
FICHIERS DES CLIPS CSV
************************************/
// Fichiers CSV à mettre dans l'ordre selon les choix dans le controleur
// mise à jour dans websocketServer, sur demande client "loadAbletonTable"

exports.configClips = [
"./pieces/opus1V2.csv",
"./pieces/techno.csv",
"./pieces/nucera.csv"
];

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans la contrôleur.
Nom du sous répartoire ./sounds/xxxx
*************************************/
exports.soundFilesPath1 = "opus1";
exports.soundFilesPath2 = "";
exports.soundFilesPath3 = "nucera";

/*****************************************************************************
Gestion de la Matrice des possibles
Automate de gestion de la matrice des possibles
******************************************************************************/
exports.nbeDeGroupesClients = 2;

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

exports.groupesDesSons = [

  // Pour group: nom du groupe (0), index (1), type (2), x(3), y(4), nbe d'éléments(5), color(6), prédécesseurs(7), n° de scène graphique(8)
  // Pour tank:  nom du groupe(0), index(1), type(2), x(3), y(4), numéro du tank(5), color(6), prédécesseurs(7), n° de scène graphique(8)

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
  ["percu1", 59,   "tank",  420,  410, 9, orange, [], 4], //25
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
  // Pour tank:  nom du groupe(0), index(1), type(2), x(3), y(4), numé,ro du tank(5), color(6), prédécesseurs(7),
  ["evolve",  0, "tank", 100, 100, 1, rouge, [] ],          // 0
  ["poly", 1, "tank",130, 100, 1, bleu, [] ],        // 0
  ["fm", 2, "group", 270, 100, 20, vert, [] ],    // 1
  ["massive",3, "group",400,100,  20, gris, []  ],         // 2
  ["round", 4,"group", 530, 100, 20, terre, [] ],           // 3
  ["absynth", 5, "group", 666,100, 20, violet, [] ],           // 4
  ["drone", 6, "group", 530, 240, 20, orange, [] ],     // 5
  ["alien", 7, "group", 270, 240, 20, ocre, [] ],    // 6
  ["notes", 8, "group", 400, 240, 20, grisvert, [] ] // 7
],

[  // Nucera
  ["PolyUsine", 0, "group", 15, 100, 17, rouge, []  ],
  ["FM8Usine", 1, "group", 130, 100, 17, bleu, [0] ],
  ["MassiveUsine", 2, "group", 270, 100, 17, marron, [1] ],
  ["PrismUsine", 3, "group", 400, 100, 17, gris, [2] ],
  ["LPSUsine", 4, "group", 540, 100, 17, grisbleu, [3] ],
  ["AbsynthUsine", 5, "group", 666, 100, 17, violet, [4] ],
  ["LoopUsine", 6, "group", 793, 100, 17, vert, [5] ],

  ["PolyConscience", 7, "group", 15, 240, 17, rouge, [] ],
  ["FM8Conscience", 8, "group", 130, 240, 17, bleu, [7] ],
  ["MassiveConscience", 9, "group", 270, 240, 17, marron, [8] ],
  ["PrismConscience", 10, "group", 400, 240, 17, gris, [9] ],
  ["AbsynthConscience", 11, "group", 540, 240, 17, violet, [10] ],

  ["PolyMaladie", 12, "group", 15, 370, 17, rouge, [] ],
  ["FM8Maladie", 13, "group", 130, 370, 17, bleu, [12] ],
  ["MassiveMaladie", 14, "group", 270, 370, 17, marron, [13] ],
  ["PrismMaladie", 15, "group", 400, 370, 17, gris, [14] ],
  ["GiantMaladie", 16, "group", 540, 370, 17, ocre, [15] ],
  ["AbsynthMaladie", 17, "group", 666, 370, 17, violet, [16] ],

  ["MassiveArret", 18, "group", 15, 510, 17, marron, [] ],
  ["LPSArret", 19, "group", 130, 510, 17, grisbleu, [18] ],
  ["AbsynthArret", 20, "group", 270, 510, 17, violet, [19] ],

  ["PolyGuerison", 21, "group", 15, 630, 17, rouge, [] ],
  ["FM8Guerison", 22, "group", 130, 630, 17, bleu, [21] ],  
  ["MassiveGuerison", 23, "group", 250, 630, 17, marron, [22] ],
  ["PrismGuerison", 24, "group", 380, 630, 17, gris, [23] ],
  ["LPSGuerison", 25, "group", 500, 630, 17, grisbleu, [24] ],
  ["GiantGuerison", 26, "group", 620, 630, 17, [103,120,132], [25] ],
  ["AbsynthGuerison", 27, "group", 740, 630, 17, violet, [26] ],
  ["LoopGuerison", 28, "group", 873, 630, 17, vert, [27] ]
]

];

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


/************************************
MENU CLIENT SELECTEUR (PLUS UTILISE en 2019)
************************************/
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

/*******************************************************
CONTROLE PROCESSING GRAPHIQUE (GOLEM)
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
 POUR TEST DES SCENES GOLEM
 ABLETON LIVE
*********************************************************/
exports.tempo_ABL = 20;
// CC undefined dans la norme MIDI. Le controle du tempo dans Ableton ne se fait pas de façon absolu mais
// selon un minimum et un maximum entre lesquels sont affectées des valeurs au controleur midi.
// Ce n'est pas trés évident comme mécanisme.

// Attention à la cohérence des commandes Midi ici et dans controleAbletonAgit.csv
// Les notes de controleAbletonAgit.csv peuvent > 127, mais pas les paramètres ici.

// LE GOLEM AGIT: controleAbletonAgit.csv : 10 à 93 - 120 à 220
// FETE DE LA MORT DU GOLEM: attention prendre de 220 à 413 pour les notes dans contrôleAbletonMortDuGolem

// Prendre de 94 à 119 pour des contrôles divers
// C'est un peu au milieu de la plage de GOLEM AGIT, mais je n'ai pas envie de refaire ça...
// (La raison de tout ça est qu'au début je m'étais limité à 128, après j'ai étendu à 16 * 128= 2048 notes midi)
// ABLETON pour Golem dérive, ce sont des lectures de fichiers son

exports.StopAll_ABL = 98;
exports.StopTrompette_ABL = 99;
exports.Trompette1_ABL = 100;
exports.Trompette2_ABL = 101;
exports.Trompette3_ABL = 102;
exports.Creation_ABL = 103;
exports.GolemFORM_ABL = 104;
exports.StartMolekular_ABL = 105;
exports.MuteMolekular_ABL = 106;
exports.MuteIndia_ABL = 107;
exports.ChantMortDuGolem_ABL = 108;
exports.MuteMetaphysical_ABL = 109;
exports.CTLQuadri1_ABL = 110; //Pour l'initialisation de la quadri dans la MORT DU GOLEM
exports.CTLQuadri2_ABL = 111;
exports.CTLQuadri3_ABL = 112;

/********************************************************
CONTROLE REAPER
*********************************************************/
exports.MUTE_ON = 127;
exports.MUTE_OFF = 0;

// Indexation des bus Midi dans Processing
exports.busMidiFM8  = 0;
exports.busMidiAbsynth  = 1;
exports.busMidiPrism  = 2;
exports.busMidiGuitarRig = 3;
exports.busMidiReaper = 4;
exports.busMidiMassive = 5;
exports.busMidiAbleton = 6;
exports.busMidiEffetVoix1 = 7;
exports.busMidiEffetVoix2 = 8;
exports.busMidiEffetVoix3 = 9;
exports.busMidiEffetVoix4 = 10;
exports.busMidiQuadri1 = 11;

// Nommage des CC midi pour Reaper
exports.CCmuteTrack1 = 101;
exports.CCmuteTrack2 = 102;
exports.CCmuteTrack3 = 103;
exports.CCmuteTrack4 = 104;
exports.CCmuteTrack5 = 105;
exports.CCmuteTrack6 = 106;
exports.CCmuteTrack7 = 107;
exports.CCmuteTrack8 = 108;
exports.CCmuteTrack9 = 109;
exports.CCmuteTrack10 = 110;
exports.CCmuteTrack11 = 111;
exports.CCmuteTrack12 = 112;

// Pour le mixeur dans Reaper, les 8 premières valeurs correspondent à MidiMix Akai
exports.potardVolume  = 19;
exports.potard2Volume = 23;
exports.potard3Volume = 27;
exports.potard4Volume = 31;
exports.potard5Volume = 49;
exports.potard6Volume = 53;
exports.potard7Volume = 57;
exports.potard8Volume = 61;
exports.potard9Volume = 62;
exports.potard10Volume = 63;
exports.potard11Volume = 64;
exports.tablePotardVolume = [19, 23, 27, 31, 49, 53, 57, 61, 62, 63, 64]; // Pour la config dans scenes.js

// Guitar Rig
exports.Pitch_Pedal_Skini_GR = 1;
exports.Vide_GR = 7;
exports.LiquidControlRoom_GR = 10;
exports.Chaotech_GR = 31;
exports.Deep_Dublon_GR = 18;
exports.Discuss_this_later_GR = 14;
exports.EpicTexture_GR = 29;
exports.Filter_cheese_GR = 21;
exports.Funk_Duck_GR = 15;
exports.Fuzz_vs_Reverse_Split_GR = 12;
exports.Granular_Sparkle_GR = 6;
exports.Lemon_leak_GR = 3;
exports.LFOd_GR = 19;
exports.Metalbeat_GR = 8;
exports.Moloching_GR = 34;
exports.Nerdiphone_GR = 35;
exports.Neverend_GR = 4;
exports.Pitch_Pedal_GR = 1;
exports.ReflectorVoix_GR = 51;
exports.Robot_plays_guitar_GR = 5;
exports.Robotwist_GR = 26;
exports.Rollercoaster_GR = 16;
exports.Shifted_delay_GR = 47;
exports.Signal_Warmer_GR = 41;
exports.Stepping_Stone_GR = 42;
exports.Stupid_Four_GR = 22;
exports.Submarine_GR = 9;
exports.Superpanner_GR = 24;
exports.Talking_Bytes_GR = 25;
exports.YaYaGuitar_GR = 17;
exports.WetAlley_GR = 2;
exports.ReflectorEtPitch_GR = 52;

// Pour Conversion et le contrôle des Effets Guitar Rig, Picth Pedal
exports.CCPitchPedalVoix = 100;
exports.PitchPedalVoix1_3rd = 0;
exports.PitchPedalVoix1_b4th = 64;
exports.PitchPedalVoix1_4th = 127;
exports.PitchPedalVoix2_2nd = 0;
exports.PitchPedalVoix2_b3rd = 64;
exports.PitchPedalVoix2_3rd = 127;
exports.PitchPedalVoix3_5th = 0;
exports.PitchPedalVoix3_b5th = 64;
exports.PitchPedalVoix3_4th = 127;

// PRISM
exports.Vide_PR = 51;
exports.Barrel_PR = 9;
exports.JumpyEcho_PR = 10;
exports.Cheater_PR = 11;
exports.SynthBar_PR = 13;
exports.Concerned_PR = 20;
exports.Danger_Space_PR = 22;
exports.DarkChristmas_PR = 23;
exports.Dirty_Drum_PR = 4;
exports.Floaty_PR = 27;
exports.GhostTrain_PR = 28;
exports.Hardcore_PR = 15;
exports.Harmony_Smoker_PR = 31;
exports.InsideOutBell_PR = 34;
exports.KillerZombies_PR = 35;
exports.Hehehe_PR = 32;
exports.Jumpy_Echo_PR = 10;
exports.MinorPressure_PR = 37;
exports.Shoom_PR = 17;
exports.Spaceship_PR = 44;
exports.Storm_Cloud_PR = 45;
exports.Swans_PR = 46;
exports.SweetenHer_PR = 47;
exports.Sword_play_PR = 48;
exports.Synth_A_PR = 2;
exports.Thintin_PR = 49;
exports.Visionnary_PR = 18;

// ABSYNTH
exports.Vide_Ab = 23;
exports.R3son8_Ab = 1;
exports.Follow_The_Mailman_Ab = 2;
exports.CloudyCombDistortion2_Ab = 3;
exports.Comb_O_Cloud_Ab = 4;
exports.Confetti_Parade_Ab = 5;
exports.Contraband_Ab = 6;
exports.DroideRizer_Ab = 8;
exports.Dual_Crystal_Ab = 9;
exports.Flazer_Ab = 10;
exports.FreekVsFace_Ab = 11;
exports.GrainSpaceVowells_Ab = 12;
exports.Hoplet_Droplet_Ab = 14;
exports.Hydroglizz_Ab = 15;
exports.Robot_On_The_Keyboard_Ab = 17;
exports.Roll_On_Fred_Ab = 18;
exports.Splash_Ab = 19;
exports.Triple_Trigger_Bands_Ab = 21;
exports.Liftoff_Ab = 30;
exports.Majex_chords_Ab = 32;
exports.Minework_Ab = 33;
exports.Nearly_Infiniate_Ab = 34;
exports.Nuclear_storm_Ab = 35;
exports.Out_of_mind_Ab = 26;


// FM8
exports.morh_soft_FM8 = 22;
exports.Boost_FM8 = 37;
exports.The_Digital_Synth_FM8 = 41;
exports.Sausage_FM8 = 40;
exports.Flashlite_Disco_FM8 = 39;
exports.In_the_stadium_FM8 = 32;
exports.Maarsbeing_control_FM8 = 24;
exports.Menice_FM8 = 42;
exports.Rythmic_Rainmaker_FM8 = 43;
exports.I_quantus_FM8 = 46;
exports.Metaz_FM8 = 28;
exports.Loop_Omnipotent_Ms = 46;

// Massive
exports.Damage_Ms = 53;
exports.Shifter_Ms = 58;
exports.SPRay_Ms = 59;
exports.Dead_Echoplexx_Ms = 7;
exports.Rugose_Ms = 62;
exports.Saturn_Ring_Ms = 63;
exports.Seek_our_Souls_Ms = 64;
exports.Traveller_Ms = 65;
exports.Treppenhuas_Monster_Ms = 66;
exports.AlphaCentauri_Ms = 68;
exports.BlueInGreen_Ms = 69;
exports.CleanSweepPad_Ms = 70;
exports.ClicheMorph_Ms = 71;
exports.GatedSkywalker_Ms = 72;
exports.Komplex_Ms = 73;
exports.Lost_Ms = 74;
exports.Orphelia_Ms = 75;
exports.Padan_Ms = 76;
exports.Shiver_Ms = 77;
exports.Synthetica_Ms = 78;

// Quadri
exports.DiaFLRRLent_quadri = 25;
exports.cercleMoyenLent_quadri = 27;
exports.petitCercleDansOval_Quadri = 37;
exports.volDeMouche_Quadri = 42;
exports.majorette_Quadri = 47;
exports.petitCercleLent_Quadri = 51;
exports.OVNI1_Quadri = 49;
exports.pinceauMobileY_Quadri = 50;
exports.pinceauMobileX_Quadri = 51;
