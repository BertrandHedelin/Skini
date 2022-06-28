var Piano, Violons, Piano1Intro1, Piano1Intro2, Piano1Intro3, Piano1Intro4, Piano1Intro5, Piano1Milieu1, Piano1Milieu2, Piano1Milieu3, Piano1Milieu4, Piano1Milieu5, Piano1Milieu6, Piano1Milieu7, Piano1Fin1, Piano1Fin2, Piano1Fin3, Piano1Fin4, Piano1Fin5, Trompette, ViolonsIntro1, ViolonsIntro2, ViolonsIntro3, ViolonsIntro4, ViolonsIntro5, ViolonsIntro6, ViolonsMilieu1, ViolonsMilieu2, ViolonsMilieu3, ViolonsMilieu4, ViolonsFin1, ViolonsFin2, ViolonsFin3, ViolonsFin4, ViolonsFin5, Cors, RiseHit, Trompette1, Trompette2, Trompette3, Trompette4, Trompette5, Trompette6, Trompette7, Trompette8, Trompette9, Flute, Cors1, Cors2, Cors3, Cors4, Bassons, FluteDebut1, FluteDebut2, FluteDebut3, FluteDebut4, FluteMilieu1, FluteMilieu2, FluteMilieu3, FluteFin1, FluteFin2, FluteFin3, FluteFin4, FluteFin5, FluteFin6, FluteNeutre1, FluteNeutre2, FluteNeutre3, Percu, BassonDebut1, BassonDebut2, BassonDebut3, BassonDebut4, BassonMilieu1, BassonMilieu2, BassonMilieu3, BassonMilieu4, BassonMilieu5, BassonNeutre1, BassonNeutre2, Clarinette, Percu1, Percu2, Percu3, Percu4, Percu5, Percu6, Percu7, ClarinetteDebut1, ClarinetteDebut2, ClarinetteDebut3, ClarinetteMilieu1, ClarinetteMilieu2, ClarinetteMilieu3, ClarinetteMilieu4, ClarinetteMilieu5, ClarinetteFin1, ClarinetteFin2, ClarinetteFin3, NappeCello, NappeViolons, NappeCTB, NappeCTBRythme, NappeAlto, tick, S1Action, NappeCelloRythme, S2Action;


// Sur la base d'Opus5 avec Hop/HipHop. On utilise la session Ableton Live Opus5

"use strict";
var hh = require("../hiphop/hiphop.js");

// C'est la seule façon d'échanger les paramètres nécessaires à la compilation
// lors de la création des signaux.
var par = require('../serveur/skiniParametres');

var midimix;
var oscMidiLocal;

var gcs;
var DAW;
var serveur;

var debug = false;
var debug1 = true;

// Avec des valeurs initiales
var CCChannel = 1;
var CCTempo = 100;
var tempoMax = 160;
var tempoMin = 40;
var tempoGlobal = 60;

function setServ(ser, daw, groupeCS, oscMidi, mix){
  //console.log("hh_ORCHESTRATION: setServ");
  DAW = daw;
  serveur = ser;
  gcs = groupeCS;
  oscMidiLocal = oscMidi;
  midimix = mix;
}
exports.setServ = setServ;

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

for (var i=0; i < par.groupesDesSons.length; i++) {
  var signalName = par.groupesDesSons[i][0] + "OUT";

  if(debug) console.log("Signal Orchestration:", signalName);

  var signal = hh.SIGNAL({
    "%location":{},
    "direction":"OUT",
    "name":signalName,
    "init_func":function (){return [false, -1];}
  });
  signals.push(signal);
}

// Création des signaux IN de sélection de patterns
for (var i=0; i < par.groupesDesSons.length; i++) {
  var signalName = par.groupesDesSons[i][0] + "IN";

  if(debug) console.log("Signal Orchestration:", signalName);

  var signal = hh.SIGNAL({
    "%location":{},
    "direction":"IN",
    "name":signalName
  });
  signals.push(signal);
}

