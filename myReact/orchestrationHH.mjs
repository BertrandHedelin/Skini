var FluteD, tick, FluteE, FluteD1, FluteD2, FluteD3, FluteD4, FluteD5, FluteD6, FluteD7, FluteD8, FluteD9, FluteD10, FluteD11, FluteD12, FluteE1, FluteE2, FluteE3, FluteE4, FluteE5, FluteE6, FluteE7, FluteE8, FluteE9, FluteE10, FluteE11, FluteE12, PianoD, PianoE;



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


    // Module tank FluteD + FluteD1
    FluteD = hh.MODULE({"id":"FluteD","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteD1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteD2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteD3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteD4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteD5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteD6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteD7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteD8IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteD9IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteD10IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteD11IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteD12IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteD1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteD2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteD3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteD4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteD5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteD6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteD7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteD8OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteD9OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteD10OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteD11OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteD12OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "FluteD1,FluteD2,FluteD3,FluteD4,FluteD5,FluteD6,FluteD7,FluteD8,FluteD9,FluteD10,FluteD11,FluteD12" );
                var msg = {
                  type: 'startTank',
                  value:  "FluteD1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteD1OUT":"FluteD1OUT",
                "apply":function (){
                  return ((() => {
                    const FluteD1 = this["FluteD1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteD1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteD1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteD1OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteD2OUT":"FluteD2OUT",
                "apply":function (){
                  return ((() => {
                    const FluteD2 = this["FluteD2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteD2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteD2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteD2OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteD3OUT":"FluteD3OUT",
                "apply":function (){
                  return ((() => {
                    const FluteD3 = this["FluteD3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteD3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteD3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteD3OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteD4OUT":"FluteD4OUT",
                "apply":function (){
                  return ((() => {
                    const FluteD4 = this["FluteD4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteD4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteD4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteD4OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteD5OUT":"FluteD5OUT",
                "apply":function (){
                  return ((() => {
                    const FluteD5 = this["FluteD5OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteD5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteD5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteD5OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteD6OUT":"FluteD6OUT",
                "apply":function (){
                  return ((() => {
                    const FluteD6 = this["FluteD6OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteD6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteD6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteD6OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteD7OUT":"FluteD7OUT",
                "apply":function (){
                  return ((() => {
                    const FluteD7 = this["FluteD7OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteD7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteD7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteD7OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD7OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteD8OUT":"FluteD8OUT",
                "apply":function (){
                  return ((() => {
                    const FluteD8 = this["FluteD8OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteD8OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteD8OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteD8OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD8OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteD9OUT":"FluteD9OUT",
                "apply":function (){
                  return ((() => {
                    const FluteD9 = this["FluteD9OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteD9OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteD9OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteD9OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD9OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteD10OUT":"FluteD10OUT",
                "apply":function (){
                  return ((() => {
                    const FluteD10 = this["FluteD10OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteD10OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteD10OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteD10OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD10OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteD11OUT":"FluteD11OUT",
                "apply":function (){
                  return ((() => {
                    const FluteD11 = this["FluteD11OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteD11OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteD11OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteD11OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD11OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteD12OUT":"FluteD12OUT",
                "apply":function (){
                  return ((() => {
                    const FluteD12 = this["FluteD12OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteD12OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteD12OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteD12OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD12OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:FluteD1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour FluteD1
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
                  const FluteD1IN  =this["FluteD1IN"];
                  return FluteD1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteD1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteD1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteD1OUT" : "FluteD1OUT",
              "apply":function (){
                return ((() => {
                  const FluteD1OUT = this["FluteD1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteD1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteD1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteD1OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD1OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteD1
  ,
        hh.SEQUENCE( // Debut sequence pour FluteD2
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
                  const FluteD2IN  =this["FluteD2IN"];
                  return FluteD2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteD2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteD2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteD2OUT" : "FluteD2OUT",
              "apply":function (){
                return ((() => {
                  const FluteD2OUT = this["FluteD2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteD2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteD2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteD2OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD2OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteD2
  ,
        hh.SEQUENCE( // Debut sequence pour FluteD3
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
                  const FluteD3IN  =this["FluteD3IN"];
                  return FluteD3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteD3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteD3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteD3OUT" : "FluteD3OUT",
              "apply":function (){
                return ((() => {
                  const FluteD3OUT = this["FluteD3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteD3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteD3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteD3OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD3OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteD3
  ,
        hh.SEQUENCE( // Debut sequence pour FluteD4
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
                  const FluteD4IN  =this["FluteD4IN"];
                  return FluteD4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteD4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteD4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteD4OUT" : "FluteD4OUT",
              "apply":function (){
                return ((() => {
                  const FluteD4OUT = this["FluteD4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteD4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteD4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteD4OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD4OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteD4
  ,
        hh.SEQUENCE( // Debut sequence pour FluteD5
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
                  const FluteD5IN  =this["FluteD5IN"];
                  return FluteD5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteD5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteD5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteD5OUT" : "FluteD5OUT",
              "apply":function (){
                return ((() => {
                  const FluteD5OUT = this["FluteD5OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteD5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteD5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteD5OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD5OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteD5
  ,
        hh.SEQUENCE( // Debut sequence pour FluteD6
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
                  const FluteD6IN  =this["FluteD6IN"];
                  return FluteD6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteD6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteD6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteD6OUT" : "FluteD6OUT",
              "apply":function (){
                return ((() => {
                  const FluteD6OUT = this["FluteD6OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteD6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteD6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteD6OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD6OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteD6
  ,
        hh.SEQUENCE( // Debut sequence pour FluteD7
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
                  const FluteD7IN  =this["FluteD7IN"];
                  return FluteD7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteD7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteD7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteD7OUT" : "FluteD7OUT",
              "apply":function (){
                return ((() => {
                  const FluteD7OUT = this["FluteD7OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteD7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteD7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteD7OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD7OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteD7
  ,
        hh.SEQUENCE( // Debut sequence pour FluteD8
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
                  const FluteD8IN  =this["FluteD8IN"];
                  return FluteD8IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteD8IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteD8IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteD8OUT" : "FluteD8OUT",
              "apply":function (){
                return ((() => {
                  const FluteD8OUT = this["FluteD8OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteD8OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteD8OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteD8OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD8OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteD8
  ,
        hh.SEQUENCE( // Debut sequence pour FluteD9
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
                  const FluteD9IN  =this["FluteD9IN"];
                  return FluteD9IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteD9IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteD9IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteD9OUT" : "FluteD9OUT",
              "apply":function (){
                return ((() => {
                  const FluteD9OUT = this["FluteD9OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteD9OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteD9OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteD9OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD9OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteD9
  ,
        hh.SEQUENCE( // Debut sequence pour FluteD10
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
                  const FluteD10IN  =this["FluteD10IN"];
                  return FluteD10IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteD10IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteD10IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteD10OUT" : "FluteD10OUT",
              "apply":function (){
                return ((() => {
                  const FluteD10OUT = this["FluteD10OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteD10OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteD10OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteD10OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD10OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteD10
  ,
        hh.SEQUENCE( // Debut sequence pour FluteD11
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
                  const FluteD11IN  =this["FluteD11IN"];
                  return FluteD11IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteD11IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteD11IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteD11OUT" : "FluteD11OUT",
              "apply":function (){
                return ((() => {
                  const FluteD11OUT = this["FluteD11OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteD11OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteD11OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteD11OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD11OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteD11
  ,
        hh.SEQUENCE( // Debut sequence pour FluteD12
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
                  const FluteD12IN  =this["FluteD12IN"];
                  return FluteD12IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteD12IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteD12IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteD12OUT" : "FluteD12OUT",
              "apply":function (){
                return ((() => {
                  const FluteD12OUT = this["FluteD12OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteD12OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteD12OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteD12OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteD12OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteD12
      ), // Fin fork de make await avec en premiere position:FluteD1
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
          "FluteD1OUT":"FluteD1OUT",
          "apply":function (){
            return ((() => {
              const FluteD1 = this["FluteD1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteD1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteD1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteD2OUT":"FluteD2OUT",
          "apply":function (){
            return ((() => {
              const FluteD2 = this["FluteD2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteD2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteD2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteD3OUT":"FluteD3OUT",
          "apply":function (){
            return ((() => {
              const FluteD3 = this["FluteD3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteD3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteD3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteD4OUT":"FluteD4OUT",
          "apply":function (){
            return ((() => {
              const FluteD4 = this["FluteD4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteD4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteD4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteD5OUT":"FluteD5OUT",
          "apply":function (){
            return ((() => {
              const FluteD5 = this["FluteD5OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteD5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteD5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteD6OUT":"FluteD6OUT",
          "apply":function (){
            return ((() => {
              const FluteD6 = this["FluteD6OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteD6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteD6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteD7OUT":"FluteD7OUT",
          "apply":function (){
            return ((() => {
              const FluteD7 = this["FluteD7OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteD7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteD7OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteD8OUT":"FluteD8OUT",
          "apply":function (){
            return ((() => {
              const FluteD8 = this["FluteD8OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteD8OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteD8OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteD9OUT":"FluteD9OUT",
          "apply":function (){
            return ((() => {
              const FluteD9 = this["FluteD9OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteD9OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteD9OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteD10OUT":"FluteD10OUT",
          "apply":function (){
            return ((() => {
              const FluteD10 = this["FluteD10OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteD10OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteD10OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteD11OUT":"FluteD11OUT",
          "apply":function (){
            return ((() => {
              const FluteD11 = this["FluteD11OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteD11OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteD11OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteD12OUT":"FluteD12OUT",
          "apply":function (){
            return ((() => {
              const FluteD12 = this["FluteD12OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteD12OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteD12OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "FluteD1", false);
            console.log("--- FIN RESERVOIR:", "FluteD1");
            var msg = {
            type: 'killTank',
            value:  "FluteD1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank FluteE + FluteE1
    FluteE = hh.MODULE({"id":"FluteE","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteE1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteE2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteE3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteE4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteE5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteE6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteE7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteE8IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteE9IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteE10IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteE11IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteE12IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteE1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteE2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteE3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteE4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteE5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteE6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteE7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteE8OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteE9OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteE10OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteE11OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteE12OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "FluteE1,FluteE2,FluteE3,FluteE4,FluteE5,FluteE6,FluteE7,FluteE8,FluteE9,FluteE10,FluteE11,FluteE12" );
                var msg = {
                  type: 'startTank',
                  value:  "FluteE1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteE1OUT":"FluteE1OUT",
                "apply":function (){
                  return ((() => {
                    const FluteE1 = this["FluteE1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteE1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteE1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteE1OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteE2OUT":"FluteE2OUT",
                "apply":function (){
                  return ((() => {
                    const FluteE2 = this["FluteE2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteE2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteE2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteE2OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteE3OUT":"FluteE3OUT",
                "apply":function (){
                  return ((() => {
                    const FluteE3 = this["FluteE3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteE3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteE3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteE3OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteE4OUT":"FluteE4OUT",
                "apply":function (){
                  return ((() => {
                    const FluteE4 = this["FluteE4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteE4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteE4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteE4OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteE5OUT":"FluteE5OUT",
                "apply":function (){
                  return ((() => {
                    const FluteE5 = this["FluteE5OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteE5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteE5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteE5OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteE6OUT":"FluteE6OUT",
                "apply":function (){
                  return ((() => {
                    const FluteE6 = this["FluteE6OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteE6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteE6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteE6OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteE7OUT":"FluteE7OUT",
                "apply":function (){
                  return ((() => {
                    const FluteE7 = this["FluteE7OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteE7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteE7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteE7OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE7OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteE8OUT":"FluteE8OUT",
                "apply":function (){
                  return ((() => {
                    const FluteE8 = this["FluteE8OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteE8OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteE8OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteE8OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE8OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteE9OUT":"FluteE9OUT",
                "apply":function (){
                  return ((() => {
                    const FluteE9 = this["FluteE9OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteE9OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteE9OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteE9OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE9OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteE10OUT":"FluteE10OUT",
                "apply":function (){
                  return ((() => {
                    const FluteE10 = this["FluteE10OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteE10OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteE10OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteE10OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE10OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteE11OUT":"FluteE11OUT",
                "apply":function (){
                  return ((() => {
                    const FluteE11 = this["FluteE11OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteE11OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteE11OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteE11OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE11OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteE12OUT":"FluteE12OUT",
                "apply":function (){
                  return ((() => {
                    const FluteE12 = this["FluteE12OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteE12OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteE12OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteE12OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE12OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:FluteE1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour FluteE1
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
                  const FluteE1IN  =this["FluteE1IN"];
                  return FluteE1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteE1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteE1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteE1OUT" : "FluteE1OUT",
              "apply":function (){
                return ((() => {
                  const FluteE1OUT = this["FluteE1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteE1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteE1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteE1OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE1OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteE1
  ,
        hh.SEQUENCE( // Debut sequence pour FluteE2
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
                  const FluteE2IN  =this["FluteE2IN"];
                  return FluteE2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteE2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteE2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteE2OUT" : "FluteE2OUT",
              "apply":function (){
                return ((() => {
                  const FluteE2OUT = this["FluteE2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteE2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteE2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteE2OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE2OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteE2
  ,
        hh.SEQUENCE( // Debut sequence pour FluteE3
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
                  const FluteE3IN  =this["FluteE3IN"];
                  return FluteE3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteE3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteE3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteE3OUT" : "FluteE3OUT",
              "apply":function (){
                return ((() => {
                  const FluteE3OUT = this["FluteE3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteE3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteE3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteE3OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE3OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteE3
  ,
        hh.SEQUENCE( // Debut sequence pour FluteE4
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
                  const FluteE4IN  =this["FluteE4IN"];
                  return FluteE4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteE4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteE4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteE4OUT" : "FluteE4OUT",
              "apply":function (){
                return ((() => {
                  const FluteE4OUT = this["FluteE4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteE4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteE4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteE4OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE4OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteE4
  ,
        hh.SEQUENCE( // Debut sequence pour FluteE5
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
                  const FluteE5IN  =this["FluteE5IN"];
                  return FluteE5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteE5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteE5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteE5OUT" : "FluteE5OUT",
              "apply":function (){
                return ((() => {
                  const FluteE5OUT = this["FluteE5OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteE5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteE5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteE5OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE5OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteE5
  ,
        hh.SEQUENCE( // Debut sequence pour FluteE6
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
                  const FluteE6IN  =this["FluteE6IN"];
                  return FluteE6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteE6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteE6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteE6OUT" : "FluteE6OUT",
              "apply":function (){
                return ((() => {
                  const FluteE6OUT = this["FluteE6OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteE6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteE6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteE6OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE6OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteE6
  ,
        hh.SEQUENCE( // Debut sequence pour FluteE7
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
                  const FluteE7IN  =this["FluteE7IN"];
                  return FluteE7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteE7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteE7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteE7OUT" : "FluteE7OUT",
              "apply":function (){
                return ((() => {
                  const FluteE7OUT = this["FluteE7OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteE7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteE7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteE7OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE7OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteE7
  ,
        hh.SEQUENCE( // Debut sequence pour FluteE8
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
                  const FluteE8IN  =this["FluteE8IN"];
                  return FluteE8IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteE8IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteE8IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteE8OUT" : "FluteE8OUT",
              "apply":function (){
                return ((() => {
                  const FluteE8OUT = this["FluteE8OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteE8OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteE8OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteE8OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE8OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteE8
  ,
        hh.SEQUENCE( // Debut sequence pour FluteE9
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
                  const FluteE9IN  =this["FluteE9IN"];
                  return FluteE9IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteE9IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteE9IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteE9OUT" : "FluteE9OUT",
              "apply":function (){
                return ((() => {
                  const FluteE9OUT = this["FluteE9OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteE9OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteE9OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteE9OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE9OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteE9
  ,
        hh.SEQUENCE( // Debut sequence pour FluteE10
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
                  const FluteE10IN  =this["FluteE10IN"];
                  return FluteE10IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteE10IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteE10IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteE10OUT" : "FluteE10OUT",
              "apply":function (){
                return ((() => {
                  const FluteE10OUT = this["FluteE10OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteE10OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteE10OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteE10OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE10OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteE10
  ,
        hh.SEQUENCE( // Debut sequence pour FluteE11
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
                  const FluteE11IN  =this["FluteE11IN"];
                  return FluteE11IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteE11IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteE11IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteE11OUT" : "FluteE11OUT",
              "apply":function (){
                return ((() => {
                  const FluteE11OUT = this["FluteE11OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteE11OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteE11OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteE11OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE11OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteE11
  ,
        hh.SEQUENCE( // Debut sequence pour FluteE12
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
                  const FluteE12IN  =this["FluteE12IN"];
                  return FluteE12IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteE12IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteE12IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteE12OUT" : "FluteE12OUT",
              "apply":function (){
                return ((() => {
                  const FluteE12OUT = this["FluteE12OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteE12OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteE12OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteE12OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteE12OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteE12
      ), // Fin fork de make await avec en premiere position:FluteE1
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
          "FluteE1OUT":"FluteE1OUT",
          "apply":function (){
            return ((() => {
              const FluteE1 = this["FluteE1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteE1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteE1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteE2OUT":"FluteE2OUT",
          "apply":function (){
            return ((() => {
              const FluteE2 = this["FluteE2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteE2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteE2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteE3OUT":"FluteE3OUT",
          "apply":function (){
            return ((() => {
              const FluteE3 = this["FluteE3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteE3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteE3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteE4OUT":"FluteE4OUT",
          "apply":function (){
            return ((() => {
              const FluteE4 = this["FluteE4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteE4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteE4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteE5OUT":"FluteE5OUT",
          "apply":function (){
            return ((() => {
              const FluteE5 = this["FluteE5OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteE5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteE5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteE6OUT":"FluteE6OUT",
          "apply":function (){
            return ((() => {
              const FluteE6 = this["FluteE6OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteE6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteE6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteE7OUT":"FluteE7OUT",
          "apply":function (){
            return ((() => {
              const FluteE7 = this["FluteE7OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteE7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteE7OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteE8OUT":"FluteE8OUT",
          "apply":function (){
            return ((() => {
              const FluteE8 = this["FluteE8OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteE8OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteE8OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteE9OUT":"FluteE9OUT",
          "apply":function (){
            return ((() => {
              const FluteE9 = this["FluteE9OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteE9OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteE9OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteE10OUT":"FluteE10OUT",
          "apply":function (){
            return ((() => {
              const FluteE10 = this["FluteE10OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteE10OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteE10OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteE11OUT":"FluteE11OUT",
          "apply":function (){
            return ((() => {
              const FluteE11 = this["FluteE11OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteE11OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteE11OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteE12OUT":"FluteE12OUT",
          "apply":function (){
            return ((() => {
              const FluteE12 = this["FluteE12OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteE12OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteE12OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "FluteE1", false);
            console.log("--- FIN RESERVOIR:", "FluteE1");
            var msg = {
            type: 'killTank',
            value:  "FluteE1"
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

    hh.AWAIT(
      {
        "%location":{},
        "%tag":"await",
        "immediate":true,
        "apply":function () {
          return ((() => {
            const tick=this["tick"];
            return tick.now;
          })());
        }
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
        gcs.setTimerDivision(1);
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
            value:'Etude Harmonie 2'
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
      "countapply":function (){ return 2;}
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
      "apply":function () {console.log('Etude Harmonie 2');}
    }
  ),

        hh.FORK(
            {
              "%location":{},
              "%tag":"fork"
            },


        hh.TRAP(
          {
            "trap778242":"trap778242",
            "%location":{},
            "%tag":"trap778242"
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
                "PianoDOUT":"PianoDOUT",
                "apply":function (){
                  return ((() => {
                    const PianoDOUT = this["PianoDOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoDOUT",
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
                  gcs.informSelecteurOnMenuChange(255," PianoD", true);
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
    	              "countapply":function (){return 30;}
    	          },
    	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
    	        ),


    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "PianoDOUT":"PianoDOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const PianoDOUT = this["PianoDOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"PianoDOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," PianoD", false); }
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
    		          "trap778242":"trap778242",
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

        hh.TRAP(
          {
            "trap412232":"trap412232",
            "%location":{},
            "%tag":"trap412232"
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
                "PianoEOUT":"PianoEOUT",
                "apply":function (){
                  return ((() => {
                    const PianoEOUT = this["PianoEOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoEOUT",
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
                  gcs.informSelecteurOnMenuChange(255," PianoE", true);
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
    	              "countapply":function (){return 30;}
    	          },
    	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
    	        ),


    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "PianoEOUT":"PianoEOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const PianoEOUT = this["PianoEOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"PianoEOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," PianoE", false); }
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
    		          "trap412232":"trap412232",
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

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":FluteE,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":FluteD,
        "autocomplete":true
      }),

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
          var msg = {
            type: 'alertInfoScoreON',
            value:'Fin Etude Harmonie 2'
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
