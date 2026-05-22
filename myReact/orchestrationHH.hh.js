var PianoC, tick, PianoEb, PianoC1, PianoC2, PianoC3, PianoC4, PianoC5, PianoGb, PianoEb1, PianoEb2, PianoEb3, PianoEb4, PianoEb5, PianoA, PianoGb1, PianoGb2, PianoGb3, PianoGb4, PianoGb5, PianoA1, PianoA2, PianoA3, PianoA4, PianoA5, Viol1C, Viol2C, AltoC, CelloC, Viol1Eb, Viol2Eb, AltoEb, CelloEb, Viol1Gb, Viol2Gb, AltoGb, CelloGb, Viol1A, Viol2A, AltoA, CelloA;


// Fonctionne avec EtudeSkiniHarmonie4.als de Live.
// Pour les tests, j'aime bien utiliser le
// simulateurListe pour suivre son comportement.
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
    if(debug1) console.log("ORCHESTRATION: set tempo Link:", value);
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


    const PianoC = hiphop module () {
    in stopReservoir;
    in PianoC1IN;
      in PianoC2IN;
      in PianoC3IN;
      in PianoC4IN;
      in PianoC5IN;
      out PianoC1OUT;
      out PianoC2OUT;
      out PianoC3OUT;
      out PianoC4OUT;
      out PianoC5OUT;

  	${ tank.makeReservoir(255, ["PianoC1","PianoC2","PianoC3","PianoC4","PianoC5"]) };
  }

    const PianoEb = hiphop module () {
    in stopReservoir;
    in PianoEb1IN;
      in PianoEb2IN;
      in PianoEb3IN;
      in PianoEb4IN;
      in PianoEb5IN;
      out PianoEb1OUT;
      out PianoEb2OUT;
      out PianoEb3OUT;
      out PianoEb4OUT;
      out PianoEb5OUT;

  	${ tank.makeReservoir(255, ["PianoEb1","PianoEb2","PianoEb3","PianoEb4","PianoEb5"]) };
  }

    const PianoGb = hiphop module () {
    in stopReservoir;
    in PianoGb1IN;
      in PianoGb2IN;
      in PianoGb3IN;
      in PianoGb4IN;
      in PianoGb5IN;
      out PianoGb1OUT;
      out PianoGb2OUT;
      out PianoGb3OUT;
      out PianoGb4OUT;
      out PianoGb5OUT;

  	${ tank.makeReservoir(255, ["PianoGb1","PianoGb2","PianoGb3","PianoGb4","PianoGb5"]) };
  }

    const PianoA = hiphop module () {
    in stopReservoir;
    in PianoA1IN;
      in PianoA2IN;
      in PianoA3IN;
      in PianoA4IN;
      in PianoA5IN;
      out PianoA1OUT;
      out PianoA2OUT;
      out PianoA3OUT;
      out PianoA4OUT;
      out PianoA5OUT;

  	${ tank.makeReservoir(255, ["PianoA1","PianoA2","PianoA3","PianoA4","PianoA5"]) };
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

    host{setTempo(50, param);}

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
            value:'Etude Harmonie 4'
          }));
    }

    host { DAW.putPatternInQueue('PianoC1');}

    host{
      DAW.cleanQueues();
      gcs.cleanChoiceList(255);
    }

    await count(1,tick.now);

    host{
      serveur.broadcast(JSON.stringify({
            type: 'alertInfoScoreOFF'
          }));
    }

      host {console.log('Etude Harmonie 4');}

      {

      fork {

              emit Viol1COUT([true,255]);
              host{gcs.informSelecteurOnMenuChange(255," Viol1C", true) }
              emit Viol2COUT([true,255]);
              host{gcs.informSelecteurOnMenuChange(255," Viol2C", true) }
          await count(10, tick.now);

              emit Viol1COUT([false,255]);
              host{gcs.informSelecteurOnMenuChange(255," Viol1C", false) }
              emit Viol2COUT([false,255]);
              host{gcs.informSelecteurOnMenuChange(255," Viol2C", false) }
          yield;

      }

      par {

              emit Viol1EbOUT([true,255]);
              host{gcs.informSelecteurOnMenuChange(255," Viol1Eb", true) }
              emit Viol2EbOUT([true,255]);
              host{gcs.informSelecteurOnMenuChange(255," Viol2Eb", true) }
          await count(10, tick.now);

              emit Viol1EbOUT([false,255]);
              host{gcs.informSelecteurOnMenuChange(255," Viol1Eb", false) }
              emit Viol2EbOUT([false,255]);
              host{gcs.informSelecteurOnMenuChange(255," Viol2Eb", false) }
          yield;

      }

      par {

        abort{

            signal inverseTempo;
            host {console.log("-- Start move tempo")}
            abort {
              loop{
                fork {
                  every count( 4, tick.now) {
                    emit inverseTempo();
                  }
                }par{
                  loop{
                    abort{
                        every count(1, tick.now) {
                          host{
                          tempoGlobal += 1;
                          setTempo(tempoGlobal, param);
                        }
                      }
                    } when (inverseTempo.now);
                    abort {
                      every count(1, tick.now) {
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

        } when count(10, tick.now);

      }

      host{
        DAW.cleanQueues();
        gcs.cleanChoiceList(255);
      }

      }

    fork {

            emit Viol1COUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," Viol1C", true) }
            emit Viol2COUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," Viol2C", true) }
            emit AltoCOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," AltoC", true) }
            emit CelloCOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," CelloC", true) }
            emit Viol1EbOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," Viol1Eb", true) }
            emit Viol2EbOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," Viol2Eb", true) }
            emit AltoEbOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," AltoEb", true) }
            emit CelloEbOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," CelloEb", true) }
            emit Viol1GbOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," Viol1Gb", true) }
            emit Viol2GbOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," Viol2Gb", true) }
            emit AltoGbOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," AltoGb", true) }
            emit CelloGbOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," CelloGb", true) }
            emit Viol1AOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," Viol1A", true) }
            emit Viol2AOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," Viol2A", true) }
            emit AltoAOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," AltoA", true) }
            emit CelloAOUT([true,255]);
            host{gcs.informSelecteurOnMenuChange(255," CelloA", true) }
        await count(30, tick.now);

            emit Viol1COUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," Viol1C", false) }
            emit Viol2COUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," Viol2C", false) }
            emit AltoCOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," AltoC", false) }
            emit CelloCOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," CelloC", false) }
            emit Viol1EbOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," Viol1Eb", false) }
            emit Viol2EbOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," Viol2Eb", false) }
            emit AltoEbOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," AltoEb", false) }
            emit CelloEbOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," CelloEb", false) }
            emit Viol1GbOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," Viol1Gb", false) }
            emit Viol2GbOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," Viol2Gb", false) }
            emit AltoGbOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," AltoGb", false) }
            emit CelloGbOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," CelloGb", false) }
            emit Viol1AOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," Viol1A", false) }
            emit Viol2AOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," Viol2A", false) }
            emit AltoAOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," AltoA", false) }
            emit CelloAOUT([false,255]);
            host{gcs.informSelecteurOnMenuChange(255," CelloA", false) }
        yield;

    }

    par {

      fork {
        run ${ PianoEb} () {*};
      }

    }

    par {

      fork {
        run ${ PianoGb} () {*};
      }

    }

    par {

      fork {
        run ${ PianoA} () {*};
      }

    }

    par {

      fork {
        run ${ PianoC} () {*};
      }

    }

    par {

      abort{

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

      } when count(30, tick.now);

    }

    host{
      DAW.cleanQueues();
      gcs.cleanChoiceList(255);
    }

      {

      fork {

              emit AltoAOUT([true,255]);
              host{gcs.informSelecteurOnMenuChange(255," AltoA", true) }
              emit CelloAOUT([true,255]);
              host{gcs.informSelecteurOnMenuChange(255," CelloA", true) }
          await count(10, tick.now);

              emit AltoAOUT([false,255]);
              host{gcs.informSelecteurOnMenuChange(255," AltoA", false) }
              emit CelloAOUT([false,255]);
              host{gcs.informSelecteurOnMenuChange(255," CelloA", false) }
          yield;

      }

      par {

              emit AltoCOUT([true,255]);
              host{gcs.informSelecteurOnMenuChange(255," AltoC", true) }
              emit CelloCOUT([true,255]);
              host{gcs.informSelecteurOnMenuChange(255," CelloC", true) }
          await count(10, tick.now);

              emit AltoCOUT([false,255]);
              host{gcs.informSelecteurOnMenuChange(255," AltoC", false) }
              emit CelloCOUT([false,255]);
              host{gcs.informSelecteurOnMenuChange(255," CelloC", false) }
          yield;

      }

      host{
        DAW.cleanQueues();
        gcs.cleanChoiceList(255);
      }

      }

    host{
      serveur.broadcast(JSON.stringify({
            type: 'alertInfoScoreON',
            value:'Fin Etude Harmonie 4'
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
