
/***************** OPUS 5 - 2020 *****************************

© Copyright 2019-2020, B. Petit-Heidelein
Vesion Node.js

Les patterns sont typés DMFN.

==============================================================*/

// Indexation du bus Midi pour le lancement des clips
// Il s'agit de l'index correspondant à l'élément du tableau midiConfig.json
// qui crée le bus midi pour ces commandes.
var midiConfig = require("./midiConfig.json");
var countBusOUT = 0;
for(var i=0; i < midiConfig.length; i++){
  if(midiConfig[i].type === "OUT"){
    if(midiConfig[i].spec === "clipToDAW"){
      exports.busMidiDAW = countBusOUT;
    }
    countBusOUT++;
  }
}

exports.directMidiON = true;

// Pour charger les fonctions et modules de scenes de type GOLEM
exports.scenesON = false;

// La synchro midi est émise par processing qui la reçoit d'Ableton ou autre source
exports.synchoOnMidiClock = true;

// Choix de façon de faire réagir l'automate
// Par défaut c'est à la sélection. Avec reactOnPlay=true c'est au moment où se joue le pattern.
// Ceci a un impact important sur la façon de penser l'automate.
// Les stingers ne sont possibles qu'avec reactOnPlay=true.
exports.reactOnPlay = false;

/************************************
FICHIERS DES CLIPS CSV
************************************/
// Fichiers CSV à mettre dans l'ordre selon les choix dans le controleur
// mise à jour dans websocketServer, sur demande client "loadAbletonTable"

exports.configClips = "./pieces/opus5.csv";

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans le contrôleur.
*************************************/
exports.soundFilesPath1 = "opus5";

/***********************************
  Paramètres du simulateur
  Si ces valeurs ne sont pas données c'est celle qui
  sont dans le simulateur qui sont utilisées
************************************/
exports.tempoMax =  3000; // En ms
exports.tempoMin = 1000; // En ms
exports.limiteDureeAttente = 33; // En pulsations

/***************************************
CHEMIN DES PARTITIONS DES PATTERNS ET CONFIG AVEC MUSICIENS
****************************************/
exports.avecMusicien = false; // Pour mettre en place les spécificités au jeu avec des musiciens.
exports.decalageFIFOavecMusicien = 4; // Décalage de la FIFO vide avant le premier pattern dans une FIFO.
exports.patternScorePath1 = "opus5";

/****************************************
ACTIVATION D'ALGORITHME D'ORGANISATION DES FIFOs
Si 0 ou undefined pas d'algorithme.
Si 1 algorithme de réorganisation Début, Milieu, Fin, Neutre (DFMN)
Dans le csv, D -> 1, M -> 2, F->3, N->4 (c'est fixé dans controleAbleton.js)
Si autre ... à créer...
ATTENTION: NE JAMAIS UTILISER EN SITUATION D'INTERACTION SI L'ALGORITHME
PEUT SUPPRIMER DES PATTERNS DES FIFOs
*****************************************/
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

  // Pour group: nom du groupe (0), index du groupe (1), type (2), x(3), y(4), nbe d'éléments(5), color(6), prédécesseurs(7), n° de scène graphique
  // Pour tank:  nom du groupe(0), index du groupe(1), type(2), x(3), y(4), numéro du tank(5), color(6), prédécesseurs(7), n° de scène graphique
  // Les pédécésseurs sont les index en commentaires.

