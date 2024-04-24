"use strict"
"use hopscript"

// Pose des problèmes sur les déclarations de signaux. !!! 23/04/2024

import { ReactiveMachine } from "@hop/hiphop";
import * as utilsSkini from "../serveur/utilsSkini.mjs";

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

let tempoValue = 0;
let tempoRythme = 0;
let tempoLimit = 0;
let tempoIncrease = true;
let transposeValue = 0;
let ratioTranspose = 1763 / 1000;
let offsetTranspose = 635 / 10;

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

export function setSignals(param) {
  var i = 0;
  let interTextOUT = utilsSkini.creationInterfacesOUT(param.groupesDesSons);
  let interTextIN = utilsSkini.creationInterfacesIN(param.groupesDesSons);
  var IZsignals = ["INTERFACEZ_RC","INTERFACEZ_RC0", "INTERFACEZ_RC1", "INTERFACEZ_RC2",
  "INTERFACEZ_RC3", "INTERFACEZ_RC4","INTERFACEZ_RC5","INTERFACEZ_RC6",
  "INTERFACEZ_RC7","INTERFACEZ_RC8","INTERFACEZ_RC9", "INTERFACEZ_RC10","INTERFACEZ_RC11"];
  
  console.log("inter:", interTextIN, interTextOUT, IZsignals);

  const Program = hiphop module() {

    in start, halt, tick, DAWON, patternSignal, pulsation, midiSignal, emptyQueueSignal;
    in stopResevoir, stopMoveTempo;
    in ... ${IZsignals};
    out ... ${ interTextOUT };
    in ... ${ interTextIN };

    await(tick.now);
    await(start.now);
    host{utilsSkini.addSceneScore(1, serveur);}
    host{utilsSkini.alertInfoScoreON("Skini HH", serveur);}

    emit sensor0OUT([true, 0]);
    host{ DAW.putPatternInQueue("sensor0-1");}

    fork {
      abort(halt.now){
        every(tick.now){
          host{
            console.log("tick from HH", i++);
            gcs.setTickOnControler(i);
          }
        }
      }
      emit sensor0OUT([false, 0]);
      host{ console.log("Reçu Halt"); }
      host{utilsSkini.alertInfoScoreOFF(serveur);}
    } par {
      every(INTERFACEZ_RC0.now) {
        //host{ console.log(" *-*-*-*-*-*-*- Sensor RC0", INTERFACEZ_RC0.nowval ); }
        //host{utilsSkini.alertInfoScoreON("Sensor RC0 : " + INTERFACEZ_RC0.nowval[1], serveur);}
        if( INTERFACEZ_RC0.nowval[1] < 4000 && INTERFACEZ_RC0.nowval[1] > 3000) {
          host{utilsSkini.alertInfoScoreON("Sensor RC0 : Zone 1", serveur);}
          //host{ DAW.putPatternInQueue("sensorO-1");}
        }
        if( INTERFACEZ_RC0.nowval[1] < 2999 && INTERFACEZ_RC0.nowval[1] > 2000) {
          host{utilsSkini.alertInfoScoreON("Sensor RC0 : Zone 2", serveur);}
        }
        else if( INTERFACEZ_RC0.nowval[1] < 1999 && INTERFACEZ_RC0.nowval[1] > 1000) {
          host{utilsSkini.alertInfoScoreON("Sensor RC0 : Zone 3", serveur);}
        }
        else if( INTERFACEZ_RC0.nowval[1] < 999 && INTERFACEZ_RC0.nowval[1] > 500) {
          host{utilsSkini.alertInfoScoreON("Sensor RC0 : Zone 4", serveur);}
        }
      }
    }
  }

  const prg = new ReactiveMachine(Program, "orchestration");
  return prg;
}

