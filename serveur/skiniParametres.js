"use hopscript"

/* Configuration de l'architecture IP, OSC, Websocket ====================
24/1/2017 BH

© Copyright 2019-2021, B. Petit-Heidelein

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

===========================================================================*/

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

exports.english = true;

/***********************************
  Paramètres du simulateur
  Si ces valeurs ne sont pas données c'est celle qui
  sont dans le simulateur qui sont utilisées
************************************/
exports.tempoMax =  3000; // En ms
exports.tempoMin = 1000; // En ms
exports.limiteDureeAttente = 33; // En pulsations

/********************************************************

AUTOMATE

*********************************************************/
// Les fichiers Hiphop que décrivent les trajets
// Les signaux à utiliser dans ces programmes sont décrirs dans groupeDesSons

//exports.automate1 = './autoTrouveLaPercu-1';

// Pour un automate conforme à un rechargement selon les déclarations de module HipHop
exports.canBeReloaded = true;
exports.reactOnPlay = false;

/************************************
FICHIERS DES CLIPS CSV
************************************/
// Fichiers CSV à mettre dans l'ordre selon les choix dans le controleur
// mise à jour dans websocketServer, sur demande client "loadAbletonTable"

exports.configClips = "pieces/hope.csv";

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans la contrôleur.
Nom du sous répartoire ./sounds/xxxx
*************************************/
exports.soundFilesPath1 = "hope";

/***************************************
CHEMIN DES PARTITIONS DES PATTERNS ET CONFIG AVEC MUSICIENS
****************************************/
exports.avecMusicien = false; // Pour mettre en place les spécificités au jeu avec des musiciens.
exports.decalageFIFOavecMusicien = 4; // Décalage de la FIFO vide avant le premier pattern dans une FIFO.
exports.patternScorePath1 = "hope";

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

exports.shufflePatterns = false;
/*****************************************************************************

Gestion de la Matrice des possibles
Automate de gestion de la matrice des possibles

******************************************************************************/
exports.nbeDeGroupesClients = 3;
exports.simulatorInAseperateGroup = true; // Si true, le dernier groupe client est réservé au simulateur.

/*// Ces données sont trés sensibles sur le bon déroulement de l'interaction
// si pas de synchro MIDI
exports.timer1  = 0; 
exports.timer2  = 450 * 4; // Techno Pour un tempo de 120 sur une mesure 4/4
exports.timer3  = 450 * 4;

exports.timerDivision1  = 0; 
exports.timerDivision2  = 4; 
exports.timerDivision3  = 4; */

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

const groupesDesSons = [
  // Pour group: nom du groupe (0), index du groupe (1), type (2), x(3), y(4), nbe d'éléments(5), color(6), prédécesseurs(7), n° de scène graphique
  ["HopePiano", 0,  "group", 126, 252,  20, bleu,   [], 1 ],
  ["HopeBasseBreak", 1,    "group", 625, 178,  20, rouge,  [], 20 ], // dans une scène pas affichée
  ["HopeWalkingBasse", 2,    "group", 398, 242,  20, vert,   [], 1 ],
  ["HopeBatterie",3, "group", 276, 451,  20, marron, [], 1 ],
  ["HopeSaxo", 4, "group", 401, 77,   20, gris,   [], 1 ],
  ["HopeCornet",     5, "group", 523, 450,  20, ocre,   [], 1 ],
  ["HopeCongas",  6, "group", 702, 325,  20, rose,   [], 1 ],
  ["HopeThemeSax",  7, "group", 702, 252,  20, rose,   [], 20 ],
  ["HopeThemeCornet",  8, "group", 702, 325,  20, rose,   [], 20 ]
];
exports.groupesDesSons = groupesDesSons;

