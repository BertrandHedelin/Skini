var FluteC, FluteEb, FluteC1, FluteC2, FluteC3, FluteC4, FluteC5, FluteC6, FluteC7, FluteC8, FluteC9, FluteC10, FluteC11, FluteC12, FluteC13, FluteC14, FluteC15, FluteFmin, tick, FluteEb1, FluteEb2, FluteEb3, FluteEb4, FluteEb5, FluteEb6, FluteEb7, FluteEb8, FluteEb9, FluteEb10, FluteEb11, FluteEb12, FluteEb13, FluteEb14, FluteEb15, FluteFmin1, FluteFmin2, FluteFmin3, FluteFmin4, FluteFmin5, FluteFmin6, FluteFmin7, FluteFmin8, FluteFmin9, FluteFmin10, FluteFmin11, FluteFmin12, FluteFmin13, FluteFmin14, FluteFmin15, PianoC, PianoEb, PianoFmin;


// Fonctionne avec EtudeHarmonie5.als.
// 2 simulateurs : 0 et 1.
//
// Type Horizontaux et verticaux, et reservoirs
//
//
//
//
//
//
//
//
//
//
//

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
  if(midimix.getAbletonLinkStatus()) {
    if(debug) console.log("ORCHESTRATION: set tempo Link:", value);
    midimix.setTempoLink(value);
    return;
  }

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


    const FluteC = hiphop module () {
    in stopReservoir;
    in FluteC1IN;
      in FluteC2IN;
      in FluteC3IN;
      in FluteC4IN;
      in FluteC5IN;
      in FluteC6IN;
      in FluteC7IN;
      in FluteC8IN;
      in FluteC9IN;
      in FluteC10IN;
      in FluteC11IN;
      in FluteC12IN;
      in FluteC13IN;
      in FluteC14IN;
      in FluteC15IN;
      out FluteC1OUT;
      out FluteC2OUT;
      out FluteC3OUT;
      out FluteC4OUT;
      out FluteC5OUT;
      out FluteC6OUT;
      out FluteC7OUT;
      out FluteC8OUT;
      out FluteC9OUT;
      out FluteC10OUT;
      out FluteC11OUT;
      out FluteC12OUT;
      out FluteC13OUT;
      out FluteC14OUT;
      out FluteC15OUT;

  	${ tank.makeReservoir(255, ["FluteC1","FluteC2","FluteC3","FluteC4","FluteC5","FluteC6","FluteC7","FluteC8","FluteC9","FluteC10","FluteC11","FluteC12","FluteC13","FluteC14","FluteC15"]) };
  }

    const FluteEb = hiphop module () {
    in stopReservoir;
    in FluteEb1IN;
      in FluteEb2IN;
      in FluteEb3IN;
      in FluteEb4IN;
      in FluteEb5IN;
      in FluteEb6IN;
      in FluteEb7IN;
      in FluteEb8IN;
      in FluteEb9IN;
      in FluteEb10IN;
      in FluteEb11IN;
      in FluteEb12IN;
      in FluteEb13IN;
      in FluteEb14IN;
      in FluteEb15IN;
      out FluteEb1OUT;
      out FluteEb2OUT;
      out FluteEb3OUT;
      out FluteEb4OUT;
      out FluteEb5OUT;
      out FluteEb6OUT;
      out FluteEb7OUT;
      out FluteEb8OUT;
      out FluteEb9OUT;
      out FluteEb10OUT;
      out FluteEb11OUT;
      out FluteEb12OUT;
      out FluteEb13OUT;
      out FluteEb14OUT;
      out FluteEb15OUT;

  	${ tank.makeReservoir(255, ["FluteEb1","FluteEb2","FluteEb3","FluteEb4","FluteEb5","FluteEb6","FluteEb7","FluteEb8","FluteEb9","FluteEb10","FluteEb11","FluteEb12","FluteEb13","FluteEb14","FluteEb15"]) };
  }

    const FluteFmin = hiphop module () {
    in stopReservoir;
    in FluteFmin1IN;
      in FluteFmin2IN;
      in FluteFmin3IN;
      in FluteFmin4IN;
      in FluteFmin5IN;
      in FluteFmin6IN;
      in FluteFmin7IN;
      in FluteFmin8IN;
      in FluteFmin9IN;
      in FluteFmin10IN;
      in FluteFmin11IN;
      in FluteFmin12IN;
      in FluteFmin13IN;
      in FluteFmin14IN;
      in FluteFmin15IN;
      out FluteFmin1OUT;
      out FluteFmin2OUT;
      out FluteFmin3OUT;
      out FluteFmin4OUT;
      out FluteFmin5OUT;
      out FluteFmin6OUT;
      out FluteFmin7OUT;
      out FluteFmin8OUT;
      out FluteFmin9OUT;
      out FluteFmin10OUT;
      out FluteFmin11OUT;
      out FluteFmin12OUT;
      out FluteFmin13OUT;
      out FluteFmin14OUT;
      out FluteFmin15OUT;

  	${ tank.makeReservoir(255, ["FluteFmin1","FluteFmin2","FluteFmin3","FluteFmin4","FluteFmin5","FluteFmin6","FluteFmin7","FluteFmin8","FluteFmin9","FluteFmin10","FluteFmin11","FluteFmin12","FluteFmin13","FluteFmin14","FluteFmin15"]) };
  }


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

      host{
        serveur.broadcast(JSON.stringify({
          type: 'setListeDesTypes',
        }));
      }

    host{setTempo(80, param);}

    await immediate (tick.now);
    host{gcs.setTimerDivision(1);}
    host{
      serveur.broadcast(JSON.stringify({
            type: 'addSceneScore',
            value:1
          }));
    }
    yield;

    host{
      serveur.broadcast(JSON.stringify({
            type: 'listeDesTypes',
            text:'0,1,2,3,4,5,6,7,8,9'
          }));
    }

    host{
      gcs.setpatternListLength([10,255]);
    }

      host {console.log('EtudeSkiniHarmonie5');}

    fork {

            emit PianoCOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," PianoC", true) }
            emit PianoEbOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," PianoEb", true) }
            emit PianoFminOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," PianoFmin", true) }
        await count(200, tick.now);

            emit PianoCOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," PianoC", false) }
            emit PianoEbOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," PianoEb", false) }
            emit PianoFminOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," PianoFmin", false) }
        yield;

    }

    par {

      fork {
        run ${ FluteC} () {*};
      }
       par{
          run ${ FluteEb} () {*};
        }
         par{
          run ${ FluteFmin} () {*};
        }

    }

    host{
      DAW.cleanQueues();
      gcs.cleanChoiceList(255);
    }

    host{
      serveur.broadcast(JSON.stringify({
            type: 'alertInfoScoreON',
            value:'Fin EtudeSkiniHarmonie5'
          }));
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
