/**
 * @fileOverview Example of control with Interface Z sensors
 * @copyright (C) 2024 Bertrand Petit-Hédelin
 * @author Bertrand Petit-Hédelin <bertrand@hedelin.fr>
 * @version 1.0
 *
 * Pièce dans C:\Users\berpetit\Documents\Ableton\Orchestre16SkiniIZ Project
 */
// @ts-nocheck
"use strict"
"use hopscript"

import { ReactiveMachine } from "@hop/hiphop";
import * as utilsSkini from "../serveur/utilsSkini.mjs";

// Declaration for the communication with the Skini engine
let midimix;
let oscMidiLocal;
let gcs;
let DAW;
let serveur;

// Avec des valeurs initiales
let CCChannel = 1;
let CCTempo = 100;
let tempoMax = 160;
let tempoMin = 40;
let tempoGlobal = 60;

let tempoValue = 0;
let tempoRythme = 0;
let tempoLimit = 0;
let tempoIncrease = true;
let transposeValue = 0;
let ratioTranspose = 1763 / 1000;
let offsetTranspose = 635 / 10;

let debug = false;
let debug1 = true;

/**
 * Called by Skini to set up the communication with the Skini engine
 * @function
 * @param  {Object} serveur reference
 * @param  {Object} DAW management reference
 * @param  {Object} groupe client sons reference
 * @param  {Object} OSC and Midi reference
 * @param  {Object} Midi reception reference
 */
export function setServ(ser, daw, groupeCS, oscMidi, mix) {
  if (debug) console.log("hh_ORCHESTRATION: setServ");
  DAW = daw;
  serveur = ser;
  gcs = groupeCS;
  oscMidiLocal = oscMidi;
  midimix = mix;
}

/**
 * Defines and creates the hiphop programm
 * @function
 * @param  {Object} parameter for the piece
 */
export function setSignals(param) {
  var i = 0;

  let interTextOUT = utilsSkini.creationInterfacesOUT(param.groupesDesSons);
  let interTextIN = utilsSkini.creationInterfacesIN(param.groupesDesSons);

  var IZsignals = ["INTERFACEZ_RC", "INTERFACEZ_RC0", "INTERFACEZ_RC1", "INTERFACEZ_RC2",
    "INTERFACEZ_RC3", "INTERFACEZ_RC4", "INTERFACEZ_RC5", "INTERFACEZ_RC6",
    "INTERFACEZ_RC7", "INTERFACEZ_RC8", "INTERFACEZ_RC9", "INTERFACEZ_RC10", "INTERFACEZ_RC11"];

  console.log("inter:", interTextIN, interTextOUT, IZsignals);

  hiphop module sensorIZ(name) {
    in sensorIZ, tick;
    every (sensorIZ.now) {
      host{ console.log(" *-*-*-*-*-*-*-", name, ":", sensorIZ.nowval[1] ); }

      if( sensorIZ.nowval[1] < 4000 && sensorIZ.nowval[1] > 3000) {
        host{utilsSkini.alertInfoScoreON(name + ": Zone 1", serveur);}
        host{ DAW.putPatternInQueue(name + "-1"); }
      }
      else if( sensorIZ.nowval[1] < 2999 && sensorIZ.nowval[1] > 2000) {
        host{utilsSkini.alertInfoScoreON(name + " : Zone 2", serveur);}
        host{ DAW.putPatternInQueue(name + "-2"); }
      }
      else if( sensorIZ.nowval[1] < 1999 && sensorIZ.nowval[1] > 1000) {
        host{utilsSkini.alertInfoScoreON(name + " : Zone 3", serveur);}
        host{ DAW.putPatternInQueue(name + "-3"); }
      }
      else if( sensorIZ.nowval[1] < 999 && sensorIZ.nowval[1] > 500) {
        host{utilsSkini.alertInfoScoreON(name + ": Zone 4", serveur);}
        host{ DAW.putPatternInQueue(name + "-4"); }
      }
      else if( sensorIZ.nowval[1] < 499 && sensorIZ.nowval[1] > 0) {
        host{utilsSkini.alertInfoScoreON(name + ": Zone 5", serveur);}
        host{ DAW.putPatternInQueue(name + "-5"); }
      }
      await count (1,tick.now);
    }
  }

  const Program = hiphop module() {

    in start, halt, tick, DAWON, patternSignal, pulsation, midiSignal, emptyQueueSignal;
    in stopResevoir, stopMoveTempo;
    in ... ${ IZsignals };
    out ... ${ interTextOUT };
    in ... ${ interTextIN };

    loop{
      await(tick.now);
      await(start.now);
      host{ utilsSkini.addSceneScore(1, serveur); }
      host{ utilsSkini.alertInfoScoreON("Skini HH", serveur); }
      host{ console.log("Skini HH"); }

      abort {
        fork {
          every(tick.now){
            host{
              //console.log("tick from HH", i++);
              gcs.setTickOnControler(i++);
            }
          }

        } par {
          run sensorIZ("sensor0") {INTERFACEZ_RC0 as sensorIZ, tick as tick};
        } par {
          run sensorIZ("sensor1") {INTERFACEZ_RC1 as sensorIZ, tick as tick};
        } par {
          run sensorIZ("sensor2") {INTERFACEZ_RC2 as sensorIZ, tick as tick};
        } par {
          run sensorIZ("sensor3") {INTERFACEZ_RC3 as sensorIZ, tick as tick};
        } par {
          run sensorIZ("sensor4") {INTERFACEZ_RC4 as sensorIZ, tick as tick};
        } par {
          run sensorIZ("sensor5") {INTERFACEZ_RC5 as sensorIZ, tick as tick};
        }
        // A partir de RC6 c'est MiniWI
        // par {
        //   run sensorIZ("sensor6") {INTERFACEZ_RC6 as sensorIZ, tick as tick};
        // } par {
        //   run sensorIZ("sensor7") {INTERFACEZ_RC7 as sensorIZ, tick as tick};
        // } par {
        //   run sensorIZ("sensor8") {INTERFACEZ_RC8 as sensorIZ, tick as tick};
        // } par {
        //   run sensorIZ("sensor9") {INTERFACEZ_RC9 as sensorIZ, tick as tick};
        // } par {
        //   run sensorIZ("sensor10") {INTERFACEZ_RC10 as sensorIZ, tick as tick};
        // } par {
        //   run sensorIZ("sensor11") {INTERFACEZ_RC11 as sensorIZ, tick as tick};
        // }
      } when (halt.now);
      host{ console.log("Reçu Halt"); }
      host{ utilsSkini.alertInfoScoreON("Stop Skini HH", serveur); }
      await  count (8,tick.now);
      host{ utilsSkini.alertInfoScoreOFF(serveur); }
    }
  }
  const prg = new ReactiveMachine(Program, "orchestration");
  return prg;
}

