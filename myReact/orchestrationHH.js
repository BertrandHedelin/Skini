var timer, tick, boucle1, groupe1, groupe3, groupe2, soloTrompette;



"use strict";
var hh = require("../hiphop/hiphop.js");
var par = require('../serveur/skiniParametres');
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

function setServ(ser, daw, groupeCS, oscMidi){
  //console.log("hh_ORCHESTRATION: setServ");
  DAW = daw;
  serveur = ser;
  gcs = groupeCS;
  oscMidiLocal = oscMidi;
}
exports.setServ = setServ;

function setTempo(value){
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

  var signal = hh.SIGNAL({
    "%location":{},
    "direction":"IN",
    "name":signalName
  });
  signals.push(signal);
}

function setSignals(){
  var machine = new hh.ReactiveMachine( orchestration, {sweep:true});
  console.log("nets",machine.nets.length);

  return machine;
}
exports.setSignals = setSignals;


  timer = hh.MODULE({"id":"timer","%location":{},"%tag":"module"},

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"tick"
      }),


      hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            var msg = {
              type: 'alertInfoScoreON',
              value:'Still 10s to play'
            }
            serveur.broadcast(JSON.stringify(msg));
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
            var msg = {
              type: 'alertInfoScoreON',
              value:'8s to play'
            }
            serveur.broadcast(JSON.stringify(msg));
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
            var msg = {
              type: 'alertInfoScoreON',
              value:'6s to play'
            }
            serveur.broadcast(JSON.stringify(msg));
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
            var msg = {
              type: 'alertInfoScoreON',
              value:'4s to play'
            }
            serveur.broadcast(JSON.stringify(msg));
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
            var msg = {
              type: 'alertInfoScoreON',
              value:'2s to play'
            }
            serveur.broadcast(JSON.stringify(msg));
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
            var msg = {
              type: 'alertInfoScoreOFF',
            }
            serveur.broadcast(JSON.stringify(msg));
            }
          }
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

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {console.log('Choose the drums');}
    }
  ),

    hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          var msg = {
            type: 'alertInfoScoreON',
            value:'Choose the drums'
          }
          serveur.broadcast(JSON.stringify(msg));
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
            gcs.setComputeScorePolicy(2);
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


      hh.FORK(
          {
            "%location":{},
            "%tag":"fork"
          },


  hh.EVERY(
    {
      "%location":{every: tick},
      "%tag":"do/every",
      "immediate":false,
      "apply": function (){return ((() => {
          const tick=this["tick"];
          return tick.now;
      })());},
      "countapply":function (){ return 8;}
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
            DAW.putPatternInQueue('Mancini');
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('Silverstri');
          }
        }
      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "boucle1":"boucle1",
            "apply":function (){
              return ((() => {
                //const boucle1=this["boucle1"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"boucle1",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),

  ),

  hh.EVERY(
    {
      "%location":{every: boucle1},
      "%tag":"do/every",
      "immediate":false,
      "apply": function (){return ((() => {
          const boucle1=this["boucle1"];
          return boucle1.now;
      })());},
      "countapply":function (){ return 2;}
    },
    hh.SIGACCESS({
      "signame":"boucle1",
      "pre":false,
      "val":false,
      "cnt":false
    }),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('Rota');
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('Rota');
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('Geoffry');
          }
        }
      ),

  ),

  hh.RUN({
    "%location":{},
    "%tag":"run",
    "module": hh.getModule(  "soloTrompette", {}),
    "''":"",

  }),

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
          DAW.putPatternInQueue('Morricone');
        }
      }
    ),

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          DAW.putPatternInQueue('Rosenman');
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
      "countapply":function (){ return 8;}
    },
    hh.SIGACCESS({
      "signame":"tick",
      "pre":false,
      "val":false,
      "cnt":false
    })
  ),

  ),
