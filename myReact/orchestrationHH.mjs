var type0, StartTransSaxo, type1, T72, T56, T75, T40, T83, T18, type2, T6, T82, T39, T73, T3, T45, type3, T59, T42, T54, T16, T28, T62, type4, T25, T74, T1, T68, T53, T38, type5, T81, T14, T65, T29, T37, T4, type6, T41, T7, T43, T55, T17, T27, type7, tick, T89, T26, T15, T2, T44, T52, type8, T13, T71, T80, T61, T70, T94, type9, T36, T76, T9, T22, T63, T11, type10, transposeClavier, type11, type12, type13, type14, type15, T5, T20, T34, T67, T85, T92, T46, T64, T93, T49, T32, T24, T79, T84, T48, T77, T96, T86, T30, T8, T69, T57, T12, T51, T95, T35, T58, T87, T23, T60, T19, T47, T90, T33, T50, T78, T66, T88, T21, T10, T91, T31, TransSaxo;


// Les patterns de cette pièce sont organisés par types et sont dans des réservoirs.
// On a donc un contrôle sur la construction des phrases musicales.
// Le simulateur a des contraintes sur les timers : 3000 min et
// 3010 max avec 20 pulse max d'attente. Ceci permet de faire appel
// aux tanks en contrôlant/limitant les répétitions de patterns.
// Si le simulateur va trop vite, il peut rappeler un
// pattern avant qu'il ait été dévalidé sur le serveur,
// surtout quand le paramètre reactOnPlay est actif.
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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


    // Module tank type0 + T72
    type0 = hh.MODULE({"id":"type0","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T72IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T56IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T75IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T40IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T83IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T18IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T72OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T56OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T75OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T40OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T83OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T18OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "T72" );
                var msg = {
                  type: 'startTank',
                  value:  "T72"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T72OUT":"T72OUT",
                "apply":function (){
                  return ((() => {
                    const T72 = this["T72OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T72OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T72OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T72OUT");
                gcs.informSelecteurOnMenuChange(255 , "T72OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T56OUT":"T56OUT",
                "apply":function (){
                  return ((() => {
                    const T56 = this["T56OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T56OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T56OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T56OUT");
                gcs.informSelecteurOnMenuChange(255 , "T56OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T75OUT":"T75OUT",
                "apply":function (){
                  return ((() => {
                    const T75 = this["T75OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T75OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T75OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T75OUT");
                gcs.informSelecteurOnMenuChange(255 , "T75OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T40OUT":"T40OUT",
                "apply":function (){
                  return ((() => {
                    const T40 = this["T40OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T40OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T40OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T40OUT");
                gcs.informSelecteurOnMenuChange(255 , "T40OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T83OUT":"T83OUT",
                "apply":function (){
                  return ((() => {
                    const T83 = this["T83OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T83OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T83OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T83OUT");
                gcs.informSelecteurOnMenuChange(255 , "T83OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T18OUT":"T18OUT",
                "apply":function (){
                  return ((() => {
                    const T18 = this["T18OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T18OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T18OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T18OUT");
                gcs.informSelecteurOnMenuChange(255 , "T18OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:T72
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour T72
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
                  const T72IN  =this["T72IN"];
                  return T72IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T72IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T72IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T72OUT" : "T72OUT",
              "apply":function (){
                return ((() => {
                  const T72OUT = this["T72OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T72OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T72OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T72OUT");
                gcs.informSelecteurOnMenuChange(255 , "T72OUT", false);
              }
            }
          )
        ) // Fin sequence pour T72
  ,
        hh.SEQUENCE( // Debut sequence pour T56
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
                  const T56IN  =this["T56IN"];
                  return T56IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T56IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T56IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T56OUT" : "T56OUT",
              "apply":function (){
                return ((() => {
                  const T56OUT = this["T56OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T56OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T56OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T56OUT");
                gcs.informSelecteurOnMenuChange(255 , "T56OUT", false);
              }
            }
          )
        ) // Fin sequence pour T56
  ,
        hh.SEQUENCE( // Debut sequence pour T75
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
                  const T75IN  =this["T75IN"];
                  return T75IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T75IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T75IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T75OUT" : "T75OUT",
              "apply":function (){
                return ((() => {
                  const T75OUT = this["T75OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T75OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T75OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T75OUT");
                gcs.informSelecteurOnMenuChange(255 , "T75OUT", false);
              }
            }
          )
        ) // Fin sequence pour T75
  ,
        hh.SEQUENCE( // Debut sequence pour T40
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
                  const T40IN  =this["T40IN"];
                  return T40IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T40IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T40IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T40OUT" : "T40OUT",
              "apply":function (){
                return ((() => {
                  const T40OUT = this["T40OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T40OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T40OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T40OUT");
                gcs.informSelecteurOnMenuChange(255 , "T40OUT", false);
              }
            }
          )
        ) // Fin sequence pour T40
  ,
        hh.SEQUENCE( // Debut sequence pour T83
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
                  const T83IN  =this["T83IN"];
                  return T83IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T83IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T83IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T83OUT" : "T83OUT",
              "apply":function (){
                return ((() => {
                  const T83OUT = this["T83OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T83OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T83OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T83OUT");
                gcs.informSelecteurOnMenuChange(255 , "T83OUT", false);
              }
            }
          )
        ) // Fin sequence pour T83
  ,
        hh.SEQUENCE( // Debut sequence pour T18
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
                  const T18IN  =this["T18IN"];
                  return T18IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T18IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T18IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T18OUT" : "T18OUT",
              "apply":function (){
                return ((() => {
                  const T18OUT = this["T18OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T18OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T18OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T18OUT");
                gcs.informSelecteurOnMenuChange(255 , "T18OUT", false);
              }
            }
          )
        ) // Fin sequence pour T18
      ), // Fin fork de make await avec en premiere position:T72
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
          "T72OUT":"T72OUT",
          "apply":function (){
            return ((() => {
              const T72 = this["T72OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T72OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T72OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T56OUT":"T56OUT",
          "apply":function (){
            return ((() => {
              const T56 = this["T56OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T56OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T56OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T75OUT":"T75OUT",
          "apply":function (){
            return ((() => {
              const T75 = this["T75OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T75OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T75OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T40OUT":"T40OUT",
          "apply":function (){
            return ((() => {
              const T40 = this["T40OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T40OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T40OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T83OUT":"T83OUT",
          "apply":function (){
            return ((() => {
              const T83 = this["T83OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T83OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T83OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T18OUT":"T18OUT",
          "apply":function (){
            return ((() => {
              const T18 = this["T18OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T18OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T18OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "T72", false);
            console.log("--- FIN RESERVOIR:", "T72");
            var msg = {
            type: 'killTank',
            value:  "T72"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank type1 + T6
    type1 = hh.MODULE({"id":"type1","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T82IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T39IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T73IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T45IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T82OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T39OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T73OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T45OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "T6" );
                var msg = {
                  type: 'startTank',
                  value:  "T6"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T6OUT":"T6OUT",
                "apply":function (){
                  return ((() => {
                    const T6 = this["T6OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T6OUT");
                gcs.informSelecteurOnMenuChange(255 , "T6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T82OUT":"T82OUT",
                "apply":function (){
                  return ((() => {
                    const T82 = this["T82OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T82OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T82OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T82OUT");
                gcs.informSelecteurOnMenuChange(255 , "T82OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T39OUT":"T39OUT",
                "apply":function (){
                  return ((() => {
                    const T39 = this["T39OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T39OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T39OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T39OUT");
                gcs.informSelecteurOnMenuChange(255 , "T39OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T73OUT":"T73OUT",
                "apply":function (){
                  return ((() => {
                    const T73 = this["T73OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T73OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T73OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T73OUT");
                gcs.informSelecteurOnMenuChange(255 , "T73OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T3OUT":"T3OUT",
                "apply":function (){
                  return ((() => {
                    const T3 = this["T3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T3OUT");
                gcs.informSelecteurOnMenuChange(255 , "T3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T45OUT":"T45OUT",
                "apply":function (){
                  return ((() => {
                    const T45 = this["T45OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T45OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T45OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T45OUT");
                gcs.informSelecteurOnMenuChange(255 , "T45OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:T6
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour T6
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
                  const T6IN  =this["T6IN"];
                  return T6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T6OUT" : "T6OUT",
              "apply":function (){
                return ((() => {
                  const T6OUT = this["T6OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T6OUT");
                gcs.informSelecteurOnMenuChange(255 , "T6OUT", false);
              }
            }
          )
        ) // Fin sequence pour T6
  ,
        hh.SEQUENCE( // Debut sequence pour T82
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
                  const T82IN  =this["T82IN"];
                  return T82IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T82IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T82IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T82OUT" : "T82OUT",
              "apply":function (){
                return ((() => {
                  const T82OUT = this["T82OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T82OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T82OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T82OUT");
                gcs.informSelecteurOnMenuChange(255 , "T82OUT", false);
              }
            }
          )
        ) // Fin sequence pour T82
  ,
        hh.SEQUENCE( // Debut sequence pour T39
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
                  const T39IN  =this["T39IN"];
                  return T39IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T39IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T39IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T39OUT" : "T39OUT",
              "apply":function (){
                return ((() => {
                  const T39OUT = this["T39OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T39OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T39OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T39OUT");
                gcs.informSelecteurOnMenuChange(255 , "T39OUT", false);
              }
            }
          )
        ) // Fin sequence pour T39
  ,
        hh.SEQUENCE( // Debut sequence pour T73
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
                  const T73IN  =this["T73IN"];
                  return T73IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T73IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T73IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T73OUT" : "T73OUT",
              "apply":function (){
                return ((() => {
                  const T73OUT = this["T73OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T73OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T73OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T73OUT");
                gcs.informSelecteurOnMenuChange(255 , "T73OUT", false);
              }
            }
          )
        ) // Fin sequence pour T73
  ,
        hh.SEQUENCE( // Debut sequence pour T3
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
                  const T3IN  =this["T3IN"];
                  return T3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T3OUT" : "T3OUT",
              "apply":function (){
                return ((() => {
                  const T3OUT = this["T3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T3OUT");
                gcs.informSelecteurOnMenuChange(255 , "T3OUT", false);
              }
            }
          )
        ) // Fin sequence pour T3
  ,
        hh.SEQUENCE( // Debut sequence pour T45
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
                  const T45IN  =this["T45IN"];
                  return T45IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T45IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T45IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T45OUT" : "T45OUT",
              "apply":function (){
                return ((() => {
                  const T45OUT = this["T45OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T45OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T45OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T45OUT");
                gcs.informSelecteurOnMenuChange(255 , "T45OUT", false);
              }
            }
          )
        ) // Fin sequence pour T45
      ), // Fin fork de make await avec en premiere position:T6
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
          "T6OUT":"T6OUT",
          "apply":function (){
            return ((() => {
              const T6 = this["T6OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T82OUT":"T82OUT",
          "apply":function (){
            return ((() => {
              const T82 = this["T82OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T82OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T82OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T39OUT":"T39OUT",
          "apply":function (){
            return ((() => {
              const T39 = this["T39OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T39OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T39OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T73OUT":"T73OUT",
          "apply":function (){
            return ((() => {
              const T73 = this["T73OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T73OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T73OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T3OUT":"T3OUT",
          "apply":function (){
            return ((() => {
              const T3 = this["T3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T45OUT":"T45OUT",
          "apply":function (){
            return ((() => {
              const T45 = this["T45OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T45OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T45OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "T6", false);
            console.log("--- FIN RESERVOIR:", "T6");
            var msg = {
            type: 'killTank',
            value:  "T6"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank type2 + T59
    type2 = hh.MODULE({"id":"type2","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T59IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T42IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T54IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T16IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T28IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T62IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T59OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T42OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T54OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T16OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T28OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T62OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "T59" );
                var msg = {
                  type: 'startTank',
                  value:  "T59"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T59OUT":"T59OUT",
                "apply":function (){
                  return ((() => {
                    const T59 = this["T59OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T59OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T59OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T59OUT");
                gcs.informSelecteurOnMenuChange(255 , "T59OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T42OUT":"T42OUT",
                "apply":function (){
                  return ((() => {
                    const T42 = this["T42OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T42OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T42OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T42OUT");
                gcs.informSelecteurOnMenuChange(255 , "T42OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T54OUT":"T54OUT",
                "apply":function (){
                  return ((() => {
                    const T54 = this["T54OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T54OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T54OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T54OUT");
                gcs.informSelecteurOnMenuChange(255 , "T54OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T16OUT":"T16OUT",
                "apply":function (){
                  return ((() => {
                    const T16 = this["T16OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T16OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T16OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T16OUT");
                gcs.informSelecteurOnMenuChange(255 , "T16OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T28OUT":"T28OUT",
                "apply":function (){
                  return ((() => {
                    const T28 = this["T28OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T28OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T28OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T28OUT");
                gcs.informSelecteurOnMenuChange(255 , "T28OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T62OUT":"T62OUT",
                "apply":function (){
                  return ((() => {
                    const T62 = this["T62OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T62OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T62OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T62OUT");
                gcs.informSelecteurOnMenuChange(255 , "T62OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:T59
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour T59
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
                  const T59IN  =this["T59IN"];
                  return T59IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T59IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T59IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T59OUT" : "T59OUT",
              "apply":function (){
                return ((() => {
                  const T59OUT = this["T59OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T59OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T59OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T59OUT");
                gcs.informSelecteurOnMenuChange(255 , "T59OUT", false);
              }
            }
          )
        ) // Fin sequence pour T59
  ,
        hh.SEQUENCE( // Debut sequence pour T42
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
                  const T42IN  =this["T42IN"];
                  return T42IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T42IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T42IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T42OUT" : "T42OUT",
              "apply":function (){
                return ((() => {
                  const T42OUT = this["T42OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T42OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T42OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T42OUT");
                gcs.informSelecteurOnMenuChange(255 , "T42OUT", false);
              }
            }
          )
        ) // Fin sequence pour T42
  ,
        hh.SEQUENCE( // Debut sequence pour T54
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
                  const T54IN  =this["T54IN"];
                  return T54IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T54IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T54IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T54OUT" : "T54OUT",
              "apply":function (){
                return ((() => {
                  const T54OUT = this["T54OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T54OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T54OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T54OUT");
                gcs.informSelecteurOnMenuChange(255 , "T54OUT", false);
              }
            }
          )
        ) // Fin sequence pour T54
  ,
        hh.SEQUENCE( // Debut sequence pour T16
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
                  const T16IN  =this["T16IN"];
                  return T16IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T16IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T16IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T16OUT" : "T16OUT",
              "apply":function (){
                return ((() => {
                  const T16OUT = this["T16OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T16OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T16OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T16OUT");
                gcs.informSelecteurOnMenuChange(255 , "T16OUT", false);
              }
            }
          )
        ) // Fin sequence pour T16
  ,
        hh.SEQUENCE( // Debut sequence pour T28
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
                  const T28IN  =this["T28IN"];
                  return T28IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T28IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T28IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T28OUT" : "T28OUT",
              "apply":function (){
                return ((() => {
                  const T28OUT = this["T28OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T28OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T28OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T28OUT");
                gcs.informSelecteurOnMenuChange(255 , "T28OUT", false);
              }
            }
          )
        ) // Fin sequence pour T28
  ,
        hh.SEQUENCE( // Debut sequence pour T62
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
                  const T62IN  =this["T62IN"];
                  return T62IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T62IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T62IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T62OUT" : "T62OUT",
              "apply":function (){
                return ((() => {
                  const T62OUT = this["T62OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T62OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T62OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T62OUT");
                gcs.informSelecteurOnMenuChange(255 , "T62OUT", false);
              }
            }
          )
        ) // Fin sequence pour T62
      ), // Fin fork de make await avec en premiere position:T59
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
          "T59OUT":"T59OUT",
          "apply":function (){
            return ((() => {
              const T59 = this["T59OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T59OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T59OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T42OUT":"T42OUT",
          "apply":function (){
            return ((() => {
              const T42 = this["T42OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T42OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T42OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T54OUT":"T54OUT",
          "apply":function (){
            return ((() => {
              const T54 = this["T54OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T54OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T54OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T16OUT":"T16OUT",
          "apply":function (){
            return ((() => {
              const T16 = this["T16OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T16OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T16OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T28OUT":"T28OUT",
          "apply":function (){
            return ((() => {
              const T28 = this["T28OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T28OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T28OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T62OUT":"T62OUT",
          "apply":function (){
            return ((() => {
              const T62 = this["T62OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T62OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T62OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "T59", false);
            console.log("--- FIN RESERVOIR:", "T59");
            var msg = {
            type: 'killTank',
            value:  "T59"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank type3 + T25
    type3 = hh.MODULE({"id":"type3","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T25IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T74IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T68IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T53IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T38IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T25OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T74OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T68OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T53OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T38OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "T25" );
                var msg = {
                  type: 'startTank',
                  value:  "T25"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T25OUT":"T25OUT",
                "apply":function (){
                  return ((() => {
                    const T25 = this["T25OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T25OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T25OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T25OUT");
                gcs.informSelecteurOnMenuChange(255 , "T25OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T74OUT":"T74OUT",
                "apply":function (){
                  return ((() => {
                    const T74 = this["T74OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T74OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T74OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T74OUT");
                gcs.informSelecteurOnMenuChange(255 , "T74OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T1OUT":"T1OUT",
                "apply":function (){
                  return ((() => {
                    const T1 = this["T1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T1OUT");
                gcs.informSelecteurOnMenuChange(255 , "T1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T68OUT":"T68OUT",
                "apply":function (){
                  return ((() => {
                    const T68 = this["T68OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T68OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T68OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T68OUT");
                gcs.informSelecteurOnMenuChange(255 , "T68OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T53OUT":"T53OUT",
                "apply":function (){
                  return ((() => {
                    const T53 = this["T53OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T53OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T53OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T53OUT");
                gcs.informSelecteurOnMenuChange(255 , "T53OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T38OUT":"T38OUT",
                "apply":function (){
                  return ((() => {
                    const T38 = this["T38OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T38OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T38OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T38OUT");
                gcs.informSelecteurOnMenuChange(255 , "T38OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:T25
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour T25
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
                  const T25IN  =this["T25IN"];
                  return T25IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T25IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T25IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T25OUT" : "T25OUT",
              "apply":function (){
                return ((() => {
                  const T25OUT = this["T25OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T25OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T25OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T25OUT");
                gcs.informSelecteurOnMenuChange(255 , "T25OUT", false);
              }
            }
          )
        ) // Fin sequence pour T25
  ,
        hh.SEQUENCE( // Debut sequence pour T74
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
                  const T74IN  =this["T74IN"];
                  return T74IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T74IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T74IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T74OUT" : "T74OUT",
              "apply":function (){
                return ((() => {
                  const T74OUT = this["T74OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T74OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T74OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T74OUT");
                gcs.informSelecteurOnMenuChange(255 , "T74OUT", false);
              }
            }
          )
        ) // Fin sequence pour T74
  ,
        hh.SEQUENCE( // Debut sequence pour T1
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
                  const T1IN  =this["T1IN"];
                  return T1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T1OUT" : "T1OUT",
              "apply":function (){
                return ((() => {
                  const T1OUT = this["T1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T1OUT");
                gcs.informSelecteurOnMenuChange(255 , "T1OUT", false);
              }
            }
          )
        ) // Fin sequence pour T1
  ,
        hh.SEQUENCE( // Debut sequence pour T68
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
                  const T68IN  =this["T68IN"];
                  return T68IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T68IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T68IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T68OUT" : "T68OUT",
              "apply":function (){
                return ((() => {
                  const T68OUT = this["T68OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T68OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T68OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T68OUT");
                gcs.informSelecteurOnMenuChange(255 , "T68OUT", false);
              }
            }
          )
        ) // Fin sequence pour T68
  ,
        hh.SEQUENCE( // Debut sequence pour T53
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
                  const T53IN  =this["T53IN"];
                  return T53IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T53IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T53IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T53OUT" : "T53OUT",
              "apply":function (){
                return ((() => {
                  const T53OUT = this["T53OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T53OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T53OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T53OUT");
                gcs.informSelecteurOnMenuChange(255 , "T53OUT", false);
              }
            }
          )
        ) // Fin sequence pour T53
  ,
        hh.SEQUENCE( // Debut sequence pour T38
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
                  const T38IN  =this["T38IN"];
                  return T38IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T38IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T38IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T38OUT" : "T38OUT",
              "apply":function (){
                return ((() => {
                  const T38OUT = this["T38OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T38OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T38OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T38OUT");
                gcs.informSelecteurOnMenuChange(255 , "T38OUT", false);
              }
            }
          )
        ) // Fin sequence pour T38
      ), // Fin fork de make await avec en premiere position:T25
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
          "T25OUT":"T25OUT",
          "apply":function (){
            return ((() => {
              const T25 = this["T25OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T25OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T25OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T74OUT":"T74OUT",
          "apply":function (){
            return ((() => {
              const T74 = this["T74OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T74OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T74OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T1OUT":"T1OUT",
          "apply":function (){
            return ((() => {
              const T1 = this["T1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T68OUT":"T68OUT",
          "apply":function (){
            return ((() => {
              const T68 = this["T68OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T68OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T68OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T53OUT":"T53OUT",
          "apply":function (){
            return ((() => {
              const T53 = this["T53OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T53OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T53OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T38OUT":"T38OUT",
          "apply":function (){
            return ((() => {
              const T38 = this["T38OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T38OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T38OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "T25", false);
            console.log("--- FIN RESERVOIR:", "T25");
            var msg = {
            type: 'killTank',
            value:  "T25"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank type4 + T81
    type4 = hh.MODULE({"id":"type4","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T81IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T14IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T65IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T29IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T37IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T81OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T14OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T65OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T29OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T37OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T4OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "T81" );
                var msg = {
                  type: 'startTank',
                  value:  "T81"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T81OUT":"T81OUT",
                "apply":function (){
                  return ((() => {
                    const T81 = this["T81OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T81OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T81OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T81OUT");
                gcs.informSelecteurOnMenuChange(255 , "T81OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T14OUT":"T14OUT",
                "apply":function (){
                  return ((() => {
                    const T14 = this["T14OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T14OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T14OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T14OUT");
                gcs.informSelecteurOnMenuChange(255 , "T14OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T65OUT":"T65OUT",
                "apply":function (){
                  return ((() => {
                    const T65 = this["T65OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T65OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T65OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T65OUT");
                gcs.informSelecteurOnMenuChange(255 , "T65OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T29OUT":"T29OUT",
                "apply":function (){
                  return ((() => {
                    const T29 = this["T29OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T29OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T29OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T29OUT");
                gcs.informSelecteurOnMenuChange(255 , "T29OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T37OUT":"T37OUT",
                "apply":function (){
                  return ((() => {
                    const T37 = this["T37OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T37OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T37OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T37OUT");
                gcs.informSelecteurOnMenuChange(255 , "T37OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T4OUT":"T4OUT",
                "apply":function (){
                  return ((() => {
                    const T4 = this["T4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T4OUT");
                gcs.informSelecteurOnMenuChange(255 , "T4OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:T81
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour T81
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
                  const T81IN  =this["T81IN"];
                  return T81IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T81IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T81IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T81OUT" : "T81OUT",
              "apply":function (){
                return ((() => {
                  const T81OUT = this["T81OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T81OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T81OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T81OUT");
                gcs.informSelecteurOnMenuChange(255 , "T81OUT", false);
              }
            }
          )
        ) // Fin sequence pour T81
  ,
        hh.SEQUENCE( // Debut sequence pour T14
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
                  const T14IN  =this["T14IN"];
                  return T14IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T14IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T14IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T14OUT" : "T14OUT",
              "apply":function (){
                return ((() => {
                  const T14OUT = this["T14OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T14OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T14OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T14OUT");
                gcs.informSelecteurOnMenuChange(255 , "T14OUT", false);
              }
            }
          )
        ) // Fin sequence pour T14
  ,
        hh.SEQUENCE( // Debut sequence pour T65
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
                  const T65IN  =this["T65IN"];
                  return T65IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T65IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T65IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T65OUT" : "T65OUT",
              "apply":function (){
                return ((() => {
                  const T65OUT = this["T65OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T65OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T65OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T65OUT");
                gcs.informSelecteurOnMenuChange(255 , "T65OUT", false);
              }
            }
          )
        ) // Fin sequence pour T65
  ,
        hh.SEQUENCE( // Debut sequence pour T29
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
                  const T29IN  =this["T29IN"];
                  return T29IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T29IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T29IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T29OUT" : "T29OUT",
              "apply":function (){
                return ((() => {
                  const T29OUT = this["T29OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T29OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T29OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T29OUT");
                gcs.informSelecteurOnMenuChange(255 , "T29OUT", false);
              }
            }
          )
        ) // Fin sequence pour T29
  ,
        hh.SEQUENCE( // Debut sequence pour T37
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
                  const T37IN  =this["T37IN"];
                  return T37IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T37IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T37IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T37OUT" : "T37OUT",
              "apply":function (){
                return ((() => {
                  const T37OUT = this["T37OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T37OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T37OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T37OUT");
                gcs.informSelecteurOnMenuChange(255 , "T37OUT", false);
              }
            }
          )
        ) // Fin sequence pour T37
  ,
        hh.SEQUENCE( // Debut sequence pour T4
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
                  const T4IN  =this["T4IN"];
                  return T4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T4OUT" : "T4OUT",
              "apply":function (){
                return ((() => {
                  const T4OUT = this["T4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T4OUT");
                gcs.informSelecteurOnMenuChange(255 , "T4OUT", false);
              }
            }
          )
        ) // Fin sequence pour T4
      ), // Fin fork de make await avec en premiere position:T81
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
          "T81OUT":"T81OUT",
          "apply":function (){
            return ((() => {
              const T81 = this["T81OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T81OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T81OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T14OUT":"T14OUT",
          "apply":function (){
            return ((() => {
              const T14 = this["T14OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T14OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T14OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T65OUT":"T65OUT",
          "apply":function (){
            return ((() => {
              const T65 = this["T65OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T65OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T65OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T29OUT":"T29OUT",
          "apply":function (){
            return ((() => {
              const T29 = this["T29OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T29OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T29OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T37OUT":"T37OUT",
          "apply":function (){
            return ((() => {
              const T37 = this["T37OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T37OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T37OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T4OUT":"T4OUT",
          "apply":function (){
            return ((() => {
              const T4 = this["T4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T4OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "T81", false);
            console.log("--- FIN RESERVOIR:", "T81");
            var msg = {
            type: 'killTank',
            value:  "T81"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank type5 + T41
    type5 = hh.MODULE({"id":"type5","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T41IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T43IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T55IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T17IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T27IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T41OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T43OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T55OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T17OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T27OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "T41" );
                var msg = {
                  type: 'startTank',
                  value:  "T41"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T41OUT":"T41OUT",
                "apply":function (){
                  return ((() => {
                    const T41 = this["T41OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T41OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T41OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T41OUT");
                gcs.informSelecteurOnMenuChange(255 , "T41OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T7OUT":"T7OUT",
                "apply":function (){
                  return ((() => {
                    const T7 = this["T7OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T7OUT");
                gcs.informSelecteurOnMenuChange(255 , "T7OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T43OUT":"T43OUT",
                "apply":function (){
                  return ((() => {
                    const T43 = this["T43OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T43OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T43OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T43OUT");
                gcs.informSelecteurOnMenuChange(255 , "T43OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T55OUT":"T55OUT",
                "apply":function (){
                  return ((() => {
                    const T55 = this["T55OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T55OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T55OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T55OUT");
                gcs.informSelecteurOnMenuChange(255 , "T55OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T17OUT":"T17OUT",
                "apply":function (){
                  return ((() => {
                    const T17 = this["T17OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T17OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T17OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T17OUT");
                gcs.informSelecteurOnMenuChange(255 , "T17OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T27OUT":"T27OUT",
                "apply":function (){
                  return ((() => {
                    const T27 = this["T27OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T27OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T27OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T27OUT");
                gcs.informSelecteurOnMenuChange(255 , "T27OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:T41
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour T41
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
                  const T41IN  =this["T41IN"];
                  return T41IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T41IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T41IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T41OUT" : "T41OUT",
              "apply":function (){
                return ((() => {
                  const T41OUT = this["T41OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T41OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T41OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T41OUT");
                gcs.informSelecteurOnMenuChange(255 , "T41OUT", false);
              }
            }
          )
        ) // Fin sequence pour T41
  ,
        hh.SEQUENCE( // Debut sequence pour T7
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
                  const T7IN  =this["T7IN"];
                  return T7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T7OUT" : "T7OUT",
              "apply":function (){
                return ((() => {
                  const T7OUT = this["T7OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T7OUT");
                gcs.informSelecteurOnMenuChange(255 , "T7OUT", false);
              }
            }
          )
        ) // Fin sequence pour T7
  ,
        hh.SEQUENCE( // Debut sequence pour T43
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
                  const T43IN  =this["T43IN"];
                  return T43IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T43IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T43IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T43OUT" : "T43OUT",
              "apply":function (){
                return ((() => {
                  const T43OUT = this["T43OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T43OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T43OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T43OUT");
                gcs.informSelecteurOnMenuChange(255 , "T43OUT", false);
              }
            }
          )
        ) // Fin sequence pour T43
  ,
        hh.SEQUENCE( // Debut sequence pour T55
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
                  const T55IN  =this["T55IN"];
                  return T55IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T55IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T55IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T55OUT" : "T55OUT",
              "apply":function (){
                return ((() => {
                  const T55OUT = this["T55OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T55OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T55OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T55OUT");
                gcs.informSelecteurOnMenuChange(255 , "T55OUT", false);
              }
            }
          )
        ) // Fin sequence pour T55
  ,
        hh.SEQUENCE( // Debut sequence pour T17
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
                  const T17IN  =this["T17IN"];
                  return T17IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T17IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T17IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T17OUT" : "T17OUT",
              "apply":function (){
                return ((() => {
                  const T17OUT = this["T17OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T17OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T17OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T17OUT");
                gcs.informSelecteurOnMenuChange(255 , "T17OUT", false);
              }
            }
          )
        ) // Fin sequence pour T17
  ,
        hh.SEQUENCE( // Debut sequence pour T27
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
                  const T27IN  =this["T27IN"];
                  return T27IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T27IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T27IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T27OUT" : "T27OUT",
              "apply":function (){
                return ((() => {
                  const T27OUT = this["T27OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T27OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T27OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T27OUT");
                gcs.informSelecteurOnMenuChange(255 , "T27OUT", false);
              }
            }
          )
        ) // Fin sequence pour T27
      ), // Fin fork de make await avec en premiere position:T41
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
          "T41OUT":"T41OUT",
          "apply":function (){
            return ((() => {
              const T41 = this["T41OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T41OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T41OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T7OUT":"T7OUT",
          "apply":function (){
            return ((() => {
              const T7 = this["T7OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T7OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T43OUT":"T43OUT",
          "apply":function (){
            return ((() => {
              const T43 = this["T43OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T43OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T43OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T55OUT":"T55OUT",
          "apply":function (){
            return ((() => {
              const T55 = this["T55OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T55OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T55OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T17OUT":"T17OUT",
          "apply":function (){
            return ((() => {
              const T17 = this["T17OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T17OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T17OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T27OUT":"T27OUT",
          "apply":function (){
            return ((() => {
              const T27 = this["T27OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T27OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T27OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "T41", false);
            console.log("--- FIN RESERVOIR:", "T41");
            var msg = {
            type: 'killTank',
            value:  "T41"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank type6 + T89
    type6 = hh.MODULE({"id":"type6","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T89IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T26IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T15IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T44IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T52IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T89OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T26OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T15OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T44OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T52OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "T89" );
                var msg = {
                  type: 'startTank',
                  value:  "T89"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T89OUT":"T89OUT",
                "apply":function (){
                  return ((() => {
                    const T89 = this["T89OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T89OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T89OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T89OUT");
                gcs.informSelecteurOnMenuChange(255 , "T89OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T26OUT":"T26OUT",
                "apply":function (){
                  return ((() => {
                    const T26 = this["T26OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T26OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T26OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T26OUT");
                gcs.informSelecteurOnMenuChange(255 , "T26OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T15OUT":"T15OUT",
                "apply":function (){
                  return ((() => {
                    const T15 = this["T15OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T15OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T15OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T15OUT");
                gcs.informSelecteurOnMenuChange(255 , "T15OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T2OUT":"T2OUT",
                "apply":function (){
                  return ((() => {
                    const T2 = this["T2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T2OUT");
                gcs.informSelecteurOnMenuChange(255 , "T2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T44OUT":"T44OUT",
                "apply":function (){
                  return ((() => {
                    const T44 = this["T44OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T44OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T44OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T44OUT");
                gcs.informSelecteurOnMenuChange(255 , "T44OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T52OUT":"T52OUT",
                "apply":function (){
                  return ((() => {
                    const T52 = this["T52OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T52OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T52OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T52OUT");
                gcs.informSelecteurOnMenuChange(255 , "T52OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:T89
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour T89
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
                  const T89IN  =this["T89IN"];
                  return T89IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T89IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T89IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T89OUT" : "T89OUT",
              "apply":function (){
                return ((() => {
                  const T89OUT = this["T89OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T89OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T89OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T89OUT");
                gcs.informSelecteurOnMenuChange(255 , "T89OUT", false);
              }
            }
          )
        ) // Fin sequence pour T89
  ,
        hh.SEQUENCE( // Debut sequence pour T26
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
                  const T26IN  =this["T26IN"];
                  return T26IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T26IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T26IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T26OUT" : "T26OUT",
              "apply":function (){
                return ((() => {
                  const T26OUT = this["T26OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T26OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T26OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T26OUT");
                gcs.informSelecteurOnMenuChange(255 , "T26OUT", false);
              }
            }
          )
        ) // Fin sequence pour T26
  ,
        hh.SEQUENCE( // Debut sequence pour T15
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
                  const T15IN  =this["T15IN"];
                  return T15IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T15IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T15IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T15OUT" : "T15OUT",
              "apply":function (){
                return ((() => {
                  const T15OUT = this["T15OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T15OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T15OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T15OUT");
                gcs.informSelecteurOnMenuChange(255 , "T15OUT", false);
              }
            }
          )
        ) // Fin sequence pour T15
  ,
        hh.SEQUENCE( // Debut sequence pour T2
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
                  const T2IN  =this["T2IN"];
                  return T2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T2OUT" : "T2OUT",
              "apply":function (){
                return ((() => {
                  const T2OUT = this["T2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T2OUT");
                gcs.informSelecteurOnMenuChange(255 , "T2OUT", false);
              }
            }
          )
        ) // Fin sequence pour T2
  ,
        hh.SEQUENCE( // Debut sequence pour T44
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
                  const T44IN  =this["T44IN"];
                  return T44IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T44IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T44IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T44OUT" : "T44OUT",
              "apply":function (){
                return ((() => {
                  const T44OUT = this["T44OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T44OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T44OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T44OUT");
                gcs.informSelecteurOnMenuChange(255 , "T44OUT", false);
              }
            }
          )
        ) // Fin sequence pour T44
  ,
        hh.SEQUENCE( // Debut sequence pour T52
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
                  const T52IN  =this["T52IN"];
                  return T52IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T52IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T52IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T52OUT" : "T52OUT",
              "apply":function (){
                return ((() => {
                  const T52OUT = this["T52OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T52OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T52OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T52OUT");
                gcs.informSelecteurOnMenuChange(255 , "T52OUT", false);
              }
            }
          )
        ) // Fin sequence pour T52
      ), // Fin fork de make await avec en premiere position:T89
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
          "T89OUT":"T89OUT",
          "apply":function (){
            return ((() => {
              const T89 = this["T89OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T89OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T89OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T26OUT":"T26OUT",
          "apply":function (){
            return ((() => {
              const T26 = this["T26OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T26OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T26OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T15OUT":"T15OUT",
          "apply":function (){
            return ((() => {
              const T15 = this["T15OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T15OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T15OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T2OUT":"T2OUT",
          "apply":function (){
            return ((() => {
              const T2 = this["T2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T44OUT":"T44OUT",
          "apply":function (){
            return ((() => {
              const T44 = this["T44OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T44OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T44OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T52OUT":"T52OUT",
          "apply":function (){
            return ((() => {
              const T52 = this["T52OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T52OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T52OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "T89", false);
            console.log("--- FIN RESERVOIR:", "T89");
            var msg = {
            type: 'killTank',
            value:  "T89"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank type7 + T13
    type7 = hh.MODULE({"id":"type7","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T13IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T71IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T80IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T61IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T70IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T94IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T13OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T71OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T80OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T61OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T70OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T94OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "T13" );
                var msg = {
                  type: 'startTank',
                  value:  "T13"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T13OUT":"T13OUT",
                "apply":function (){
                  return ((() => {
                    const T13 = this["T13OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T13OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T13OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T13OUT");
                gcs.informSelecteurOnMenuChange(255 , "T13OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T71OUT":"T71OUT",
                "apply":function (){
                  return ((() => {
                    const T71 = this["T71OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T71OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T71OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T71OUT");
                gcs.informSelecteurOnMenuChange(255 , "T71OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T80OUT":"T80OUT",
                "apply":function (){
                  return ((() => {
                    const T80 = this["T80OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T80OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T80OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T80OUT");
                gcs.informSelecteurOnMenuChange(255 , "T80OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T61OUT":"T61OUT",
                "apply":function (){
                  return ((() => {
                    const T61 = this["T61OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T61OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T61OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T61OUT");
                gcs.informSelecteurOnMenuChange(255 , "T61OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T70OUT":"T70OUT",
                "apply":function (){
                  return ((() => {
                    const T70 = this["T70OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T70OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T70OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T70OUT");
                gcs.informSelecteurOnMenuChange(255 , "T70OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T94OUT":"T94OUT",
                "apply":function (){
                  return ((() => {
                    const T94 = this["T94OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T94OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T94OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T94OUT");
                gcs.informSelecteurOnMenuChange(255 , "T94OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:T13
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour T13
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
                  const T13IN  =this["T13IN"];
                  return T13IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T13IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T13IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T13OUT" : "T13OUT",
              "apply":function (){
                return ((() => {
                  const T13OUT = this["T13OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T13OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T13OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T13OUT");
                gcs.informSelecteurOnMenuChange(255 , "T13OUT", false);
              }
            }
          )
        ) // Fin sequence pour T13
  ,
        hh.SEQUENCE( // Debut sequence pour T71
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
                  const T71IN  =this["T71IN"];
                  return T71IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T71IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T71IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T71OUT" : "T71OUT",
              "apply":function (){
                return ((() => {
                  const T71OUT = this["T71OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T71OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T71OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T71OUT");
                gcs.informSelecteurOnMenuChange(255 , "T71OUT", false);
              }
            }
          )
        ) // Fin sequence pour T71
  ,
        hh.SEQUENCE( // Debut sequence pour T80
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
                  const T80IN  =this["T80IN"];
                  return T80IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T80IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T80IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T80OUT" : "T80OUT",
              "apply":function (){
                return ((() => {
                  const T80OUT = this["T80OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T80OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T80OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T80OUT");
                gcs.informSelecteurOnMenuChange(255 , "T80OUT", false);
              }
            }
          )
        ) // Fin sequence pour T80
  ,
        hh.SEQUENCE( // Debut sequence pour T61
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
                  const T61IN  =this["T61IN"];
                  return T61IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T61IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T61IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T61OUT" : "T61OUT",
              "apply":function (){
                return ((() => {
                  const T61OUT = this["T61OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T61OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T61OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T61OUT");
                gcs.informSelecteurOnMenuChange(255 , "T61OUT", false);
              }
            }
          )
        ) // Fin sequence pour T61
  ,
        hh.SEQUENCE( // Debut sequence pour T70
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
                  const T70IN  =this["T70IN"];
                  return T70IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T70IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T70IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T70OUT" : "T70OUT",
              "apply":function (){
                return ((() => {
                  const T70OUT = this["T70OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T70OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T70OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T70OUT");
                gcs.informSelecteurOnMenuChange(255 , "T70OUT", false);
              }
            }
          )
        ) // Fin sequence pour T70
  ,
        hh.SEQUENCE( // Debut sequence pour T94
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
                  const T94IN  =this["T94IN"];
                  return T94IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T94IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T94IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T94OUT" : "T94OUT",
              "apply":function (){
                return ((() => {
                  const T94OUT = this["T94OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T94OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T94OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T94OUT");
                gcs.informSelecteurOnMenuChange(255 , "T94OUT", false);
              }
            }
          )
        ) // Fin sequence pour T94
      ), // Fin fork de make await avec en premiere position:T13
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
          "T13OUT":"T13OUT",
          "apply":function (){
            return ((() => {
              const T13 = this["T13OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T13OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T13OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T71OUT":"T71OUT",
          "apply":function (){
            return ((() => {
              const T71 = this["T71OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T71OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T71OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T80OUT":"T80OUT",
          "apply":function (){
            return ((() => {
              const T80 = this["T80OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T80OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T80OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T61OUT":"T61OUT",
          "apply":function (){
            return ((() => {
              const T61 = this["T61OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T61OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T61OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T70OUT":"T70OUT",
          "apply":function (){
            return ((() => {
              const T70 = this["T70OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T70OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T70OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T94OUT":"T94OUT",
          "apply":function (){
            return ((() => {
              const T94 = this["T94OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T94OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T94OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "T13", false);
            console.log("--- FIN RESERVOIR:", "T13");
            var msg = {
            type: 'killTank',
            value:  "T13"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank type8 + T36
    type8 = hh.MODULE({"id":"type8","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T36IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T76IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T9IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T22IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T63IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T11IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T36OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T76OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T9OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T22OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T63OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T11OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "T36" );
                var msg = {
                  type: 'startTank',
                  value:  "T36"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T36OUT":"T36OUT",
                "apply":function (){
                  return ((() => {
                    const T36 = this["T36OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T36OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T36OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T36OUT");
                gcs.informSelecteurOnMenuChange(255 , "T36OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T76OUT":"T76OUT",
                "apply":function (){
                  return ((() => {
                    const T76 = this["T76OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T76OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T76OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T76OUT");
                gcs.informSelecteurOnMenuChange(255 , "T76OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T9OUT":"T9OUT",
                "apply":function (){
                  return ((() => {
                    const T9 = this["T9OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T9OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T9OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T9OUT");
                gcs.informSelecteurOnMenuChange(255 , "T9OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T22OUT":"T22OUT",
                "apply":function (){
                  return ((() => {
                    const T22 = this["T22OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T22OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T22OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T22OUT");
                gcs.informSelecteurOnMenuChange(255 , "T22OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T63OUT":"T63OUT",
                "apply":function (){
                  return ((() => {
                    const T63 = this["T63OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T63OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T63OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T63OUT");
                gcs.informSelecteurOnMenuChange(255 , "T63OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T11OUT":"T11OUT",
                "apply":function (){
                  return ((() => {
                    const T11 = this["T11OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T11OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T11OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T11OUT");
                gcs.informSelecteurOnMenuChange(255 , "T11OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:T36
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour T36
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
                  const T36IN  =this["T36IN"];
                  return T36IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T36IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T36IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T36OUT" : "T36OUT",
              "apply":function (){
                return ((() => {
                  const T36OUT = this["T36OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T36OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T36OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T36OUT");
                gcs.informSelecteurOnMenuChange(255 , "T36OUT", false);
              }
            }
          )
        ) // Fin sequence pour T36
  ,
        hh.SEQUENCE( // Debut sequence pour T76
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
                  const T76IN  =this["T76IN"];
                  return T76IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T76IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T76IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T76OUT" : "T76OUT",
              "apply":function (){
                return ((() => {
                  const T76OUT = this["T76OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T76OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T76OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T76OUT");
                gcs.informSelecteurOnMenuChange(255 , "T76OUT", false);
              }
            }
          )
        ) // Fin sequence pour T76
  ,
        hh.SEQUENCE( // Debut sequence pour T9
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
                  const T9IN  =this["T9IN"];
                  return T9IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T9IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T9IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T9OUT" : "T9OUT",
              "apply":function (){
                return ((() => {
                  const T9OUT = this["T9OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T9OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T9OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T9OUT");
                gcs.informSelecteurOnMenuChange(255 , "T9OUT", false);
              }
            }
          )
        ) // Fin sequence pour T9
  ,
        hh.SEQUENCE( // Debut sequence pour T22
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
                  const T22IN  =this["T22IN"];
                  return T22IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T22IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T22IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T22OUT" : "T22OUT",
              "apply":function (){
                return ((() => {
                  const T22OUT = this["T22OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T22OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T22OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T22OUT");
                gcs.informSelecteurOnMenuChange(255 , "T22OUT", false);
              }
            }
          )
        ) // Fin sequence pour T22
  ,
        hh.SEQUENCE( // Debut sequence pour T63
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
                  const T63IN  =this["T63IN"];
                  return T63IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T63IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T63IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T63OUT" : "T63OUT",
              "apply":function (){
                return ((() => {
                  const T63OUT = this["T63OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T63OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T63OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T63OUT");
                gcs.informSelecteurOnMenuChange(255 , "T63OUT", false);
              }
            }
          )
        ) // Fin sequence pour T63
  ,
        hh.SEQUENCE( // Debut sequence pour T11
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
                  const T11IN  =this["T11IN"];
                  return T11IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T11IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T11IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T11OUT" : "T11OUT",
              "apply":function (){
                return ((() => {
                  const T11OUT = this["T11OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T11OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T11OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T11OUT");
                gcs.informSelecteurOnMenuChange(255 , "T11OUT", false);
              }
            }
          )
        ) // Fin sequence pour T11
      ), // Fin fork de make await avec en premiere position:T36
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
          "T36OUT":"T36OUT",
          "apply":function (){
            return ((() => {
              const T36 = this["T36OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T36OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T36OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T76OUT":"T76OUT",
          "apply":function (){
            return ((() => {
              const T76 = this["T76OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T76OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T76OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T9OUT":"T9OUT",
          "apply":function (){
            return ((() => {
              const T9 = this["T9OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T9OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T9OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T22OUT":"T22OUT",
          "apply":function (){
            return ((() => {
              const T22 = this["T22OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T22OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T22OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T63OUT":"T63OUT",
          "apply":function (){
            return ((() => {
              const T63 = this["T63OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T63OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T63OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T11OUT":"T11OUT",
          "apply":function (){
            return ((() => {
              const T11 = this["T11OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T11OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T11OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "T36", false);
            console.log("--- FIN RESERVOIR:", "T36");
            var msg = {
            type: 'killTank',
            value:  "T36"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank type9 + T5
    type9 = hh.MODULE({"id":"type9","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T20IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T34IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T67IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T85IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T92IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T20OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T34OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T67OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T85OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T92OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "T5" );
                var msg = {
                  type: 'startTank',
                  value:  "T5"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T5OUT":"T5OUT",
                "apply":function (){
                  return ((() => {
                    const T5 = this["T5OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T5OUT");
                gcs.informSelecteurOnMenuChange(255 , "T5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T20OUT":"T20OUT",
                "apply":function (){
                  return ((() => {
                    const T20 = this["T20OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T20OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T20OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T20OUT");
                gcs.informSelecteurOnMenuChange(255 , "T20OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T34OUT":"T34OUT",
                "apply":function (){
                  return ((() => {
                    const T34 = this["T34OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T34OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T34OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T34OUT");
                gcs.informSelecteurOnMenuChange(255 , "T34OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T67OUT":"T67OUT",
                "apply":function (){
                  return ((() => {
                    const T67 = this["T67OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T67OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T67OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T67OUT");
                gcs.informSelecteurOnMenuChange(255 , "T67OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T85OUT":"T85OUT",
                "apply":function (){
                  return ((() => {
                    const T85 = this["T85OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T85OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T85OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T85OUT");
                gcs.informSelecteurOnMenuChange(255 , "T85OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T92OUT":"T92OUT",
                "apply":function (){
                  return ((() => {
                    const T92 = this["T92OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T92OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T92OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T92OUT");
                gcs.informSelecteurOnMenuChange(255 , "T92OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:T5
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour T5
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
                  const T5IN  =this["T5IN"];
                  return T5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T5OUT" : "T5OUT",
              "apply":function (){
                return ((() => {
                  const T5OUT = this["T5OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T5OUT");
                gcs.informSelecteurOnMenuChange(255 , "T5OUT", false);
              }
            }
          )
        ) // Fin sequence pour T5
  ,
        hh.SEQUENCE( // Debut sequence pour T20
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
                  const T20IN  =this["T20IN"];
                  return T20IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T20IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T20IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T20OUT" : "T20OUT",
              "apply":function (){
                return ((() => {
                  const T20OUT = this["T20OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T20OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T20OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T20OUT");
                gcs.informSelecteurOnMenuChange(255 , "T20OUT", false);
              }
            }
          )
        ) // Fin sequence pour T20
  ,
        hh.SEQUENCE( // Debut sequence pour T34
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
                  const T34IN  =this["T34IN"];
                  return T34IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T34IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T34IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T34OUT" : "T34OUT",
              "apply":function (){
                return ((() => {
                  const T34OUT = this["T34OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T34OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T34OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T34OUT");
                gcs.informSelecteurOnMenuChange(255 , "T34OUT", false);
              }
            }
          )
        ) // Fin sequence pour T34
  ,
        hh.SEQUENCE( // Debut sequence pour T67
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
                  const T67IN  =this["T67IN"];
                  return T67IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T67IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T67IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T67OUT" : "T67OUT",
              "apply":function (){
                return ((() => {
                  const T67OUT = this["T67OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T67OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T67OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T67OUT");
                gcs.informSelecteurOnMenuChange(255 , "T67OUT", false);
              }
            }
          )
        ) // Fin sequence pour T67
  ,
        hh.SEQUENCE( // Debut sequence pour T85
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
                  const T85IN  =this["T85IN"];
                  return T85IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T85IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T85IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T85OUT" : "T85OUT",
              "apply":function (){
                return ((() => {
                  const T85OUT = this["T85OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T85OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T85OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T85OUT");
                gcs.informSelecteurOnMenuChange(255 , "T85OUT", false);
              }
            }
          )
        ) // Fin sequence pour T85
  ,
        hh.SEQUENCE( // Debut sequence pour T92
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
                  const T92IN  =this["T92IN"];
                  return T92IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T92IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T92IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T92OUT" : "T92OUT",
              "apply":function (){
                return ((() => {
                  const T92OUT = this["T92OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T92OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T92OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T92OUT");
                gcs.informSelecteurOnMenuChange(255 , "T92OUT", false);
              }
            }
          )
        ) // Fin sequence pour T92
      ), // Fin fork de make await avec en premiere position:T5
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
          "T5OUT":"T5OUT",
          "apply":function (){
            return ((() => {
              const T5 = this["T5OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T20OUT":"T20OUT",
          "apply":function (){
            return ((() => {
              const T20 = this["T20OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T20OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T20OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T34OUT":"T34OUT",
          "apply":function (){
            return ((() => {
              const T34 = this["T34OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T34OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T34OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T67OUT":"T67OUT",
          "apply":function (){
            return ((() => {
              const T67 = this["T67OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T67OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T67OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T85OUT":"T85OUT",
          "apply":function (){
            return ((() => {
              const T85 = this["T85OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T85OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T85OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T92OUT":"T92OUT",
          "apply":function (){
            return ((() => {
              const T92 = this["T92OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T92OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T92OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "T5", false);
            console.log("--- FIN RESERVOIR:", "T5");
            var msg = {
            type: 'killTank',
            value:  "T5"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank type10 + T46
    type10 = hh.MODULE({"id":"type10","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T46IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T64IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T93IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T49IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T32IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T24IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T46OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T64OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T93OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T49OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T32OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T24OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "T46" );
                var msg = {
                  type: 'startTank',
                  value:  "T46"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T46OUT":"T46OUT",
                "apply":function (){
                  return ((() => {
                    const T46 = this["T46OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T46OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T46OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T46OUT");
                gcs.informSelecteurOnMenuChange(255 , "T46OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T64OUT":"T64OUT",
                "apply":function (){
                  return ((() => {
                    const T64 = this["T64OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T64OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T64OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T64OUT");
                gcs.informSelecteurOnMenuChange(255 , "T64OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T93OUT":"T93OUT",
                "apply":function (){
                  return ((() => {
                    const T93 = this["T93OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T93OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T93OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T93OUT");
                gcs.informSelecteurOnMenuChange(255 , "T93OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T49OUT":"T49OUT",
                "apply":function (){
                  return ((() => {
                    const T49 = this["T49OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T49OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T49OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T49OUT");
                gcs.informSelecteurOnMenuChange(255 , "T49OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T32OUT":"T32OUT",
                "apply":function (){
                  return ((() => {
                    const T32 = this["T32OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T32OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T32OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T32OUT");
                gcs.informSelecteurOnMenuChange(255 , "T32OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T24OUT":"T24OUT",
                "apply":function (){
                  return ((() => {
                    const T24 = this["T24OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T24OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T24OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T24OUT");
                gcs.informSelecteurOnMenuChange(255 , "T24OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:T46
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour T46
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
                  const T46IN  =this["T46IN"];
                  return T46IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T46IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T46IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T46OUT" : "T46OUT",
              "apply":function (){
                return ((() => {
                  const T46OUT = this["T46OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T46OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T46OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T46OUT");
                gcs.informSelecteurOnMenuChange(255 , "T46OUT", false);
              }
            }
          )
        ) // Fin sequence pour T46
  ,
        hh.SEQUENCE( // Debut sequence pour T64
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
                  const T64IN  =this["T64IN"];
                  return T64IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T64IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T64IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T64OUT" : "T64OUT",
              "apply":function (){
                return ((() => {
                  const T64OUT = this["T64OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T64OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T64OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T64OUT");
                gcs.informSelecteurOnMenuChange(255 , "T64OUT", false);
              }
            }
          )
        ) // Fin sequence pour T64
  ,
        hh.SEQUENCE( // Debut sequence pour T93
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
                  const T93IN  =this["T93IN"];
                  return T93IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T93IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T93IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T93OUT" : "T93OUT",
              "apply":function (){
                return ((() => {
                  const T93OUT = this["T93OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T93OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T93OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T93OUT");
                gcs.informSelecteurOnMenuChange(255 , "T93OUT", false);
              }
            }
          )
        ) // Fin sequence pour T93
  ,
        hh.SEQUENCE( // Debut sequence pour T49
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
                  const T49IN  =this["T49IN"];
                  return T49IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T49IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T49IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T49OUT" : "T49OUT",
              "apply":function (){
                return ((() => {
                  const T49OUT = this["T49OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T49OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T49OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T49OUT");
                gcs.informSelecteurOnMenuChange(255 , "T49OUT", false);
              }
            }
          )
        ) // Fin sequence pour T49
  ,
        hh.SEQUENCE( // Debut sequence pour T32
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
                  const T32IN  =this["T32IN"];
                  return T32IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T32IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T32IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T32OUT" : "T32OUT",
              "apply":function (){
                return ((() => {
                  const T32OUT = this["T32OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T32OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T32OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T32OUT");
                gcs.informSelecteurOnMenuChange(255 , "T32OUT", false);
              }
            }
          )
        ) // Fin sequence pour T32
  ,
        hh.SEQUENCE( // Debut sequence pour T24
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
                  const T24IN  =this["T24IN"];
                  return T24IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T24IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T24IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T24OUT" : "T24OUT",
              "apply":function (){
                return ((() => {
                  const T24OUT = this["T24OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T24OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T24OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T24OUT");
                gcs.informSelecteurOnMenuChange(255 , "T24OUT", false);
              }
            }
          )
        ) // Fin sequence pour T24
      ), // Fin fork de make await avec en premiere position:T46
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
          "T46OUT":"T46OUT",
          "apply":function (){
            return ((() => {
              const T46 = this["T46OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T46OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T46OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T64OUT":"T64OUT",
          "apply":function (){
            return ((() => {
              const T64 = this["T64OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T64OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T64OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T93OUT":"T93OUT",
          "apply":function (){
            return ((() => {
              const T93 = this["T93OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T93OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T93OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T49OUT":"T49OUT",
          "apply":function (){
            return ((() => {
              const T49 = this["T49OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T49OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T49OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T32OUT":"T32OUT",
          "apply":function (){
            return ((() => {
              const T32 = this["T32OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T32OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T32OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T24OUT":"T24OUT",
          "apply":function (){
            return ((() => {
              const T24 = this["T24OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T24OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T24OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "T46", false);
            console.log("--- FIN RESERVOIR:", "T46");
            var msg = {
            type: 'killTank',
            value:  "T46"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank type11 + T79
    type11 = hh.MODULE({"id":"type11","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T79IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T84IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T48IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T77IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T96IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T86IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T79OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T84OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T48OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T77OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T96OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T86OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "T79" );
                var msg = {
                  type: 'startTank',
                  value:  "T79"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T79OUT":"T79OUT",
                "apply":function (){
                  return ((() => {
                    const T79 = this["T79OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T79OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T79OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T79OUT");
                gcs.informSelecteurOnMenuChange(255 , "T79OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T84OUT":"T84OUT",
                "apply":function (){
                  return ((() => {
                    const T84 = this["T84OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T84OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T84OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T84OUT");
                gcs.informSelecteurOnMenuChange(255 , "T84OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T48OUT":"T48OUT",
                "apply":function (){
                  return ((() => {
                    const T48 = this["T48OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T48OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T48OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T48OUT");
                gcs.informSelecteurOnMenuChange(255 , "T48OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T77OUT":"T77OUT",
                "apply":function (){
                  return ((() => {
                    const T77 = this["T77OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T77OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T77OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T77OUT");
                gcs.informSelecteurOnMenuChange(255 , "T77OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T96OUT":"T96OUT",
                "apply":function (){
                  return ((() => {
                    const T96 = this["T96OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T96OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T96OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T96OUT");
                gcs.informSelecteurOnMenuChange(255 , "T96OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T86OUT":"T86OUT",
                "apply":function (){
                  return ((() => {
                    const T86 = this["T86OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T86OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T86OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T86OUT");
                gcs.informSelecteurOnMenuChange(255 , "T86OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:T79
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour T79
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
                  const T79IN  =this["T79IN"];
                  return T79IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T79IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T79IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T79OUT" : "T79OUT",
              "apply":function (){
                return ((() => {
                  const T79OUT = this["T79OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T79OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T79OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T79OUT");
                gcs.informSelecteurOnMenuChange(255 , "T79OUT", false);
              }
            }
          )
        ) // Fin sequence pour T79
  ,
        hh.SEQUENCE( // Debut sequence pour T84
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
                  const T84IN  =this["T84IN"];
                  return T84IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T84IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T84IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T84OUT" : "T84OUT",
              "apply":function (){
                return ((() => {
                  const T84OUT = this["T84OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T84OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T84OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T84OUT");
                gcs.informSelecteurOnMenuChange(255 , "T84OUT", false);
              }
            }
          )
        ) // Fin sequence pour T84
  ,
        hh.SEQUENCE( // Debut sequence pour T48
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
                  const T48IN  =this["T48IN"];
                  return T48IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T48IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T48IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T48OUT" : "T48OUT",
              "apply":function (){
                return ((() => {
                  const T48OUT = this["T48OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T48OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T48OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T48OUT");
                gcs.informSelecteurOnMenuChange(255 , "T48OUT", false);
              }
            }
          )
        ) // Fin sequence pour T48
  ,
        hh.SEQUENCE( // Debut sequence pour T77
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
                  const T77IN  =this["T77IN"];
                  return T77IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T77IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T77IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T77OUT" : "T77OUT",
              "apply":function (){
                return ((() => {
                  const T77OUT = this["T77OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T77OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T77OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T77OUT");
                gcs.informSelecteurOnMenuChange(255 , "T77OUT", false);
              }
            }
          )
        ) // Fin sequence pour T77
  ,
        hh.SEQUENCE( // Debut sequence pour T96
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
                  const T96IN  =this["T96IN"];
                  return T96IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T96IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T96IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T96OUT" : "T96OUT",
              "apply":function (){
                return ((() => {
                  const T96OUT = this["T96OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T96OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T96OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T96OUT");
                gcs.informSelecteurOnMenuChange(255 , "T96OUT", false);
              }
            }
          )
        ) // Fin sequence pour T96
  ,
        hh.SEQUENCE( // Debut sequence pour T86
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
                  const T86IN  =this["T86IN"];
                  return T86IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T86IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T86IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T86OUT" : "T86OUT",
              "apply":function (){
                return ((() => {
                  const T86OUT = this["T86OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T86OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T86OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T86OUT");
                gcs.informSelecteurOnMenuChange(255 , "T86OUT", false);
              }
            }
          )
        ) // Fin sequence pour T86
      ), // Fin fork de make await avec en premiere position:T79
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
          "T79OUT":"T79OUT",
          "apply":function (){
            return ((() => {
              const T79 = this["T79OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T79OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T79OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T84OUT":"T84OUT",
          "apply":function (){
            return ((() => {
              const T84 = this["T84OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T84OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T84OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T48OUT":"T48OUT",
          "apply":function (){
            return ((() => {
              const T48 = this["T48OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T48OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T48OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T77OUT":"T77OUT",
          "apply":function (){
            return ((() => {
              const T77 = this["T77OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T77OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T77OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T96OUT":"T96OUT",
          "apply":function (){
            return ((() => {
              const T96 = this["T96OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T96OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T96OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T86OUT":"T86OUT",
          "apply":function (){
            return ((() => {
              const T86 = this["T86OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T86OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T86OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "T79", false);
            console.log("--- FIN RESERVOIR:", "T79");
            var msg = {
            type: 'killTank',
            value:  "T79"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank type12 + T30
    type12 = hh.MODULE({"id":"type12","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T30IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T8IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T69IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T57IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T12IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T51IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T30OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T8OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T69OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T57OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T12OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T51OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "T30" );
                var msg = {
                  type: 'startTank',
                  value:  "T30"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T30OUT":"T30OUT",
                "apply":function (){
                  return ((() => {
                    const T30 = this["T30OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T30OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T30OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T30OUT");
                gcs.informSelecteurOnMenuChange(255 , "T30OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T8OUT":"T8OUT",
                "apply":function (){
                  return ((() => {
                    const T8 = this["T8OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T8OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T8OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T8OUT");
                gcs.informSelecteurOnMenuChange(255 , "T8OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T69OUT":"T69OUT",
                "apply":function (){
                  return ((() => {
                    const T69 = this["T69OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T69OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T69OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T69OUT");
                gcs.informSelecteurOnMenuChange(255 , "T69OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T57OUT":"T57OUT",
                "apply":function (){
                  return ((() => {
                    const T57 = this["T57OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T57OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T57OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T57OUT");
                gcs.informSelecteurOnMenuChange(255 , "T57OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T12OUT":"T12OUT",
                "apply":function (){
                  return ((() => {
                    const T12 = this["T12OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T12OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T12OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T12OUT");
                gcs.informSelecteurOnMenuChange(255 , "T12OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T51OUT":"T51OUT",
                "apply":function (){
                  return ((() => {
                    const T51 = this["T51OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T51OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T51OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T51OUT");
                gcs.informSelecteurOnMenuChange(255 , "T51OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:T30
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour T30
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
                  const T30IN  =this["T30IN"];
                  return T30IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T30IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T30IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T30OUT" : "T30OUT",
              "apply":function (){
                return ((() => {
                  const T30OUT = this["T30OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T30OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T30OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T30OUT");
                gcs.informSelecteurOnMenuChange(255 , "T30OUT", false);
              }
            }
          )
        ) // Fin sequence pour T30
  ,
        hh.SEQUENCE( // Debut sequence pour T8
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
                  const T8IN  =this["T8IN"];
                  return T8IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T8IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T8IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T8OUT" : "T8OUT",
              "apply":function (){
                return ((() => {
                  const T8OUT = this["T8OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T8OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T8OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T8OUT");
                gcs.informSelecteurOnMenuChange(255 , "T8OUT", false);
              }
            }
          )
        ) // Fin sequence pour T8
  ,
        hh.SEQUENCE( // Debut sequence pour T69
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
                  const T69IN  =this["T69IN"];
                  return T69IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T69IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T69IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T69OUT" : "T69OUT",
              "apply":function (){
                return ((() => {
                  const T69OUT = this["T69OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T69OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T69OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T69OUT");
                gcs.informSelecteurOnMenuChange(255 , "T69OUT", false);
              }
            }
          )
        ) // Fin sequence pour T69
  ,
        hh.SEQUENCE( // Debut sequence pour T57
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
                  const T57IN  =this["T57IN"];
                  return T57IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T57IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T57IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T57OUT" : "T57OUT",
              "apply":function (){
                return ((() => {
                  const T57OUT = this["T57OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T57OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T57OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T57OUT");
                gcs.informSelecteurOnMenuChange(255 , "T57OUT", false);
              }
            }
          )
        ) // Fin sequence pour T57
  ,
        hh.SEQUENCE( // Debut sequence pour T12
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
                  const T12IN  =this["T12IN"];
                  return T12IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T12IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T12IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T12OUT" : "T12OUT",
              "apply":function (){
                return ((() => {
                  const T12OUT = this["T12OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T12OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T12OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T12OUT");
                gcs.informSelecteurOnMenuChange(255 , "T12OUT", false);
              }
            }
          )
        ) // Fin sequence pour T12
  ,
        hh.SEQUENCE( // Debut sequence pour T51
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
                  const T51IN  =this["T51IN"];
                  return T51IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T51IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T51IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T51OUT" : "T51OUT",
              "apply":function (){
                return ((() => {
                  const T51OUT = this["T51OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T51OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T51OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T51OUT");
                gcs.informSelecteurOnMenuChange(255 , "T51OUT", false);
              }
            }
          )
        ) // Fin sequence pour T51
      ), // Fin fork de make await avec en premiere position:T30
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
          "T30OUT":"T30OUT",
          "apply":function (){
            return ((() => {
              const T30 = this["T30OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T30OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T30OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T8OUT":"T8OUT",
          "apply":function (){
            return ((() => {
              const T8 = this["T8OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T8OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T8OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T69OUT":"T69OUT",
          "apply":function (){
            return ((() => {
              const T69 = this["T69OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T69OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T69OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T57OUT":"T57OUT",
          "apply":function (){
            return ((() => {
              const T57 = this["T57OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T57OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T57OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T12OUT":"T12OUT",
          "apply":function (){
            return ((() => {
              const T12 = this["T12OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T12OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T12OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T51OUT":"T51OUT",
          "apply":function (){
            return ((() => {
              const T51 = this["T51OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T51OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T51OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "T30", false);
            console.log("--- FIN RESERVOIR:", "T30");
            var msg = {
            type: 'killTank',
            value:  "T30"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank type13 + T95
    type13 = hh.MODULE({"id":"type13","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T95IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T35IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T58IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T87IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T23IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T60IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T95OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T35OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T58OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T87OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T23OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T60OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "T95" );
                var msg = {
                  type: 'startTank',
                  value:  "T95"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T95OUT":"T95OUT",
                "apply":function (){
                  return ((() => {
                    const T95 = this["T95OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T95OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T95OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T95OUT");
                gcs.informSelecteurOnMenuChange(255 , "T95OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T35OUT":"T35OUT",
                "apply":function (){
                  return ((() => {
                    const T35 = this["T35OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T35OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T35OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T35OUT");
                gcs.informSelecteurOnMenuChange(255 , "T35OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T58OUT":"T58OUT",
                "apply":function (){
                  return ((() => {
                    const T58 = this["T58OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T58OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T58OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T58OUT");
                gcs.informSelecteurOnMenuChange(255 , "T58OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T87OUT":"T87OUT",
                "apply":function (){
                  return ((() => {
                    const T87 = this["T87OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T87OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T87OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T87OUT");
                gcs.informSelecteurOnMenuChange(255 , "T87OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T23OUT":"T23OUT",
                "apply":function (){
                  return ((() => {
                    const T23 = this["T23OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T23OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T23OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T23OUT");
                gcs.informSelecteurOnMenuChange(255 , "T23OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T60OUT":"T60OUT",
                "apply":function (){
                  return ((() => {
                    const T60 = this["T60OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T60OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T60OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T60OUT");
                gcs.informSelecteurOnMenuChange(255 , "T60OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:T95
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour T95
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
                  const T95IN  =this["T95IN"];
                  return T95IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T95IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T95IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T95OUT" : "T95OUT",
              "apply":function (){
                return ((() => {
                  const T95OUT = this["T95OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T95OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T95OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T95OUT");
                gcs.informSelecteurOnMenuChange(255 , "T95OUT", false);
              }
            }
          )
        ) // Fin sequence pour T95
  ,
        hh.SEQUENCE( // Debut sequence pour T35
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
                  const T35IN  =this["T35IN"];
                  return T35IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T35IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T35IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T35OUT" : "T35OUT",
              "apply":function (){
                return ((() => {
                  const T35OUT = this["T35OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T35OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T35OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T35OUT");
                gcs.informSelecteurOnMenuChange(255 , "T35OUT", false);
              }
            }
          )
        ) // Fin sequence pour T35
  ,
        hh.SEQUENCE( // Debut sequence pour T58
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
                  const T58IN  =this["T58IN"];
                  return T58IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T58IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T58IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T58OUT" : "T58OUT",
              "apply":function (){
                return ((() => {
                  const T58OUT = this["T58OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T58OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T58OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T58OUT");
                gcs.informSelecteurOnMenuChange(255 , "T58OUT", false);
              }
            }
          )
        ) // Fin sequence pour T58
  ,
        hh.SEQUENCE( // Debut sequence pour T87
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
                  const T87IN  =this["T87IN"];
                  return T87IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T87IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T87IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T87OUT" : "T87OUT",
              "apply":function (){
                return ((() => {
                  const T87OUT = this["T87OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T87OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T87OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T87OUT");
                gcs.informSelecteurOnMenuChange(255 , "T87OUT", false);
              }
            }
          )
        ) // Fin sequence pour T87
  ,
        hh.SEQUENCE( // Debut sequence pour T23
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
                  const T23IN  =this["T23IN"];
                  return T23IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T23IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T23IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T23OUT" : "T23OUT",
              "apply":function (){
                return ((() => {
                  const T23OUT = this["T23OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T23OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T23OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T23OUT");
                gcs.informSelecteurOnMenuChange(255 , "T23OUT", false);
              }
            }
          )
        ) // Fin sequence pour T23
  ,
        hh.SEQUENCE( // Debut sequence pour T60
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
                  const T60IN  =this["T60IN"];
                  return T60IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T60IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T60IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T60OUT" : "T60OUT",
              "apply":function (){
                return ((() => {
                  const T60OUT = this["T60OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T60OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T60OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T60OUT");
                gcs.informSelecteurOnMenuChange(255 , "T60OUT", false);
              }
            }
          )
        ) // Fin sequence pour T60
      ), // Fin fork de make await avec en premiere position:T95
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
          "T95OUT":"T95OUT",
          "apply":function (){
            return ((() => {
              const T95 = this["T95OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T95OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T95OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T35OUT":"T35OUT",
          "apply":function (){
            return ((() => {
              const T35 = this["T35OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T35OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T35OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T58OUT":"T58OUT",
          "apply":function (){
            return ((() => {
              const T58 = this["T58OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T58OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T58OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T87OUT":"T87OUT",
          "apply":function (){
            return ((() => {
              const T87 = this["T87OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T87OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T87OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T23OUT":"T23OUT",
          "apply":function (){
            return ((() => {
              const T23 = this["T23OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T23OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T23OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T60OUT":"T60OUT",
          "apply":function (){
            return ((() => {
              const T60 = this["T60OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T60OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T60OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "T95", false);
            console.log("--- FIN RESERVOIR:", "T95");
            var msg = {
            type: 'killTank',
            value:  "T95"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank type14 + T19
    type14 = hh.MODULE({"id":"type14","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T19IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T47IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T90IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T33IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T50IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T78IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T19OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T47OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T90OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T33OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T50OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T78OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "T19" );
                var msg = {
                  type: 'startTank',
                  value:  "T19"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T19OUT":"T19OUT",
                "apply":function (){
                  return ((() => {
                    const T19 = this["T19OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T19OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T19OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T19OUT");
                gcs.informSelecteurOnMenuChange(255 , "T19OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T47OUT":"T47OUT",
                "apply":function (){
                  return ((() => {
                    const T47 = this["T47OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T47OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T47OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T47OUT");
                gcs.informSelecteurOnMenuChange(255 , "T47OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T90OUT":"T90OUT",
                "apply":function (){
                  return ((() => {
                    const T90 = this["T90OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T90OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T90OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T90OUT");
                gcs.informSelecteurOnMenuChange(255 , "T90OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T33OUT":"T33OUT",
                "apply":function (){
                  return ((() => {
                    const T33 = this["T33OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T33OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T33OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T33OUT");
                gcs.informSelecteurOnMenuChange(255 , "T33OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T50OUT":"T50OUT",
                "apply":function (){
                  return ((() => {
                    const T50 = this["T50OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T50OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T50OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T50OUT");
                gcs.informSelecteurOnMenuChange(255 , "T50OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T78OUT":"T78OUT",
                "apply":function (){
                  return ((() => {
                    const T78 = this["T78OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T78OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T78OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T78OUT");
                gcs.informSelecteurOnMenuChange(255 , "T78OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:T19
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour T19
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
                  const T19IN  =this["T19IN"];
                  return T19IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T19IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T19IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T19OUT" : "T19OUT",
              "apply":function (){
                return ((() => {
                  const T19OUT = this["T19OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T19OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T19OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T19OUT");
                gcs.informSelecteurOnMenuChange(255 , "T19OUT", false);
              }
            }
          )
        ) // Fin sequence pour T19
  ,
        hh.SEQUENCE( // Debut sequence pour T47
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
                  const T47IN  =this["T47IN"];
                  return T47IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T47IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T47IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T47OUT" : "T47OUT",
              "apply":function (){
                return ((() => {
                  const T47OUT = this["T47OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T47OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T47OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T47OUT");
                gcs.informSelecteurOnMenuChange(255 , "T47OUT", false);
              }
            }
          )
        ) // Fin sequence pour T47
  ,
        hh.SEQUENCE( // Debut sequence pour T90
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
                  const T90IN  =this["T90IN"];
                  return T90IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T90IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T90IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T90OUT" : "T90OUT",
              "apply":function (){
                return ((() => {
                  const T90OUT = this["T90OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T90OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T90OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T90OUT");
                gcs.informSelecteurOnMenuChange(255 , "T90OUT", false);
              }
            }
          )
        ) // Fin sequence pour T90
  ,
        hh.SEQUENCE( // Debut sequence pour T33
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
                  const T33IN  =this["T33IN"];
                  return T33IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T33IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T33IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T33OUT" : "T33OUT",
              "apply":function (){
                return ((() => {
                  const T33OUT = this["T33OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T33OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T33OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T33OUT");
                gcs.informSelecteurOnMenuChange(255 , "T33OUT", false);
              }
            }
          )
        ) // Fin sequence pour T33
  ,
        hh.SEQUENCE( // Debut sequence pour T50
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
                  const T50IN  =this["T50IN"];
                  return T50IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T50IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T50IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T50OUT" : "T50OUT",
              "apply":function (){
                return ((() => {
                  const T50OUT = this["T50OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T50OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T50OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T50OUT");
                gcs.informSelecteurOnMenuChange(255 , "T50OUT", false);
              }
            }
          )
        ) // Fin sequence pour T50
  ,
        hh.SEQUENCE( // Debut sequence pour T78
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
                  const T78IN  =this["T78IN"];
                  return T78IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T78IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T78IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T78OUT" : "T78OUT",
              "apply":function (){
                return ((() => {
                  const T78OUT = this["T78OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T78OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T78OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T78OUT");
                gcs.informSelecteurOnMenuChange(255 , "T78OUT", false);
              }
            }
          )
        ) // Fin sequence pour T78
      ), // Fin fork de make await avec en premiere position:T19
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
          "T19OUT":"T19OUT",
          "apply":function (){
            return ((() => {
              const T19 = this["T19OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T19OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T19OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T47OUT":"T47OUT",
          "apply":function (){
            return ((() => {
              const T47 = this["T47OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T47OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T47OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T90OUT":"T90OUT",
          "apply":function (){
            return ((() => {
              const T90 = this["T90OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T90OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T90OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T33OUT":"T33OUT",
          "apply":function (){
            return ((() => {
              const T33 = this["T33OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T33OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T33OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T50OUT":"T50OUT",
          "apply":function (){
            return ((() => {
              const T50 = this["T50OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T50OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T50OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T78OUT":"T78OUT",
          "apply":function (){
            return ((() => {
              const T78 = this["T78OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T78OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T78OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "T19", false);
            console.log("--- FIN RESERVOIR:", "T19");
            var msg = {
            type: 'killTank',
            value:  "T19"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank type15 + T66
    type15 = hh.MODULE({"id":"type15","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T66IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T88IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T21IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T10IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T91IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"T31IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T66OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T88OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T21OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T10OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T91OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"T31OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "T66" );
                var msg = {
                  type: 'startTank',
                  value:  "T66"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T66OUT":"T66OUT",
                "apply":function (){
                  return ((() => {
                    const T66 = this["T66OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T66OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T66OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T66OUT");
                gcs.informSelecteurOnMenuChange(255 , "T66OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T88OUT":"T88OUT",
                "apply":function (){
                  return ((() => {
                    const T88 = this["T88OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T88OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T88OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T88OUT");
                gcs.informSelecteurOnMenuChange(255 , "T88OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T21OUT":"T21OUT",
                "apply":function (){
                  return ((() => {
                    const T21 = this["T21OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T21OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T21OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T21OUT");
                gcs.informSelecteurOnMenuChange(255 , "T21OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T10OUT":"T10OUT",
                "apply":function (){
                  return ((() => {
                    const T10 = this["T10OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T10OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T10OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T10OUT");
                gcs.informSelecteurOnMenuChange(255 , "T10OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T91OUT":"T91OUT",
                "apply":function (){
                  return ((() => {
                    const T91 = this["T91OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T91OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T91OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T91OUT");
                gcs.informSelecteurOnMenuChange(255 , "T91OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "T31OUT":"T31OUT",
                "apply":function (){
                  return ((() => {
                    const T31 = this["T31OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"T31OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit T31OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "T31OUT");
                gcs.informSelecteurOnMenuChange(255 , "T31OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:T66
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour T66
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
                  const T66IN  =this["T66IN"];
                  return T66IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T66IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T66IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T66OUT" : "T66OUT",
              "apply":function (){
                return ((() => {
                  const T66OUT = this["T66OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T66OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T66OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T66OUT");
                gcs.informSelecteurOnMenuChange(255 , "T66OUT", false);
              }
            }
          )
        ) // Fin sequence pour T66
  ,
        hh.SEQUENCE( // Debut sequence pour T88
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
                  const T88IN  =this["T88IN"];
                  return T88IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T88IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T88IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T88OUT" : "T88OUT",
              "apply":function (){
                return ((() => {
                  const T88OUT = this["T88OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T88OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T88OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T88OUT");
                gcs.informSelecteurOnMenuChange(255 , "T88OUT", false);
              }
            }
          )
        ) // Fin sequence pour T88
  ,
        hh.SEQUENCE( // Debut sequence pour T21
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
                  const T21IN  =this["T21IN"];
                  return T21IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T21IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T21IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T21OUT" : "T21OUT",
              "apply":function (){
                return ((() => {
                  const T21OUT = this["T21OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T21OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T21OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T21OUT");
                gcs.informSelecteurOnMenuChange(255 , "T21OUT", false);
              }
            }
          )
        ) // Fin sequence pour T21
  ,
        hh.SEQUENCE( // Debut sequence pour T10
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
                  const T10IN  =this["T10IN"];
                  return T10IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T10IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T10IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T10OUT" : "T10OUT",
              "apply":function (){
                return ((() => {
                  const T10OUT = this["T10OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T10OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T10OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T10OUT");
                gcs.informSelecteurOnMenuChange(255 , "T10OUT", false);
              }
            }
          )
        ) // Fin sequence pour T10
  ,
        hh.SEQUENCE( // Debut sequence pour T91
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
                  const T91IN  =this["T91IN"];
                  return T91IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T91IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T91IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T91OUT" : "T91OUT",
              "apply":function (){
                return ((() => {
                  const T91OUT = this["T91OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T91OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T91OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T91OUT");
                gcs.informSelecteurOnMenuChange(255 , "T91OUT", false);
              }
            }
          )
        ) // Fin sequence pour T91
  ,
        hh.SEQUENCE( // Debut sequence pour T31
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
                  const T31IN  =this["T31IN"];
                  return T31IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"T31IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await T31IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "T31OUT" : "T31OUT",
              "apply":function (){
                return ((() => {
                  const T31OUT = this["T31OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"T31OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit T31OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "T31OUT");
                gcs.informSelecteurOnMenuChange(255 , "T31OUT", false);
              }
            }
          )
        ) // Fin sequence pour T31
      ), // Fin fork de make await avec en premiere position:T66
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
          "T66OUT":"T66OUT",
          "apply":function (){
            return ((() => {
              const T66 = this["T66OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T66OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T66OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T88OUT":"T88OUT",
          "apply":function (){
            return ((() => {
              const T88 = this["T88OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T88OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T88OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T21OUT":"T21OUT",
          "apply":function (){
            return ((() => {
              const T21 = this["T21OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T21OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T21OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T10OUT":"T10OUT",
          "apply":function (){
            return ((() => {
              const T10 = this["T10OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T10OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T10OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T91OUT":"T91OUT",
          "apply":function (){
            return ((() => {
              const T91 = this["T91OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T91OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T91OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "T31OUT":"T31OUT",
          "apply":function (){
            return ((() => {
              const T31 = this["T31OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"T31OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit T31OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "T66", false);
            console.log("--- FIN RESERVOIR:", "T66");
            var msg = {
            type: 'killTank',
            value:  "T66"
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

  transposeClavier = hh.MODULE({"id":"transposeClavier","%location":{},"%tag":"module"},

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
          "countapply":function (){ return 12;}
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
          "countapply":function (){ return 12;}
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
          "countapply":function (){ return 12;}
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
            value:'Wurfelspiel'
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {console.log('Wurfelspiel');}
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
              text:'0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15'
            }
            serveur.broadcast(JSON.stringify(msg));
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
          setTempo(60);
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
            DAW.pauseQueues();
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
            DAW.resumeQueues();
          }
        }
      ),
      hh.RUN({
        "%location":{},
        "%tag":"run",
        "module": transposeClavier,
        "tick":"",

      }),

      ),

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
              moveTempo(4, 10);
            }
          }
        )
      )
    ),


    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":type0,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":type1,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":type2,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":type3,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":type4,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":type5,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":type6,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":type7,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":type8,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":type9,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":type10,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":type11,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":type12,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":type13,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":type14,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":type15,
        "autocomplete":true
      }),

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
