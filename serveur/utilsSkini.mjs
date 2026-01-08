/**
 * @fileOverview Utility functions for the scenarii written in hiphop.js
 * @copyright (C) 2022-2024 Bertrand Petit-Hédelin
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
 * 
 * @author Bertrand Petit-Hédelin <bertrand@hedelin.fr>
 * @version 1.4
 */

"use strict"
"use hopscript"

import { ReactiveMachine } from "@hop/hiphop";
import { format } from "util";

let debug = true;
let debug1 = true;

export function creationInterfacesOUT(groupes) {
  if (groupes !== undefined) {
    return groupes.map(function (k) {
      return k[0] + "OUT";
    })
  };
}

export function creationInterfacesIN(groupes) {
  if (groupes !== undefined) {
    return groupes.map(function (k) {
        return k[0] + "IN";
    })
  };
}

export function setTempo(value, par, oscMidiLocal, midimix, 
  tempoMax, tempoMin, CCChannel, CCTempo) {

  if (midimix.getAbletonLinkStatus()) {
    if (debug) console.log("ORCHESTRATION: set tempo Link:", value);
    midimix.setTempoLink(value);
    return;
  }
  if (value > tempoMax || value < tempoMin) {
    console.log("ERR: Tempo set out of range:", value, "Should be between:", tempoMin, "and", tempoMax);
    return;
  }
  let tempo = Math.round(127 / (tempoMax - tempoMin) * (value - tempoMin));
  if (debug) {
    console.log("Set tempo:", value, par.busMidiDAW, CCChannel, CCTempo, tempo, oscMidiLocal.getMidiPortClipToDAW());
  }
  oscMidiLocal.sendControlChange(par.busMidiDAW, CCChannel, CCTempo, tempo);
}

export function moveTempo(value, limit) {
  if (tempoLimit >= limit) {
    tempoLimit = 0;
    tempoIncrease = !tempoIncrease;
  }

  if (tempoIncrease) {
    tempoGlobal += value;
  } else {
    tempoGlobal -= value;
  }
  if (debug) console.log("moveTempo:", tempoGlobal);
  setTempo(tempoGlobal);
  tempoLimit++;
}

export function addSceneScore(message, serveur) {
  var msg = {
    type: 'addSceneScore',
    value: message
  }
  serveur.broadcast(JSON.stringify(msg));
}

export function alertInfoScoreON(message, serveur) {
  var msg = {
    type: 'alertInfoScoreON',
    value: message
  }
  serveur.broadcast(JSON.stringify(msg));
}

export function alertInfoScoreOFF(serveur) {
  var msg = {
    type: 'alertInfoScoreOFF',
  }
  serveur.broadcast(JSON.stringify(msg));
}

export function removeSceneScore(message, serveur) {
  var msg = {
    type: 'removeSceneScore',
    value: message
  }
  serveur.broadcast(JSON.stringify(msg));
}

export function refreshSceneScore(serveur) {
  var msg = {
    type: 'refreshSceneScore',
  }
  serveur.broadcast(JSON.stringify(msg));
}

export function setListeDesTypes(serveur) {
  var msg = {
    type: 'setListeDesTypes',
  }
  serveur.broadcast(JSON.stringify(msg));
}

export function setTypeList(liste, serveur) {
  var msg = {
    type: 'listeDesTypes',
    text: liste
  }
  serveur.broadcast(JSON.stringify(msg));
}

export function setpatternListLength(long, groupe, gcs){
  gcs.setpatternListLength([long,groupe]);
}