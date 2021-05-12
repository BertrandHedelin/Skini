var halt, start, djembe, groupe1, tick;



"use strict";
var hh = require("../hiphop/hiphop.js");
var par = require('../serveur/skiniParametres');
var gcs;
var DAW;

var debug = false;
var debug1 = true;

//var serveur;

function setServ(ser, daw, groupeCS){
  console.log("setServ");
  DAW = daw;
  serveur = ser;
  gcs = groupeCS;
}
exports.setServ = setServ;

// Création des signaux OUT de contrôle de la matrice des possibles
// Ici et immédiatement.
var signals = [];

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
  if(debug) console.log("orchestrationHH: setSignals: ", signals);
  var machine = new hh.ReactiveMachine( orchestration );
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
             gcs.setpatternListLength([5,255]);
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            gcs.setComputeScorePolicy(1);
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            gcs.setComputeScoreClass(1);
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
        DAW.pauseQueues();
      }
    }
  ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        DAW.resumeQueues();
      }
    }
  ),
      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.pauseQueue(1);
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.resumeQueue(1);
          }
        }
      ),


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

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {console.log('Début en attente d\'abort');}
      }
    ),

    hh.AWAIT(
      {
        "%location":{},
        "%tag":"await",
        "immediate":false,
        "apply":function () {
          return ((() => {
            const start=this["start"];
            return start.now;
          })());
        },
        "countapply":function (){ return 1;}
      },
      hh.SIGACCESS({
        "signame":"start",
        "pre":false,
        "val":false,
        "cnt":false
      })
    ),

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {console.log('Debut apres start');}
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
                return [true,255];
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
          "apply":function () { gcs.informSelecteurOnMenuChange(255 , "djembeOUT",true); }
          }
      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "groupe1OUT": "groupe1OUT",
            "apply":function (){
              return ((() => {
                const groupe1OUT = this["groupe1OUT"];
                return [true,255];
              })());
            }
          },
          hh.SIGACCESS({
            "signame": "groupe1OUT",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),
        hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () { gcs.informSelecteurOnMenuChange(255 , "groupe1OUT",true); }
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
        "countapply":function (){ return 15;}
      },
      hh.SIGACCESS({
        "signame":"tick",
        "pre":false,
        "val":false,
        "cnt":false
      })
    ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "djembeOUT": "djembeOUT",
            "apply":function (){
              return ((() => {
                const djembeOUT = this["djembeOUT"];
                return [false,255];
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
          "apply":function () { gcs.informSelecteurOnMenuChange(255 , "djembeOUT",false); }
          }
      ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              gcs.cleanChoiceList(255);
            }
          }
        ),


    hh.EVERY(
      {
          "%location":{},
          "%tag":"every",
          "immediate":false,
          "apply": function (){return ((() => {
                const tick = this["tick"];
                return tick.now;
          })());},
          "countapply":function (){ return 1;}
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
          "apply":function () {console.log('Every tick');}
        }
      ),

    ),

  ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        gcs.resetMatrice();
      }
    }
  ),


);
exports.orchestration = orchestration;
