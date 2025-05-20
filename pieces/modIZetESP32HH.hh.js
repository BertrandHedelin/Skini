/**
 * @fileOverview Example of control with Interface Z sensors
 * @copyright (C) 2024 Bertrand Petit-Hédelin
 * @author Bertrand Petit-Hédelin <bertrand@hedelin.fr>
 * @version 1.0
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

  var ESP32signals = ["ESP32_motion", "ESP32_shock", "ESP32_touch", "ESP32_light", "ESP32_gyro", "ESP32_sensor1", "ESP32_accel"];

  console.log("inter:", interTextIN, interTextOUT, IZsignals);

  hiphop module sensorIZ(name) {
    in sensorIZ, tick;
    out ... ${ interTextOUT };
    //in ... ${ ESP32signals }; // ça plante

    loop{

      host{ console.log(" *-*-*-*-*-*-*- Sensor RC", sensorIZ.nowval ); }
      //host{utilsSkini.alertInfoScoreON("Sensor RC0 : " + INTERFACEZ_RC0.nowval[1], serveur);}

      if (sensorIZ.nowval[1] < 4000 && sensorIZ.nowval[1] > 3000) {
        host{ utilsSkini.alertInfoScoreON(name + ": Zone 1", serveur); }
        emit zone1OUT([true, 0]);
      }
      else if (sensorIZ.nowval[1] < 2999 && sensorIZ.nowval[1] > 2000) {
        host{ utilsSkini.alertInfoScoreON(name + " : Zone 2", serveur); }
        emit zone2OUT([true, 0]);
      }
      else if (sensorIZ.nowval[1] < 1999 && sensorIZ.nowval[1] > 1000) {
        host{ utilsSkini.alertInfoScoreON(name + " : Zone 3", serveur); }
        emit zone3OUT([true, 0]);
      }
      else if (sensorIZ.nowval[1] < 999 && sensorIZ.nowval[1] > 500) {
        host{ utilsSkini.alertInfoScoreON(name + ": Zone 4", serveur); }
        emit zone4OUT([true, 0]);
      }
      else if (sensorIZ.nowval[1] < 499 && sensorIZ.nowval[1] > 0) {
        host{ utilsSkini.alertInfoScoreON(name + ": Zone 6", serveur); }
        emit zone6OUT([true, 0]);
      }
      await count(4, tick.now);
    }
  }

/* hiphop module stopAll() {
    out ... ${ interTextOUT };

    emit zone1OUT([false, 0]);
    emit zone2OUT([false, 0]);
    emit zone3OUT([false, 0]);
    emit zone4OUT([false, 0]);
    emit zone6OUT([false, 0]);
    emit zone7OUT([false, 0]);
    emit zone8OUT([false, 0]);
    emit zone9OUT([false, 0]);
    emit zone10OUT([false, 0]);
  }
 */
  const Program = hiphop module() {

    in start, halt, tick, DAWON, patternSignal, pulsation, midiSignal, emptyQueueSignal;
    in stopResevoir, stopMoveTempo;
    in ... ${ ESP32signals };
    in ... ${ IZsignals };
    out ... ${ interTextOUT };
    in ... ${ interTextIN };

    loop{
      await(tick.now);
      await(start.now);
      host{ utilsSkini.addSceneScore(1, serveur); }
      host{ utilsSkini.alertInfoScoreON("Skini HH", serveur); }

      abort(halt.now){
        fork {
          every(tick.now){
            host{
              //console.log("tick from HH", i++);
              gcs.setTickOnControler(i++);
            }
          }
           emit zone1OUT([false, 0]);
           host{ utilsSkini.alertInfoScoreOFF(serveur); }
        } par {
          run sensorIZ("zone1") { INTERFACEZ_RC1 as sensorIZ, tick as tick };
        } par {
          run sensorIZ("zone2") { INTERFACEZ_RC2 as sensorIZ, tick as tick };
        } par {
          run sensorIZ("zone3") { INTERFACEZ_RC3 as sensorIZ, tick as tick };
        } par {
          run sensorIZ("zone4") { INTERFACEZ_RC4 as sensorIZ, tick as tick };
        } par {
          run sensorIZ("zone6") { INTERFACEZ_RC5 as sensorIZ, tick as tick };
        } par {
          run sensorIZ("zone7") { INTERFACEZ_RC5 as sensorIZ, tick as tick };
        } par {
          run sensorIZ("zone8") { INTERFACEZ_RC5 as sensorIZ, tick as tick };
        } par {
          run sensorIZ("zone9") { INTERFACEZ_RC5 as sensorIZ, tick as tick };
        } par {
          run sensorIZ("zone10") { INTERFACEZ_RC5 as sensorIZ, tick as tick };
        }
      }
      host{ console.log("Reçu Halt"); }
      host{ utilsSkini.alertInfoScoreON("Stop Skini HH", serveur); }
    }
  }
  const prg = new ReactiveMachine(Program, "orchestration");
  return prg;
}

