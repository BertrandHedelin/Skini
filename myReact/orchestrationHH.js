var sensor0, sensor2, zone1, zone2, zone3, zone4;



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

      hh.TRAP(
        {
          "trap174947":"trap174947",
          "%location":{},
          "%tag":"trap174947"
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
  	              "countapply":function (){return 24;}
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
  		          "trap174947":"trap174947",
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

      hh.TRAP(
        {
          "trap920359":"trap920359",
          "%location":{},
          "%tag":"trap920359"
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
  	              "countapply":function (){return 24;}
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
  		          "trap920359":"trap920359",
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

        // Capteur de son


      hh.EVERY(
        {
          "%location":{"filename":"hiphop_blocks.js","pos":189},
          "%tag":"do/every",
          "immediate":false,
          "apply": function (){return ((() => {
              const INTERFACEZ_RC = this["INTERFACEZ_RC"];
              if( INTERFACEZ_RC.nowval !== undefined ) {
                return INTERFACEZ_RC.now && ( INTERFACEZ_RC.nowval[0] === 0
                  && INTERFACEZ_RC.nowval[1] >1000
                  && INTERFACEZ_RC.nowval[1] <5000);
              }
          })());},
          "countapply":function (){ return 1;}
        },
        hh.SIGACCESS({
          "signame":"INTERFACEZ_RC",
          "pre":false,
          "val":false,
          "cnt":false
        }),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {console.log('Sensor0 1000-5000');}
          }
        ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "sensor0":"sensor0",
                "apply":function (){
                  return ((() => {
                    //const sensor0=this["sensor0"];
                    return 0;
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"sensor0",
                "pre":true,
                "val":true,
                "cnt":false
              })
            ),

            hh.TRAP(
              {
                "trap320070":"trap320070",
                "%location":{},
                "%tag":"trap320070"
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
        		          "trap320070":"trap320070",
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

            hh.ATOM(
              {
                "%location":{},
                "%tag":"node",
                "apply":function () {
                  DAW.cleanQueue(6);
                }
              }
            ),

      ),
      // Capteur de distance


      hh.EVERY(
        {
          "%location":{"filename":"hiphop_blocks.js","pos":189},
          "%tag":"do/every",
          "immediate":false,
          "apply": function (){return ((() => {
              const INTERFACEZ_RC = this["INTERFACEZ_RC"];
              if( INTERFACEZ_RC.nowval !== undefined ) {
                return INTERFACEZ_RC.now && ( INTERFACEZ_RC.nowval[0] === 2
                  && INTERFACEZ_RC.nowval[1] >1000
                  && INTERFACEZ_RC.nowval[1] <2001);
              }
          })());},
          "countapply":function (){ return 1;}
        },
        hh.SIGACCESS({
          "signame":"INTERFACEZ_RC",
          "pre":false,
          "val":false,
          "cnt":false
        }),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {console.log('Sensor2 1000-2000');}
          }
        ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "sensor2":"sensor2",
                "apply":function (){
                  return ((() => {
                    //const sensor2=this["sensor2"];
                    return 0;
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"sensor2",
                "pre":true,
                "val":true,
                "cnt":false
              })
            ),

            hh.TRAP(
              {
                "trap905518":"trap905518",
                "%location":{},
                "%tag":"trap905518"
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
        	              "countapply":function (){return 2;}
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
        		          "trap905518":"trap905518",
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


      hh.EVERY(
        {
          "%location":{"filename":"hiphop_blocks.js","pos":189},
          "%tag":"do/every",
          "immediate":false,
          "apply": function (){return ((() => {
              const INTERFACEZ_RC = this["INTERFACEZ_RC"];
              if( INTERFACEZ_RC.nowval !== undefined ) {
                return INTERFACEZ_RC.now && ( INTERFACEZ_RC.nowval[0] === 2
                  && INTERFACEZ_RC.nowval[1] >2000
                  && INTERFACEZ_RC.nowval[1] <2501);
              }
          })());},
          "countapply":function (){ return 1;}
        },
        hh.SIGACCESS({
          "signame":"INTERFACEZ_RC",
          "pre":false,
          "val":false,
          "cnt":false
        }),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {console.log('Sensor2 2000-2501');}
          }
        ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "sensor2":"sensor2",
                "apply":function (){
                  return ((() => {
                    //const sensor2=this["sensor2"];
                    return 0;
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"sensor2",
                "pre":true,
                "val":true,
                "cnt":false
              })
            ),

      ),


      hh.EVERY(
        {
          "%location":{"filename":"hiphop_blocks.js","pos":189},
          "%tag":"do/every",
          "immediate":false,
          "apply": function (){return ((() => {
              const INTERFACEZ_RC = this["INTERFACEZ_RC"];
              if( INTERFACEZ_RC.nowval !== undefined ) {
                return INTERFACEZ_RC.now && ( INTERFACEZ_RC.nowval[0] === 2
                  && INTERFACEZ_RC.nowval[1] >2500
                  && INTERFACEZ_RC.nowval[1] <4000);
              }
          })());},
          "countapply":function (){ return 1;}
        },
        hh.SIGACCESS({
          "signame":"INTERFACEZ_RC",
          "pre":false,
          "val":false,
          "cnt":false
        }),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {console.log('Sensor2 2500-4000');}
          }
        ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "sensor2":"sensor2",
                "apply":function (){
                  return ((() => {
                    //const sensor2=this["sensor2"];
                    return 0;
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"sensor2",
                "pre":true,
                "val":true,
                "cnt":false
              })
            ),

            hh.TRAP(
              {
                "trap187409":"trap187409",
                "%location":{},
                "%tag":"trap187409"
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
        	              "countapply":function (){return 2;}
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
        		          "trap187409":"trap187409",
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

      ),

      ),

    ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {console.log('****** Fin de la pièce');}
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
