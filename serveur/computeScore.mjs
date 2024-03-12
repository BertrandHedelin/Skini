/**
 * @fileOverview
 * For evaluating and giving "game scores" when using Skini for interactive Game
 * using the selection of sequences of patterns on the client (audience) side.
 * @copyright (C) 2022 Bertrand Petit-Hédelin
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.

 * @author Bertrand Petit-Hédelin <bertrand@hedelin.fr>
 * @version 1.4
 */
'use strict'

import * as DAW from './controleDAW.mjs'
//var DAW = require('./controleDAW');

var debug = false;
var debug1 = true;

const typeDebut = 1;
const typeMilieu = 2;
const typeFin = 3;
const typeNeutre = 4;
const typeMauvais = 5;

/*===================================================================================

Memo of Pattern : Note,	Note stop, Flag usage,	Texte, Fichier son,
Instrument [5],	Slot, Type [7], not used, Groupe,	Durée

Gestion des clients memorySortable

 clientsEnCours est un tableau d'objets client : 

  var client = {
    pseudo : pseudo,
    score : 0,
    preSequence : -1,
  }

=====================================================================================*/

/**
 * A Adds a client to the list of connected clients if it does not already exist.
 * @param  {string} pseudo
 * @param  {number} id
 * @param  {number} groupe
 * @param  {array} clientsEnCours
 */
export function putInClientsEnCours(pseudo, id, groupe, clientsEnCours) {
  // On se base sur le pseudo
  // l'id pourrait être utilisé plus tard
  if (clientsEnCours !== undefined) {
    for (var i = 0; i < clientsEnCours.length; i++) {
      if (clientsEnCours[i].pseudo === pseudo) {
        return false;
      }
    }
  }
  var client = {
    pseudo: pseudo,
    groupe: groupe,
    score: 0,
    preSequence: -1,
  }
  clientsEnCours.push(client);
  return true;
}

/**
 * Compute a new score for a player using the pseudo.
 * @param  {string} pseudo the player
 * @param  {number} score value of the new score
 * @param  {array} clientsEnCours list of players
 */
export function updateScore(pseudo, score, clientsEnCours) {
  var scoreTotal = 0;
  if (clientsEnCours !== undefined) {
    for (var i = 0; i < clientsEnCours.length; i++) {
      if (clientsEnCours[i].pseudo === pseudo) {
        clientsEnCours[i].score += score;
        scoreTotal = clientsEnCours[i].score;
      }
    }
  }
  if (debug) console.log("computeScore.js: updateScore: ", clientsEnCours);
  return scoreTotal;
}

/**
 * In order to check if a client is asking for the same sequence several times.
 * @param  {string} pseudo
 * @param  {array} clientsEnCours
 */
export function getPreSequence(pseudo, clientsEnCours) {
  for (var i = 0; i < clientsEnCours.length; i++) {
    if (clientsEnCours[i].pseudo === pseudo) {
      return clientsEnCours[i].preSequence;
    }
  }
  console.log("WARN: computeScore.js: getPreSequence : pas de présequence pour ", pseudo, clientsEnCours);
  return false;
}

/**
 * Insert a sequence of patterns in a list for a specific client.
 * @param  {string} pseudo
 * @param  {array} sequence
 * @param  {array} clientsEnCours
 */
export function setPreSequence(pseudo, sequence, clientsEnCours) {
  for (var i = 0; i < clientsEnCours.length; i++) {
    if (clientsEnCours[i].pseudo === pseudo) {
      // Plutot que de simplement remplacer preSequence comme on le fait ici, on pourrait ajouter la sequence à la liste
      // pour avoir des traitements plus riches que de vérifier une simple répetition immédiate
      clientsEnCours[i].preSequence = sequence;
      return true;
    }
  }
  console.log("WARN: computeScore.js: setPreSequence : pas de pseudo :", pseudo);
  return false;
}

/**
 * Clean the list of scores.
 * @param  {} clientsEnCours
 */
export function resetClientEnCours(clientsEnCours) {
  if (clientsEnCours !== undefined) {
    for (var i = 0; i < clientsEnCours.length; i++) {
      clientsEnCours[i].score = 0;
    }
  }
  if (debug) console.log("computeScore.js: resetClientEnCours: ", clientsEnCours);
}

function isInstrumentInTheList(instr, liste) {
  for (var j = 0; j < liste.length; j++) {
    if (liste[j] === instr) {
      return true; // déja dans la liste
    }
  }
  return false;
}

