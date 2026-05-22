var FluteD, tick, FluteE, FluteD1, FluteD2, FluteD3, FluteD4, FluteD5, FluteD6, FluteD7, FluteD8, FluteD9, FluteD10, FluteD11, FluteD12, FluteE1, FluteE2, FluteE3, FluteE4, FluteE5, FluteE6, FluteE7, FluteE8, FluteE9, FluteE10, FluteE11, FluteE12, Percu, PianoE, PianoD;


// Fonctionne avec EtudeSkiniHarmonie2.als de Live.
// Pour les tests, j'aime bien utiliser le
// simulateurListe pour suivre son comportement.
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


    const FluteD = hiphop module () {
    in stopReservoir;
    in FluteD1IN;
      in FluteD2IN;
      in FluteD3IN;
      in FluteD4IN;
      in FluteD5IN;
      in FluteD6IN;
      in FluteD7IN;
      in FluteD8IN;
      in FluteD9IN;
      in FluteD10IN;
      in FluteD11IN;
      in FluteD12IN;
      out FluteD1OUT;
      out FluteD2OUT;
      out FluteD3OUT;
      out FluteD4OUT;
      out FluteD5OUT;
      out FluteD6OUT;
      out FluteD7OUT;
      out FluteD8OUT;
      out FluteD9OUT;
      out FluteD10OUT;
      out FluteD11OUT;
      out FluteD12OUT;

  	${ tank.makeReservoir(255, ["FluteD1","FluteD2","FluteD3","FluteD4","FluteD5","FluteD6","FluteD7","FluteD8","FluteD9","FluteD10","FluteD11","FluteD12"]) };
  }

    const FluteE = hiphop module () {
    in stopReservoir;
    in FluteE1IN;
      in FluteE2IN;
      in FluteE3IN;
      in FluteE4IN;
      in FluteE5IN;
      in FluteE6IN;
      in FluteE7IN;
      in FluteE8IN;
      in FluteE9IN;
      in FluteE10IN;
      in FluteE11IN;
      in FluteE12IN;
      out FluteE1OUT;
      out FluteE2OUT;
      out FluteE3OUT;
      out FluteE4OUT;
      out FluteE5OUT;
      out FluteE6OUT;
      out FluteE7OUT;
      out FluteE8OUT;
      out FluteE9OUT;
      out FluteE10OUT;
      out FluteE11OUT;
      out FluteE12OUT;

  	${ tank.makeReservoir(255, ["FluteE1","FluteE2","FluteE3","FluteE4","FluteE5","FluteE6","FluteE7","FluteE8","FluteE9","FluteE10","FluteE11","FluteE12"]) };
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

    await immediate (tick.now);
    host{gcs.setTimerDivision(1);}
    host{
      gcs.setpatternListLength([3,255]);
    }

    host{setTempo(60, param);}

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
            value:'Etude Harmonie 2'
          }));
    }

    await count(2,tick.now);

    host{
      serveur.broadcast(JSON.stringify({
            type: 'alertInfoScoreOFF'
          }));
    }

      host {console.log('Etude Harmonie 2');}

    fork {

            emit PercuOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," Percu", true) }
        await count(30, tick.now);

            emit PercuOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," Percu", false) }
        yield;

    }

    par {

            emit PianoEOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," PianoE", true) }
        await count(50, tick.now);

            emit PianoEOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," PianoE", false) }
        yield;

    }

    par {

            emit PianoDOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," PianoD", true) }
        await count(50, tick.now);

            emit PianoDOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," PianoD", false) }
        yield;

    }

    par {

      fork {
        run ${ FluteD} () {*};
      }

    }

    par {

      fork {
        run ${ FluteE} () {*};
      }

    }

    par {

        signal inverseTempo;
        host {console.log("-- Start move tempo")}
        abort {
          loop{
            fork {
              every count( 3, tick.now) {
                emit inverseTempo();
              }
            }par{
              loop{
                abort{
                    every count(4, tick.now) {
                      host{
                      tempoGlobal += 1;
                      setTempo(tempoGlobal, param);
                    }
                  }
                } when (inverseTempo.now);
                abort {
                  every count(4, tick.now) {
                    host{
                      tempoGlobal -= 1;
                      setTempo(tempoGlobal, param);
                    }
                  }
                } when (inverseTempo.now);
              }
            }
          }
        } when immediate(stopMoveTempo.now);
        host {console.log("-- Stop move tempo")}

    }

    host{
      DAW.cleanQueues();
      gcs.cleanChoiceList(255);
    }

    host{
      serveur.broadcast(JSON.stringify({
            type: 'alertInfoScoreON',
            value:'Fin Etude Harmonie 2'
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
