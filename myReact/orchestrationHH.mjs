var Piano, StartTransSaxo, Saxo, Piano1Intro1, Piano1Intro2, Piano1Intro3, Piano1Intro4, Piano1Intro5, Piano1Intro6, Piano1Intro7, Piano1Milieu1, Piano1Milieu2, Piano1Milieu3, Piano1Milieu4, Piano1Milieu5, Piano1Milieu6, Piano1Milieu7, Piano1Fin1, Piano1Fin2, Piano1Fin3, Piano1Fin4, Piano1Fin5, Piano1Fin6, Piano1Fin7, Brass, SaxIntro1, SaxIntro2, SaxIntro3, SaxIntro4, SaxIntro5, SaxIntro6, SaxIntro7, SaxMilieu1, SaxMilieu2, SaxMilieu3, SaxMilieu4, SaxMilieu5, SaxMilieu6, SaxMilieu7, SaxFin1, SaxFin2, SaxFin3, SaxFin4, SaxFin5, SaxFin6, SaxFin7, Flute, BrassIntro1, BrassIntro2, BrassIntro3, BrassIntro4, BrassIntro5, BrassIntro6, BrassIntro7, BrassMilieu1, BrassMilieu2, BrassMilieu3, BrassMilieu4, BrassMilieu5, BrassMilieu6, BrassMilieu7, BrassFin1, BrassFin2, BrassFin3, BrassFin4, BrassFin5, BrassFin6, BrassFin7, Percu, FluteIntro1, FluteIntro2, FluteIntro3, FluteIntro4, FluteIntro5, FluteIntro6, FluteIntro7, FluteMilieu1, FluteMilieu2, FluteMilieu3, FluteMilieu4, FluteMilieu5, FluteMilieu6, FluteMilieu7, FluteFin1, FluteFin2, FluteFin3, FluteFin4, FluteFin5, FluteFin6, FluteFin7, TransPianoEtNappe, Percu1, Percu2, Percu3, Percu4, Percu5, Percu6, Percu7, tick, TransPianoEtNappe2, TransPianoEtNappe3, TransSaxo, nappeViolons, Flesh, Massive;


// Les patterns de cette pièce sont organisés par types et sont dans des réservoirs.
// On a donc un contrôle sur la construction des phrases musicales.
// Le simulateur a des contraintes sur les timers : 3000 min et
// 3010 max avec 20 pulse max d'attente. Ceci permet de faire appel
// aux tanks en contrôlant/limitant les répétitions de patterns.
// Si le simulateur va trop vite, il peut rappeler un
// pattern avant qu'il ait été dévalidé sur le serveur,
// surtout quand le paramètre reactOnPlay est actif.
// Il y a deux groupes 1 et 0. Il faut utiliser simulateurListe.
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// Pour cette pièce, il y a un groupe 0. Attention au simulateur.
//
//
//
//
//
//
//
//

"use strict";

import * as hh from "@hop/hiphop";
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
}

function setTempo(value){
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
    console.log("Set tempo blockly:", value, par.busMidiDAW, CCChannel, CCTempo, tempo, oscMidiLocal.getMidiPortClipToDAW() );
  }
  oscMidiLocal.sendControlChange(par.busMidiDAW, CCChannel, CCTempo, tempo);
}

var tempoValue = 0;
var tempoRythme = 0;
var tempoLimit = 0;
var tempoIncrease = true;
var transposeValue = 0;
var ratioTranspose = 1.763;
var offsetTranspose = 63.5;

function moveTempo(value, limit){
  if(tempoLimit >= limit){
    tempoLimit = 0;
    tempoIncrease = !tempoIncrease;
  }

  if(tempoIncrease){
    tempoGlobal += value;
  }else{
    tempoGlobal -= value;
  }
  if(debug) console.log("moveTempo:", tempoGlobal);
  setTempo(tempoGlobal);
  tempoLimit++;
}

// Création des signaux OUT de contrôle de la matrice des possibles
// Ici et immédiatement.
var signals = [];
var halt, start, emptyQueueSignal, patternSignal, stopReservoir, stopMoveTempo;
var tickCounter = 0;

