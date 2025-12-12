"use strict"

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

/***********************************
  Paramètres du simulateur
  Si ces valeurs ne sont pas données c'est celle qui
  sont dans le simulateur qui sont utilisées
************************************/
exports.tempoMax =  3000; // En ms
exports.tempoMin = 1000; // En ms
exports.limiteDureeAttente = 33; // En pulsations


/************************************
FICHIERS DES CLIPS CSV
************************************/
// Fichiers CSV à mettre dans l'ordre selon les choix dans le controleur
// mise à jour dans websocketServer, sur demande client "loadAbletonTable"

exports.configClips = "./pieces/mystiqueElectro.csv";

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans la contrôleur.
Nom du sous répartoire ./sounds/xxxx
*************************************/
exports.soundFilesPath1 = "mystique";

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
  ["Razor",   1, "group", 170, 100, 20, rouge, [], 1 ],  //0 index d'objet graphique
  ["Evolve",   2, "group", 170, 580, 20, vert, [], 1 ],  //1
  ["Massive",   3, "group", 350, 100,  20, gris, [], 1 ],//2
  ["FM8",   4, "group", 20, 380, 20, violet, [], 1 ],   //3
  ["Prism",   5, "group", 350,580, 20, terre, [], 1 ],  //4
  ["MassiveX1",   6, "group", 540,100, 20, rose, [], 1 ],//5
  ["MassiveX2",   7, "group", 740,480, 20, rose, [], 1 ],//6
];
exports.groupesDesSons = groupesDesSons;

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
];
