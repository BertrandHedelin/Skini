var timer, tick, loopFM8, loopBiopoly, loopCapa, groupe6, loopMassiveX, groupe7, groupe7IN, groupe8, groupe9, groupe10, groupe11;



"use strict";
var hh = require("../hiphop/hiphop.js");
var par = require('../serveur/skiniParametres');
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

function setServ(ser, daw, groupeCS, oscMidi, param){
  //console.log("hh_ORCHESTRATION: setServ");
  par = param;
  DAW = daw;
  serveur = ser;
  gcs = groupeCS;
  oscMidiLocal = oscMidi;
}
exports.setServ = setServ;

function setTempo(value){
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


  timer = hh.MODULE({"id":"timer","%location":{},"%tag":"module"},

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"tick"
      }),


      hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            var msg = {
              type: 'alertInfoScoreON',
              value:'Still 10s to play'
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
            var msg = {
              type: 'alertInfoScoreON',
              value:'8s to play'
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
            var msg = {
              type: 'alertInfoScoreON',
              value:'6s to play'
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
            var msg = {
              type: 'alertInfoScoreON',
              value:'4s to play'
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
            var msg = {
              type: 'alertInfoScoreON',
              value:'2s to play'
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
            var msg = {
              type: 'alertInfoScoreOFF',
            }
            serveur.broadcast(JSON.stringify(msg));
            }
          }
      ),

  );

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
        "countapply":function (){ return 8;}
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
          "countapply":function (){ return 2;}
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
        "countapply":function (){ return 8;}
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
          "countapply":function (){ return 2;}
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
        "countapply":function (){ return 8;}
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
          "countapply":function (){ return 2;}
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
        "countapply":function (){ return 8;}
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
          "countapply":function (){ return 2;}
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
        "countapply":function (){ return 8;}
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
          "countapply":function (){ return 2;}
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
        "countapply":function (){ return 8;}
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
          "countapply":function (){ return 2;}
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
        "countapply":function (){ return 8;}
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
          "countapply":function (){ return 2;}
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
        "countapply":function (){ return 8;}
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
          "countapply":function (){ return 2;}
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

    hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          var msg = {
            type: 'alertInfoScoreON',
            value:'Hiver 2022'
          }
          serveur.broadcast(JSON.stringify(msg));
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
            "trap323781":"trap323781",
            "%location":{},
            "%tag":"trap323781"
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
                "groupe7OUT":"groupe7OUT",
                "apply":function (){
                  return ((() => {
                    const groupe7OUT = this["groupe7OUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"groupe7OUT",
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
                  gcs.informSelecteurOnMenuChange(255," groupe7", true);
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
    	              "countapply":function (){return 40;}
    	          },
    	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
    	        ),


    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "groupe7OUT":"groupe7OUT",
    	            "apply":function (){
    	              return ((() => {
    	                const groupe7OUT = this["groupe7OUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"groupe7OUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe7", false); }
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
    		          "trap323781":"trap323781",
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


      hh.AWAIT(
        {
          "%location":{},
          "%tag":"await",
          "immediate":false,
          "apply":function () {
            return ((() => {
              const groupe7IN=this["groupe7IN"];
              return groupe7IN.now;
            })());
          },
          "countapply":function (){ return 4;}
        },
        hh.SIGACCESS({
          "signame":"groupe7IN",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

          hh.TRAP(
            {
              "trap904826":"trap904826",
              "%location":{},
              "%tag":"trap904826"
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
                  "groupe8OUT":"groupe8OUT",
                  "apply":function (){
                    return ((() => {
                      const groupe8OUT = this["groupe8OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"groupe8OUT",
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
                    gcs.informSelecteurOnMenuChange(255," groupe8", true);
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
      	              "countapply":function (){return 8;}
      	          },
      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
      	        ),


      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "groupe8OUT":"groupe8OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const groupe8OUT = this["groupe8OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"groupe8OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe8", false); }
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
      		          "trap904826":"trap904826",
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
              const groupe7IN=this["groupe7IN"];
              return groupe7IN.now;
            })());
          },
          "countapply":function (){ return 4;}
        },
        hh.SIGACCESS({
          "signame":"groupe7IN",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

          hh.TRAP(
            {
              "trap601800":"trap601800",
              "%location":{},
              "%tag":"trap601800"
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
                  "groupe9OUT":"groupe9OUT",
                  "apply":function (){
                    return ((() => {
                      const groupe9OUT = this["groupe9OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"groupe9OUT",
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
                    gcs.informSelecteurOnMenuChange(255," groupe9", true);
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
      	              "countapply":function (){return 8;}
      	          },
      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
      	        ),


      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "groupe9OUT":"groupe9OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const groupe9OUT = this["groupe9OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"groupe9OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe9", false); }
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
      		          "trap601800":"trap601800",
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
              const groupe7IN=this["groupe7IN"];
              return groupe7IN.now;
            })());
          },
          "countapply":function (){ return 4;}
        },
        hh.SIGACCESS({
          "signame":"groupe7IN",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

          hh.TRAP(
            {
              "trap13082":"trap13082",
              "%location":{},
              "%tag":"trap13082"
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
                  "groupe10OUT":"groupe10OUT",
                  "apply":function (){
                    return ((() => {
                      const groupe10OUT = this["groupe10OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"groupe10OUT",
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
                    gcs.informSelecteurOnMenuChange(255," groupe10", true);
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
      	              "countapply":function (){return 8;}
      	          },
      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
      	        ),


      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "groupe10OUT":"groupe10OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const groupe10OUT = this["groupe10OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"groupe10OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe10", false); }
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
      		          "trap13082":"trap13082",
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
              const groupe7IN=this["groupe7IN"];
              return groupe7IN.now;
            })());
          },
          "countapply":function (){ return 4;}
        },
        hh.SIGACCESS({
          "signame":"groupe7IN",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

          hh.TRAP(
            {
              "trap982217":"trap982217",
              "%location":{},
              "%tag":"trap982217"
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
                  "groupe11OUT":"groupe11OUT",
                  "apply":function (){
                    return ((() => {
                      const groupe11OUT = this["groupe11OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"groupe11OUT",
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
                    gcs.informSelecteurOnMenuChange(255," groupe11", true);
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
      	              "countapply":function (){return 8;}
      	          },
      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
      	        ),


      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "groupe11OUT":"groupe11OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const groupe11OUT = this["groupe11OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"groupe11OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe11", false); }
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
      		          "trap982217":"trap982217",
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
                DAW.cleanQueues();
                gcs.cleanChoiceList(255);
              }
            }
          ),

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
