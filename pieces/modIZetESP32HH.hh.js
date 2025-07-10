/**
 * @fileOverview Example of control with Interface Z sensors and ESP32 controler
 * Works with Ableton Orcheste16SkinIZ.als
 * The tempo in Ableton must be 80.
 * @copyright (C) 2025 Bertrand Petit-Hédelin
 * @author Bertrand Petit-Hédelin <bertrand@hedelin.fr>
 * @version 1.1
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

// Examples of initial values
let CCChannel = 1;
let CCTempo = 305;
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
 * Defines and creates the hiphop programm. This function is called by the Skini 
 * platform. 
 * @function
 * @param  {Object} parameters for the piece, 
 * set in the web interface with the "parameter" button.
 */
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

  const ESP32signals = ["ESP32_motion", "ESP32_shock", 
    "ESP32_touch", "ESP32_light", 
    "ESP32_gyro", "ESP32_sensor1", 
    "ESP32_accel", "ESP32_capa","ESP32_heartbeat"];

  console.log("inter:", interTextIN, interTextOUT, IZsignals, ESP32signals);

  /**
   * Module to process the distances given by the IZ sensors
   * @function
   * @param  {Object} Name to identify the sensor
   */
  hiphop module sensorIZ(name) {
    in sensorIZ, tick;
    //out zone1OUT, zone2OUT, zone3OUT, zone4OUT;
    out ... ${ interTextOUT };

      host{ console.log(" *-*-*-*-*-*-*- Sensor ", name, sensorIZ.nowval ); }
      
      if ( sensorIZ.nowval == undefined) {
        host{ console.log("Capteur sans valeur : ", sensorIZ.nowval); }
      }
      else if (sensorIZ.nowval[1] < 6000 && sensorIZ.nowval[1] > 3000) {
        emit zone1OUT([true, 0]);
      }
      else if (sensorIZ.nowval[1] < 2999 && sensorIZ.nowval[1] > 2000) {
        emit zone2OUT([true, 0]);
      }
      else if (sensorIZ.nowval[1] < 1999 && sensorIZ.nowval[1] > 1000) {
        emit zone3OUT([true, 0]);
      }
      else if (sensorIZ.nowval[1] < 999 && sensorIZ.nowval[1] > 500) {
        emit zone4OUT([true, 0]);
      } else {
        host{ console.log("Capteur sans valeur : ", sensorIZ.nowval); }
      }
      if(sensorIZ.nowval !== undefined) {
        host{ utilsSkini.alertInfoScoreON(name + ":" + sensorIZ.nowval[1], serveur); }
      }
      await  count (16,tick.now);
      run stopAll() { zone1OUT, zone2OUT, zone3OUT, 
        zone4OUT, zone6OUT, zone7OUT,
        zone8OUT, zone9OUT, zone10OUT};
      host {
        // Commande d'arrêt, note 301 de Skini et vidage des FIFO
        DAW.cleanQueues();
        oscMidiLocal.sendNoteOn(param.busMidiDAW, 3, 47, 100);
      }
  }

  /**
   * Module to unset all groups of clips
   * @function
   * @param
   */
  hiphop module stopAll() {
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

  /**
   * The main HH module with the Orchestration
   * @function
   * @param
   */
  const Program = hiphop module() {

    in start, halt, tick, DAWON, patternSignal, pulsation, midiSignal, emptyQueueSignal;
    in stopResevoir, stopMoveTempo;

    in ... ${ IZsignals };
    out ... ${ interTextOUT };
    in ... ${ interTextIN };
    in ... ${ ESP32signals };

    // start.now is activated by the "start" button of the web interface
    await(start.now);

    loop{
      await(tick.now);
      host{ utilsSkini.addSceneScore(1, serveur); }
      host{ 
        utilsSkini.alertInfoScoreON("Appuyer sur le bouton", serveur);
        console.log("Appuyer sur le bouton");
       }
      await(ESP32_touch.now);

      host{ utilsSkini.setTempo(80, param, oscMidiLocal, midimix,
        tempoMax, tempoMin, CCChannel, CCTempo); }

      abort(halt.now || ESP32_shock.now){
        // Pour l'affichage du temps dans le controleur
        fork {
          every(tick.now){
            host{
              gcs.setTickOnControler(i++);
            }
          }
        } par { // L'orchestration commence ici
          host{ utilsSkini.alertInfoScoreOFF(serveur); }
          fork {
            // Set groups zones 1, 2, 3, 4, according to the distance to the IZ sensor 0 
            every(INTERFACEZ_RC0.now) {
              host{ console.log("Reçu RC0"); }
              run sensorIZ("RC0") {
                      zone1OUT, zone2OUT, zone3OUT, zone4OUT, 
                      zone6OUT, zone7OUT, zone8OUT, zone9OUT, zone10OUT,
                      INTERFACEZ_RC0 as sensorIZ, tick as tick
              };
            }
          } par {
            Sensors123: {
              fork{
                every(INTERFACEZ_RC1.now) {
                  host{ console.log("Reçu RC1"); }
                  emit zone8OUT([true, 0]);
                  await  count (8,tick.now);
                  emit zone8OUT([false, 0]);
                }
              } par {
                every(INTERFACEZ_RC2.now) {
                  host{ console.log("Reçu RC2"); }
                  emit zone9OUT([true, 0]);
                  await  count (8,tick.now);
                  emit zone9OUT([false, 0]);
                }
              } par {
                every(INTERFACEZ_RC3.now) {
                  host{ console.log("Reçu RC3"); }
                  emit zone10OUT([true, 0]);
                  await  count (8,tick.now);
                  emit zone10OUT([false, 0]);
                }
              } par {
                every(INTERFACEZ_RC4.now) {
                  host{ console.log("Reçu RC4"); }
                  emit zone7OUT([true, 0]);
                  await  count (8,tick.now);
                  emit zone7OUT([false, 0]);
                }
              } par {
                await (ESP32_capa.now);
                break Sensors123;
              }
            }  
          } par {
            every(ESP32_touch.now) {
              host{ console.log("Reçu ESP32 touch"); }
              emit zone1OUT([false, 0]);
              emit zone2OUT([false, 0]);
              emit zone3OUT([false, 0]);
              emit zone4OUT([false, 0]);
              host { DAW.cleanQueue(1);}
              host { DAW.cleanQueue(2);}
              host { DAW.cleanQueue(3);}
              host { DAW.cleanQueue(4);}
              host{ utilsSkini.alertInfoScoreON("Arret zone 1,2,3 et 4", serveur); }
              await count (4, tick.now);
            }
          } par {
            every(ESP32_light.now) {
              host{ console.log("Reçu ESP32 light", ESP32_light.nowval ); }
              yield;
            }
          } par {
            // Le morceau de fin
            every(ESP32_capa.now) {
              host{ console.log("Reçu ESP32 capa", ESP32_capa.nowval ); }
              host{ utilsSkini.alertInfoScoreON("Pour la fin", serveur); }
              run stopAll() { zone1OUT, zone2OUT, zone3OUT, 
                              zone4OUT, zone6OUT, zone7OUT,
                              zone8OUT, zone9OUT, zone10OUT};
              //emit zone6OUT([true, 0]); // Morceau de fin par FIFO
              host { // vide les FIFO et Morceau de fin par MIDI
                DAW.cleanQueues();
                oscMidiLocal.sendNoteOn(param.busMidiDAW, 1, 101, 100);
              } 
            }
          }
        }
      }
      host{ console.log("Reçu Halt"); }
      
      run stopAll() { zone1OUT, zone2OUT, zone3OUT, 
                      zone4OUT, zone6OUT, zone7OUT,
                      zone8OUT, zone9OUT, zone10OUT};

      // Commande d'arrêt, note 300 de Skini et vidage des FIFO
      host {
        DAW.cleanQueues();
        oscMidiLocal.sendNoteOn(param.busMidiDAW, 3, 46, 100);
      }
    } // loop
  } // program

  // Creation of the HH machine.
  const prg = new ReactiveMachine(Program, "orchestration");
  return prg;
} // set signals

