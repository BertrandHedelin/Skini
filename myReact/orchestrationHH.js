var FM8, Massive, MassiveX1, MassiveX2, Prism, Evolve, Razor, tick;



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

// Création des signaux IN de sélection de patterns
for (var i=0; i < par.groupesDesSons.length; i++) {
  var signalName = par.groupesDesSons[i][0] + "IN";

  if(debug) console.log("Signal Orchestration:", signalName);

  var signal = hh.SIGNAL({
    "%location":{},
    "direction":"IN",
    "name":signalName
  });
  signals.push(signal);
}

function setSignals(){
  var machine = new hh.ReactiveMachine( orchestration, {sweep:true, tracePropagation: false, traceReactDuration: false});
  console.log("Number of nets in Orchestration:",machine.nets.length);
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
      "apply":function () {console.log('Mystique Electro');}
    }
  ),

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
        CCChannel= 1;
        CCTempo  = 100;
        tempoMax = 160;
        tempoMin = 40;
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
            "trap104105":"trap104105",
            "%location":{},
            "%tag":"trap104105"
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
                  "MassiveOUT":"MassiveOUT",
                  "apply":function (){
                    return ((() => {
                      const MassiveOUT = this["MassiveOUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"MassiveOUT",
                  "pre":true,
                  "val":true,
                  "cnt":false
                })
              ), // Fin emit
            hh.ATOM(
              {
              "%location":{},
              "%tag":"node",
              "apply":function () { gcs.informSelecteurOnMenuChange(255," Massive", true); }
              }
          ),

              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  "PrismOUT":"PrismOUT",
                  "apply":function (){
                    return ((() => {
                      const PrismOUT = this["PrismOUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"PrismOUT",
                  "pre":true,
                  "val":true,
                  "cnt":false
                })
              ), // Fin emit
            hh.ATOM(
              {
              "%location":{},
              "%tag":"node",
              "apply":function () { gcs.informSelecteurOnMenuChange(255," Prism", true); }
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
                    "countapply":function (){return 10;}
                },
                hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
              ),


              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  "MassiveOUT":"MassiveOUT",
                  "apply":function (){
                    return ((() => {
                      const MassiveOUT = this["MassiveOUT"];
                      return [false, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"MassiveOUT",
                  "pre":true,
                  "val":true,
                  "cnt":false
                })
              ), // Fin emit
            hh.ATOM(
              {
              "%location":{},
              "%tag":"node",
              "apply":function () { gcs.informSelecteurOnMenuChange(255," Massive", false); }
              }
          ),

              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  "PrismOUT":"PrismOUT",
                  "apply":function (){
                    return ((() => {
                      const PrismOUT = this["PrismOUT"];
                      return [false, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"PrismOUT",
                  "pre":true,
                  "val":true,
                  "cnt":false
                })
              ), // Fin emit
            hh.ATOM(
              {
              "%location":{},
              "%tag":"node",
              "apply":function () { gcs.informSelecteurOnMenuChange(255," Prism", false); }
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
                  "trap104105":"trap104105",
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
                "%location":{"filename":"hiphop_blocks.js","pos":189},
                "%tag":"await",
                "immediate":false,
                "apply":function (){
                  return ((() => {
                    const INTERFACEZ_RC = this["INTERFACEZ_RC"];
                    //console.log("*****", 0, 20,50, INTERFACEZ_RC.nowval );
                    if( INTERFACEZ_RC.nowval !== undefined ) {
                      return INTERFACEZ_RC.now && ( INTERFACEZ_RC.nowval[0] === 0
                        && INTERFACEZ_RC.nowval[1] >20
                        && INTERFACEZ_RC.nowval[1] <50);
                    }
                  })());
                },
                "countapply":function (){ return 2;}
              },
              hh.SIGACCESS(
                {"signame":"INTERFACEZ_RC",
                "pre":false,
                "val":false,
                "cnt":false
              })
            ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {console.log('Interface Z ***** dans HH');}
        }
      ),

      ),


    hh.ABORT(
      {
        "%location":{"filename":"hiphop_blocks.js","pos":189},
        "%tag":"do/every",
        "immediate":false,
        "apply": function (){return ((() => {
            const INTERFACEZ_RC = this["INTERFACEZ_RC"];
            if( INTERFACEZ_RC.nowval !== undefined ) {
              return INTERFACEZ_RC.now && ( INTERFACEZ_RC.nowval[0] === 0
                && INTERFACEZ_RC.nowval[1] >20
                && INTERFACEZ_RC.nowval[1] <50);
            }
        })());},
        "countapply":function (){ return 5;}
      },
      hh.SIGACCESS({
        "signame":"INTERFACEZ_RC",
        "pre":false,
        "val":false,
        "cnt":false
      }),


      hh.EVERY(
        {
          "%location":{"filename":"hiphop_blocks.js","pos":189},
          "%tag":"do/every",
          "immediate":false,
          "apply": function (){return ((() => {
              const INTERFACEZ_RC = this["INTERFACEZ_RC"];
              if( INTERFACEZ_RC.nowval !== undefined ) {
                return INTERFACEZ_RC.now && ( INTERFACEZ_RC.nowval[0] === 2
                  && INTERFACEZ_RC.nowval[1] >0
                  && INTERFACEZ_RC.nowval[1] <40);
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
            "apply":function () {console.log('Interface Z dans HH');}
          }
        ),

      ),

    ),

    ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        setTempo(120);
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
            "trap504044":"trap504044",
            "%location":{},
            "%tag":"trap504044"
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
                "EvolveOUT":"EvolveOUT",
                "apply":function (){
                  return ((() => {
                    const EvolveOUT = this["EvolveOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"EvolveOUT",
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
                  gcs.informSelecteurOnMenuChange(255," Evolve", true);
                }
    		      }
    		 	  ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "RazorOUT":"RazorOUT",
                "apply":function (){
                  return ((() => {
                    const RazorOUT = this["RazorOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"RazorOUT",
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
                  gcs.informSelecteurOnMenuChange(255," Razor", true);
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
    	              "countapply":function (){return 10;}
    	          },
    	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
    	        ),


    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "EvolveOUT":"EvolveOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const EvolveOUT = this["EvolveOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"EvolveOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Evolve", false); }
    		      }
    		 	),

    	        hh.EMIT(
    	          {
    	            "%location":{},
    	            "%tag":"emit",
    	            "RazorOUT":"RazorOUT",
    	            "apply":function (){
    	              return ((() => {
    	                const RazorOUT = this["RazorOUT"];
    	                return [false, 255];
    	              })());
    	            }
    	          },
    	          hh.SIGACCESS({
    	            "signame":"RazorOUT",
    	            "pre":true,
    	            "val":true,
    	            "cnt":false
    	          })
    	        ), // Fin emit
    		    hh.ATOM(
    		      {
    		      "%location":{},
    		      "%tag":"node",
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Razor", false); }
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
    		          "trap504044":"trap504044",
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
          "countapply":function (){ return 5;}
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
              "trap191243":"trap191243",
              "%location":{},
              "%tag":"trap191243"
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
                    "MassiveX1OUT":"MassiveX1OUT",
                    "apply":function (){
                      return ((() => {
                        const MassiveX1OUT = this["MassiveX1OUT"];
                        return [true, 255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame":"MassiveX1OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ), // Fin emit
              hh.ATOM(
                {
                "%location":{},
                "%tag":"node",
                "apply":function () { gcs.informSelecteurOnMenuChange(255," MassiveX1", true); }
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
                      "countapply":function (){return 10;}
                  },
                  hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
                ),


                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "MassiveX1OUT":"MassiveX1OUT",
                    "apply":function (){
                      return ((() => {
                        const MassiveX1OUT = this["MassiveX1OUT"];
                        return [false, 255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame":"MassiveX1OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ), // Fin emit
              hh.ATOM(
                {
                "%location":{},
                "%tag":"node",
                "apply":function () { gcs.informSelecteurOnMenuChange(255," MassiveX1", false); }
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
                    "trap191243":"trap191243",
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
              "trap65198":"trap65198",
              "%location":{},
              "%tag":"trap65198"
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
                    "MassiveX2OUT":"MassiveX2OUT",
                    "apply":function (){
                      return ((() => {
                        const MassiveX2OUT = this["MassiveX2OUT"];
                        return [true, 255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame":"MassiveX2OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ), // Fin emit
              hh.ATOM(
                {
                "%location":{},
                "%tag":"node",
                "apply":function () { gcs.informSelecteurOnMenuChange(255," MassiveX2", true); }
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
                      "countapply":function (){return 10;}
                  },
                  hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
                ),


                hh.EMIT(
                  {
                    "%location":{},
                    "%tag":"emit",
                    "MassiveX2OUT":"MassiveX2OUT",
                    "apply":function (){
                      return ((() => {
                        const MassiveX2OUT = this["MassiveX2OUT"];
                        return [false, 255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame":"MassiveX2OUT",
                    "pre":true,
                    "val":true,
                    "cnt":false
                  })
                ), // Fin emit
              hh.ATOM(
                {
                "%location":{},
                "%tag":"node",
                "apply":function () { gcs.informSelecteurOnMenuChange(255," MassiveX2", false); }
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
                    "trap65198":"trap65198",
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
        setTempo(90);
      }
    }
  ),

      hh.TRAP(
        {
          "trap658459":"trap658459",
          "%location":{},
          "%tag":"trap658459"
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
                "PrismOUT":"PrismOUT",
                "apply":function (){
                  return ((() => {
                    const PrismOUT = this["PrismOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PrismOUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
            ), // Fin emit
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255," Prism", true); }
            }
        ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "MassiveOUT":"MassiveOUT",
                "apply":function (){
                  return ((() => {
                    const MassiveOUT = this["MassiveOUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"MassiveOUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
            ), // Fin emit
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255," Massive", true); }
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
                  "countapply":function (){return 10;}
              },
              hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
            ),


            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "PrismOUT":"PrismOUT",
                "apply":function (){
                  return ((() => {
                    const PrismOUT = this["PrismOUT"];
                    return [false, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"PrismOUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
            ), // Fin emit
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255," Prism", false); }
            }
        ),

            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "MassiveOUT":"MassiveOUT",
                "apply":function (){
                  return ((() => {
                    const MassiveOUT = this["MassiveOUT"];
                    return [false, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"MassiveOUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
            ), // Fin emit
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255," Massive", false); }
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
                "trap658459":"trap658459",
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
      "apply":function () {console.log('Fin Mystique Electro');}
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