/*=================================================================
wasPatternAlreadySelected

sequence est un tableau de notes skini

===================================================================*/
/**
 * To check if a pattern was already in the sequence.
 * @param {number} index pattern number
 * @param {array} sequence 
 * @returns {boolean}
 */
function wasPatternAlreadySelected(index, sequence) {
  if (sequence === -1) {
    return false;
  }
  for (var i = 0; i < sequence.length; i++) {
    if (sequence[i] == index) {
      return true;
    }
  }
  return false;
}

/*=================================================================
computeScoreDMFN, Régles de notation début, milieu, fin, neutre et mauvais

Retourne un score en fonction d'un tableau de types de patterns
et du tableau des précédents types de patterns qui avait été
envoyé au serveur.

- ListeTypes est un tableau ordonné d'elements correspondant à une liste de patterns:
  var element = {
    type : // Selon le fichier csv
    index : // Note Skini
  }

- preSequence est un tableau de note Skini

La répétition d'un pattern est pénalisée

===================================================================*/
/**
 * Compute a score using a list of Skini Notes (pattern numbers ) according 
 * to a previous sequence (list of patterns).
 * @param {array} listeTypes 
 * @param {array} preSequence
 * @returns {number} score
 */
function computeScoreDMFN(listeTypes, preSequence) {
  if (debug) console.log("computeScore.js:computeScore: preSequence:", preSequence);

  var score = 0;
  if (listeTypes.length > 1) {
    // Traitement du Début
    if (wasPatternAlreadySelected(listeTypes[0].index, preSequence)) {
      score -= 5;
    } else if (listeTypes[0].type === typeDebut) {
      score += 10;
    } else if (listeTypes[0].type === typeMilieu || listeTypes[0].type === typeNeutre) {
      score += 5;
    } else if (listeTypes[0].type === typeFin) {
      score -= 10;
    } else if (listeTypes[0].type === typeMauvais) {
      score -= 15;
    }

    // Fin
    if (wasPatternAlreadySelected(listeTypes[listeTypes.length - 1].index, preSequence)) {
      score -= 5;
    } else if (listeTypes[listeTypes.length - 1].type === typeFin) {
      score += 10;
    } else if (listeTypes[listeTypes.length - 1].type === typeMilieu || listeTypes[listeTypes.length - 1].type === typeNeutre) {
      score += 5;
    } else if (listeTypes[listeTypes.length - 1].type === typeDebut) {
      score -= 10;
    } else if (listeTypes[listeTypes.length - 1].type === typeMauvais) {
      score -= 15;
    }

    // Le reste
    for (var i = 1; i < listeTypes.length - 1; i++) {
      if (wasPatternAlreadySelected(listeTypes[i].index, preSequence)) {
        score -= 5;
      } else if (listeTypes[i].type === typeFin || listeTypes[i].type === typeDebut) {
        score -= 5;
      } else if (listeTypes[i].type === typeMilieu) {
        score += 10;
      } else if (listeTypes[i].type === typeNeutre) {
        score += 5;
      } else if (listeTypes[i].type === typeMauvais) {
        score -= 15;
      }
      if (debug) console.log("computeScore.js:computeScore: le reste:", listeTypes[i], score);
    }
  } else if (wasPatternAlreadySelected(listeTypes[0].index, preSequence)) { // Pour un seul élément
    score -= 5;
  } else if (listeTypes[0].type === typeMilieu || listeTypes[0].type === typeNeutre) {
    score += 5;
  } else if (listeTypes[0].type === typeMauvais) {
    score -= 15;
  }
  if (debug) console.log("computeScore.js: computeScore", listeTypes, ": score:", score);
  return score;
}

/*=================================================================
computeScoreInclass 

Retourne un score en fonction d'un tableau de types de patterns
et du tableau des précédents types de patterns qui avait été
envoyé au serveur.

- ListeTypes est un tableau d'elements:
  var element = {
    type : // Selon le fichier csv
    index : // Note Skini
  }

- preSequence est le tableau de note Skini de la précédente soumission.

===================================================================*/

/**
 * Compute a score according the classes of the patterns.
 * If you ask for a pattern in the same class without repeating you get points.
 * If you ask again for the same patterns as the previous time you lose points.
 * If you repeat the same pattern in the sequence you lose points.
 * @param {array} listeTypes list of previous selected classes of patterns
 * @param {number} patternClass 
 * @param {array} preSequence previous sequence 
 * @returns {number} score the computed score
 */
