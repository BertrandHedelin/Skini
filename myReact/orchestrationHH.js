var Piano, Piano1Intro1, Piano1Intro2, Piano1Intro3, Piano1Intro4, Piano1Intro5, Piano1Milieu1, Piano1Milieu2, Piano1Milieu3, Piano1Milieu4, Piano1Milieu5, Piano1Milieu6, Piano1Milieu7, Piano1Fin1, Piano1Fin2, Piano1Fin3, Piano1Fin4, Piano1Fin5, RiseHit;



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
  if(midimix.getAbletonLinkStatus()) {
    if(debug) console.log("ORCHESTRATION: tempo Link:", value);
    midimix.setTempoLink(value);
    return;
  }

  tempoGlobal = value;
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

      hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "RiseHitOUT": "RiseHitOUT",
          "apply":function (){
            return ((() => {
              const RiseHitOUT = this["RiseHitOUT"];
              return [true,255];
            })());
          }
        },
        hh.SIGACCESS({
          "signame": "RiseHitOUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
      ),
      hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () { gcs.informSelecteurOnMenuChange(255 , "RiseHitOUT",true); }
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
      "apply":function () {console.log('Opus5');}
    }
  ),

  hh.RUN({
      "%location":{"filename":"","pos":1},
      "%tag":"run",
      "module": hh.getModule("Piano", {"filename":"","pos":2}),
      "autocomplete":true
    }),

  /*  hh.PAUSE(
      {
        "%location":{},
        "%tag":"yield"
      }
    ),*/


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
