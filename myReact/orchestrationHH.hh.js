var type0, StartTransSaxo, type1, T72, T56, T75, T40, T83, T18, type2, T6, T82, T39, T73, T3, T45, type3, T59, T42, T54, T16, T28, T62, type4, T25, T74, T1, T68, T53, T38, type5, T81, T14, T65, T29, T37, T4, type6, T41, T7, T43, T55, T17, T27, type7, tick, T89, T26, T15, T2, T44, T52, type8, T13, T71, T80, T61, T70, T94, type9, transposeClavier, type10, type11, type12, type13, type14, type15, T36, T76, T9, T22, T63, T11, T5, T20, T34, T67, T85, T92, T46, T64, T93, T49, T32, T24, T79, T84, T48, T77, T96, T86, T30, T8, T69, T57, T12, T51, T95, T35, T58, T87, T23, T60, T19, T47, T90, T33, T50, T78, T66, T88, T21, T10, T91, T31, TransSaxo;


// Les patterns de cette pièce sont organisés par types et sont dans des réservoirs.
// On a donc un contrôle sur la construction des phrases musicales.
// Le simulateur a des contraintes sur les timers : 3000 min et
// 3010 max avec 20 pulse max d'attente. Ceci permet de faire appel
// aux tanks en contrôlant/limitant les répétitions de patterns.
// Si le simulateur va trop vite, il peut rappeler un
// pattern avant qu'il ait été dévalidé sur le serveur,
// surtout quand le paramètre reactOnPlay est actif.
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


    const type0 = hiphop module () {
    in stopReservoir;
    in T72IN;
      in T56IN;
      in T75IN;
      in T40IN;
      in T83IN;
      in T18IN;
      out T72OUT;
      out T56OUT;
      out T75OUT;
      out T40OUT;
      out T83OUT;
      out T18OUT;

  	${ tank.makeReservoir(255, ["T72","T56","T75","T40","T83","T18"]) };
  }

    const type1 = hiphop module () {
    in stopReservoir;
    in T6IN;
      in T82IN;
      in T39IN;
      in T73IN;
      in T3IN;
      in T45IN;
      out T6OUT;
      out T82OUT;
      out T39OUT;
      out T73OUT;
      out T3OUT;
      out T45OUT;

  	${ tank.makeReservoir(255, ["T6","T82","T39","T73","T3","T45"]) };
  }

    const type2 = hiphop module () {
    in stopReservoir;
    in T59IN;
      in T42IN;
      in T54IN;
      in T16IN;
      in T28IN;
      in T62IN;
      out T59OUT;
      out T42OUT;
      out T54OUT;
      out T16OUT;
      out T28OUT;
      out T62OUT;

  	${ tank.makeReservoir(255, ["T59","T42","T54","T16","T28","T62"]) };
  }

    const type3 = hiphop module () {
    in stopReservoir;
    in T25IN;
      in T74IN;
      in T1IN;
      in T68IN;
      in T53IN;
      in T38IN;
      out T25OUT;
      out T74OUT;
      out T1OUT;
      out T68OUT;
      out T53OUT;
      out T38OUT;

  	${ tank.makeReservoir(255, ["T25","T74","T1","T68","T53","T38"]) };
  }

    const type4 = hiphop module () {
    in stopReservoir;
    in T81IN;
      in T14IN;
      in T65IN;
      in T29IN;
      in T37IN;
      in T4IN;
      out T81OUT;
      out T14OUT;
      out T65OUT;
      out T29OUT;
      out T37OUT;
      out T4OUT;

  	${ tank.makeReservoir(255, ["T81","T14","T65","T29","T37","T4"]) };
  }

    const type5 = hiphop module () {
    in stopReservoir;
    in T41IN;
      in T7IN;
      in T43IN;
      in T55IN;
      in T17IN;
      in T27IN;
      out T41OUT;
      out T7OUT;
      out T43OUT;
      out T55OUT;
      out T17OUT;
      out T27OUT;

  	${ tank.makeReservoir(255, ["T41","T7","T43","T55","T17","T27"]) };
  }

    const type6 = hiphop module () {
    in stopReservoir;
    in T89IN;
      in T26IN;
      in T15IN;
      in T2IN;
      in T44IN;
      in T52IN;
      out T89OUT;
      out T26OUT;
      out T15OUT;
      out T2OUT;
      out T44OUT;
      out T52OUT;

  	${ tank.makeReservoir(255, ["T89","T26","T15","T2","T44","T52"]) };
  }

    const type7 = hiphop module () {
    in stopReservoir;
    in T13IN;
      in T71IN;
      in T80IN;
      in T61IN;
      in T70IN;
      in T94IN;
      out T13OUT;
      out T71OUT;
      out T80OUT;
      out T61OUT;
      out T70OUT;
      out T94OUT;

  	${ tank.makeReservoir(255, ["T13","T71","T80","T61","T70","T94"]) };
  }

    const type8 = hiphop module () {
    in stopReservoir;
    in T36IN;
      in T76IN;
      in T9IN;
      in T22IN;
      in T63IN;
      in T11IN;
      out T36OUT;
      out T76OUT;
      out T9OUT;
      out T22OUT;
      out T63OUT;
      out T11OUT;

  	${ tank.makeReservoir(255, ["T36","T76","T9","T22","T63","T11"]) };
  }

    const type9 = hiphop module () {
    in stopReservoir;
    in T5IN;
      in T20IN;
      in T34IN;
      in T67IN;
      in T85IN;
      in T92IN;
      out T5OUT;
      out T20OUT;
      out T34OUT;
      out T67OUT;
      out T85OUT;
      out T92OUT;

  	${ tank.makeReservoir(255, ["T5","T20","T34","T67","T85","T92"]) };
  }

    const type10 = hiphop module () {
    in stopReservoir;
    in T46IN;
      in T64IN;
      in T93IN;
      in T49IN;
      in T32IN;
      in T24IN;
      out T46OUT;
      out T64OUT;
      out T93OUT;
      out T49OUT;
      out T32OUT;
      out T24OUT;

  	${ tank.makeReservoir(255, ["T46","T64","T93","T49","T32","T24"]) };
  }

    const type11 = hiphop module () {
    in stopReservoir;
    in T79IN;
      in T84IN;
      in T48IN;
      in T77IN;
      in T96IN;
      in T86IN;
      out T79OUT;
      out T84OUT;
      out T48OUT;
      out T77OUT;
      out T96OUT;
      out T86OUT;

  	${ tank.makeReservoir(255, ["T79","T84","T48","T77","T96","T86"]) };
  }

    const type12 = hiphop module () {
    in stopReservoir;
    in T30IN;
      in T8IN;
      in T69IN;
      in T57IN;
      in T12IN;
      in T51IN;
      out T30OUT;
      out T8OUT;
      out T69OUT;
      out T57OUT;
      out T12OUT;
      out T51OUT;

  	${ tank.makeReservoir(255, ["T30","T8","T69","T57","T12","T51"]) };
  }

    const type13 = hiphop module () {
    in stopReservoir;
    in T95IN;
      in T35IN;
      in T58IN;
      in T87IN;
      in T23IN;
      in T60IN;
      out T95OUT;
      out T35OUT;
      out T58OUT;
      out T87OUT;
      out T23OUT;
      out T60OUT;

  	${ tank.makeReservoir(255, ["T95","T35","T58","T87","T23","T60"]) };
  }

    const type14 = hiphop module () {
    in stopReservoir;
    in T19IN;
      in T47IN;
      in T90IN;
      in T33IN;
      in T50IN;
      in T78IN;
      out T19OUT;
      out T47OUT;
      out T90OUT;
      out T33OUT;
      out T50OUT;
      out T78OUT;

  	${ tank.makeReservoir(255, ["T19","T47","T90","T33","T50","T78"]) };
  }

    const type15 = hiphop module () {
    in stopReservoir;
    in T66IN;
      in T88IN;
      in T21IN;
      in T10IN;
      in T91IN;
      in T31IN;
      out T66OUT;
      out T88OUT;
      out T21OUT;
      out T10OUT;
      out T91OUT;
      out T31OUT;

  	${ tank.makeReservoir(255, ["T66","T88","T21","T10","T91","T31"]) };
  }
  // La transposition si fait dans Ableton Live. D'où les
  // ratios dans l'initialisation de la pièce pour cadrer
  // avec le paramètre MIDI des CC. (min -36, max +36).
  // 64 -> 0
  // 67 -> +2 ...
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

    const transposeClavier = hiphop module() {

      inout tick;


      loop{

        host{
          transposeValue = 0; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          //console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(12,tick.now);

        host{
          transposeValue = -2; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          //console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(12,tick.now);

        host{
          transposeValue = 2; // !! Ne devrait pas être une variable commune si on veut incrémenter.
          //console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
          oscMidiLocal.sendControlChange(param.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }

        await count(12,tick.now);

      }

    }


  const Program = hiphop module() {
    in start, halt, tick, DAWON, patternSignal, pulsation, midiSignal, emptyQueueSignal;
    inout stopReservoir, stopMoveTempo, stopSolo, stopTransposition;
    in ... ${ IZsignals };
    out ... ${ interTextOUT };
    in ... ${ interTextIN };


    inout StartTransSaxo;


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
            type: 'addSceneScore',
            value:1
          }));
    }
    yield;

    host{
      serveur.broadcast(JSON.stringify({
            type: 'alertInfoScoreON',
            value:'Wurfelspiel'
          }));
    }

      host {console.log('Wurfelspiel');}

      {

        host{
          serveur.broadcast(JSON.stringify({
            type: 'setListeDesTypes',
          }));
        }

      host{
        serveur.broadcast(JSON.stringify({
              type: 'listeDesTypes',
              text:'0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15'
            }));
      }

      }

      {

      host{setTempo(50, param);}

      host{gcs.setTimerDivision(1);}

      host{
        ratioTranspose = 1.763;
        offsetTranspose = 63.5;
        if(debug) console.log("hiphop block transpose Parameters:", ratioTranspose, offsetTranspose);
      }

      host{
        transposeValue = 0; // !! Ne devrait pas être une variable commune si on veut incrémenter.
        //console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
        oscMidiLocal.sendControlChange(param.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
      }

      }

    fork {

      host{
        DAW.pauseQueues();
      }

      await count(10,tick.now);

      host{DAW.resumeQueues();}

      run ${ transposeClavier} () {*};

    }

    par {

        signal inverseTempo;
        host {console.log("-- Start move tempo")}
        abort {
          loop{
            fork {
              every count( 8, tick.now) {
                emit inverseTempo();
              }
            }par{
              loop{
                abort{
                    every count(4, tick.now) {
                      host{
                      tempoGlobal += 2;
                      setTempo(tempoGlobal, param);
                    }
                  }
                } when (inverseTempo.now);
                abort {
                  every count(4, tick.now) {
                    host{
                      tempoGlobal -= 2;
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

    par {

      fork {
        run ${ type0} () {*};
      }
       par{
          run ${ type1} () {*};
        }
         par{
          run ${ type2} () {*};
        }
         par{
          run ${ type3} () {*};
        }
         par{
          run ${ type4} () {*};
        }
         par{
          run ${ type5} () {*};
        }
         par{
          run ${ type6} () {*};
        }
         par{
          run ${ type7} () {*};
        }
         par{
          run ${ type8} () {*};
        }
         par{
          run ${ type9} () {*};
        }
         par{
          run ${ type10} () {*};
        }
         par{
          run ${ type11} () {*};
        }
         par{
          run ${ type12} () {*};
        }
         par{
          run ${ type13} () {*};
        }
         par{
          run ${ type14} () {*};
        }
         par{
          run ${ type15} () {*};
        }

    }

    host{
      serveur.broadcast(JSON.stringify({
            type: 'alertInfoScoreOFF'
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
