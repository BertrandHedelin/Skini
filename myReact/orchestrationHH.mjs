var PianoC, tick, PianoEb, PianoC1, PianoC2, PianoC3, PianoC4, PianoC5, PianoGb, PianoEb1, PianoEb2, PianoEb3, PianoEb4, PianoEb5, PianoA, PianoGb1, PianoGb2, PianoGb3, PianoGb4, PianoGb5, PianoA1, PianoA2, PianoA3, PianoA4, PianoA5, Viol1C, Viol2C, AltoC, CelloC, Viol1Eb, Viol2Eb, AltoEb, CelloEb, Viol1Gb, Viol2Gb, AltoGb, CelloGb, Viol1A, Viol2A, AltoA, CelloA;


// Fonctionne avec EtudeSkiniHarmonie4.als de Live.
// Pour les tests, j'aime bien utiliser le
// simulateurListe pour suivre son comportement.
//
//
//
//
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


    // Module tank PianoC + PianoC1
    PianoC = hh.MODULE({"id":"PianoC","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoC1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoC2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoC3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoC4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoC5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoC1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoC2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoC3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoC4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoC5OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "PianoC1,PianoC2,PianoC3,PianoC4,PianoC5" );
                var msg = {
                  type: 'startTank',
                  value:  "PianoC1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoC1OUT":"PianoC1OUT",
                "apply":function (){
                  return ((() => {
                    const PianoC1 = this["PianoC1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoC1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoC1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoC1OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoC1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoC2OUT":"PianoC2OUT",
                "apply":function (){
                  return ((() => {
                    const PianoC2 = this["PianoC2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoC2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoC2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoC2OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoC2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoC3OUT":"PianoC3OUT",
                "apply":function (){
                  return ((() => {
                    const PianoC3 = this["PianoC3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoC3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoC3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoC3OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoC3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoC4OUT":"PianoC4OUT",
                "apply":function (){
                  return ((() => {
                    const PianoC4 = this["PianoC4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoC4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoC4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoC4OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoC4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoC5OUT":"PianoC5OUT",
                "apply":function (){
                  return ((() => {
                    const PianoC5 = this["PianoC5OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoC5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoC5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoC5OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoC5OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:PianoC1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour PianoC1
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
                  const PianoC1IN  =this["PianoC1IN"];
                  return PianoC1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoC1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoC1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoC1OUT" : "PianoC1OUT",
              "apply":function (){
                return ((() => {
                  const PianoC1OUT = this["PianoC1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoC1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoC1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoC1OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoC1OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoC1
  ,
        hh.SEQUENCE( // Debut sequence pour PianoC2
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
                  const PianoC2IN  =this["PianoC2IN"];
                  return PianoC2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoC2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoC2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoC2OUT" : "PianoC2OUT",
              "apply":function (){
                return ((() => {
                  const PianoC2OUT = this["PianoC2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoC2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoC2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoC2OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoC2OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoC2
  ,
        hh.SEQUENCE( // Debut sequence pour PianoC3
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
                  const PianoC3IN  =this["PianoC3IN"];
                  return PianoC3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoC3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoC3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoC3OUT" : "PianoC3OUT",
              "apply":function (){
                return ((() => {
                  const PianoC3OUT = this["PianoC3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoC3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoC3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoC3OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoC3OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoC3
  ,
        hh.SEQUENCE( // Debut sequence pour PianoC4
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
                  const PianoC4IN  =this["PianoC4IN"];
                  return PianoC4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoC4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoC4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoC4OUT" : "PianoC4OUT",
              "apply":function (){
                return ((() => {
                  const PianoC4OUT = this["PianoC4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoC4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoC4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoC4OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoC4OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoC4
  ,
        hh.SEQUENCE( // Debut sequence pour PianoC5
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
                  const PianoC5IN  =this["PianoC5IN"];
                  return PianoC5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoC5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoC5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoC5OUT" : "PianoC5OUT",
              "apply":function (){
                return ((() => {
                  const PianoC5OUT = this["PianoC5OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoC5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoC5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoC5OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoC5OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoC5
      ), // Fin fork de make await avec en premiere position:PianoC1
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
          "PianoC1OUT":"PianoC1OUT",
          "apply":function (){
            return ((() => {
              const PianoC1 = this["PianoC1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoC1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoC1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "PianoC2OUT":"PianoC2OUT",
          "apply":function (){
            return ((() => {
              const PianoC2 = this["PianoC2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoC2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoC2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "PianoC3OUT":"PianoC3OUT",
          "apply":function (){
            return ((() => {
              const PianoC3 = this["PianoC3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoC3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoC3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "PianoC4OUT":"PianoC4OUT",
          "apply":function (){
            return ((() => {
              const PianoC4 = this["PianoC4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoC4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoC4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "PianoC5OUT":"PianoC5OUT",
          "apply":function (){
            return ((() => {
              const PianoC5 = this["PianoC5OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoC5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoC5OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "PianoC1", false);
            console.log("--- FIN RESERVOIR:", "PianoC1");
            var msg = {
            type: 'killTank',
            value:  "PianoC1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank PianoEb + PianoEb1
    PianoEb = hh.MODULE({"id":"PianoEb","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoEb1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoEb2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoEb3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoEb4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoEb5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoEb1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoEb2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoEb3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoEb4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoEb5OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "PianoEb1,PianoEb2,PianoEb3,PianoEb4,PianoEb5" );
                var msg = {
                  type: 'startTank',
                  value:  "PianoEb1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoEb1OUT":"PianoEb1OUT",
                "apply":function (){
                  return ((() => {
                    const PianoEb1 = this["PianoEb1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoEb1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoEb1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoEb1OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoEb1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoEb2OUT":"PianoEb2OUT",
                "apply":function (){
                  return ((() => {
                    const PianoEb2 = this["PianoEb2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoEb2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoEb2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoEb2OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoEb2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoEb3OUT":"PianoEb3OUT",
                "apply":function (){
                  return ((() => {
                    const PianoEb3 = this["PianoEb3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoEb3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoEb3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoEb3OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoEb3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoEb4OUT":"PianoEb4OUT",
                "apply":function (){
                  return ((() => {
                    const PianoEb4 = this["PianoEb4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoEb4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoEb4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoEb4OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoEb4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoEb5OUT":"PianoEb5OUT",
                "apply":function (){
                  return ((() => {
                    const PianoEb5 = this["PianoEb5OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoEb5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoEb5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoEb5OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoEb5OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:PianoEb1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour PianoEb1
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
                  const PianoEb1IN  =this["PianoEb1IN"];
                  return PianoEb1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoEb1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoEb1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoEb1OUT" : "PianoEb1OUT",
              "apply":function (){
                return ((() => {
                  const PianoEb1OUT = this["PianoEb1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoEb1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoEb1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoEb1OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoEb1OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoEb1
  ,
        hh.SEQUENCE( // Debut sequence pour PianoEb2
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
                  const PianoEb2IN  =this["PianoEb2IN"];
                  return PianoEb2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoEb2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoEb2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoEb2OUT" : "PianoEb2OUT",
              "apply":function (){
                return ((() => {
                  const PianoEb2OUT = this["PianoEb2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoEb2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoEb2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoEb2OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoEb2OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoEb2
  ,
        hh.SEQUENCE( // Debut sequence pour PianoEb3
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
                  const PianoEb3IN  =this["PianoEb3IN"];
                  return PianoEb3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoEb3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoEb3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoEb3OUT" : "PianoEb3OUT",
              "apply":function (){
                return ((() => {
                  const PianoEb3OUT = this["PianoEb3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoEb3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoEb3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoEb3OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoEb3OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoEb3
  ,
        hh.SEQUENCE( // Debut sequence pour PianoEb4
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
                  const PianoEb4IN  =this["PianoEb4IN"];
                  return PianoEb4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoEb4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoEb4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoEb4OUT" : "PianoEb4OUT",
              "apply":function (){
                return ((() => {
                  const PianoEb4OUT = this["PianoEb4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoEb4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoEb4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoEb4OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoEb4OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoEb4
  ,
        hh.SEQUENCE( // Debut sequence pour PianoEb5
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
                  const PianoEb5IN  =this["PianoEb5IN"];
                  return PianoEb5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoEb5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoEb5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoEb5OUT" : "PianoEb5OUT",
              "apply":function (){
                return ((() => {
                  const PianoEb5OUT = this["PianoEb5OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoEb5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoEb5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoEb5OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoEb5OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoEb5
      ), // Fin fork de make await avec en premiere position:PianoEb1
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
          "PianoEb1OUT":"PianoEb1OUT",
          "apply":function (){
            return ((() => {
              const PianoEb1 = this["PianoEb1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoEb1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoEb1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "PianoEb2OUT":"PianoEb2OUT",
          "apply":function (){
            return ((() => {
              const PianoEb2 = this["PianoEb2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoEb2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoEb2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "PianoEb3OUT":"PianoEb3OUT",
          "apply":function (){
            return ((() => {
              const PianoEb3 = this["PianoEb3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoEb3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoEb3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "PianoEb4OUT":"PianoEb4OUT",
          "apply":function (){
            return ((() => {
              const PianoEb4 = this["PianoEb4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoEb4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoEb4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "PianoEb5OUT":"PianoEb5OUT",
          "apply":function (){
            return ((() => {
              const PianoEb5 = this["PianoEb5OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoEb5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoEb5OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "PianoEb1", false);
            console.log("--- FIN RESERVOIR:", "PianoEb1");
            var msg = {
            type: 'killTank',
            value:  "PianoEb1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank PianoGb + PianoGb1
    PianoGb = hh.MODULE({"id":"PianoGb","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoGb1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoGb2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoGb3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoGb4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoGb5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoGb1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoGb2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoGb3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoGb4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoGb5OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "PianoGb1,PianoGb2,PianoGb3,PianoGb4,PianoGb5" );
                var msg = {
                  type: 'startTank',
                  value:  "PianoGb1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoGb1OUT":"PianoGb1OUT",
                "apply":function (){
                  return ((() => {
                    const PianoGb1 = this["PianoGb1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoGb1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoGb1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoGb1OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoGb1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoGb2OUT":"PianoGb2OUT",
                "apply":function (){
                  return ((() => {
                    const PianoGb2 = this["PianoGb2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoGb2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoGb2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoGb2OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoGb2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoGb3OUT":"PianoGb3OUT",
                "apply":function (){
                  return ((() => {
                    const PianoGb3 = this["PianoGb3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoGb3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoGb3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoGb3OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoGb3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoGb4OUT":"PianoGb4OUT",
                "apply":function (){
                  return ((() => {
                    const PianoGb4 = this["PianoGb4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoGb4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoGb4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoGb4OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoGb4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoGb5OUT":"PianoGb5OUT",
                "apply":function (){
                  return ((() => {
                    const PianoGb5 = this["PianoGb5OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoGb5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoGb5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoGb5OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoGb5OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:PianoGb1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour PianoGb1
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
                  const PianoGb1IN  =this["PianoGb1IN"];
                  return PianoGb1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoGb1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoGb1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoGb1OUT" : "PianoGb1OUT",
              "apply":function (){
                return ((() => {
                  const PianoGb1OUT = this["PianoGb1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoGb1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoGb1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoGb1OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoGb1OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoGb1
  ,
        hh.SEQUENCE( // Debut sequence pour PianoGb2
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
                  const PianoGb2IN  =this["PianoGb2IN"];
                  return PianoGb2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoGb2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoGb2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoGb2OUT" : "PianoGb2OUT",
              "apply":function (){
                return ((() => {
                  const PianoGb2OUT = this["PianoGb2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoGb2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoGb2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoGb2OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoGb2OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoGb2
  ,
        hh.SEQUENCE( // Debut sequence pour PianoGb3
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
                  const PianoGb3IN  =this["PianoGb3IN"];
                  return PianoGb3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoGb3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoGb3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoGb3OUT" : "PianoGb3OUT",
              "apply":function (){
                return ((() => {
                  const PianoGb3OUT = this["PianoGb3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoGb3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoGb3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoGb3OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoGb3OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoGb3
  ,
        hh.SEQUENCE( // Debut sequence pour PianoGb4
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
                  const PianoGb4IN  =this["PianoGb4IN"];
                  return PianoGb4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoGb4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoGb4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoGb4OUT" : "PianoGb4OUT",
              "apply":function (){
                return ((() => {
                  const PianoGb4OUT = this["PianoGb4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoGb4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoGb4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoGb4OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoGb4OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoGb4
  ,
        hh.SEQUENCE( // Debut sequence pour PianoGb5
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
                  const PianoGb5IN  =this["PianoGb5IN"];
                  return PianoGb5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoGb5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoGb5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoGb5OUT" : "PianoGb5OUT",
              "apply":function (){
                return ((() => {
                  const PianoGb5OUT = this["PianoGb5OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoGb5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoGb5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoGb5OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoGb5OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoGb5
      ), // Fin fork de make await avec en premiere position:PianoGb1
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
          "PianoGb1OUT":"PianoGb1OUT",
          "apply":function (){
            return ((() => {
              const PianoGb1 = this["PianoGb1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoGb1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoGb1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "PianoGb2OUT":"PianoGb2OUT",
          "apply":function (){
            return ((() => {
              const PianoGb2 = this["PianoGb2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoGb2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoGb2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "PianoGb3OUT":"PianoGb3OUT",
          "apply":function (){
            return ((() => {
              const PianoGb3 = this["PianoGb3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoGb3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoGb3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "PianoGb4OUT":"PianoGb4OUT",
          "apply":function (){
            return ((() => {
              const PianoGb4 = this["PianoGb4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoGb4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoGb4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "PianoGb5OUT":"PianoGb5OUT",
          "apply":function (){
            return ((() => {
              const PianoGb5 = this["PianoGb5OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoGb5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoGb5OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "PianoGb1", false);
            console.log("--- FIN RESERVOIR:", "PianoGb1");
            var msg = {
            type: 'killTank',
            value:  "PianoGb1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank PianoA + PianoA1
    PianoA = hh.MODULE({"id":"PianoA","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoA1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoA2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoA3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoA4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"PianoA5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoA1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoA2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoA3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoA4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"PianoA5OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "PianoA1,PianoA2,PianoA3,PianoA4,PianoA5" );
                var msg = {
                  type: 'startTank',
                  value:  "PianoA1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoA1OUT":"PianoA1OUT",
                "apply":function (){
                  return ((() => {
                    const PianoA1 = this["PianoA1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoA1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoA1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoA1OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoA1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoA2OUT":"PianoA2OUT",
                "apply":function (){
                  return ((() => {
                    const PianoA2 = this["PianoA2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoA2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoA2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoA2OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoA2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoA3OUT":"PianoA3OUT",
                "apply":function (){
                  return ((() => {
                    const PianoA3 = this["PianoA3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoA3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoA3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoA3OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoA3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoA4OUT":"PianoA4OUT",
                "apply":function (){
                  return ((() => {
                    const PianoA4 = this["PianoA4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoA4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoA4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoA4OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoA4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "PianoA5OUT":"PianoA5OUT",
                "apply":function (){
                  return ((() => {
                    const PianoA5 = this["PianoA5OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoA5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit PianoA5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "PianoA5OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoA5OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:PianoA1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour PianoA1
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
                  const PianoA1IN  =this["PianoA1IN"];
                  return PianoA1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoA1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoA1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoA1OUT" : "PianoA1OUT",
              "apply":function (){
                return ((() => {
                  const PianoA1OUT = this["PianoA1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoA1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoA1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoA1OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoA1OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoA1
  ,
        hh.SEQUENCE( // Debut sequence pour PianoA2
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
                  const PianoA2IN  =this["PianoA2IN"];
                  return PianoA2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoA2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoA2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoA2OUT" : "PianoA2OUT",
              "apply":function (){
                return ((() => {
                  const PianoA2OUT = this["PianoA2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoA2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoA2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoA2OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoA2OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoA2
  ,
        hh.SEQUENCE( // Debut sequence pour PianoA3
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
                  const PianoA3IN  =this["PianoA3IN"];
                  return PianoA3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoA3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoA3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoA3OUT" : "PianoA3OUT",
              "apply":function (){
                return ((() => {
                  const PianoA3OUT = this["PianoA3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoA3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoA3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoA3OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoA3OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoA3
  ,
        hh.SEQUENCE( // Debut sequence pour PianoA4
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
                  const PianoA4IN  =this["PianoA4IN"];
                  return PianoA4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoA4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoA4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoA4OUT" : "PianoA4OUT",
              "apply":function (){
                return ((() => {
                  const PianoA4OUT = this["PianoA4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoA4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoA4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoA4OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoA4OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoA4
  ,
        hh.SEQUENCE( // Debut sequence pour PianoA5
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
                  const PianoA5IN  =this["PianoA5IN"];
                  return PianoA5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"PianoA5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await PianoA5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "PianoA5OUT" : "PianoA5OUT",
              "apply":function (){
                return ((() => {
                  const PianoA5OUT = this["PianoA5OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"PianoA5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit PianoA5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "PianoA5OUT");
                gcs.informSelecteurOnMenuChange(255 , "PianoA5OUT", false);
              }
            }
          )
        ) // Fin sequence pour PianoA5
      ), // Fin fork de make await avec en premiere position:PianoA1
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
          "PianoA1OUT":"PianoA1OUT",
          "apply":function (){
            return ((() => {
              const PianoA1 = this["PianoA1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoA1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoA1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "PianoA2OUT":"PianoA2OUT",
          "apply":function (){
            return ((() => {
              const PianoA2 = this["PianoA2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoA2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoA2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "PianoA3OUT":"PianoA3OUT",
          "apply":function (){
            return ((() => {
              const PianoA3 = this["PianoA3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoA3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoA3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "PianoA4OUT":"PianoA4OUT",
          "apply":function (){
            return ((() => {
              const PianoA4 = this["PianoA4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoA4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoA4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "PianoA5OUT":"PianoA5OUT",
          "apply":function (){
            return ((() => {
              const PianoA5 = this["PianoA5OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"PianoA5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit PianoA5OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "PianoA1", false);
            console.log("--- FIN RESERVOIR:", "PianoA1");
            var msg = {
            type: 'killTank',
            value:  "PianoA1"
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
             gcs.setpatternListLength([3,255]);
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
            value:'Etude Harmonie 4'
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
          DAW.putPatternInQueue('PianoC1');
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
      "apply":function () {console.log('Etude Harmonie 4');}
    }
  ),

        hh.FORK(
            {
              "%location":{},
              "%tag":"fork"
            },


        hh.TRAP(
          {
            "trap39678":"trap39678",
            "%location":{},
            "%tag":"trap39678"
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
                "Viol1COUT":"Viol1COUT",
                "apply":function (){
                  return ((() => {
                    const Viol1COUT = this["Viol1COUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Viol1COUT",
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
                  gcs.informSelecteurOnMenuChange(255," Viol1C", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "Viol2COUT":"Viol2COUT",
                "apply":function (){
                  return ((() => {
                    const Viol2COUT = this["Viol2COUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Viol2COUT",
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
                  gcs.informSelecteurOnMenuChange(255," Viol2C", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "AltoCOUT":"AltoCOUT",
                "apply":function (){
                  return ((() => {
                    const AltoCOUT = this["AltoCOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"AltoCOUT",
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
                  gcs.informSelecteurOnMenuChange(255," AltoC", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "CelloCOUT":"CelloCOUT",
                "apply":function (){
                  return ((() => {
                    const CelloCOUT = this["CelloCOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"CelloCOUT",
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
                  gcs.informSelecteurOnMenuChange(255," CelloC", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "Viol1EbOUT":"Viol1EbOUT",
                "apply":function (){
                  return ((() => {
                    const Viol1EbOUT = this["Viol1EbOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Viol1EbOUT",
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
                  gcs.informSelecteurOnMenuChange(255," Viol1Eb", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "Viol2EbOUT":"Viol2EbOUT",
                "apply":function (){
                  return ((() => {
                    const Viol2EbOUT = this["Viol2EbOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Viol2EbOUT",
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
                  gcs.informSelecteurOnMenuChange(255," Viol2Eb", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "AltoEbOUT":"AltoEbOUT",
                "apply":function (){
                  return ((() => {
                    const AltoEbOUT = this["AltoEbOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"AltoEbOUT",
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
                  gcs.informSelecteurOnMenuChange(255," AltoEb", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "CelloEbOUT":"CelloEbOUT",
                "apply":function (){
                  return ((() => {
                    const CelloEbOUT = this["CelloEbOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"CelloEbOUT",
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
                  gcs.informSelecteurOnMenuChange(255," CelloEb", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "Viol1GbOUT":"Viol1GbOUT",
                "apply":function (){
                  return ((() => {
                    const Viol1GbOUT = this["Viol1GbOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Viol1GbOUT",
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
                  gcs.informSelecteurOnMenuChange(255," Viol1Gb", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "Viol2GbOUT":"Viol2GbOUT",
                "apply":function (){
                  return ((() => {
                    const Viol2GbOUT = this["Viol2GbOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Viol2GbOUT",
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
                  gcs.informSelecteurOnMenuChange(255," Viol2Gb", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "AltoGbOUT":"AltoGbOUT",
                "apply":function (){
                  return ((() => {
                    const AltoGbOUT = this["AltoGbOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"AltoGbOUT",
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
                  gcs.informSelecteurOnMenuChange(255," AltoGb", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "CelloGbOUT":"CelloGbOUT",
                "apply":function (){
                  return ((() => {
                    const CelloGbOUT = this["CelloGbOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"CelloGbOUT",
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
                  gcs.informSelecteurOnMenuChange(255," CelloGb", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "Viol1AOUT":"Viol1AOUT",
                "apply":function (){
                  return ((() => {
                    const Viol1AOUT = this["Viol1AOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Viol1AOUT",
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
                  gcs.informSelecteurOnMenuChange(255," Viol1A", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "Viol2AOUT":"Viol2AOUT",
                "apply":function (){
                  return ((() => {
                    const Viol2AOUT = this["Viol2AOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"Viol2AOUT",
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
                  gcs.informSelecteurOnMenuChange(255," Viol2A", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "AltoAOUT":"AltoAOUT",
                "apply":function (){
                  return ((() => {
                    const AltoAOUT = this["AltoAOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"AltoAOUT",
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
                  gcs.informSelecteurOnMenuChange(255," AltoA", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "CelloAOUT":"CelloAOUT",
                "apply":function (){
                  return ((() => {
                    const CelloAOUT = this["CelloAOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"CelloAOUT",
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
                  gcs.informSelecteurOnMenuChange(255," CelloA", true);
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
    	              "countapply":function (){return 90;}
    	          },
    	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
    	        ),


    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "Viol1COUT":"Viol1COUT",
    	            "apply":function (){
    	              return ((() => {
    	                const Viol1COUT = this["Viol1COUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"Viol1COUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Viol1C", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "Viol2COUT":"Viol2COUT",
    	            "apply":function (){
    	              return ((() => {
    	                const Viol2COUT = this["Viol2COUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"Viol2COUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Viol2C", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "AltoCOUT":"AltoCOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const AltoCOUT = this["AltoCOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"AltoCOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," AltoC", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "CelloCOUT":"CelloCOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const CelloCOUT = this["CelloCOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"CelloCOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," CelloC", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "Viol1EbOUT":"Viol1EbOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const Viol1EbOUT = this["Viol1EbOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"Viol1EbOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Viol1Eb", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "Viol2EbOUT":"Viol2EbOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const Viol2EbOUT = this["Viol2EbOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"Viol2EbOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Viol2Eb", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "AltoEbOUT":"AltoEbOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const AltoEbOUT = this["AltoEbOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"AltoEbOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," AltoEb", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "CelloEbOUT":"CelloEbOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const CelloEbOUT = this["CelloEbOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"CelloEbOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," CelloEb", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "Viol1GbOUT":"Viol1GbOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const Viol1GbOUT = this["Viol1GbOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"Viol1GbOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Viol1Gb", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "Viol2GbOUT":"Viol2GbOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const Viol2GbOUT = this["Viol2GbOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"Viol2GbOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Viol2Gb", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "AltoGbOUT":"AltoGbOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const AltoGbOUT = this["AltoGbOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"AltoGbOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," AltoGb", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "CelloGbOUT":"CelloGbOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const CelloGbOUT = this["CelloGbOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"CelloGbOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," CelloGb", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "Viol1AOUT":"Viol1AOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const Viol1AOUT = this["Viol1AOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"Viol1AOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Viol1A", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "Viol2AOUT":"Viol2AOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const Viol2AOUT = this["Viol2AOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"Viol2AOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Viol2A", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "AltoAOUT":"AltoAOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const AltoAOUT = this["AltoAOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"AltoAOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," AltoA", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "CelloAOUT":"CelloAOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const CelloAOUT = this["CelloAOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"CelloAOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," CelloA", false); }
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
    		          "trap39678":"trap39678",
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
        "module":PianoC,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":PianoEb,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":PianoGb,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":PianoA,
        "autocomplete":true
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
        "countapply":function (){ return 90;}
      },
      hh.SIGACCESS({
        "signame":"tick",
        "pre":false,
        "val":false,
        "cnt":false
      }),

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
            "countapply":function (){ return  4;}
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
                moveTempo(1, 3);
              }
            }
          )
        )
      ),


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
          var msg = {
            type: 'alertInfoScoreON',
            value:'Fin Etude Harmonie 4'
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
