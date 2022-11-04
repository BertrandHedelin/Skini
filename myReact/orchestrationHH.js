var PercuClic, motif1_1, tick, joueMotif, motif1_2, percuOUT, percu, decaleMotif, motif1_3, stopMoveTempo, KaracabaMod, motif1_4, motif1_5, motif1_6, motif1_7, motif1_8, PharlightG1, cloche1, cloche2, cloche3, cloche4, PharlightG2, Ethereal, PharlightG3, PharlightG4, groupeVoix4, groupeVoix0, groupeVoix5, groupeVoix1, groupeVoix2, groupeVoix3;



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
  console.log("Number of nets in Orchestration:",machine.nets.length);
  return machine;
}
exports.setSignals = setSignals;


  PercuClic = hh.MODULE({"id":"PercuClic","%location":{},"%tag":"module"},

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"tick"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"INOUT",
        "name":"percuOUT"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"INOUT",
        "name":"stopMoveTempo"
      }),


          hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
              },


          hh.TRAP(
            {
              "trap365953":"trap365953",
              "%location":{},
              "%tag":"trap365953"
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
                  "percuOUT":"percuOUT",
                  "apply":function (){
                    return ((() => {
                      const percuOUT = this["percuOUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"percuOUT",
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
                    gcs.informSelecteurOnMenuChange(255," percu", true);
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
      	              "countapply":function (){return 80;}
      	          },
      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
      	        ),


      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "percuOUT":"percuOUT",
      	            "apply":function (){
      	              return ((() => {
      	                const percuOUT = this["percuOUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"percuOUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," percu", false); }
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
      		          "trap365953":"trap365953",
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


      hh.ABORT(
        {
          "%location":{abort: tick},
          "%tag":"abort",
          "immediate":false,
          "apply": function (){return ((() => {
              const tick=this["tick"];
              return tick.now;
          })());},
          "countapply":function (){ return 100;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        }),

        hh.ABORT(
          {
            "%location":{abort:stopMoveTempo},
            "%tag":"abort",
            "immediate":false,
            "apply": function (){return ((() => {
                const stopMoveTempo =this["stopMoveTempo"];
                return stopMoveTempo.now;
            })());},
          },
          hh.SIGACCESS({
            "signame":"stopMoveTempo",
            "pre":false,
            "val":false,
            "cnt":false
          }),
          hh.EVERY(
            {
              "%location":{every: tick},
              "%tag":"do/every",
              "immediate":false,
              "apply": function (){return ((() => {
                  const tick=this["tick"];
                  return tick.now;
              })());},
              "countapply":function (){ return  1;}
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
                  moveTempo(2, 20);
                }
              }
            )
          )
        ),


      ),

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

  );

  joueMotif = hh.MODULE({"id":"joueMotif","%location":{},"%tag":"module"},

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"tick"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"motif1_1"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"motif1_2"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"motif1_3"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"motif1_4"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"motif1_5"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"motif1_6"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"motif1_7"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"motif1_8"
      }),


        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "motif1_1":"motif1_1",
            "apply":function (){
              return ((() => {
                //const motif1_1=this["motif1_1"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"motif1_1",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "motif1_2":"motif1_2",
            "apply":function (){
              return ((() => {
                //const motif1_2=this["motif1_2"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"motif1_2",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "motif1_3":"motif1_3",
            "apply":function (){
              return ((() => {
                //const motif1_3=this["motif1_3"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"motif1_3",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "motif1_4":"motif1_4",
            "apply":function (){
              return ((() => {
                //const motif1_4=this["motif1_4"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"motif1_4",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "motif1_5":"motif1_5",
            "apply":function (){
              return ((() => {
                //const motif1_5=this["motif1_5"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"motif1_5",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "motif1_6":"motif1_6",
            "apply":function (){
              return ((() => {
                //const motif1_6=this["motif1_6"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"motif1_6",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "motif1_7":"motif1_7",
            "apply":function (){
              return ((() => {
                //const motif1_7=this["motif1_7"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"motif1_7",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "motif1_8":"motif1_8",
            "apply":function (){
              return ((() => {
                //const motif1_8=this["motif1_8"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"motif1_8",
            "pre":true,
            "val":true,
            "cnt":false
          })
        ),

  );

  decaleMotif = hh.MODULE({"id":"decaleMotif","%location":{},"%tag":"module"},

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"tick"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"motif1_1"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"motif1_2"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"motif1_3"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"motif1_4"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"motif1_5"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"motif1_6"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"motif1_7"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"motif1_8"
      }),


        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "motif1_1":"motif1_1",
            "apply":function (){
              return ((() => {
                //const motif1_1=this["motif1_1"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"motif1_1",
            "pre":true,
            "val":true,
            "cnt":false
          })
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
          "countapply":function (){ return decalage;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "motif1_2":"motif1_2",
            "apply":function (){
              return ((() => {
                //const motif1_2=this["motif1_2"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"motif1_2",
            "pre":true,
            "val":true,
            "cnt":false
          })
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
          "countapply":function (){ return decalage;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "motif1_3":"motif1_3",
            "apply":function (){
              return ((() => {
                //const motif1_3=this["motif1_3"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"motif1_3",
            "pre":true,
            "val":true,
            "cnt":false
          })
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
          "countapply":function (){ return decalage;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "motif1_4":"motif1_4",
            "apply":function (){
              return ((() => {
                //const motif1_4=this["motif1_4"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"motif1_4",
            "pre":true,
            "val":true,
            "cnt":false
          })
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
          "countapply":function (){ return decalage;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "motif1_5":"motif1_5",
            "apply":function (){
              return ((() => {
                //const motif1_5=this["motif1_5"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"motif1_5",
            "pre":true,
            "val":true,
            "cnt":false
          })
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
          "countapply":function (){ return decalage;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "motif1_6":"motif1_6",
            "apply":function (){
              return ((() => {
                //const motif1_6=this["motif1_6"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"motif1_6",
            "pre":true,
            "val":true,
            "cnt":false
          })
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
          "countapply":function (){ return decalage;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "motif1_7":"motif1_7",
            "apply":function (){
              return ((() => {
                //const motif1_7=this["motif1_7"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"motif1_7",
            "pre":true,
            "val":true,
            "cnt":false
          })
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
          "countapply":function (){ return decalage;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

        hh.EMIT(
          {
            "%location":{},
            "%tag":"emit",
            "motif1_8":"motif1_8",
            "apply":function (){
              return ((() => {
                //const motif1_8=this["motif1_8"];
                return 0;
              })());
            }
          },
          hh.SIGACCESS({
            "signame":"motif1_8",
            "pre":true,
            "val":true,
            "cnt":false
          })
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
          "countapply":function (){ return decalage;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

    hh.PAUSE(
      {
        "%location":{},
        "%tag":"yield"
      }
    ),

  );

  KaracabaMod = hh.MODULE({"id":"KaracabaMod","%location":{},"%tag":"module"},


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
              DAW.putPatternInQueue('Karcaba1');
            }
          }
        ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.putPatternInQueue('Karcaba2');
            }
          }
        ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.putPatternInQueue('Karcaba3');
            }
          }
        ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.putPatternInQueue('Karcaba4');
            }
          }
        ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.putPatternInQueue('Karcaba5');
            }
          }
        ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.putPatternInQueue('Karcaba6');
            }
          }
        ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.putPatternInQueue('Karcaba7');
            }
          }
        ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.putPatternInQueue('Karcaba8');
            }
          }
        ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.putPatternInQueue('Karcaba9');
            }
          }
        ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.putPatternInQueue('Karcaba10');
            }
          }
        ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.putPatternInQueue('Karcaba11');
            }
          }
        ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.putPatternInQueue('Karcaba12');
            }
          }
        ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.putPatternInQueue('Karcaba13');
            }
          }
        ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.putPatternInQueue('Karcaba14');
            }
          }
        ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.putPatternInQueue('Karcaba15');
            }
          }
        ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.putPatternInQueue('Karcaba16');
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
    hh.SIGNAL({"%location":{},"direction":"INOUT","name":"stopReservoir"}),
    hh.SIGNAL({"%location":{},"direction":"INOUT","name":"stopMoveTempo"}),


    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"motif1_1"
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"motif1_2"
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"motif1_3"
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"motif1_4"
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"motif1_5"
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"motif1_6"
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"motif1_7"
    }),

    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"motif1_8"
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
        "apply":function () {
          var msg = {
            type: 'alertInfoScoreON',
            value:'Espace 2'
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
        gcs.setTimerDivision(1);
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
        "apply":function () {
          setTempo(70);
        }
      }
    ),

          hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
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
                  value:'Pharlight'
                }
                serveur.broadcast(JSON.stringify(msg));
                }
              }
          ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {console.log('--- Pharlight');}
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

          hh.TRAP(
            {
              "trap311370":"trap311370",
              "%location":{},
              "%tag":"trap311370"
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
                  "PharlightG1OUT":"PharlightG1OUT",
                  "apply":function (){
                    return ((() => {
                      const PharlightG1OUT = this["PharlightG1OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"PharlightG1OUT",
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
                    gcs.informSelecteurOnMenuChange(255," PharlightG1", true);
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
      	            "PharlightG1OUT":"PharlightG1OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const PharlightG1OUT = this["PharlightG1OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"PharlightG1OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," PharlightG1", false); }
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
      		          "trap311370":"trap311370",
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
            "countapply":function (){ return 4;}
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
                "trap540645":"trap540645",
                "%location":{},
                "%tag":"trap540645"
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
                    "PharlightG2OUT":"PharlightG2OUT",
                    "apply":function (){
                      return ((() => {
                        const PharlightG2OUT = this["PharlightG2OUT"];
                        return [true, 255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame":"PharlightG2OUT",
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
                      gcs.informSelecteurOnMenuChange(255," PharlightG2", true);
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
        	              "countapply":function (){return 36;}
        	          },
        	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
        	        ),


        	        hh.EMIT(
        	          {
        	            "%location":{},
        	            "%tag":"emit",
        	            "PharlightG2OUT":"PharlightG2OUT",
        	            "apply":function (){
        	              return ((() => {
        	                const PharlightG2OUT = this["PharlightG2OUT"];
        	                return [false, 255];
        	              })());
        	            }
        	          },
        	          hh.SIGACCESS({
        	            "signame":"PharlightG2OUT",
        	            "pre":true,
        	            "val":true,
        	            "cnt":false
        	          })
        	        ), // Fin emit
        		    hh.ATOM(
        		      {
        		      "%location":{},
        		      "%tag":"node",
        		      "apply":function () { gcs.informSelecteurOnMenuChange(255," PharlightG2", false); }
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
        		          "trap540645":"trap540645",
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
            "countapply":function (){ return 8;}
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
                "trap244961":"trap244961",
                "%location":{},
                "%tag":"trap244961"
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
                    "PharlightG3OUT":"PharlightG3OUT",
                    "apply":function (){
                      return ((() => {
                        const PharlightG3OUT = this["PharlightG3OUT"];
                        return [true, 255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame":"PharlightG3OUT",
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
                      gcs.informSelecteurOnMenuChange(255," PharlightG3", true);
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
        	            "PharlightG3OUT":"PharlightG3OUT",
        	            "apply":function (){
        	              return ((() => {
        	                const PharlightG3OUT = this["PharlightG3OUT"];
        	                return [false, 255];
        	              })());
        	            }
        	          },
        	          hh.SIGACCESS({
        	            "signame":"PharlightG3OUT",
        	            "pre":true,
        	            "val":true,
        	            "cnt":false
        	          })
        	        ), // Fin emit
        		    hh.ATOM(
        		      {
        		      "%location":{},
        		      "%tag":"node",
        		      "apply":function () { gcs.informSelecteurOnMenuChange(255," PharlightG3", false); }
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
        		          "trap244961":"trap244961",
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
            "countapply":function (){ return 12;}
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
                "trap141637":"trap141637",
                "%location":{},
                "%tag":"trap141637"
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
                    "PharlightG4OUT":"PharlightG4OUT",
                    "apply":function (){
                      return ((() => {
                        const PharlightG4OUT = this["PharlightG4OUT"];
                        return [true, 255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame":"PharlightG4OUT",
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
                      gcs.informSelecteurOnMenuChange(255," PharlightG4", true);
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
        	              "countapply":function (){return 28;}
        	          },
        	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
        	        ),


        	        hh.EMIT(
        	          {
        	            "%location":{},
        	            "%tag":"emit",
        	            "PharlightG4OUT":"PharlightG4OUT",
        	            "apply":function (){
        	              return ((() => {
        	                const PharlightG4OUT = this["PharlightG4OUT"];
        	                return [false, 255];
        	              })());
        	            }
        	          },
        	          hh.SIGACCESS({
        	            "signame":"PharlightG4OUT",
        	            "pre":true,
        	            "val":true,
        	            "cnt":false
        	          })
        	        ), // Fin emit
        		    hh.ATOM(
        		      {
        		      "%location":{},
        		      "%tag":"node",
        		      "apply":function () { gcs.informSelecteurOnMenuChange(255," PharlightG4", false); }
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
        		          "trap141637":"trap141637",
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
              DAW.cleanQueues();
              gcs.cleanChoiceList(255);
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
          setTempo(70);
        }
      }
    ),

          hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
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
                  value:' Cloches'
                }
                serveur.broadcast(JSON.stringify(msg));
                }
              }
          ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {console.log('--- Cloches');}
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

          hh.TRAP(
            {
              "trap280935":"trap280935",
              "%location":{},
              "%tag":"trap280935"
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
                  "cloche1OUT":"cloche1OUT",
                  "apply":function (){
                    return ((() => {
                      const cloche1OUT = this["cloche1OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"cloche1OUT",
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
                    gcs.informSelecteurOnMenuChange(255," cloche1", true);
                  }
      		      }
      		 	  ),

              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  "cloche2OUT":"cloche2OUT",
                  "apply":function (){
                    return ((() => {
                      const cloche2OUT = this["cloche2OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"cloche2OUT",
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
                    gcs.informSelecteurOnMenuChange(255," cloche2", true);
                  }
      		      }
      		 	  ),

              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  "cloche3OUT":"cloche3OUT",
                  "apply":function (){
                    return ((() => {
                      const cloche3OUT = this["cloche3OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"cloche3OUT",
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
                    gcs.informSelecteurOnMenuChange(255," cloche3", true);
                  }
      		      }
      		 	  ),

              hh.EMIT(
                {
                  "%location":{},
                  "%tag":"emit",
                  "cloche4OUT":"cloche4OUT",
                  "apply":function (){
                    return ((() => {
                      const cloche4OUT = this["cloche4OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"cloche4OUT",
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
                    gcs.informSelecteurOnMenuChange(255," cloche4", true);
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
      	            "cloche1OUT":"cloche1OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const cloche1OUT = this["cloche1OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"cloche1OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," cloche1", false); }
      		      }
      		 	),

      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "cloche2OUT":"cloche2OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const cloche2OUT = this["cloche2OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"cloche2OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," cloche2", false); }
      		      }
      		 	),

      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "cloche3OUT":"cloche3OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const cloche3OUT = this["cloche3OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"cloche3OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," cloche3", false); }
      		      }
      		 	),

      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "cloche4OUT":"cloche4OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const cloche4OUT = this["cloche4OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"cloche4OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," cloche4", false); }
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
      		          "trap280935":"trap280935",
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
              DAW.cleanQueues();
              gcs.cleanChoiceList(255);
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
          setTempo(70);
        }
      }
    ),

          hh.FORK(
              {
                "%location":{},
                "%tag":"fork"
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
                  value:'Ethereal'
                }
                serveur.broadcast(JSON.stringify(msg));
                }
              }
          ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {console.log('--- Ethereal');}
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
                {
                  "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                  "%tag":"seq"
                },


            hh.TRAP(
              {
                "trap27706":"trap27706",
                "%location":{},
                "%tag":"trap27706"
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
                    "EtherealOUT":"EtherealOUT",
                    "apply":function (){
                      return ((() => {
                        const EtherealOUT = this["EtherealOUT"];
                        return [true, 255];
                      })());
                    }
                  },
                  hh.SIGACCESS({
                    "signame":"EtherealOUT",
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
                      gcs.informSelecteurOnMenuChange(255," Ethereal", true);
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
        	              "countapply":function (){return 30;}
        	          },
        	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
        	        ),


        	        hh.EMIT(
        	          {
        	            "%location":{},
        	            "%tag":"emit",
        	            "EtherealOUT":"EtherealOUT",
        	            "apply":function (){
        	              return ((() => {
        	                const EtherealOUT = this["EtherealOUT"];
        	                return [false, 255];
        	              })());
        	            }
        	          },
        	          hh.SIGACCESS({
        	            "signame":"EtherealOUT",
        	            "pre":true,
        	            "val":true,
        	            "cnt":false
        	          })
        	        ), // Fin emit
        		    hh.ATOM(
        		      {
        		      "%location":{},
        		      "%tag":"node",
        		      "apply":function () { gcs.informSelecteurOnMenuChange(255," Ethereal", false); }
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
        		          "trap27706":"trap27706",
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
                  DAW.cleanQueue(19);
                }
              }
            ),

          hh.ATOM(
            {
              "%location":{},
              "%tag":"node",
              "apply":function () {
                DAW.putPatternInQueue('voix4');
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

        ),

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

        hh.FORK(
            {
              "%location":{},
              "%tag":"fork"
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
                value:'Tourne sur des patterns en dur'
              }
              serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {console.log('--- Tourne sur des patterns en dur');}
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
              {
                "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                "%tag":"seq"
              },


      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            setTempo(150);
          }
        }
      ),

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.putPatternInQueue('voix1');
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
          "countapply":function (){ return 32;}
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

        hh.ATOM(
          {
            "%location":{},
            "%tag":"node",
            "apply":function () {
              DAW.putPatternInQueue('voix2');
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
          "countapply":function (){ return 32;}
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
              DAW.putPatternInQueue('voix3');
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
          "countapply":function (){ return 32;}
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
              DAW.putPatternInQueue('voix4');
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
          "countapply":function (){ return 32;}
        },
        hh.SIGACCESS({
          "signame":"tick",
          "pre":false,
          "val":false,
          "cnt":false
        })
      ),

      ),

          hh.SEQUENCE(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                "%tag":"seq"
              },


      hh.RUN({
        "%location":{},
        "%tag":"run",
        "module": hh.getModule(  "PercuClic", {}),
        "tick":"",
        "percuOUT":"",

      }),

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
          setTempo(150);
        }
      }
    ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('voix5');
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
            "apply":function () {
              var msg = {
                type: 'alertInfoScoreON',
                value:'Tourne sur 2 groupes dispersés'
              }
              serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {console.log('--- Tourne sur 2 groupes dispersés');}
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
              {
                "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                "%tag":"seq"
              },


          hh.TRAP(
            {
              "trap700484":"trap700484",
              "%location":{},
              "%tag":"trap700484"
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
                  "groupeVoix4OUT":"groupeVoix4OUT",
                  "apply":function (){
                    return ((() => {
                      const groupeVoix4OUT = this["groupeVoix4OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"groupeVoix4OUT",
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
                    gcs.informSelecteurOnMenuChange(255," groupeVoix4", true);
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
      	            "groupeVoix4OUT":"groupeVoix4OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const groupeVoix4OUT = this["groupeVoix4OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"groupeVoix4OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupeVoix4", false); }
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
      		          "trap700484":"trap700484",
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
          "countapply":function (){ return 10;}
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
              "trap410553":"trap410553",
              "%location":{},
              "%tag":"trap410553"
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
                  "groupeVoix5OUT":"groupeVoix5OUT",
                  "apply":function (){
                    return ((() => {
                      const groupeVoix5OUT = this["groupeVoix5OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"groupeVoix5OUT",
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
                    gcs.informSelecteurOnMenuChange(255," groupeVoix5", true);
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
      	              "countapply":function (){return 25;}
      	          },
      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
      	        ),


      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "groupeVoix5OUT":"groupeVoix5OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const groupeVoix5OUT = this["groupeVoix5OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"groupeVoix5OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupeVoix5", false); }
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
      		          "trap410553":"trap410553",
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
          setTempo(150);
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
            "apply":function () {
              var msg = {
                type: 'alertInfoScoreON',
                value:'Tourner des groupes avec simulateur'
              }
              serveur.broadcast(JSON.stringify(msg));
              }
            }
        ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {console.log('--- Tourner des groupes avec simulateur');}
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
              {
                "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                "%tag":"seq"
              },


          hh.TRAP(
            {
              "trap414000":"trap414000",
              "%location":{},
              "%tag":"trap414000"
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
                  "groupeVoix0OUT":"groupeVoix0OUT",
                  "apply":function (){
                    return ((() => {
                      const groupeVoix0OUT = this["groupeVoix0OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"groupeVoix0OUT",
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
                    gcs.informSelecteurOnMenuChange(255," groupeVoix0", true);
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
      	              "countapply":function (){return 44;}
      	          },
      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
      	        ),


      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "groupeVoix0OUT":"groupeVoix0OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const groupeVoix0OUT = this["groupeVoix0OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"groupeVoix0OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupeVoix0", false); }
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
      		          "trap414000":"trap414000",
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
                DAW.cleanQueue(0);
              }
            }
          ),

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
          "countapply":function (){ return 32;}
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
              "trap836735":"trap836735",
              "%location":{},
              "%tag":"trap836735"
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
                  "groupeVoix1OUT":"groupeVoix1OUT",
                  "apply":function (){
                    return ((() => {
                      const groupeVoix1OUT = this["groupeVoix1OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"groupeVoix1OUT",
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
                    gcs.informSelecteurOnMenuChange(255," groupeVoix1", true);
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
      	              "countapply":function (){return 44;}
      	          },
      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
      	        ),


      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "groupeVoix1OUT":"groupeVoix1OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const groupeVoix1OUT = this["groupeVoix1OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"groupeVoix1OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupeVoix1", false); }
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
      		          "trap836735":"trap836735",
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
          "countapply":function (){ return 64;}
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
              "trap588727":"trap588727",
              "%location":{},
              "%tag":"trap588727"
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
                  "groupeVoix2OUT":"groupeVoix2OUT",
                  "apply":function (){
                    return ((() => {
                      const groupeVoix2OUT = this["groupeVoix2OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"groupeVoix2OUT",
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
                    gcs.informSelecteurOnMenuChange(255," groupeVoix2", true);
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
      	              "countapply":function (){return 44;}
      	          },
      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
      	        ),


      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "groupeVoix2OUT":"groupeVoix2OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const groupeVoix2OUT = this["groupeVoix2OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"groupeVoix2OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupeVoix2", false); }
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
      		          "trap588727":"trap588727",
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
                DAW.cleanQueue(2);
              }
            }
          ),

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
          "countapply":function (){ return 96;}
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
              "trap75438":"trap75438",
              "%location":{},
              "%tag":"trap75438"
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
                  "groupeVoix3OUT":"groupeVoix3OUT",
                  "apply":function (){
                    return ((() => {
                      const groupeVoix3OUT = this["groupeVoix3OUT"];
                      return [true, 255];
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"groupeVoix3OUT",
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
                    gcs.informSelecteurOnMenuChange(255," groupeVoix3", true);
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
      	              "countapply":function (){return 44;}
      	          },
      	          hh.SIGACCESS({"signame":"tick","pre":false,"val":false,"cnt":false})
      	        ),


      	        hh.EMIT(
      	          {
      	            "%location":{},
      	            "%tag":"emit",
      	            "groupeVoix3OUT":"groupeVoix3OUT",
      	            "apply":function (){
      	              return ((() => {
      	                const groupeVoix3OUT = this["groupeVoix3OUT"];
      	                return [false, 255];
      	              })());
      	            }
      	          },
      	          hh.SIGACCESS({
      	            "signame":"groupeVoix3OUT",
      	            "pre":true,
      	            "val":true,
      	            "cnt":false
      	          })
      	        ), // Fin emit
      		    hh.ATOM(
      		      {
      		      "%location":{},
      		      "%tag":"node",
      		      "apply":function () { gcs.informSelecteurOnMenuChange(255," groupeVoix3", false); }
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
      		          "trap75438":"trap75438",
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
                DAW.cleanQueue(3);
              }
            }
          ),

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
          setTempo(70);
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
              value:'Décalages'
            }
            serveur.broadcast(JSON.stringify(msg));
            }
          }
      ),

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {console.log('--- Décalages');}
      }
    ),

      hh.ATOM(
        {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          // exe_javascript
          decalage =  1;
    console.log("decalage:", decalage);;
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


              hh.SEQUENCE(
                  {
                    "%location":{"filename":"hiphop_blocks.js","pos":1, "block":"hh_sequence"},
                    "%tag":"seq"
                  },


          hh.RUN({
            "%location":{},
            "%tag":"run",
            "module": hh.getModule(  "joueMotif", {}),
            "tick":"",
            "motif1_1":"",
            "motif1_2":"",
            "motif1_3":"",
            "motif1_4":"",
            "motif1_5":"",
            "motif1_6":"",
            "motif1_7":"",
            "motif1_8":"",

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
              "countapply":function (){ return 8;}
            },
            hh.SIGACCESS({
              "signame":"tick",
              "pre":false,
              "val":false,
              "cnt":false
            })
          ),

          hh.LOOP(
              {
                "%location":{loop: 1},
                "%tag":"loop"
              },

            hh.RUN({
              "%location":{},
              "%tag":"run",
              "module": hh.getModule(  "decaleMotif", {}),
              "tick":"",
              "motif1_1":"",
              "motif1_2":"",
              "motif1_3":"",
              "motif1_4":"",
              "motif1_5":"",
              "motif1_6":"",
              "motif1_7":"",
              "motif1_8":"",

            }),

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
                  // exe_javascript
                  decalage += 1;
            console.log("decalage:", decalage);;
                  }
                }
              ),

            ),

          ),

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
                  "%location":{},
                  "%tag":"await",
                  "immediate":true,
                  "apply":function () {
                    return ((() => {
                      const motif1_1=this["motif1_1"];
                      return motif1_1.now;
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"motif1_1",
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
                    DAW.putPatternInQueue('Motif1-1');
                  }
                }
              ),

            hh.PAUSE(
              {
                "%location":{},
                "%tag":"yield"
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
                  "%location":{},
                  "%tag":"await",
                  "immediate":true,
                  "apply":function () {
                    return ((() => {
                      const motif1_2=this["motif1_2"];
                      return motif1_2.now;
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"motif1_2",
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
                    DAW.putPatternInQueue('Motif1-2');
                  }
                }
              ),

            hh.PAUSE(
              {
                "%location":{},
                "%tag":"yield"
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
                  "%location":{},
                  "%tag":"await",
                  "immediate":true,
                  "apply":function () {
                    return ((() => {
                      const motif1_3=this["motif1_3"];
                      return motif1_3.now;
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"motif1_3",
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
                    DAW.putPatternInQueue('Motif1-3');
                  }
                }
              ),

            hh.PAUSE(
              {
                "%location":{},
                "%tag":"yield"
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
                  "%location":{},
                  "%tag":"await",
                  "immediate":true,
                  "apply":function () {
                    return ((() => {
                      const motif1_4=this["motif1_4"];
                      return motif1_4.now;
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"motif1_4",
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
                    DAW.putPatternInQueue('Motif1-4');
                  }
                }
              ),

            hh.PAUSE(
              {
                "%location":{},
                "%tag":"yield"
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
                  "%location":{},
                  "%tag":"await",
                  "immediate":true,
                  "apply":function () {
                    return ((() => {
                      const motif1_5=this["motif1_5"];
                      return motif1_5.now;
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"motif1_5",
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
                    DAW.putPatternInQueue('Motif1-5');
                  }
                }
              ),

            hh.PAUSE(
              {
                "%location":{},
                "%tag":"yield"
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
                  "%location":{},
                  "%tag":"await",
                  "immediate":true,
                  "apply":function () {
                    return ((() => {
                      const motif1_6=this["motif1_6"];
                      return motif1_6.now;
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"motif1_6",
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
                    DAW.putPatternInQueue('Motif1-6');
                  }
                }
              ),

            hh.PAUSE(
              {
                "%location":{},
                "%tag":"yield"
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
                  "%location":{},
                  "%tag":"await",
                  "immediate":true,
                  "apply":function () {
                    return ((() => {
                      const motif1_7=this["motif1_7"];
                      return motif1_7.now;
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"motif1_7",
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
                    DAW.putPatternInQueue('Motif1-7');
                  }
                }
              ),

            hh.PAUSE(
              {
                "%location":{},
                "%tag":"yield"
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
                  "%location":{},
                  "%tag":"await",
                  "immediate":true,
                  "apply":function () {
                    return ((() => {
                      const motif1_8=this["motif1_8"];
                      return motif1_8.now;
                    })());
                  }
                },
                hh.SIGACCESS({
                  "signame":"motif1_8",
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
                    DAW.putPatternInQueue('Motif1-8');
                  }
                }
              ),

            hh.PAUSE(
              {
                "%location":{},
                "%tag":"yield"
              }
            ),

            ),

          ),

        ),

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
          var msg = {
            type: 'alertInfoScoreON',
            value:'FIN'
          }
          serveur.broadcast(JSON.stringify(msg));
          }
        }
    ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {console.log('FIN');}
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