export function setSignals(param) {
  par = param;

  for (var i=0; i < param.groupesDesSons.length; i++) {
    if(param.groupesDesSons[i][0] !== "") {
      var signame = param.groupesDesSons[i][0] + "OUT";

      if(debug) console.log("Signal Orchestration:", signame);

      var signal = hh.SIGNAL({
        "%location":{},
        "direction":"OUT",
        "name":signame,
        "init_func":function (){return [false, -1];}
      });
      signals.push(signal);
    }
  }

  // Création des signaux IN de sélection de patterns
  for (var i=0; i < param.groupesDesSons.length; i++) {
    if(param.groupesDesSons[i][0] !== "") {
      var signame = param.groupesDesSons[i][0] + "IN";

      if(debug) console.log("Signal Orchestration:", signame);

      var signal = hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":signame
      });
      signals.push(signal);
    }
  }


    // Module tank Piano + Piano1Intro1
    Piano = hh.MODULE({"id":"Piano","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Intro1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Intro2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Intro3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Intro4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Intro5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Intro6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Intro7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Milieu1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Milieu2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Milieu3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Milieu4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Milieu5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Milieu6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Milieu7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Fin1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Fin2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Fin3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Fin4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Fin5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Fin6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Fin7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Intro1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Intro2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Intro3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Intro4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Intro5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Intro6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Intro7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Milieu1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Milieu2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Milieu3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Milieu4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Milieu5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Milieu6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Milieu7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Fin1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Fin2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Fin3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Fin4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Fin5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Fin6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Fin7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":4, "block":"makeReservoir"},"direction":"IN", "name":"stopReservoir"}),
    hh.TRAP(
    {
      "EXIT":"EXIT",
      "%location":{},
      "%tag":"EXIT"
    },
      hh.ABORT({
        "%location":{"filename":"hiphop_blocks.js","pos":394},
        "%tag":"abort",
        "immediate":false,
        "apply":function (){return ((() => {
            const stopReservoir = this["stopReservoir"];
            return stopReservoir.now;
          })());
        }
      },
        hh.SIGACCESS({
           "signame":"stopReservoir",
           "pre":false,
           "val":false,
           "cnt":false
        }),
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":5, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                console.log("-- MAKE RESERVOIR:", "Piano1Intro1,Piano1Intro2,Piano1Intro3,Piano1Intro4,Piano1Intro5,Piano1Intro6,Piano1Intro7,Piano1Milieu1,Piano1Milieu2,Piano1Milieu3,Piano1Milieu4,Piano1Milieu5,Piano1Milieu6,Piano1Milieu7,Piano1Fin1,Piano1Fin2,Piano1Fin3,Piano1Fin4,Piano1Fin5,Piano1Fin6,Piano1Fin7" );
                var msg = {
                  type: 'startTank',
                  value:  "Piano1Intro1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Intro1OUT":"Piano1Intro1OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Intro1 = this["Piano1Intro1OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Intro1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Intro1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Intro1OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Intro1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Intro2OUT":"Piano1Intro2OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Intro2 = this["Piano1Intro2OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Intro2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Intro2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Intro2OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Intro2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Intro3OUT":"Piano1Intro3OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Intro3 = this["Piano1Intro3OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Intro3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Intro3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Intro3OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Intro3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Intro4OUT":"Piano1Intro4OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Intro4 = this["Piano1Intro4OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Intro4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Intro4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Intro4OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Intro4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Intro5OUT":"Piano1Intro5OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Intro5 = this["Piano1Intro5OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Intro5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Intro5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Intro5OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Intro5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Intro6OUT":"Piano1Intro6OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Intro6 = this["Piano1Intro6OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Intro6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Intro6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Intro6OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Intro6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Intro7OUT":"Piano1Intro7OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Intro7 = this["Piano1Intro7OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Intro7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Intro7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Intro7OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Intro7OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Milieu1OUT":"Piano1Milieu1OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Milieu1 = this["Piano1Milieu1OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Milieu1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Milieu1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Milieu1OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Milieu1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Milieu2OUT":"Piano1Milieu2OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Milieu2 = this["Piano1Milieu2OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Milieu2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Milieu2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Milieu2OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Milieu2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Milieu3OUT":"Piano1Milieu3OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Milieu3 = this["Piano1Milieu3OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Milieu3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Milieu3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Milieu3OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Milieu3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Milieu4OUT":"Piano1Milieu4OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Milieu4 = this["Piano1Milieu4OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Milieu4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Milieu4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Milieu4OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Milieu4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Milieu5OUT":"Piano1Milieu5OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Milieu5 = this["Piano1Milieu5OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Milieu5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Milieu5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Milieu5OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Milieu5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Milieu6OUT":"Piano1Milieu6OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Milieu6 = this["Piano1Milieu6OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Milieu6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Milieu6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Milieu6OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Milieu6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Milieu7OUT":"Piano1Milieu7OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Milieu7 = this["Piano1Milieu7OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Milieu7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Milieu7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Milieu7OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Milieu7OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Fin1OUT":"Piano1Fin1OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Fin1 = this["Piano1Fin1OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Fin1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Fin1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Fin1OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Fin1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Fin2OUT":"Piano1Fin2OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Fin2 = this["Piano1Fin2OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Fin2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Fin2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Fin2OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Fin2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Fin3OUT":"Piano1Fin3OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Fin3 = this["Piano1Fin3OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Fin3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Fin3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Fin3OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Fin3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Fin4OUT":"Piano1Fin4OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Fin4 = this["Piano1Fin4OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Fin4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Fin4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Fin4OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Fin4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Fin5OUT":"Piano1Fin5OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Fin5 = this["Piano1Fin5OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Fin5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Fin5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Fin5OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Fin5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Fin6OUT":"Piano1Fin6OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Fin6 = this["Piano1Fin6OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Fin6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Fin6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Fin6OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Fin6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Piano1Fin7OUT":"Piano1Fin7OUT",
                "apply":function (){
                  return ((() => {
                    const Piano1Fin7 = this["Piano1Fin7OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Piano1Fin7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Piano1Fin7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Piano1Fin7OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Fin7OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:Piano1Intro1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour Piano1Intro1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Intro1IN  =this["Piano1Intro1IN"];
                  return Piano1Intro1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Intro1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Intro1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Intro1OUT" : "Piano1Intro1OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Intro1OUT = this["Piano1Intro1OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Intro1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Intro1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Intro1OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Intro1OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Intro1
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Intro2
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Intro2IN  =this["Piano1Intro2IN"];
                  return Piano1Intro2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Intro2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Intro2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Intro2OUT" : "Piano1Intro2OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Intro2OUT = this["Piano1Intro2OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Intro2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Intro2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Intro2OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Intro2OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Intro2
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Intro3
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Intro3IN  =this["Piano1Intro3IN"];
                  return Piano1Intro3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Intro3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Intro3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Intro3OUT" : "Piano1Intro3OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Intro3OUT = this["Piano1Intro3OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Intro3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Intro3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Intro3OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Intro3OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Intro3
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Intro4
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Intro4IN  =this["Piano1Intro4IN"];
                  return Piano1Intro4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Intro4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Intro4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Intro4OUT" : "Piano1Intro4OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Intro4OUT = this["Piano1Intro4OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Intro4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Intro4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Intro4OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Intro4OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Intro4
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Intro5
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Intro5IN  =this["Piano1Intro5IN"];
                  return Piano1Intro5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Intro5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Intro5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Intro5OUT" : "Piano1Intro5OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Intro5OUT = this["Piano1Intro5OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Intro5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Intro5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Intro5OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Intro5OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Intro5
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Intro6
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Intro6IN  =this["Piano1Intro6IN"];
                  return Piano1Intro6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Intro6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Intro6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Intro6OUT" : "Piano1Intro6OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Intro6OUT = this["Piano1Intro6OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Intro6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Intro6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Intro6OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Intro6OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Intro6
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Intro7
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Intro7IN  =this["Piano1Intro7IN"];
                  return Piano1Intro7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Intro7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Intro7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Intro7OUT" : "Piano1Intro7OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Intro7OUT = this["Piano1Intro7OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Intro7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Intro7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Intro7OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Intro7OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Intro7
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Milieu1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Milieu1IN  =this["Piano1Milieu1IN"];
                  return Piano1Milieu1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Milieu1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Milieu1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Milieu1OUT" : "Piano1Milieu1OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Milieu1OUT = this["Piano1Milieu1OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Milieu1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Milieu1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Milieu1OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Milieu1OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Milieu1
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Milieu2
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Milieu2IN  =this["Piano1Milieu2IN"];
                  return Piano1Milieu2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Milieu2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Milieu2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Milieu2OUT" : "Piano1Milieu2OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Milieu2OUT = this["Piano1Milieu2OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Milieu2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Milieu2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Milieu2OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Milieu2OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Milieu2
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Milieu3
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Milieu3IN  =this["Piano1Milieu3IN"];
                  return Piano1Milieu3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Milieu3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Milieu3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Milieu3OUT" : "Piano1Milieu3OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Milieu3OUT = this["Piano1Milieu3OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Milieu3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Milieu3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Milieu3OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Milieu3OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Milieu3
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Milieu4
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Milieu4IN  =this["Piano1Milieu4IN"];
                  return Piano1Milieu4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Milieu4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Milieu4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Milieu4OUT" : "Piano1Milieu4OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Milieu4OUT = this["Piano1Milieu4OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Milieu4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Milieu4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Milieu4OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Milieu4OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Milieu4
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Milieu5
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Milieu5IN  =this["Piano1Milieu5IN"];
                  return Piano1Milieu5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Milieu5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Milieu5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Milieu5OUT" : "Piano1Milieu5OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Milieu5OUT = this["Piano1Milieu5OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Milieu5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Milieu5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Milieu5OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Milieu5OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Milieu5
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Milieu6
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Milieu6IN  =this["Piano1Milieu6IN"];
                  return Piano1Milieu6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Milieu6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Milieu6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Milieu6OUT" : "Piano1Milieu6OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Milieu6OUT = this["Piano1Milieu6OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Milieu6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Milieu6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Milieu6OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Milieu6OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Milieu6
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Milieu7
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Milieu7IN  =this["Piano1Milieu7IN"];
                  return Piano1Milieu7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Milieu7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Milieu7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Milieu7OUT" : "Piano1Milieu7OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Milieu7OUT = this["Piano1Milieu7OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Milieu7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Milieu7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Milieu7OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Milieu7OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Milieu7
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Fin1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Fin1IN  =this["Piano1Fin1IN"];
                  return Piano1Fin1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Fin1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Fin1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Fin1OUT" : "Piano1Fin1OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Fin1OUT = this["Piano1Fin1OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Fin1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Fin1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Fin1OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Fin1OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Fin1
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Fin2
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Fin2IN  =this["Piano1Fin2IN"];
                  return Piano1Fin2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Fin2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Fin2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Fin2OUT" : "Piano1Fin2OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Fin2OUT = this["Piano1Fin2OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Fin2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Fin2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Fin2OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Fin2OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Fin2
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Fin3
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Fin3IN  =this["Piano1Fin3IN"];
                  return Piano1Fin3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Fin3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Fin3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Fin3OUT" : "Piano1Fin3OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Fin3OUT = this["Piano1Fin3OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Fin3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Fin3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Fin3OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Fin3OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Fin3
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Fin4
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Fin4IN  =this["Piano1Fin4IN"];
                  return Piano1Fin4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Fin4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Fin4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Fin4OUT" : "Piano1Fin4OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Fin4OUT = this["Piano1Fin4OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Fin4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Fin4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Fin4OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Fin4OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Fin4
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Fin5
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Fin5IN  =this["Piano1Fin5IN"];
                  return Piano1Fin5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Fin5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Fin5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Fin5OUT" : "Piano1Fin5OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Fin5OUT = this["Piano1Fin5OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Fin5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Fin5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Fin5OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Fin5OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Fin5
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Fin6
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Fin6IN  =this["Piano1Fin6IN"];
                  return Piano1Fin6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Fin6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Fin6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Fin6OUT" : "Piano1Fin6OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Fin6OUT = this["Piano1Fin6OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Fin6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Fin6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Fin6OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Fin6OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Fin6
  ,
        hh.SEQUENCE( // Debut sequence pour Piano1Fin7
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Piano1Fin7IN  =this["Piano1Fin7IN"];
                  return Piano1Fin7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Piano1Fin7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Piano1Fin7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Piano1Fin7OUT" : "Piano1Fin7OUT",
              "apply":function (){
                return ((() => {
                  const Piano1Fin7OUT = this["Piano1Fin7OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Piano1Fin7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Piano1Fin7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Piano1Fin7OUT");
                gcs.informSelecteurOnMenuChange(0 , "Piano1Fin7OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Fin7
      ), // Fin fork de make await avec en premiere position:Piano1Intro1
      hh.EXIT(
        {
            "EXIT":"EXIT",
            "%location":{"filename":"hiphop_blocks.js","pos":8, "block":"makeReservoir"},
            "%tag":"break"
        })
      ) // Fin Abort
    ), // Fin Trap

    hh.PAUSE(
      {
        "%location":{"filename":"hiphop_blocks.js","pos":9, "block":"makeReservoir"},
        "%tag":"yield"
      }
    ),

    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Intro1OUT":"Piano1Intro1OUT",
          "apply":function (){
            return ((() => {
              const Piano1Intro1 = this["Piano1Intro1OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Intro1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Intro1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Intro2OUT":"Piano1Intro2OUT",
          "apply":function (){
            return ((() => {
              const Piano1Intro2 = this["Piano1Intro2OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Intro2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Intro2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Intro3OUT":"Piano1Intro3OUT",
          "apply":function (){
            return ((() => {
              const Piano1Intro3 = this["Piano1Intro3OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Intro3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Intro3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Intro4OUT":"Piano1Intro4OUT",
          "apply":function (){
            return ((() => {
              const Piano1Intro4 = this["Piano1Intro4OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Intro4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Intro4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Intro5OUT":"Piano1Intro5OUT",
          "apply":function (){
            return ((() => {
              const Piano1Intro5 = this["Piano1Intro5OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Intro5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Intro5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Intro6OUT":"Piano1Intro6OUT",
          "apply":function (){
            return ((() => {
              const Piano1Intro6 = this["Piano1Intro6OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Intro6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Intro6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Intro7OUT":"Piano1Intro7OUT",
          "apply":function (){
            return ((() => {
              const Piano1Intro7 = this["Piano1Intro7OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Intro7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Intro7OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Milieu1OUT":"Piano1Milieu1OUT",
          "apply":function (){
            return ((() => {
              const Piano1Milieu1 = this["Piano1Milieu1OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Milieu1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Milieu1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Milieu2OUT":"Piano1Milieu2OUT",
          "apply":function (){
            return ((() => {
              const Piano1Milieu2 = this["Piano1Milieu2OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Milieu2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Milieu2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Milieu3OUT":"Piano1Milieu3OUT",
          "apply":function (){
            return ((() => {
              const Piano1Milieu3 = this["Piano1Milieu3OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Milieu3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Milieu3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Milieu4OUT":"Piano1Milieu4OUT",
          "apply":function (){
            return ((() => {
              const Piano1Milieu4 = this["Piano1Milieu4OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Milieu4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Milieu4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Milieu5OUT":"Piano1Milieu5OUT",
          "apply":function (){
            return ((() => {
              const Piano1Milieu5 = this["Piano1Milieu5OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Milieu5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Milieu5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Milieu6OUT":"Piano1Milieu6OUT",
          "apply":function (){
            return ((() => {
              const Piano1Milieu6 = this["Piano1Milieu6OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Milieu6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Milieu6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Milieu7OUT":"Piano1Milieu7OUT",
          "apply":function (){
            return ((() => {
              const Piano1Milieu7 = this["Piano1Milieu7OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Milieu7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Milieu7OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Fin1OUT":"Piano1Fin1OUT",
          "apply":function (){
            return ((() => {
              const Piano1Fin1 = this["Piano1Fin1OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Fin1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Fin1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Fin2OUT":"Piano1Fin2OUT",
          "apply":function (){
            return ((() => {
              const Piano1Fin2 = this["Piano1Fin2OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Fin2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Fin2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Fin3OUT":"Piano1Fin3OUT",
          "apply":function (){
            return ((() => {
              const Piano1Fin3 = this["Piano1Fin3OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Fin3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Fin3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Fin4OUT":"Piano1Fin4OUT",
          "apply":function (){
            return ((() => {
              const Piano1Fin4 = this["Piano1Fin4OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Fin4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Fin4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Fin5OUT":"Piano1Fin5OUT",
          "apply":function (){
            return ((() => {
              const Piano1Fin5 = this["Piano1Fin5OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Fin5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Fin5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Fin6OUT":"Piano1Fin6OUT",
          "apply":function (){
            return ((() => {
              const Piano1Fin6 = this["Piano1Fin6OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Fin6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Fin6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Piano1Fin7OUT":"Piano1Fin7OUT",
          "apply":function (){
            return ((() => {
              const Piano1Fin7 = this["Piano1Fin7OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Fin7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Fin7OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(0 , "Piano1Intro1", false);
            console.log("--- FIN RESERVOIR:", "Piano1Intro1");
            var msg = {
            type: 'killTank',
            value:  "Piano1Intro1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank Saxo + SaxIntro1
    Saxo = hh.MODULE({"id":"Saxo","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxIntro1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxIntro2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxIntro3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxIntro4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxIntro5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxIntro6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxIntro7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxMilieu1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxMilieu2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxMilieu3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxMilieu4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxMilieu5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxMilieu6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxMilieu7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxFin1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxFin2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxFin3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxFin4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxFin5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxFin6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"SaxFin7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxIntro1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxIntro2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxIntro3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxIntro4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxIntro5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxIntro6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxIntro7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxMilieu1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxMilieu2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxMilieu3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxMilieu4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxMilieu5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxMilieu6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxMilieu7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxFin1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxFin2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxFin3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxFin4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxFin5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxFin6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"SaxFin7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":4, "block":"makeReservoir"},"direction":"IN", "name":"stopReservoir"}),
    hh.TRAP(
    {
      "EXIT":"EXIT",
      "%location":{},
      "%tag":"EXIT"
    },
      hh.ABORT({
        "%location":{"filename":"hiphop_blocks.js","pos":394},
        "%tag":"abort",
        "immediate":false,
        "apply":function (){return ((() => {
            const stopReservoir = this["stopReservoir"];
            return stopReservoir.now;
          })());
        }
      },
        hh.SIGACCESS({
           "signame":"stopReservoir",
           "pre":false,
           "val":false,
           "cnt":false
        }),
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":5, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                console.log("-- MAKE RESERVOIR:", "SaxIntro1,SaxIntro2,SaxIntro3,SaxIntro4,SaxIntro5,SaxIntro6,SaxIntro7,SaxMilieu1,SaxMilieu2,SaxMilieu3,SaxMilieu4,SaxMilieu5,SaxMilieu6,SaxMilieu7,SaxFin1,SaxFin2,SaxFin3,SaxFin4,SaxFin5,SaxFin6,SaxFin7" );
                var msg = {
                  type: 'startTank',
                  value:  "SaxIntro1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxIntro1OUT":"SaxIntro1OUT",
                "apply":function (){
                  return ((() => {
                    const SaxIntro1 = this["SaxIntro1OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxIntro1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxIntro1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxIntro1OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxIntro1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxIntro2OUT":"SaxIntro2OUT",
                "apply":function (){
                  return ((() => {
                    const SaxIntro2 = this["SaxIntro2OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxIntro2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxIntro2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxIntro2OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxIntro2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxIntro3OUT":"SaxIntro3OUT",
                "apply":function (){
                  return ((() => {
                    const SaxIntro3 = this["SaxIntro3OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxIntro3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxIntro3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxIntro3OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxIntro3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxIntro4OUT":"SaxIntro4OUT",
                "apply":function (){
                  return ((() => {
                    const SaxIntro4 = this["SaxIntro4OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxIntro4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxIntro4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxIntro4OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxIntro4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxIntro5OUT":"SaxIntro5OUT",
                "apply":function (){
                  return ((() => {
                    const SaxIntro5 = this["SaxIntro5OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxIntro5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxIntro5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxIntro5OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxIntro5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxIntro6OUT":"SaxIntro6OUT",
                "apply":function (){
                  return ((() => {
                    const SaxIntro6 = this["SaxIntro6OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxIntro6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxIntro6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxIntro6OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxIntro6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxIntro7OUT":"SaxIntro7OUT",
                "apply":function (){
                  return ((() => {
                    const SaxIntro7 = this["SaxIntro7OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxIntro7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxIntro7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxIntro7OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxIntro7OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxMilieu1OUT":"SaxMilieu1OUT",
                "apply":function (){
                  return ((() => {
                    const SaxMilieu1 = this["SaxMilieu1OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxMilieu1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxMilieu1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxMilieu1OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxMilieu1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxMilieu2OUT":"SaxMilieu2OUT",
                "apply":function (){
                  return ((() => {
                    const SaxMilieu2 = this["SaxMilieu2OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxMilieu2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxMilieu2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxMilieu2OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxMilieu2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxMilieu3OUT":"SaxMilieu3OUT",
                "apply":function (){
                  return ((() => {
                    const SaxMilieu3 = this["SaxMilieu3OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxMilieu3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxMilieu3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxMilieu3OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxMilieu3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxMilieu4OUT":"SaxMilieu4OUT",
                "apply":function (){
                  return ((() => {
                    const SaxMilieu4 = this["SaxMilieu4OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxMilieu4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxMilieu4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxMilieu4OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxMilieu4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxMilieu5OUT":"SaxMilieu5OUT",
                "apply":function (){
                  return ((() => {
                    const SaxMilieu5 = this["SaxMilieu5OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxMilieu5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxMilieu5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxMilieu5OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxMilieu5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxMilieu6OUT":"SaxMilieu6OUT",
                "apply":function (){
                  return ((() => {
                    const SaxMilieu6 = this["SaxMilieu6OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxMilieu6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxMilieu6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxMilieu6OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxMilieu6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxMilieu7OUT":"SaxMilieu7OUT",
                "apply":function (){
                  return ((() => {
                    const SaxMilieu7 = this["SaxMilieu7OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxMilieu7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxMilieu7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxMilieu7OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxMilieu7OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxFin1OUT":"SaxFin1OUT",
                "apply":function (){
                  return ((() => {
                    const SaxFin1 = this["SaxFin1OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxFin1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxFin1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxFin1OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxFin1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxFin2OUT":"SaxFin2OUT",
                "apply":function (){
                  return ((() => {
                    const SaxFin2 = this["SaxFin2OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxFin2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxFin2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxFin2OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxFin2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxFin3OUT":"SaxFin3OUT",
                "apply":function (){
                  return ((() => {
                    const SaxFin3 = this["SaxFin3OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxFin3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxFin3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxFin3OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxFin3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxFin4OUT":"SaxFin4OUT",
                "apply":function (){
                  return ((() => {
                    const SaxFin4 = this["SaxFin4OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxFin4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxFin4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxFin4OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxFin4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxFin5OUT":"SaxFin5OUT",
                "apply":function (){
                  return ((() => {
                    const SaxFin5 = this["SaxFin5OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxFin5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxFin5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxFin5OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxFin5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxFin6OUT":"SaxFin6OUT",
                "apply":function (){
                  return ((() => {
                    const SaxFin6 = this["SaxFin6OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxFin6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxFin6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxFin6OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxFin6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "SaxFin7OUT":"SaxFin7OUT",
                "apply":function (){
                  return ((() => {
                    const SaxFin7 = this["SaxFin7OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"SaxFin7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit SaxFin7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "SaxFin7OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxFin7OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:SaxIntro1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour SaxIntro1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxIntro1IN  =this["SaxIntro1IN"];
                  return SaxIntro1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxIntro1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxIntro1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxIntro1OUT" : "SaxIntro1OUT",
              "apply":function (){
                return ((() => {
                  const SaxIntro1OUT = this["SaxIntro1OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxIntro1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxIntro1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxIntro1OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxIntro1OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxIntro1
  ,
        hh.SEQUENCE( // Debut sequence pour SaxIntro2
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxIntro2IN  =this["SaxIntro2IN"];
                  return SaxIntro2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxIntro2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxIntro2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxIntro2OUT" : "SaxIntro2OUT",
              "apply":function (){
                return ((() => {
                  const SaxIntro2OUT = this["SaxIntro2OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxIntro2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxIntro2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxIntro2OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxIntro2OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxIntro2
  ,
        hh.SEQUENCE( // Debut sequence pour SaxIntro3
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxIntro3IN  =this["SaxIntro3IN"];
                  return SaxIntro3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxIntro3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxIntro3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxIntro3OUT" : "SaxIntro3OUT",
              "apply":function (){
                return ((() => {
                  const SaxIntro3OUT = this["SaxIntro3OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxIntro3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxIntro3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxIntro3OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxIntro3OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxIntro3
  ,
        hh.SEQUENCE( // Debut sequence pour SaxIntro4
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxIntro4IN  =this["SaxIntro4IN"];
                  return SaxIntro4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxIntro4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxIntro4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxIntro4OUT" : "SaxIntro4OUT",
              "apply":function (){
                return ((() => {
                  const SaxIntro4OUT = this["SaxIntro4OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxIntro4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxIntro4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxIntro4OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxIntro4OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxIntro4
  ,
        hh.SEQUENCE( // Debut sequence pour SaxIntro5
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxIntro5IN  =this["SaxIntro5IN"];
                  return SaxIntro5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxIntro5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxIntro5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxIntro5OUT" : "SaxIntro5OUT",
              "apply":function (){
                return ((() => {
                  const SaxIntro5OUT = this["SaxIntro5OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxIntro5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxIntro5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxIntro5OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxIntro5OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxIntro5
  ,
        hh.SEQUENCE( // Debut sequence pour SaxIntro6
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxIntro6IN  =this["SaxIntro6IN"];
                  return SaxIntro6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxIntro6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxIntro6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxIntro6OUT" : "SaxIntro6OUT",
              "apply":function (){
                return ((() => {
                  const SaxIntro6OUT = this["SaxIntro6OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxIntro6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxIntro6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxIntro6OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxIntro6OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxIntro6
  ,
        hh.SEQUENCE( // Debut sequence pour SaxIntro7
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxIntro7IN  =this["SaxIntro7IN"];
                  return SaxIntro7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxIntro7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxIntro7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxIntro7OUT" : "SaxIntro7OUT",
              "apply":function (){
                return ((() => {
                  const SaxIntro7OUT = this["SaxIntro7OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxIntro7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxIntro7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxIntro7OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxIntro7OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxIntro7
  ,
        hh.SEQUENCE( // Debut sequence pour SaxMilieu1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxMilieu1IN  =this["SaxMilieu1IN"];
                  return SaxMilieu1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxMilieu1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxMilieu1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxMilieu1OUT" : "SaxMilieu1OUT",
              "apply":function (){
                return ((() => {
                  const SaxMilieu1OUT = this["SaxMilieu1OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxMilieu1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxMilieu1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxMilieu1OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxMilieu1OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxMilieu1
  ,
        hh.SEQUENCE( // Debut sequence pour SaxMilieu2
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxMilieu2IN  =this["SaxMilieu2IN"];
                  return SaxMilieu2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxMilieu2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxMilieu2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxMilieu2OUT" : "SaxMilieu2OUT",
              "apply":function (){
                return ((() => {
                  const SaxMilieu2OUT = this["SaxMilieu2OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxMilieu2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxMilieu2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxMilieu2OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxMilieu2OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxMilieu2
  ,
        hh.SEQUENCE( // Debut sequence pour SaxMilieu3
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxMilieu3IN  =this["SaxMilieu3IN"];
                  return SaxMilieu3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxMilieu3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxMilieu3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxMilieu3OUT" : "SaxMilieu3OUT",
              "apply":function (){
                return ((() => {
                  const SaxMilieu3OUT = this["SaxMilieu3OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxMilieu3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxMilieu3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxMilieu3OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxMilieu3OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxMilieu3
  ,
        hh.SEQUENCE( // Debut sequence pour SaxMilieu4
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxMilieu4IN  =this["SaxMilieu4IN"];
                  return SaxMilieu4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxMilieu4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxMilieu4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxMilieu4OUT" : "SaxMilieu4OUT",
              "apply":function (){
                return ((() => {
                  const SaxMilieu4OUT = this["SaxMilieu4OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxMilieu4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxMilieu4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxMilieu4OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxMilieu4OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxMilieu4
  ,
        hh.SEQUENCE( // Debut sequence pour SaxMilieu5
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxMilieu5IN  =this["SaxMilieu5IN"];
                  return SaxMilieu5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxMilieu5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxMilieu5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxMilieu5OUT" : "SaxMilieu5OUT",
              "apply":function (){
                return ((() => {
                  const SaxMilieu5OUT = this["SaxMilieu5OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxMilieu5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxMilieu5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxMilieu5OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxMilieu5OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxMilieu5
  ,
        hh.SEQUENCE( // Debut sequence pour SaxMilieu6
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxMilieu6IN  =this["SaxMilieu6IN"];
                  return SaxMilieu6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxMilieu6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxMilieu6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxMilieu6OUT" : "SaxMilieu6OUT",
              "apply":function (){
                return ((() => {
                  const SaxMilieu6OUT = this["SaxMilieu6OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxMilieu6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxMilieu6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxMilieu6OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxMilieu6OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxMilieu6
  ,
        hh.SEQUENCE( // Debut sequence pour SaxMilieu7
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxMilieu7IN  =this["SaxMilieu7IN"];
                  return SaxMilieu7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxMilieu7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxMilieu7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxMilieu7OUT" : "SaxMilieu7OUT",
              "apply":function (){
                return ((() => {
                  const SaxMilieu7OUT = this["SaxMilieu7OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxMilieu7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxMilieu7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxMilieu7OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxMilieu7OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxMilieu7
  ,
        hh.SEQUENCE( // Debut sequence pour SaxFin1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxFin1IN  =this["SaxFin1IN"];
                  return SaxFin1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxFin1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxFin1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxFin1OUT" : "SaxFin1OUT",
              "apply":function (){
                return ((() => {
                  const SaxFin1OUT = this["SaxFin1OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxFin1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxFin1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxFin1OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxFin1OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxFin1
  ,
        hh.SEQUENCE( // Debut sequence pour SaxFin2
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxFin2IN  =this["SaxFin2IN"];
                  return SaxFin2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxFin2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxFin2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxFin2OUT" : "SaxFin2OUT",
              "apply":function (){
                return ((() => {
                  const SaxFin2OUT = this["SaxFin2OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxFin2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxFin2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxFin2OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxFin2OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxFin2
  ,
        hh.SEQUENCE( // Debut sequence pour SaxFin3
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxFin3IN  =this["SaxFin3IN"];
                  return SaxFin3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxFin3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxFin3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxFin3OUT" : "SaxFin3OUT",
              "apply":function (){
                return ((() => {
                  const SaxFin3OUT = this["SaxFin3OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxFin3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxFin3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxFin3OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxFin3OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxFin3
  ,
        hh.SEQUENCE( // Debut sequence pour SaxFin4
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxFin4IN  =this["SaxFin4IN"];
                  return SaxFin4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxFin4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxFin4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxFin4OUT" : "SaxFin4OUT",
              "apply":function (){
                return ((() => {
                  const SaxFin4OUT = this["SaxFin4OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxFin4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxFin4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxFin4OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxFin4OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxFin4
  ,
        hh.SEQUENCE( // Debut sequence pour SaxFin5
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxFin5IN  =this["SaxFin5IN"];
                  return SaxFin5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxFin5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxFin5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxFin5OUT" : "SaxFin5OUT",
              "apply":function (){
                return ((() => {
                  const SaxFin5OUT = this["SaxFin5OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxFin5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxFin5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxFin5OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxFin5OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxFin5
  ,
        hh.SEQUENCE( // Debut sequence pour SaxFin6
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxFin6IN  =this["SaxFin6IN"];
                  return SaxFin6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxFin6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxFin6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxFin6OUT" : "SaxFin6OUT",
              "apply":function (){
                return ((() => {
                  const SaxFin6OUT = this["SaxFin6OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxFin6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxFin6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxFin6OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxFin6OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxFin6
  ,
        hh.SEQUENCE( // Debut sequence pour SaxFin7
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const SaxFin7IN  =this["SaxFin7IN"];
                  return SaxFin7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"SaxFin7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await SaxFin7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "SaxFin7OUT" : "SaxFin7OUT",
              "apply":function (){
                return ((() => {
                  const SaxFin7OUT = this["SaxFin7OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"SaxFin7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit SaxFin7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "SaxFin7OUT");
                gcs.informSelecteurOnMenuChange(0 , "SaxFin7OUT", false);
              }
            }
          )
        ) // Fin sequence pour SaxFin7
      ), // Fin fork de make await avec en premiere position:SaxIntro1
      hh.EXIT(
        {
            "EXIT":"EXIT",
            "%location":{"filename":"hiphop_blocks.js","pos":8, "block":"makeReservoir"},
            "%tag":"break"
        })
      ) // Fin Abort
    ), // Fin Trap

    hh.PAUSE(
      {
        "%location":{"filename":"hiphop_blocks.js","pos":9, "block":"makeReservoir"},
        "%tag":"yield"
      }
    ),

    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxIntro1OUT":"SaxIntro1OUT",
          "apply":function (){
            return ((() => {
              const SaxIntro1 = this["SaxIntro1OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxIntro1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxIntro1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxIntro2OUT":"SaxIntro2OUT",
          "apply":function (){
            return ((() => {
              const SaxIntro2 = this["SaxIntro2OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxIntro2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxIntro2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxIntro3OUT":"SaxIntro3OUT",
          "apply":function (){
            return ((() => {
              const SaxIntro3 = this["SaxIntro3OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxIntro3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxIntro3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxIntro4OUT":"SaxIntro4OUT",
          "apply":function (){
            return ((() => {
              const SaxIntro4 = this["SaxIntro4OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxIntro4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxIntro4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxIntro5OUT":"SaxIntro5OUT",
          "apply":function (){
            return ((() => {
              const SaxIntro5 = this["SaxIntro5OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxIntro5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxIntro5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxIntro6OUT":"SaxIntro6OUT",
          "apply":function (){
            return ((() => {
              const SaxIntro6 = this["SaxIntro6OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxIntro6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxIntro6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxIntro7OUT":"SaxIntro7OUT",
          "apply":function (){
            return ((() => {
              const SaxIntro7 = this["SaxIntro7OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxIntro7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxIntro7OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxMilieu1OUT":"SaxMilieu1OUT",
          "apply":function (){
            return ((() => {
              const SaxMilieu1 = this["SaxMilieu1OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxMilieu1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxMilieu1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxMilieu2OUT":"SaxMilieu2OUT",
          "apply":function (){
            return ((() => {
              const SaxMilieu2 = this["SaxMilieu2OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxMilieu2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxMilieu2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxMilieu3OUT":"SaxMilieu3OUT",
          "apply":function (){
            return ((() => {
              const SaxMilieu3 = this["SaxMilieu3OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxMilieu3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxMilieu3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxMilieu4OUT":"SaxMilieu4OUT",
          "apply":function (){
            return ((() => {
              const SaxMilieu4 = this["SaxMilieu4OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxMilieu4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxMilieu4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxMilieu5OUT":"SaxMilieu5OUT",
          "apply":function (){
            return ((() => {
              const SaxMilieu5 = this["SaxMilieu5OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxMilieu5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxMilieu5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxMilieu6OUT":"SaxMilieu6OUT",
          "apply":function (){
            return ((() => {
              const SaxMilieu6 = this["SaxMilieu6OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxMilieu6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxMilieu6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxMilieu7OUT":"SaxMilieu7OUT",
          "apply":function (){
            return ((() => {
              const SaxMilieu7 = this["SaxMilieu7OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxMilieu7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxMilieu7OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxFin1OUT":"SaxFin1OUT",
          "apply":function (){
            return ((() => {
              const SaxFin1 = this["SaxFin1OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxFin1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxFin1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxFin2OUT":"SaxFin2OUT",
          "apply":function (){
            return ((() => {
              const SaxFin2 = this["SaxFin2OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxFin2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxFin2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxFin3OUT":"SaxFin3OUT",
          "apply":function (){
            return ((() => {
              const SaxFin3 = this["SaxFin3OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxFin3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxFin3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxFin4OUT":"SaxFin4OUT",
          "apply":function (){
            return ((() => {
              const SaxFin4 = this["SaxFin4OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxFin4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxFin4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxFin5OUT":"SaxFin5OUT",
          "apply":function (){
            return ((() => {
              const SaxFin5 = this["SaxFin5OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxFin5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxFin5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxFin6OUT":"SaxFin6OUT",
          "apply":function (){
            return ((() => {
              const SaxFin6 = this["SaxFin6OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxFin6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxFin6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "SaxFin7OUT":"SaxFin7OUT",
          "apply":function (){
            return ((() => {
              const SaxFin7 = this["SaxFin7OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"SaxFin7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit SaxFin7OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(0 , "SaxIntro1", false);
            console.log("--- FIN RESERVOIR:", "SaxIntro1");
            var msg = {
            type: 'killTank',
            value:  "SaxIntro1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank Brass + BrassIntro1
    Brass = hh.MODULE({"id":"Brass","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassIntro1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassIntro2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassIntro3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassIntro4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassIntro5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassIntro6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassIntro7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassMilieu1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassMilieu2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassMilieu3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassMilieu4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassMilieu5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassMilieu6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassMilieu7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassFin1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassFin2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassFin3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassFin4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassFin5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassFin6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BrassFin7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassIntro1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassIntro2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassIntro3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassIntro4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassIntro5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassIntro6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassIntro7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassMilieu1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassMilieu2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassMilieu3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassMilieu4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassMilieu5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassMilieu6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassMilieu7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassFin1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassFin2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassFin3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassFin4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassFin5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassFin6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BrassFin7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":4, "block":"makeReservoir"},"direction":"IN", "name":"stopReservoir"}),
    hh.TRAP(
    {
      "EXIT":"EXIT",
      "%location":{},
      "%tag":"EXIT"
    },
      hh.ABORT({
        "%location":{"filename":"hiphop_blocks.js","pos":394},
        "%tag":"abort",
        "immediate":false,
        "apply":function (){return ((() => {
            const stopReservoir = this["stopReservoir"];
            return stopReservoir.now;
          })());
        }
      },
        hh.SIGACCESS({
           "signame":"stopReservoir",
           "pre":false,
           "val":false,
           "cnt":false
        }),
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":5, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                console.log("-- MAKE RESERVOIR:", "BrassIntro1,BrassIntro2,BrassIntro3,BrassIntro4,BrassIntro5,BrassIntro6,BrassIntro7,BrassMilieu1,BrassMilieu2,BrassMilieu3,BrassMilieu4,BrassMilieu5,BrassMilieu6,BrassMilieu7,BrassFin1,BrassFin2,BrassFin3,BrassFin4,BrassFin5,BrassFin6,BrassFin7" );
                var msg = {
                  type: 'startTank',
                  value:  "BrassIntro1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassIntro1OUT":"BrassIntro1OUT",
                "apply":function (){
                  return ((() => {
                    const BrassIntro1 = this["BrassIntro1OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassIntro1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassIntro1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassIntro1OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassIntro1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassIntro2OUT":"BrassIntro2OUT",
                "apply":function (){
                  return ((() => {
                    const BrassIntro2 = this["BrassIntro2OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassIntro2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassIntro2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassIntro2OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassIntro2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassIntro3OUT":"BrassIntro3OUT",
                "apply":function (){
                  return ((() => {
                    const BrassIntro3 = this["BrassIntro3OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassIntro3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassIntro3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassIntro3OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassIntro3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassIntro4OUT":"BrassIntro4OUT",
                "apply":function (){
                  return ((() => {
                    const BrassIntro4 = this["BrassIntro4OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassIntro4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassIntro4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassIntro4OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassIntro4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassIntro5OUT":"BrassIntro5OUT",
                "apply":function (){
                  return ((() => {
                    const BrassIntro5 = this["BrassIntro5OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassIntro5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassIntro5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassIntro5OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassIntro5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassIntro6OUT":"BrassIntro6OUT",
                "apply":function (){
                  return ((() => {
                    const BrassIntro6 = this["BrassIntro6OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassIntro6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassIntro6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassIntro6OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassIntro6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassIntro7OUT":"BrassIntro7OUT",
                "apply":function (){
                  return ((() => {
                    const BrassIntro7 = this["BrassIntro7OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassIntro7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassIntro7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassIntro7OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassIntro7OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassMilieu1OUT":"BrassMilieu1OUT",
                "apply":function (){
                  return ((() => {
                    const BrassMilieu1 = this["BrassMilieu1OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassMilieu1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassMilieu1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassMilieu1OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassMilieu1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassMilieu2OUT":"BrassMilieu2OUT",
                "apply":function (){
                  return ((() => {
                    const BrassMilieu2 = this["BrassMilieu2OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassMilieu2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassMilieu2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassMilieu2OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassMilieu2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassMilieu3OUT":"BrassMilieu3OUT",
                "apply":function (){
                  return ((() => {
                    const BrassMilieu3 = this["BrassMilieu3OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassMilieu3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassMilieu3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassMilieu3OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassMilieu3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassMilieu4OUT":"BrassMilieu4OUT",
                "apply":function (){
                  return ((() => {
                    const BrassMilieu4 = this["BrassMilieu4OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassMilieu4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassMilieu4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassMilieu4OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassMilieu4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassMilieu5OUT":"BrassMilieu5OUT",
                "apply":function (){
                  return ((() => {
                    const BrassMilieu5 = this["BrassMilieu5OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassMilieu5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassMilieu5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassMilieu5OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassMilieu5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassMilieu6OUT":"BrassMilieu6OUT",
                "apply":function (){
                  return ((() => {
                    const BrassMilieu6 = this["BrassMilieu6OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassMilieu6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassMilieu6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassMilieu6OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassMilieu6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassMilieu7OUT":"BrassMilieu7OUT",
                "apply":function (){
                  return ((() => {
                    const BrassMilieu7 = this["BrassMilieu7OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassMilieu7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassMilieu7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassMilieu7OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassMilieu7OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassFin1OUT":"BrassFin1OUT",
                "apply":function (){
                  return ((() => {
                    const BrassFin1 = this["BrassFin1OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassFin1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassFin1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassFin1OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassFin1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassFin2OUT":"BrassFin2OUT",
                "apply":function (){
                  return ((() => {
                    const BrassFin2 = this["BrassFin2OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassFin2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassFin2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassFin2OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassFin2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassFin3OUT":"BrassFin3OUT",
                "apply":function (){
                  return ((() => {
                    const BrassFin3 = this["BrassFin3OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassFin3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassFin3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassFin3OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassFin3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassFin4OUT":"BrassFin4OUT",
                "apply":function (){
                  return ((() => {
                    const BrassFin4 = this["BrassFin4OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassFin4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassFin4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassFin4OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassFin4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassFin5OUT":"BrassFin5OUT",
                "apply":function (){
                  return ((() => {
                    const BrassFin5 = this["BrassFin5OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassFin5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassFin5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassFin5OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassFin5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassFin6OUT":"BrassFin6OUT",
                "apply":function (){
                  return ((() => {
                    const BrassFin6 = this["BrassFin6OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassFin6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassFin6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassFin6OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassFin6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BrassFin7OUT":"BrassFin7OUT",
                "apply":function (){
                  return ((() => {
                    const BrassFin7 = this["BrassFin7OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BrassFin7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BrassFin7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BrassFin7OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassFin7OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:BrassIntro1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour BrassIntro1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassIntro1IN  =this["BrassIntro1IN"];
                  return BrassIntro1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassIntro1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassIntro1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassIntro1OUT" : "BrassIntro1OUT",
              "apply":function (){
                return ((() => {
                  const BrassIntro1OUT = this["BrassIntro1OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassIntro1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassIntro1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassIntro1OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassIntro1OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassIntro1
  ,
        hh.SEQUENCE( // Debut sequence pour BrassIntro2
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassIntro2IN  =this["BrassIntro2IN"];
                  return BrassIntro2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassIntro2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassIntro2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassIntro2OUT" : "BrassIntro2OUT",
              "apply":function (){
                return ((() => {
                  const BrassIntro2OUT = this["BrassIntro2OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassIntro2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassIntro2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassIntro2OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassIntro2OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassIntro2
  ,
        hh.SEQUENCE( // Debut sequence pour BrassIntro3
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassIntro3IN  =this["BrassIntro3IN"];
                  return BrassIntro3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassIntro3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassIntro3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassIntro3OUT" : "BrassIntro3OUT",
              "apply":function (){
                return ((() => {
                  const BrassIntro3OUT = this["BrassIntro3OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassIntro3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassIntro3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassIntro3OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassIntro3OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassIntro3
  ,
        hh.SEQUENCE( // Debut sequence pour BrassIntro4
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassIntro4IN  =this["BrassIntro4IN"];
                  return BrassIntro4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassIntro4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassIntro4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassIntro4OUT" : "BrassIntro4OUT",
              "apply":function (){
                return ((() => {
                  const BrassIntro4OUT = this["BrassIntro4OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassIntro4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassIntro4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassIntro4OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassIntro4OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassIntro4
  ,
        hh.SEQUENCE( // Debut sequence pour BrassIntro5
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassIntro5IN  =this["BrassIntro5IN"];
                  return BrassIntro5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassIntro5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassIntro5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassIntro5OUT" : "BrassIntro5OUT",
              "apply":function (){
                return ((() => {
                  const BrassIntro5OUT = this["BrassIntro5OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassIntro5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassIntro5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassIntro5OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassIntro5OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassIntro5
  ,
        hh.SEQUENCE( // Debut sequence pour BrassIntro6
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassIntro6IN  =this["BrassIntro6IN"];
                  return BrassIntro6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassIntro6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassIntro6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassIntro6OUT" : "BrassIntro6OUT",
              "apply":function (){
                return ((() => {
                  const BrassIntro6OUT = this["BrassIntro6OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassIntro6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassIntro6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassIntro6OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassIntro6OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassIntro6
  ,
        hh.SEQUENCE( // Debut sequence pour BrassIntro7
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassIntro7IN  =this["BrassIntro7IN"];
                  return BrassIntro7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassIntro7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassIntro7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassIntro7OUT" : "BrassIntro7OUT",
              "apply":function (){
                return ((() => {
                  const BrassIntro7OUT = this["BrassIntro7OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassIntro7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassIntro7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassIntro7OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassIntro7OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassIntro7
  ,
        hh.SEQUENCE( // Debut sequence pour BrassMilieu1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassMilieu1IN  =this["BrassMilieu1IN"];
                  return BrassMilieu1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassMilieu1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassMilieu1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassMilieu1OUT" : "BrassMilieu1OUT",
              "apply":function (){
                return ((() => {
                  const BrassMilieu1OUT = this["BrassMilieu1OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassMilieu1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassMilieu1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassMilieu1OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassMilieu1OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassMilieu1
  ,
        hh.SEQUENCE( // Debut sequence pour BrassMilieu2
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassMilieu2IN  =this["BrassMilieu2IN"];
                  return BrassMilieu2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassMilieu2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassMilieu2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassMilieu2OUT" : "BrassMilieu2OUT",
              "apply":function (){
                return ((() => {
                  const BrassMilieu2OUT = this["BrassMilieu2OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassMilieu2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassMilieu2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassMilieu2OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassMilieu2OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassMilieu2
  ,
        hh.SEQUENCE( // Debut sequence pour BrassMilieu3
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassMilieu3IN  =this["BrassMilieu3IN"];
                  return BrassMilieu3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassMilieu3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassMilieu3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassMilieu3OUT" : "BrassMilieu3OUT",
              "apply":function (){
                return ((() => {
                  const BrassMilieu3OUT = this["BrassMilieu3OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassMilieu3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassMilieu3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassMilieu3OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassMilieu3OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassMilieu3
  ,
        hh.SEQUENCE( // Debut sequence pour BrassMilieu4
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassMilieu4IN  =this["BrassMilieu4IN"];
                  return BrassMilieu4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassMilieu4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassMilieu4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassMilieu4OUT" : "BrassMilieu4OUT",
              "apply":function (){
                return ((() => {
                  const BrassMilieu4OUT = this["BrassMilieu4OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassMilieu4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassMilieu4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassMilieu4OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassMilieu4OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassMilieu4
  ,
        hh.SEQUENCE( // Debut sequence pour BrassMilieu5
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassMilieu5IN  =this["BrassMilieu5IN"];
                  return BrassMilieu5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassMilieu5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassMilieu5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassMilieu5OUT" : "BrassMilieu5OUT",
              "apply":function (){
                return ((() => {
                  const BrassMilieu5OUT = this["BrassMilieu5OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassMilieu5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassMilieu5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassMilieu5OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassMilieu5OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassMilieu5
  ,
        hh.SEQUENCE( // Debut sequence pour BrassMilieu6
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassMilieu6IN  =this["BrassMilieu6IN"];
                  return BrassMilieu6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassMilieu6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassMilieu6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassMilieu6OUT" : "BrassMilieu6OUT",
              "apply":function (){
                return ((() => {
                  const BrassMilieu6OUT = this["BrassMilieu6OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassMilieu6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassMilieu6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassMilieu6OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassMilieu6OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassMilieu6
  ,
        hh.SEQUENCE( // Debut sequence pour BrassMilieu7
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassMilieu7IN  =this["BrassMilieu7IN"];
                  return BrassMilieu7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassMilieu7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassMilieu7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassMilieu7OUT" : "BrassMilieu7OUT",
              "apply":function (){
                return ((() => {
                  const BrassMilieu7OUT = this["BrassMilieu7OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassMilieu7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassMilieu7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassMilieu7OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassMilieu7OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassMilieu7
  ,
        hh.SEQUENCE( // Debut sequence pour BrassFin1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassFin1IN  =this["BrassFin1IN"];
                  return BrassFin1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassFin1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassFin1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassFin1OUT" : "BrassFin1OUT",
              "apply":function (){
                return ((() => {
                  const BrassFin1OUT = this["BrassFin1OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassFin1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassFin1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassFin1OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassFin1OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassFin1
  ,
        hh.SEQUENCE( // Debut sequence pour BrassFin2
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassFin2IN  =this["BrassFin2IN"];
                  return BrassFin2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassFin2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassFin2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassFin2OUT" : "BrassFin2OUT",
              "apply":function (){
                return ((() => {
                  const BrassFin2OUT = this["BrassFin2OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassFin2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassFin2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassFin2OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassFin2OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassFin2
  ,
        hh.SEQUENCE( // Debut sequence pour BrassFin3
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassFin3IN  =this["BrassFin3IN"];
                  return BrassFin3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassFin3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassFin3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassFin3OUT" : "BrassFin3OUT",
              "apply":function (){
                return ((() => {
                  const BrassFin3OUT = this["BrassFin3OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassFin3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassFin3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassFin3OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassFin3OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassFin3
  ,
        hh.SEQUENCE( // Debut sequence pour BrassFin4
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassFin4IN  =this["BrassFin4IN"];
                  return BrassFin4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassFin4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassFin4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassFin4OUT" : "BrassFin4OUT",
              "apply":function (){
                return ((() => {
                  const BrassFin4OUT = this["BrassFin4OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassFin4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassFin4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassFin4OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassFin4OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassFin4
  ,
        hh.SEQUENCE( // Debut sequence pour BrassFin5
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassFin5IN  =this["BrassFin5IN"];
                  return BrassFin5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassFin5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassFin5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassFin5OUT" : "BrassFin5OUT",
              "apply":function (){
                return ((() => {
                  const BrassFin5OUT = this["BrassFin5OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassFin5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassFin5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassFin5OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassFin5OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassFin5
  ,
        hh.SEQUENCE( // Debut sequence pour BrassFin6
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassFin6IN  =this["BrassFin6IN"];
                  return BrassFin6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassFin6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassFin6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassFin6OUT" : "BrassFin6OUT",
              "apply":function (){
                return ((() => {
                  const BrassFin6OUT = this["BrassFin6OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassFin6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassFin6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassFin6OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassFin6OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassFin6
  ,
        hh.SEQUENCE( // Debut sequence pour BrassFin7
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const BrassFin7IN  =this["BrassFin7IN"];
                  return BrassFin7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BrassFin7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BrassFin7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BrassFin7OUT" : "BrassFin7OUT",
              "apply":function (){
                return ((() => {
                  const BrassFin7OUT = this["BrassFin7OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BrassFin7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BrassFin7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BrassFin7OUT");
                gcs.informSelecteurOnMenuChange(0 , "BrassFin7OUT", false);
              }
            }
          )
        ) // Fin sequence pour BrassFin7
      ), // Fin fork de make await avec en premiere position:BrassIntro1
      hh.EXIT(
        {
            "EXIT":"EXIT",
            "%location":{"filename":"hiphop_blocks.js","pos":8, "block":"makeReservoir"},
            "%tag":"break"
        })
      ) // Fin Abort
    ), // Fin Trap

    hh.PAUSE(
      {
        "%location":{"filename":"hiphop_blocks.js","pos":9, "block":"makeReservoir"},
        "%tag":"yield"
      }
    ),

    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassIntro1OUT":"BrassIntro1OUT",
          "apply":function (){
            return ((() => {
              const BrassIntro1 = this["BrassIntro1OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassIntro1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassIntro1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassIntro2OUT":"BrassIntro2OUT",
          "apply":function (){
            return ((() => {
              const BrassIntro2 = this["BrassIntro2OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassIntro2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassIntro2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassIntro3OUT":"BrassIntro3OUT",
          "apply":function (){
            return ((() => {
              const BrassIntro3 = this["BrassIntro3OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassIntro3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassIntro3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassIntro4OUT":"BrassIntro4OUT",
          "apply":function (){
            return ((() => {
              const BrassIntro4 = this["BrassIntro4OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassIntro4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassIntro4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassIntro5OUT":"BrassIntro5OUT",
          "apply":function (){
            return ((() => {
              const BrassIntro5 = this["BrassIntro5OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassIntro5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassIntro5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassIntro6OUT":"BrassIntro6OUT",
          "apply":function (){
            return ((() => {
              const BrassIntro6 = this["BrassIntro6OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassIntro6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassIntro6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassIntro7OUT":"BrassIntro7OUT",
          "apply":function (){
            return ((() => {
              const BrassIntro7 = this["BrassIntro7OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassIntro7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassIntro7OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassMilieu1OUT":"BrassMilieu1OUT",
          "apply":function (){
            return ((() => {
              const BrassMilieu1 = this["BrassMilieu1OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassMilieu1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassMilieu1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassMilieu2OUT":"BrassMilieu2OUT",
          "apply":function (){
            return ((() => {
              const BrassMilieu2 = this["BrassMilieu2OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassMilieu2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassMilieu2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassMilieu3OUT":"BrassMilieu3OUT",
          "apply":function (){
            return ((() => {
              const BrassMilieu3 = this["BrassMilieu3OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassMilieu3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassMilieu3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassMilieu4OUT":"BrassMilieu4OUT",
          "apply":function (){
            return ((() => {
              const BrassMilieu4 = this["BrassMilieu4OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassMilieu4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassMilieu4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassMilieu5OUT":"BrassMilieu5OUT",
          "apply":function (){
            return ((() => {
              const BrassMilieu5 = this["BrassMilieu5OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassMilieu5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassMilieu5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassMilieu6OUT":"BrassMilieu6OUT",
          "apply":function (){
            return ((() => {
              const BrassMilieu6 = this["BrassMilieu6OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassMilieu6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassMilieu6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassMilieu7OUT":"BrassMilieu7OUT",
          "apply":function (){
            return ((() => {
              const BrassMilieu7 = this["BrassMilieu7OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassMilieu7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassMilieu7OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassFin1OUT":"BrassFin1OUT",
          "apply":function (){
            return ((() => {
              const BrassFin1 = this["BrassFin1OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassFin1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassFin1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassFin2OUT":"BrassFin2OUT",
          "apply":function (){
            return ((() => {
              const BrassFin2 = this["BrassFin2OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassFin2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassFin2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassFin3OUT":"BrassFin3OUT",
          "apply":function (){
            return ((() => {
              const BrassFin3 = this["BrassFin3OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassFin3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassFin3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassFin4OUT":"BrassFin4OUT",
          "apply":function (){
            return ((() => {
              const BrassFin4 = this["BrassFin4OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassFin4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassFin4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassFin5OUT":"BrassFin5OUT",
          "apply":function (){
            return ((() => {
              const BrassFin5 = this["BrassFin5OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassFin5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassFin5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassFin6OUT":"BrassFin6OUT",
          "apply":function (){
            return ((() => {
              const BrassFin6 = this["BrassFin6OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassFin6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassFin6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BrassFin7OUT":"BrassFin7OUT",
          "apply":function (){
            return ((() => {
              const BrassFin7 = this["BrassFin7OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BrassFin7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BrassFin7OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(0 , "BrassIntro1", false);
            console.log("--- FIN RESERVOIR:", "BrassIntro1");
            var msg = {
            type: 'killTank',
            value:  "BrassIntro1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank Flute + FluteIntro1
    Flute = hh.MODULE({"id":"Flute","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteIntro1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteIntro2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteIntro3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteIntro4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteIntro5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteIntro6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteIntro7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteMilieu1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteMilieu2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteMilieu3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteMilieu4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteMilieu5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteMilieu6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteMilieu7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFin1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFin2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFin3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFin4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFin5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFin6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFin7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteIntro1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteIntro2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteIntro3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteIntro4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteIntro5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteIntro6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteIntro7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteMilieu1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteMilieu2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteMilieu3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteMilieu4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteMilieu5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteMilieu6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteMilieu7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFin1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFin2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFin3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFin4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFin5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFin6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFin7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":4, "block":"makeReservoir"},"direction":"IN", "name":"stopReservoir"}),
    hh.TRAP(
    {
      "EXIT":"EXIT",
      "%location":{},
      "%tag":"EXIT"
    },
      hh.ABORT({
        "%location":{"filename":"hiphop_blocks.js","pos":394},
        "%tag":"abort",
        "immediate":false,
        "apply":function (){return ((() => {
            const stopReservoir = this["stopReservoir"];
            return stopReservoir.now;
          })());
        }
      },
        hh.SIGACCESS({
           "signame":"stopReservoir",
           "pre":false,
           "val":false,
           "cnt":false
        }),
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":5, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                console.log("-- MAKE RESERVOIR:", "FluteIntro1,FluteIntro2,FluteIntro3,FluteIntro4,FluteIntro5,FluteIntro6,FluteIntro7,FluteMilieu1,FluteMilieu2,FluteMilieu3,FluteMilieu4,FluteMilieu5,FluteMilieu6,FluteMilieu7,FluteFin1,FluteFin2,FluteFin3,FluteFin4,FluteFin5,FluteFin6,FluteFin7" );
                var msg = {
                  type: 'startTank',
                  value:  "FluteIntro1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteIntro1OUT":"FluteIntro1OUT",
                "apply":function (){
                  return ((() => {
                    const FluteIntro1 = this["FluteIntro1OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteIntro1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteIntro1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteIntro1OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteIntro1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteIntro2OUT":"FluteIntro2OUT",
                "apply":function (){
                  return ((() => {
                    const FluteIntro2 = this["FluteIntro2OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteIntro2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteIntro2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteIntro2OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteIntro2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteIntro3OUT":"FluteIntro3OUT",
                "apply":function (){
                  return ((() => {
                    const FluteIntro3 = this["FluteIntro3OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteIntro3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteIntro3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteIntro3OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteIntro3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteIntro4OUT":"FluteIntro4OUT",
                "apply":function (){
                  return ((() => {
                    const FluteIntro4 = this["FluteIntro4OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteIntro4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteIntro4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteIntro4OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteIntro4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteIntro5OUT":"FluteIntro5OUT",
                "apply":function (){
                  return ((() => {
                    const FluteIntro5 = this["FluteIntro5OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteIntro5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteIntro5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteIntro5OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteIntro5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteIntro6OUT":"FluteIntro6OUT",
                "apply":function (){
                  return ((() => {
                    const FluteIntro6 = this["FluteIntro6OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteIntro6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteIntro6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteIntro6OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteIntro6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteIntro7OUT":"FluteIntro7OUT",
                "apply":function (){
                  return ((() => {
                    const FluteIntro7 = this["FluteIntro7OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteIntro7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteIntro7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteIntro7OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteIntro7OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteMilieu1OUT":"FluteMilieu1OUT",
                "apply":function (){
                  return ((() => {
                    const FluteMilieu1 = this["FluteMilieu1OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteMilieu1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteMilieu1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteMilieu1OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteMilieu1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteMilieu2OUT":"FluteMilieu2OUT",
                "apply":function (){
                  return ((() => {
                    const FluteMilieu2 = this["FluteMilieu2OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteMilieu2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteMilieu2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteMilieu2OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteMilieu2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteMilieu3OUT":"FluteMilieu3OUT",
                "apply":function (){
                  return ((() => {
                    const FluteMilieu3 = this["FluteMilieu3OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteMilieu3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteMilieu3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteMilieu3OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteMilieu3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteMilieu4OUT":"FluteMilieu4OUT",
                "apply":function (){
                  return ((() => {
                    const FluteMilieu4 = this["FluteMilieu4OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteMilieu4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteMilieu4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteMilieu4OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteMilieu4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteMilieu5OUT":"FluteMilieu5OUT",
                "apply":function (){
                  return ((() => {
                    const FluteMilieu5 = this["FluteMilieu5OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteMilieu5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteMilieu5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteMilieu5OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteMilieu5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteMilieu6OUT":"FluteMilieu6OUT",
                "apply":function (){
                  return ((() => {
                    const FluteMilieu6 = this["FluteMilieu6OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteMilieu6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteMilieu6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteMilieu6OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteMilieu6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteMilieu7OUT":"FluteMilieu7OUT",
                "apply":function (){
                  return ((() => {
                    const FluteMilieu7 = this["FluteMilieu7OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteMilieu7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteMilieu7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteMilieu7OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteMilieu7OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFin1OUT":"FluteFin1OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFin1 = this["FluteFin1OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFin1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFin1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFin1OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteFin1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFin2OUT":"FluteFin2OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFin2 = this["FluteFin2OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFin2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFin2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFin2OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteFin2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFin3OUT":"FluteFin3OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFin3 = this["FluteFin3OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFin3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFin3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFin3OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteFin3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFin4OUT":"FluteFin4OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFin4 = this["FluteFin4OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFin4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFin4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFin4OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteFin4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFin5OUT":"FluteFin5OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFin5 = this["FluteFin5OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFin5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFin5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFin5OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteFin5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFin6OUT":"FluteFin6OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFin6 = this["FluteFin6OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFin6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFin6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFin6OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteFin6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFin7OUT":"FluteFin7OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFin7 = this["FluteFin7OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFin7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFin7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFin7OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteFin7OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:FluteIntro1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour FluteIntro1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteIntro1IN  =this["FluteIntro1IN"];
                  return FluteIntro1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteIntro1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteIntro1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteIntro1OUT" : "FluteIntro1OUT",
              "apply":function (){
                return ((() => {
                  const FluteIntro1OUT = this["FluteIntro1OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteIntro1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteIntro1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteIntro1OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteIntro1OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteIntro1
  ,
        hh.SEQUENCE( // Debut sequence pour FluteIntro2
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteIntro2IN  =this["FluteIntro2IN"];
                  return FluteIntro2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteIntro2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteIntro2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteIntro2OUT" : "FluteIntro2OUT",
              "apply":function (){
                return ((() => {
                  const FluteIntro2OUT = this["FluteIntro2OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteIntro2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteIntro2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteIntro2OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteIntro2OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteIntro2
  ,
        hh.SEQUENCE( // Debut sequence pour FluteIntro3
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteIntro3IN  =this["FluteIntro3IN"];
                  return FluteIntro3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteIntro3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteIntro3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteIntro3OUT" : "FluteIntro3OUT",
              "apply":function (){
                return ((() => {
                  const FluteIntro3OUT = this["FluteIntro3OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteIntro3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteIntro3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteIntro3OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteIntro3OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteIntro3
  ,
        hh.SEQUENCE( // Debut sequence pour FluteIntro4
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteIntro4IN  =this["FluteIntro4IN"];
                  return FluteIntro4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteIntro4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteIntro4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteIntro4OUT" : "FluteIntro4OUT",
              "apply":function (){
                return ((() => {
                  const FluteIntro4OUT = this["FluteIntro4OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteIntro4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteIntro4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteIntro4OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteIntro4OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteIntro4
  ,
        hh.SEQUENCE( // Debut sequence pour FluteIntro5
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteIntro5IN  =this["FluteIntro5IN"];
                  return FluteIntro5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteIntro5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteIntro5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteIntro5OUT" : "FluteIntro5OUT",
              "apply":function (){
                return ((() => {
                  const FluteIntro5OUT = this["FluteIntro5OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteIntro5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteIntro5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteIntro5OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteIntro5OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteIntro5
  ,
        hh.SEQUENCE( // Debut sequence pour FluteIntro6
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteIntro6IN  =this["FluteIntro6IN"];
                  return FluteIntro6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteIntro6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteIntro6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteIntro6OUT" : "FluteIntro6OUT",
              "apply":function (){
                return ((() => {
                  const FluteIntro6OUT = this["FluteIntro6OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteIntro6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteIntro6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteIntro6OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteIntro6OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteIntro6
  ,
        hh.SEQUENCE( // Debut sequence pour FluteIntro7
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteIntro7IN  =this["FluteIntro7IN"];
                  return FluteIntro7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteIntro7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteIntro7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteIntro7OUT" : "FluteIntro7OUT",
              "apply":function (){
                return ((() => {
                  const FluteIntro7OUT = this["FluteIntro7OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteIntro7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteIntro7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteIntro7OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteIntro7OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteIntro7
  ,
        hh.SEQUENCE( // Debut sequence pour FluteMilieu1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteMilieu1IN  =this["FluteMilieu1IN"];
                  return FluteMilieu1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteMilieu1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteMilieu1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteMilieu1OUT" : "FluteMilieu1OUT",
              "apply":function (){
                return ((() => {
                  const FluteMilieu1OUT = this["FluteMilieu1OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteMilieu1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteMilieu1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteMilieu1OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteMilieu1OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteMilieu1
  ,
        hh.SEQUENCE( // Debut sequence pour FluteMilieu2
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteMilieu2IN  =this["FluteMilieu2IN"];
                  return FluteMilieu2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteMilieu2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteMilieu2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteMilieu2OUT" : "FluteMilieu2OUT",
              "apply":function (){
                return ((() => {
                  const FluteMilieu2OUT = this["FluteMilieu2OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteMilieu2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteMilieu2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteMilieu2OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteMilieu2OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteMilieu2
  ,
        hh.SEQUENCE( // Debut sequence pour FluteMilieu3
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteMilieu3IN  =this["FluteMilieu3IN"];
                  return FluteMilieu3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteMilieu3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteMilieu3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteMilieu3OUT" : "FluteMilieu3OUT",
              "apply":function (){
                return ((() => {
                  const FluteMilieu3OUT = this["FluteMilieu3OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteMilieu3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteMilieu3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteMilieu3OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteMilieu3OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteMilieu3
  ,
        hh.SEQUENCE( // Debut sequence pour FluteMilieu4
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteMilieu4IN  =this["FluteMilieu4IN"];
                  return FluteMilieu4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteMilieu4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteMilieu4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteMilieu4OUT" : "FluteMilieu4OUT",
              "apply":function (){
                return ((() => {
                  const FluteMilieu4OUT = this["FluteMilieu4OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteMilieu4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteMilieu4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteMilieu4OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteMilieu4OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteMilieu4
  ,
        hh.SEQUENCE( // Debut sequence pour FluteMilieu5
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteMilieu5IN  =this["FluteMilieu5IN"];
                  return FluteMilieu5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteMilieu5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteMilieu5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteMilieu5OUT" : "FluteMilieu5OUT",
              "apply":function (){
                return ((() => {
                  const FluteMilieu5OUT = this["FluteMilieu5OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteMilieu5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteMilieu5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteMilieu5OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteMilieu5OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteMilieu5
  ,
        hh.SEQUENCE( // Debut sequence pour FluteMilieu6
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteMilieu6IN  =this["FluteMilieu6IN"];
                  return FluteMilieu6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteMilieu6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteMilieu6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteMilieu6OUT" : "FluteMilieu6OUT",
              "apply":function (){
                return ((() => {
                  const FluteMilieu6OUT = this["FluteMilieu6OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteMilieu6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteMilieu6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteMilieu6OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteMilieu6OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteMilieu6
  ,
        hh.SEQUENCE( // Debut sequence pour FluteMilieu7
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteMilieu7IN  =this["FluteMilieu7IN"];
                  return FluteMilieu7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteMilieu7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteMilieu7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteMilieu7OUT" : "FluteMilieu7OUT",
              "apply":function (){
                return ((() => {
                  const FluteMilieu7OUT = this["FluteMilieu7OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteMilieu7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteMilieu7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteMilieu7OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteMilieu7OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteMilieu7
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFin1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteFin1IN  =this["FluteFin1IN"];
                  return FluteFin1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFin1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFin1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFin1OUT" : "FluteFin1OUT",
              "apply":function (){
                return ((() => {
                  const FluteFin1OUT = this["FluteFin1OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFin1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFin1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFin1OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteFin1OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFin1
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFin2
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteFin2IN  =this["FluteFin2IN"];
                  return FluteFin2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFin2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFin2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFin2OUT" : "FluteFin2OUT",
              "apply":function (){
                return ((() => {
                  const FluteFin2OUT = this["FluteFin2OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFin2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFin2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFin2OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteFin2OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFin2
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFin3
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteFin3IN  =this["FluteFin3IN"];
                  return FluteFin3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFin3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFin3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFin3OUT" : "FluteFin3OUT",
              "apply":function (){
                return ((() => {
                  const FluteFin3OUT = this["FluteFin3OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFin3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFin3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFin3OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteFin3OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFin3
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFin4
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteFin4IN  =this["FluteFin4IN"];
                  return FluteFin4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFin4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFin4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFin4OUT" : "FluteFin4OUT",
              "apply":function (){
                return ((() => {
                  const FluteFin4OUT = this["FluteFin4OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFin4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFin4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFin4OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteFin4OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFin4
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFin5
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteFin5IN  =this["FluteFin5IN"];
                  return FluteFin5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFin5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFin5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFin5OUT" : "FluteFin5OUT",
              "apply":function (){
                return ((() => {
                  const FluteFin5OUT = this["FluteFin5OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFin5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFin5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFin5OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteFin5OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFin5
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFin6
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteFin6IN  =this["FluteFin6IN"];
                  return FluteFin6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFin6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFin6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFin6OUT" : "FluteFin6OUT",
              "apply":function (){
                return ((() => {
                  const FluteFin6OUT = this["FluteFin6OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFin6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFin6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFin6OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteFin6OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFin6
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFin7
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const FluteFin7IN  =this["FluteFin7IN"];
                  return FluteFin7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFin7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFin7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFin7OUT" : "FluteFin7OUT",
              "apply":function (){
                return ((() => {
                  const FluteFin7OUT = this["FluteFin7OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFin7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFin7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFin7OUT");
                gcs.informSelecteurOnMenuChange(0 , "FluteFin7OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFin7
      ), // Fin fork de make await avec en premiere position:FluteIntro1
      hh.EXIT(
        {
            "EXIT":"EXIT",
            "%location":{"filename":"hiphop_blocks.js","pos":8, "block":"makeReservoir"},
            "%tag":"break"
        })
      ) // Fin Abort
    ), // Fin Trap

    hh.PAUSE(
      {
        "%location":{"filename":"hiphop_blocks.js","pos":9, "block":"makeReservoir"},
        "%tag":"yield"
      }
    ),

    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteIntro1OUT":"FluteIntro1OUT",
          "apply":function (){
            return ((() => {
              const FluteIntro1 = this["FluteIntro1OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteIntro1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteIntro1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteIntro2OUT":"FluteIntro2OUT",
          "apply":function (){
            return ((() => {
              const FluteIntro2 = this["FluteIntro2OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteIntro2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteIntro2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteIntro3OUT":"FluteIntro3OUT",
          "apply":function (){
            return ((() => {
              const FluteIntro3 = this["FluteIntro3OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteIntro3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteIntro3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteIntro4OUT":"FluteIntro4OUT",
          "apply":function (){
            return ((() => {
              const FluteIntro4 = this["FluteIntro4OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteIntro4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteIntro4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteIntro5OUT":"FluteIntro5OUT",
          "apply":function (){
            return ((() => {
              const FluteIntro5 = this["FluteIntro5OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteIntro5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteIntro5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteIntro6OUT":"FluteIntro6OUT",
          "apply":function (){
            return ((() => {
              const FluteIntro6 = this["FluteIntro6OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteIntro6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteIntro6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteIntro7OUT":"FluteIntro7OUT",
          "apply":function (){
            return ((() => {
              const FluteIntro7 = this["FluteIntro7OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteIntro7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteIntro7OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteMilieu1OUT":"FluteMilieu1OUT",
          "apply":function (){
            return ((() => {
              const FluteMilieu1 = this["FluteMilieu1OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteMilieu1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteMilieu1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteMilieu2OUT":"FluteMilieu2OUT",
          "apply":function (){
            return ((() => {
              const FluteMilieu2 = this["FluteMilieu2OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteMilieu2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteMilieu2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteMilieu3OUT":"FluteMilieu3OUT",
          "apply":function (){
            return ((() => {
              const FluteMilieu3 = this["FluteMilieu3OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteMilieu3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteMilieu3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteMilieu4OUT":"FluteMilieu4OUT",
          "apply":function (){
            return ((() => {
              const FluteMilieu4 = this["FluteMilieu4OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteMilieu4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteMilieu4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteMilieu5OUT":"FluteMilieu5OUT",
          "apply":function (){
            return ((() => {
              const FluteMilieu5 = this["FluteMilieu5OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteMilieu5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteMilieu5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteMilieu6OUT":"FluteMilieu6OUT",
          "apply":function (){
            return ((() => {
              const FluteMilieu6 = this["FluteMilieu6OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteMilieu6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteMilieu6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteMilieu7OUT":"FluteMilieu7OUT",
          "apply":function (){
            return ((() => {
              const FluteMilieu7 = this["FluteMilieu7OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteMilieu7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteMilieu7OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFin1OUT":"FluteFin1OUT",
          "apply":function (){
            return ((() => {
              const FluteFin1 = this["FluteFin1OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFin1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFin1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFin2OUT":"FluteFin2OUT",
          "apply":function (){
            return ((() => {
              const FluteFin2 = this["FluteFin2OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFin2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFin2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFin3OUT":"FluteFin3OUT",
          "apply":function (){
            return ((() => {
              const FluteFin3 = this["FluteFin3OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFin3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFin3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFin4OUT":"FluteFin4OUT",
          "apply":function (){
            return ((() => {
              const FluteFin4 = this["FluteFin4OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFin4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFin4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFin5OUT":"FluteFin5OUT",
          "apply":function (){
            return ((() => {
              const FluteFin5 = this["FluteFin5OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFin5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFin5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFin6OUT":"FluteFin6OUT",
          "apply":function (){
            return ((() => {
              const FluteFin6 = this["FluteFin6OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFin6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFin6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFin7OUT":"FluteFin7OUT",
          "apply":function (){
            return ((() => {
              const FluteFin7 = this["FluteFin7OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFin7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFin7OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(0 , "FluteIntro1", false);
            console.log("--- FIN RESERVOIR:", "FluteIntro1");
            var msg = {
            type: 'killTank',
            value:  "FluteIntro1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank Percu + Percu1
    Percu = hh.MODULE({"id":"Percu","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Percu1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Percu2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Percu3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Percu4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Percu5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Percu6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Percu7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Percu1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Percu2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Percu3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Percu4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Percu5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Percu6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Percu7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":4, "block":"makeReservoir"},"direction":"IN", "name":"stopReservoir"}),
    hh.TRAP(
    {
      "EXIT":"EXIT",
      "%location":{},
      "%tag":"EXIT"
    },
      hh.ABORT({
        "%location":{"filename":"hiphop_blocks.js","pos":394},
        "%tag":"abort",
        "immediate":false,
        "apply":function (){return ((() => {
            const stopReservoir = this["stopReservoir"];
            return stopReservoir.now;
          })());
        }
      },
        hh.SIGACCESS({
           "signame":"stopReservoir",
           "pre":false,
           "val":false,
           "cnt":false
        }),
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":5, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                console.log("-- MAKE RESERVOIR:", "Percu1,Percu2,Percu3,Percu4,Percu5,Percu6,Percu7" );
                var msg = {
                  type: 'startTank',
                  value:  "Percu1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Percu1OUT":"Percu1OUT",
                "apply":function (){
                  return ((() => {
                    const Percu1 = this["Percu1OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Percu1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Percu1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Percu1OUT");
                gcs.informSelecteurOnMenuChange(0 , "Percu1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Percu2OUT":"Percu2OUT",
                "apply":function (){
                  return ((() => {
                    const Percu2 = this["Percu2OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Percu2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Percu2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Percu2OUT");
                gcs.informSelecteurOnMenuChange(0 , "Percu2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Percu3OUT":"Percu3OUT",
                "apply":function (){
                  return ((() => {
                    const Percu3 = this["Percu3OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Percu3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Percu3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Percu3OUT");
                gcs.informSelecteurOnMenuChange(0 , "Percu3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Percu4OUT":"Percu4OUT",
                "apply":function (){
                  return ((() => {
                    const Percu4 = this["Percu4OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Percu4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Percu4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Percu4OUT");
                gcs.informSelecteurOnMenuChange(0 , "Percu4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Percu5OUT":"Percu5OUT",
                "apply":function (){
                  return ((() => {
                    const Percu5 = this["Percu5OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Percu5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Percu5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Percu5OUT");
                gcs.informSelecteurOnMenuChange(0 , "Percu5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Percu6OUT":"Percu6OUT",
                "apply":function (){
                  return ((() => {
                    const Percu6 = this["Percu6OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Percu6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Percu6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Percu6OUT");
                gcs.informSelecteurOnMenuChange(0 , "Percu6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Percu7OUT":"Percu7OUT",
                "apply":function (){
                  return ((() => {
                    const Percu7 = this["Percu7OUT"];
                    return [true, 0 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Percu7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Percu7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Percu7OUT");
                gcs.informSelecteurOnMenuChange(0 , "Percu7OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:Percu1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour Percu1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Percu1IN  =this["Percu1IN"];
                  return Percu1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Percu1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Percu1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Percu1OUT" : "Percu1OUT",
              "apply":function (){
                return ((() => {
                  const Percu1OUT = this["Percu1OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Percu1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Percu1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Percu1OUT");
                gcs.informSelecteurOnMenuChange(0 , "Percu1OUT", false);
              }
            }
          )
        ) // Fin sequence pour Percu1
  ,
        hh.SEQUENCE( // Debut sequence pour Percu2
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Percu2IN  =this["Percu2IN"];
                  return Percu2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Percu2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Percu2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Percu2OUT" : "Percu2OUT",
              "apply":function (){
                return ((() => {
                  const Percu2OUT = this["Percu2OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Percu2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Percu2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Percu2OUT");
                gcs.informSelecteurOnMenuChange(0 , "Percu2OUT", false);
              }
            }
          )
        ) // Fin sequence pour Percu2
  ,
        hh.SEQUENCE( // Debut sequence pour Percu3
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Percu3IN  =this["Percu3IN"];
                  return Percu3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Percu3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Percu3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Percu3OUT" : "Percu3OUT",
              "apply":function (){
                return ((() => {
                  const Percu3OUT = this["Percu3OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Percu3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Percu3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Percu3OUT");
                gcs.informSelecteurOnMenuChange(0 , "Percu3OUT", false);
              }
            }
          )
        ) // Fin sequence pour Percu3
  ,
        hh.SEQUENCE( // Debut sequence pour Percu4
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Percu4IN  =this["Percu4IN"];
                  return Percu4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Percu4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Percu4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Percu4OUT" : "Percu4OUT",
              "apply":function (){
                return ((() => {
                  const Percu4OUT = this["Percu4OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Percu4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Percu4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Percu4OUT");
                gcs.informSelecteurOnMenuChange(0 , "Percu4OUT", false);
              }
            }
          )
        ) // Fin sequence pour Percu4
  ,
        hh.SEQUENCE( // Debut sequence pour Percu5
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Percu5IN  =this["Percu5IN"];
                  return Percu5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Percu5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Percu5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Percu5OUT" : "Percu5OUT",
              "apply":function (){
                return ((() => {
                  const Percu5OUT = this["Percu5OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Percu5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Percu5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Percu5OUT");
                gcs.informSelecteurOnMenuChange(0 , "Percu5OUT", false);
              }
            }
          )
        ) // Fin sequence pour Percu5
  ,
        hh.SEQUENCE( // Debut sequence pour Percu6
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Percu6IN  =this["Percu6IN"];
                  return Percu6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Percu6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Percu6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Percu6OUT" : "Percu6OUT",
              "apply":function (){
                return ((() => {
                  const Percu6OUT = this["Percu6OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Percu6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Percu6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Percu6OUT");
                gcs.informSelecteurOnMenuChange(0 , "Percu6OUT", false);
              }
            }
          )
        ) // Fin sequence pour Percu6
  ,
        hh.SEQUENCE( // Debut sequence pour Percu7
        {
          "%location":{"filename":"hiphop_blocks.js","pos":312},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":317},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const Percu7IN  =this["Percu7IN"];
                  return Percu7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Percu7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Percu7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Percu7OUT" : "Percu7OUT",
              "apply":function (){
                return ((() => {
                  const Percu7OUT = this["Percu7OUT"];
                  return [false, 0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Percu7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Percu7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Percu7OUT");
                gcs.informSelecteurOnMenuChange(0 , "Percu7OUT", false);
              }
            }
          )
        ) // Fin sequence pour Percu7
      ), // Fin fork de make await avec en premiere position:Percu1
      hh.EXIT(
        {
            "EXIT":"EXIT",
            "%location":{"filename":"hiphop_blocks.js","pos":8, "block":"makeReservoir"},
            "%tag":"break"
        })
      ) // Fin Abort
    ), // Fin Trap

    hh.PAUSE(
      {
        "%location":{"filename":"hiphop_blocks.js","pos":9, "block":"makeReservoir"},
        "%tag":"yield"
      }
    ),

    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Percu1OUT":"Percu1OUT",
          "apply":function (){
            return ((() => {
              const Percu1 = this["Percu1OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Percu1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Percu1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Percu2OUT":"Percu2OUT",
          "apply":function (){
            return ((() => {
              const Percu2 = this["Percu2OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Percu2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Percu2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Percu3OUT":"Percu3OUT",
          "apply":function (){
            return ((() => {
              const Percu3 = this["Percu3OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Percu3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Percu3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Percu4OUT":"Percu4OUT",
          "apply":function (){
            return ((() => {
              const Percu4 = this["Percu4OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Percu4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Percu4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Percu5OUT":"Percu5OUT",
          "apply":function (){
            return ((() => {
              const Percu5 = this["Percu5OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Percu5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Percu5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Percu6OUT":"Percu6OUT",
          "apply":function (){
            return ((() => {
              const Percu6 = this["Percu6OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Percu6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Percu6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Percu7OUT":"Percu7OUT",
          "apply":function (){
            return ((() => {
              const Percu7 = this["Percu7OUT"];
              return [false, 0 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Percu7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Percu7OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(0 , "Percu1", false);
            console.log("--- FIN RESERVOIR:", "Percu1");
            var msg = {
            type: 'killTank',
            value:  "Percu1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module
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
  //
  //
  //
  //
  //
  //

  TransPianoEtNappe = hh.MODULE({"id":"TransPianoEtNappe","%location":{},"%tag":"module"},

      hh.SIGNAL({
        "%location":{},
        "direction":"INOUT",
        "name":"tick",
        "combine_func":(x, y) => x + y
      }),


    hh.LOOP(
        {
          "%location":{loop: 1},
          "%tag":"loop"
        },

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            transposeValue = 0; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
            console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
            oscMidiLocal.sendControlChange(par.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
          }
        }
      ),

      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":false,
          "apply":function () {
            return ((() => {
              const tick=this["tick"];
              return tick.now;
            })());
          },
          "countapply":function (){ return 1;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            transposeValue = -2; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
            console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
            oscMidiLocal.sendControlChange(par.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
          }
        }
      ),

      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":false,
          "apply":function () {
            return ((() => {
              const tick=this["tick"];
              return tick.now;
            })());
          },
          "countapply":function (){ return 1;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            transposeValue = 2; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
            console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
            oscMidiLocal.sendControlChange(par.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
          }
        }
      ),

      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":false,
          "apply":function () {
            return ((() => {
              const tick=this["tick"];
              return tick.now;
            })());
          },
          "countapply":function (){ return 1;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

      ),

  );
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
  //
  //
  //
  //
  //
  //

  TransPianoEtNappe2 = hh.MODULE({"id":"TransPianoEtNappe2","%location":{},"%tag":"module"},

      hh.SIGNAL({
        "%location":{},
        "direction":"INOUT",
        "name":"tick",
        "combine_func":(x, y) => x + y
      }),


    hh.LOOP(
        {
          "%location":{loop: 1},
          "%tag":"loop"
        },

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            transposeValue = 0; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
            console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
            oscMidiLocal.sendControlChange(par.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
          }
        }
      ),

      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":false,
          "apply":function () {
            return ((() => {
              const tick=this["tick"];
              return tick.now;
            })());
          },
          "countapply":function (){ return 2;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            transposeValue = -2; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
            console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
            oscMidiLocal.sendControlChange(par.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
          }
        }
      ),

      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":false,
          "apply":function () {
            return ((() => {
              const tick=this["tick"];
              return tick.now;
            })());
          },
          "countapply":function (){ return 2;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            transposeValue = 2; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
            console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
            oscMidiLocal.sendControlChange(par.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
          }
        }
      ),

      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":false,
          "apply":function () {
            return ((() => {
              const tick=this["tick"];
              return tick.now;
            })());
          },
          "countapply":function (){ return 2;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

      ),

  );
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
  //
  //
  //
  //
  //
  //

  TransPianoEtNappe3 = hh.MODULE({"id":"TransPianoEtNappe3","%location":{},"%tag":"module"},

      hh.SIGNAL({
        "%location":{},
        "direction":"INOUT",
        "name":"tick",
        "combine_func":(x, y) => x + y
      }),


    hh.LOOP(
        {
          "%location":{loop: 1},
          "%tag":"loop"
        },

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            transposeValue = 0; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
            console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
            oscMidiLocal.sendControlChange(par.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
          }
        }
      ),

      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":false,
          "apply":function () {
            return ((() => {
              const tick=this["tick"];
              return tick.now;
            })());
          },
          "countapply":function (){ return 1;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            transposeValue = -2; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
            console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
            oscMidiLocal.sendControlChange(par.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
          }
        }
      ),

      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":false,
          "apply":function () {
            return ((() => {
              const tick=this["tick"];
              return tick.now;
            })());
          },
          "countapply":function (){ return 1;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            transposeValue = 2; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
            console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
            oscMidiLocal.sendControlChange(par.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
          }
        }
      ),

      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":false,
          "apply":function () {
            return ((() => {
              const tick=this["tick"];
              return tick.now;
            })());
          },
          "countapply":function (){ return 1;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            transposeValue = -1; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
            console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
            oscMidiLocal.sendControlChange(par.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
          }
        }
      ),

      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":false,
          "apply":function () {
            return ((() => {
              const tick=this["tick"];
              return tick.now;
            })());
          },
          "countapply":function (){ return 1;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            transposeValue = 1; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
            console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
            oscMidiLocal.sendControlChange(par.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
          }
        }
      ),

      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":false,
          "apply":function () {
            return ((() => {
              const tick=this["tick"];
              return tick.now;
            })());
          },
          "countapply":function (){ return 1;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

      ),

  );
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
  //
  //
  //
  //
  //
  //

  TransSaxo = hh.MODULE({"id":"TransSaxo","%location":{},"%tag":"module"},

      hh.SIGNAL({
        "%location":{},
        "direction":"INOUT",
        "name":"tick",
        "combine_func":(x, y) => x + y
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"INOUT",
        "name":"StartTransSaxo",
        "combine_func":(x, y) => x + y
      }),


      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":true,
          "apply":function () {
            return ((() => {
              const StartTransSaxo=this["StartTransSaxo"];
              return StartTransSaxo.now;
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"StartTransSaxo",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

    hh.AWAIT(
      {
        "%location":{},
        "%tag":"await",
        "immediate":false,
        "apply":function () {
          return ((() => {
            const tick=this["tick"];
            return tick.now;
          })());
        },
        "countapply":function (){ return 2;}
      },
      hh.SIGACCESS({
        "signame":"tick",
        "pre":false,
        "val":false,
        "cnt":false
      })
    ),

    hh.LOOP(
        {
          "%location":{loop: 1},
          "%tag":"loop"
        },

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            transposeValue = 0; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
            console.log("hiphop block transpose: transposeValue:", transposeValue ,1,72);
            oscMidiLocal.sendControlChange(par.busMidiDAW,1,72, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
          }
        }
      ),

      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":false,
          "apply":function () {
            return ((() => {
              const tick=this["tick"];
              return tick.now;
            })());
          },
          "countapply":function (){ return 4;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            transposeValue = -5; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
            console.log("hiphop block transpose: transposeValue:", transposeValue ,1,72);
            oscMidiLocal.sendControlChange(par.busMidiDAW,1,72, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
          }
        }
      ),

      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":false,
          "apply":function () {
            return ((() => {
              const tick=this["tick"];
              return tick.now;
            })());
          },
          "countapply":function (){ return 4;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            transposeValue = -7; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
            console.log("hiphop block transpose: transposeValue:", transposeValue ,1,72);
            oscMidiLocal.sendControlChange(par.busMidiDAW,1,72, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
          }
        }
      ),

      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":false,
          "apply":function () {
            return ((() => {
              const tick=this["tick"];
              return tick.now;
            })());
          },
          "countapply":function (){ return 4;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

      ),

  );


  var orchestration = hh.MODULE(
      {"id":"Orchestration","%location":{},"%tag":"module"},
      signals,

      hh.SIGNAL({"%location":{},"direction":"IN","name":"start"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"halt"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"tick"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"DAWON"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"patternSignal"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"controlFromVideo"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"pulsation"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"midiSignal"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"emptyQueueSignal"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC0"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC1"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC2"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC3"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC4"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC5"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC6"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC7"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC8"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC9"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC10"}),
      hh.SIGNAL({"%location":{},"direction":"IN","name":"INTERFACEZ_RC11"}),
      hh.SIGNAL({"%location":{},"direction":"INOUT","name":"stopReservoir"}),
      hh.SIGNAL({"%location":{},"direction":"INOUT","name":"stopMoveTempo"}),


    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"StartTransSaxo",
      "combine_func":(x, y) => x + y
    }),

    hh.LOOP(
      {
      "%location":{loop: 1},
        "%tag":"loop"
      },
      hh.ABORT(
        {
          "%location":{abort: halt},
          "%tag":"abort",
          "immediate":false,
          "apply": function (){return ((() => {
              const halt=this["halt"];
              return halt.now;
          })());},
          "countapply":function (){ return 1;}
        },
        hh.SIGACCESS({
          "signame":"halt",
          "pre":false,
          "val":false,
          "cnt":false
        }),

        hh.AWAIT(
          {
            "%location":{},
            "%tag":"await",
            "immediate":true,
            "apply":function () {
              return ((() => {
                const start=this["start"];
                return start.now;
              })());
            },
          },
          hh.SIGACCESS({
            "signame":"start",
            "pre":false,
            "val":false,
            "cnt":false
          })
        ),

        hh.FORK(
          {"%location":{},"%tag":"fork"},
          hh.SEQUENCE(
          {"%location":{},"%tag":"fork"},

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {console.log('Opus4');}
    }
  ),

        hh.SEQUENCE(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
              "%tag":"seq"
            },


        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              var msg = {
                type: 'setListeDesTypes',
              }
              serveur.broadcast(JSON.stringify(msg));
            }
          }
        ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            var msg = {
              type: 'listeDesTypes',
              text:'1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11'
            }
            serveur.broadcast(JSON.stringify(msg));
          }
        }
      ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
               gcs.setpatternListLength([12,255]);
            }
          }
        ),

    ),

        hh.SEQUENCE(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
              "%tag":"seq"
            },


    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          setTempo(70);
        }
      }
    ),

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          gcs.setTimerDivision(1);
        }
      }
    ),

      hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            var msg = {
              type: 'addSceneScore',
              value:1
            }
            serveur.broadcast(JSON.stringify(msg));
            }
          }
      ),
      hh.PAUSE(
        {
          "%location":{"filename":"hiphop_blocks.js","pos":2, "block":"addSceneScore"},
          "%tag":"yield"
        }
      ),

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          ratioTranspose = 1.763;
          offsetTranspose = 63.5;
          if(debug) console.log("hiphop block transpose Parameters:", ratioTranspose, offsetTranspose);
        }
      }
    ),

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          transposeValue = 0; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,74);
          oscMidiLocal.sendControlChange(par.busMidiDAW,1,74, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }
      }
    ),

    ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.cleanQueues();
            gcs.cleanChoiceList(255);
          }
        }
      ),

        hh.SEQUENCE(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
              "%tag":"seq"
            },


      hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            var msg = {
              type: 'alertInfoScoreON',
              value:'Transposition-1 tick'
            }
            serveur.broadcast(JSON.stringify(msg));
            }
          }
      ),

          hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },


      hh.LOCAL(
        {
          "%location":{},
          "%tag":"signal"
        },
        hh.SIGNAL({
          "name":"stop202774"
        }),

          hh.TRAP(
            {
              "trap202774":"trap202774",
              "%location":{},
              "%tag":"trap202774"
            },
            hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },
              hh.SEQUENCE( // sequence 1
                {
                  "%location":{},
                  "%tag":"seq"
                },
                hh.FORK(
                  {
                    "%location":{},
                    "%tag":"fork"
                  },
                  hh.SEQUENCE(
                    {
                      "%location":{},
                      "%tag":"seq"
                    },
                    hh.RUN(
                      {
                        "%location":{"filename":"","pos":1},
                        "%tag":"run",
                        "module": Piano, //{"filename":"","pos":2},
                        "autocomplete":true,
                        "stopReservoir":"stop202774"
                      }
                    ),
                  ),

              )
            ),
            hh.SEQUENCE(
              {
                "%location":{},
                "%tag":"seq"
              },
              hh.AWAIT(
                  {
                    "%location":{},
                    "%tag":"await",
                    "immediate":false,
                    "apply":function (){return ((() => {
                      const tick =this["tick"];
                      return tick.now;})());},
                    "countapply":function (){return 30;}
                },
                hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
              ),
              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  //"stopReservoir":"stopReservoir",
                  "stop202774" : "stop202774",
                  "apply":function (){
                    return ((() => {
                      //const stopReservoir = this["stopReservoir"];
                      const stop202774 = this["stop202774"];
                      return 0;
                    })());
                  }
                },
                hh.SIGACCESS({
                  //"signame":"stopReservoir",
                  "signame":"stop202774",
                  "pre":true,
                  "val":true,
                  "cnt":false
                })
              ), // Fin emit

              hh.PAUSE(
                {
                  "%location":{},
                  "%tag":"yield"
                }
              ),

              hh.EXIT(
              {
                "trap202774":"trap202774",
                "%location":{},
                "%tag":"break"
              }), // Exit
            ) // sequence
          ), // fork
        ), // trap

        hh.PAUSE(
          {
            "%location":{},
            "%tag":"yield"
          }
        )
      ),

          hh.TRAP(
            {
              "trap442412":"trap442412",
              "%location":{},
              "%tag":"trap442412"
            },
            hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },
              hh.SEQUENCE( // sequence 1
                {
                  "%location":{},
                  "%tag":"seq"
                },
              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  "nappeViolonsOUT":"nappeViolonsOUT",
                  "apply":function (){
                    return ((() => {
                      const nappeViolonsOUT = this["nappeViolonsOUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"nappeViolonsOUT",
                  "pre":true,
                  "val":true,
                  "cnt":false
                })
              ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () {
                    gcs.informSelecteurOnMenuChange(255," nappeViolons", true);
                  }
      		      }
      		 	  ),

            	), // fin sequence 1
          	hh.SEQUENCE(
      	        {
      	          "%location":{},
      	          "%tag":"seq"
      	        },
      	        hh.AWAIT(
      	            {
      	              "%location":{},
      	              "%tag":"await",
      	              "immediate":false,
      	              "apply":function (){return ((() => {
      	                const tick =this["tick"];
      	                return tick.now;})());},
      	              "countapply":function (){return 30;}
      	          },
      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
      	        ),


      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "nappeViolonsOUT":"nappeViolonsOUT",
      	            "apply":function (){
      	              return ((() => {
      	                const nappeViolonsOUT = this["nappeViolonsOUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"nappeViolonsOUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," nappeViolons", false); }
      		      }
      		 	),

      	        hh.PAUSE(
      	          {
      	            "%location":{},
      	            "%tag":"yield"
      	          }
      	        ),
      	        hh.EXIT(
      		        {
      		          "trap442412":"trap442412",
      		          "%location":{},
      		          "%tag":"break"
      		        }
      	        ), // Exit
      	      ) // sequence
          	), // fork
        	), // trap
      	hh.PAUSE(
      	    {
      	      "%location":{},
      	      "%tag":"yield"
      	    }
      	),

      ),

      hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            var msg = {
              type: 'alertInfoScoreON',
              value:'Transposition3-1 tick'
            }
            serveur.broadcast(JSON.stringify(msg));
            }
          }
      ),

          hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },


      hh.LOCAL(
        {
          "%location":{},
          "%tag":"signal"
        },
        hh.SIGNAL({
          "name":"stop459864"
        }),

          hh.TRAP(
            {
              "trap459864":"trap459864",
              "%location":{},
              "%tag":"trap459864"
            },
            hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },
              hh.SEQUENCE( // sequence 1
                {
                  "%location":{},
                  "%tag":"seq"
                },
                hh.FORK(
                  {
                    "%location":{},
                    "%tag":"fork"
                  },
                  hh.SEQUENCE(
                    {
                      "%location":{},
                      "%tag":"seq"
                    },
                    hh.RUN(
                      {
                        "%location":{"filename":"","pos":1},
                        "%tag":"run",
                        "module": Piano, //{"filename":"","pos":2},
                        "autocomplete":true,
                        "stopReservoir":"stop459864"
                      }
                    ),
                  ),

              )
            ),
            hh.SEQUENCE(
              {
                "%location":{},
                "%tag":"seq"
              },
              hh.AWAIT(
                  {
                    "%location":{},
                    "%tag":"await",
                    "immediate":false,
                    "apply":function (){return ((() => {
                      const tick =this["tick"];
                      return tick.now;})());},
                    "countapply":function (){return 30;}
                },
                hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
              ),
              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  //"stopReservoir":"stopReservoir",
                  "stop459864" : "stop459864",
                  "apply":function (){
                    return ((() => {
                      //const stopReservoir = this["stopReservoir"];
                      const stop459864 = this["stop459864"];
                      return 0;
                    })());
                  }
                },
                hh.SIGACCESS({
                  //"signame":"stopReservoir",
                  "signame":"stop459864",
                  "pre":true,
                  "val":true,
                  "cnt":false
                })
              ), // Fin emit

              hh.PAUSE(
                {
                  "%location":{},
                  "%tag":"yield"
                }
              ),

              hh.EXIT(
              {
                "trap459864":"trap459864",
                "%location":{},
                "%tag":"break"
              }), // Exit
            ) // sequence
          ), // fork
        ), // trap

        hh.PAUSE(
          {
            "%location":{},
            "%tag":"yield"
          }
        )
      ),

          hh.TRAP(
            {
              "trap457185":"trap457185",
              "%location":{},
              "%tag":"trap457185"
            },
            hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },
              hh.SEQUENCE( // sequence 1
                {
                  "%location":{},
                  "%tag":"seq"
                },
              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  "nappeViolonsOUT":"nappeViolonsOUT",
                  "apply":function (){
                    return ((() => {
                      const nappeViolonsOUT = this["nappeViolonsOUT"];
                      return [true, 1];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"nappeViolonsOUT",
                  "pre":true,
                  "val":true,
                  "cnt":false
                })
              ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () {
                    gcs.informSelecteurOnMenuChange(1," nappeViolons", true);
                  }
      		      }
      		 	  ),

            	), // fin sequence 1
          	hh.SEQUENCE(
      	        {
      	          "%location":{},
      	          "%tag":"seq"
      	        },
      	        hh.AWAIT(
      	            {
      	              "%location":{},
      	              "%tag":"await",
      	              "immediate":false,
      	              "apply":function (){return ((() => {
      	                const tick =this["tick"];
      	                return tick.now;})());},
      	              "countapply":function (){return 30;}
      	          },
      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
      	        ),


      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "nappeViolonsOUT":"nappeViolonsOUT",
      	            "apply":function (){
      	              return ((() => {
      	                const nappeViolonsOUT = this["nappeViolonsOUT"];
      	                return [false, 1];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"nappeViolonsOUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(1," nappeViolons", false); }
      		      }
      		 	),

      	        hh.PAUSE(
      	          {
      	            "%location":{},
      	            "%tag":"yield"
      	          }
      	        ),
      	        hh.EXIT(
      		        {
      		          "trap457185":"trap457185",
      		          "%location":{},
      		          "%tag":"break"
      		        }
      	        ), // Exit
      	      ) // sequence
          	), // fork
        	), // trap
      	hh.PAUSE(
      	    {
      	      "%location":{},
      	      "%tag":"yield"
      	    }
      	),


      hh.ABORT(
        {
          "%location":{abort: tick},
          "%tag":"abort",
          "immediate":false,
          "apply": function (){return ((() => {
              const tick=this["tick"];
              return tick.now;
          })());},
          "countapply":function (){ return 30;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        }),

              hh.FORK(
                  {
                    "%location":{},
                    "%tag":"fork"
                  },


          hh.RUN({
            "%location":{},
            "%tag":"run",
            "module": TransPianoEtNappe3,
            "tick":"",

          }),

          hh.ABORT(
            {
              "%location":{abort:stopMoveTempo},
              "%tag":"abort",
              "immediate":false,
              "apply": function (){return ((() => {
                  const stopMoveTempo =this["stopMoveTempo"];
                  return stopMoveTempo.now;
              })());},
            },
            hh.SIGACCESS({
              "signame":"stopMoveTempo",
              "pre":false,
              "val":false,
              "cnt":false
            }),
            hh.EVERY(
              {
                "%location":{every: tick},
                "%tag":"do/every",
                "immediate":false,
                "apply": function (){return ((() => {
                    const tick=this["tick"];
                    return tick.now;
                })());},
                "countapply":function (){ return  1;}
              },
              hh.SIGACCESS({
                "signame":"tick",
                "pre":false,
                "val":false,
                "cnt":false
              }),
              hh.ATOM(
                {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {
                    moveTempo(5, 8);
                  }
                }
              )
            )
          ),


          ),

      ),

      ),

      hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            var msg = {
              type: 'alertInfoScoreON',
              value:'Transposition2-2 ticks'
            }
            serveur.broadcast(JSON.stringify(msg));
            }
          }
      ),

          hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },


      hh.LOCAL(
        {
          "%location":{},
          "%tag":"signal"
        },
        hh.SIGNAL({
          "name":"stop589723"
        }),

          hh.TRAP(
            {
              "trap589723":"trap589723",
              "%location":{},
              "%tag":"trap589723"
            },
            hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },
              hh.SEQUENCE( // sequence 1
                {
                  "%location":{},
                  "%tag":"seq"
                },
                hh.FORK(
                  {
                    "%location":{},
                    "%tag":"fork"
                  },
                  hh.SEQUENCE(
                    {
                      "%location":{},
                      "%tag":"seq"
                    },
                    hh.RUN(
                      {
                        "%location":{"filename":"","pos":1},
                        "%tag":"run",
                        "module": Piano, //{"filename":"","pos":2},
                        "autocomplete":true,
                        "stopReservoir":"stop589723"
                      }
                    ),
                  ),

              )
            ),
            hh.SEQUENCE(
              {
                "%location":{},
                "%tag":"seq"
              },
              hh.AWAIT(
                  {
                    "%location":{},
                    "%tag":"await",
                    "immediate":false,
                    "apply":function (){return ((() => {
                      const tick =this["tick"];
                      return tick.now;})());},
                    "countapply":function (){return 30;}
                },
                hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
              ),
              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  //"stopReservoir":"stopReservoir",
                  "stop589723" : "stop589723",
                  "apply":function (){
                    return ((() => {
                      //const stopReservoir = this["stopReservoir"];
                      const stop589723 = this["stop589723"];
                      return 0;
                    })());
                  }
                },
                hh.SIGACCESS({
                  //"signame":"stopReservoir",
                  "signame":"stop589723",
                  "pre":true,
                  "val":true,
                  "cnt":false
                })
              ), // Fin emit

              hh.PAUSE(
                {
                  "%location":{},
                  "%tag":"yield"
                }
              ),

              hh.EXIT(
              {
                "trap589723":"trap589723",
                "%location":{},
                "%tag":"break"
              }), // Exit
            ) // sequence
          ), // fork
        ), // trap

        hh.PAUSE(
          {
            "%location":{},
            "%tag":"yield"
          }
        )
      ),

          hh.TRAP(
            {
              "trap167864":"trap167864",
              "%location":{},
              "%tag":"trap167864"
            },
            hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },
              hh.SEQUENCE( // sequence 1
                {
                  "%location":{},
                  "%tag":"seq"
                },
              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  "nappeViolonsOUT":"nappeViolonsOUT",
                  "apply":function (){
                    return ((() => {
                      const nappeViolonsOUT = this["nappeViolonsOUT"];
                      return [true, 1];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"nappeViolonsOUT",
                  "pre":true,
                  "val":true,
                  "cnt":false
                })
              ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () {
                    gcs.informSelecteurOnMenuChange(1," nappeViolons", true);
                  }
      		      }
      		 	  ),

            	), // fin sequence 1
          	hh.SEQUENCE(
      	        {
      	          "%location":{},
      	          "%tag":"seq"
      	        },
      	        hh.AWAIT(
      	            {
      	              "%location":{},
      	              "%tag":"await",
      	              "immediate":false,
      	              "apply":function (){return ((() => {
      	                const tick =this["tick"];
      	                return tick.now;})());},
      	              "countapply":function (){return 30;}
      	          },
      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
      	        ),


      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "nappeViolonsOUT":"nappeViolonsOUT",
      	            "apply":function (){
      	              return ((() => {
      	                const nappeViolonsOUT = this["nappeViolonsOUT"];
      	                return [false, 1];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"nappeViolonsOUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(1," nappeViolons", false); }
      		      }
      		 	),

      	        hh.PAUSE(
      	          {
      	            "%location":{},
      	            "%tag":"yield"
      	          }
      	        ),
      	        hh.EXIT(
      		        {
      		          "trap167864":"trap167864",
      		          "%location":{},
      		          "%tag":"break"
      		        }
      	        ), // Exit
      	      ) // sequence
          	), // fork
        	), // trap
      	hh.PAUSE(
      	    {
      	      "%location":{},
      	      "%tag":"yield"
      	    }
      	),


      hh.ABORT(
        {
          "%location":{abort: tick},
          "%tag":"abort",
          "immediate":false,
          "apply": function (){return ((() => {
              const tick=this["tick"];
              return tick.now;
          })());},
          "countapply":function (){ return 30;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        }),

              hh.FORK(
                  {
                    "%location":{},
                    "%tag":"fork"
                  },


          hh.RUN({
            "%location":{},
            "%tag":"run",
            "module": TransPianoEtNappe2,
            "tick":"",

          }),

          hh.ABORT(
            {
              "%location":{abort:stopMoveTempo},
              "%tag":"abort",
              "immediate":false,
              "apply": function (){return ((() => {
                  const stopMoveTempo =this["stopMoveTempo"];
                  return stopMoveTempo.now;
              })());},
            },
            hh.SIGACCESS({
              "signame":"stopMoveTempo",
              "pre":false,
              "val":false,
              "cnt":false
            }),
            hh.EVERY(
              {
                "%location":{every: tick},
                "%tag":"do/every",
                "immediate":false,
                "apply": function (){return ((() => {
                    const tick=this["tick"];
                    return tick.now;
                })());},
                "countapply":function (){ return  1;}
              },
              hh.SIGACCESS({
                "signame":"tick",
                "pre":false,
                "val":false,
                "cnt":false
              }),
              hh.ATOM(
                {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {
                    moveTempo(5, 8);
                  }
                }
              )
            )
          ),


          ),

      ),

      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "nappeViolonsOUT": "nappeViolonsOUT",
            "apply":function (){
              return ((() => {
                const nappeViolonsOUT = this["nappeViolonsOUT"];
                return [false,1];
              })());
            }
          },
          hh.SIGACCESS({
            "signame": "nappeViolonsOUT",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),
        hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () { gcs.informSelecteurOnMenuChange(1 , "nappeViolonsOUT",false); }
          }
      ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.cleanQueue(1);
            }
          }
        ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.cleanQueue(2);
            }
          }
        ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.cleanQueue(3);
            }
          }
        ),

    ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        setTempo(70);
      }
    }
  ),

  hh.LOCAL(
    {
      "%location":{},
      "%tag":"signal"
    },
    hh.SIGNAL({
      "name":"stop495820"
    }),

      hh.TRAP(
        {
          "trap495820":"trap495820",
          "%location":{},
          "%tag":"trap495820"
        },
        hh.FORK(
          {
            "%location":{},
            "%tag":"fork"
          },
          hh.SEQUENCE( // sequence 1
            {
              "%location":{},
              "%tag":"seq"
            },
            hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },
              hh.SEQUENCE(
                {
                  "%location":{},
                  "%tag":"seq"
                },
                hh.RUN(
                  {
                    "%location":{"filename":"","pos":1},
                    "%tag":"run",
                    "module": Percu, //{"filename":"","pos":2},
                    "autocomplete":true,
                    "stopReservoir":"stop495820"
                  }
                ),
              ),

          )
        ),
        hh.SEQUENCE(
          {
            "%location":{},
            "%tag":"seq"
          },
          hh.AWAIT(
              {
                "%location":{},
                "%tag":"await",
                "immediate":false,
                "apply":function (){return ((() => {
                  const tick =this["tick"];
                  return tick.now;})());},
                "countapply":function (){return 5;}
            },
            hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
          ),
          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              //"stopReservoir":"stopReservoir",
              "stop495820" : "stop495820",
              "apply":function (){
                return ((() => {
                  //const stopReservoir = this["stopReservoir"];
                  const stop495820 = this["stop495820"];
                  return 0;
                })());
              }
            },
            hh.SIGACCESS({
              //"signame":"stopReservoir",
              "signame":"stop495820",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ), // Fin emit

          hh.PAUSE(
            {
              "%location":{},
              "%tag":"yield"
            }
          ),

          hh.EXIT(
          {
            "trap495820":"trap495820",
            "%location":{},
            "%tag":"break"
          }), // Exit
        ) // sequence
      ), // fork
    ), // trap

    hh.PAUSE(
      {
        "%location":{},
        "%tag":"yield"
      }
    )
  ),

    hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          var msg = {
            type: 'alertInfoScoreOFF',
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.cleanQueue(5);
          }
        }
      ),

        hh.FORK(
            {
              "%location":{},
              "%tag":"fork"
            },


          hh.SEQUENCE(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                "%tag":"seq"
              },


          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "StartTransSaxo":"StartTransSaxo",
              "apply":function (){
                return ((() => {
                  //const StartTransSaxo=this["StartTransSaxo"];
                  return 0;
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"StartTransSaxo",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),

      hh.LOCAL(
        {
          "%location":{},
          "%tag":"signal"
        },
        hh.SIGNAL({
          "name":"stop908522"
        }),

          hh.TRAP(
            {
              "trap908522":"trap908522",
              "%location":{},
              "%tag":"trap908522"
            },
            hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },
              hh.SEQUENCE( // sequence 1
                {
                  "%location":{},
                  "%tag":"seq"
                },
                hh.FORK(
                  {
                    "%location":{},
                    "%tag":"fork"
                  },
                  hh.SEQUENCE(
                    {
                      "%location":{},
                      "%tag":"seq"
                    },
                    hh.RUN(
                      {
                        "%location":{"filename":"","pos":1},
                        "%tag":"run",
                        "module": Saxo, //{"filename":"","pos":2},
                        "autocomplete":true,
                        "stopReservoir":"stop908522"
                      }
                    ),
                  ),

              )
            ),
            hh.SEQUENCE(
              {
                "%location":{},
                "%tag":"seq"
              },
              hh.AWAIT(
                  {
                    "%location":{},
                    "%tag":"await",
                    "immediate":false,
                    "apply":function (){return ((() => {
                      const tick =this["tick"];
                      return tick.now;})());},
                    "countapply":function (){return 50;}
                },
                hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
              ),
              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  //"stopReservoir":"stopReservoir",
                  "stop908522" : "stop908522",
                  "apply":function (){
                    return ((() => {
                      //const stopReservoir = this["stopReservoir"];
                      const stop908522 = this["stop908522"];
                      return 0;
                    })());
                  }
                },
                hh.SIGACCESS({
                  //"signame":"stopReservoir",
                  "signame":"stop908522",
                  "pre":true,
                  "val":true,
                  "cnt":false
                })
              ), // Fin emit

              hh.PAUSE(
                {
                  "%location":{},
                  "%tag":"yield"
                }
              ),

              hh.EXIT(
              {
                "trap908522":"trap908522",
                "%location":{},
                "%tag":"break"
              }), // Exit
            ) // sequence
          ), // fork
        ), // trap

        hh.PAUSE(
          {
            "%location":{},
            "%tag":"yield"
          }
        )
      ),

      ),


    hh.ABORT(
      {
        "%location":{abort: tick},
        "%tag":"abort",
        "immediate":false,
        "apply": function (){return ((() => {
            const tick=this["tick"];
            return tick.now;
        })());},
        "countapply":function (){ return 50;}
      },
      hh.SIGACCESS({
        "signame":"tick",
        "pre":false,
        "val":false,
        "cnt":false
      }),

      hh.RUN({
        "%location":{},
        "%tag":"run",
        "module": TransSaxo,
        "tick":"",
        "StartTransSaxo":"",

      }),

    ),

    ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.cleanQueue(2);
          }
        }
      ),

  hh.LOCAL(
    {
      "%location":{},
      "%tag":"signal"
    },
    hh.SIGNAL({
      "name":"stop562346"
    }),

      hh.TRAP(
        {
          "trap562346":"trap562346",
          "%location":{},
          "%tag":"trap562346"
        },
        hh.FORK(
          {
            "%location":{},
            "%tag":"fork"
          },
          hh.SEQUENCE( // sequence 1
            {
              "%location":{},
              "%tag":"seq"
            },
            hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },
              hh.SEQUENCE(
                {
                  "%location":{},
                  "%tag":"seq"
                },
                hh.RUN(
                  {
                    "%location":{"filename":"","pos":1},
                    "%tag":"run",
                    "module": Percu, //{"filename":"","pos":2},
                    "autocomplete":true,
                    "stopReservoir":"stop562346"
                  }
                ),
              ),

          )
        ),
        hh.SEQUENCE(
          {
            "%location":{},
            "%tag":"seq"
          },
          hh.AWAIT(
              {
                "%location":{},
                "%tag":"await",
                "immediate":false,
                "apply":function (){return ((() => {
                  const tick =this["tick"];
                  return tick.now;})());},
                "countapply":function (){return 5;}
            },
            hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
          ),
          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              //"stopReservoir":"stopReservoir",
              "stop562346" : "stop562346",
              "apply":function (){
                return ((() => {
                  //const stopReservoir = this["stopReservoir"];
                  const stop562346 = this["stop562346"];
                  return 0;
                })());
              }
            },
            hh.SIGACCESS({
              //"signame":"stopReservoir",
              "signame":"stop562346",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ), // Fin emit

          hh.PAUSE(
            {
              "%location":{},
              "%tag":"yield"
            }
          ),

          hh.EXIT(
          {
            "trap562346":"trap562346",
            "%location":{},
            "%tag":"break"
          }), // Exit
        ) // sequence
      ), // fork
    ), // trap

    hh.PAUSE(
      {
        "%location":{},
        "%tag":"yield"
      }
    )
  ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.cleanQueue(5);
          }
        }
      ),

        hh.FORK(
            {
              "%location":{},
              "%tag":"fork"
            },


    hh.LOCAL(
      {
        "%location":{},
        "%tag":"signal"
      },
      hh.SIGNAL({
        "name":"stop993257"
      }),

        hh.TRAP(
          {
            "trap993257":"trap993257",
            "%location":{},
            "%tag":"trap993257"
          },
          hh.FORK(
            {
              "%location":{},
              "%tag":"fork"
            },
            hh.SEQUENCE( // sequence 1
              {
                "%location":{},
                "%tag":"seq"
              },
              hh.FORK(
                {
                  "%location":{},
                  "%tag":"fork"
                },
                hh.SEQUENCE(
                  {
                    "%location":{},
                    "%tag":"seq"
                  },
                  hh.RUN(
                    {
                      "%location":{"filename":"","pos":1},
                      "%tag":"run",
                      "module": Flute, //{"filename":"","pos":2},
                      "autocomplete":true,
                      "stopReservoir":"stop993257"
                    }
                  ),
                ),

            )
          ),
          hh.SEQUENCE(
            {
              "%location":{},
              "%tag":"seq"
            },
            hh.AWAIT(
                {
                  "%location":{},
                  "%tag":"await",
                  "immediate":false,
                  "apply":function (){return ((() => {
                    const tick =this["tick"];
                    return tick.now;})());},
                  "countapply":function (){return 40;}
              },
              hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
            ),
            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                //"stopReservoir":"stopReservoir",
                "stop993257" : "stop993257",
                "apply":function (){
                  return ((() => {
                    //const stopReservoir = this["stopReservoir"];
                    const stop993257 = this["stop993257"];
                    return 0;
                  })());
                }
              },
              hh.SIGACCESS({
                //"signame":"stopReservoir",
                "signame":"stop993257",
                "pre":true,
                "val":true,
                "cnt":false
              })
            ), // Fin emit

            hh.PAUSE(
              {
                "%location":{},
                "%tag":"yield"
              }
            ),

            hh.EXIT(
            {
              "trap993257":"trap993257",
              "%location":{},
              "%tag":"break"
            }), // Exit
          ) // sequence
        ), // fork
      ), // trap

      hh.PAUSE(
        {
          "%location":{},
          "%tag":"yield"
        }
      )
    ),


    hh.ABORT(
      {
        "%location":{abort: tick},
        "%tag":"abort",
        "immediate":false,
        "apply": function (){return ((() => {
            const tick=this["tick"];
            return tick.now;
        })());},
        "countapply":function (){ return 40;}
      },
      hh.SIGACCESS({
        "signame":"tick",
        "pre":false,
        "val":false,
        "cnt":false
      }),

      hh.ABORT(
        {
          "%location":{abort:stopMoveTempo},
          "%tag":"abort",
          "immediate":false,
          "apply": function (){return ((() => {
              const stopMoveTempo =this["stopMoveTempo"];
              return stopMoveTempo.now;
          })());},
        },
        hh.SIGACCESS({
          "signame":"stopMoveTempo",
          "pre":false,
          "val":false,
          "cnt":false
        }),
        hh.EVERY(
          {
            "%location":{every: tick},
            "%tag":"do/every",
            "immediate":false,
            "apply": function (){return ((() => {
                const tick=this["tick"];
                return tick.now;
            })());},
            "countapply":function (){ return  1;}
          },
          hh.SIGACCESS({
            "signame":"tick",
            "pre":false,
            "val":false,
            "cnt":false
          }),
          hh.ATOM(
            {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                moveTempo(2, 5);
              }
            }
          )
        )
      ),


    ),

    ),

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          DAW.putPatternInQueue('Percu4');
        }
      }
    ),

      hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "MassiveOUT": "MassiveOUT",
          "apply":function (){
            return ((() => {
              const MassiveOUT = this["MassiveOUT"];
              return [false,255];
            })());
          }
        },
        hh.SIGACCESS({
          "signame": "MassiveOUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
      ),
      hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () { gcs.informSelecteurOnMenuChange(255 , "MassiveOUT",false); }
        }
    ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.cleanQueue(6);
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.cleanQueue(8);
          }
        }
      ),

          ),
          hh.SEQUENCE(
          {"%location":{},"%tag":"fork"},
          hh.EVERY(
            {
              "%location":{},
              "%tag":"every",
              "immediate":false,
              "apply": function (){return ((() => {
                    const tick = this["tick"];
                    return tick.now;
              })());},
            },
            hh.SIGACCESS({
                "signame":"tick",
                "pre":false,
                "val":false,
                "cnt":false
            }),
              hh.ATOM(
                {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {
                    gcs.setTickOnControler(tickCounter);
                    tickCounter++;
                  }
                }
              )
            )
          )
        )
      )
    )
  );

    if(debug) console.log("orchestrationHH.mjs: setSignals", param.groupesDesSons);
    var machine = new hh.ReactiveMachine( orchestration, {sweep:true, tracePropagation: false, traceReactDuration: false});
    console.log("INFO: setSignals: Number of nets in Orchestration:",machine.nets.length);
    return machine;
  }
