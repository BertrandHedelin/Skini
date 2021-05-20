var tankTest, tankTest2, groupe1, groupe2, groupe3, moduleTest, groupe4, groupe5, trap1, tick, stopReservoir, halt, djembe;



"use strict";
var hh = require("../hiphop/hiphop.js");
var par = require('../serveur/skiniParametres');
var gcs;
var DAW;
var serveur;

var debug = false;
var debug1 = true;

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
var halt, start, emptyQueueSignal, patternSignal, stopReservoir;
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
  var machine = new hh.ReactiveMachine( orchestration );
  return machine;
}
exports.setSignals = setSignals;


    // Module tank tankTest + groupe1
    tankTest = hh.MODULE({"id":"tankTest","%location":{},"%tag":"module"},
    hh.SIGNAL({"%location":{},"direction":"IN", "name":"groupe1IN"}),
      hh.SIGNAL({"%location":{},"direction":"IN", "name":"groupe2IN"}),
      hh.SIGNAL({"%location":{},"direction":"IN", "name":"groupe3IN"}),
      hh.SIGNAL({"%location":{},"direction":"OUT", "name":"groupe1OUT"}),
      hh.SIGNAL({"%location":{},"direction":"OUT", "name":"groupe2OUT"}),
      hh.SIGNAL({"%location":{},"direction":"OUT", "name":"groupe3OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "groupe1" );
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
          ), // Fin emit groupe1OUT true
        hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () {
                console.log("-- makeReservoir:  atom:", "groupe1OUT");
                gcs.informSelecteurOnMenuChange(255 , "groupe1OUT", true);
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
          ), // Fin emit groupe2OUT true
        hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () {
                console.log("-- makeReservoir:  atom:", "groupe2OUT");
                gcs.informSelecteurOnMenuChange(255 , "groupe2OUT", true);
              }
            }
        ),
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
                console.log("-- makeReservoir:  atom:", "groupe3OUT");
                gcs.informSelecteurOnMenuChange(255 , "groupe3OUT", true);
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
                  return [false, 255];
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
                  return [false, 255];
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
                  return [false, 255];
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
            console.log("--- FIN RESERVOIR:", "groupe1");
            var msg = {
            type: 'killTank',
            value:  "groupe1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank tankTest2 + groupe4
    tankTest2 = hh.MODULE({"id":"tankTest2","%location":{},"%tag":"module"},
    hh.SIGNAL({"%location":{},"direction":"IN", "name":"groupe4IN"}),
      hh.SIGNAL({"%location":{},"direction":"IN", "name":"groupe5IN"}),
      hh.SIGNAL({"%location":{},"direction":"OUT", "name":"groupe4OUT"}),
      hh.SIGNAL({"%location":{},"direction":"OUT", "name":"groupe5OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "groupe4" );
                var msg = {
                  type: 'startTank',
                  value:  "groupe4"
                }
                serveur.broadcast(JSON.stringify(msg));
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
                    const groupe4 = this["groupe4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"groupe4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit groupe4OUT true
        hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () {
                console.log("-- makeReservoir:  atom:", "groupe4OUT");
                gcs.informSelecteurOnMenuChange(255 , "groupe4OUT", true);
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
                    const groupe5 = this["groupe5OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"groupe5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit groupe5OUT true
        hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () {
                console.log("-- makeReservoir:  atom:", "groupe5OUT");
                gcs.informSelecteurOnMenuChange(255 , "groupe5OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:groupe4
        {
          "%location":{},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour groupe4
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
                  const groupe4IN  =this["groupe4IN"];
                  return groupe4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"groupe4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await groupe4IN
          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "groupe4OUT" : "groupe4OUT",
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
            }),
          ), // Fin emit groupe4OUT true
        ) // Fin sequence pour groupe4
  ,
        hh.SEQUENCE( // Debut sequence pour groupe5
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
                  const groupe5IN  =this["groupe5IN"];
                  return groupe5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"groupe5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await groupe5IN
          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "groupe5OUT" : "groupe5OUT",
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
            }),
          ), // Fin emit groupe5OUT true
        ) // Fin sequence pour groupe5
      ), // Fin fork de make await avec en premiere position:groupe4
      hh.EXIT(
        {
            "EXIT":"EXIT",
            "%location":{},
            "%tag":"break"
        })
      ) // Fin Abort
    ), // Fin Trap

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
          "groupe4OUT":"groupe4OUT",
          "apply":function (){
            return ((() => {
              const groupe4 = this["groupe4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"groupe4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit groupe4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "groupe5OUT":"groupe5OUT",
          "apply":function (){
            return ((() => {
              const groupe5 = this["groupe5OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"groupe5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit groupe5OUT false
    hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "groupe4", false);
            console.log("--- FIN RESERVOIR:", "groupe4");
            var msg = {
            type: 'killTank',
            value:  "groupe4"
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
              console.log("Début en attente d'abort");
              tickCounter = 0;
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
          DAW.putPatternInQueue('Percu4');
        }
      }
    ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {console.log('Début Orchestration');}
    }
  ),

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


      hh.RUN({
          "%location":{"filename":"","pos":1},
          "%tag":"run",
          "module": hh.getModule("tankTest", {"filename":"","pos":2}),
          "autocomplete":true
        }),

      /*  hh.PAUSE(
          {
            "%location":{},
            "%tag":"yield"
          }
        ),*/


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

      hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "stopReservoir":"stopReservoir",
          "apply":function (){
            return ((() => {
              const stopReservoir = this["stopReservoir"];
              return 0;
            })());
          }
        },
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
