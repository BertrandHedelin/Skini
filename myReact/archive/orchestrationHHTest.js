var tankTest, moduleTest, groupe1, groupe2, groupe3, halt, start, djembe, tick;



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
var signalsText = [];

for (var i=0; i < par.groupesDesSons.length; i++) {
  var signame = par.groupesDesSons[i][0] + "OUT";
  signalsText.push(signame);

  var signal = hh.SIGNAL({
    "%location":{},
    "direction":"OUT",
    "name":signame,
    "init_func":function (){return [false, -1];}
  });
  signals.push(signal);
}

// Création des signaux IN de sélection de patterns
for (var i=0; i < par.groupesDesSons.length; i++) {
  var signame = par.groupesDesSons[i][0] + "IN";
  signalsText.push(signame);

  var signal = hh.SIGNAL({
    "%location":{},
    "direction":"IN",
    "name":signame
  });
  signals.push(signal);
}

function setSignals(){
  if(debug) console.log("orchestrationHH: setSignals: ", signals);
  var machine = new hh.ReactiveMachine( orchestration );
  return machine;
}
exports.setSignals = setSignals;


      tankTest  = hh.MODULE({"id":"  tankTest ","%location":{},"%tag":"module"},
    hh.SIGNAL({"%location":{},"direction":"IN", "name":"groupe1IN"}),
      hh.SIGNAL({"%location":{},"direction":"IN", "name":"groupe2IN"}),
      hh.SIGNAL({"%location":{},"direction":"IN", "name":"groupe3IN"}),
      hh.SIGNAL({"%location":{},"direction":"IN", "name":"stopReservoir"}),
    hh.TRAP(
    {
      "EXIT":"EXIT",
      "%location":{},
      "%tag":"EXIT"
    },
      hh.ABORT({
        "%location":{},
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
            "%location":{},
            "%tag":"node",
            "apply":function () {
                console.log("--- MAKE RESERVOIR:", groupe1 );
              var msg = {
                type: 'startTank',
                value:  "groupe1"
              }
              serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "groupe1OUT":"groupe1OUT",
                "apply":function (){
                  return ((() => {
                    const groupe1 = this["groupe1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"groupe1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit groupe1OUT true,
        hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "groupe2OUT":"groupe2OUT",
                "apply":function (){
                  return ((() => {
                    const groupe2 = this["groupe2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"groupe2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit groupe2OUT true,
        hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "groupe3OUT":"groupe3OUT",
                "apply":function (){
                  return ((() => {
                    const groupe3 = this["groupe3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"groupe3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit groupe3OUT true
        hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () {
                gcs.informSelecteurOnMenuChange(255 , "groupe1", true);
              }
            }
        ),

        hh.FORK( // debut du fork de makeAwait avec en premiere position:groupe1
        {
          "%location":{},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour groupe1
        {
          "%location":{},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const groupe1IN  =this["groupe1IN"];
                  return groupe1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"groupe1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await groupe1IN
          hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "groupe1OUT" : "groupe1OUT",
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
            }),
          ), // Fin emit groupe1OUT true
        ) // Fin sequence pour groupe1
  ,
        hh.SEQUENCE( // Debut sequence pour groupe2
        {
          "%location":{},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const groupe2IN  =this["groupe2IN"];
                  return groupe2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"groupe2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await groupe2IN
          hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "groupe2OUT" : "groupe2OUT",
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
            }),
          ), // Fin emit groupe2OUT true
        ) // Fin sequence pour groupe2
  ,
        hh.SEQUENCE( // Debut sequence pour groupe3
        {
          "%location":{},
          "%tag":"seq"
        },
          hh.AWAIT(
            {
              "%location":{},
              "%tag":"await",
              "immediate":false,
              "apply":function (){
                return ((() => {
                  const groupe3IN  =this["groupe3IN"];
                  return groupe3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"groupe3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await groupe3IN
          hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "groupe3OUT" : "groupe3OUT",
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
            }),
          ), // Fin emit groupe3OUT true
        ) // Fin sequence pour groupe3
      ), // Fin fork de make await avec en premiere position:groupe1
      hh.EXIT(
        {
            "EXIT":"EXIT",
            "%location":{},
            "%tag":"break"
        })
      ) // Fin Abort
    ), // Fin Trap


    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "groupe1OUT":"groupe1OUT",
          "apply":function (){
            return ((() => {
              const groupe1 = this["groupe1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"groupe1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit groupe1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "groupe2OUT":"groupe2OUT",
          "apply":function (){
            return ((() => {
              const groupe2 = this["groupe2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"groupe2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit groupe2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "groupe3OUT":"groupe3OUT",
          "apply":function (){
            return ((() => {
              const groupe3 = this["groupe3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"groupe3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit groupe3OUT false
    hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "groupe1", false);
            console.log("--- ABORT RESERVOIR:", groupe1);
            var msg = {
            type: 'killTank',
            value:  "groupe1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

  moduleTest = hh.MODULE({"id":"moduleTest","%location":{},"%tag":"module"},


    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {console.log('Module de Test');}
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




  hh.RUN({
    "%location":{},
    "%tag":"run",
    "module": hh.getModule(  "moduleTest", {}),
    "''":"",

  }),


);
exports.orchestration = orchestration;
