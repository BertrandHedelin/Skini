var loopFM8, tick, loopBiopoly, loopCapa, loopMassiveX, groupe3, groupe5, groupe12, groupe7, groupe7IN, groupe8, groupe6, groupe9, groupe10, groupe11;



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
  if(midimix.getAbletonLinkStatus()) {
    if(debug) console.log("ORCHESTRATION: tempo Link:", value);
    midimix.setTempoLink(value);
    return;
  }

  tempoGlobal = value;
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
  var machine = new hh.ReactiveMachine( orchestration, {sweep:true});
  console.log("nets",machine.nets.length);

  return machine;
}
exports.setSignals = setSignals;


  loopFM8 = hh.MODULE({"id":"loopFM8","%location":{},"%tag":"module"},

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"tick"
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
        "countapply":function (){ return 2;}
      },
      hh.SIGACCESS({
        "signame":"tick",
        "pre":false,
        "val":false,
        "cnt":false
      }),


      hh.LOOPEACH(
        {
          "%location":{loopeach: tick},
          "%tag":"do/every",
          "immediate":false,
          "apply": function (){return ((() => {
              const tick=this["tick"];
              return tick.now;
          })());},
          "countapply":function (){ return 1;}
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
                DAW.putPatternInQueue('FM8-1');
              }
            }
          ),

      ),

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
        "countapply":function (){ return 2;}
      },
      hh.SIGACCESS({
        "signame":"tick",
        "pre":false,
        "val":false,
        "cnt":false
      }),


      hh.LOOPEACH(
        {
          "%location":{loopeach: tick},
          "%tag":"do/every",
          "immediate":false,
          "apply": function (){return ((() => {
              const tick=this["tick"];
              return tick.now;
          })());},
          "countapply":function (){ return 1;}
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
                DAW.putPatternInQueue('FM8-2');
              }
            }
          ),

      ),

    ),

  );

  loopBiopoly = hh.MODULE({"id":"loopBiopoly","%location":{},"%tag":"module"},

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"tick"
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
        "countapply":function (){ return 2;}
      },
      hh.SIGACCESS({
        "signame":"tick",
        "pre":false,
        "val":false,
        "cnt":false
      }),


      hh.LOOPEACH(
        {
          "%location":{loopeach: tick},
          "%tag":"do/every",
          "immediate":false,
          "apply": function (){return ((() => {
              const tick=this["tick"];
              return tick.now;
          })());},
          "countapply":function (){ return 1;}
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
                DAW.putPatternInQueue('Biopoly1');
              }
            }
          ),

      ),

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
        "countapply":function (){ return 2;}
      },
      hh.SIGACCESS({
        "signame":"tick",
        "pre":false,
        "val":false,
        "cnt":false
      }),


      hh.LOOPEACH(
        {
          "%location":{loopeach: tick},
          "%tag":"do/every",
          "immediate":false,
          "apply": function (){return ((() => {
              const tick=this["tick"];
              return tick.now;
          })());},
          "countapply":function (){ return 1;}
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
                DAW.putPatternInQueue('Biopoly2');
              }
            }
          ),

      ),

    ),

  );

  loopCapa = hh.MODULE({"id":"loopCapa","%location":{},"%tag":"module"},

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"tick"
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
        "countapply":function (){ return 2;}
      },
      hh.SIGACCESS({
        "signame":"tick",
        "pre":false,
        "val":false,
        "cnt":false
      }),


      hh.LOOPEACH(
        {
          "%location":{loopeach: tick},
          "%tag":"do/every",
          "immediate":false,
          "apply": function (){return ((() => {
              const tick=this["tick"];
              return tick.now;
          })());},
          "countapply":function (){ return 1;}
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
                DAW.putPatternInQueue('Capa1');
              }
            }
          ),

      ),

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
        "countapply":function (){ return 2;}
      },
      hh.SIGACCESS({
        "signame":"tick",
        "pre":false,
        "val":false,
        "cnt":false
      }),


      hh.LOOPEACH(
        {
          "%location":{loopeach: tick},
          "%tag":"do/every",
          "immediate":false,
          "apply": function (){return ((() => {
              const tick=this["tick"];
              return tick.now;
          })());},
          "countapply":function (){ return 1;}
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
                DAW.putPatternInQueue('Capa2');
              }
            }
          ),

      ),

    ),

  );

  loopMassiveX = hh.MODULE({"id":"loopMassiveX","%location":{},"%tag":"module"},

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"tick"
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
        "countapply":function (){ return 2;}
      },
      hh.SIGACCESS({
        "signame":"tick",
        "pre":false,
        "val":false,
        "cnt":false
      }),


      hh.LOOPEACH(
        {
          "%location":{loopeach: tick},
          "%tag":"do/every",
          "immediate":false,
          "apply": function (){return ((() => {
              const tick=this["tick"];
              return tick.now;
          })());},
          "countapply":function (){ return 1;}
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
                DAW.putPatternInQueue('MassiveX1');
              }
            }
          ),

      ),

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
        "countapply":function (){ return 2;}
      },
      hh.SIGACCESS({
        "signame":"tick",
        "pre":false,
        "val":false,
        "cnt":false
      }),


      hh.LOOPEACH(
        {
          "%location":{loopeach: tick},
          "%tag":"do/every",
          "immediate":false,
          "apply": function (){return ((() => {
              const tick=this["tick"];
              return tick.now;
          })());},
          "countapply":function (){ return 1;}
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
                DAW.putPatternInQueue('MassiveX2');
              }
            }
          ),

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
        gcs.setTimerDivision(4);
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
            DAW.putPatternInQueue('Biopoly1');
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('Biopoly2');
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('Biopoly1');
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('MassiveX1');
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('MassiveX2');
          }
        }
      ),

    ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {console.log('Debut 3');}
    }
  ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        setTempo(110);
      }
    }
  ),

        hh.FORK(
            {
              "%location":{},
              "%tag":"fork"
            },


        hh.TRAP(
          {
            "trap121917":"trap121917",
            "%location":{},
            "%tag":"trap121917"
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
                "groupe3OUT":"groupe3OUT",
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
              })
            ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () {
                  gcs.informSelecteurOnMenuChange(255," groupe3", true);
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
    	            "groupe3OUT":"groupe3OUT",
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
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe3", false); }
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
    		          "trap121917":"trap121917",
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
            "trap526549":"trap526549",
            "%location":{},
            "%tag":"trap526549"
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
                "groupe5OUT":"groupe5OUT",
                "apply":function (){
                  return ((() => {
                    const groupe5OUT = this["groupe5OUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"groupe5OUT",
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
                  gcs.informSelecteurOnMenuChange(255," groupe5", true);
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
    	            "groupe5OUT":"groupe5OUT",
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
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe5", false); }
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
    		          "trap526549":"trap526549",
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
      "countapply":function (){ return 4;}
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
            DAW.cleanQueue(4);
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

        hh.SEQUENCE(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
              "%tag":"seq"
            },


    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {console.log('Debut 1');}
      }
    ),

        hh.TRAP(
          {
            "trap554798":"trap554798",
            "%location":{},
            "%tag":"trap554798"
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
                "groupe3OUT":"groupe3OUT",
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
              })
            ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () {
                  gcs.informSelecteurOnMenuChange(255," groupe3", true);
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
    	            "groupe3OUT":"groupe3OUT",
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
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe3", false); }
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
    		          "trap554798":"trap554798",
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
        "apply":function () {console.log('Debut 2');}
      }
    ),

        hh.TRAP(
          {
            "trap988803":"trap988803",
            "%location":{},
            "%tag":"trap988803"
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
                "groupe5OUT":"groupe5OUT",
                "apply":function (){
                  return ((() => {
                    const groupe5OUT = this["groupe5OUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"groupe5OUT",
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
                  gcs.informSelecteurOnMenuChange(255," groupe5", true);
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
    	            "groupe5OUT":"groupe5OUT",
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
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe5", false); }
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
    		          "trap988803":"trap988803",
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
        "countapply":function (){ return 1;}
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
              DAW.cleanQueues();
              gcs.cleanChoiceList(255);
            }
          }
        ),

    ),

    hh.ATOM(
      {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        oscMidiLocal.sendOSCRasp(
        'level',
        100,
        par.raspOSCPort,
        '192.168.1.28');
        }
      }
    ),
    // Séquence techno

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
              type: 'alertInfoScoreON',
              value:'Techno'
            }
            serveur.broadcast(JSON.stringify(msg));
            }
          }
      ),

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {console.log('Techno');}
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
        "countapply":function (){ return 8;}
      },
      hh.SIGACCESS({
        "signame":"tick",
        "pre":false,
        "val":false,
        "cnt":false
      }),

      hh.LOOP(
          {
            "%location":{loop: 1},
            "%tag":"loop"
          },

              hh.FORK(
                  {
                    "%location":{},
                    "%tag":"fork"
                  },


          hh.RUN({
            "%location":{},
            "%tag":"run",
            "module": hh.getModule(  "loopFM8", {}),
            "tick":"",

          }),

          hh.RUN({
            "%location":{},
            "%tag":"run",
            "module": hh.getModule(  "loopBiopoly", {}),
            "tick":"",

          }),

          hh.RUN({
            "%location":{},
            "%tag":"run",
            "module": hh.getModule(  "loopCapa", {}),
            "tick":"",

          }),

          hh.RUN({
            "%location":{},
            "%tag":"run",
            "module": hh.getModule(  "loopMassiveX", {}),
            "tick":"",

          }),

          ),

        ),

    ),

    ),
    // Sequence percu et Drone

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
              type: 'alertInfoScoreON',
              value:'Percu et drone'
            }
            serveur.broadcast(JSON.stringify(msg));
            }
          }
      ),

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {console.log('Percu et Drone');}
      }
    ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('LookAtMe');
          }
        }
      ),

        hh.TRAP(
          {
            "trap277118":"trap277118",
            "%location":{},
            "%tag":"trap277118"
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
                "groupe12OUT":"groupe12OUT",
                "apply":function (){
                  return ((() => {
                    const groupe12OUT = this["groupe12OUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"groupe12OUT",
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
                  gcs.informSelecteurOnMenuChange(255," groupe12", true);
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
    	            "groupe12OUT":"groupe12OUT",
    	            "apply":function (){
    	              return ((() => {
    	                const groupe12OUT = this["groupe12OUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"groupe12OUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe12", false); }
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
    		          "trap277118":"trap277118",
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
            "trap200843":"trap200843",
            "%location":{},
            "%tag":"trap200843"
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
                "groupe6OUT":"groupe6OUT",
                "apply":function (){
                  return ((() => {
                    const groupe6OUT = this["groupe6OUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"groupe6OUT",
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
                  gcs.informSelecteurOnMenuChange(255," groupe6", true);
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
    	            "groupe6OUT":"groupe6OUT",
    	            "apply":function (){
    	              return ((() => {
    	                const groupe6OUT = this["groupe6OUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"groupe6OUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe6", false); }
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
    		          "trap200843":"trap200843",
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
              DAW.cleanQueue(5);
            }
          }
        ),

    ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {console.log('Hiver 2022 fin loop');}
    }
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
exports.orchestration = orchestration;
