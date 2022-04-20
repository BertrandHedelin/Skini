"use strict"

/* Configuration de l'architecture IP, OSC, Websocket ====================
24/1/2017 BH

© Copyright 2019-2021, B. Petit-Heidelein

exemple:
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

// Indexation des bus Midi dans OSCmidi de processing, pas utile avec Bitwig
// Il s'agit de l'index correspondant à l'élément du tableau midiConfig.json
// qui crée le bus midi pour ces commandes.
var midiConfig = require("../serveur/midiConfig.json");
var countBusOUT = 0;
for (var i = 0; i < midiConfig.length; i++) {
  if (midiConfig[i].type === "OUT") {
    if (midiConfig[i].spec === "clipToDAW") {
      exports.busMidiDAW = countBusOUT;
    }
    countBusOUT++;
  }
}

exports.sessionPath = "./pieces/";
exports.piecePath = "./pieces/";

// Piece Bitwig en OSC si la paramètre est false
// Sinon Skini parle MIDI
exports.directMidiON = true;

// La synchro midi est émise par la DAW ou pas
exports.timer = 1000;
exports.synchoOnMidiClock = false;
exports.synchroLink = true;
exports.synchroSkini = false;

// Pour charger les fonctions et modules de scenes de type GOLEM
exports.scenesON = false;

exports.english = true;

/***********************************
  Paramètres du simulateur
  Si ces valeurs ne sont pas données c'est celle qui
  sont dans le simulateur qui sont utilisées
************************************/
exports.tempoMax = 500; // En ms
exports.tempoMin = 500; // En ms
exports.limiteDureeAttente = 12; // En pulsations

/********************************************************
AUTOMATE
*********************************************************/
// Pour un automate conforme à un rechargement selon les déclarations de module HipHop
exports.reactOnPlay = false;

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans la contrôleur.
Nom du sous répartoire ./sounds/xxxx
*************************************/
exports.soundFilesPath1 = "mars2022";

/***************************************
CHEMIN DES PARTITIONS DES PATTERNS ET CONFIG AVEC MUSICIENS
****************************************/
exports.avecMusicien = false; // Pour mettre en place les spécificités au jeu avec des musiciens.
exports.decalageFIFOavecMusicien = 4; // Décalage de la FIFO vide avant le premier pattern dans une FIFO.
exports.patternScorePath1 = "";

/****************************************
ACTIVATION D'ALGORITHME D'ORGANISATION DES FIFOs
Si 0 ou undefined pas d'algorithme.
Si 1 algorithme de réorganisation Début, Milieu, Fin, Neutre (DFMN)
Dans le csv, D -> 1, M -> 2, F->3, N->4
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
exports.simulatorInAseperateGroup = false; // Si true, le dernier groupe client est réservé au simulateur.

// Pour un contrôle des Raspberries
exports.useRaspberries = true;
exports.playBufferMessage = 'test';
exports.raspOSCPort = 4000;

function setnbeDeGroupesClients(num) {
  this.nbeDeGroupesClients = num;
}
exports.setnbeDeGroupesClients = setnbeDeGroupesClients;

const bleu = "#008CBA";
const rouge = '#CF1919';
const vert = "#4CAF50";
const marron = '#666633';
const violet = '#797bbf';
const orange = '#b3712d';
const rose = '#E0095F';
const gris = '#5F6262';
const ocre = '#BCA104';
const terre = '#A76611';
const grisvert = '#039879';
const grisbleu = '#315A93';

const groupesDesSons = [
  // Pour group: nom du groupe (0), index du groupe (1), type (2), x(3), y(4), nbe d'éléments(5), color(6), prédécesseurs(7), n° de scène graphique
  ["groupe0", 0, "group", 170, 100, 20, rouge, [], 1],  //0 index d'objet graphique
  ["groupe1", 1, "group", 20, 240, 20, bleu, [], 1],     //1
  ["groupe2", 2, "group", 170, 580, 20, vert, [], 1],  //2
  ["groupe3", 3, "group", 350, 100, 20, gris, [], 1],   //3
  ["groupe4", 4, "group", 20, 380, 20, violet, [], 1], //4
  ["groupe5", 5, "group", 350, 580, 20, bleu, [], 1],  //5
  ["groupe6", 6, "group", 540, 100, 20, rose, [], 1],   //6
  ["groupe7", 7, "group", 740, 480, 20, terre, [], 1],
  ["groupe8", 8, "group", 540, 580, 20, orange, [], 1],
  ["groupe9", 9, "group", 740, 200, 20, marron, [], 1],
  ["groupe10", 10, "group", 350, 340, 20, grisvert, [], 1],
  ["groupe11", 11, "group", 540, 340, 20, grisbleu, [], 1],
  ["groupe12", 12, "group", 670, 340, 20, ocre, [], 1],
  ["groupe13", 13, "group", 820, 340, 20, rose, [], 1]
];
exports.groupesDesSons = groupesDesSons;