exports.groupesDesSons = [


  ["Piano1Intro1", 10,  "tank",  22,  151, 1, orange, [], 1],
  ["Piano1Intro2", 11,  "tank",  ,  , 1,  orange, []],  
  ["Piano1Intro3", 12,  "tank",  ,  , 1,  orange, []],
  ["Piano1Intro4", 13,  "tank",  ,  , 1,  orange, []],
  ["Piano1Intro5", 14,  "tank",  ,  , 1,  orange, []],
  ["Piano1Milieu1", 17,  "tank",  ,  , 1,  orange, []], 
  ["Piano1Milieu2", 18,  "tank",  ,  , 1,  orange, []],  
  ["Piano1Milieu3", 19,  "tank",  ,  , 1,  orange, []],
  ["Piano1Milieu4", 20,  "tank",  ,  , 1,  orange, []],
  ["Piano1Milieu5", 21,  "tank",  ,  , 1,  orange, []],
  ["Piano1Milieu6", 22, "tank",  ,  , 1,  orange, []],
  ["Piano1Milieu7", 23, "tank",  ,  , 1,  orange, []],
  ["Piano1Fin1", 24,  "tank",  ,  , 1,  orange, []],
  ["Piano1Fin2", 25,  "tank",  ,  , 1,  orange, []],  
  ["Piano1Fin3", 26,  "tank",  ,  , 1,  orange, []],
  ["Piano1Fin4", 27,  "tank",  ,  , 1,  orange, []],
  ["Piano1Fin5", 28,  "tank",  ,  , 1,  orange, []],

  ["ViolonsIntro1", 31,  "tank",  290,  517, 2, gris, [], 1],
  ["ViolonsIntro2", 32,  "tank",  ,  , 2,  gris, []],  
  ["ViolonsIntro3", 33,  "tank",  ,  , 2,  gris, []],
  ["ViolonsIntro4", 34,  "tank",  ,  , 2,  gris, []],
  ["ViolonsIntro5", 35,  "tank",  ,  , 2,  gris, []],
  ["ViolonsIntro6", 36, "tank",  ,  , 2,  gris, []],
  ["ViolonsMilieu1", 38,  "tank",  ,  , 2,  gris, []], 
  ["ViolonsMilieu2", 39,  "tank",  ,  , 2,  gris, []],  
  ["ViolonsMilieu3", 40,  "tank",  ,  , 2,  gris, []],
  ["ViolonsMilieu4", 41,  "tank",  ,  , 2,  gris, []],
  ["ViolonsFin1", 45,  "tank",  ,  , 2,  gris, []],
  ["ViolonsFin2", 46, "tank",  ,  , 2,  gris, []],
  ["ViolonsFin3", 47, "tank",  ,  , 2,  gris, []],
  ["ViolonsFin4", 48, "tank",  ,  , 2,  gris, []],
  ["ViolonsFin5", 49, "tank",  ,  , 2,  gris, []],

  ["Trompette1", 60,  "tank",  867,  70, 3, rouge, [], 1],
  ["Trompette2", 61,  "tank",  ,  , 3,  rouge, []],
  ["Trompette3", 62,  "tank",  ,  , 3,  rouge, []],
  ["Trompette4", 63,  "tank",  ,  , 3,  rouge, []],
  ["Trompette5", 64,  "tank",  ,  , 3,  rouge, []],
  ["Trompette6", 65,  "tank",  ,  , 3,  rouge, []],
  ["Trompette7", 66,  "tank",  ,  , 3,  rouge, []],
  ["Trompette8", 67,  "tank",  ,  , 3,  rouge, []],
  ["Trompette9", 68,  "tank",  ,  , 3,  rouge, []],

  ["Cors1", 73,  "tank",  202,  45, 4, marron, [], 1],
  ["Cors2", 74,  "tank",  ,  , 4,  grisvert, []],  
  ["Cors3", 75,  "tank",  ,  , 4,  grisvert, []],
  ["Cors4", 76,  "tank",  ,  , 4,  grisvert, []],

  ["FluteDebut1", 87,  "tank",  458,  203, 5, grisvert, [], 1],
  ["FluteDebut2", 88,  "tank",  ,  , 5,  grisvert, []],  
  ["FluteDebut3", 89,  "tank",  ,  , 5,  grisvert, []],
  ["FluteDebut4", 90,  "tank",  ,  , 5,  grisvert, []],
  ["FluteMilieu1", 94,  "tank",  ,  , 5,  grisvert, []],
  ["FluteMilieu2", 95, "tank",  ,  , 5,  grisvert, []],
  ["FluteMilieu3", 96, "tank",  ,  , 5,  grisvert, []],
  ["FluteFin1", 100,  "tank",  ,  , 5,  grisvert, []],
  ["FluteFin2", 101,  "tank",  ,  , 5,  grisvert, []],  
  ["FluteFin3", 102,  "tank",  ,  , 5,  grisvert, []],
  ["FluteFin4", 103,  "tank",  ,  , 5,  grisvert, []],
  ["FluteFin5", 104,  "tank",  ,  , 5,  grisvert, []],
  ["FluteFin6", 105, "tank",  ,  , 5,  grisvert, []],
  ["FluteNeutre1", 110,  "tank",  ,  , 5,  grisvert, []],
  ["FluteNeutre2", 111,  "tank",  ,  , 5,  grisvert, []],
  ["FluteNeutre3", 112, "tank",  ,  , 5,  grisvert, []],
 
  ["ClarinetteDebut1", 115,  "tank",  676,  204, 6, violet, [], 1],
  ["ClarinetteDebut2", 116,  "tank",  ,  , 6,  violet, []],  
  ["ClarinetteDebut3", 117,  "tank",  ,  , 6,  violet, []],
  ["ClarinetteMilieu1", 120,  "tank",  ,  , 6,  violet, []],  
  ["ClarinetteMilieu2", 121,  "tank",  ,  , 6,  violet, []],
  ["ClarinetteMilieu3", 122,  "tank",  ,  , 6,  violet, []],  
  ["ClarinetteMilieu4", 123,  "tank",  ,  , 6,  violet, []],
  ["ClarinetteMilieu5", 124,  "tank",  ,  , 6,  violet, []],
  ["ClarinetteFin1", 125,  "tank",  ,  , 6,  violet, []],  
  ["ClarinetteFin2", 126,  "tank",  ,  , 6,  violet, []],
  ["ClarinetteFin3", 127,  "tank",  ,  , 6,  violet, []],

  ["BassonDebut1", 130,  "tank",  246,  204, 7, ocre, [], 1],
  ["BassonDebut2", 131,  "tank",  ,  , 7,  ocre, []],  
  ["BassonDebut3", 132,  "tank",  ,  , 7,  ocre, []],
  ["BassonDebut4", 133,  "tank",  ,  , 7,  ocre, []],  
  ["BassonMilieu1", 135,  "tank",  ,  , 7,  ocre, []],
  ["BassonMilieu2", 136,  "tank",  ,  , 7,  ocre, []],  
  ["BassonMilieu3", 137,  "tank",  ,  , 7,  ocre, []],
  ["BassonMilieu4", 138,  "tank",  ,  , 7,  ocre, []],
  ["BassonMilieu5", 139,  "tank",  ,  , 7,  ocre, []],
  ["BassonNeutre1", 140,  "tank",  ,  , 7,  ocre, []],
  ["BassonNeutre2", 141,  "tank",  ,  , 7,  ocre, []],

  ["Percu1", 150,  "tank",  449,  22, 8, grisvert, [], 1],
  ["Percu2", 151,  "tank",  ,  , 8,  grisvert, []],  
  ["Percu3", 152,  "tank",  ,  , 8,  grisvert, []],
  ["Percu4", 153,  "tank",  ,  , 8,  grisvert, []],
  ["Percu5", 154,  "tank",  ,  , 8,  grisvert, []],
  ["Percu6", 155, "tank",  ,  , 8,  grisvert, []],
  ["Percu7", 156, "tank",  ,  , 8,  grisvert, []],

  ["NappeViolons", 50, "group",  292,  419, 15, bleu, [], 1],
  ["NappeAlto", 2, "group",  443,  428, 15, bleu, [], 1],
  ["NappeCello", 3,  "group",  601,  503, 15, bleu, [], 1],
  ["NappeCelloRythme", 4,  "group",  791,  503, 15, bleu, [], 1],
  ["NappeCTB", 5,  "group",  845,  308, 15, bleu, [], 1],
  ["NappeCTBRythme", 6,  "group",  845,  393, 15, bleu, [], 1],
  ["S1Action", 7,  "group",  167,  418, 15, bleu, [], 1],
  ["S2Action", 8,  "group",  167,  517, 15, bleu, [], 1],

  ["RiseHit",   160,  "group",  603, 22, 7, bleu, [], 10]
];

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