var groupe0, groupe1, groupe2, groupe3, groupe4, tick;



"use strict";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ipConfig = require('../serveur/ipConfig.json');

import * as hh from "@hop/hiphop";
import * as utilsSkini from "../serveur/utilsSkini.mjs";
import * as tank from "../pieces/util/makeReservoir.mjs";

var par;
var debug = false;
var debug1 = true;
var midimix;
var oscMidiLocal;
var gcs;
var DAW;
var serveur;

// Avec des valeurs initiales
let CCChannel = 1;
let CCTempo = 100;
let tempoMax = 160;
let tempoMin = 40;
let tempoGlobal = 60;

export function setServ(ser, daw, groupeCS, oscMidi, mix){
  if(debug) console.log("hh_ORCHESTRATION: setServ");
  DAW = daw;
  serveur = ser;
  gcs = groupeCS;
  oscMidiLocal = oscMidi;
  midimix = mix;
  tank.initMakeReservoir(gcs, serveur);
}

function setTempo(value, param){
  tempoGlobal = value;

  // if(midimix.getAbletonLinkStatus()) {
  //   if(debug) console.log("ORCHESTRATION: set tempo Link:", value);
  //   midimix.setTempoLink(value);
  //   return;
  // }

  if ( value > tempoMax || value < tempoMin) {
    console.log("ERR: Tempo set out of range:", value, "Should be between:", tempoMin, "and", tempoMax);
    return;
  }
  var tempo = Math.round(127/(tempoMax - tempoMin) * (value - tempoMin));
  if (debug) {
    console.log("Set tempo blockly:", value, param.busMidiDAW, CCChannel, CCTempo, tempo, oscMidiLocal.getMidiPortClipToDAW() );
  }
  oscMidiLocal.sendControlChange(param.busMidiDAW, CCChannel, CCTempo, tempo);
}

let tempoValue = 0;
let tempoRythme = 0;
let tempoLimit = 0;
let tempoIncrease = true;
let transposeValue = 0;
let ratioTranspose = 1.763;
let offsetTranspose = 63.5;

// Création des signaux OUT de contrôle de la matrice des possibles
// Ici et immédiatement.
let signals = [];
let halt, start, emptyQueueSignal, patternSignal, stopReservoir, stopMoveTempo;
let tickCounter = 0;

export function setSignals(param) {
  par = param;
  let interTextOUT = utilsSkini.creationInterfacesOUT(param.groupesDesSons);
  let interTextIN = utilsSkini.creationInterfacesIN(param.groupesDesSons);

  const IZsignals = ["INTERFACEZ_RC", "INTERFACEZ_RC0", "INTERFACEZ_RC1", "INTERFACEZ_RC2",
    "INTERFACEZ_RC3", "INTERFACEZ_RC4", "INTERFACEZ_RC5", "INTERFACEZ_RC6",
    "INTERFACEZ_RC7", "INTERFACEZ_RC8", "INTERFACEZ_RC9", "INTERFACEZ_RC10", "INTERFACEZ_RC11"];



  const Program = hiphop module() {
    in start, halt, tick, DAWON, patternSignal, pulsation, midiSignal, emptyQueueSignal;
    inout stopReservoir, stopMoveTempo, stopSolo, stopTransposition;
    in ... ${ IZsignals };
    out ... ${ interTextOUT };
    in ... ${ interTextIN };



    loop{
      await(start.now);
      abort{
        fork {
          every(tick.now){
            host{
              //console.log("tick from HH", tickCounter++);
              gcs.setTickOnControler(tickCounter++);
            }
          }
        }par{

      host {console.log('Demo Ableton');}

    host{gcs.setTimerDivision(1);}

    host{setTempo(110, param);}

    host{
      serveur.broadcast(JSON.stringify({
            type: 'addSceneScore',
            value:1
          }));
    }
    yield;

    host{
      serveur.broadcast(JSON.stringify({
            type: 'alertInfoScoreON',
            value:'Demo Ableton'
          }));
    }

      emit groupe0OUT([true,255]);
      host{gcs.informSelecteurOnMenuChange(255," groupe0", true) }

      emit groupe1OUT([true,255]);
      host{gcs.informSelecteurOnMenuChange(255," groupe1", true) }

      emit groupe2OUT([true,255]);
      host{gcs.informSelecteurOnMenuChange(255," groupe2", true) }

      emit groupe3OUT([true,255]);
      host{gcs.informSelecteurOnMenuChange(255," groupe3", true) }

      emit groupe4OUT([true,255]);
      host{gcs.informSelecteurOnMenuChange(255," groupe4", true) }

    await count(10,tick.now);

      emit groupe0OUT([false,255]);
      host{gcs.informSelecteurOnMenuChange(255," groupe0", false) }

      emit groupe1OUT([false,255]);
      host{gcs.informSelecteurOnMenuChange(255," groupe1", false) }

      emit groupe2OUT([false,255]);
      host{gcs.informSelecteurOnMenuChange(255," groupe2", false) }

      emit groupe3OUT([false,255]);
      host{gcs.informSelecteurOnMenuChange(255," groupe3", false) }

      emit groupe4OUT([false,255]);
      host{gcs.informSelecteurOnMenuChange(255," groupe4", false) }

    host{
      serveur.broadcast(JSON.stringify({
            type: 'alertInfoScoreON',
            value:'Fin demo Ableton'
          }));
    }

    host{
      DAW.cleanQueues();
      gcs.cleanChoiceList(255);
    }

        }
      } when (halt.now);
    }
  }
  if(debug) console.log("orchestrationHH.mjs: setSignals", param.groupesDesSons);
  var machine = new hh.ReactiveMachine( Program, {sweep:true, tracePropagation: false, traceReactDuration: false});
  console.log("INFO: setSignals: Number of nets in Orchestration:",machine.nets.length);
  return machine;
}
