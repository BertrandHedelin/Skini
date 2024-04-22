"use strict"
"use hopscript"

import { ReactiveMachine } from "@hop/hiphop";

//let par;
let midimix;
let oscMidiLocal;
let gcs;
let DAW;
let serveur;
let signals;

// Avec des valeurs initiales
let CCChannel = 1;
let CCTempo = 100;
let tempoMax = 160;
let tempoMin = 40;
let tempoGlobal = 60;

let debug = false;
let debug1 = true;

export function setServ(ser, daw, groupeCS, oscMidi, mix) {
  if (debug) console.log("hh_ORCHESTRATION: setServ");
  DAW = daw;
  serveur = ser;
  gcs = groupeCS;
  oscMidiLocal = oscMidi;
  midimix = mix;
}

function setTempo(value) {
  tempoGlobal = value;

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
    console.log("Set tempo blockly:", value, par.busMidiDAW, CCChannel, CCTempo, tempo, oscMidiLocal.getMidiPortClipToDAW());
  }
  oscMidiLocal.sendControlChange(par.busMidiDAW, CCChannel, CCTempo, tempo);
}

let tempoValue = 0;
let tempoRythme = 0;
let tempoLimit = 0;
let tempoIncrease = true;
let transposeValue = 0;
let ratioTranspose = 1763 / 1000;
let offsetTranspose = 635 / 10;


function moveTempo(value, limit) {
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

function creationInterfaces(groupes) {
  if (groupes !== undefined) {
    return `out ${groupes.map(function (k) { 
      console.log(k[0]);
      return k[0] + "OUT";
     })}; in ${groupes.map(function (k) { 
      console.log(k[0]);
      return k[0] + "IN";
     })};
    `
   }
}

export function setSignals(param) {
  var i = 0;
  let interText =  creationInterfaces(param.groupesDesSons);
  console.log("inter:", interText);

  hiphop interface groupes {out group1OUT, group2OUT; in group1IN, group2IN;};
  //hiphop interface groupes interText;

  const Program = hiphop module() implements groupes {
  //const Program = hiphop module() {
    in A, B, R;
    out O, P;
    in start, halt, tick, DAWON, patternSignal, pulsation, midiSignal, emptyQueueSignal;
    in stopResevoir, stopMoveTempo;

    await (start.now);
  
    fork {
      abort(halt.now){
        every(tick.now){
          host{ console.log("tick from HH 2", i++); }
        }
      }
      host{ console.log("Reçu Halt"); }
    } par {
      do {
       fork {
          await (A.now);
          emit P();
        } par {
          await (B.now);
        }
       emit O();
       host{ console.log("aaaa"); }
      } every(R.now)
    }
  }
  
  const prg = new ReactiveMachine(Program, "orchestration");
  return prg;
}

