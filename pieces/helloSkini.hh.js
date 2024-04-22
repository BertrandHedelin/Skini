"use strict"
"use hopscript"

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
  console.log("inter:", interTextIN, interTextOUT);

  const Program = hiphop module() {
    in A, B, R;
    out O, P;
    in start, halt, tick, DAWON, patternSignal, pulsation, midiSignal, emptyQueueSignal;
    in stopResevoir, stopMoveTempo;
    out ... ${ interTextOUT };
    in ... ${ interTextIN };

    await(start.now);
    host{utilsSkini.addSceneScore(1, serveur);}
    host{utilsSkini.alertInfoScoreON("Skini HH", serveur);}

    emit group1OUT([true, 0]);

    fork {
      abort(halt.now){
        every(tick.now){
          host{
            console.log("tick from HH", i++);
            gcs.setTickOnControler(i);
          }
        }
      }
      emit group1OUT([false, 0]);
      host{ console.log("Reçu Halt"); }
    } par {
      do {
       fork {
          await(A.now);
          emit P();
        } par {
          await(B.now);
        }
       emit O();
       host{ console.log("aaaa"); }
      } every(R.now)
    }
  }

  const prg = new ReactiveMachine(Program, "orchestration");
  return prg;
}