function computeScoreInclass(listeTypes, patternClass, preSequence) {
  var score = 0;

  for (var i = 0; i < listeTypes.length; i++) {
    if (debug) console.log("computeScore.js :computecomputeScoreInclass: listeTypes[i].type", listeTypes[i].type, " patternClass: ", patternClass);
    if (listeTypes[i].type === patternClass) {
      score += 10;
    } else {
      score -= 10;
    }
  }

  // Si on redemande les mêmes patterns que la fois précédente on perd des points
  for (var i = 0; i < listeTypes.length; i++) {
    if (wasPatternAlreadySelected(listeTypes[i].index, preSequence)) {
      score -= 5;
    }
  }

  // Si on répète le même pattern dans la séquence on perd des points
  for (var i = 0; i < listeTypes.length; i++) {
    for (var j = i + 1; j < listeTypes.length; j++) {
      if (listeTypes[i].index === listeTypes[j].index) {
        score -= 10;
      }
    }
  }

  if (debug) console.log("computeScore.js :computecomputeScoreInclass:", patternClass, " last computation:", score);
  return score;
}

/*=================================================================
 evaluateSequenceOfPatterns

 - patternSequence : un tableau avec les notes Skini associées aux patterns
 - preSequence : obtenu avec getPreSequence(msgRecu.pseudo, clientsEnCours), un pseudo et 
 - clientsEnCours qui est un tableau d'objets client : 

  var client = {
    pseudo : pseudo,
    score : 0,
    preSequence : -1,
    groupe : groupe
  }

- computeScorePolicy définit le type de scoring, DMFN (début, milieu, fin, neutre), appartenance des patterns
à une classe (même tonalité, même mode, même style, même rytme...)

- computeScoreClass définit la classe pour les scorings qui en ont besoin (même tonalité, même mode, même style, même rytme...)

===================================================================*/
/**
 * Compute the score when submitting a sequence of patten.
 * @param  {array} patternSequence
 * @param  {array} preSequence
 * @param  {number} computeScorePolicy define the algorithm used to compute the score
 * @param  {number} computeScoreClass
 */
export function evaluateSequenceOfPatterns(patternSequence, preSequence, computeScorePolicy, computeScoreClass) {
  var score = 0;
  var choix = new Array(patternSequence.length);
  var lesInstruments = [];

  // Etablir la liste des patterns (choix), car la séquence donnée en paramètre 
  // ne contient que des index (des notes midi au sens de SKini)
  if (debug) console.log("computeScore.js: evaluateSequenceOfPatterns", patternSequence);

  for (var i = 0; i < patternSequence.length; i++) {
    var pattern = DAW.getPatternFromNote(patternSequence[i]);
    if (pattern === undefined) {
      if(debug) console.log("WARN: computeScore.js: evaluateSequenceOfPatterns: pattern undefined");
    }
    choix[i] = pattern;
  }
  if (debug) console.log("computeScore.js: evaluateSequenceOfPatterns: choix: ", choix);

  //Quel sont les instruments concernés ? On en fait une liste "lesInstruments" dans un tableau
  //à partir de choix
  for (var i = 0; i < choix.length; i++) {
    if (choix[i] !== undefined) {
      if (!isInstrumentInTheList(choix[i][5], lesInstruments)) {
        lesInstruments.push(choix[i][5]);
      }
    }
  }
  if (debug) console.log("computeScore.js: evaluateSequenceOfPatterns: lesInstruments: ", lesInstruments);

  //Pour chaque instrument quelle est l'évaluation du score ?
  for (var i = 0; i < lesInstruments.length; i++) {
    //Créer la liste des types et index de pattern pour un instrument
    var typesInstrEnCours = [];
    for (var j = 0; j < choix.length; j++) {
      if (choix[j] !== undefined) {
        if (choix[j][5] === lesInstruments[i]) {
          var element = {
            type: choix[j][7],
            index: choix[j][0]
          }
          typesInstrEnCours.push(element);
        }
      }
    }
    // Calculer le score pour cet instrument et l'ajouter au total
    switch (computeScorePolicy) {
      case 0:
        if (debug) console.log("WARN: computeScore.js: evaluateSequenceOfPatterns: No policy for scoring this sequence.");
        break;

      case 1:
        score += computeScoreDMFN(typesInstrEnCours, preSequence);
        break;

      case 2:
        score += computeScoreInclass(typesInstrEnCours, computeScoreClass, preSequence);
        break;

      default:
        console.log("WARN: computeScore.js: evaluateSequenceOfPatterns: Policy unknown for scoring this sequence:", computeScorePolicy);
        break;
    }

  }
  if (debug) console.log("computeScore.js: evaluateSequenceOfPatterns: typesInstrEnCours: ", typesInstrEnCours, "preSequence:", preSequence, ":score: ", score);
  return score;
}
