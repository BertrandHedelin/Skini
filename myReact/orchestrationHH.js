var FM8, Massive, MassiveX1, MassiveX2, Prism, tick, Evolve, Razor;



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

function setServ(ser, daw, groupeCS, oscMidi){
  //console.log("hh_ORCHESTRATION: setServ");
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

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        setTempo(110);
      }
    }
  ),

      hh.TRAP(
        {
          "trap689616":"trap689616",
          "%location":{},
          "%tag":"trap689616"
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
                  "countapply":function (){return 5;}
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

            hh.PAUSE(
              {
                "%location":{},
                "%tag":"yield"
              }
            ),
            hh.EXIT(
              {
                "trap689616":"trap689616",
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
        setTempo(120);
      }
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

        hh.FORK(
            {
              "%location":{},
              "%tag":"fork"
            },


        hh.TRAP(
          {
            "trap285442":"trap285442",
            "%location":{},
            "%tag":"trap285442"
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
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Evolve", true); }
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
    		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Razor", true); }
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
    	              "countapply":function (){return 3;}
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
    		          "trap285442":"trap285442",
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
              "trap186685":"trap186685",
              "%location":{},
              "%tag":"trap186685"
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
                      "countapply":function (){return 3;}
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
                    "trap186685":"trap186685",
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
              "trap679961":"trap679961",
              "%location":{},
              "%tag":"trap679961"
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
                      "countapply":function (){return 3;}
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
                    "trap679961":"trap679961",
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
        setTempo(90);
      }
    }
  ),

      hh.TRAP(
        {
          "trap338968":"trap338968",
          "%location":{},
          "%tag":"trap338968"
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
                "FM8OUT":"FM8OUT",
                "apply":function (){
                  return ((() => {
                    const FM8OUT = this["FM8OUT"];
                    return [true, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FM8OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
            ), // Fin emit
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255," FM8", true); }
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
                  "countapply":function (){return 3;}
              },
              hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
            ),


            hh.EMIT(
              {
                "%location":{},
                "%tag":"emit",
                "FM8OUT":"FM8OUT",
                "apply":function (){
                  return ((() => {
                    const FM8OUT = this["FM8OUT"];
                    return [false, 255];
                  })());
                }
              },
              hh.SIGACCESS({
                "signame":"FM8OUT",
                "pre":true,
                "val":true,
                "cnt":false
              })
            ), // Fin emit
          hh.ATOM(
            {
            "%location":{},
            "%tag":"node",
            "apply":function () { gcs.informSelecteurOnMenuChange(255," FM8", false); }
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
                "trap338968":"trap338968",
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
