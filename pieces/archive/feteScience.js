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

/***************************************************

 Indexation des bus Midi dans Processing
 pour les séquenceurs.

****************************************************/
exports.busMidiInstrumentSequenceur     = [0, 1, 2, 3];
exports.canauxMidiInstrumentSequenceur  = [2, 3, 4, 1];

// La synchro midi est émise par processing qui la reçoit d'Ableton ou autre source
exports.synchoOnMidiClock = true;

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
exports.automate3 = './autoGrandloupV2';

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
// Des timers trop lents induisent des "trous" dans l'exécution.
exports.timer1  = 1000 * 4;// Orchestre 100 * 4 Pour un tempo de 50 sur une mesure 4/4
exports.timer2  = 450 * 4; // Techno Pour un tempo de 120 sur une mesure 4/4
exports.timer3  = 550 * 4; // grandloup 108

// Important pour la synchronistation MIDI
exports.timerDivision1  = 4; 
exports.timerDivision2  = 4;
exports.timerDivision3  = 8; // deux "bars" dans Aleton

// Dénomination des groupes de sons

exports.groupesDesSons = [
[  // Orchestre
  ["violonsStac", 0], // nom de l'instrument, n° du groupe de son dans le fichier csv
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
[  // Grandloup
  ["GLpiano", 0],
  ["GLpercu", 1],
  ["GLbasse", 2],
  ["GLtrompette", 3],
  ["GLbatterie", 4],
  ["GLsaxo", 5],
  ["GLguitare", 6]
]

];

/************************************

CONFIGURATION DU SEQUENCEUR

***********************************/

//  Indexation des bus Midi dans Processing
//  pour les séquenceurs. Max 6 instruments.
exports.busMidiInstrumentSequenceur     = [0, 1, 2, 3, 4, 5];   // Ce tableau fixe le nombre d'instruments
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

/*************************************

CHEMIN DES FICHIERS SONS MP3 pour les clients

Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans la contrôleur.

*************************************/

exports.soundFilesPath1 = "";
exports.soundFilesPath2 = "";
exports.soundFilesPath3 = "grandloup";

/************************************

FICHIERS DES CLIPS CSV ET MENU CLIENT SELECTEUR

************************************/
// Fichiers CSV à mettre dans l'ordre selon les choix dans le controleur
// mise à jour dans websocketServer, sur demande client "loadAbletonTable"

exports.configClips = [
"./pieces/orchestreV2.csv",
//"./pieces/morinouta.csv",
"./pieces/techno.csv",
"./pieces/grandloup.csv"
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



/********************************************************
 POUR TEST DES SCENES

 ABLETON LIVE

*********************************************************/
exports.tempo_ABL = 20;
// CC undefined dans la norme MIDI. Le controle du tempo dans Ableton ne se fait pas de façon absolu mais
// selon un minimum et un maximum entre lesquels sont affectées des valeurs au controleur midi.
// Ce n'est pas trés évident comme mécanisme.

/****************
SPECIFIQUE GOLEM
*****************/

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
