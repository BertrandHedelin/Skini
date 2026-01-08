var TankUn, foo, TankDeux, bar, tank0, tank1, tank2, tank3, tank4, tank5, tank6, groupe0, tick, groupe1, piano8;


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
      gcs.setpatternListLength([3,255]);
    }

    host{
      serveur.broadcast(JSON.stringify({
            type: 'addSceneScore',
            value:1
          }));
    }
    yield;

      {

      host{
        serveur.broadcast(JSON.stringify({
              type: 'alertInfoScoreON',
              value:'-*-*- Run tank'
            }));
      }

        host {console.log('-*-*- Run tank');}

        {

        fork {
          run ${ TankUn} () {*};
        }

        fork {
          run ${ TankDeux} () {*};
        }

        await count(30,tick.now);

        emit stopReservoir();

        }

      host{
        serveur.broadcast(JSON.stringify({
              type: 'alertInfoScoreON',
              value:'-*-*- Random tanks during ticks'
            }));
      }

        host {console.log('-*-*- Random tanks during ticks');}

      yield;

      signal stopM164030;
      M164030 : {
      fork{
          run ${ TankDeux} () {*, stopM164030 as stopReservoir};

        }par{
          await count(20, tick.now);
          emit stopM164030();
          break M164030;
        }
      }
      yield;

      host{
        serveur.broadcast(JSON.stringify({
              type: 'alertInfoScoreON',
              value:'-*-*-  Run tanks pattern in group'
            }));
      }

        host {console.log('-*-*-  Run tanks pattern in group');}

        emit groupe0OUT([true,255]);
        host{gcs.informSelecteurOnMenuChange(255," groupe0", true) }

        signal stopRG97873;
        RG97873 : {
            fork{

              run ${ TankUn} () {*, stopRG97873 as stopReservoir};

            }par{
              run ${ TankDeux} () {*, stopRG97873 as stopReservoir};
            }par{
            await count(4, groupe0IN.now);
            emit stopRG97873();
            break RG97873;
          }
        }
        emit groupe0OUT([false,255]);
        host{gcs.informSelecteurOnMenuChange(255," groupe0", false) }

      yield;

      host{
        serveur.broadcast(JSON.stringify({
              type: 'alertInfoScoreON',
              value:'-*-*-  Run tanks waiting for pattern in DAW'
            }));
      }

        host {console.log('-*-*-  Run tanks waiting for pattern in DAW');}

        {

          emit groupe0OUT([true,255]);
          host{gcs.informSelecteurOnMenuChange(255," groupe0", true) }

        abort{

            signal stopRG731327;
            RG731327 : {
              fork{

                  run ${ TankUn} () {*, stopRG731327 as stopReservoir};

                }par{
                  run ${ TankDeux} () {*, stopRG731327 as stopReservoir};
                }par{
                await (patternSignal.now && (patternSignal.nowval[1] === "piano8"));
              }
            emit stopRG731327();
            break RG731327;
          }
            host {console.log('-*-*-  FIN TANK WAITING');}

        } when count(20, tick.now);

          emit groupe0OUT([false,255]);
          host{gcs.informSelecteurOnMenuChange(255," groupe0", false) }

        }

      host{
        DAW.cleanQueues();
        gcs.cleanChoiceList(255);
      }

      host{
        serveur.broadcast(JSON.stringify({
              type: 'alertInfoScoreON',
              value:'FIN TANK'
            }));
      }

        host {console.log('-*-*-  FIN TANK');}

      }

    yield;

      {

      host{
        serveur.broadcast(JSON.stringify({
              type: 'alertInfoScoreON',
              value:'-*-*-  Set group et unset group'
            }));
      }

        host {console.log('-*-*-  Set group et unset group');}

        emit groupe0OUT([true,255]);
        host{gcs.informSelecteurOnMenuChange(255," groupe0", true) }

      await count(5,tick.now);

        emit groupe0OUT([false,255]);
        host{gcs.informSelecteurOnMenuChange(255," groupe0", false) }

      yield;

      host{
        serveur.broadcast(JSON.stringify({
              type: 'alertInfoScoreON',
              value:'-*-*-  Set group during ticks'
            }));
      }

        host {console.log('-*-*-  Set group during ticks');}

            emit groupe0OUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," groupe0", true) }
            emit groupe1OUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," groupe1", true) }
        await count(5, tick.now);

            emit groupe0OUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," groupe0", false) }
            emit groupe1OUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," groupe1", false) }
        yield;

      yield;

      host{
        serveur.broadcast(JSON.stringify({
              type: 'alertInfoScoreON',
              value:'-*-*-  Set group during patterns in groups'
            }));
      }

        host {console.log('-*-*-  Set group during patterns in groups');}

        RG392662 : {
          fork{

          emit groupe0OUT([true,255]);
          host{gcs.informSelecteurOnMenuChange(255," groupe0", true) }

          emit groupe1OUT([true,255]);
          host{gcs.informSelecteurOnMenuChange(255," groupe1", true) }
    		}
         par{
          await count(2, groupe0IN.now);
          break RG392662;
        }par{
          await count(2, groupe1IN.now);
          break RG392662;
        }
      }
        emit groupe0OUT([false,255]);
        host{gcs.informSelecteurOnMenuChange(255," groupe0", false) }

        emit groupe1OUT([false,255]);
        host{gcs.informSelecteurOnMenuChange(255," groupe1", false) }
        yield;
      yield;

      host{
        serveur.broadcast(JSON.stringify({
              type: 'alertInfoScoreON',
              value:'-*-*-  Set randomly group during ticks'
            }));
      }

        host {console.log('-*-*-  Set randomly group during ticks');}

            emit groupe0OUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," groupe0", true) }
        await count(10, tick.now);

            emit groupe0OUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," groupe0", false) }
        yield;

      yield;

      host{
        DAW.cleanQueues();
        gcs.cleanChoiceList(255);
      }

        {

        host{
          serveur.broadcast(JSON.stringify({
                type: 'alertInfoScoreON',
                value:'-*-*-  wait for patterns in group'
              }));
        }

          host {console.log('-*-*-  wait for patterns in group');}

          emit groupe0OUT([true,255]);
          host{gcs.informSelecteurOnMenuChange(255," groupe0", true) }

          emit groupe1OUT([true,255]);
          host{gcs.informSelecteurOnMenuChange(255," groupe1", true) }

        abort{

          loop{

              await count(1, groupe0IN.now);

              host {console.log('pattern signal in group0');}

            yield;

          }

        } when count(10, tick.now);

        }

      host{
        DAW.cleanQueues();
        gcs.cleanChoiceList(255);
      }

        {

        host{
          serveur.broadcast(JSON.stringify({
                type: 'alertInfoScoreON',
                value:'-*-*-  wait for patterns in DAW'
              }));
        }

          host {console.log('-*-*-  wait for patterns in DAW');}

          emit groupe0OUT([true,255]);
          host{gcs.informSelecteurOnMenuChange(255," groupe0", true) }

          emit groupe1OUT([true,255]);
          host{gcs.informSelecteurOnMenuChange(255," groupe1", true) }

        abort{

          loop{

              await immediate (patternSignal.now && (patternSignal.nowval[1] === 'piano11'));

              host {console.log('pattern string piano 11');}

            yield;

          }

        } when count(20, tick.now);

        }

      host{
        DAW.cleanQueues();
        gcs.cleanChoiceList(255);
      }

        {

        host{
          serveur.broadcast(JSON.stringify({
                type: 'alertInfoScoreON',
                value:'-*-*-  Set group waiting for patterns in DAW'
              }));
        }

          host {console.log('-*-*-  Set group waiting for patterns in DAW');}

        yield;

          RG321083 : {
            fork{

            emit groupe0OUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," groupe0", true) }

            emit groupe1OUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," groupe1", true) }
      		}
           par{
            await immediate (patternSignal.now && (patternSignal.nowval[1] === 'piano11'));
            break RG321083;
          }par{
            await immediate (patternSignal.now && (patternSignal.nowval[1] === 'piano9'));
            break RG321083;
          }par{
            await immediate (patternSignal.now && (patternSignal.nowval[1] === 'piano8'));
            break RG321083;
          }
        }
          emit groupe0OUT([false,255]);
          host{gcs.informSelecteurOnMenuChange(255," groupe0", false) }

          emit groupe1OUT([false,255]);
          host{gcs.informSelecteurOnMenuChange(255," groupe1", false) }
          yield;
        host{
          serveur.broadcast(JSON.stringify({
                type: 'alertInfoScoreON',
                value:'-*-*-  FIN GROUPE'
              }));
        }

        }

      }

    host{
      serveur.broadcast(JSON.stringify({
            type: 'alertInfoScoreON',
            value:'-*-*-  FIN GROUPE'
          }));
    }

    host{
      DAW.cleanQueues();
      gcs.cleanChoiceList(255);
    }

      host {console.log('-*-*-  FIN GROUPE');}

        }
      } when (halt.now);
    }
  }
  if(debug) console.log("orchestrationHH.mjs: setSignals", param.groupesDesSons);
  var machine = new hh.ReactiveMachine( Program, {sweep:true, tracePropagation: false, traceReactDuration: false});
  console.log("INFO: setSignals: Number of nets in Orchestration:",machine.nets.length);
  return machine;
}
