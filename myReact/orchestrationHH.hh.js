var TankUn, foo, TankDeux, bar, tank0, tank1, tank2, tank3, tank4, tank5, tank6, tick;


// avec demoAbleton.als dans Live

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
var CCChannel = 1;
var CCTempo = 100;
var tempoMax = 160;
var tempoMin = 40;
var tempoGlobal = 60;

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

var tempoValue = 0;
var tempoRythme = 0;
var tempoLimit = 0;
var tempoIncrease = true;
var transposeValue = 0;
var ratioTranspose = 1.763;
var offsetTranspose = 63.5;

// Création des signaux OUT de contrôle de la matrice des possibles
// Ici et immédiatement.
var signals = [];
var halt, start, emptyQueueSignal, patternSignal, stopReservoir, stopMoveTempo;
var tickCounter = 0;

export function setSignals(param) {
  par = param;
  let interTextOUT = utilsSkini.creationInterfacesOUT(param.groupesDesSons);
  let interTextIN = utilsSkini.creationInterfacesIN(param.groupesDesSons);

  const IZsignals = ["INTERFACEZ_RC", "INTERFACEZ_RC0", "INTERFACEZ_RC1", "INTERFACEZ_RC2",
    "INTERFACEZ_RC3", "INTERFACEZ_RC4", "INTERFACEZ_RC5", "INTERFACEZ_RC6",
    "INTERFACEZ_RC7", "INTERFACEZ_RC8", "INTERFACEZ_RC9", "INTERFACEZ_RC10", "INTERFACEZ_RC11"];


    const TankUn = hiphop module () {
    in stopReservoir;
    in tank0IN;
      in tank1IN;
      in tank2IN;
      in tank3IN;
      out tank0OUT;
      out tank1OUT;
      out tank2OUT;
      out tank3OUT;

  	${ tank.makeReservoir(255, ["tank0","tank1","tank2","tank3"]) };
  }

    const TankDeux = hiphop module () {
    in stopReservoir;
    in tank4IN;
      in tank5IN;
      in tank6IN;
      out tank4OUT;
      out tank5OUT;
      out tank6OUT;

  	${ tank.makeReservoir(255, ["tank4","tank5","tank6"]) };
  }


  const Program = hiphop module() {
    in start, halt, tick, DAWON, patternSignal, pulsation, midiSignal, emptyQueueSignal;
    inout stopReservoir, stopMoveTempo, stopSolo, stopTransposition;
    in ... ${ IZsignals };
    out ... ${ interTextOUT };
    in ... ${ interTextIN };


    inout foo;

    inout bar;


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

    host{gcs.setTimerDivision(1);}

    host{
      serveur.broadcast(JSON.stringify({
            type: 'addSceneScore',
            value:1
          }));
    }
    yield;

    let aleaRandomBlock281289 = Math.floor(Math.random() * 2);
    host{console.log("--- random_body:", aleaRandomBlock281289 )}
    if ( aleaRandomBlock281289 === 0 ){

      host{
        serveur.broadcast(JSON.stringify({
              type: 'alertInfoScoreON',
              value:'Tuto random block 1'
            }));
      }

          run ${ TankUn} () {*};

          run ${ TankDeux} () {*};

      await count(20,tick.now);

    }else if( aleaRandomBlock281289 === 1 ){

      host{
        serveur.broadcast(JSON.stringify({
              type: 'alertInfoScoreON',
              value:'Tuto random block 2'
            }));
      }

      signal stopM467067;
      M467067 : {
      fork{
          run ${ TankUn} () {*, stopM467067 as stopReservoir};

        }par{
          await count(20, tick.now);
          emit stopM467067();
          break M467067;
        }
      }
      yield;

    }
    host{
      serveur.broadcast(JSON.stringify({
            type: 'alertInfoScoreON',
            value:'FIN'
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
