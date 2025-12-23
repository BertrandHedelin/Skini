var Clean1_2_3_4, sensor0, Clean5_6_7_8, sensor2, Clean9_10_11_12, Clean13_14_15_16, tick, zone1, zone2, zone3, zone4, zone7, zone8, zone9, zone10;



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


    const Clean1_2_3_4 = hiphop module() {


        {

        host{
          DAW.cleanQueue(1);
        }

        host{
          DAW.cleanQueue(2);
        }

        host{
          DAW.cleanQueue(3);
        }

        host{
          DAW.cleanQueue(4);
        }

        }

    }

    const Clean5_6_7_8 = hiphop module() {


        {

        host{
          DAW.cleanQueue(5);
        }

        host{
          DAW.cleanQueue(6);
        }

        host{
          DAW.cleanQueue(7);
        }

        host{
          DAW.cleanQueue(8);
        }

        }

    }

    const Clean9_10_11_12 = hiphop module() {


        {

        host{
          DAW.cleanQueue(9);
        }

        host{
          DAW.cleanQueue(10);
        }

        host{
          DAW.cleanQueue(11);
        }

        host{
          DAW.cleanQueue(12);
        }

        }

    }

    const Clean13_14_15_16 = hiphop module() {


        {

        host{
          DAW.cleanQueue(13);
        }

        host{
          DAW.cleanQueue(14);
        }

        host{
          DAW.cleanQueue(15);
        }

        host{
          DAW.cleanQueue(16);
        }

        }

    }


  const Program = hiphop module() {
    in start, halt, tick, DAWON, patternSignal, pulsation, midiSignal, emptyQueueSignal;
    inout stopReservoir, stopMoveTempo, stopSolo, stopTransposition;
    in ... ${ IZsignals };
    out ... ${ interTextOUT };
    in ... ${ interTextIN };


    inout sensor0;

    inout sensor2;


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

      host {console.log('moduleIZ');}

      {

      host{
        gcs.setpatternListLength([5,255]);
      }
    // Pour un arrêt général. Note D-2 sur canal 5 pour skini soit 6 pour Ableton

      host{
        oscMidiLocal.sendNoteOn(param.busMidiDAW,
        5,
        2,
        100);
      }

      host{gcs.setTimerDivision(1);}

      host{setTempo(80, param);}

      host{
        serveur.broadcast(JSON.stringify({
              type: 'addSceneScore',
              value:1
            }));
      }
      yield;

      }

    loop{
      // Pour un arrêt général. Note D-2 sur canal 5 pour skini soit 6 pour Ableton

      host{
        oscMidiLocal.sendNoteOn(param.busMidiDAW,
        5,
        2,
        100);
      }

        {

          await count(1, INTERFACEZ_RC4.now && ( INTERFACEZ_RC4.nowval[0] === 4
                        && INTERFACEZ_RC4.nowval[1] >500
                        && INTERFACEZ_RC4.nowval[1] <5000));

        host{
          serveur.broadcast(JSON.stringify({
                type: 'alertInfoScoreON',
                value:'Il y a quelque chose !'
              }));
        }

        host { DAW.putPatternInQueue('Intro');}

        host{
          serveur.broadcast(JSON.stringify({
                type: 'alertInfoScoreON',
                value:'Intoduction'
              }));
        }

        host{
          serveur.broadcast(JSON.stringify({
                type: 'alertInfoScoreOFF'
              }));
        }

        }

      host{
        serveur.broadcast(JSON.stringify({
              type: 'alertInfoScoreON',
              value:'1ere séquence'
            }));
      }

      abort {

        abort{

          fork {
              // Capteur de distance

            every count( 1, INTERFACEZ_RC0.now && ( INTERFACEZ_RC0.nowval[0] === 0
                      && INTERFACEZ_RC0.nowval[1] >1000
                      && INTERFACEZ_RC0.nowval[1] <4000)) {

                host {console.log('Sensor0');}

              host{
                serveur.broadcast(JSON.stringify({
                      type: 'alertInfoScoreON',
                      value:'Sensor0'
                    }));
              }

              fork {

              }

              par {

                      emit zone7OUT([true,255]);
                      host{gcs.informSelecteurOnMenuChange(255," zone7", true) }
                  await count(4, tick.now);

                      emit zone7OUT([false,255]);
                      host{gcs.informSelecteurOnMenuChange(255," zone7", false) }
                  yield;

              }

              run ${ Clean1_2_3_4} () {*};

            }

          }

          par {

            every count( 1, INTERFACEZ_RC1.now && ( INTERFACEZ_RC1.nowval[0] === 1
                      && INTERFACEZ_RC1.nowval[1] >1000
                      && INTERFACEZ_RC1.nowval[1] <4000)) {

                host {console.log('Sensor1');}

              host{
                serveur.broadcast(JSON.stringify({
                      type: 'alertInfoScoreON',
                      value:'Sensor1'
                    }));
              }

              fork {

              }

              par {

                      emit zone8OUT([true,255]);
                      host{gcs.informSelecteurOnMenuChange(255," zone8", true) }
                  await count(4, tick.now);

                      emit zone8OUT([false,255]);
                      host{gcs.informSelecteurOnMenuChange(255," zone8", false) }
                  yield;

              }

              run ${ Clean5_6_7_8} () {*};

            }

          }

          par {

            every count( 1, INTERFACEZ_RC2.now && ( INTERFACEZ_RC2.nowval[0] === 2
                      && INTERFACEZ_RC2.nowval[1] >1000
                      && INTERFACEZ_RC2.nowval[1] <4000)) {

                host {console.log('Sensor2');}

              host{
                serveur.broadcast(JSON.stringify({
                      type: 'alertInfoScoreON',
                      value:'Sensor2'
                    }));
              }

              fork {

                      emit zone3OUT([true,255]);
                      host{gcs.informSelecteurOnMenuChange(255," zone3", true) }
                  await count(4, tick.now);

                      emit zone3OUT([false,255]);
                      host{gcs.informSelecteurOnMenuChange(255," zone3", false) }
                  yield;

              }

              par {

                      emit zone9OUT([true,255]);
                      host{gcs.informSelecteurOnMenuChange(255," zone9", true) }
                  await count(4, tick.now);

                      emit zone9OUT([false,255]);
                      host{gcs.informSelecteurOnMenuChange(255," zone9", false) }
                  yield;

              }

              run ${ Clean9_10_11_12} () {*};

            }

          }

          par {

            every count( 1, INTERFACEZ_RC3.now && ( INTERFACEZ_RC3.nowval[0] === 3
                      && INTERFACEZ_RC3.nowval[1] >1000
                      && INTERFACEZ_RC3.nowval[1] <4000)) {

                host {console.log('Sensor3');}

              host{
                serveur.broadcast(JSON.stringify({
                      type: 'alertInfoScoreON',
                      value:'Sensor3'
                    }));
              }

            }

          }

          par {

            fork {

                    emit zone4OUT([true,255]);
                    host{gcs.informSelecteurOnMenuChange(255," zone4", true) }
                await count(4, tick.now);

                    emit zone4OUT([false,255]);
                    host{gcs.informSelecteurOnMenuChange(255," zone4", false) }
                yield;

            }

            par {

                    emit zone10OUT([true,255]);
                    host{gcs.informSelecteurOnMenuChange(255," zone10", true) }
                await count(4, tick.now);

                    emit zone10OUT([false,255]);
                    host{gcs.informSelecteurOnMenuChange(255," zone10", false) }
                yield;

            }

            run ${ Clean13_14_15_16} () {*};

          }

        } when count(60, tick.now);

          emit zone7OUT([false,255]);
          host{gcs.informSelecteurOnMenuChange(255," zone7", false) }

          emit zone8OUT([false,255]);
          host{gcs.informSelecteurOnMenuChange(255," zone8", false) }

          emit zone9OUT([false,255]);
          host{gcs.informSelecteurOnMenuChange(255," zone9", false) }

          emit zone10OUT([false,255]);
          host{gcs.informSelecteurOnMenuChange(255," zone10", false) }

        host{
          serveur.broadcast(JSON.stringify({
                type: 'alertInfoScoreON',
                value:'2eme séquence'
              }));
        }

        abort{

          fork {
              // Capteur de distance

            every count( 1, INTERFACEZ_RC0.now && ( INTERFACEZ_RC0.nowval[0] === 0
                      && INTERFACEZ_RC0.nowval[1] >1000
                      && INTERFACEZ_RC0.nowval[1] <4000)) {

                host {console.log('Sensor0');}

              host{
                serveur.broadcast(JSON.stringify({
                      type: 'alertInfoScoreON',
                      value:'Sensor0'
                    }));
              }

              fork {

                      emit zone1OUT([true,255]);
                      host{gcs.informSelecteurOnMenuChange(255," zone1", true) }
                  await count(4, tick.now);

                      emit zone1OUT([false,255]);
                      host{gcs.informSelecteurOnMenuChange(255," zone1", false) }
                  yield;

              }

              run ${ Clean1_2_3_4} () {*};

            }

          }

          par {

            every count( 1, INTERFACEZ_RC1.now && ( INTERFACEZ_RC1.nowval[0] === 1
                      && INTERFACEZ_RC1.nowval[1] >1000
                      && INTERFACEZ_RC1.nowval[1] <4000)) {

                host {console.log('Sensor1');}

              host{
                serveur.broadcast(JSON.stringify({
                      type: 'alertInfoScoreON',
                      value:'Sensor1'
                    }));
              }

              fork {

                      emit zone2OUT([true,255]);
                      host{gcs.informSelecteurOnMenuChange(255," zone2", true) }
                  await count(4, tick.now);

                      emit zone2OUT([false,255]);
                      host{gcs.informSelecteurOnMenuChange(255," zone2", false) }
                  yield;

              }

              run ${ Clean5_6_7_8} () {*};

            }

          }

          par {

            every count( 1, INTERFACEZ_RC2.now && ( INTERFACEZ_RC2.nowval[0] === 2
                      && INTERFACEZ_RC2.nowval[1] >1000
                      && INTERFACEZ_RC2.nowval[1] <4000)) {

                host {console.log('Sensor2');}

              host{
                serveur.broadcast(JSON.stringify({
                      type: 'alertInfoScoreON',
                      value:'Sensor2'
                    }));
              }

              fork {

                      emit zone3OUT([true,255]);
                      host{gcs.informSelecteurOnMenuChange(255," zone3", true) }
                  await count(4, tick.now);

                      emit zone3OUT([false,255]);
                      host{gcs.informSelecteurOnMenuChange(255," zone3", false) }
                  yield;

              }

              run ${ Clean9_10_11_12} () {*};

            }

          }

          par {

            every count( 1, INTERFACEZ_RC3.now && ( INTERFACEZ_RC3.nowval[0] === 3
                      && INTERFACEZ_RC3.nowval[1] >1000
                      && INTERFACEZ_RC3.nowval[1] <4000)) {

                host {console.log('Sensor3');}

              host{
                serveur.broadcast(JSON.stringify({
                      type: 'alertInfoScoreON',
                      value:'Sensor3'
                    }));
              }

              fork {

                      emit zone4OUT([true,255]);
                      host{gcs.informSelecteurOnMenuChange(255," zone4", true) }
                  await count(4, tick.now);

                      emit zone4OUT([false,255]);
                      host{gcs.informSelecteurOnMenuChange(255," zone4", false) }
                  yield;

              }

              run ${ Clean13_14_15_16} () {*};

            }

          }

        } when count(60, tick.now);

          emit zone1OUT([false,255]);
          host{gcs.informSelecteurOnMenuChange(255," zone1", false) }

          emit zone2OUT([false,255]);
          host{gcs.informSelecteurOnMenuChange(255," zone2", false) }

          emit zone3OUT([false,255]);
          host{gcs.informSelecteurOnMenuChange(255," zone3", false) }

          emit zone4OUT([false,255]);
          host{gcs.informSelecteurOnMenuChange(255," zone4", false) }

      } when count( 1, INTERFACEZ_RC11.now && ( INTERFACEZ_RC11.nowval[0] === 11
                && INTERFACEZ_RC11.nowval[1] >500
                && INTERFACEZ_RC11.nowval[1] <5000));

      yield;

        emit zone1OUT([false,255]);
        host{gcs.informSelecteurOnMenuChange(255," zone1", false) }

        emit zone2OUT([false,255]);
        host{gcs.informSelecteurOnMenuChange(255," zone2", false) }

        emit zone3OUT([false,255]);
        host{gcs.informSelecteurOnMenuChange(255," zone3", false) }

        emit zone4OUT([false,255]);
        host{gcs.informSelecteurOnMenuChange(255," zone4", false) }

        emit zone7OUT([false,255]);
        host{gcs.informSelecteurOnMenuChange(255," zone7", false) }

        emit zone8OUT([false,255]);
        host{gcs.informSelecteurOnMenuChange(255," zone8", false) }

        emit zone9OUT([false,255]);
        host{gcs.informSelecteurOnMenuChange(255," zone9", false) }

        emit zone10OUT([false,255]);
        host{gcs.informSelecteurOnMenuChange(255," zone10", false) }

      host{
        DAW.cleanQueues();
        gcs.cleanChoiceList(255);
      }

      host{
        serveur.broadcast(JSON.stringify({
              type: 'alertInfoScoreON',
              value:'Morceau de fin'
            }));
      }

      host { DAW.putPatternInQueue('Fin');}

      abort {

        await count(88,tick.now);

      } when count( 1, INTERFACEZ_RC11.now && ( INTERFACEZ_RC11.nowval[0] === 11
                && INTERFACEZ_RC11.nowval[1] >100
                && INTERFACEZ_RC11.nowval[1] <5000));
    // Pour un arrêt général. Note D-2 sur canal 5 pour skini soit 6 pour Ableton

      host{
        oscMidiLocal.sendNoteOn(param.busMidiDAW,
        5,
        2,
        100);
      }

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
