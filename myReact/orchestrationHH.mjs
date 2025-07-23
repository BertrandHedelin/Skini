var FluteC, FluteEb, FluteC1, FluteC2, FluteC3, FluteC4, FluteC5, FluteC6, FluteC7, FluteC8, FluteC9, FluteC10, FluteC11, FluteC12, FluteC13, FluteC14, FluteC15, FluteFmin, tick, FluteEb1, FluteEb2, FluteEb3, FluteEb4, FluteEb5, FluteEb6, FluteEb7, FluteEb8, FluteEb9, FluteEb10, FluteEb11, FluteEb12, FluteEb13, FluteEb14, FluteEb15, FluteFmin1, FluteFmin2, FluteFmin3, FluteFmin4, FluteFmin5, FluteFmin6, FluteFmin7, FluteFmin8, FluteFmin9, FluteFmin10, FluteFmin11, FluteFmin12, FluteFmin13, FluteFmin14, FluteFmin15, PianoC, PianoEb, PianoFmin;


// Fonctionne avec EtudeHarmonie5.als.
// 2 simulateurs : 0 et 1.
//
// Type Horizontaux et verticaux, et reservoirs
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


    // Module tank FluteC + FluteC1
    FluteC = hh.MODULE({"id":"FluteC","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteC1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteC2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteC3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteC4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteC5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteC6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteC7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteC8IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteC9IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteC10IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteC11IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteC12IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteC13IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteC14IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteC15IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteC1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteC2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteC3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteC4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteC5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteC6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteC7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteC8OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteC9OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteC10OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteC11OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteC12OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteC13OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteC14OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteC15OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "FluteC1,FluteC2,FluteC3,FluteC4,FluteC5,FluteC6,FluteC7,FluteC8,FluteC9,FluteC10,FluteC11,FluteC12,FluteC13,FluteC14,FluteC15" );
                var msg = {
                  type: 'startTank',
                  value:  "FluteC1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteC1OUT":"FluteC1OUT",
                "apply":function (){
                  return ((() => {
                    const FluteC1 = this["FluteC1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteC1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteC1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteC1OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteC2OUT":"FluteC2OUT",
                "apply":function (){
                  return ((() => {
                    const FluteC2 = this["FluteC2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteC2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteC2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteC2OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteC3OUT":"FluteC3OUT",
                "apply":function (){
                  return ((() => {
                    const FluteC3 = this["FluteC3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteC3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteC3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteC3OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteC4OUT":"FluteC4OUT",
                "apply":function (){
                  return ((() => {
                    const FluteC4 = this["FluteC4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteC4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteC4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteC4OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteC5OUT":"FluteC5OUT",
                "apply":function (){
                  return ((() => {
                    const FluteC5 = this["FluteC5OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteC5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteC5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteC5OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteC6OUT":"FluteC6OUT",
                "apply":function (){
                  return ((() => {
                    const FluteC6 = this["FluteC6OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteC6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteC6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteC6OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteC7OUT":"FluteC7OUT",
                "apply":function (){
                  return ((() => {
                    const FluteC7 = this["FluteC7OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteC7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteC7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteC7OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC7OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteC8OUT":"FluteC8OUT",
                "apply":function (){
                  return ((() => {
                    const FluteC8 = this["FluteC8OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteC8OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteC8OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteC8OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC8OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteC9OUT":"FluteC9OUT",
                "apply":function (){
                  return ((() => {
                    const FluteC9 = this["FluteC9OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteC9OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteC9OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteC9OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC9OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteC10OUT":"FluteC10OUT",
                "apply":function (){
                  return ((() => {
                    const FluteC10 = this["FluteC10OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteC10OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteC10OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteC10OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC10OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteC11OUT":"FluteC11OUT",
                "apply":function (){
                  return ((() => {
                    const FluteC11 = this["FluteC11OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteC11OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteC11OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteC11OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC11OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteC12OUT":"FluteC12OUT",
                "apply":function (){
                  return ((() => {
                    const FluteC12 = this["FluteC12OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteC12OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteC12OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteC12OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC12OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteC13OUT":"FluteC13OUT",
                "apply":function (){
                  return ((() => {
                    const FluteC13 = this["FluteC13OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteC13OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteC13OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteC13OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC13OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteC14OUT":"FluteC14OUT",
                "apply":function (){
                  return ((() => {
                    const FluteC14 = this["FluteC14OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteC14OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteC14OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteC14OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC14OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteC15OUT":"FluteC15OUT",
                "apply":function (){
                  return ((() => {
                    const FluteC15 = this["FluteC15OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteC15OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteC15OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteC15OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC15OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:FluteC1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour FluteC1
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
                  const FluteC1IN  =this["FluteC1IN"];
                  return FluteC1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteC1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteC1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteC1OUT" : "FluteC1OUT",
              "apply":function (){
                return ((() => {
                  const FluteC1OUT = this["FluteC1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteC1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteC1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteC1OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC1OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteC1
  ,
        hh.SEQUENCE( // Debut sequence pour FluteC2
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
                  const FluteC2IN  =this["FluteC2IN"];
                  return FluteC2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteC2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteC2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteC2OUT" : "FluteC2OUT",
              "apply":function (){
                return ((() => {
                  const FluteC2OUT = this["FluteC2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteC2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteC2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteC2OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC2OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteC2
  ,
        hh.SEQUENCE( // Debut sequence pour FluteC3
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
                  const FluteC3IN  =this["FluteC3IN"];
                  return FluteC3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteC3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteC3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteC3OUT" : "FluteC3OUT",
              "apply":function (){
                return ((() => {
                  const FluteC3OUT = this["FluteC3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteC3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteC3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteC3OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC3OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteC3
  ,
        hh.SEQUENCE( // Debut sequence pour FluteC4
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
                  const FluteC4IN  =this["FluteC4IN"];
                  return FluteC4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteC4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteC4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteC4OUT" : "FluteC4OUT",
              "apply":function (){
                return ((() => {
                  const FluteC4OUT = this["FluteC4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteC4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteC4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteC4OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC4OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteC4
  ,
        hh.SEQUENCE( // Debut sequence pour FluteC5
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
                  const FluteC5IN  =this["FluteC5IN"];
                  return FluteC5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteC5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteC5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteC5OUT" : "FluteC5OUT",
              "apply":function (){
                return ((() => {
                  const FluteC5OUT = this["FluteC5OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteC5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteC5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteC5OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC5OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteC5
  ,
        hh.SEQUENCE( // Debut sequence pour FluteC6
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
                  const FluteC6IN  =this["FluteC6IN"];
                  return FluteC6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteC6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteC6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteC6OUT" : "FluteC6OUT",
              "apply":function (){
                return ((() => {
                  const FluteC6OUT = this["FluteC6OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteC6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteC6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteC6OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC6OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteC6
  ,
        hh.SEQUENCE( // Debut sequence pour FluteC7
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
                  const FluteC7IN  =this["FluteC7IN"];
                  return FluteC7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteC7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteC7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteC7OUT" : "FluteC7OUT",
              "apply":function (){
                return ((() => {
                  const FluteC7OUT = this["FluteC7OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteC7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteC7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteC7OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC7OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteC7
  ,
        hh.SEQUENCE( // Debut sequence pour FluteC8
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
                  const FluteC8IN  =this["FluteC8IN"];
                  return FluteC8IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteC8IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteC8IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteC8OUT" : "FluteC8OUT",
              "apply":function (){
                return ((() => {
                  const FluteC8OUT = this["FluteC8OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteC8OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteC8OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteC8OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC8OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteC8
  ,
        hh.SEQUENCE( // Debut sequence pour FluteC9
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
                  const FluteC9IN  =this["FluteC9IN"];
                  return FluteC9IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteC9IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteC9IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteC9OUT" : "FluteC9OUT",
              "apply":function (){
                return ((() => {
                  const FluteC9OUT = this["FluteC9OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteC9OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteC9OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteC9OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC9OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteC9
  ,
        hh.SEQUENCE( // Debut sequence pour FluteC10
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
                  const FluteC10IN  =this["FluteC10IN"];
                  return FluteC10IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteC10IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteC10IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteC10OUT" : "FluteC10OUT",
              "apply":function (){
                return ((() => {
                  const FluteC10OUT = this["FluteC10OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteC10OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteC10OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteC10OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC10OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteC10
  ,
        hh.SEQUENCE( // Debut sequence pour FluteC11
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
                  const FluteC11IN  =this["FluteC11IN"];
                  return FluteC11IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteC11IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteC11IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteC11OUT" : "FluteC11OUT",
              "apply":function (){
                return ((() => {
                  const FluteC11OUT = this["FluteC11OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteC11OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteC11OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteC11OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC11OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteC11
  ,
        hh.SEQUENCE( // Debut sequence pour FluteC12
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
                  const FluteC12IN  =this["FluteC12IN"];
                  return FluteC12IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteC12IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteC12IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteC12OUT" : "FluteC12OUT",
              "apply":function (){
                return ((() => {
                  const FluteC12OUT = this["FluteC12OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteC12OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteC12OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteC12OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC12OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteC12
  ,
        hh.SEQUENCE( // Debut sequence pour FluteC13
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
                  const FluteC13IN  =this["FluteC13IN"];
                  return FluteC13IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteC13IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteC13IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteC13OUT" : "FluteC13OUT",
              "apply":function (){
                return ((() => {
                  const FluteC13OUT = this["FluteC13OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteC13OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteC13OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteC13OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC13OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteC13
  ,
        hh.SEQUENCE( // Debut sequence pour FluteC14
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
                  const FluteC14IN  =this["FluteC14IN"];
                  return FluteC14IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteC14IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteC14IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteC14OUT" : "FluteC14OUT",
              "apply":function (){
                return ((() => {
                  const FluteC14OUT = this["FluteC14OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteC14OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteC14OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteC14OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC14OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteC14
  ,
        hh.SEQUENCE( // Debut sequence pour FluteC15
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
                  const FluteC15IN  =this["FluteC15IN"];
                  return FluteC15IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteC15IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteC15IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteC15OUT" : "FluteC15OUT",
              "apply":function (){
                return ((() => {
                  const FluteC15OUT = this["FluteC15OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteC15OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteC15OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteC15OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteC15OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteC15
      ), // Fin fork de make await avec en premiere position:FluteC1
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
          "FluteC1OUT":"FluteC1OUT",
          "apply":function (){
            return ((() => {
              const FluteC1 = this["FluteC1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteC1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteC1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteC2OUT":"FluteC2OUT",
          "apply":function (){
            return ((() => {
              const FluteC2 = this["FluteC2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteC2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteC2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteC3OUT":"FluteC3OUT",
          "apply":function (){
            return ((() => {
              const FluteC3 = this["FluteC3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteC3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteC3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteC4OUT":"FluteC4OUT",
          "apply":function (){
            return ((() => {
              const FluteC4 = this["FluteC4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteC4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteC4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteC5OUT":"FluteC5OUT",
          "apply":function (){
            return ((() => {
              const FluteC5 = this["FluteC5OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteC5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteC5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteC6OUT":"FluteC6OUT",
          "apply":function (){
            return ((() => {
              const FluteC6 = this["FluteC6OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteC6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteC6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteC7OUT":"FluteC7OUT",
          "apply":function (){
            return ((() => {
              const FluteC7 = this["FluteC7OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteC7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteC7OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteC8OUT":"FluteC8OUT",
          "apply":function (){
            return ((() => {
              const FluteC8 = this["FluteC8OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteC8OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteC8OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteC9OUT":"FluteC9OUT",
          "apply":function (){
            return ((() => {
              const FluteC9 = this["FluteC9OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteC9OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteC9OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteC10OUT":"FluteC10OUT",
          "apply":function (){
            return ((() => {
              const FluteC10 = this["FluteC10OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteC10OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteC10OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteC11OUT":"FluteC11OUT",
          "apply":function (){
            return ((() => {
              const FluteC11 = this["FluteC11OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteC11OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteC11OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteC12OUT":"FluteC12OUT",
          "apply":function (){
            return ((() => {
              const FluteC12 = this["FluteC12OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteC12OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteC12OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteC13OUT":"FluteC13OUT",
          "apply":function (){
            return ((() => {
              const FluteC13 = this["FluteC13OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteC13OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteC13OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteC14OUT":"FluteC14OUT",
          "apply":function (){
            return ((() => {
              const FluteC14 = this["FluteC14OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteC14OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteC14OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteC15OUT":"FluteC15OUT",
          "apply":function (){
            return ((() => {
              const FluteC15 = this["FluteC15OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteC15OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteC15OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "FluteC1", false);
            console.log("--- FIN RESERVOIR:", "FluteC1");
            var msg = {
            type: 'killTank',
            value:  "FluteC1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank FluteEb + FluteEb1
    FluteEb = hh.MODULE({"id":"FluteEb","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteEb1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteEb2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteEb3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteEb4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteEb5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteEb6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteEb7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteEb8IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteEb9IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteEb10IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteEb11IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteEb12IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteEb13IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteEb14IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteEb15IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteEb1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteEb2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteEb3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteEb4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteEb5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteEb6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteEb7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteEb8OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteEb9OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteEb10OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteEb11OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteEb12OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteEb13OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteEb14OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteEb15OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "FluteEb1,FluteEb2,FluteEb3,FluteEb4,FluteEb5,FluteEb6,FluteEb7,FluteEb8,FluteEb9,FluteEb10,FluteEb11,FluteEb12,FluteEb13,FluteEb14,FluteEb15" );
                var msg = {
                  type: 'startTank',
                  value:  "FluteEb1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteEb1OUT":"FluteEb1OUT",
                "apply":function (){
                  return ((() => {
                    const FluteEb1 = this["FluteEb1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteEb1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteEb1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteEb1OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteEb2OUT":"FluteEb2OUT",
                "apply":function (){
                  return ((() => {
                    const FluteEb2 = this["FluteEb2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteEb2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteEb2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteEb2OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteEb3OUT":"FluteEb3OUT",
                "apply":function (){
                  return ((() => {
                    const FluteEb3 = this["FluteEb3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteEb3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteEb3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteEb3OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteEb4OUT":"FluteEb4OUT",
                "apply":function (){
                  return ((() => {
                    const FluteEb4 = this["FluteEb4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteEb4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteEb4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteEb4OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteEb5OUT":"FluteEb5OUT",
                "apply":function (){
                  return ((() => {
                    const FluteEb5 = this["FluteEb5OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteEb5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteEb5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteEb5OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteEb6OUT":"FluteEb6OUT",
                "apply":function (){
                  return ((() => {
                    const FluteEb6 = this["FluteEb6OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteEb6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteEb6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteEb6OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteEb7OUT":"FluteEb7OUT",
                "apply":function (){
                  return ((() => {
                    const FluteEb7 = this["FluteEb7OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteEb7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteEb7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteEb7OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb7OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteEb8OUT":"FluteEb8OUT",
                "apply":function (){
                  return ((() => {
                    const FluteEb8 = this["FluteEb8OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteEb8OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteEb8OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteEb8OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb8OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteEb9OUT":"FluteEb9OUT",
                "apply":function (){
                  return ((() => {
                    const FluteEb9 = this["FluteEb9OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteEb9OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteEb9OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteEb9OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb9OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteEb10OUT":"FluteEb10OUT",
                "apply":function (){
                  return ((() => {
                    const FluteEb10 = this["FluteEb10OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteEb10OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteEb10OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteEb10OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb10OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteEb11OUT":"FluteEb11OUT",
                "apply":function (){
                  return ((() => {
                    const FluteEb11 = this["FluteEb11OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteEb11OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteEb11OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteEb11OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb11OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteEb12OUT":"FluteEb12OUT",
                "apply":function (){
                  return ((() => {
                    const FluteEb12 = this["FluteEb12OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteEb12OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteEb12OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteEb12OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb12OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteEb13OUT":"FluteEb13OUT",
                "apply":function (){
                  return ((() => {
                    const FluteEb13 = this["FluteEb13OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteEb13OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteEb13OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteEb13OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb13OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteEb14OUT":"FluteEb14OUT",
                "apply":function (){
                  return ((() => {
                    const FluteEb14 = this["FluteEb14OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteEb14OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteEb14OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteEb14OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb14OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteEb15OUT":"FluteEb15OUT",
                "apply":function (){
                  return ((() => {
                    const FluteEb15 = this["FluteEb15OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteEb15OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteEb15OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteEb15OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb15OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:FluteEb1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour FluteEb1
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
                  const FluteEb1IN  =this["FluteEb1IN"];
                  return FluteEb1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteEb1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteEb1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteEb1OUT" : "FluteEb1OUT",
              "apply":function (){
                return ((() => {
                  const FluteEb1OUT = this["FluteEb1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteEb1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteEb1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteEb1OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb1OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteEb1
  ,
        hh.SEQUENCE( // Debut sequence pour FluteEb2
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
                  const FluteEb2IN  =this["FluteEb2IN"];
                  return FluteEb2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteEb2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteEb2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteEb2OUT" : "FluteEb2OUT",
              "apply":function (){
                return ((() => {
                  const FluteEb2OUT = this["FluteEb2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteEb2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteEb2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteEb2OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb2OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteEb2
  ,
        hh.SEQUENCE( // Debut sequence pour FluteEb3
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
                  const FluteEb3IN  =this["FluteEb3IN"];
                  return FluteEb3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteEb3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteEb3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteEb3OUT" : "FluteEb3OUT",
              "apply":function (){
                return ((() => {
                  const FluteEb3OUT = this["FluteEb3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteEb3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteEb3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteEb3OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb3OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteEb3
  ,
        hh.SEQUENCE( // Debut sequence pour FluteEb4
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
                  const FluteEb4IN  =this["FluteEb4IN"];
                  return FluteEb4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteEb4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteEb4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteEb4OUT" : "FluteEb4OUT",
              "apply":function (){
                return ((() => {
                  const FluteEb4OUT = this["FluteEb4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteEb4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteEb4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteEb4OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb4OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteEb4
  ,
        hh.SEQUENCE( // Debut sequence pour FluteEb5
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
                  const FluteEb5IN  =this["FluteEb5IN"];
                  return FluteEb5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteEb5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteEb5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteEb5OUT" : "FluteEb5OUT",
              "apply":function (){
                return ((() => {
                  const FluteEb5OUT = this["FluteEb5OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteEb5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteEb5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteEb5OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb5OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteEb5
  ,
        hh.SEQUENCE( // Debut sequence pour FluteEb6
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
                  const FluteEb6IN  =this["FluteEb6IN"];
                  return FluteEb6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteEb6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteEb6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteEb6OUT" : "FluteEb6OUT",
              "apply":function (){
                return ((() => {
                  const FluteEb6OUT = this["FluteEb6OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteEb6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteEb6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteEb6OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb6OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteEb6
  ,
        hh.SEQUENCE( // Debut sequence pour FluteEb7
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
                  const FluteEb7IN  =this["FluteEb7IN"];
                  return FluteEb7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteEb7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteEb7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteEb7OUT" : "FluteEb7OUT",
              "apply":function (){
                return ((() => {
                  const FluteEb7OUT = this["FluteEb7OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteEb7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteEb7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteEb7OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb7OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteEb7
  ,
        hh.SEQUENCE( // Debut sequence pour FluteEb8
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
                  const FluteEb8IN  =this["FluteEb8IN"];
                  return FluteEb8IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteEb8IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteEb8IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteEb8OUT" : "FluteEb8OUT",
              "apply":function (){
                return ((() => {
                  const FluteEb8OUT = this["FluteEb8OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteEb8OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteEb8OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteEb8OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb8OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteEb8
  ,
        hh.SEQUENCE( // Debut sequence pour FluteEb9
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
                  const FluteEb9IN  =this["FluteEb9IN"];
                  return FluteEb9IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteEb9IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteEb9IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteEb9OUT" : "FluteEb9OUT",
              "apply":function (){
                return ((() => {
                  const FluteEb9OUT = this["FluteEb9OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteEb9OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteEb9OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteEb9OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb9OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteEb9
  ,
        hh.SEQUENCE( // Debut sequence pour FluteEb10
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
                  const FluteEb10IN  =this["FluteEb10IN"];
                  return FluteEb10IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteEb10IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteEb10IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteEb10OUT" : "FluteEb10OUT",
              "apply":function (){
                return ((() => {
                  const FluteEb10OUT = this["FluteEb10OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteEb10OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteEb10OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteEb10OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb10OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteEb10
  ,
        hh.SEQUENCE( // Debut sequence pour FluteEb11
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
                  const FluteEb11IN  =this["FluteEb11IN"];
                  return FluteEb11IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteEb11IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteEb11IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteEb11OUT" : "FluteEb11OUT",
              "apply":function (){
                return ((() => {
                  const FluteEb11OUT = this["FluteEb11OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteEb11OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteEb11OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteEb11OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb11OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteEb11
  ,
        hh.SEQUENCE( // Debut sequence pour FluteEb12
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
                  const FluteEb12IN  =this["FluteEb12IN"];
                  return FluteEb12IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteEb12IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteEb12IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteEb12OUT" : "FluteEb12OUT",
              "apply":function (){
                return ((() => {
                  const FluteEb12OUT = this["FluteEb12OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteEb12OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteEb12OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteEb12OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb12OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteEb12
  ,
        hh.SEQUENCE( // Debut sequence pour FluteEb13
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
                  const FluteEb13IN  =this["FluteEb13IN"];
                  return FluteEb13IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteEb13IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteEb13IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteEb13OUT" : "FluteEb13OUT",
              "apply":function (){
                return ((() => {
                  const FluteEb13OUT = this["FluteEb13OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteEb13OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteEb13OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteEb13OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb13OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteEb13
  ,
        hh.SEQUENCE( // Debut sequence pour FluteEb14
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
                  const FluteEb14IN  =this["FluteEb14IN"];
                  return FluteEb14IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteEb14IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteEb14IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteEb14OUT" : "FluteEb14OUT",
              "apply":function (){
                return ((() => {
                  const FluteEb14OUT = this["FluteEb14OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteEb14OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteEb14OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteEb14OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb14OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteEb14
  ,
        hh.SEQUENCE( // Debut sequence pour FluteEb15
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
                  const FluteEb15IN  =this["FluteEb15IN"];
                  return FluteEb15IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteEb15IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteEb15IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteEb15OUT" : "FluteEb15OUT",
              "apply":function (){
                return ((() => {
                  const FluteEb15OUT = this["FluteEb15OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteEb15OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteEb15OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteEb15OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteEb15OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteEb15
      ), // Fin fork de make await avec en premiere position:FluteEb1
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
          "FluteEb1OUT":"FluteEb1OUT",
          "apply":function (){
            return ((() => {
              const FluteEb1 = this["FluteEb1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteEb1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteEb1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteEb2OUT":"FluteEb2OUT",
          "apply":function (){
            return ((() => {
              const FluteEb2 = this["FluteEb2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteEb2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteEb2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteEb3OUT":"FluteEb3OUT",
          "apply":function (){
            return ((() => {
              const FluteEb3 = this["FluteEb3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteEb3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteEb3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteEb4OUT":"FluteEb4OUT",
          "apply":function (){
            return ((() => {
              const FluteEb4 = this["FluteEb4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteEb4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteEb4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteEb5OUT":"FluteEb5OUT",
          "apply":function (){
            return ((() => {
              const FluteEb5 = this["FluteEb5OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteEb5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteEb5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteEb6OUT":"FluteEb6OUT",
          "apply":function (){
            return ((() => {
              const FluteEb6 = this["FluteEb6OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteEb6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteEb6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteEb7OUT":"FluteEb7OUT",
          "apply":function (){
            return ((() => {
              const FluteEb7 = this["FluteEb7OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteEb7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteEb7OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteEb8OUT":"FluteEb8OUT",
          "apply":function (){
            return ((() => {
              const FluteEb8 = this["FluteEb8OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteEb8OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteEb8OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteEb9OUT":"FluteEb9OUT",
          "apply":function (){
            return ((() => {
              const FluteEb9 = this["FluteEb9OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteEb9OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteEb9OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteEb10OUT":"FluteEb10OUT",
          "apply":function (){
            return ((() => {
              const FluteEb10 = this["FluteEb10OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteEb10OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteEb10OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteEb11OUT":"FluteEb11OUT",
          "apply":function (){
            return ((() => {
              const FluteEb11 = this["FluteEb11OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteEb11OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteEb11OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteEb12OUT":"FluteEb12OUT",
          "apply":function (){
            return ((() => {
              const FluteEb12 = this["FluteEb12OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteEb12OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteEb12OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteEb13OUT":"FluteEb13OUT",
          "apply":function (){
            return ((() => {
              const FluteEb13 = this["FluteEb13OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteEb13OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteEb13OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteEb14OUT":"FluteEb14OUT",
          "apply":function (){
            return ((() => {
              const FluteEb14 = this["FluteEb14OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteEb14OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteEb14OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteEb15OUT":"FluteEb15OUT",
          "apply":function (){
            return ((() => {
              const FluteEb15 = this["FluteEb15OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteEb15OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteEb15OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "FluteEb1", false);
            console.log("--- FIN RESERVOIR:", "FluteEb1");
            var msg = {
            type: 'killTank',
            value:  "FluteEb1"
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ) // Fin atom,
  ); // Fin module

    // Module tank FluteFmin + FluteFmin1
    FluteFmin = hh.MODULE({"id":"FluteFmin","%location":{"filename":"hiphop_blocks.js","pos":1, "block":"makeReservoir"},"%tag":"module"},
    hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFmin1IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFmin2IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFmin3IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFmin4IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFmin5IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFmin6IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFmin7IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFmin8IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFmin9IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFmin10IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFmin11IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFmin12IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFmin13IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFmin14IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":2, "block":"makeReservoir"},"direction":"IN", "name":"FluteFmin15IN"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFmin1OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFmin2OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFmin3OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFmin4OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFmin5OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFmin6OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFmin7OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFmin8OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFmin9OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFmin10OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFmin11OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFmin12OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFmin13OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFmin14OUT"}),
      hh.SIGNAL({"%location":{"filename":"hiphop_blocks.js","pos":3, "block":"makeReservoir"},"direction":"OUT", "name":"FluteFmin15OUT"}),
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
                console.log("-- MAKE RESERVOIR:", "FluteFmin1,FluteFmin2,FluteFmin3,FluteFmin4,FluteFmin5,FluteFmin6,FluteFmin7,FluteFmin8,FluteFmin9,FluteFmin10,FluteFmin11,FluteFmin12,FluteFmin13,FluteFmin14,FluteFmin15" );
                var msg = {
                  type: 'startTank',
                  value:  "FluteFmin1"
                }
                serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFmin1OUT":"FluteFmin1OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFmin1 = this["FluteFmin1OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFmin1OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFmin1OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFmin1OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin1OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFmin2OUT":"FluteFmin2OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFmin2 = this["FluteFmin2OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFmin2OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFmin2OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFmin2OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin2OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFmin3OUT":"FluteFmin3OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFmin3 = this["FluteFmin3OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFmin3OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFmin3OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFmin3OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin3OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFmin4OUT":"FluteFmin4OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFmin4 = this["FluteFmin4OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFmin4OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFmin4OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFmin4OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin4OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFmin5OUT":"FluteFmin5OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFmin5 = this["FluteFmin5OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFmin5OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFmin5OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFmin5OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin5OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFmin6OUT":"FluteFmin6OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFmin6 = this["FluteFmin6OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFmin6OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFmin6OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFmin6OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin6OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFmin7OUT":"FluteFmin7OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFmin7 = this["FluteFmin7OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFmin7OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFmin7OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFmin7OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin7OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFmin8OUT":"FluteFmin8OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFmin8 = this["FluteFmin8OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFmin8OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFmin8OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFmin8OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin8OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFmin9OUT":"FluteFmin9OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFmin9 = this["FluteFmin9OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFmin9OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFmin9OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFmin9OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin9OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFmin10OUT":"FluteFmin10OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFmin10 = this["FluteFmin10OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFmin10OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFmin10OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFmin10OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin10OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFmin11OUT":"FluteFmin11OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFmin11 = this["FluteFmin11OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFmin11OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFmin11OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFmin11OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin11OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFmin12OUT":"FluteFmin12OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFmin12 = this["FluteFmin12OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFmin12OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFmin12OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFmin12OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin12OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFmin13OUT":"FluteFmin13OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFmin13 = this["FluteFmin13OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFmin13OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFmin13OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFmin13OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin13OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFmin14OUT":"FluteFmin14OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFmin14 = this["FluteFmin14OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFmin14OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFmin14OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFmin14OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin14OUT", true);
              }
            }
        ),
        hh.EMIT(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":6, "block":"makeReservoir"},
                "%tag":"emit",
                "FluteFmin15OUT":"FluteFmin15OUT",
                "apply":function (){
                  return ((() => {
                    const FluteFmin15 = this["FluteFmin15OUT"];
                    return [true, 255 ];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FluteFmin15OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
          ), // Fin emit FluteFmin15OUT true
        hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":7, "block":"makeReservoir"},
            "%tag":"node",
            "apply":function () {
                //console.log("-- makeReservoir:  atom:", "FluteFmin15OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin15OUT", true);
              }
            }
        ),
        hh.FORK( // debut du fork de makeAwait avec en premiere position:FluteFmin1
        {
          "%location":{"filename":"hiphop_blocks.js","pos":304},
          "%tag":"fork"
        },

        hh.SEQUENCE( // Debut sequence pour FluteFmin1
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
                  const FluteFmin1IN  =this["FluteFmin1IN"];
                  return FluteFmin1IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFmin1IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFmin1IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFmin1OUT" : "FluteFmin1OUT",
              "apply":function (){
                return ((() => {
                  const FluteFmin1OUT = this["FluteFmin1OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFmin1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFmin1OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFmin1OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin1OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFmin1
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFmin2
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
                  const FluteFmin2IN  =this["FluteFmin2IN"];
                  return FluteFmin2IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFmin2IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFmin2IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFmin2OUT" : "FluteFmin2OUT",
              "apply":function (){
                return ((() => {
                  const FluteFmin2OUT = this["FluteFmin2OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFmin2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFmin2OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFmin2OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin2OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFmin2
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFmin3
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
                  const FluteFmin3IN  =this["FluteFmin3IN"];
                  return FluteFmin3IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFmin3IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFmin3IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFmin3OUT" : "FluteFmin3OUT",
              "apply":function (){
                return ((() => {
                  const FluteFmin3OUT = this["FluteFmin3OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFmin3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFmin3OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFmin3OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin3OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFmin3
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFmin4
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
                  const FluteFmin4IN  =this["FluteFmin4IN"];
                  return FluteFmin4IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFmin4IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFmin4IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFmin4OUT" : "FluteFmin4OUT",
              "apply":function (){
                return ((() => {
                  const FluteFmin4OUT = this["FluteFmin4OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFmin4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFmin4OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFmin4OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin4OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFmin4
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFmin5
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
                  const FluteFmin5IN  =this["FluteFmin5IN"];
                  return FluteFmin5IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFmin5IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFmin5IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFmin5OUT" : "FluteFmin5OUT",
              "apply":function (){
                return ((() => {
                  const FluteFmin5OUT = this["FluteFmin5OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFmin5OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFmin5OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFmin5OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin5OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFmin5
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFmin6
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
                  const FluteFmin6IN  =this["FluteFmin6IN"];
                  return FluteFmin6IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFmin6IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFmin6IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFmin6OUT" : "FluteFmin6OUT",
              "apply":function (){
                return ((() => {
                  const FluteFmin6OUT = this["FluteFmin6OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFmin6OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFmin6OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFmin6OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin6OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFmin6
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFmin7
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
                  const FluteFmin7IN  =this["FluteFmin7IN"];
                  return FluteFmin7IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFmin7IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFmin7IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFmin7OUT" : "FluteFmin7OUT",
              "apply":function (){
                return ((() => {
                  const FluteFmin7OUT = this["FluteFmin7OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFmin7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFmin7OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFmin7OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin7OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFmin7
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFmin8
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
                  const FluteFmin8IN  =this["FluteFmin8IN"];
                  return FluteFmin8IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFmin8IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFmin8IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFmin8OUT" : "FluteFmin8OUT",
              "apply":function (){
                return ((() => {
                  const FluteFmin8OUT = this["FluteFmin8OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFmin8OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFmin8OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFmin8OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin8OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFmin8
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFmin9
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
                  const FluteFmin9IN  =this["FluteFmin9IN"];
                  return FluteFmin9IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFmin9IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFmin9IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFmin9OUT" : "FluteFmin9OUT",
              "apply":function (){
                return ((() => {
                  const FluteFmin9OUT = this["FluteFmin9OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFmin9OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFmin9OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFmin9OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin9OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFmin9
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFmin10
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
                  const FluteFmin10IN  =this["FluteFmin10IN"];
                  return FluteFmin10IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFmin10IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFmin10IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFmin10OUT" : "FluteFmin10OUT",
              "apply":function (){
                return ((() => {
                  const FluteFmin10OUT = this["FluteFmin10OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFmin10OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFmin10OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFmin10OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin10OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFmin10
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFmin11
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
                  const FluteFmin11IN  =this["FluteFmin11IN"];
                  return FluteFmin11IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFmin11IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFmin11IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFmin11OUT" : "FluteFmin11OUT",
              "apply":function (){
                return ((() => {
                  const FluteFmin11OUT = this["FluteFmin11OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFmin11OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFmin11OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFmin11OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin11OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFmin11
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFmin12
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
                  const FluteFmin12IN  =this["FluteFmin12IN"];
                  return FluteFmin12IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFmin12IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFmin12IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFmin12OUT" : "FluteFmin12OUT",
              "apply":function (){
                return ((() => {
                  const FluteFmin12OUT = this["FluteFmin12OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFmin12OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFmin12OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFmin12OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin12OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFmin12
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFmin13
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
                  const FluteFmin13IN  =this["FluteFmin13IN"];
                  return FluteFmin13IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFmin13IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFmin13IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFmin13OUT" : "FluteFmin13OUT",
              "apply":function (){
                return ((() => {
                  const FluteFmin13OUT = this["FluteFmin13OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFmin13OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFmin13OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFmin13OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin13OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFmin13
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFmin14
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
                  const FluteFmin14IN  =this["FluteFmin14IN"];
                  return FluteFmin14IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFmin14IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFmin14IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFmin14OUT" : "FluteFmin14OUT",
              "apply":function (){
                return ((() => {
                  const FluteFmin14OUT = this["FluteFmin14OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFmin14OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFmin14OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFmin14OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin14OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFmin14
  ,
        hh.SEQUENCE( // Debut sequence pour FluteFmin15
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
                  const FluteFmin15IN  =this["FluteFmin15IN"];
                  return FluteFmin15IN.now;
                })());},
            },
            hh.SIGACCESS({"signame":"FluteFmin15IN",
            "pre":false,
            "val":false,
            "cnt":false})
          ), // Fin await FluteFmin15IN
          hh.EMIT(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":333},
              "%tag":"emit",
              "FluteFmin15OUT" : "FluteFmin15OUT",
              "apply":function (){
                return ((() => {
                  const FluteFmin15OUT = this["FluteFmin15OUT"];
                  return [false, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"FluteFmin15OUT",
              "pre":true,
              "val":true,
              "cnt":false
            }),
          ), // Fin emit FluteFmin15OUT true
          hh.ATOM(
            {
            "%location":{"filename":"hiphop_blocks.js","pos":352},
            "%tag":"node",
            "apply":function () {
                //console.log("--! makeAwait:  atom:", "FluteFmin15OUT");
                gcs.informSelecteurOnMenuChange(255 , "FluteFmin15OUT", false);
              }
            }
          )
        ) // Fin sequence pour FluteFmin15
      ), // Fin fork de make await avec en premiere position:FluteFmin1
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
          "FluteFmin1OUT":"FluteFmin1OUT",
          "apply":function (){
            return ((() => {
              const FluteFmin1 = this["FluteFmin1OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFmin1OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFmin1OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFmin2OUT":"FluteFmin2OUT",
          "apply":function (){
            return ((() => {
              const FluteFmin2 = this["FluteFmin2OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFmin2OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFmin2OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFmin3OUT":"FluteFmin3OUT",
          "apply":function (){
            return ((() => {
              const FluteFmin3 = this["FluteFmin3OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFmin3OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFmin3OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFmin4OUT":"FluteFmin4OUT",
          "apply":function (){
            return ((() => {
              const FluteFmin4 = this["FluteFmin4OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFmin4OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFmin4OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFmin5OUT":"FluteFmin5OUT",
          "apply":function (){
            return ((() => {
              const FluteFmin5 = this["FluteFmin5OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFmin5OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFmin5OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFmin6OUT":"FluteFmin6OUT",
          "apply":function (){
            return ((() => {
              const FluteFmin6 = this["FluteFmin6OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFmin6OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFmin6OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFmin7OUT":"FluteFmin7OUT",
          "apply":function (){
            return ((() => {
              const FluteFmin7 = this["FluteFmin7OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFmin7OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFmin7OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFmin8OUT":"FluteFmin8OUT",
          "apply":function (){
            return ((() => {
              const FluteFmin8 = this["FluteFmin8OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFmin8OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFmin8OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFmin9OUT":"FluteFmin9OUT",
          "apply":function (){
            return ((() => {
              const FluteFmin9 = this["FluteFmin9OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFmin9OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFmin9OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFmin10OUT":"FluteFmin10OUT",
          "apply":function (){
            return ((() => {
              const FluteFmin10 = this["FluteFmin10OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFmin10OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFmin10OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFmin11OUT":"FluteFmin11OUT",
          "apply":function (){
            return ((() => {
              const FluteFmin11 = this["FluteFmin11OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFmin11OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFmin11OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFmin12OUT":"FluteFmin12OUT",
          "apply":function (){
            return ((() => {
              const FluteFmin12 = this["FluteFmin12OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFmin12OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFmin12OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFmin13OUT":"FluteFmin13OUT",
          "apply":function (){
            return ((() => {
              const FluteFmin13 = this["FluteFmin13OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFmin13OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFmin13OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFmin14OUT":"FluteFmin14OUT",
          "apply":function (){
            return ((() => {
              const FluteFmin14 = this["FluteFmin14OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFmin14OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFmin14OUT false,
    hh.EMIT(
        {
          "%location":{},
          "%tag":"emit",
          "FluteFmin15OUT":"FluteFmin15OUT",
          "apply":function (){
            return ((() => {
              const FluteFmin15 = this["FluteFmin15OUT"];
              return [false, 255 ];
            })());
          }
        },
        hh.SIGACCESS({
          "signame":"FluteFmin15OUT",
          "pre":true,
          "val":true,
          "cnt":false
        })
    ), // Fin emit FluteFmin15OUT false
    hh.ATOM(
        {
        "%location":{"filename":"hiphop_blocks.js","pos":10, "block":"makeReservoir"},
        "%tag":"node",
        "apply":function () {
            gcs.informSelecteurOnMenuChange(255 , "FluteFmin1", false);
            console.log("--- FIN RESERVOIR:", "FluteFmin1");
            var msg = {
            type: 'killTank',
            value:  "FluteFmin1"
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
        setTempo(60);
      }
    }
  ),

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
            type: 'listeDesTypes',
            text:'0,1,2,3,4,5,6,7,8,9'
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
             gcs.setpatternListLength([10,255]);
          }
        }
      ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {console.log('EtudeSkiniHarmonie5');}
    }
  ),

        hh.FORK(
            {
              "%location":{},
              "%tag":"fork"
            },


        hh.TRAP(
          {
            "trap953146":"trap953146",
            "%location":{},
            "%tag":"trap953146"
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
                "PianoCOUT":"PianoCOUT",
                "apply":function (){
                  return ((() => {
                    const PianoCOUT = this["PianoCOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoCOUT",
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
                  gcs.informSelecteurOnMenuChange(255," PianoC", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "PianoEbOUT":"PianoEbOUT",
                "apply":function (){
                  return ((() => {
                    const PianoEbOUT = this["PianoEbOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoEbOUT",
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
                  gcs.informSelecteurOnMenuChange(255," PianoEb", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "PianoFminOUT":"PianoFminOUT",
                "apply":function (){
                  return ((() => {
                    const PianoFminOUT = this["PianoFminOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PianoFminOUT",
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
                  gcs.informSelecteurOnMenuChange(255," PianoFmin", true);
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
    	              "countapply":function (){return 60;}
    	          },
    	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
    	        ),


    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "PianoCOUT":"PianoCOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const PianoCOUT = this["PianoCOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"PianoCOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," PianoC", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "PianoEbOUT":"PianoEbOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const PianoEbOUT = this["PianoEbOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"PianoEbOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," PianoEb", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "PianoFminOUT":"PianoFminOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const PianoFminOUT = this["PianoFminOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"PianoFminOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," PianoFmin", false); }
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
    		          "trap953146":"trap953146",
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
        "module":FluteC,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":FluteEb,
        "autocomplete":true
      }),

    hh.RUN({
        "%location":{"filename":"","pos":1},
        "%tag":"run",
        "module":FluteFmin,
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
            value:'Fin EtudeSkiniHarmonie5'
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