function setSignals(){
  var machine = new hh.ReactiveMachine( orchestration, {sweep:true});
  console.log("Number of nets in Orchestration:",machine.nets.length);
  return machine;
}
exports.setSignals = setSignals;


    // Module tank Piano + Piano1Intro1
    Piano = hh.MODULE({"id":"Piano","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Intro1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Intro2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Intro3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Intro4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Piano1Intro5IN"}),
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
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Intro1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Intro2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Intro3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Intro4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Piano1Intro5OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "Piano1Intro1" );
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Intro1OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Intro2OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Intro3OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Intro4OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Intro5OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Milieu1OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Milieu2OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Milieu3OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Milieu4OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Milieu5OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Milieu6OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Milieu7OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Fin1OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Fin2OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Fin3OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Fin4OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Fin5OUT", true);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Intro1OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Intro2OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Intro3OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Intro4OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Intro5OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Intro5
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Milieu1OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Milieu2OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Milieu3OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Milieu4OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Milieu5OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Milieu6OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Milieu7OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Fin1OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Fin2OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Fin3OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Fin4OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Piano1Fin5OUT", false);
              }
            }
          )
        ) // Fin sequence pour Piano1Fin5
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
          "Piano1Milieu1OUT":"Piano1Milieu1OUT",
          "apply":function (){
            return ((() => {
              const Piano1Milieu1 = this["Piano1Milieu1OUT"];
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Piano1Fin5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Piano1Fin5OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "Piano1Intro1", false);
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

    // Module tank Violons + ViolonsIntro1
    Violons = hh.MODULE({"id":"Violons","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ViolonsIntro1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ViolonsIntro2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ViolonsIntro3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ViolonsIntro4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ViolonsIntro5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ViolonsIntro6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ViolonsMilieu1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ViolonsMilieu2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ViolonsMilieu3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ViolonsMilieu4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ViolonsFin1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ViolonsFin2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ViolonsFin3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ViolonsFin4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ViolonsFin5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ViolonsIntro1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ViolonsIntro2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ViolonsIntro3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ViolonsIntro4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ViolonsIntro5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ViolonsIntro6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ViolonsMilieu1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ViolonsMilieu2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ViolonsMilieu3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ViolonsMilieu4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ViolonsFin1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ViolonsFin2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ViolonsFin3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ViolonsFin4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ViolonsFin5OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "ViolonsIntro1" );
                var msg = {
                  type: 'startTank',
                  value:  "ViolonsIntro1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ViolonsIntro1OUT":"ViolonsIntro1OUT",
                "apply":function (){
                  return ((() => {
                    const ViolonsIntro1 = this["ViolonsIntro1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ViolonsIntro1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ViolonsIntro1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ViolonsIntro1OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsIntro1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ViolonsIntro2OUT":"ViolonsIntro2OUT",
                "apply":function (){
                  return ((() => {
                    const ViolonsIntro2 = this["ViolonsIntro2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ViolonsIntro2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ViolonsIntro2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ViolonsIntro2OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsIntro2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ViolonsIntro3OUT":"ViolonsIntro3OUT",
                "apply":function (){
                  return ((() => {
                    const ViolonsIntro3 = this["ViolonsIntro3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ViolonsIntro3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ViolonsIntro3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ViolonsIntro3OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsIntro3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ViolonsIntro4OUT":"ViolonsIntro4OUT",
                "apply":function (){
                  return ((() => {
                    const ViolonsIntro4 = this["ViolonsIntro4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ViolonsIntro4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ViolonsIntro4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ViolonsIntro4OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsIntro4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ViolonsIntro5OUT":"ViolonsIntro5OUT",
                "apply":function (){
                  return ((() => {
                    const ViolonsIntro5 = this["ViolonsIntro5OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ViolonsIntro5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ViolonsIntro5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ViolonsIntro5OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsIntro5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ViolonsIntro6OUT":"ViolonsIntro6OUT",
                "apply":function (){
                  return ((() => {
                    const ViolonsIntro6 = this["ViolonsIntro6OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ViolonsIntro6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ViolonsIntro6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ViolonsIntro6OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsIntro6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ViolonsMilieu1OUT":"ViolonsMilieu1OUT",
                "apply":function (){
                  return ((() => {
                    const ViolonsMilieu1 = this["ViolonsMilieu1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ViolonsMilieu1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ViolonsMilieu1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ViolonsMilieu1OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsMilieu1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ViolonsMilieu2OUT":"ViolonsMilieu2OUT",
                "apply":function (){
                  return ((() => {
                    const ViolonsMilieu2 = this["ViolonsMilieu2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ViolonsMilieu2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ViolonsMilieu2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ViolonsMilieu2OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsMilieu2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ViolonsMilieu3OUT":"ViolonsMilieu3OUT",
                "apply":function (){
                  return ((() => {
                    const ViolonsMilieu3 = this["ViolonsMilieu3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ViolonsMilieu3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ViolonsMilieu3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ViolonsMilieu3OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsMilieu3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ViolonsMilieu4OUT":"ViolonsMilieu4OUT",
                "apply":function (){
                  return ((() => {
                    const ViolonsMilieu4 = this["ViolonsMilieu4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ViolonsMilieu4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ViolonsMilieu4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ViolonsMilieu4OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsMilieu4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ViolonsFin1OUT":"ViolonsFin1OUT",
                "apply":function (){
                  return ((() => {
                    const ViolonsFin1 = this["ViolonsFin1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ViolonsFin1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ViolonsFin1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ViolonsFin1OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsFin1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ViolonsFin2OUT":"ViolonsFin2OUT",
                "apply":function (){
                  return ((() => {
                    const ViolonsFin2 = this["ViolonsFin2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ViolonsFin2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ViolonsFin2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ViolonsFin2OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsFin2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ViolonsFin3OUT":"ViolonsFin3OUT",
                "apply":function (){
                  return ((() => {
                    const ViolonsFin3 = this["ViolonsFin3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ViolonsFin3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ViolonsFin3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ViolonsFin3OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsFin3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ViolonsFin4OUT":"ViolonsFin4OUT",
                "apply":function (){
                  return ((() => {
                    const ViolonsFin4 = this["ViolonsFin4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ViolonsFin4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ViolonsFin4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ViolonsFin4OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsFin4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ViolonsFin5OUT":"ViolonsFin5OUT",
                "apply":function (){
                  return ((() => {
                    const ViolonsFin5 = this["ViolonsFin5OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ViolonsFin5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ViolonsFin5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ViolonsFin5OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsFin5OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:ViolonsIntro1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour ViolonsIntro1
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
                  const ViolonsIntro1IN  =this["ViolonsIntro1IN"];
                  return ViolonsIntro1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ViolonsIntro1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ViolonsIntro1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ViolonsIntro1OUT" : "ViolonsIntro1OUT",
              "apply":function (){
                return ((() => {
                  const ViolonsIntro1OUT = this["ViolonsIntro1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ViolonsIntro1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ViolonsIntro1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ViolonsIntro1OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsIntro1OUT", false);
              }
            }
          )
        ) // Fin sequence pour ViolonsIntro1
  ,
        hh.SEQUENCE( // Debut sequence pour ViolonsIntro2
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
                  const ViolonsIntro2IN  =this["ViolonsIntro2IN"];
                  return ViolonsIntro2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ViolonsIntro2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ViolonsIntro2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ViolonsIntro2OUT" : "ViolonsIntro2OUT",
              "apply":function (){
                return ((() => {
                  const ViolonsIntro2OUT = this["ViolonsIntro2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ViolonsIntro2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ViolonsIntro2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ViolonsIntro2OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsIntro2OUT", false);
              }
            }
          )
        ) // Fin sequence pour ViolonsIntro2
  ,
        hh.SEQUENCE( // Debut sequence pour ViolonsIntro3
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
                  const ViolonsIntro3IN  =this["ViolonsIntro3IN"];
                  return ViolonsIntro3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ViolonsIntro3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ViolonsIntro3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ViolonsIntro3OUT" : "ViolonsIntro3OUT",
              "apply":function (){
                return ((() => {
                  const ViolonsIntro3OUT = this["ViolonsIntro3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ViolonsIntro3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ViolonsIntro3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ViolonsIntro3OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsIntro3OUT", false);
              }
            }
          )
        ) // Fin sequence pour ViolonsIntro3
  ,
        hh.SEQUENCE( // Debut sequence pour ViolonsIntro4
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
                  const ViolonsIntro4IN  =this["ViolonsIntro4IN"];
                  return ViolonsIntro4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ViolonsIntro4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ViolonsIntro4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ViolonsIntro4OUT" : "ViolonsIntro4OUT",
              "apply":function (){
                return ((() => {
                  const ViolonsIntro4OUT = this["ViolonsIntro4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ViolonsIntro4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ViolonsIntro4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ViolonsIntro4OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsIntro4OUT", false);
              }
            }
          )
        ) // Fin sequence pour ViolonsIntro4
  ,
        hh.SEQUENCE( // Debut sequence pour ViolonsIntro5
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
                  const ViolonsIntro5IN  =this["ViolonsIntro5IN"];
                  return ViolonsIntro5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ViolonsIntro5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ViolonsIntro5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ViolonsIntro5OUT" : "ViolonsIntro5OUT",
              "apply":function (){
                return ((() => {
                  const ViolonsIntro5OUT = this["ViolonsIntro5OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ViolonsIntro5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ViolonsIntro5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ViolonsIntro5OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsIntro5OUT", false);
              }
            }
          )
        ) // Fin sequence pour ViolonsIntro5
  ,
        hh.SEQUENCE( // Debut sequence pour ViolonsIntro6
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
                  const ViolonsIntro6IN  =this["ViolonsIntro6IN"];
                  return ViolonsIntro6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ViolonsIntro6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ViolonsIntro6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ViolonsIntro6OUT" : "ViolonsIntro6OUT",
              "apply":function (){
                return ((() => {
                  const ViolonsIntro6OUT = this["ViolonsIntro6OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ViolonsIntro6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ViolonsIntro6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ViolonsIntro6OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsIntro6OUT", false);
              }
            }
          )
        ) // Fin sequence pour ViolonsIntro6
  ,
        hh.SEQUENCE( // Debut sequence pour ViolonsMilieu1
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
                  const ViolonsMilieu1IN  =this["ViolonsMilieu1IN"];
                  return ViolonsMilieu1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ViolonsMilieu1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ViolonsMilieu1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ViolonsMilieu1OUT" : "ViolonsMilieu1OUT",
              "apply":function (){
                return ((() => {
                  const ViolonsMilieu1OUT = this["ViolonsMilieu1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ViolonsMilieu1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ViolonsMilieu1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ViolonsMilieu1OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsMilieu1OUT", false);
              }
            }
          )
        ) // Fin sequence pour ViolonsMilieu1
  ,
        hh.SEQUENCE( // Debut sequence pour ViolonsMilieu2
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
                  const ViolonsMilieu2IN  =this["ViolonsMilieu2IN"];
                  return ViolonsMilieu2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ViolonsMilieu2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ViolonsMilieu2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ViolonsMilieu2OUT" : "ViolonsMilieu2OUT",
              "apply":function (){
                return ((() => {
                  const ViolonsMilieu2OUT = this["ViolonsMilieu2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ViolonsMilieu2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ViolonsMilieu2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ViolonsMilieu2OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsMilieu2OUT", false);
              }
            }
          )
        ) // Fin sequence pour ViolonsMilieu2
  ,
        hh.SEQUENCE( // Debut sequence pour ViolonsMilieu3
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
                  const ViolonsMilieu3IN  =this["ViolonsMilieu3IN"];
                  return ViolonsMilieu3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ViolonsMilieu3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ViolonsMilieu3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ViolonsMilieu3OUT" : "ViolonsMilieu3OUT",
              "apply":function (){
                return ((() => {
                  const ViolonsMilieu3OUT = this["ViolonsMilieu3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ViolonsMilieu3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ViolonsMilieu3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ViolonsMilieu3OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsMilieu3OUT", false);
              }
            }
          )
        ) // Fin sequence pour ViolonsMilieu3
  ,
        hh.SEQUENCE( // Debut sequence pour ViolonsMilieu4
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
                  const ViolonsMilieu4IN  =this["ViolonsMilieu4IN"];
                  return ViolonsMilieu4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ViolonsMilieu4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ViolonsMilieu4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ViolonsMilieu4OUT" : "ViolonsMilieu4OUT",
              "apply":function (){
                return ((() => {
                  const ViolonsMilieu4OUT = this["ViolonsMilieu4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ViolonsMilieu4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ViolonsMilieu4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ViolonsMilieu4OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsMilieu4OUT", false);
              }
            }
          )
        ) // Fin sequence pour ViolonsMilieu4
  ,
        hh.SEQUENCE( // Debut sequence pour ViolonsFin1
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
                  const ViolonsFin1IN  =this["ViolonsFin1IN"];
                  return ViolonsFin1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ViolonsFin1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ViolonsFin1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ViolonsFin1OUT" : "ViolonsFin1OUT",
              "apply":function (){
                return ((() => {
                  const ViolonsFin1OUT = this["ViolonsFin1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ViolonsFin1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ViolonsFin1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ViolonsFin1OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsFin1OUT", false);
              }
            }
          )
        ) // Fin sequence pour ViolonsFin1
  ,
        hh.SEQUENCE( // Debut sequence pour ViolonsFin2
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
                  const ViolonsFin2IN  =this["ViolonsFin2IN"];
                  return ViolonsFin2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ViolonsFin2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ViolonsFin2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ViolonsFin2OUT" : "ViolonsFin2OUT",
              "apply":function (){
                return ((() => {
                  const ViolonsFin2OUT = this["ViolonsFin2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ViolonsFin2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ViolonsFin2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ViolonsFin2OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsFin2OUT", false);
              }
            }
          )
        ) // Fin sequence pour ViolonsFin2
  ,
        hh.SEQUENCE( // Debut sequence pour ViolonsFin3
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
                  const ViolonsFin3IN  =this["ViolonsFin3IN"];
                  return ViolonsFin3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ViolonsFin3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ViolonsFin3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ViolonsFin3OUT" : "ViolonsFin3OUT",
              "apply":function (){
                return ((() => {
                  const ViolonsFin3OUT = this["ViolonsFin3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ViolonsFin3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ViolonsFin3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ViolonsFin3OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsFin3OUT", false);
              }
            }
          )
        ) // Fin sequence pour ViolonsFin3
  ,
        hh.SEQUENCE( // Debut sequence pour ViolonsFin4
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
                  const ViolonsFin4IN  =this["ViolonsFin4IN"];
                  return ViolonsFin4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ViolonsFin4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ViolonsFin4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ViolonsFin4OUT" : "ViolonsFin4OUT",
              "apply":function (){
                return ((() => {
                  const ViolonsFin4OUT = this["ViolonsFin4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ViolonsFin4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ViolonsFin4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ViolonsFin4OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsFin4OUT", false);
              }
            }
          )
        ) // Fin sequence pour ViolonsFin4
  ,
        hh.SEQUENCE( // Debut sequence pour ViolonsFin5
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
                  const ViolonsFin5IN  =this["ViolonsFin5IN"];
                  return ViolonsFin5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ViolonsFin5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ViolonsFin5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ViolonsFin5OUT" : "ViolonsFin5OUT",
              "apply":function (){
                return ((() => {
                  const ViolonsFin5OUT = this["ViolonsFin5OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ViolonsFin5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ViolonsFin5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ViolonsFin5OUT");
                gcs.informSelecteurOnMenuChange(255 , "ViolonsFin5OUT", false);
              }
            }
          )
        ) // Fin sequence pour ViolonsFin5
      ), // Fin fork de make await avec en premiere position:ViolonsIntro1
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
          "ViolonsIntro1OUT":"ViolonsIntro1OUT",
          "apply":function (){
            return ((() => {
              const ViolonsIntro1 = this["ViolonsIntro1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ViolonsIntro1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ViolonsIntro1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ViolonsIntro2OUT":"ViolonsIntro2OUT",
          "apply":function (){
            return ((() => {
              const ViolonsIntro2 = this["ViolonsIntro2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ViolonsIntro2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ViolonsIntro2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ViolonsIntro3OUT":"ViolonsIntro3OUT",
          "apply":function (){
            return ((() => {
              const ViolonsIntro3 = this["ViolonsIntro3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ViolonsIntro3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ViolonsIntro3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ViolonsIntro4OUT":"ViolonsIntro4OUT",
          "apply":function (){
            return ((() => {
              const ViolonsIntro4 = this["ViolonsIntro4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ViolonsIntro4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ViolonsIntro4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ViolonsIntro5OUT":"ViolonsIntro5OUT",
          "apply":function (){
            return ((() => {
              const ViolonsIntro5 = this["ViolonsIntro5OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ViolonsIntro5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ViolonsIntro5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ViolonsIntro6OUT":"ViolonsIntro6OUT",
          "apply":function (){
            return ((() => {
              const ViolonsIntro6 = this["ViolonsIntro6OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ViolonsIntro6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ViolonsIntro6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ViolonsMilieu1OUT":"ViolonsMilieu1OUT",
          "apply":function (){
            return ((() => {
              const ViolonsMilieu1 = this["ViolonsMilieu1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ViolonsMilieu1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ViolonsMilieu1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ViolonsMilieu2OUT":"ViolonsMilieu2OUT",
          "apply":function (){
            return ((() => {
              const ViolonsMilieu2 = this["ViolonsMilieu2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ViolonsMilieu2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ViolonsMilieu2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ViolonsMilieu3OUT":"ViolonsMilieu3OUT",
          "apply":function (){
            return ((() => {
              const ViolonsMilieu3 = this["ViolonsMilieu3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ViolonsMilieu3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ViolonsMilieu3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ViolonsMilieu4OUT":"ViolonsMilieu4OUT",
          "apply":function (){
            return ((() => {
              const ViolonsMilieu4 = this["ViolonsMilieu4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ViolonsMilieu4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ViolonsMilieu4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ViolonsFin1OUT":"ViolonsFin1OUT",
          "apply":function (){
            return ((() => {
              const ViolonsFin1 = this["ViolonsFin1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ViolonsFin1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ViolonsFin1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ViolonsFin2OUT":"ViolonsFin2OUT",
          "apply":function (){
            return ((() => {
              const ViolonsFin2 = this["ViolonsFin2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ViolonsFin2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ViolonsFin2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ViolonsFin3OUT":"ViolonsFin3OUT",
          "apply":function (){
            return ((() => {
              const ViolonsFin3 = this["ViolonsFin3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ViolonsFin3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ViolonsFin3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ViolonsFin4OUT":"ViolonsFin4OUT",
          "apply":function (){
            return ((() => {
              const ViolonsFin4 = this["ViolonsFin4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ViolonsFin4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ViolonsFin4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ViolonsFin5OUT":"ViolonsFin5OUT",
          "apply":function (){
            return ((() => {
              const ViolonsFin5 = this["ViolonsFin5OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ViolonsFin5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ViolonsFin5OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "ViolonsIntro1", false);
            console.log("--- FIN RESERVOIR:", "ViolonsIntro1");
            var msg = {
            type: 'killTank',
            value:  "ViolonsIntro1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank Trompette + Trompette1
    Trompette = hh.MODULE({"id":"Trompette","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Trompette1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Trompette2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Trompette3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Trompette4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Trompette5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Trompette6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Trompette7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Trompette8IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Trompette9IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Trompette1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Trompette2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Trompette3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Trompette4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Trompette5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Trompette6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Trompette7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Trompette8OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Trompette9OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "Trompette1" );
                var msg = {
                  type: 'startTank',
                  value:  "Trompette1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Trompette1OUT":"Trompette1OUT",
                "apply":function (){
                  return ((() => {
                    const Trompette1 = this["Trompette1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Trompette1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Trompette1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Trompette1OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Trompette2OUT":"Trompette2OUT",
                "apply":function (){
                  return ((() => {
                    const Trompette2 = this["Trompette2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Trompette2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Trompette2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Trompette2OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Trompette3OUT":"Trompette3OUT",
                "apply":function (){
                  return ((() => {
                    const Trompette3 = this["Trompette3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Trompette3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Trompette3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Trompette3OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Trompette4OUT":"Trompette4OUT",
                "apply":function (){
                  return ((() => {
                    const Trompette4 = this["Trompette4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Trompette4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Trompette4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Trompette4OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Trompette5OUT":"Trompette5OUT",
                "apply":function (){
                  return ((() => {
                    const Trompette5 = this["Trompette5OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Trompette5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Trompette5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Trompette5OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Trompette6OUT":"Trompette6OUT",
                "apply":function (){
                  return ((() => {
                    const Trompette6 = this["Trompette6OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Trompette6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Trompette6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Trompette6OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Trompette7OUT":"Trompette7OUT",
                "apply":function (){
                  return ((() => {
                    const Trompette7 = this["Trompette7OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Trompette7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Trompette7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Trompette7OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette7OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Trompette8OUT":"Trompette8OUT",
                "apply":function (){
                  return ((() => {
                    const Trompette8 = this["Trompette8OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Trompette8OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Trompette8OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Trompette8OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette8OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Trompette9OUT":"Trompette9OUT",
                "apply":function (){
                  return ((() => {
                    const Trompette9 = this["Trompette9OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Trompette9OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Trompette9OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Trompette9OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette9OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:Trompette1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour Trompette1
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
                  const Trompette1IN  =this["Trompette1IN"];
                  return Trompette1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Trompette1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Trompette1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Trompette1OUT" : "Trompette1OUT",
              "apply":function (){
                return ((() => {
                  const Trompette1OUT = this["Trompette1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Trompette1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Trompette1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Trompette1OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette1OUT", false);
              }
            }
          )
        ) // Fin sequence pour Trompette1
  ,
        hh.SEQUENCE( // Debut sequence pour Trompette2
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
                  const Trompette2IN  =this["Trompette2IN"];
                  return Trompette2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Trompette2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Trompette2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Trompette2OUT" : "Trompette2OUT",
              "apply":function (){
                return ((() => {
                  const Trompette2OUT = this["Trompette2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Trompette2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Trompette2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Trompette2OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette2OUT", false);
              }
            }
          )
        ) // Fin sequence pour Trompette2
  ,
        hh.SEQUENCE( // Debut sequence pour Trompette3
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
                  const Trompette3IN  =this["Trompette3IN"];
                  return Trompette3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Trompette3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Trompette3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Trompette3OUT" : "Trompette3OUT",
              "apply":function (){
                return ((() => {
                  const Trompette3OUT = this["Trompette3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Trompette3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Trompette3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Trompette3OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette3OUT", false);
              }
            }
          )
        ) // Fin sequence pour Trompette3
  ,
        hh.SEQUENCE( // Debut sequence pour Trompette4
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
                  const Trompette4IN  =this["Trompette4IN"];
                  return Trompette4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Trompette4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Trompette4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Trompette4OUT" : "Trompette4OUT",
              "apply":function (){
                return ((() => {
                  const Trompette4OUT = this["Trompette4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Trompette4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Trompette4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Trompette4OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette4OUT", false);
              }
            }
          )
        ) // Fin sequence pour Trompette4
  ,
        hh.SEQUENCE( // Debut sequence pour Trompette5
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
                  const Trompette5IN  =this["Trompette5IN"];
                  return Trompette5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Trompette5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Trompette5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Trompette5OUT" : "Trompette5OUT",
              "apply":function (){
                return ((() => {
                  const Trompette5OUT = this["Trompette5OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Trompette5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Trompette5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Trompette5OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette5OUT", false);
              }
            }
          )
        ) // Fin sequence pour Trompette5
  ,
        hh.SEQUENCE( // Debut sequence pour Trompette6
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
                  const Trompette6IN  =this["Trompette6IN"];
                  return Trompette6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Trompette6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Trompette6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Trompette6OUT" : "Trompette6OUT",
              "apply":function (){
                return ((() => {
                  const Trompette6OUT = this["Trompette6OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Trompette6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Trompette6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Trompette6OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette6OUT", false);
              }
            }
          )
        ) // Fin sequence pour Trompette6
  ,
        hh.SEQUENCE( // Debut sequence pour Trompette7
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
                  const Trompette7IN  =this["Trompette7IN"];
                  return Trompette7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Trompette7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Trompette7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Trompette7OUT" : "Trompette7OUT",
              "apply":function (){
                return ((() => {
                  const Trompette7OUT = this["Trompette7OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Trompette7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Trompette7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Trompette7OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette7OUT", false);
              }
            }
          )
        ) // Fin sequence pour Trompette7
  ,
        hh.SEQUENCE( // Debut sequence pour Trompette8
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
                  const Trompette8IN  =this["Trompette8IN"];
                  return Trompette8IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Trompette8IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Trompette8IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Trompette8OUT" : "Trompette8OUT",
              "apply":function (){
                return ((() => {
                  const Trompette8OUT = this["Trompette8OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Trompette8OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Trompette8OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Trompette8OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette8OUT", false);
              }
            }
          )
        ) // Fin sequence pour Trompette8
  ,
        hh.SEQUENCE( // Debut sequence pour Trompette9
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
                  const Trompette9IN  =this["Trompette9IN"];
                  return Trompette9IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Trompette9IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Trompette9IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Trompette9OUT" : "Trompette9OUT",
              "apply":function (){
                return ((() => {
                  const Trompette9OUT = this["Trompette9OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Trompette9OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Trompette9OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Trompette9OUT");
                gcs.informSelecteurOnMenuChange(255 , "Trompette9OUT", false);
              }
            }
          )
        ) // Fin sequence pour Trompette9
      ), // Fin fork de make await avec en premiere position:Trompette1
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
          "Trompette1OUT":"Trompette1OUT",
          "apply":function (){
            return ((() => {
              const Trompette1 = this["Trompette1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Trompette1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Trompette1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Trompette2OUT":"Trompette2OUT",
          "apply":function (){
            return ((() => {
              const Trompette2 = this["Trompette2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Trompette2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Trompette2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Trompette3OUT":"Trompette3OUT",
          "apply":function (){
            return ((() => {
              const Trompette3 = this["Trompette3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Trompette3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Trompette3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Trompette4OUT":"Trompette4OUT",
          "apply":function (){
            return ((() => {
              const Trompette4 = this["Trompette4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Trompette4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Trompette4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Trompette5OUT":"Trompette5OUT",
          "apply":function (){
            return ((() => {
              const Trompette5 = this["Trompette5OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Trompette5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Trompette5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Trompette6OUT":"Trompette6OUT",
          "apply":function (){
            return ((() => {
              const Trompette6 = this["Trompette6OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Trompette6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Trompette6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Trompette7OUT":"Trompette7OUT",
          "apply":function (){
            return ((() => {
              const Trompette7 = this["Trompette7OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Trompette7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Trompette7OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Trompette8OUT":"Trompette8OUT",
          "apply":function (){
            return ((() => {
              const Trompette8 = this["Trompette8OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Trompette8OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Trompette8OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Trompette9OUT":"Trompette9OUT",
          "apply":function (){
            return ((() => {
              const Trompette9 = this["Trompette9OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Trompette9OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Trompette9OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "Trompette1", false);
            console.log("--- FIN RESERVOIR:", "Trompette1");
            var msg = {
            type: 'killTank',
            value:  "Trompette1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank Cors + Cors1
    Cors = hh.MODULE({"id":"Cors","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Cors1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Cors2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Cors3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"Cors4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Cors1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Cors2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Cors3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"Cors4OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "Cors1" );
                var msg = {
                  type: 'startTank',
                  value:  "Cors1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Cors1OUT":"Cors1OUT",
                "apply":function (){
                  return ((() => {
                    const Cors1 = this["Cors1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Cors1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Cors1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Cors1OUT");
                gcs.informSelecteurOnMenuChange(255 , "Cors1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Cors2OUT":"Cors2OUT",
                "apply":function (){
                  return ((() => {
                    const Cors2 = this["Cors2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Cors2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Cors2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Cors2OUT");
                gcs.informSelecteurOnMenuChange(255 , "Cors2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Cors3OUT":"Cors3OUT",
                "apply":function (){
                  return ((() => {
                    const Cors3 = this["Cors3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Cors3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Cors3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Cors3OUT");
                gcs.informSelecteurOnMenuChange(255 , "Cors3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "Cors4OUT":"Cors4OUT",
                "apply":function (){
                  return ((() => {
                    const Cors4 = this["Cors4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Cors4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit Cors4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "Cors4OUT");
                gcs.informSelecteurOnMenuChange(255 , "Cors4OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:Cors1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour Cors1
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
                  const Cors1IN  =this["Cors1IN"];
                  return Cors1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Cors1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Cors1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Cors1OUT" : "Cors1OUT",
              "apply":function (){
                return ((() => {
                  const Cors1OUT = this["Cors1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Cors1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Cors1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Cors1OUT");
                gcs.informSelecteurOnMenuChange(255 , "Cors1OUT", false);
              }
            }
          )
        ) // Fin sequence pour Cors1
  ,
        hh.SEQUENCE( // Debut sequence pour Cors2
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
                  const Cors2IN  =this["Cors2IN"];
                  return Cors2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Cors2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Cors2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Cors2OUT" : "Cors2OUT",
              "apply":function (){
                return ((() => {
                  const Cors2OUT = this["Cors2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Cors2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Cors2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Cors2OUT");
                gcs.informSelecteurOnMenuChange(255 , "Cors2OUT", false);
              }
            }
          )
        ) // Fin sequence pour Cors2
  ,
        hh.SEQUENCE( // Debut sequence pour Cors3
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
                  const Cors3IN  =this["Cors3IN"];
                  return Cors3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Cors3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Cors3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Cors3OUT" : "Cors3OUT",
              "apply":function (){
                return ((() => {
                  const Cors3OUT = this["Cors3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Cors3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Cors3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Cors3OUT");
                gcs.informSelecteurOnMenuChange(255 , "Cors3OUT", false);
              }
            }
          )
        ) // Fin sequence pour Cors3
  ,
        hh.SEQUENCE( // Debut sequence pour Cors4
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
                  const Cors4IN  =this["Cors4IN"];
                  return Cors4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"Cors4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await Cors4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "Cors4OUT" : "Cors4OUT",
              "apply":function (){
                return ((() => {
                  const Cors4OUT = this["Cors4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Cors4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit Cors4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "Cors4OUT");
                gcs.informSelecteurOnMenuChange(255 , "Cors4OUT", false);
              }
            }
          )
        ) // Fin sequence pour Cors4
      ), // Fin fork de make await avec en premiere position:Cors1
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
          "Cors1OUT":"Cors1OUT",
          "apply":function (){
            return ((() => {
              const Cors1 = this["Cors1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Cors1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Cors1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Cors2OUT":"Cors2OUT",
          "apply":function (){
            return ((() => {
              const Cors2 = this["Cors2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Cors2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Cors2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Cors3OUT":"Cors3OUT",
          "apply":function (){
            return ((() => {
              const Cors3 = this["Cors3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Cors3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Cors3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "Cors4OUT":"Cors4OUT",
          "apply":function (){
            return ((() => {
              const Cors4 = this["Cors4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"Cors4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit Cors4OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "Cors1", false);
            console.log("--- FIN RESERVOIR:", "Cors1");
            var msg = {
            type: 'killTank',
            value:  "Cors1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank Flute + FluteDebut1
    Flute = hh.MODULE({"id":"Flute","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteDebut1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteDebut2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteDebut3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteDebut4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteMilieu1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteMilieu2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteMilieu3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFin1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFin2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFin3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFin4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFin5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFin6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteNeutre1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteNeutre2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteNeutre3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteDebut1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteDebut2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteDebut3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteDebut4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteMilieu1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteMilieu2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteMilieu3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFin1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFin2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFin3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFin4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFin5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFin6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteNeutre1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteNeutre2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteNeutre3OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "FluteDebut1" );
                var msg = {
                  type: 'startTank',
                  value:  "FluteDebut1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteDebut1OUT":"FluteDebut1OUT",
                "apply":function (){
                  return ((() => {
                    const FluteDebut1 = this["FluteDebut1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteDebut1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteDebut1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteDebut1OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteDebut1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteDebut2OUT":"FluteDebut2OUT",
                "apply":function (){
                  return ((() => {
                    const FluteDebut2 = this["FluteDebut2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteDebut2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteDebut2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteDebut2OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteDebut2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteDebut3OUT":"FluteDebut3OUT",
                "apply":function (){
                  return ((() => {
                    const FluteDebut3 = this["FluteDebut3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteDebut3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteDebut3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteDebut3OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteDebut3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteDebut4OUT":"FluteDebut4OUT",
                "apply":function (){
                  return ((() => {
                    const FluteDebut4 = this["FluteDebut4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteDebut4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteDebut4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteDebut4OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteDebut4OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteMilieu1OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteMilieu2OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteMilieu3OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteFin1OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteFin2OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteFin3OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteFin4OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteFin5OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteFin6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteNeutre1OUT":"FluteNeutre1OUT",
                "apply":function (){
                  return ((() => {
                    const FluteNeutre1 = this["FluteNeutre1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteNeutre1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteNeutre1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteNeutre1OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteNeutre1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteNeutre2OUT":"FluteNeutre2OUT",
                "apply":function (){
                  return ((() => {
                    const FluteNeutre2 = this["FluteNeutre2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteNeutre2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteNeutre2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteNeutre2OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteNeutre2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteNeutre3OUT":"FluteNeutre3OUT",
                "apply":function (){
                  return ((() => {
                    const FluteNeutre3 = this["FluteNeutre3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteNeutre3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteNeutre3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteNeutre3OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteNeutre3OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:FluteDebut1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour FluteDebut1
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
                  const FluteDebut1IN  =this["FluteDebut1IN"];
                  return FluteDebut1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteDebut1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteDebut1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteDebut1OUT" : "FluteDebut1OUT",
              "apply":function (){
                return ((() => {
                  const FluteDebut1OUT = this["FluteDebut1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteDebut1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteDebut1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteDebut1OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteDebut1OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteDebut1
  ,
        hh.SEQUENCE( // Debut sequence pour FluteDebut2
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
                  const FluteDebut2IN  =this["FluteDebut2IN"];
                  return FluteDebut2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteDebut2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteDebut2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteDebut2OUT" : "FluteDebut2OUT",
              "apply":function (){
                return ((() => {
                  const FluteDebut2OUT = this["FluteDebut2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteDebut2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteDebut2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteDebut2OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteDebut2OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteDebut2
  ,
        hh.SEQUENCE( // Debut sequence pour FluteDebut3
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
                  const FluteDebut3IN  =this["FluteDebut3IN"];
                  return FluteDebut3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteDebut3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteDebut3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteDebut3OUT" : "FluteDebut3OUT",
              "apply":function (){
                return ((() => {
                  const FluteDebut3OUT = this["FluteDebut3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteDebut3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteDebut3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteDebut3OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteDebut3OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteDebut3
  ,
        hh.SEQUENCE( // Debut sequence pour FluteDebut4
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
                  const FluteDebut4IN  =this["FluteDebut4IN"];
                  return FluteDebut4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteDebut4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteDebut4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteDebut4OUT" : "FluteDebut4OUT",
              "apply":function (){
                return ((() => {
                  const FluteDebut4OUT = this["FluteDebut4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteDebut4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteDebut4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteDebut4OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteDebut4OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteDebut4
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteMilieu1OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteMilieu2OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteMilieu3OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteMilieu3
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteFin1OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteFin2OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteFin3OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteFin4OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteFin5OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "FluteFin6OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFin6
  ,
        hh.SEQUENCE( // Debut sequence pour FluteNeutre1
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
                  const FluteNeutre1IN  =this["FluteNeutre1IN"];
                  return FluteNeutre1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteNeutre1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteNeutre1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteNeutre1OUT" : "FluteNeutre1OUT",
              "apply":function (){
                return ((() => {
                  const FluteNeutre1OUT = this["FluteNeutre1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteNeutre1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteNeutre1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteNeutre1OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteNeutre1OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteNeutre1
  ,
        hh.SEQUENCE( // Debut sequence pour FluteNeutre2
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
                  const FluteNeutre2IN  =this["FluteNeutre2IN"];
                  return FluteNeutre2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteNeutre2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteNeutre2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteNeutre2OUT" : "FluteNeutre2OUT",
              "apply":function (){
                return ((() => {
                  const FluteNeutre2OUT = this["FluteNeutre2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteNeutre2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteNeutre2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteNeutre2OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteNeutre2OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteNeutre2
  ,
        hh.SEQUENCE( // Debut sequence pour FluteNeutre3
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
                  const FluteNeutre3IN  =this["FluteNeutre3IN"];
                  return FluteNeutre3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteNeutre3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteNeutre3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteNeutre3OUT" : "FluteNeutre3OUT",
              "apply":function (){
                return ((() => {
                  const FluteNeutre3OUT = this["FluteNeutre3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteNeutre3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteNeutre3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteNeutre3OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteNeutre3OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteNeutre3
      ), // Fin fork de make await avec en premiere position:FluteDebut1
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
          "FluteDebut1OUT":"FluteDebut1OUT",
          "apply":function (){
            return ((() => {
              const FluteDebut1 = this["FluteDebut1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteDebut1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteDebut1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteDebut2OUT":"FluteDebut2OUT",
          "apply":function (){
            return ((() => {
              const FluteDebut2 = this["FluteDebut2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteDebut2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteDebut2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteDebut3OUT":"FluteDebut3OUT",
          "apply":function (){
            return ((() => {
              const FluteDebut3 = this["FluteDebut3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteDebut3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteDebut3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteDebut4OUT":"FluteDebut4OUT",
          "apply":function (){
            return ((() => {
              const FluteDebut4 = this["FluteDebut4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteDebut4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteDebut4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteMilieu1OUT":"FluteMilieu1OUT",
          "apply":function (){
            return ((() => {
              const FluteMilieu1 = this["FluteMilieu1OUT"];
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
          "FluteFin1OUT":"FluteFin1OUT",
          "apply":function (){
            return ((() => {
              const FluteFin1 = this["FluteFin1OUT"];
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
          "FluteNeutre1OUT":"FluteNeutre1OUT",
          "apply":function (){
            return ((() => {
              const FluteNeutre1 = this["FluteNeutre1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteNeutre1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteNeutre1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteNeutre2OUT":"FluteNeutre2OUT",
          "apply":function (){
            return ((() => {
              const FluteNeutre2 = this["FluteNeutre2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteNeutre2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteNeutre2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteNeutre3OUT":"FluteNeutre3OUT",
          "apply":function (){
            return ((() => {
              const FluteNeutre3 = this["FluteNeutre3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteNeutre3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteNeutre3OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "FluteDebut1", false);
            console.log("--- FIN RESERVOIR:", "FluteDebut1");
            var msg = {
            type: 'killTank',
            value:  "FluteDebut1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank Bassons + BassonDebut1
    Bassons = hh.MODULE({"id":"Bassons","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BassonDebut1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BassonDebut2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BassonDebut3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BassonDebut4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BassonMilieu1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BassonMilieu2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BassonMilieu3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BassonMilieu4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BassonMilieu5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BassonNeutre1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"BassonNeutre2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BassonDebut1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BassonDebut2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BassonDebut3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BassonDebut4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BassonMilieu1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BassonMilieu2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BassonMilieu3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BassonMilieu4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BassonMilieu5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BassonNeutre1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"BassonNeutre2OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "BassonDebut1" );
                var msg = {
                  type: 'startTank',
                  value:  "BassonDebut1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BassonDebut1OUT":"BassonDebut1OUT",
                "apply":function (){
                  return ((() => {
                    const BassonDebut1 = this["BassonDebut1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BassonDebut1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BassonDebut1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BassonDebut1OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonDebut1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BassonDebut2OUT":"BassonDebut2OUT",
                "apply":function (){
                  return ((() => {
                    const BassonDebut2 = this["BassonDebut2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BassonDebut2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BassonDebut2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BassonDebut2OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonDebut2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BassonDebut3OUT":"BassonDebut3OUT",
                "apply":function (){
                  return ((() => {
                    const BassonDebut3 = this["BassonDebut3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BassonDebut3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BassonDebut3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BassonDebut3OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonDebut3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BassonDebut4OUT":"BassonDebut4OUT",
                "apply":function (){
                  return ((() => {
                    const BassonDebut4 = this["BassonDebut4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BassonDebut4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BassonDebut4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BassonDebut4OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonDebut4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BassonMilieu1OUT":"BassonMilieu1OUT",
                "apply":function (){
                  return ((() => {
                    const BassonMilieu1 = this["BassonMilieu1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BassonMilieu1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BassonMilieu1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BassonMilieu1OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonMilieu1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BassonMilieu2OUT":"BassonMilieu2OUT",
                "apply":function (){
                  return ((() => {
                    const BassonMilieu2 = this["BassonMilieu2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BassonMilieu2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BassonMilieu2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BassonMilieu2OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonMilieu2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BassonMilieu3OUT":"BassonMilieu3OUT",
                "apply":function (){
                  return ((() => {
                    const BassonMilieu3 = this["BassonMilieu3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BassonMilieu3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BassonMilieu3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BassonMilieu3OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonMilieu3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BassonMilieu4OUT":"BassonMilieu4OUT",
                "apply":function (){
                  return ((() => {
                    const BassonMilieu4 = this["BassonMilieu4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BassonMilieu4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BassonMilieu4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BassonMilieu4OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonMilieu4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BassonMilieu5OUT":"BassonMilieu5OUT",
                "apply":function (){
                  return ((() => {
                    const BassonMilieu5 = this["BassonMilieu5OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BassonMilieu5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BassonMilieu5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BassonMilieu5OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonMilieu5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BassonNeutre1OUT":"BassonNeutre1OUT",
                "apply":function (){
                  return ((() => {
                    const BassonNeutre1 = this["BassonNeutre1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BassonNeutre1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BassonNeutre1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BassonNeutre1OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonNeutre1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "BassonNeutre2OUT":"BassonNeutre2OUT",
                "apply":function (){
                  return ((() => {
                    const BassonNeutre2 = this["BassonNeutre2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"BassonNeutre2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit BassonNeutre2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "BassonNeutre2OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonNeutre2OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:BassonDebut1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour BassonDebut1
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
                  const BassonDebut1IN  =this["BassonDebut1IN"];
                  return BassonDebut1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BassonDebut1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BassonDebut1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BassonDebut1OUT" : "BassonDebut1OUT",
              "apply":function (){
                return ((() => {
                  const BassonDebut1OUT = this["BassonDebut1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BassonDebut1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BassonDebut1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BassonDebut1OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonDebut1OUT", false);
              }
            }
          )
        ) // Fin sequence pour BassonDebut1
  ,
        hh.SEQUENCE( // Debut sequence pour BassonDebut2
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
                  const BassonDebut2IN  =this["BassonDebut2IN"];
                  return BassonDebut2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BassonDebut2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BassonDebut2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BassonDebut2OUT" : "BassonDebut2OUT",
              "apply":function (){
                return ((() => {
                  const BassonDebut2OUT = this["BassonDebut2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BassonDebut2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BassonDebut2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BassonDebut2OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonDebut2OUT", false);
              }
            }
          )
        ) // Fin sequence pour BassonDebut2
  ,
        hh.SEQUENCE( // Debut sequence pour BassonDebut3
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
                  const BassonDebut3IN  =this["BassonDebut3IN"];
                  return BassonDebut3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BassonDebut3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BassonDebut3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BassonDebut3OUT" : "BassonDebut3OUT",
              "apply":function (){
                return ((() => {
                  const BassonDebut3OUT = this["BassonDebut3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BassonDebut3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BassonDebut3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BassonDebut3OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonDebut3OUT", false);
              }
            }
          )
        ) // Fin sequence pour BassonDebut3
  ,
        hh.SEQUENCE( // Debut sequence pour BassonDebut4
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
                  const BassonDebut4IN  =this["BassonDebut4IN"];
                  return BassonDebut4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BassonDebut4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BassonDebut4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BassonDebut4OUT" : "BassonDebut4OUT",
              "apply":function (){
                return ((() => {
                  const BassonDebut4OUT = this["BassonDebut4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BassonDebut4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BassonDebut4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BassonDebut4OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonDebut4OUT", false);
              }
            }
          )
        ) // Fin sequence pour BassonDebut4
  ,
        hh.SEQUENCE( // Debut sequence pour BassonMilieu1
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
                  const BassonMilieu1IN  =this["BassonMilieu1IN"];
                  return BassonMilieu1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BassonMilieu1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BassonMilieu1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BassonMilieu1OUT" : "BassonMilieu1OUT",
              "apply":function (){
                return ((() => {
                  const BassonMilieu1OUT = this["BassonMilieu1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BassonMilieu1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BassonMilieu1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BassonMilieu1OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonMilieu1OUT", false);
              }
            }
          )
        ) // Fin sequence pour BassonMilieu1
  ,
        hh.SEQUENCE( // Debut sequence pour BassonMilieu2
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
                  const BassonMilieu2IN  =this["BassonMilieu2IN"];
                  return BassonMilieu2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BassonMilieu2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BassonMilieu2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BassonMilieu2OUT" : "BassonMilieu2OUT",
              "apply":function (){
                return ((() => {
                  const BassonMilieu2OUT = this["BassonMilieu2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BassonMilieu2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BassonMilieu2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BassonMilieu2OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonMilieu2OUT", false);
              }
            }
          )
        ) // Fin sequence pour BassonMilieu2
  ,
        hh.SEQUENCE( // Debut sequence pour BassonMilieu3
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
                  const BassonMilieu3IN  =this["BassonMilieu3IN"];
                  return BassonMilieu3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BassonMilieu3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BassonMilieu3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BassonMilieu3OUT" : "BassonMilieu3OUT",
              "apply":function (){
                return ((() => {
                  const BassonMilieu3OUT = this["BassonMilieu3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BassonMilieu3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BassonMilieu3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BassonMilieu3OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonMilieu3OUT", false);
              }
            }
          )
        ) // Fin sequence pour BassonMilieu3
  ,
        hh.SEQUENCE( // Debut sequence pour BassonMilieu4
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
                  const BassonMilieu4IN  =this["BassonMilieu4IN"];
                  return BassonMilieu4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BassonMilieu4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BassonMilieu4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BassonMilieu4OUT" : "BassonMilieu4OUT",
              "apply":function (){
                return ((() => {
                  const BassonMilieu4OUT = this["BassonMilieu4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BassonMilieu4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BassonMilieu4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BassonMilieu4OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonMilieu4OUT", false);
              }
            }
          )
        ) // Fin sequence pour BassonMilieu4
  ,
        hh.SEQUENCE( // Debut sequence pour BassonMilieu5
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
                  const BassonMilieu5IN  =this["BassonMilieu5IN"];
                  return BassonMilieu5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BassonMilieu5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BassonMilieu5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BassonMilieu5OUT" : "BassonMilieu5OUT",
              "apply":function (){
                return ((() => {
                  const BassonMilieu5OUT = this["BassonMilieu5OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BassonMilieu5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BassonMilieu5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BassonMilieu5OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonMilieu5OUT", false);
              }
            }
          )
        ) // Fin sequence pour BassonMilieu5
  ,
        hh.SEQUENCE( // Debut sequence pour BassonNeutre1
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
                  const BassonNeutre1IN  =this["BassonNeutre1IN"];
                  return BassonNeutre1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BassonNeutre1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BassonNeutre1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BassonNeutre1OUT" : "BassonNeutre1OUT",
              "apply":function (){
                return ((() => {
                  const BassonNeutre1OUT = this["BassonNeutre1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BassonNeutre1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BassonNeutre1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BassonNeutre1OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonNeutre1OUT", false);
              }
            }
          )
        ) // Fin sequence pour BassonNeutre1
  ,
        hh.SEQUENCE( // Debut sequence pour BassonNeutre2
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
                  const BassonNeutre2IN  =this["BassonNeutre2IN"];
                  return BassonNeutre2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"BassonNeutre2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await BassonNeutre2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "BassonNeutre2OUT" : "BassonNeutre2OUT",
              "apply":function (){
                return ((() => {
                  const BassonNeutre2OUT = this["BassonNeutre2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"BassonNeutre2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit BassonNeutre2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "BassonNeutre2OUT");
                gcs.informSelecteurOnMenuChange(255 , "BassonNeutre2OUT", false);
              }
            }
          )
        ) // Fin sequence pour BassonNeutre2
      ), // Fin fork de make await avec en premiere position:BassonDebut1
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
          "BassonDebut1OUT":"BassonDebut1OUT",
          "apply":function (){
            return ((() => {
              const BassonDebut1 = this["BassonDebut1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BassonDebut1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BassonDebut1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BassonDebut2OUT":"BassonDebut2OUT",
          "apply":function (){
            return ((() => {
              const BassonDebut2 = this["BassonDebut2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BassonDebut2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BassonDebut2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BassonDebut3OUT":"BassonDebut3OUT",
          "apply":function (){
            return ((() => {
              const BassonDebut3 = this["BassonDebut3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BassonDebut3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BassonDebut3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BassonDebut4OUT":"BassonDebut4OUT",
          "apply":function (){
            return ((() => {
              const BassonDebut4 = this["BassonDebut4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BassonDebut4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BassonDebut4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BassonMilieu1OUT":"BassonMilieu1OUT",
          "apply":function (){
            return ((() => {
              const BassonMilieu1 = this["BassonMilieu1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BassonMilieu1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BassonMilieu1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BassonMilieu2OUT":"BassonMilieu2OUT",
          "apply":function (){
            return ((() => {
              const BassonMilieu2 = this["BassonMilieu2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BassonMilieu2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BassonMilieu2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BassonMilieu3OUT":"BassonMilieu3OUT",
          "apply":function (){
            return ((() => {
              const BassonMilieu3 = this["BassonMilieu3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BassonMilieu3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BassonMilieu3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BassonMilieu4OUT":"BassonMilieu4OUT",
          "apply":function (){
            return ((() => {
              const BassonMilieu4 = this["BassonMilieu4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BassonMilieu4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BassonMilieu4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BassonMilieu5OUT":"BassonMilieu5OUT",
          "apply":function (){
            return ((() => {
              const BassonMilieu5 = this["BassonMilieu5OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BassonMilieu5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BassonMilieu5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BassonNeutre1OUT":"BassonNeutre1OUT",
          "apply":function (){
            return ((() => {
              const BassonNeutre1 = this["BassonNeutre1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BassonNeutre1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BassonNeutre1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "BassonNeutre2OUT":"BassonNeutre2OUT",
          "apply":function (){
            return ((() => {
              const BassonNeutre2 = this["BassonNeutre2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"BassonNeutre2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit BassonNeutre2OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "BassonDebut1", false);
            console.log("--- FIN RESERVOIR:", "BassonDebut1");
            var msg = {
            type: 'killTank',
            value:  "BassonDebut1"
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
                console.log("-- MAKE RESERVOIR:", "Percu1" );
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Percu1OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Percu2OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Percu3OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Percu4OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Percu5OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Percu6OUT", true);
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
                    return [true, 255 ];
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
                gcs.informSelecteurOnMenuChange(255 , "Percu7OUT", true);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Percu1OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Percu2OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Percu3OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Percu4OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Percu5OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Percu6OUT", false);
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
                  return [false, 255];
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
                gcs.informSelecteurOnMenuChange(255 , "Percu7OUT", false);
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
              return [false, 255 ];
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
            gcs.informSelecteurOnMenuChange(255 , "Percu1", false);
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

    // Module tank Clarinette + ClarinetteDebut1
    Clarinette = hh.MODULE({"id":"Clarinette","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ClarinetteDebut1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ClarinetteDebut2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ClarinetteDebut3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ClarinetteMilieu1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ClarinetteMilieu2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ClarinetteMilieu3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ClarinetteMilieu4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ClarinetteMilieu5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ClarinetteFin1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ClarinetteFin2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"ClarinetteFin3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ClarinetteDebut1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ClarinetteDebut2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ClarinetteDebut3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ClarinetteMilieu1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ClarinetteMilieu2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ClarinetteMilieu3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ClarinetteMilieu4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ClarinetteMilieu5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ClarinetteFin1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ClarinetteFin2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"ClarinetteFin3OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "ClarinetteDebut1" );
                var msg = {
                  type: 'startTank',
                  value:  "ClarinetteDebut1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ClarinetteDebut1OUT":"ClarinetteDebut1OUT",
                "apply":function (){
                  return ((() => {
                    const ClarinetteDebut1 = this["ClarinetteDebut1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ClarinetteDebut1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ClarinetteDebut1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ClarinetteDebut1OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteDebut1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ClarinetteDebut2OUT":"ClarinetteDebut2OUT",
                "apply":function (){
                  return ((() => {
                    const ClarinetteDebut2 = this["ClarinetteDebut2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ClarinetteDebut2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ClarinetteDebut2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ClarinetteDebut2OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteDebut2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ClarinetteDebut3OUT":"ClarinetteDebut3OUT",
                "apply":function (){
                  return ((() => {
                    const ClarinetteDebut3 = this["ClarinetteDebut3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ClarinetteDebut3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ClarinetteDebut3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ClarinetteDebut3OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteDebut3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ClarinetteMilieu1OUT":"ClarinetteMilieu1OUT",
                "apply":function (){
                  return ((() => {
                    const ClarinetteMilieu1 = this["ClarinetteMilieu1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ClarinetteMilieu1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ClarinetteMilieu1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ClarinetteMilieu1OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteMilieu1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ClarinetteMilieu2OUT":"ClarinetteMilieu2OUT",
                "apply":function (){
                  return ((() => {
                    const ClarinetteMilieu2 = this["ClarinetteMilieu2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ClarinetteMilieu2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ClarinetteMilieu2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ClarinetteMilieu2OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteMilieu2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ClarinetteMilieu3OUT":"ClarinetteMilieu3OUT",
                "apply":function (){
                  return ((() => {
                    const ClarinetteMilieu3 = this["ClarinetteMilieu3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ClarinetteMilieu3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ClarinetteMilieu3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ClarinetteMilieu3OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteMilieu3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ClarinetteMilieu4OUT":"ClarinetteMilieu4OUT",
                "apply":function (){
                  return ((() => {
                    const ClarinetteMilieu4 = this["ClarinetteMilieu4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ClarinetteMilieu4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ClarinetteMilieu4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ClarinetteMilieu4OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteMilieu4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ClarinetteMilieu5OUT":"ClarinetteMilieu5OUT",
                "apply":function (){
                  return ((() => {
                    const ClarinetteMilieu5 = this["ClarinetteMilieu5OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ClarinetteMilieu5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ClarinetteMilieu5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ClarinetteMilieu5OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteMilieu5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ClarinetteFin1OUT":"ClarinetteFin1OUT",
                "apply":function (){
                  return ((() => {
                    const ClarinetteFin1 = this["ClarinetteFin1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ClarinetteFin1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ClarinetteFin1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ClarinetteFin1OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteFin1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ClarinetteFin2OUT":"ClarinetteFin2OUT",
                "apply":function (){
                  return ((() => {
                    const ClarinetteFin2 = this["ClarinetteFin2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ClarinetteFin2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ClarinetteFin2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ClarinetteFin2OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteFin2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "ClarinetteFin3OUT":"ClarinetteFin3OUT",
                "apply":function (){
                  return ((() => {
                    const ClarinetteFin3 = this["ClarinetteFin3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"ClarinetteFin3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit ClarinetteFin3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "ClarinetteFin3OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteFin3OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:ClarinetteDebut1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour ClarinetteDebut1
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
                  const ClarinetteDebut1IN  =this["ClarinetteDebut1IN"];
                  return ClarinetteDebut1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ClarinetteDebut1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ClarinetteDebut1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ClarinetteDebut1OUT" : "ClarinetteDebut1OUT",
              "apply":function (){
                return ((() => {
                  const ClarinetteDebut1OUT = this["ClarinetteDebut1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ClarinetteDebut1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ClarinetteDebut1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ClarinetteDebut1OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteDebut1OUT", false);
              }
            }
          )
        ) // Fin sequence pour ClarinetteDebut1
  ,
        hh.SEQUENCE( // Debut sequence pour ClarinetteDebut2
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
                  const ClarinetteDebut2IN  =this["ClarinetteDebut2IN"];
                  return ClarinetteDebut2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ClarinetteDebut2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ClarinetteDebut2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ClarinetteDebut2OUT" : "ClarinetteDebut2OUT",
              "apply":function (){
                return ((() => {
                  const ClarinetteDebut2OUT = this["ClarinetteDebut2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ClarinetteDebut2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ClarinetteDebut2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ClarinetteDebut2OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteDebut2OUT", false);
              }
            }
          )
        ) // Fin sequence pour ClarinetteDebut2
  ,
        hh.SEQUENCE( // Debut sequence pour ClarinetteDebut3
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
                  const ClarinetteDebut3IN  =this["ClarinetteDebut3IN"];
                  return ClarinetteDebut3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ClarinetteDebut3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ClarinetteDebut3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ClarinetteDebut3OUT" : "ClarinetteDebut3OUT",
              "apply":function (){
                return ((() => {
                  const ClarinetteDebut3OUT = this["ClarinetteDebut3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ClarinetteDebut3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ClarinetteDebut3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ClarinetteDebut3OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteDebut3OUT", false);
              }
            }
          )
        ) // Fin sequence pour ClarinetteDebut3
  ,
        hh.SEQUENCE( // Debut sequence pour ClarinetteMilieu1
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
                  const ClarinetteMilieu1IN  =this["ClarinetteMilieu1IN"];
                  return ClarinetteMilieu1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ClarinetteMilieu1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ClarinetteMilieu1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ClarinetteMilieu1OUT" : "ClarinetteMilieu1OUT",
              "apply":function (){
                return ((() => {
                  const ClarinetteMilieu1OUT = this["ClarinetteMilieu1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ClarinetteMilieu1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ClarinetteMilieu1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ClarinetteMilieu1OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteMilieu1OUT", false);
              }
            }
          )
        ) // Fin sequence pour ClarinetteMilieu1
  ,
        hh.SEQUENCE( // Debut sequence pour ClarinetteMilieu2
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
                  const ClarinetteMilieu2IN  =this["ClarinetteMilieu2IN"];
                  return ClarinetteMilieu2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ClarinetteMilieu2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ClarinetteMilieu2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ClarinetteMilieu2OUT" : "ClarinetteMilieu2OUT",
              "apply":function (){
                return ((() => {
                  const ClarinetteMilieu2OUT = this["ClarinetteMilieu2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ClarinetteMilieu2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ClarinetteMilieu2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ClarinetteMilieu2OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteMilieu2OUT", false);
              }
            }
          )
        ) // Fin sequence pour ClarinetteMilieu2
  ,
        hh.SEQUENCE( // Debut sequence pour ClarinetteMilieu3
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
                  const ClarinetteMilieu3IN  =this["ClarinetteMilieu3IN"];
                  return ClarinetteMilieu3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ClarinetteMilieu3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ClarinetteMilieu3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ClarinetteMilieu3OUT" : "ClarinetteMilieu3OUT",
              "apply":function (){
                return ((() => {
                  const ClarinetteMilieu3OUT = this["ClarinetteMilieu3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ClarinetteMilieu3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ClarinetteMilieu3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ClarinetteMilieu3OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteMilieu3OUT", false);
              }
            }
          )
        ) // Fin sequence pour ClarinetteMilieu3
  ,
        hh.SEQUENCE( // Debut sequence pour ClarinetteMilieu4
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
                  const ClarinetteMilieu4IN  =this["ClarinetteMilieu4IN"];
                  return ClarinetteMilieu4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ClarinetteMilieu4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ClarinetteMilieu4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ClarinetteMilieu4OUT" : "ClarinetteMilieu4OUT",
              "apply":function (){
                return ((() => {
                  const ClarinetteMilieu4OUT = this["ClarinetteMilieu4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ClarinetteMilieu4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ClarinetteMilieu4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ClarinetteMilieu4OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteMilieu4OUT", false);
              }
            }
          )
        ) // Fin sequence pour ClarinetteMilieu4
  ,
        hh.SEQUENCE( // Debut sequence pour ClarinetteMilieu5
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
                  const ClarinetteMilieu5IN  =this["ClarinetteMilieu5IN"];
                  return ClarinetteMilieu5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ClarinetteMilieu5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ClarinetteMilieu5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ClarinetteMilieu5OUT" : "ClarinetteMilieu5OUT",
              "apply":function (){
                return ((() => {
                  const ClarinetteMilieu5OUT = this["ClarinetteMilieu5OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ClarinetteMilieu5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ClarinetteMilieu5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ClarinetteMilieu5OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteMilieu5OUT", false);
              }
            }
          )
        ) // Fin sequence pour ClarinetteMilieu5
  ,
        hh.SEQUENCE( // Debut sequence pour ClarinetteFin1
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
                  const ClarinetteFin1IN  =this["ClarinetteFin1IN"];
                  return ClarinetteFin1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ClarinetteFin1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ClarinetteFin1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ClarinetteFin1OUT" : "ClarinetteFin1OUT",
              "apply":function (){
                return ((() => {
                  const ClarinetteFin1OUT = this["ClarinetteFin1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ClarinetteFin1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ClarinetteFin1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ClarinetteFin1OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteFin1OUT", false);
              }
            }
          )
        ) // Fin sequence pour ClarinetteFin1
  ,
        hh.SEQUENCE( // Debut sequence pour ClarinetteFin2
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
                  const ClarinetteFin2IN  =this["ClarinetteFin2IN"];
                  return ClarinetteFin2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ClarinetteFin2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ClarinetteFin2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ClarinetteFin2OUT" : "ClarinetteFin2OUT",
              "apply":function (){
                return ((() => {
                  const ClarinetteFin2OUT = this["ClarinetteFin2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ClarinetteFin2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ClarinetteFin2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ClarinetteFin2OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteFin2OUT", false);
              }
            }
          )
        ) // Fin sequence pour ClarinetteFin2
  ,
        hh.SEQUENCE( // Debut sequence pour ClarinetteFin3
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
                  const ClarinetteFin3IN  =this["ClarinetteFin3IN"];
                  return ClarinetteFin3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"ClarinetteFin3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await ClarinetteFin3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "ClarinetteFin3OUT" : "ClarinetteFin3OUT",
              "apply":function (){
                return ((() => {
                  const ClarinetteFin3OUT = this["ClarinetteFin3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"ClarinetteFin3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit ClarinetteFin3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "ClarinetteFin3OUT");
                gcs.informSelecteurOnMenuChange(255 , "ClarinetteFin3OUT", false);
              }
            }
          )
        ) // Fin sequence pour ClarinetteFin3
      ), // Fin fork de make await avec en premiere position:ClarinetteDebut1
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
          "ClarinetteDebut1OUT":"ClarinetteDebut1OUT",
          "apply":function (){
            return ((() => {
              const ClarinetteDebut1 = this["ClarinetteDebut1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ClarinetteDebut1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ClarinetteDebut1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ClarinetteDebut2OUT":"ClarinetteDebut2OUT",
          "apply":function (){
            return ((() => {
              const ClarinetteDebut2 = this["ClarinetteDebut2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ClarinetteDebut2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ClarinetteDebut2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ClarinetteDebut3OUT":"ClarinetteDebut3OUT",
          "apply":function (){
            return ((() => {
              const ClarinetteDebut3 = this["ClarinetteDebut3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ClarinetteDebut3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ClarinetteDebut3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ClarinetteMilieu1OUT":"ClarinetteMilieu1OUT",
          "apply":function (){
            return ((() => {
              const ClarinetteMilieu1 = this["ClarinetteMilieu1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ClarinetteMilieu1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ClarinetteMilieu1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ClarinetteMilieu2OUT":"ClarinetteMilieu2OUT",
          "apply":function (){
            return ((() => {
              const ClarinetteMilieu2 = this["ClarinetteMilieu2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ClarinetteMilieu2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ClarinetteMilieu2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ClarinetteMilieu3OUT":"ClarinetteMilieu3OUT",
          "apply":function (){
            return ((() => {
              const ClarinetteMilieu3 = this["ClarinetteMilieu3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ClarinetteMilieu3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ClarinetteMilieu3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ClarinetteMilieu4OUT":"ClarinetteMilieu4OUT",
          "apply":function (){
            return ((() => {
              const ClarinetteMilieu4 = this["ClarinetteMilieu4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ClarinetteMilieu4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ClarinetteMilieu4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ClarinetteMilieu5OUT":"ClarinetteMilieu5OUT",
          "apply":function (){
            return ((() => {
              const ClarinetteMilieu5 = this["ClarinetteMilieu5OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ClarinetteMilieu5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ClarinetteMilieu5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ClarinetteFin1OUT":"ClarinetteFin1OUT",
          "apply":function (){
            return ((() => {
              const ClarinetteFin1 = this["ClarinetteFin1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ClarinetteFin1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ClarinetteFin1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ClarinetteFin2OUT":"ClarinetteFin2OUT",
          "apply":function (){
            return ((() => {
              const ClarinetteFin2 = this["ClarinetteFin2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ClarinetteFin2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ClarinetteFin2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "ClarinetteFin3OUT":"ClarinetteFin3OUT",
          "apply":function (){
            return ((() => {
              const ClarinetteFin3 = this["ClarinetteFin3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"ClarinetteFin3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit ClarinetteFin3OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "ClarinetteDebut1", false);
            console.log("--- FIN RESERVOIR:", "ClarinetteDebut1");
            var msg = {
            type: 'killTank',
            value:  "ClarinetteDebut1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module


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
    hh.SIGNAL({"%location":{},"direction":"INOUT","name":"stopReservoir"}),
    hh.SIGNAL({"%location":{},"direction":"INOUT","name":"stopMoveTempo"}),


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
        setTempo(80);
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
          var msg = {
            type: 'alertInfoScoreON',
            value:'Opus5'
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {console.log('Opus5 avec session Ableton Live');}
    }
  ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        transposeValue = 0;
        oscMidiLocal.sendControlChange(par.busMidiDAW,1,61,64);
      }
    }
  ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        transposeValue = 0;
        oscMidiLocal.sendControlChange(par.busMidiDAW,1,68,64);
      }
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
              value:'Avec piano'
            }
            serveur.broadcast(JSON.stringify(msg));
            }
          }
      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "NappeCelloOUT": "NappeCelloOUT",
            "apply":function (){
              return ((() => {
                const NappeCelloOUT = this["NappeCelloOUT"];
                return [true,255];
              })());
            }
          },
          hh.SIGACCESS({
            "signame": "NappeCelloOUT",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),
        hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () { gcs.informSelecteurOnMenuChange(255 , "NappeCelloOUT",true); }
          }
     	),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "NappeViolonsOUT": "NappeViolonsOUT",
            "apply":function (){
              return ((() => {
                const NappeViolonsOUT = this["NappeViolonsOUT"];
                return [true,255];
              })());
            }
          },
          hh.SIGACCESS({
            "signame": "NappeViolonsOUT",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),
        hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () { gcs.informSelecteurOnMenuChange(255 , "NappeViolonsOUT",true); }
          }
     	),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "NappeCTBOUT": "NappeCTBOUT",
            "apply":function (){
              return ((() => {
                const NappeCTBOUT = this["NappeCTBOUT"];
                return [true,255];
              })());
            }
          },
          hh.SIGACCESS({
            "signame": "NappeCTBOUT",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),
        hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () { gcs.informSelecteurOnMenuChange(255 , "NappeCTBOUT",true); }
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
        "countapply":function (){ return 10;}
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
          transposeValue = 2; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,61);
          oscMidiLocal.sendControlChange(par.busMidiDAW,1,61, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
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
        "countapply":function (){ return 10;}
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
          console.log("hiphop block transpose: transposeValue:", transposeValue ,1,61);
          oscMidiLocal.sendControlChange(par.busMidiDAW,1,61, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
        }
      }
    ),

    hh.LOCAL(
      {
        "%location":{},
        "%tag":"signal"
      },
      hh.SIGNAL({
        "name":"stop659721"
      }),

        hh.TRAP(
          {
            "trap659721":"trap659721",
            "%location":{},
            "%tag":"trap659721"
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
                      "module": hh.getModule("Piano", {"filename":"","pos":2}),
                      "autocomplete":true,
                      "stopReservoir":"stop659721"
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
                  "countapply":function (){return 20;}
              },
              hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
            ),
            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                //"stopReservoir":"stopReservoir",
                "stop659721" : "stop659721",
                "apply":function (){
                  return ((() => {
                    //const stopReservoir = this["stopReservoir"];
                    const stop659721 = this["stop659721"];
                    return 0;
                  })());
                }
              },
              hh.SIGACCESS({
                //"signame":"stopReservoir",
                "signame":"stop659721",
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
              "trap659721":"trap659721",
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

          hh.SEQUENCE(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                "%tag":"seq"
              },


          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "NappeAltoOUT": "NappeAltoOUT",
              "apply":function (){
                return ((() => {
                  const NappeAltoOUT = this["NappeAltoOUT"];
                  return [false,255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "NappeAltoOUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255 , "NappeAltoOUT",false); }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "NappeCelloOUT": "NappeCelloOUT",
              "apply":function (){
                return ((() => {
                  const NappeCelloOUT = this["NappeCelloOUT"];
                  return [false,255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "NappeCelloOUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255 , "NappeCelloOUT",false); }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "NappeViolonsOUT": "NappeViolonsOUT",
              "apply":function (){
                return ((() => {
                  const NappeViolonsOUT = this["NappeViolonsOUT"];
                  return [false,255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "NappeViolonsOUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255 , "NappeViolonsOUT",false); }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "NappeCTBOUT": "NappeCTBOUT",
              "apply":function (){
                return ((() => {
                  const NappeCTBOUT = this["NappeCTBOUT"];
                  return [false,255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "NappeCTBOUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255 , "NappeCTBOUT",false); }
            }
        ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            transposeValue = 0;
            oscMidiLocal.sendControlChange(par.busMidiDAW,1,61,64);
          }
        }
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

      ),

    ),

        hh.SEQUENCE(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
              "%tag":"seq"
            },


          hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },


        hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              var msg = {
                type: 'alertInfoScoreON',
                value:'Avec violon'
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
            setTempo(100);
          }
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
          "countapply":function (){ return 20;}
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
              "countapply":function (){ return  2;}
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
                  moveTempo(1, 4);
                }
              }
            )
          )
        ),


      ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "S1ActionOUT": "S1ActionOUT",
              "apply":function (){
                return ((() => {
                  const S1ActionOUT = this["S1ActionOUT"];
                  return [true,255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "S1ActionOUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255 , "S1ActionOUT",true); }
            }
       	),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "NappeCTBRythmeOUT": "NappeCTBRythmeOUT",
              "apply":function (){
                return ((() => {
                  const NappeCTBRythmeOUT = this["NappeCTBRythmeOUT"];
                  return [true,255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "NappeCTBRythmeOUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255 , "NappeCTBRythmeOUT",true); }
            }
       	),

            hh.SEQUENCE(
                {
                  "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                  "%tag":"seq"
                },


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
            "countapply":function (){ return 10;}
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
              transposeValue = 2; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
              console.log("hiphop block transpose: transposeValue:", transposeValue ,1,61);
              oscMidiLocal.sendControlChange(par.busMidiDAW,1,61, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
            }
          }
        ),

        ),

      hh.LOCAL(
        {
          "%location":{},
          "%tag":"signal"
        },
        hh.SIGNAL({
          "name":"stop742759"
        }),

          hh.TRAP(
            {
              "trap742759":"trap742759",
              "%location":{},
              "%tag":"trap742759"
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
                        "module": hh.getModule("Violons", {"filename":"","pos":2}),
                        "autocomplete":true,
                        "stopReservoir":"stop742759"
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
                    "countapply":function (){return 20;}
                },
                hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
              ),
              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  //"stopReservoir":"stopReservoir",
                  "stop742759" : "stop742759",
                  "apply":function (){
                    return ((() => {
                      //const stopReservoir = this["stopReservoir"];
                      const stop742759 = this["stop742759"];
                      return 0;
                    })());
                  }
                },
                hh.SIGACCESS({
                  //"signame":"stopReservoir",
                  "signame":"stop742759",
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
                "trap742759":"trap742759",
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

          hh.SEQUENCE(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                "%tag":"seq"
              },


          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "NappeCTBRythmeOUT": "NappeCTBRythmeOUT",
              "apply":function (){
                return ((() => {
                  const NappeCTBRythmeOUT = this["NappeCTBRythmeOUT"];
                  return [false,255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "NappeCTBRythmeOUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255 , "NappeCTBRythmeOUT",false); }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "S1ActionOUT": "S1ActionOUT",
              "apply":function (){
                return ((() => {
                  const S1ActionOUT = this["S1ActionOUT"];
                  return [false,255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "S1ActionOUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255 , "S1ActionOUT",false); }
            }
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
            var msg = {
              type: 'alertInfoScoreON',
              value:'Cuivre, bois et percu'
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
          setTempo(90);
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


        hh.LOCAL(
          {
            "%location":{},
            "%tag":"signal"
          },
          hh.SIGNAL({
            "name":"stop142176"
          }),

            hh.TRAP(
              {
                "trap142176":"trap142176",
                "%location":{},
                "%tag":"trap142176"
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
                          "module": hh.getModule("Percu", {"filename":"","pos":2}),
                          "autocomplete":true,
                          "stopReservoir":"stop142176"
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
                      "countapply":function (){return 20;}
                  },
                  hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
                ),
                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    //"stopReservoir":"stopReservoir",
                    "stop142176" : "stop142176",
                    "apply":function (){
                      return ((() => {
                        //const stopReservoir = this["stopReservoir"];
                        const stop142176 = this["stop142176"];
                        return 0;
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    //"signame":"stopReservoir",
                    "signame":"stop142176",
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
                  "trap142176":"trap142176",
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

        hh.LOCAL(
          {
            "%location":{},
            "%tag":"signal"
          },
          hh.SIGNAL({
            "name":"stop762926"
          }),

            hh.TRAP(
              {
                "trap762926":"trap762926",
                "%location":{},
                "%tag":"trap762926"
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
                          "module": hh.getModule("Bassons", {"filename":"","pos":2}),
                          "autocomplete":true,
                          "stopReservoir":"stop762926"
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
                      "countapply":function (){return 20;}
                  },
                  hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
                ),
                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    //"stopReservoir":"stopReservoir",
                    "stop762926" : "stop762926",
                    "apply":function (){
                      return ((() => {
                        //const stopReservoir = this["stopReservoir"];
                        const stop762926 = this["stop762926"];
                        return 0;
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    //"signame":"stopReservoir",
                    "signame":"stop762926",
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
                  "trap762926":"trap762926",
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
                  DAW.cleanQueue(13);
                }
              }
            ),

        hh.LOCAL(
          {
            "%location":{},
            "%tag":"signal"
          },
          hh.SIGNAL({
            "name":"stop104878"
          }),

            hh.TRAP(
              {
                "trap104878":"trap104878",
                "%location":{},
                "%tag":"trap104878"
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
                          "module": hh.getModule("Flute", {"filename":"","pos":2}),
                          "autocomplete":true,
                          "stopReservoir":"stop104878"
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
                      "countapply":function (){return 20;}
                  },
                  hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
                ),
                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    //"stopReservoir":"stopReservoir",
                    "stop104878" : "stop104878",
                    "apply":function (){
                      return ((() => {
                        //const stopReservoir = this["stopReservoir"];
                        const stop104878 = this["stop104878"];
                        return 0;
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    //"signame":"stopReservoir",
                    "signame":"stop104878",
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
                  "trap104878":"trap104878",
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
                  DAW.cleanQueue(12);
                }
              }
            ),

        hh.LOCAL(
          {
            "%location":{},
            "%tag":"signal"
          },
          hh.SIGNAL({
            "name":"stop397476"
          }),

            hh.TRAP(
              {
                "trap397476":"trap397476",
                "%location":{},
                "%tag":"trap397476"
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
                          "module": hh.getModule("Trompette", {"filename":"","pos":2}),
                          "autocomplete":true,
                          "stopReservoir":"stop397476"
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
                      "countapply":function (){return 20;}
                  },
                  hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
                ),
                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    //"stopReservoir":"stopReservoir",
                    "stop397476" : "stop397476",
                    "apply":function (){
                      return ((() => {
                        //const stopReservoir = this["stopReservoir"];
                        const stop397476 = this["stop397476"];
                        return 0;
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    //"signame":"stopReservoir",
                    "signame":"stop397476",
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
                  "trap397476":"trap397476",
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
                  DAW.cleanQueue(10);
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

        hh.LOCAL(
          {
            "%location":{},
            "%tag":"signal"
          },
          hh.SIGNAL({
            "name":"stop878668"
          }),

            hh.TRAP(
              {
                "trap878668":"trap878668",
                "%location":{},
                "%tag":"trap878668"
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
                          "module": hh.getModule("Cors", {"filename":"","pos":2}),
                          "autocomplete":true,
                          "stopReservoir":"stop878668"
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
                      "countapply":function (){return 10;}
                  },
                  hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
                ),
                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    //"stopReservoir":"stopReservoir",
                    "stop878668" : "stop878668",
                    "apply":function (){
                      return ((() => {
                        //const stopReservoir = this["stopReservoir"];
                        const stop878668 = this["stop878668"];
                        return 0;
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    //"signame":"stopReservoir",
                    "signame":"stop878668",
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
                  "trap878668":"trap878668",
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

        hh.LOCAL(
          {
            "%location":{},
            "%tag":"signal"
          },
          hh.SIGNAL({
            "name":"stop660002"
          }),

            hh.TRAP(
              {
                "trap660002":"trap660002",
                "%location":{},
                "%tag":"trap660002"
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
                          "module": hh.getModule("Clarinette", {"filename":"","pos":2}),
                          "autocomplete":true,
                          "stopReservoir":"stop660002"
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
                      "countapply":function (){return 20;}
                  },
                  hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
                ),
                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    //"stopReservoir":"stopReservoir",
                    "stop660002" : "stop660002",
                    "apply":function (){
                      return ((() => {
                        //const stopReservoir = this["stopReservoir"];
                        const stop660002 = this["stop660002"];
                        return 0;
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    //"signame":"stopReservoir",
                    "signame":"stop660002",
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
                  "trap660002":"trap660002",
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

            hh.SEQUENCE(
                {
                  "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                  "%tag":"seq"
                },



        hh.ABORT(
          {
            "%location":{abort: tick},
            "%tag":"abort",
            "immediate":false,
            "apply": function (){return ((() => {
                const tick=this["tick"];
                return tick.now;
            })());},
            "countapply":function (){ return 60;}
          },
          hh.SIGACCESS({
            "signame":"tick",
            "pre":false,
            "val":false,
            "cnt":false
          }),

          hh.LOOP(
              {
                "%location":{loop: 1},
                "%tag":"loop"
              },

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
                "countapply":function (){ return 5;}
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
                  console.log("hiphop block transpose: transposeValue:", transposeValue ,1,65);
                  oscMidiLocal.sendControlChange(par.busMidiDAW,1,65, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
                }
              }
            ),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {
                  transposeValue = 1; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
                  console.log("hiphop block transpose: transposeValue:", transposeValue ,1,66);
                  oscMidiLocal.sendControlChange(par.busMidiDAW,1,66, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
                }
              }
            ),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {
                  transposeValue = 1; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
                  console.log("hiphop block transpose: transposeValue:", transposeValue ,1,67);
                  oscMidiLocal.sendControlChange(par.busMidiDAW,1,67, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
                }
              }
            ),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {
                  transposeValue = 1; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
                  console.log("hiphop block transpose: transposeValue:", transposeValue ,1,68);
                  oscMidiLocal.sendControlChange(par.busMidiDAW,1,68, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
                }
              }
            ),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {
                  transposeValue = 1; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
                  console.log("hiphop block transpose: transposeValue:", transposeValue ,1,70);
                  oscMidiLocal.sendControlChange(par.busMidiDAW,1,70, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
                }
              }
            ),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {
                  transposeValue = 1; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
                  console.log("hiphop block transpose: transposeValue:", transposeValue ,1,71);
                  oscMidiLocal.sendControlChange(par.busMidiDAW,1,71, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
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
                "countapply":function (){ return 5;}
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
                  console.log("hiphop block transpose: transposeValue:", transposeValue ,1,65);
                  oscMidiLocal.sendControlChange(par.busMidiDAW,1,65, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
                }
              }
            ),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {
                  transposeValue = 2; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
                  console.log("hiphop block transpose: transposeValue:", transposeValue ,1,66);
                  oscMidiLocal.sendControlChange(par.busMidiDAW,1,66, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
                }
              }
            ),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {
                  transposeValue = 2; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
                  console.log("hiphop block transpose: transposeValue:", transposeValue ,1,67);
                  oscMidiLocal.sendControlChange(par.busMidiDAW,1,67, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
                }
              }
            ),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {
                  transposeValue = 2; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
                  console.log("hiphop block transpose: transposeValue:", transposeValue ,1,68);
                  oscMidiLocal.sendControlChange(par.busMidiDAW,1,68, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
                }
              }
            ),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {
                  transposeValue = 2; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
                  console.log("hiphop block transpose: transposeValue:", transposeValue ,1,70);
                  oscMidiLocal.sendControlChange(par.busMidiDAW,1,70, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
                }
              }
            ),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {
                  transposeValue = 2; // !! Ne dvrait pas être une variable commune si on veut incrémenter.
                  console.log("hiphop block transpose: transposeValue:", transposeValue ,1,71);
                  oscMidiLocal.sendControlChange(par.busMidiDAW,1,71, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
                }
              }
            ),

            ),

        ),

        ),

      ),

    ),

        hh.SEQUENCE(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
              "%tag":"seq"
            },


        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "NappeAltoOUT": "NappeAltoOUT",
            "apply":function (){
              return ((() => {
                const NappeAltoOUT = this["NappeAltoOUT"];
                return [false,255];
              })());
            }
          },
          hh.SIGACCESS({
            "signame": "NappeAltoOUT",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),
        hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () { gcs.informSelecteurOnMenuChange(255 , "NappeAltoOUT",false); }
          }
      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "NappeCelloOUT": "NappeCelloOUT",
            "apply":function (){
              return ((() => {
                const NappeCelloOUT = this["NappeCelloOUT"];
                return [false,255];
              })());
            }
          },
          hh.SIGACCESS({
            "signame": "NappeCelloOUT",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),
        hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () { gcs.informSelecteurOnMenuChange(255 , "NappeCelloOUT",false); }
          }
      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "NappeViolonsOUT": "NappeViolonsOUT",
            "apply":function (){
              return ((() => {
                const NappeViolonsOUT = this["NappeViolonsOUT"];
                return [false,255];
              })());
            }
          },
          hh.SIGACCESS({
            "signame": "NappeViolonsOUT",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),
        hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () { gcs.informSelecteurOnMenuChange(255 , "NappeViolonsOUT",false); }
          }
      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "NappeCelloRythmeOUT": "NappeCelloRythmeOUT",
            "apply":function (){
              return ((() => {
                const NappeCelloRythmeOUT = this["NappeCelloRythmeOUT"];
                return [false,255];
              })());
            }
          },
          hh.SIGACCESS({
            "signame": "NappeCelloRythmeOUT",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),
        hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () { gcs.informSelecteurOnMenuChange(255 , "NappeCelloRythmeOUT",false); }
          }
      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "NappeCTBOUT": "NappeCTBOUT",
            "apply":function (){
              return ((() => {
                const NappeCTBOUT = this["NappeCTBOUT"];
                return [false,255];
              })());
            }
          },
          hh.SIGACCESS({
            "signame": "NappeCTBOUT",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),
        hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () { gcs.informSelecteurOnMenuChange(255 , "NappeCTBOUT",false); }
          }
      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "NappeCTBRythmeOUT": "NappeCTBRythmeOUT",
            "apply":function (){
              return ((() => {
                const NappeCTBRythmeOUT = this["NappeCTBRythmeOUT"];
                return [false,255];
              })());
            }
          },
          hh.SIGACCESS({
            "signame": "NappeCTBRythmeOUT",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),
        hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () { gcs.informSelecteurOnMenuChange(255 , "NappeCTBRythmeOUT",false); }
          }
      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "S1ActionOUT": "S1ActionOUT",
            "apply":function (){
              return ((() => {
                const S1ActionOUT = this["S1ActionOUT"];
                return [false,255];
              })());
            }
          },
          hh.SIGACCESS({
            "signame": "S1ActionOUT",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),
        hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () { gcs.informSelecteurOnMenuChange(255 , "S1ActionOUT",false); }
          }
      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "S2ActionOUT": "S2ActionOUT",
            "apply":function (){
              return ((() => {
                const S2ActionOUT = this["S2ActionOUT"];
                return [false,255];
              })());
            }
          },
          hh.SIGACCESS({
            "signame": "S2ActionOUT",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),
        hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () { gcs.informSelecteurOnMenuChange(255 , "S2ActionOUT",false); }
          }
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

    ),

    hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          var msg = {
            type: 'alertInfoScoreON',
            value:'Fin Opus5'
          }
          serveur.broadcast(JSON.stringify(msg));
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
exports.orchestration = orchestration;
