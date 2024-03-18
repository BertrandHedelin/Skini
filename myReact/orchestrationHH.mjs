var cleanZone1, sensor0, cleanZone2, sensor1, cleanZone3, sensor2, cleanZone4, sensor5, tick;



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
  if(debug1) console.log("hh_ORCHESTRATION: setServ");
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
      var signalName = param.groupesDesSons[i][0] + "OUT";

      if(debug1) console.log("Signal Orchestration:", signalName);

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
  for (var i=0; i < param.groupesDesSons.length; i++) {
    if(param.groupesDesSons[i][0] !== "") {
      var signalName = param.groupesDesSons[i][0] + "IN";

      if(debug1) console.log("Signal Orchestration:", signalName);

      var signal = hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":signalName
      });
      signals.push(signal);
    }
  }



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
      "name":"sensor0"
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"sensor1"
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"sensor2"
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"sensor5"
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
               gcs.setpatternListLength([5,255]);
            }
          }
        ),

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {console.log('moduleIZ');}
      }
    ),
    // Pour un arrêt général. Note D-2 sur canal 5 pour skini soit 6 pour Ableton

    hh.ATOM(
      {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        oscMidiLocal.sendNoteOn( par.busMidiDAW,
        5,
        2,
        100);
        }
      }
    ),

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          setTempo(80);
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
            DAW.putPatternInQueue('sensor3-1');
          }
        }
      ),

    ),

  hh.LOOP(
      {
        "%location":{loop: 1},
        "%tag":"loop"
      },


    hh.ABORT(
      {
        "%location":{"filename":"hiphop_blocks.js","pos":189},
        "%tag":"do/every",
        "immediate":false,
        "apply": function (){return ((() => {
            const INTERFACEZ_RC11 = this["INTERFACEZ_RC11"];
            if( INTERFACEZ_RC11.nowval !== undefined ) {
              return INTERFACEZ_RC11.now && ( INTERFACEZ_RC11.nowval[0] === 11
                && INTERFACEZ_RC11.nowval[1] >500
                && INTERFACEZ_RC11.nowval[1] <5000);
            }
        })());},
        "countapply":function (){ return 1;}
      },
      hh.SIGACCESS({
        "signame":"INTERFACEZ_RC11",
        "pre":false,
        "val":false,
        "cnt":false
      }),

            hh.FORK(
                {
                  "%location":{},
                  "%tag":"fork"
                },


              hh.FORK(
                  {
                    "%location":{},
                    "%tag":"fork"
                  },



          hh.EVERY(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":189},
              "%tag":"do/every",
              "immediate":false,
              "apply": function (){return ((() => {
                  const INTERFACEZ_RC3 = this["INTERFACEZ_RC3"];
                  if( INTERFACEZ_RC3.nowval !== undefined ) {
                    return INTERFACEZ_RC3.now && ( INTERFACEZ_RC3.nowval[0] === 3
                      && INTERFACEZ_RC3.nowval[1] >3000
                      && INTERFACEZ_RC3.nowval[1] <4000);
                  }
              })());},
              "countapply":function (){ return 1;}
            },
            hh.SIGACCESS({
              "signame":"INTERFACEZ_RC3",
              "pre":false,
              "val":false,
              "cnt":false
            }),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {console.log('Sensor3-1');}
              }
            ),

              hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {
                    var msg = {
                      type: 'alertInfoScoreON',
                      value:'Sensor3-1'
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
                    DAW.putPatternInQueue('sensor3-1');
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
                "countapply":function (){ return 3;}
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
                      DAW.cleanQueue(16);
                    }
                  }
                ),

          ),


          hh.EVERY(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":189},
              "%tag":"do/every",
              "immediate":false,
              "apply": function (){return ((() => {
                  const INTERFACEZ_RC3 = this["INTERFACEZ_RC3"];
                  if( INTERFACEZ_RC3.nowval !== undefined ) {
                    return INTERFACEZ_RC3.now && ( INTERFACEZ_RC3.nowval[0] === 3
                      && INTERFACEZ_RC3.nowval[1] >2000
                      && INTERFACEZ_RC3.nowval[1] <2500);
                  }
              })());},
              "countapply":function (){ return 1;}
            },
            hh.SIGACCESS({
              "signame":"INTERFACEZ_RC3",
              "pre":false,
              "val":false,
              "cnt":false
            }),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {console.log('Sensor3-2');}
              }
            ),

              hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {
                    var msg = {
                      type: 'alertInfoScoreON',
                      value:'Sensor3-2'
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
                    DAW.putPatternInQueue('sensor3-2');
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
                "countapply":function (){ return 3;}
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
                      DAW.cleanQueue(17);
                    }
                  }
                ),

          ),


          hh.EVERY(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":189},
              "%tag":"do/every",
              "immediate":false,
              "apply": function (){return ((() => {
                  const INTERFACEZ_RC3 = this["INTERFACEZ_RC3"];
                  if( INTERFACEZ_RC3.nowval !== undefined ) {
                    return INTERFACEZ_RC3.now && ( INTERFACEZ_RC3.nowval[0] === 3
                      && INTERFACEZ_RC3.nowval[1] >1000
                      && INTERFACEZ_RC3.nowval[1] <1999);
                  }
              })());},
              "countapply":function (){ return 1;}
            },
            hh.SIGACCESS({
              "signame":"INTERFACEZ_RC3",
              "pre":false,
              "val":false,
              "cnt":false
            }),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {console.log('Sensor3-3');}
              }
            ),

              hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {
                    var msg = {
                      type: 'alertInfoScoreON',
                      value:'Sensor3-3'
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
                    DAW.putPatternInQueue('sensor3-3');
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
                "countapply":function (){ return 3;}
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
                      DAW.cleanQueue(18);
                    }
                  }
                ),

          ),


          hh.EVERY(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":189},
              "%tag":"do/every",
              "immediate":false,
              "apply": function (){return ((() => {
                  const INTERFACEZ_RC3 = this["INTERFACEZ_RC3"];
                  if( INTERFACEZ_RC3.nowval !== undefined ) {
                    return INTERFACEZ_RC3.now && ( INTERFACEZ_RC3.nowval[0] === 3
                      && INTERFACEZ_RC3.nowval[1] >500
                      && INTERFACEZ_RC3.nowval[1] <999);
                  }
              })());},
              "countapply":function (){ return 1;}
            },
            hh.SIGACCESS({
              "signame":"INTERFACEZ_RC3",
              "pre":false,
              "val":false,
              "cnt":false
            }),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {console.log('Sensor3-4');}
              }
            ),

              hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {
                    var msg = {
                      type: 'alertInfoScoreON',
                      value:'Sensor3-4'
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
                    DAW.putPatternInQueue('sensor3-4');
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
                "countapply":function (){ return 3;}
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
                      DAW.cleanQueue(19);
                    }
                  }
                ),

          ),


          hh.EVERY(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":189},
              "%tag":"do/every",
              "immediate":false,
              "apply": function (){return ((() => {
                  const INTERFACEZ_RC3 = this["INTERFACEZ_RC3"];
                  if( INTERFACEZ_RC3.nowval !== undefined ) {
                    return INTERFACEZ_RC3.now && ( INTERFACEZ_RC3.nowval[0] === 3
                      && INTERFACEZ_RC3.nowval[1] >0
                      && INTERFACEZ_RC3.nowval[1] <499);
                  }
              })());},
              "countapply":function (){ return 1;}
            },
            hh.SIGACCESS({
              "signame":"INTERFACEZ_RC3",
              "pre":false,
              "val":false,
              "cnt":false
            }),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {console.log('Sensor3-5');}
              }
            ),

              hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {
                    var msg = {
                      type: 'alertInfoScoreON',
                      value:'Sensor3-5'
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
                    DAW.putPatternInQueue('sensor3-5');
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
                "countapply":function (){ return 3;}
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
                      DAW.cleanQueue(20);
                    }
                  }
                ),

          ),

          ),

        ),

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
              DAW.cleanQueues();
              gcs.cleanChoiceList(255);
            }
          }
        ),
    // Pour un arrêt général. Note D-2 sur canal 5 pour skini soit 6 pour Ableton

    hh.ATOM(
      {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        oscMidiLocal.sendNoteOn( par.busMidiDAW,
        5,
        2,
        100);
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
              value:'Ca repart !'
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

    if(debug1) console.log("orchestrationHH.mjs: setSignals", param.groupesDesSons);
    var machine = new hh.ReactiveMachine( orchestration, {sweep:true, tracePropagation: false, traceReactDuration: false});
    console.log("INFO: setSignals: Number of nets in Orchestration:",machine.nets.length);
    return machine;
  }
