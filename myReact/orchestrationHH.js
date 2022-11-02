var loopCello1, tick, transposition, groupe3, groupe4, groupe5, pulsation, groupe0, groupe2, groupe1;



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
  if(par.groupesDesSons[i][0] !== "") {
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
}

// Création des signaux IN de sélection de patterns
for (var i=0; i < par.groupesDesSons.length; i++) {
  if(par.groupesDesSons[i][0] !== "") {
    var signalName = par.groupesDesSons[i][0] + "IN";

    if(debug) console.log("Signal Orchestration:", signalName);

    var signal = hh.SIGNAL({
      "%location":{},
      "direction":"IN",
      "name":signalName
    });
    signals.push(signal);
  }
}

function setSignals(){
  var machine = new hh.ReactiveMachine( orchestration, {sweep:true, tracePropagation: false, traceReactDuration: false});
  console.log("Number of nets in Orchestration:",machine.nets.length);
  return machine;
}
exports.setSignals = setSignals;


  loopCello1 = hh.MODULE({"id":"loopCello1","%location":{},"%tag":"module"},

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"tick"
      }),



    hh.ABORT(
      {
        "%location":{abort: tick},
        "%tag":"abort",
        "immediate":false,
        "apply": function (){return ((() => {
            const tick=this["tick"];
            return tick.now;
        })());},
        "countapply":function (){ return 16;}
      },
      hh.SIGACCESS({
        "signame":"tick",
        "pre":false,
        "val":false,
        "cnt":false
      }),


      hh.LOOPEACH(
        {
          "%location":{loopeach: tick},
          "%tag":"do/every",
          "immediate":false,
          "apply": function (){return ((() => {
              const tick=this["tick"];
              return tick.now;
          })());},
          "countapply":function (){ return 4;}
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
                DAW.putPatternInQueue('Cello1');
              }
            }
          ),

          hh.ATOM(
            {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                DAW.putPatternInQueue('Cello1');
              }
            }
          ),

      ),

    ),

  );

  transposition = hh.MODULE({"id":"transposition","%location":{},"%tag":"module"},

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"tick"
      }),


    hh.LOOP(
        {
          "%location":{loop: 1},
          "%tag":"loop"
        },
          // Transposition
      // 64 -> 0
      // 70 -> +1
      // 75 -> +2
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //

      hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          oscMidiLocal.sendControlChange( par.busMidiDAW,
          1,
          16,
          64);
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
      // Transposition
      // 64 -> 0
      // 70 -> +1
      // 75 -> +2
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //

      hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          oscMidiLocal.sendControlChange( par.busMidiDAW,
          1,
          16,
          70);
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
      // Transposition
      // 64 -> 0
      // 70 -> +1
      // 75 -> +2
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //

      hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          oscMidiLocal.sendControlChange( par.busMidiDAW,
          1,
          16,
          75);
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
      // Transposition
      // 64 -> 0
      // 70 -> +1
      // 75 -> +2
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //

      hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          oscMidiLocal.sendControlChange( par.busMidiDAW,
          1,
          16,
          70);
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
      // Transposition
      // 64 -> 0
      // 70 -> +1
      // 75 -> +2
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //

      hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          oscMidiLocal.sendControlChange( par.busMidiDAW,
          1,
          16,
          64);
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
      // Transposition
      // 64 -> 0
      // 70 -> +1
      // 75 -> +2
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //

      hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          oscMidiLocal.sendControlChange( par.busMidiDAW,
          1,
          16,
          58);
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
      // Transposition
      // 64 -> 0
      // 70 -> +1
      // 75 -> +2
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //

      hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          oscMidiLocal.sendControlChange( par.busMidiDAW,
          1,
          16,
          53);
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
      // Transposition
      // 64 -> 0
      // 70 -> +1
      // 75 -> +2
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //

      hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          oscMidiLocal.sendControlChange( par.busMidiDAW,
          1,
          16,
          58);
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
      "apply":function () {console.log('Début Mars 2022');}
    }
  ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        gcs.setTimerDivision(2);
      }
    }
  ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        CCChannel= 1;
        CCTempo  = 100;
        tempoMax = 160;
        tempoMin = 40;
      }
    }
  ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        setTempo(60);
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
            value:'Mars 2022'
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ),
  // Pour limiter le travail du simulateur à une liste de 1 pattern

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
             gcs.setpatternListLength([1,255]);
          }
        }
      ),

        hh.FORK(
            {
              "%location":{},
              "%tag":"fork"
            },


          hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },


          hh.TRAP(
            {
              "trap103916":"trap103916",
              "%location":{},
              "%tag":"trap103916"
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
                  "groupe3OUT":"groupe3OUT",
                  "apply":function (){
                    return ((() => {
                      const groupe3OUT = this["groupe3OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"groupe3OUT",
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
                    gcs.informSelecteurOnMenuChange(255," groupe3", true);
                  }
      		      }
      		 	  ),

              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  "groupe4OUT":"groupe4OUT",
                  "apply":function (){
                    return ((() => {
                      const groupe4OUT = this["groupe4OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"groupe4OUT",
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
                    gcs.informSelecteurOnMenuChange(255," groupe4", true);
                  }
      		      }
      		 	  ),

              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  "groupe5OUT":"groupe5OUT",
                  "apply":function (){
                    return ((() => {
                      const groupe5OUT = this["groupe5OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"groupe5OUT",
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
                    gcs.informSelecteurOnMenuChange(255," groupe5", true);
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
      	              "countapply":function (){return 10;}
      	          },
      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
      	        ),


      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "groupe3OUT":"groupe3OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const groupe3OUT = this["groupe3OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"groupe3OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe3", false); }
      		      }
      		 	),

      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "groupe4OUT":"groupe4OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const groupe4OUT = this["groupe4OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"groupe4OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe4", false); }
      		      }
      		 	),

      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "groupe5OUT":"groupe5OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const groupe5OUT = this["groupe5OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"groupe5OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe5", false); }
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
      		          "trap103916":"trap103916",
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


    hh.ABORT(
      {
        "%location":{abort: tick},
        "%tag":"abort",
        "immediate":false,
        "apply": function (){return ((() => {
            const tick=this["tick"];
            return tick.now;
        })());},
        "countapply":function (){ return 10;}
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
        "module": hh.getModule(  "transposition", {}),
        "tick":"",

      }),

    ),

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


  hh.ABORT(
    {
      "%location":{abort: tick},
      "%tag":"abort",
      "immediate":false,
      "apply": function (){return ((() => {
          const tick=this["tick"];
          return tick.now;
      })());},
      "countapply":function (){ return 24;}
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
                moveTempo(3, 5);
              }
            }
          )
        )
      ),


            hh.SEQUENCE(
                {
                  "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                  "%tag":"seq"
                },


            hh.TRAP(
              {
                "trap935784":"trap935784",
                "%location":{},
                "%tag":"trap935784"
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
                    "groupe0OUT":"groupe0OUT",
                    "apply":function (){
                      return ((() => {
                        const groupe0OUT = this["groupe0OUT"];
                        return [true, 255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame":"groupe0OUT",
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
                      gcs.informSelecteurOnMenuChange(255," groupe0", true);
                    }
        		      }
        		 	  ),

                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "groupe2OUT":"groupe2OUT",
                    "apply":function (){
                      return ((() => {
                        const groupe2OUT = this["groupe2OUT"];
                        return [true, 255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame":"groupe2OUT",
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
                      gcs.informSelecteurOnMenuChange(255," groupe2", true);
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
        	              "countapply":function (){return 23;}
        	          },
        	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
        	        ),


        	        hh.EMIT(
        	          {
        	            "%location":{},
        	            "%tag":"emit",
        	            "groupe0OUT":"groupe0OUT",
        	            "apply":function (){
        	              return ((() => {
        	                const groupe0OUT = this["groupe0OUT"];
        	                return [false, 255];
        	              })());
        	            }
        	          },
        	          hh.SIGACCESS({
        	            "signame":"groupe0OUT",
        	            "pre":true,
        	            "val":true,
        	            "cnt":false
        	          })
        	        ), // Fin emit
        		    hh.ATOM(
        		      {
        		      "%location":{},
        		      "%tag":"node",
        		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe0", false); }
        		      }
        		 	),

        	        hh.EMIT(
        	          {
        	            "%location":{},
        	            "%tag":"emit",
        	            "groupe2OUT":"groupe2OUT",
        	            "apply":function (){
        	              return ((() => {
        	                const groupe2OUT = this["groupe2OUT"];
        	                return [false, 255];
        	              })());
        	            }
        	          },
        	          hh.SIGACCESS({
        	            "signame":"groupe2OUT",
        	            "pre":true,
        	            "val":true,
        	            "cnt":false
        	          })
        	        ), // Fin emit
        		    hh.ATOM(
        		      {
        		      "%location":{},
        		      "%tag":"node",
        		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe2", false); }
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
        		          "trap935784":"trap935784",
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

      hh.RUN({
        "%location":{},
        "%tag":"run",
        "module": hh.getModule(  "transposition", {}),
        "tick":"",

      }),

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


        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              setTempo(100);
            }
          }
        ),

          hh.ATOM(
            {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                DAW.putPatternInQueue('Cello1');
              }
            }
          ),

          hh.ATOM(
            {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                DAW.putPatternInQueue('Cello1');
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

            hh.TRAP(
              {
                "trap464716":"trap464716",
                "%location":{},
                "%tag":"trap464716"
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
                    "groupe1OUT":"groupe1OUT",
                    "apply":function (){
                      return ((() => {
                        const groupe1OUT = this["groupe1OUT"];
                        return [true, 255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame":"groupe1OUT",
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
                      gcs.informSelecteurOnMenuChange(255," groupe1", true);
                    }
        		      }
        		 	  ),

                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "groupe2OUT":"groupe2OUT",
                    "apply":function (){
                      return ((() => {
                        const groupe2OUT = this["groupe2OUT"];
                        return [true, 255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame":"groupe2OUT",
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
                      gcs.informSelecteurOnMenuChange(255," groupe2", true);
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
        	              "countapply":function (){return 24;}
        	          },
        	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
        	        ),


        	        hh.EMIT(
        	          {
        	            "%location":{},
        	            "%tag":"emit",
        	            "groupe1OUT":"groupe1OUT",
        	            "apply":function (){
        	              return ((() => {
        	                const groupe1OUT = this["groupe1OUT"];
        	                return [false, 255];
        	              })());
        	            }
        	          },
        	          hh.SIGACCESS({
        	            "signame":"groupe1OUT",
        	            "pre":true,
        	            "val":true,
        	            "cnt":false
        	          })
        	        ), // Fin emit
        		    hh.ATOM(
        		      {
        		      "%location":{},
        		      "%tag":"node",
        		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe1", false); }
        		      }
        		 	),

        	        hh.EMIT(
        	          {
        	            "%location":{},
        	            "%tag":"emit",
        	            "groupe2OUT":"groupe2OUT",
        	            "apply":function (){
        	              return ((() => {
        	                const groupe2OUT = this["groupe2OUT"];
        	                return [false, 255];
        	              })());
        	            }
        	          },
        	          hh.SIGACCESS({
        	            "signame":"groupe2OUT",
        	            "pre":true,
        	            "val":true,
        	            "cnt":false
        	          })
        	        ), // Fin emit
        		    hh.ATOM(
        		      {
        		      "%location":{},
        		      "%tag":"node",
        		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe2", false); }
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
        		          "trap464716":"trap464716",
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


      hh.ABORT(
        {
          "%location":{abort: tick},
          "%tag":"abort",
          "immediate":false,
          "apply": function (){return ((() => {
              const tick=this["tick"];
              return tick.now;
          })());},
          "countapply":function (){ return 23;}
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
          "module": hh.getModule(  "transposition", {}),
          "tick":"",

        }),

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

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          setTempo(50);
        }
      }
    ),

          hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },


          hh.TRAP(
            {
              "trap387214":"trap387214",
              "%location":{},
              "%tag":"trap387214"
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
                  "groupe3OUT":"groupe3OUT",
                  "apply":function (){
                    return ((() => {
                      const groupe3OUT = this["groupe3OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"groupe3OUT",
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
                    gcs.informSelecteurOnMenuChange(255," groupe3", true);
                  }
      		      }
      		 	  ),

              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  "groupe4OUT":"groupe4OUT",
                  "apply":function (){
                    return ((() => {
                      const groupe4OUT = this["groupe4OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"groupe4OUT",
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
                    gcs.informSelecteurOnMenuChange(255," groupe4", true);
                  }
      		      }
      		 	  ),

              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  "groupe5OUT":"groupe5OUT",
                  "apply":function (){
                    return ((() => {
                      const groupe5OUT = this["groupe5OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"groupe5OUT",
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
                    gcs.informSelecteurOnMenuChange(255," groupe5", true);
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
      	              "countapply":function (){return 20;}
      	          },
      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
      	        ),


      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "groupe3OUT":"groupe3OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const groupe3OUT = this["groupe3OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"groupe3OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe3", false); }
      		      }
      		 	),

      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "groupe4OUT":"groupe4OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const groupe4OUT = this["groupe4OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"groupe4OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe4", false); }
      		      }
      		 	),

      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "groupe5OUT":"groupe5OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const groupe5OUT = this["groupe5OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"groupe5OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe5", false); }
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
      		          "trap387214":"trap387214",
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
          "countapply":function (){ return 20;}
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
          "module": hh.getModule(  "transposition", {}),
          "tick":"",

        }),

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

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          setTempo(40);
        }
      }
    ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('Violon8');
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('Alto10');
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('Cello8');
          }
        }
      ),

      hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            var msg = {
              type: 'alertInfoScoreON',
              value:'Fin Mars 2022'
            }
            serveur.broadcast(JSON.stringify(msg));
            }
          }
      ),

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {console.log('Fin Mars 2022');}
      }
    ),

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
