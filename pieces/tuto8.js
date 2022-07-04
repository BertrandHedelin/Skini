"use strict"

// Default parameter file

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

//exports.sessionPath = "./pieces/";
exports.piecePath = "./pieces/";

// Piece Bitwig en OSC si la paramètre est false
// Sinon Skini parle MIDI
exports.directMidiON = true;

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
exports.limiteDureeAttente = 33; // En pulsations

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
exports.soundFilesPath1 = "";

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
exports.simulatorInAseperateGroup = false; // Si true, le dernier groupe client est réservé au simulateur.

// Pour un contrôle des Raspberries
exports.useRaspberries = false;
exports.playBufferMessage = 'test';
exports.raspOSCPort = 4000;

function setnbeDeGroupesClients(num) {
  this.nbeDeGroupesClients = num;
}
exports.setnbeDeGroupesClients = setnbeDeGroupesClients;

// La synchro Midi, Link. Synchro Bitwig OSC par défaut si Midi et Link false.
exports.synchoOnMidiClock = false;
exports.synchroLink = true;
exports.synchroSkini = false;
exports.timer = 500; // Pour une tempo de 110

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

var groupesDesSons = [
  // Pour group: nom du groupe (0), index du groupe (1), type (2), x(3), y(4), nbe d'éléments(5), color(6), prédécesseurs(7), n° de scène graphique
];
exports.groupesDesSons = groupesDesSons;

