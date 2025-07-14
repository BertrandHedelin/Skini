var tick, Canon5, Canon6, Canon7, Canon8, Canon9, Canon14;



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
            value:'Suite de canons'
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
          var msg = {
            type: 'alertInfoScoreOFF',
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ),

      hh.TRAP(
        {
          "trap931230":"trap931230",
          "%location":{},
          "%tag":"trap931230"
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
              "Canon5OUT":"Canon5OUT",
              "apply":function (){
                return ((() => {
                  const Canon5OUT = this["Canon5OUT"];
                  return [true, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Canon5OUT",
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
                gcs.informSelecteurOnMenuChange(255," Canon5", true);
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
  	            "Canon5OUT":"Canon5OUT",
  	            "apply":function (){
  	              return ((() => {
  	                const Canon5OUT = this["Canon5OUT"];
  	                return [false, 255];
  	              })());
  	            }
  	          },
  	          hh.SIGACCESS({
  	            "signame":"Canon5OUT",
  	            "pre":true,
  	            "val":true,
  	            "cnt":false
  	          })
  	        ), // Fin emit
  		    hh.ATOM(
  		      {
  		      "%location":{},
  		      "%tag":"node",
  		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Canon5", false); }
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
  		          "trap931230":"trap931230",
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

      hh.TRAP(
        {
          "trap22391":"trap22391",
          "%location":{},
          "%tag":"trap22391"
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
              "Canon6OUT":"Canon6OUT",
              "apply":function (){
                return ((() => {
                  const Canon6OUT = this["Canon6OUT"];
                  return [true, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Canon6OUT",
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
                gcs.informSelecteurOnMenuChange(255," Canon6", true);
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
  	            "Canon6OUT":"Canon6OUT",
  	            "apply":function (){
  	              return ((() => {
  	                const Canon6OUT = this["Canon6OUT"];
  	                return [false, 255];
  	              })());
  	            }
  	          },
  	          hh.SIGACCESS({
  	            "signame":"Canon6OUT",
  	            "pre":true,
  	            "val":true,
  	            "cnt":false
  	          })
  	        ), // Fin emit
  		    hh.ATOM(
  		      {
  		      "%location":{},
  		      "%tag":"node",
  		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Canon6", false); }
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
  		          "trap22391":"trap22391",
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

      hh.TRAP(
        {
          "trap289380":"trap289380",
          "%location":{},
          "%tag":"trap289380"
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
              "Canon7OUT":"Canon7OUT",
              "apply":function (){
                return ((() => {
                  const Canon7OUT = this["Canon7OUT"];
                  return [true, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Canon7OUT",
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
                gcs.informSelecteurOnMenuChange(255," Canon7", true);
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
  	            "Canon7OUT":"Canon7OUT",
  	            "apply":function (){
  	              return ((() => {
  	                const Canon7OUT = this["Canon7OUT"];
  	                return [false, 255];
  	              })());
  	            }
  	          },
  	          hh.SIGACCESS({
  	            "signame":"Canon7OUT",
  	            "pre":true,
  	            "val":true,
  	            "cnt":false
  	          })
  	        ), // Fin emit
  		    hh.ATOM(
  		      {
  		      "%location":{},
  		      "%tag":"node",
  		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Canon7", false); }
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
  		          "trap289380":"trap289380",
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

      hh.TRAP(
        {
          "trap575476":"trap575476",
          "%location":{},
          "%tag":"trap575476"
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
              "Canon8OUT":"Canon8OUT",
              "apply":function (){
                return ((() => {
                  const Canon8OUT = this["Canon8OUT"];
                  return [true, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Canon8OUT",
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
                gcs.informSelecteurOnMenuChange(255," Canon8", true);
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
  	            "Canon8OUT":"Canon8OUT",
  	            "apply":function (){
  	              return ((() => {
  	                const Canon8OUT = this["Canon8OUT"];
  	                return [false, 255];
  	              })());
  	            }
  	          },
  	          hh.SIGACCESS({
  	            "signame":"Canon8OUT",
  	            "pre":true,
  	            "val":true,
  	            "cnt":false
  	          })
  	        ), // Fin emit
  		    hh.ATOM(
  		      {
  		      "%location":{},
  		      "%tag":"node",
  		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Canon8", false); }
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
  		          "trap575476":"trap575476",
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

      hh.TRAP(
        {
          "trap320277":"trap320277",
          "%location":{},
          "%tag":"trap320277"
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
              "Canon9OUT":"Canon9OUT",
              "apply":function (){
                return ((() => {
                  const Canon9OUT = this["Canon9OUT"];
                  return [true, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Canon9OUT",
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
                gcs.informSelecteurOnMenuChange(255," Canon9", true);
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
  	            "Canon9OUT":"Canon9OUT",
  	            "apply":function (){
  	              return ((() => {
  	                const Canon9OUT = this["Canon9OUT"];
  	                return [false, 255];
  	              })());
  	            }
  	          },
  	          hh.SIGACCESS({
  	            "signame":"Canon9OUT",
  	            "pre":true,
  	            "val":true,
  	            "cnt":false
  	          })
  	        ), // Fin emit
  		    hh.ATOM(
  		      {
  		      "%location":{},
  		      "%tag":"node",
  		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Canon9", false); }
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
  		          "trap320277":"trap320277",
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

      hh.TRAP(
        {
          "trap500819":"trap500819",
          "%location":{},
          "%tag":"trap500819"
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
              "Canon14OUT":"Canon14OUT",
              "apply":function (){
                return ((() => {
                  const Canon14OUT = this["Canon14OUT"];
                  return [true, 255];
                })());
              }
            },
            hh.SIGACCESS({
              "signame":"Canon14OUT",
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
                gcs.informSelecteurOnMenuChange(255," Canon14", true);
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
  	            "Canon14OUT":"Canon14OUT",
  	            "apply":function (){
  	              return ((() => {
  	                const Canon14OUT = this["Canon14OUT"];
  	                return [false, 255];
  	              })());
  	            }
  	          },
  	          hh.SIGACCESS({
  	            "signame":"Canon14OUT",
  	            "pre":true,
  	            "val":true,
  	            "cnt":false
  	          })
  	        ), // Fin emit
  		    hh.ATOM(
  		      {
  		      "%location":{},
  		      "%tag":"node",
  		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Canon14", false); }
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
  		          "trap500819":"trap500819",
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
