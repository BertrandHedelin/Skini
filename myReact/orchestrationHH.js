var Clean1_2_3_4, sensor0, Clean5_6_7_8, sensor2, Clean9_10_11_12, Clean13_14_15_16, tick, zone1, zone2, zone3, zone4, zone7, zone8, zone9, zone10;



"use strict";
var hh = require("../hiphop/hiphop.js");

// C'est la seule façon d'échanger les paramètres nécessaires à la compilation
// lors de la création des signaux.
var par = require('../serveur/skiniParametres');

var midimix;
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

function setServ(ser, daw, groupeCS, oscMidi, mix){
  //console.log("hh_ORCHESTRATION: setServ");
  DAW = daw;
  serveur = ser;
  gcs = groupeCS;
  oscMidiLocal = oscMidi;
  midimix = mix;
}
exports.setServ = setServ;

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

for (var i=0; i < par.groupesDesSons.length; i++) {
  if(par.groupesDesSons[i][0] !== "") {
    var signalName = par.groupesDesSons[i][0] + "OUT";

    if(debug) console.log("Signal Orchestration:", signalName);

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
for (var i=0; i < par.groupesDesSons.length; i++) {
  if(par.groupesDesSons[i][0] !== "") {
    var signalName = par.groupesDesSons[i][0] + "IN";

    if(debug) console.log("Signal Orchestration:", signalName);

    var signal = hh.SIGNAL({
      "%location":{},
      "direction":"IN",
      "name":signalName
    });
    signals.push(signal);
  }
}

function setSignals(){
  var machine = new hh.ReactiveMachine( orchestration, {sweep:true, tracePropagation: false, traceReactDuration: false});
  console.log("INFO: Number of nets in Orchestration:",machine.nets.length);
  return machine;
}
exports.setSignals = setSignals;


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
      "name":"sensor0"
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"sensor2"
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
      "apply":function () {console.log('moduleIZ');}
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


      hh.ABORT(
        {
          "%location":{abort: tick},
          "%tag":"abort",
          "immediate":false,
          "apply": function (){return ((() => {
              const tick=this["tick"];
              return tick.now;
          })());},
          "countapply":function (){ return 60;}
        },
        hh.SIGACCESS({
          "signame":"tick",
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

              hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {
                    var msg = {
                      type: 'alertInfoScoreON',
                      value:'Sensor0'
                    }
                    serveur.broadcast(JSON.stringify(msg));
                    }
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
                        "trap331895":"trap331895",
                        "%location":{},
                        "%tag":"trap331895"
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
                		          "trap331895":"trap331895",
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
                "module": Clean1_2_3_4,  // hh.getModule(     {}),
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

              hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {
                    var msg = {
                      type: 'alertInfoScoreON',
                      value:'Sensor1'
                    }
                    serveur.broadcast(JSON.stringify(msg));
                    }
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
                        "trap226921":"trap226921",
                        "%location":{},
                        "%tag":"trap226921"
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
                		          "trap226921":"trap226921",
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
                "module": Clean5_6_7_8,  // hh.getModule(     {}),
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

              hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {
                    var msg = {
                      type: 'alertInfoScoreON',
                      value:'Sensor2'
                    }
                    serveur.broadcast(JSON.stringify(msg));
                    }
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
                        "trap722475":"trap722475",
                        "%location":{},
                        "%tag":"trap722475"
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
                		          "trap722475":"trap722475",
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
                "module": Clean9_10_11_12,  // hh.getModule(     {}),
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

              hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {
                    var msg = {
                      type: 'alertInfoScoreON',
                      value:'Sensor3'
                    }
                    serveur.broadcast(JSON.stringify(msg));
                    }
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
                        "trap34597":"trap34597",
                        "%location":{},
                        "%tag":"trap34597"
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
                		          "trap34597":"trap34597",
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
                "module": Clean13_14_15_16,  // hh.getModule(     {}),
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


      hh.ABORT(
        {
          "%location":{abort: tick},
          "%tag":"abort",
          "immediate":false,
          "apply": function (){return ((() => {
              const tick=this["tick"];
              return tick.now;
          })());},
          "countapply":function (){ return 60;}
        },
        hh.SIGACCESS({
          "signame":"tick",
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

              hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {
                    var msg = {
                      type: 'alertInfoScoreON',
                      value:'Sensor0'
                    }
                    serveur.broadcast(JSON.stringify(msg));
                    }
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
                        "trap570622":"trap570622",
                        "%location":{},
                        "%tag":"trap570622"
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
                		          "trap570622":"trap570622",
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
                "module": Clean1_2_3_4,  // hh.getModule(     {}),
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

              hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {
                    var msg = {
                      type: 'alertInfoScoreON',
                      value:'Sensor1'
                    }
                    serveur.broadcast(JSON.stringify(msg));
                    }
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
                        "trap444446":"trap444446",
                        "%location":{},
                        "%tag":"trap444446"
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
                		          "trap444446":"trap444446",
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
                "module": Clean5_6_7_8,  // hh.getModule(     {}),
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

              hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {
                    var msg = {
                      type: 'alertInfoScoreON',
                      value:'Sensor2'
                    }
                    serveur.broadcast(JSON.stringify(msg));
                    }
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
                        "trap186515":"trap186515",
                        "%location":{},
                        "%tag":"trap186515"
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
                		          "trap186515":"trap186515",
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
                "module": Clean9_10_11_12,  // hh.getModule(     {}),
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

              hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {
                    var msg = {
                      type: 'alertInfoScoreON',
                      value:'Sensor3'
                    }
                    serveur.broadcast(JSON.stringify(msg));
                    }
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
                        "trap772702":"trap772702",
                        "%location":{},
                        "%tag":"trap772702"
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
                		          "trap772702":"trap772702",
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
                "module": Clean13_14_15_16,  // hh.getModule(     {}),
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
        "%location":{"filename":"hiphop_blocks.js","pos":189},
        "%tag":"do/every",
        "immediate":false,
        "apply": function (){return ((() => {
            const INTERFACEZ_RC11 = this["INTERFACEZ_RC11"];
            if( INTERFACEZ_RC11.nowval !== undefined ) {
              return INTERFACEZ_RC11.now && ( INTERFACEZ_RC11.nowval[0] === 11
                && INTERFACEZ_RC11.nowval[1] >100
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
        5,
        2,
        100);
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
