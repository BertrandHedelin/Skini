var timer, tick, groupe1, groupe3, groupe2, djembe, piano, groupe5, gaszi, groupe7, groupe6, groupe4;



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
      "apply":function () {console.log('Choose the drums ******');}
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

  hh.LOOP(
      {
        "%location":{loop: 1},
        "%tag":"loop"
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
                gcs.setComputeScoreClass(5);
              }
            }
          ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "djembeOUT": "djembeOUT",
              "apply":function (){
                return ((() => {
                  const djembeOUT = this["djembeOUT"];
                  return [true,2];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "djembeOUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(2 , "djembeOUT",true); }
            }
       	),

        hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              var msg = {
                type: 'alertInfoScoreON',
                value:'Djembe for group 0'
              }
              serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "groupe5OUT": "groupe5OUT",
              "apply":function (){
                return ((() => {
                  const groupe5OUT = this["groupe5OUT"];
                  return [true,0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "groupe5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(0 , "groupe5OUT",true); }
            }
       	),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {console.log('groupe5');}
        }
      ),

        hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":110},
              "%tag":"await",
              "immediate":false,
              "apply":function (){return ((() => {
                const groupe5IN =this["groupe5IN"];
                return groupe5IN.now;})());},
              "countapply":function (){return 1;}
          },
          hh.SIGACCESS({"signame":"groupe5IN","pre":false,"val":false,"cnt":false})
        ),

      hh.RUN({
        "%location":{},
        "%tag":"run",
        "module": hh.getModule(  "timer", {}),
        "tick":"",

      }),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "groupe5OUT": "groupe5OUT",
              "apply":function (){
                return ((() => {
                  const groupe5OUT = this["groupe5OUT"];
                  return [false,0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "groupe5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(0 , "groupe5OUT",false); }
            }
        ),

          hh.ATOM(
            {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                gcs.cleanChoiceList(0);
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
                value:'Djembe for group 1'
              }
              serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "groupe6OUT": "groupe6OUT",
              "apply":function (){
                return ((() => {
                  const groupe6OUT = this["groupe6OUT"];
                  return [true,1];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "groupe6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(1 , "groupe6OUT",true); }
            }
       	),

        hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":110},
              "%tag":"await",
              "immediate":false,
              "apply":function (){return ((() => {
                const groupe6IN =this["groupe6IN"];
                return groupe6IN.now;})());},
              "countapply":function (){return 1;}
          },
          hh.SIGACCESS({"signame":"groupe6IN","pre":false,"val":false,"cnt":false})
        ),

      hh.RUN({
        "%location":{},
        "%tag":"run",
        "module": hh.getModule(  "timer", {}),
        "tick":"",

      }),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "djembeOUT": "djembeOUT",
              "apply":function (){
                return ((() => {
                  const djembeOUT = this["djembeOUT"];
                  return [false,2];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "djembeOUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(2 , "djembeOUT",false); }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "groupe6OUT": "groupe6OUT",
              "apply":function (){
                return ((() => {
                  const groupe6OUT = this["groupe6OUT"];
                  return [false,1];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "groupe6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(1 , "groupe6OUT",false); }
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
                gcs.cleanChoiceList(1);
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
                gcs.setComputeScoreClass(7);
              }
            }
          ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "pianoOUT": "pianoOUT",
              "apply":function (){
                return ((() => {
                  const pianoOUT = this["pianoOUT"];
                  return [true,2];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "pianoOUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(2 , "pianoOUT",true); }
            }
       	),

        hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              var msg = {
                type: 'alertInfoScoreON',
                value:'Piano for group 0'
              }
              serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "groupe7OUT": "groupe7OUT",
              "apply":function (){
                return ((() => {
                  const groupe7OUT = this["groupe7OUT"];
                  return [true,0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "groupe7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(0 , "groupe7OUT",true); }
            }
       	),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {console.log('groupe7');}
        }
      ),

        hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":110},
              "%tag":"await",
              "immediate":false,
              "apply":function (){return ((() => {
                const groupe7IN =this["groupe7IN"];
                return groupe7IN.now;})());},
              "countapply":function (){return 1;}
          },
          hh.SIGACCESS({"signame":"groupe7IN","pre":false,"val":false,"cnt":false})
        ),

      hh.RUN({
        "%location":{},
        "%tag":"run",
        "module": hh.getModule(  "timer", {}),
        "tick":"",

      }),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "groupe7OUT": "groupe7OUT",
              "apply":function (){
                return ((() => {
                  const groupe7OUT = this["groupe7OUT"];
                  return [false,0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "groupe7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(0 , "groupe7OUT",false); }
            }
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
              "apply":function () {
                gcs.cleanChoiceList(0);
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
                value:'Piano for group 1'
              }
              serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "groupe7OUT": "groupe7OUT",
              "apply":function (){
                return ((() => {
                  const groupe7OUT = this["groupe7OUT"];
                  return [true,1];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "groupe7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(1 , "groupe7OUT",true); }
            }
       	),

        hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":110},
              "%tag":"await",
              "immediate":false,
              "apply":function (){return ((() => {
                const groupe7IN =this["groupe7IN"];
                return groupe7IN.now;})());},
              "countapply":function (){return 1;}
          },
          hh.SIGACCESS({"signame":"groupe7IN","pre":false,"val":false,"cnt":false})
        ),

      hh.RUN({
        "%location":{},
        "%tag":"run",
        "module": hh.getModule(  "timer", {}),
        "tick":"",

      }),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "groupe7OUT": "groupe7OUT",
              "apply":function (){
                return ((() => {
                  const groupe7OUT = this["groupe7OUT"];
                  return [false,1];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "groupe7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(1 , "groupe7OUT",false); }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "pianoOUT": "pianoOUT",
              "apply":function (){
                return ((() => {
                  const pianoOUT = this["pianoOUT"];
                  return [false,2];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "pianoOUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(2 , "pianoOUT",false); }
            }
        ),

          hh.ATOM(
            {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                DAW.cleanQueue(9);
              }
            }
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
                gcs.cleanChoiceList(1);
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
                gcs.setComputeScoreClass(1);
              }
            }
          ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "gasziOUT": "gasziOUT",
              "apply":function (){
                return ((() => {
                  const gasziOUT = this["gasziOUT"];
                  return [true,2];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "gasziOUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(2 , "gasziOUT",true); }
            }
       	),

        hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              var msg = {
                type: 'alertInfoScoreON',
                value:'Ney for group 0'
              }
              serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "groupe3OUT": "groupe3OUT",
              "apply":function (){
                return ((() => {
                  const groupe3OUT = this["groupe3OUT"];
                  return [true,0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "groupe3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(0 , "groupe3OUT",true); }
            }
       	),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {console.log('groupe3');}
        }
      ),

        hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":110},
              "%tag":"await",
              "immediate":false,
              "apply":function (){return ((() => {
                const groupe3IN =this["groupe3IN"];
                return groupe3IN.now;})());},
              "countapply":function (){return 1;}
          },
          hh.SIGACCESS({"signame":"groupe3IN","pre":false,"val":false,"cnt":false})
        ),

      hh.RUN({
        "%location":{},
        "%tag":"run",
        "module": hh.getModule(  "timer", {}),
        "tick":"",

      }),

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
              "groupe3OUT": "groupe3OUT",
              "apply":function (){
                return ((() => {
                  const groupe3OUT = this["groupe3OUT"];
                  return [false,0];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "groupe3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(0 , "groupe3OUT",false); }
            }
        ),

          hh.ATOM(
            {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                gcs.cleanChoiceList(0);
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
                value:'Ney for group 1'
              }
              serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "groupe4OUT": "groupe4OUT",
              "apply":function (){
                return ((() => {
                  const groupe4OUT = this["groupe4OUT"];
                  return [true,1];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "groupe4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(1 , "groupe4OUT",true); }
            }
       	),

        hh.AWAIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":110},
              "%tag":"await",
              "immediate":false,
              "apply":function (){return ((() => {
                const groupe4IN =this["groupe4IN"];
                return groupe4IN.now;})());},
              "countapply":function (){return 1;}
          },
          hh.SIGACCESS({"signame":"groupe4IN","pre":false,"val":false,"cnt":false})
        ),

      hh.RUN({
        "%location":{},
        "%tag":"run",
        "module": hh.getModule(  "timer", {}),
        "tick":"",

      }),

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
              "groupe4OUT": "groupe4OUT",
              "apply":function (){
                return ((() => {
                  const groupe4OUT = this["groupe4OUT"];
                  return [false,1];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "groupe4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(1 , "groupe4OUT",false); }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "gasziOUT": "gasziOUT",
              "apply":function (){
                return ((() => {
                  const gasziOUT = this["gasziOUT"];
                  return [false,2];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "gasziOUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(2 , "gasziOUT",false); }
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
                gcs.cleanChoiceList(1);
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
              type: 'refreshSceneScore',
            }
            serveur.broadcast(JSON.stringify(msg));
            }
          }
      ),

    	hh.ATOM(
    	  {
    	  "%location":{},
    	  "%tag":"node",
    	  "apply":function (){
    	    var msg = {
    	      type: 'alertInfoScoreON',
    	      value: " N°1 " + gcs.getWinnerPseudo(0) + " : " + gcs.getWinnerScore(0) + " "
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
    		  "apply":function (){return ((() => {
    		    const tick =this["tick"];
    		    return tick.now;})());},
    		  "countapply":function (){return 5;}
    		},
    		hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
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
    	"apply":function (){
    			var pseudoLoc = gcs.getWinnerPseudo(0);
    			if ( pseudoLoc !== ''){
    			    var msg = {
    			    type: 'alertInfoScoreON',
    			    value:  " N° " + 1 + " " + pseudoLoc + " with " + gcs.getWinnerScore(0) + " "
    			    }
    			    serveur.broadcast(JSON.stringify(msg));

    			}else{
    				console.log("WARN: hiphop_blocks.js: displayScore : no score for the rank 0");
    			}
    		}
    	}
    	),

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
    	  "apply":function (){
    	    var msg = {
    	      type: 'alertInfoScoreON',
    	      value: " Total score for all " + gcs.getTotalGameScore() + " "
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
    		  "apply":function (){return ((() => {
    		    const tick =this["tick"];
    		    return tick.now;})());},
    		  "countapply":function (){return 5;}
    		},
    		hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
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
