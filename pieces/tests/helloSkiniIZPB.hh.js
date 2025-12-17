// @ts-nocheck
"use strict"
"use hopscript"

// Pose des problèmes sur les déclarations de signaux. !!! 23/04/2024

import { ReactiveMachine } from "@hop/hiphop";
import * as utilsSkini from "../serveur/utilsSkini.mjs";

//let par;
var midimix;
var oscMidiLocal;
var gcs;
var DAW;
var serveur;
var signals;

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
  if (debug1) console.log("hh_ORCHESTRATION: setServ");
  DAW = daw;
  serveur = ser;
  gcs = groupeCS;
  oscMidiLocal = oscMidi;
  midimix = mix;
}


function makeAwait(instruments, groupeClient) {
  return hiphop fork ${ instruments.map(val => hiphop {
     await (this[`${val}IN`].now);
     emit ${`${val}OUT`}([false, groupeClient]);
     host{ console.log("---------------------------- makeAwait", instruments, groupeClient)}
  })}
}

function makeReservoir(groupeClient, instrument, serv) {
  return hiphop ${
      hiphop {
        laTrappe: {
        abort immediate (stopReservoir.now) { // To kill  the tank
            host {
              console.log("--- MAKE RESERVOIR:",  instrument[0], ", groupeClient: ", groupeClient);
              var msg = {
                type: 'startTank',
                value:instrument[0]
              }
              serveur.broadcast(JSON.stringify(msg)); // Pour les gestions des tanks dans l'affichage de la partition "score"
            }
            ${instrument.map(val => hiphop {
              emit ${`${val}OUT`}([true, groupeClient])})
            }
            host { console.log("----------------- gcs = ", typeof gcs);}
            host { gcs.informSelecteurOnMenuChange(groupeClient, instrument[0], true);}
            ${makeAwait(instrument, groupeClient)}
            host { console.log("--- FIN NATURELLE RESERVOIR:", instrument[0]); }
            break  laTrappe;
        }

        ${instrument.map(val => hiphop {
          emit ${`${val}OUT`}([false, groupeClient])})
        }

        host { gcs.informSelecteurOnMenuChange(groupeClient, instrument[0], false); }
        host {
          console.log("--- ABORT RESERVOIR:", instrument[0]);
          var msg = {
            type: 'killTank',
            value:instrument[0]
          }
          serveur.broadcast(JSON.stringify(msg)); // Pour les gestions des tanks dans l'affichage de la partition "score"
        }
      }
    }
  }
}

const Instruments = ["sensor0","sensor1","sensor2","sensor3","sensor4"];

const reservoirSensor = hiphop module () { // Pourquoi faut-il avoir ces signaux en paramètres ??
  in tick, stopReservoir;
  in ... ${ Instruments.map(i => `${i}IN`) };
  out ... ${ Instruments.map(i => `${i}OUT`) };
  ${makeReservoir(1, Instruments, serveur)}
}

export function setSignals(param) {
  var i = 0;
  let interTextOUT = utilsSkini.creationInterfacesOUT(param.groupesDesSons);
  let interTextIN = utilsSkini.creationInterfacesIN(param.groupesDesSons);
  const IZsignals = ["INTERFACEZ_RC", "INTERFACEZ_RC0",
    "INTERFACEZ_RC1", "INTERFACEZ_RC2",
    "INTERFACEZ_RC3", "INTERFACEZ_RC4",
    "INTERFACEZ_RC5", "INTERFACEZ_RC6",
    "INTERFACEZ_RC7", "INTERFACEZ_RC8",
    "INTERFACEZ_RC9", "INTERFACEZ_RC10",
    "INTERFACEZ_RC11"];

  console.log("\n******* Je suis dans helloSkiniIZPB 2\n");
  console.log("inter:", interTextIN, interTextOUT, IZsignals);

  const Program = hiphop module() {
    in start, halt, tick, DAWON, patternSignal, pulsation, midiSignal, emptyQueueSignal;
    inout stopReservoir, stopMoveTempo;

    in ... ${IZsignals};
    out ... ${ interTextOUT };
    in ... ${ interTextIN };

    await(start.now);

    host{utilsSkini.addSceneScore(1, serveur);}
    host{utilsSkini.alertInfoScoreON("Skini HH", serveur);}

    emit sensor0OUT([true, 0]);
    await  count (5,tick.now);
    host{ DAW.putPatternInQueue("sensor0-1");}
    host{utilsSkini.alertInfoScoreON("Début", serveur);}

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
        host{ console.log(" *-*-*-*-*-*-*- Sensor RC0", INTERFACEZ_RC0.nowval ); }
        host{utilsSkini.alertInfoScoreON("Sensor RC0 : " + INTERFACEZ_RC0.nowval[1], serveur);}

        if( INTERFACEZ_RC0.nowval[1] < 4000 && INTERFACEZ_RC0.nowval[1] > 3000) {
          host{utilsSkini.alertInfoScoreON("Sensor RC0 : Zone 1", serveur);}
          emit sensor2IN();
          //host{ DAW.putPatternInQueue("sensorO-1");}
        }
        if( INTERFACEZ_RC0.nowval[1] < 2999 && INTERFACEZ_RC0.nowval[1] > 2000) {
          host{utilsSkini.alertInfoScoreON("Sensor RC0 : Zone 2", serveur);}
          emit sensor3IN();
          emit stopReservoir();
        }
        else if( INTERFACEZ_RC0.nowval[1] < 1999 && INTERFACEZ_RC0.nowval[1] > 1000) {
          host{utilsSkini.alertInfoScoreON("Sensor RC0 : Zone 3", serveur);}
        }
        else if( INTERFACEZ_RC0.nowval[1] < 999 && INTERFACEZ_RC0.nowval[1] > 500) {
          host{utilsSkini.alertInfoScoreON("Sensor RC0 : Zone 4", serveur);}
          emit sensor4IN();
        }
      }
    } par {
      yield;
      //run ${reservoirSensor}() {*}
    }
  }

  const prg = new ReactiveMachine(Program, "orchestration");
  return prg;
}

