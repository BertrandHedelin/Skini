"use hopscript"


/***************** OPUS 5 - 2020 *****************************

© Copyright 2019-2020, B. Petit-Heidelein

==============================================================*/
var ipConfig = require("./ipConfig.json");

exports.outportProcessing =  ipConfig.outportProcessing;    // Automate vers Processing visu
exports.outportForMIDI =     ipConfig.OutPortOSCMIDItoDAW;  //12000; // Automate vers Processing OSC -> Midi
exports.portWebSocket =      ipConfig.InPortOSCMIDIfromDAW; //13000; // Port de réception des commandes OSC <- MIDI
exports.outportLumiere =     ipConfig.outportLumiere; // 7700;
exports.inportLumiere =      ipConfig.inportLumiere; // 9000;
exports.distribSequencerPort = ipConfig.distribSequencerPort;
exports.webServerPort = ipConfig.webserveurPort;

exports.remoteIPAddressImage = ipConfig.remoteIPAddressImage; // IP du serveur Processing pour la Visu
exports.remoteIPAddressSound = ipConfig.remoteIPAddressSound; // IP du serveur Procesing
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
exports.busMidiAbleton = 6; // Indispensable, bus de contrôle MIDI
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
exports.timer1  = 3000;  // 80 sur une mesure 4/4
exports.timer2  = 450 * 4; // Tempo de 120 sur une mesure 4/4
exports.timer3  = 550 * 4; // Tempo 108

// Ces données sont trés sensibles sur le bon déroulement de l'interaction
// Elles sont gérables depuis l'automate
exports.timerDivision1  = 4; 
exports.timerDivision2  = 4; 
exports.timerDivision3  = 8; 

// Choix de façon de faire réagir l'automate
// Par défaut c'est à la sélection. Avec reactOnPlay=true c'est au moment où se joue le pattern.
// Ceci a un impact important sur la façon de penser l'automate.
// Les stingers ne sont possibles qu'avec reactOnPlay=true.
exports.reactOnPlay = false;

/********************************************************
AUTOMATE HIPHOP
*********************************************************/
// Les fichiers Hiphop que décrivent les trajets
// Les signaux à utiliser dans ces programmes sont décrits dans "groupeDesSons"

exports.automate1 = './autoQuatuor1-1';
exports.automate2 = './autoQuatuor1-1';
exports.automate3 = '.autoQuatuor1-1';

// L'automate est conforme à un rechargement selon les déclarations de module HipHop
exports.canBeReloaded = true;

/************************************
FICHIERS DES CLIPS CSV
************************************/
// Fichiers CSV à mettre dans l'ordre selon les choix dans le controleur
// mise à jour dans websocketServer, sur demande client "loadAbletonTable"

exports.configClips = [
"./pieces/quatuor1.csv",
"./pieces/quatuor1.csv",
"./pieces/quatuor1.csv"
];

/*************************************
CHEMIN DES FICHIERS SONS MP3 pour les clients
Le choix se fait sur le client en fonction d'abletonON donc 
de la pièce choisie dans le contrôleur.
*************************************/
exports.soundFilesPath1 = "quatuor1";
exports.soundFilesPath2 = "quatuor1";
exports.soundFilesPath3 = "quatuor1";


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
exports.patternScorePath1 = "quatuor1";
exports.patternScorePath2 = "quatuor1";
exports.patternScorePath3 = "quatuor1";

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

const groupes = [
  ["violon1", 1, "group",  50,  30, 30, bleu, [], 1],
  ["violon2", 2, "group",  50,  180, 30, vert, [], 1],
  ["alto", 3,  "group",  50,  330, 30, marron, [], 1],
  ["cello", 4,  "group",  50,  480, 30, violet, [], 1],
  ["violon1A", 5, "group",  550,  30, 30, bleu, [], 1],
  ["violon2A", 6, "group",  550,  180, 30, vert, [], 1],
  ["altoA", 7,  "group",  550,  330, 30, marron, [], 1],
  ["celloA", 8,  "group",  550,  480, 30, violet, [], 1]
];

exports.groupesDesSons = [ groupes, groupes, groupes ];
