var Clean1_2_3_4, sensor0, Clean5_6_7_8, sensor2, Clean9_10_11_12, ESP32_accel, Clean13_14_15_16, ESP32_gyro, ESP32_motion, ESP32_touch, ESP32_shock, ESP32_sensor1, JouerLaPiece, ESP32_light, ESP32_capa, zone7, zone8, zone9, zone10, zone1, zone2, zone3, zone4, tick;



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


  Clean1_2_3_4 = hh.MODULE({"id":"Clean1_2_3_4","%location":{},"%tag":"module"},


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
                DAW.cleanQueue(1);
              }
            }
          ),

          hh.ATOM(
            {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                DAW.cleanQueue(2);
              }
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
                DAW.cleanQueue(4);
              }
            }
          ),

      ),

  );

  Clean5_6_7_8 = hh.MODULE({"id":"Clean5_6_7_8","%location":{},"%tag":"module"},


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
                DAW.cleanQueue(5);
              }
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
                DAW.cleanQueue(7);
              }
            }
          ),

          hh.ATOM(
            {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                DAW.cleanQueue(8);
              }
            }
          ),

      ),

  );

  Clean9_10_11_12 = hh.MODULE({"id":"Clean9_10_11_12","%location":{},"%tag":"module"},


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
                DAW.cleanQueue(9);
              }
            }
          ),

          hh.ATOM(
            {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                DAW.cleanQueue(10);
              }
            }
          ),

          hh.ATOM(
            {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                DAW.cleanQueue(11);
              }
            }
          ),

          hh.ATOM(
            {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                DAW.cleanQueue(12);
              }
            }
          ),

      ),

  );

  Clean13_14_15_16 = hh.MODULE({"id":"Clean13_14_15_16","%location":{},"%tag":"module"},


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
                DAW.cleanQueue(13);
              }
            }
          ),

          hh.ATOM(
            {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                DAW.cleanQueue(14);
              }
            }
          ),

          hh.ATOM(
            {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                DAW.cleanQueue(15);
              }
            }
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
      "name":"sensor0",
      "combine_func":(x, y) => x + y
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"sensor2",
      "combine_func":(x, y) => x + y
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"ESP32_accel",
      "combine_func":(x, y) => x + y
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"ESP32_gyro",
      "combine_func":(x, y) => x + y
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"ESP32_motion",
      "combine_func":(x, y) => x + y
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"ESP32_shock",
      "combine_func":(x, y) => x + y
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"ESP32_touch",
      "combine_func":(x, y) => x + y
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"ESP32_sensor1",
      "combine_func":(x, y) => x + y
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"ESP32_light",
      "combine_func":(x, y) => x + y
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"ESP32_capa",
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
      "apply":function () {console.log('moduleIZ et ESP32');}
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
               gcs.setpatternListLength([5,255]);
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
          gcs.setTimerDivision(1);
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
            var msg = {
              type: 'alertInfoScoreON',
              value:'Presser le bouton !'
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
            const ESP32_touch=this["ESP32_touch"];
            return ESP32_touch.now;
          })());
        },
        "countapply":function (){ return 1;}
      },
      hh.SIGACCESS({
        "signame":"ESP32_touch",
        "pre":false,
        "val":false,
        "cnt":false
      })
    ),
    // Pour un arrêt général. Note D-2 sur canal 5 pour skini soit 6 pour Ableton

    hh.ATOM(
      {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        oscMidiLocal.sendNoteOn( par.busMidiDAW,
        3,
        46,
        100);
        }
      }
    ),

      hh.TRAP(
      {
        "JouerLaPiece":"JouerLaPiece",
        "%location":{},
        "%tag":"JouerLaPiece"
      },


      hh.ABORT(
        {
          "%location":{abort: ESP32_shock},
          "%tag":"abort",
          "immediate":false,
          "apply": function (){return ((() => {
              const ESP32_shock=this["ESP32_shock"];
              return ESP32_shock.now;
          })());},
          "countapply":function (){ return 1;}
        },
        hh.SIGACCESS({
          "signame":"ESP32_shock",
          "pre":false,
          "val":false,
          "cnt":false
        }),

              hh.FORK(
                  {
                    "%location":{},
                    "%tag":"fork"
                  },


          hh.LOOP(
              {
                "%location":{loop: 1},
                "%tag":"loop"
              },

                  hh.AWAIT(
                    {
                      "%location":{"filename":"hiphop_blocks.js","pos":189},
                      "%tag":"await",
                      "immediate":false,
                      "apply":function (){
                        return ((() => {
                          const ESP32_capa=this["ESP32_capa"];
                          return (ESP32_capa.now  && ESP32_capa.nowval === 1);
                        })());
                      },
                      "countapply":function (){ return 1;}
                    },
                    hh.SIGACCESS(
                      {"signame":"ESP32_capa",
                      "pre":false,
                      "val":false,
                      "cnt":false
                    })
                  ),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {console.log('CAPA Expansion');}
              }
            ),
            // Pour un arrêt général. Note 300 de Skini

            hh.ATOM(
              {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                oscMidiLocal.sendNoteOn( par.busMidiDAW,
                3,
                48,
                100);
                }
              }
            ),

            ),

          hh.LOOP(
              {
                "%location":{loop: 1},
                "%tag":"loop"
              },
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
                      value:'1ere séquence'
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


            hh.ABORT(
              {
                "%location":{abort: ESP32_touch},
                "%tag":"abort",
                "immediate":false,
                "apply": function (){return ((() => {
                    const ESP32_touch=this["ESP32_touch"];
                    return ESP32_touch.now;
                })());},
                "countapply":function (){ return 1;}
              },
              hh.SIGACCESS({
                "signame":"ESP32_touch",
                "pre":false,
                "val":false,
                "cnt":false
              }),

                    hh.FORK(
                        {
                          "%location":{},
                          "%tag":"fork"
                        },

                  // Capteur de distance


                hh.EVERY(
                  {
                    "%location":{"filename":"hiphop_blocks.js","pos":189},
                    "%tag":"do/every",
                    "immediate":false,
                    "apply": function (){return ((() => {
                        const INTERFACEZ_RC0 = this["INTERFACEZ_RC0"];
                        if( INTERFACEZ_RC0.nowval !== undefined ) {
                          return INTERFACEZ_RC0.now && ( INTERFACEZ_RC0.nowval[0] === 0
                            && INTERFACEZ_RC0.nowval[1] >1000
                            && INTERFACEZ_RC0.nowval[1] <4000);
                        }
                    })());},
                    "countapply":function (){ return 1;}
                  },
                  hh.SIGACCESS({
                    "signame":"INTERFACEZ_RC0",
                    "pre":false,
                    "val":false,
                    "cnt":false
                  }),

                  hh.ATOM(
                    {
                      "%location":{},
                      "%tag":"node",
                      "apply":function () {console.log('xml :Sensor0');}
                    }
                  ),

                        hh.SEQUENCE(
                            {
                              "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                              "%tag":"seq"
                            },


                          hh.FORK(
                              {
                                "%location":{},
                                "%tag":"fork"
                              },


                          hh.TRAP(
                            {
                              "trap185013":"trap185013",
                              "%location":{},
                              "%tag":"trap185013"
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
                                  "zone7OUT":"zone7OUT",
                                  "apply":function (){
                                    return ((() => {
                                      const zone7OUT = this["zone7OUT"];
                                      return [true, 255];
                                    })());
                                  }
                                },
                                hh.SIGACCESS({
                                  "signame":"zone7OUT",
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
                                    gcs.informSelecteurOnMenuChange(255," zone7", true);
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
                      	              "countapply":function (){return 4;}
                      	          },
                      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
                      	        ),


                      	        hh.EMIT(
                      	          {
                      	            "%location":{},
                      	            "%tag":"emit",
                      	            "zone7OUT":"zone7OUT",
                      	            "apply":function (){
                      	              return ((() => {
                      	                const zone7OUT = this["zone7OUT"];
                      	                return [false, 255];
                      	              })());
                      	            }
                      	          },
                      	          hh.SIGACCESS({
                      	            "signame":"zone7OUT",
                      	            "pre":true,
                      	            "val":true,
                      	            "cnt":false
                      	          })
                      	        ), // Fin emit
                      		    hh.ATOM(
                      		      {
                      		      "%location":{},
                      		      "%tag":"node",
                      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," zone7", false); }
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
                      		          "trap185013":"trap185013",
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

                      ),

                    hh.RUN({
                      "%location":{},
                      "%tag":"run",
                      "module": Clean1_2_3_4,
                      "''":"",

                    }),

                    ),

                ),


                hh.EVERY(
                  {
                    "%location":{"filename":"hiphop_blocks.js","pos":189},
                    "%tag":"do/every",
                    "immediate":false,
                    "apply": function (){return ((() => {
                        const INTERFACEZ_RC1 = this["INTERFACEZ_RC1"];
                        if( INTERFACEZ_RC1.nowval !== undefined ) {
                          return INTERFACEZ_RC1.now && ( INTERFACEZ_RC1.nowval[0] === 1
                            && INTERFACEZ_RC1.nowval[1] >1000
                            && INTERFACEZ_RC1.nowval[1] <4000);
                        }
                    })());},
                    "countapply":function (){ return 1;}
                  },
                  hh.SIGACCESS({
                    "signame":"INTERFACEZ_RC1",
                    "pre":false,
                    "val":false,
                    "cnt":false
                  }),

                  hh.ATOM(
                    {
                      "%location":{},
                      "%tag":"node",
                      "apply":function () {console.log('xml: Sensor1');}
                    }
                  ),

                        hh.SEQUENCE(
                            {
                              "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                              "%tag":"seq"
                            },


                          hh.FORK(
                              {
                                "%location":{},
                                "%tag":"fork"
                              },


                          hh.TRAP(
                            {
                              "trap820432":"trap820432",
                              "%location":{},
                              "%tag":"trap820432"
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
                                  "zone8OUT":"zone8OUT",
                                  "apply":function (){
                                    return ((() => {
                                      const zone8OUT = this["zone8OUT"];
                                      return [true, 255];
                                    })());
                                  }
                                },
                                hh.SIGACCESS({
                                  "signame":"zone8OUT",
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
                                    gcs.informSelecteurOnMenuChange(255," zone8", true);
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
                      	              "countapply":function (){return 4;}
                      	          },
                      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
                      	        ),


                      	        hh.EMIT(
                      	          {
                      	            "%location":{},
                      	            "%tag":"emit",
                      	            "zone8OUT":"zone8OUT",
                      	            "apply":function (){
                      	              return ((() => {
                      	                const zone8OUT = this["zone8OUT"];
                      	                return [false, 255];
                      	              })());
                      	            }
                      	          },
                      	          hh.SIGACCESS({
                      	            "signame":"zone8OUT",
                      	            "pre":true,
                      	            "val":true,
                      	            "cnt":false
                      	          })
                      	        ), // Fin emit
                      		    hh.ATOM(
                      		      {
                      		      "%location":{},
                      		      "%tag":"node",
                      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," zone8", false); }
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
                      		          "trap820432":"trap820432",
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

                      ),

                    hh.RUN({
                      "%location":{},
                      "%tag":"run",
                      "module": Clean5_6_7_8,
                      "''":"",

                    }),

                    ),

                ),


                hh.EVERY(
                  {
                    "%location":{"filename":"hiphop_blocks.js","pos":189},
                    "%tag":"do/every",
                    "immediate":false,
                    "apply": function (){return ((() => {
                        const INTERFACEZ_RC2 = this["INTERFACEZ_RC2"];
                        if( INTERFACEZ_RC2.nowval !== undefined ) {
                          return INTERFACEZ_RC2.now && ( INTERFACEZ_RC2.nowval[0] === 2
                            && INTERFACEZ_RC2.nowval[1] >1000
                            && INTERFACEZ_RC2.nowval[1] <4000);
                        }
                    })());},
                    "countapply":function (){ return 1;}
                  },
                  hh.SIGACCESS({
                    "signame":"INTERFACEZ_RC2",
                    "pre":false,
                    "val":false,
                    "cnt":false
                  }),

                  hh.ATOM(
                    {
                      "%location":{},
                      "%tag":"node",
                      "apply":function () {console.log('xml: Sensor2');}
                    }
                  ),

                        hh.SEQUENCE(
                            {
                              "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                              "%tag":"seq"
                            },


                          hh.FORK(
                              {
                                "%location":{},
                                "%tag":"fork"
                              },


                          hh.TRAP(
                            {
                              "trap915200":"trap915200",
                              "%location":{},
                              "%tag":"trap915200"
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
                                  "zone9OUT":"zone9OUT",
                                  "apply":function (){
                                    return ((() => {
                                      const zone9OUT = this["zone9OUT"];
                                      return [true, 255];
                                    })());
                                  }
                                },
                                hh.SIGACCESS({
                                  "signame":"zone9OUT",
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
                                    gcs.informSelecteurOnMenuChange(255," zone9", true);
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
                      	              "countapply":function (){return 4;}
                      	          },
                      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
                      	        ),


                      	        hh.EMIT(
                      	          {
                      	            "%location":{},
                      	            "%tag":"emit",
                      	            "zone9OUT":"zone9OUT",
                      	            "apply":function (){
                      	              return ((() => {
                      	                const zone9OUT = this["zone9OUT"];
                      	                return [false, 255];
                      	              })());
                      	            }
                      	          },
                      	          hh.SIGACCESS({
                      	            "signame":"zone9OUT",
                      	            "pre":true,
                      	            "val":true,
                      	            "cnt":false
                      	          })
                      	        ), // Fin emit
                      		    hh.ATOM(
                      		      {
                      		      "%location":{},
                      		      "%tag":"node",
                      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," zone9", false); }
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
                      		          "trap915200":"trap915200",
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

                      ),

                    hh.RUN({
                      "%location":{},
                      "%tag":"run",
                      "module": Clean9_10_11_12,
                      "''":"",

                    }),

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
                      "apply":function () {console.log('xml: Sensor3');}
                    }
                  ),

                        hh.SEQUENCE(
                            {
                              "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                              "%tag":"seq"
                            },


                          hh.FORK(
                              {
                                "%location":{},
                                "%tag":"fork"
                              },


                          hh.TRAP(
                            {
                              "trap445837":"trap445837",
                              "%location":{},
                              "%tag":"trap445837"
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
                                  "zone10OUT":"zone10OUT",
                                  "apply":function (){
                                    return ((() => {
                                      const zone10OUT = this["zone10OUT"];
                                      return [true, 255];
                                    })());
                                  }
                                },
                                hh.SIGACCESS({
                                  "signame":"zone10OUT",
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
                                    gcs.informSelecteurOnMenuChange(255," zone10", true);
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
                      	              "countapply":function (){return 4;}
                      	          },
                      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
                      	        ),


                      	        hh.EMIT(
                      	          {
                      	            "%location":{},
                      	            "%tag":"emit",
                      	            "zone10OUT":"zone10OUT",
                      	            "apply":function (){
                      	              return ((() => {
                      	                const zone10OUT = this["zone10OUT"];
                      	                return [false, 255];
                      	              })());
                      	            }
                      	          },
                      	          hh.SIGACCESS({
                      	            "signame":"zone10OUT",
                      	            "pre":true,
                      	            "val":true,
                      	            "cnt":false
                      	          })
                      	        ), // Fin emit
                      		    hh.ATOM(
                      		      {
                      		      "%location":{},
                      		      "%tag":"node",
                      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," zone10", false); }
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
                      		          "trap445837":"trap445837",
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

                      ),

                    hh.RUN({
                      "%location":{},
                      "%tag":"run",
                      "module": Clean13_14_15_16,
                      "''":"",

                    }),

                    ),

                ),

                ),

            ),

                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "zone7OUT": "zone7OUT",
                    "apply":function (){
                      return ((() => {
                        const zone7OUT = this["zone7OUT"];
                        return [false,255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame": "zone7OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ),
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone7OUT",false); }
                  }
              ),

                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "zone8OUT": "zone8OUT",
                    "apply":function (){
                      return ((() => {
                        const zone8OUT = this["zone8OUT"];
                        return [false,255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame": "zone8OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ),
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone8OUT",false); }
                  }
              ),

                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "zone9OUT": "zone9OUT",
                    "apply":function (){
                      return ((() => {
                        const zone9OUT = this["zone9OUT"];
                        return [false,255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame": "zone9OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ),
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone9OUT",false); }
                  }
              ),

                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "zone10OUT": "zone10OUT",
                    "apply":function (){
                      return ((() => {
                        const zone10OUT = this["zone10OUT"];
                        return [false,255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame": "zone10OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ),
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone10OUT",false); }
                  }
              ),

              hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {
                    var msg = {
                      type: 'alertInfoScoreON',
                      value:'2eme séquence'
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


            hh.ABORT(
              {
                "%location":{abort: ESP32_touch},
                "%tag":"abort",
                "immediate":false,
                "apply": function (){return ((() => {
                    const ESP32_touch=this["ESP32_touch"];
                    return ESP32_touch.now;
                })());},
                "countapply":function (){ return 1;}
              },
              hh.SIGACCESS({
                "signame":"ESP32_touch",
                "pre":false,
                "val":false,
                "cnt":false
              }),

                    hh.FORK(
                        {
                          "%location":{},
                          "%tag":"fork"
                        },

                  // Capteur de distance


                hh.EVERY(
                  {
                    "%location":{"filename":"hiphop_blocks.js","pos":189},
                    "%tag":"do/every",
                    "immediate":false,
                    "apply": function (){return ((() => {
                        const INTERFACEZ_RC0 = this["INTERFACEZ_RC0"];
                        if( INTERFACEZ_RC0.nowval !== undefined ) {
                          return INTERFACEZ_RC0.now && ( INTERFACEZ_RC0.nowval[0] === 0
                            && INTERFACEZ_RC0.nowval[1] >1000
                            && INTERFACEZ_RC0.nowval[1] <4000);
                        }
                    })());},
                    "countapply":function (){ return 1;}
                  },
                  hh.SIGACCESS({
                    "signame":"INTERFACEZ_RC0",
                    "pre":false,
                    "val":false,
                    "cnt":false
                  }),

                  hh.ATOM(
                    {
                      "%location":{},
                      "%tag":"node",
                      "apply":function () {console.log('Sensor0');}
                    }
                  ),

                        hh.SEQUENCE(
                            {
                              "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                              "%tag":"seq"
                            },


                          hh.FORK(
                              {
                                "%location":{},
                                "%tag":"fork"
                              },


                          hh.TRAP(
                            {
                              "trap174618":"trap174618",
                              "%location":{},
                              "%tag":"trap174618"
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
                                  "zone1OUT":"zone1OUT",
                                  "apply":function (){
                                    return ((() => {
                                      const zone1OUT = this["zone1OUT"];
                                      return [true, 255];
                                    })());
                                  }
                                },
                                hh.SIGACCESS({
                                  "signame":"zone1OUT",
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
                                    gcs.informSelecteurOnMenuChange(255," zone1", true);
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
                      	              "countapply":function (){return 4;}
                      	          },
                      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
                      	        ),


                      	        hh.EMIT(
                      	          {
                      	            "%location":{},
                      	            "%tag":"emit",
                      	            "zone1OUT":"zone1OUT",
                      	            "apply":function (){
                      	              return ((() => {
                      	                const zone1OUT = this["zone1OUT"];
                      	                return [false, 255];
                      	              })());
                      	            }
                      	          },
                      	          hh.SIGACCESS({
                      	            "signame":"zone1OUT",
                      	            "pre":true,
                      	            "val":true,
                      	            "cnt":false
                      	          })
                      	        ), // Fin emit
                      		    hh.ATOM(
                      		      {
                      		      "%location":{},
                      		      "%tag":"node",
                      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," zone1", false); }
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
                      		          "trap174618":"trap174618",
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

                      ),

                    hh.RUN({
                      "%location":{},
                      "%tag":"run",
                      "module": Clean1_2_3_4,
                      "''":"",

                    }),

                    ),

                ),


                hh.EVERY(
                  {
                    "%location":{"filename":"hiphop_blocks.js","pos":189},
                    "%tag":"do/every",
                    "immediate":false,
                    "apply": function (){return ((() => {
                        const INTERFACEZ_RC1 = this["INTERFACEZ_RC1"];
                        if( INTERFACEZ_RC1.nowval !== undefined ) {
                          return INTERFACEZ_RC1.now && ( INTERFACEZ_RC1.nowval[0] === 1
                            && INTERFACEZ_RC1.nowval[1] >1000
                            && INTERFACEZ_RC1.nowval[1] <4000);
                        }
                    })());},
                    "countapply":function (){ return 1;}
                  },
                  hh.SIGACCESS({
                    "signame":"INTERFACEZ_RC1",
                    "pre":false,
                    "val":false,
                    "cnt":false
                  }),

                  hh.ATOM(
                    {
                      "%location":{},
                      "%tag":"node",
                      "apply":function () {console.log('Sensor1');}
                    }
                  ),

                        hh.SEQUENCE(
                            {
                              "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                              "%tag":"seq"
                            },


                          hh.FORK(
                              {
                                "%location":{},
                                "%tag":"fork"
                              },


                          hh.TRAP(
                            {
                              "trap676285":"trap676285",
                              "%location":{},
                              "%tag":"trap676285"
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
                                  "zone2OUT":"zone2OUT",
                                  "apply":function (){
                                    return ((() => {
                                      const zone2OUT = this["zone2OUT"];
                                      return [true, 255];
                                    })());
                                  }
                                },
                                hh.SIGACCESS({
                                  "signame":"zone2OUT",
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
                                    gcs.informSelecteurOnMenuChange(255," zone2", true);
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
                      	              "countapply":function (){return 4;}
                      	          },
                      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
                      	        ),


                      	        hh.EMIT(
                      	          {
                      	            "%location":{},
                      	            "%tag":"emit",
                      	            "zone2OUT":"zone2OUT",
                      	            "apply":function (){
                      	              return ((() => {
                      	                const zone2OUT = this["zone2OUT"];
                      	                return [false, 255];
                      	              })());
                      	            }
                      	          },
                      	          hh.SIGACCESS({
                      	            "signame":"zone2OUT",
                      	            "pre":true,
                      	            "val":true,
                      	            "cnt":false
                      	          })
                      	        ), // Fin emit
                      		    hh.ATOM(
                      		      {
                      		      "%location":{},
                      		      "%tag":"node",
                      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," zone2", false); }
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
                      		          "trap676285":"trap676285",
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

                      ),

                    hh.RUN({
                      "%location":{},
                      "%tag":"run",
                      "module": Clean5_6_7_8,
                      "''":"",

                    }),

                    ),

                ),


                hh.EVERY(
                  {
                    "%location":{"filename":"hiphop_blocks.js","pos":189},
                    "%tag":"do/every",
                    "immediate":false,
                    "apply": function (){return ((() => {
                        const INTERFACEZ_RC2 = this["INTERFACEZ_RC2"];
                        if( INTERFACEZ_RC2.nowval !== undefined ) {
                          return INTERFACEZ_RC2.now && ( INTERFACEZ_RC2.nowval[0] === 2
                            && INTERFACEZ_RC2.nowval[1] >1000
                            && INTERFACEZ_RC2.nowval[1] <4000);
                        }
                    })());},
                    "countapply":function (){ return 1;}
                  },
                  hh.SIGACCESS({
                    "signame":"INTERFACEZ_RC2",
                    "pre":false,
                    "val":false,
                    "cnt":false
                  }),

                  hh.ATOM(
                    {
                      "%location":{},
                      "%tag":"node",
                      "apply":function () {console.log('Sensor2');}
                    }
                  ),

                        hh.SEQUENCE(
                            {
                              "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                              "%tag":"seq"
                            },


                          hh.FORK(
                              {
                                "%location":{},
                                "%tag":"fork"
                              },


                          hh.TRAP(
                            {
                              "trap233530":"trap233530",
                              "%location":{},
                              "%tag":"trap233530"
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
                                  "zone3OUT":"zone3OUT",
                                  "apply":function (){
                                    return ((() => {
                                      const zone3OUT = this["zone3OUT"];
                                      return [true, 255];
                                    })());
                                  }
                                },
                                hh.SIGACCESS({
                                  "signame":"zone3OUT",
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
                                    gcs.informSelecteurOnMenuChange(255," zone3", true);
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
                      	              "countapply":function (){return 4;}
                      	          },
                      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
                      	        ),


                      	        hh.EMIT(
                      	          {
                      	            "%location":{},
                      	            "%tag":"emit",
                      	            "zone3OUT":"zone3OUT",
                      	            "apply":function (){
                      	              return ((() => {
                      	                const zone3OUT = this["zone3OUT"];
                      	                return [false, 255];
                      	              })());
                      	            }
                      	          },
                      	          hh.SIGACCESS({
                      	            "signame":"zone3OUT",
                      	            "pre":true,
                      	            "val":true,
                      	            "cnt":false
                      	          })
                      	        ), // Fin emit
                      		    hh.ATOM(
                      		      {
                      		      "%location":{},
                      		      "%tag":"node",
                      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," zone3", false); }
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
                      		          "trap233530":"trap233530",
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

                      ),

                    hh.RUN({
                      "%location":{},
                      "%tag":"run",
                      "module": Clean9_10_11_12,
                      "''":"",

                    }),

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
                      "apply":function () {console.log('Sensor3');}
                    }
                  ),

                        hh.SEQUENCE(
                            {
                              "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                              "%tag":"seq"
                            },


                          hh.FORK(
                              {
                                "%location":{},
                                "%tag":"fork"
                              },


                          hh.TRAP(
                            {
                              "trap949687":"trap949687",
                              "%location":{},
                              "%tag":"trap949687"
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
                                  "zone4OUT":"zone4OUT",
                                  "apply":function (){
                                    return ((() => {
                                      const zone4OUT = this["zone4OUT"];
                                      return [true, 255];
                                    })());
                                  }
                                },
                                hh.SIGACCESS({
                                  "signame":"zone4OUT",
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
                                    gcs.informSelecteurOnMenuChange(255," zone4", true);
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
                      	              "countapply":function (){return 4;}
                      	          },
                      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
                      	        ),


                      	        hh.EMIT(
                      	          {
                      	            "%location":{},
                      	            "%tag":"emit",
                      	            "zone4OUT":"zone4OUT",
                      	            "apply":function (){
                      	              return ((() => {
                      	                const zone4OUT = this["zone4OUT"];
                      	                return [false, 255];
                      	              })());
                      	            }
                      	          },
                      	          hh.SIGACCESS({
                      	            "signame":"zone4OUT",
                      	            "pre":true,
                      	            "val":true,
                      	            "cnt":false
                      	          })
                      	        ), // Fin emit
                      		    hh.ATOM(
                      		      {
                      		      "%location":{},
                      		      "%tag":"node",
                      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," zone4", false); }
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
                      		          "trap949687":"trap949687",
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

                      ),

                    hh.RUN({
                      "%location":{},
                      "%tag":"run",
                      "module": Clean13_14_15_16,
                      "''":"",

                    }),

                    ),

                ),

                ),

            ),

                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "zone1OUT": "zone1OUT",
                    "apply":function (){
                      return ((() => {
                        const zone1OUT = this["zone1OUT"];
                        return [false,255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame": "zone1OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ),
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone1OUT",false); }
                  }
              ),

                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "zone2OUT": "zone2OUT",
                    "apply":function (){
                      return ((() => {
                        const zone2OUT = this["zone2OUT"];
                        return [false,255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame": "zone2OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ),
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone2OUT",false); }
                  }
              ),

                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "zone3OUT": "zone3OUT",
                    "apply":function (){
                      return ((() => {
                        const zone3OUT = this["zone3OUT"];
                        return [false,255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame": "zone3OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ),
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone3OUT",false); }
                  }
              ),

                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "zone4OUT": "zone4OUT",
                    "apply":function (){
                      return ((() => {
                        const zone4OUT = this["zone4OUT"];
                        return [false,255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame": "zone4OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ),
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone4OUT",false); }
                  }
              ),

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
                    "zone1OUT": "zone1OUT",
                    "apply":function (){
                      return ((() => {
                        const zone1OUT = this["zone1OUT"];
                        return [false,255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame": "zone1OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ),
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone1OUT",false); }
                  }
              ),

                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "zone2OUT": "zone2OUT",
                    "apply":function (){
                      return ((() => {
                        const zone2OUT = this["zone2OUT"];
                        return [false,255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame": "zone2OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ),
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone2OUT",false); }
                  }
              ),

                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "zone3OUT": "zone3OUT",
                    "apply":function (){
                      return ((() => {
                        const zone3OUT = this["zone3OUT"];
                        return [false,255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame": "zone3OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ),
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone3OUT",false); }
                  }
              ),

                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "zone4OUT": "zone4OUT",
                    "apply":function (){
                      return ((() => {
                        const zone4OUT = this["zone4OUT"];
                        return [false,255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame": "zone4OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ),
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone4OUT",false); }
                  }
              ),

                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "zone7OUT": "zone7OUT",
                    "apply":function (){
                      return ((() => {
                        const zone7OUT = this["zone7OUT"];
                        return [false,255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame": "zone7OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ),
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone7OUT",false); }
                  }
              ),

                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "zone8OUT": "zone8OUT",
                    "apply":function (){
                      return ((() => {
                        const zone8OUT = this["zone8OUT"];
                        return [false,255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame": "zone8OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ),
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone8OUT",false); }
                  }
              ),

                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "zone9OUT": "zone9OUT",
                    "apply":function (){
                      return ((() => {
                        const zone9OUT = this["zone9OUT"];
                        return [false,255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame": "zone9OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ),
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone9OUT",false); }
                  }
              ),

                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "zone10OUT": "zone10OUT",
                    "apply":function (){
                      return ((() => {
                        const zone10OUT = this["zone10OUT"];
                        return [false,255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame": "zone10OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ),
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone10OUT",false); }
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
                    var msg = {
                      type: 'alertInfoScoreON',
                      value:'Morceau de fin'
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
                    DAW.putPatternInQueue('Fin');
                  }
                }
              ),


            hh.ABORT(
              {
                "%location":{abort: ESP32_touch},
                "%tag":"abort",
                "immediate":false,
                "apply": function (){return ((() => {
                    const ESP32_touch=this["ESP32_touch"];
                    return ESP32_touch.now;
                })());},
                "countapply":function (){ return 1;}
              },
              hh.SIGACCESS({
                "signame":"ESP32_touch",
                "pre":false,
                "val":false,
                "cnt":false
              }),

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
                  "countapply":function (){ return 88;}
                },
                hh.SIGACCESS({
                  "signame":"tick",
                  "pre":false,
                  "val":false,
                  "cnt":false
                })
              ),

            ),
            // Pour un arrêt général. Note D-2 sur canal 5 pour skini soit 6 pour Ableton

            hh.ATOM(
              {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                oscMidiLocal.sendNoteOn( par.busMidiDAW,
                3,
                46,
                100);
                }
              }
            ),

            ),

          hh.LOOP(
              {
                "%location":{loop: 1},
                "%tag":"loop"
              },

                  hh.AWAIT(
                    {
                      "%location":{"filename":"hiphop_blocks.js","pos":189},
                      "%tag":"await",
                      "immediate":false,
                      "apply":function (){
                        return ((() => {
                          const ESP32_light=this["ESP32_light"];
                          return (ESP32_light.now  && ESP32_light.nowval === 1);
                        })());
                      },
                      "countapply":function (){ return 1;}
                    },
                    hh.SIGACCESS(
                      {"signame":"ESP32_light",
                      "pre":false,
                      "val":false,
                      "cnt":false
                    })
                  ),
                // Pour un arrêt général. Note 300 de Skini

            hh.ATOM(
              {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                oscMidiLocal.sendNoteOn( par.busMidiDAW,
                3,
                48,
                100);
                }
              }
            ),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {console.log('Light ON');}
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

                  hh.AWAIT(
                    {
                      "%location":{"filename":"hiphop_blocks.js","pos":189},
                      "%tag":"await",
                      "immediate":false,
                      "apply":function (){
                        return ((() => {
                          const ESP32_light=this["ESP32_light"];
                          return (ESP32_light.now  && ESP32_light.nowval === 0);
                        })());
                      },
                      "countapply":function (){ return 1;}
                    },
                    hh.SIGACCESS(
                      {"signame":"ESP32_light",
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
                      value:'On a éteint la lumière'
                    }
                    serveur.broadcast(JSON.stringify(msg));
                    }
                  }
              ),

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {console.log('Light OFF');}
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

              hh.EXIT(
              {
                "JouerLaPiece":"JouerLaPiece",
                "%location":{},
                "%tag":"break"
              }),

            ),

          ),

      ),

    ),

          hh.SEQUENCE(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                "%tag":"seq"
              },


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
              var msg = {
                type: 'alertInfoScoreON',
                value:'Arret sur choc ou plus de lumière !'
              }
              serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "zone7OUT": "zone7OUT",
              "apply":function (){
                return ((() => {
                  const zone7OUT = this["zone7OUT"];
                  return [false,255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "zone7OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone7OUT",false); }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "zone8OUT": "zone8OUT",
              "apply":function (){
                return ((() => {
                  const zone8OUT = this["zone8OUT"];
                  return [false,255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "zone8OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone8OUT",false); }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "zone9OUT": "zone9OUT",
              "apply":function (){
                return ((() => {
                  const zone9OUT = this["zone9OUT"];
                  return [false,255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "zone9OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone9OUT",false); }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "zone10OUT": "zone10OUT",
              "apply":function (){
                return ((() => {
                  const zone10OUT = this["zone10OUT"];
                  return [false,255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "zone10OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone10OUT",false); }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "zone1OUT": "zone1OUT",
              "apply":function (){
                return ((() => {
                  const zone1OUT = this["zone1OUT"];
                  return [false,255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "zone1OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone1OUT",false); }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "zone2OUT": "zone2OUT",
              "apply":function (){
                return ((() => {
                  const zone2OUT = this["zone2OUT"];
                  return [false,255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "zone2OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone2OUT",false); }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "zone3OUT": "zone3OUT",
              "apply":function (){
                return ((() => {
                  const zone3OUT = this["zone3OUT"];
                  return [false,255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "zone3OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone3OUT",false); }
            }
        ),

          hh.EMIT(
            {
              "%location":{},
              "%tag":"emit",
              "zone4OUT": "zone4OUT",
              "apply":function (){
                return ((() => {
                  const zone4OUT = this["zone4OUT"];
                  return [false,255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame": "zone4OUT",
              "pre":true,
              "val":true,
              "cnt":false
            })
          ),
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255 , "zone4OUT",false); }
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
      // Silence

      hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          oscMidiLocal.sendNoteOn( par.busMidiDAW,
          3,
          46,
          100);
          }
        }
      ),
      // cymbale

      hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          oscMidiLocal.sendNoteOn( par.busMidiDAW,
          3,
          47,
          100);
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
          "countapply":function (){ return 5;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
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

    if(debug) console.log("orchestrationHH.mjs: setSignals", param.groupesDesSons);
    var machine = new hh.ReactiveMachine( orchestration, {sweep:true, tracePropagation: false, traceReactDuration: false});
    console.log("INFO: setSignals: Number of nets in Orchestration:",machine.nets.length);
    return machine;
  }
