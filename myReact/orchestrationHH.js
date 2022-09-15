var foo, OSCNOTEON, OSCNOTEOF;



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


    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"foo"
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"OSCNOTEON"
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"OSCNOTEOF"
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
      "apply":function () {
        oscMidiLocal.sendOSCGame(
        'TOTO',
        10,
        par.portOSCToGame,
        par.remoteIPAddressGame);
        }
      }
    ),

        hh.AWAIT(
          {
            "%location":{"filename":"hiphop_blocks.js","pos":189},
            "%tag":"await",
            "immediate":false,
            "apply":function (){
              return ((() => {
                const OSCNOTEON=this["OSCNOTEON"];
                return (OSCNOTEON.now  && OSCNOTEON.nowval === 0);
              })());
            },
            "countapply":function (){ return 1;}
          },
          hh.SIGACCESS(
            {"signame":"OSCNOTEON",
            "pre":false,
            "val":false,
            "cnt":false
          })
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
              "foo":"foo",
              "apply":function (){
                return ((() => {
                  //const foo=this["foo"];
                  return 0;
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"foo",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),

        hh.AWAIT(
          {
            "%location":{},
            "%tag":"await",
            "immediate":true,
            "apply":function () {
              return ((() => {
                const foo=this["foo"];
                return foo.now;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"foo",
            "pre":false,
            "val":false,
            "cnt":false
          })
        ),

      hh.PAUSE(
        {
          "%location":{},
          "%tag":"yield"
        }
      ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "foo":"foo",
              "apply":function (){
                return ((() => {
                  //const foo=this["foo"];
                  return 11;
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"foo",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),

      hh.PAUSE(
        {
          "%location":{},
          "%tag":"yield"
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {console.log('foo');}
        }
      ),

      ),

          hh.SEQUENCE(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                "%tag":"seq"
              },


            hh.AWAIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":189},
                "%tag":"await",
                "immediate":false,
                "apply":function (){
                  return ((() => {
                    const foo=this["foo"];
                    return (foo.now  && foo.nowval === 11);
                  })());
                },
                "countapply":function (){ return 1;}
              },
              hh.SIGACCESS(
                {"signame":"foo",
                "pre":false,
                "val":false,
                "cnt":false
              })
            ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {console.log('foo 11');}
        }
      ),

      ),


    hh.LOOPEACH(
      {
        "%location":{loopeach: OSCNOTEON},
        "%tag":"do/every",
        "immediate":false,
        "apply": function (){return ((() => {
            const OSCNOTEON=this["OSCNOTEON"];
            return OSCNOTEON.now;
        })());},
        "countapply":function (){ return 1;}
      },
      hh.SIGACCESS({
        "signame":"OSCNOTEON",
        "pre":false,
        "val":false,
        "cnt":false
      }),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {console.log('OSC NOTE ON');}
        }
      ),

        hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            oscMidiLocal.sendOSCGame(
            'TOTO/TITI',
            10,
            par.portOSCToGame,
            par.remoteIPAddressGame);
            }
          }
        ),

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
