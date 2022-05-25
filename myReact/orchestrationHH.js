var loopFM8, tick, loopBiopoly, loopCapa, loopMassiveX, groupe13, groupe14, groupe15, groupe16, groupe17, groupe6, groupe11, groupe6IN, groupe5, groupe7, groupe8, groupe9, groupe10;



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
          "countapply":function (){ return 4;}
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
          "countapply":function (){ return 4;}
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
          "countapply":function (){ return 4;}
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
          "countapply":function (){ return 4;}
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
          "countapply":function (){ return 4;}
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
          "countapply":function (){ return 4;}
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
          "countapply":function (){ return 4;}
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
          "countapply":function (){ return 4;}
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
        gcs.setTimerDivision(1);
      }
    }
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
        '192.168.1.34');
        }
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
        "apply":function () {console.log('Intro');}
      }
    ),

      hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            var msg = {
              type: 'alertInfoScoreON',
              value:'Intro'
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
            DAW.putPatternInQueue('AR5');
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

          hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },


          hh.TRAP(
            {
              "trap838163":"trap838163",
              "%location":{},
              "%tag":"trap838163"
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
                  "groupe17OUT":"groupe17OUT",
                  "apply":function (){
                    return ((() => {
                      const groupe17OUT = this["groupe17OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"groupe17OUT",
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
                    gcs.informSelecteurOnMenuChange(255," groupe17", true);
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
      	              "countapply":function (){return 20;}
      	          },
      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
      	        ),


      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "groupe17OUT":"groupe17OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const groupe17OUT = this["groupe17OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"groupe17OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe17", false); }
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
      		          "trap838163":"trap838163",
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

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.cleanQueue(17);
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
        "apply":function () {console.log('Percu et Drone ');}
      }
    ),

      hh.ATOM(
          {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            var msg = {
              type: 'alertInfoScoreON',
              value:'Percu et Drone '
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
            DAW.putPatternInQueue('Swamp');
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
              "trap552607":"trap552607",
              "%location":{},
              "%tag":"trap552607"
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
      	              "countapply":function (){return 90;}
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
      		          "trap552607":"trap552607",
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
                const tick=this["tick"];
                return tick.now;
              })());
            },
            "countapply":function (){ return 20;}
          },
          hh.SIGACCESS({
            "signame":"tick",
            "pre":false,
            "val":false,
            "cnt":false
          })
        ),

            hh.TRAP(
              {
                "trap685948":"trap685948",
                "%location":{},
                "%tag":"trap685948"
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
                    "groupe16OUT":"groupe16OUT",
                    "apply":function (){
                      return ((() => {
                        const groupe16OUT = this["groupe16OUT"];
                        return [true, 255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame":"groupe16OUT",
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
                      gcs.informSelecteurOnMenuChange(255," groupe16", true);
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
        	            "groupe16OUT":"groupe16OUT",
        	            "apply":function (){
        	              return ((() => {
        	                const groupe16OUT = this["groupe16OUT"];
        	                return [false, 255];
        	              })());
        	            }
        	          },
        	          hh.SIGACCESS({
        	            "signame":"groupe16OUT",
        	            "pre":true,
        	            "val":true,
        	            "cnt":false
        	          })
        	        ), // Fin emit
        		    hh.ATOM(
        		      {
        		      "%location":{},
        		      "%tag":"node",
        		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe16", false); }
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
        		          "trap685948":"trap685948",
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
              DAW.cleanQueue(16);
            }
          }
        ),

    ),
    // Séquence Indienne

        hh.SEQUENCE(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
              "%tag":"seq"
            },


    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {console.log('Ensemble Indien');}
      }
    ),

          hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },


          hh.TRAP(
            {
              "trap969947":"trap969947",
              "%location":{},
              "%tag":"trap969947"
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
      	              "countapply":function (){return 24;}
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
      		          "trap969947":"trap969947",
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
                var msg = {
                  type: 'alertInfoScoreON',
                  value:'Ensemble Indien'
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
                const groupe6IN=this["groupe6IN"];
                return groupe6IN.now;
              })());
            },
            "countapply":function (){ return 1;}
          },
          hh.SIGACCESS({
            "signame":"groupe6IN",
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
                  value:'Tabla'
                }
                serveur.broadcast(JSON.stringify(msg));
                }
              }
          ),

            hh.TRAP(
              {
                "trap730059":"trap730059",
                "%location":{},
                "%tag":"trap730059"
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
        	              "countapply":function (){return 12;}
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
        		          "trap730059":"trap730059",
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
                const groupe6IN=this["groupe6IN"];
                return groupe6IN.now;
              })());
            },
            "countapply":function (){ return 1;}
          },
          hh.SIGACCESS({
            "signame":"groupe6IN",
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
                  value:'Dhol'
                }
                serveur.broadcast(JSON.stringify(msg));
                }
              }
          ),

            hh.TRAP(
              {
                "trap617592":"trap617592",
                "%location":{},
                "%tag":"trap617592"
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
        	              "countapply":function (){return 12;}
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
        		          "trap617592":"trap617592",
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
                var msg = {
                  type: 'alertInfoScoreON',
                  value:'Dholak et Pachawaj'
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
                DAW.putPatternInQueue('PolarWind');
              }
            }
          ),

            hh.TRAP(
              {
                "trap478134":"trap478134",
                "%location":{},
                "%tag":"trap478134"
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
        	              "countapply":function (){return 24;}
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
        		          "trap478134":"trap478134",
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
                "trap618520":"trap618520",
                "%location":{},
                "%tag":"trap618520"
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
        	              "countapply":function (){return 24;}
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
        		          "trap618520":"trap618520",
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

        ),

      ),

    ),
    // Séquence techno

        hh.SEQUENCE(
            {
              "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
              "%tag":"seq"
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
              var msg = {
                type: 'alertInfoScoreON',
                value:'Techno 1'
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
              DAW.putPatternInQueue('AR3');
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
          "apply":function () {console.log('Techno');}
        }
      ),

      hh.RUN({
        "%location":{},
        "%tag":"run",
        "module": hh.getModule(  "loopBiopoly", {}),
        "tick":"",

      }),

            hh.IF(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":239},
                "%tag":"if",
                "apply":function (){
                  return(Math.floor(Math.random() * Math.floor(2)) + 1) === 1;
                },
              },
              hh.SEQUENCE({"%location":{"filename":"hiphop_blocks.js","pos":245},"%tag":"sequence"},

        hh.RUN({
          "%location":{},
          "%tag":"run",
          "module": hh.getModule(  "loopMassiveX", {}),
          "tick":"",

        }),

              ),
              hh.SEQUENCE({"%location":{"filename":"hiphop_blocks.js","pos":248},"%tag":"sequence"},

        hh.RUN({
          "%location":{},
          "%tag":"run",
          "module": hh.getModule(  "loopCapa", {}),
          "tick":"",

        }),

              )
            ),

      ),

          hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },


        hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              var msg = {
                type: 'alertInfoScoreON',
                value:'Techno 2'
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
              DAW.putPatternInQueue('AR4');
            }
          }
        ),

      hh.RUN({
        "%location":{},
        "%tag":"run",
        "module": hh.getModule(  "loopMassiveX", {}),
        "tick":"",

      }),

            hh.IF(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":239},
                "%tag":"if",
                "apply":function (){
                  return(Math.floor(Math.random() * Math.floor(2)) + 1) === 1;
                },
              },
              hh.SEQUENCE({"%location":{"filename":"hiphop_blocks.js","pos":245},"%tag":"sequence"},

        hh.RUN({
          "%location":{},
          "%tag":"run",
          "module": hh.getModule(  "loopFM8", {}),
          "tick":"",

        }),

              ),
              hh.SEQUENCE({"%location":{"filename":"hiphop_blocks.js","pos":248},"%tag":"sequence"},

        hh.RUN({
          "%location":{},
          "%tag":"run",
          "module": hh.getModule(  "loopCapa", {}),
          "tick":"",

        }),

              )
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
              var msg = {
                type: 'alertInfoScoreON',
                value:'Techno 3'
              }
              serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),

      hh.RUN({
        "%location":{},
        "%tag":"run",
        "module": hh.getModule(  "loopBiopoly", {}),
        "tick":"",

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
          "countapply":function (){ return 24;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        }),

            hh.TRAP(
              {
                "trap244262":"trap244262",
                "%location":{},
                "%tag":"trap244262"
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
                    "groupe13OUT":"groupe13OUT",
                    "apply":function (){
                      return ((() => {
                        const groupe13OUT = this["groupe13OUT"];
                        return [true, 255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame":"groupe13OUT",
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
                      gcs.informSelecteurOnMenuChange(255," groupe13", true);
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
        	              "countapply":function (){return 12;}
        	          },
        	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
        	        ),


        	        hh.EMIT(
        	          {
        	            "%location":{},
        	            "%tag":"emit",
        	            "groupe13OUT":"groupe13OUT",
        	            "apply":function (){
        	              return ((() => {
        	                const groupe13OUT = this["groupe13OUT"];
        	                return [false, 255];
        	              })());
        	            }
        	          },
        	          hh.SIGACCESS({
        	            "signame":"groupe13OUT",
        	            "pre":true,
        	            "val":true,
        	            "cnt":false
        	          })
        	        ), // Fin emit
        		    hh.ATOM(
        		      {
        		      "%location":{},
        		      "%tag":"node",
        		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupe13", false); }
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
        		          "trap244262":"trap244262",
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

          hh.ATOM(
            {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                DAW.cleanQueue(13);
              }
            }
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
              value:'Percu drone Gamelan'
            }
            serveur.broadcast(JSON.stringify(msg));
            }
          }
      ),

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {console.log('Percu Drone Gamelan');}
      }
    ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('AR4');
          }
        }
      ),

        hh.TRAP(
          {
            "trap531316":"trap531316",
            "%location":{},
            "%tag":"trap531316"
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
    	              "countapply":function (){return 32;}
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
    		          "trap531316":"trap531316",
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
            "trap22518":"trap22518",
            "%location":{},
            "%tag":"trap22518"
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
    	              "countapply":function (){return 32;}
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
    		          "trap22518":"trap22518",
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

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.cleanQueue(11);
            }
          }
        ),

    ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {console.log('Hiver 2022 fin');}
    }
  ),

    hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          var msg = {
            type: 'alertInfoScoreON',
            value:'Hiver 2022 fin'
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
