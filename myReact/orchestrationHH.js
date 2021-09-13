var transposition, stopTrans, tick, HopeCornet, HopeSaxo, HopeWalkingBasse, HopePiano, HopeCongas, HopeBatterie;



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


  transposition = hh.MODULE({"id":"transposition","%location":{},"%tag":"module"},

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"stopTrans"
      }),

      hh.SIGNAL({
        "%location":{},
        "direction":"IN",
        "name":"tick"
      }),



    hh.ABORT(
      {
        "%location":{abort: stopTrans},
        "%tag":"abort",
        "immediate":false,
        "apply": function (){return ((() => {
            const stopTrans=this["stopTrans"];
            return stopTrans.now;
        })());},
        "countapply":function (){ return 1;}
      },
      hh.SIGACCESS({
        "signame":"stopTrans",
        "pre":false,
        "val":false,
        "cnt":false
      }),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            transposeValue = 0;
            oscMidiLocal.controlChange(par.busMidiDAW,0,61,64);
          }
        }
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
              transposeValue += 2;
              //console.log("hiphop block transpose: transposeValue:", transposeValue);
              oscMidiLocal.controlChange(par.busMidiDAW,1,61, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
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
              transposeValue += 0;
              //console.log("hiphop block transpose: transposeValue:", transposeValue);
              oscMidiLocal.controlChange(par.busMidiDAW,1,61, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
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
              transposeValue += -2;
              //console.log("hiphop block transpose: transposeValue:", transposeValue);
              oscMidiLocal.controlChange(par.busMidiDAW,1,61, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
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
              transposeValue += 0;
              //console.log("hiphop block transpose: transposeValue:", transposeValue);
              oscMidiLocal.controlChange(par.busMidiDAW,1,61, Math.round(ratioTranspose * transposeValue + offsetTranspose ));
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


    hh.SIGNAL({
      "%location":{},
      "direction":"INOUT",
      "name":"stopTrans"
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
        gcs.setTimerDivision(16);
      }
    }
  ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {
        ratioTranspose = 5.25;
        offsetTranspose = 64;
        console.log("hiphop block transpose Parameters:", ratioTranspose, offsetTranspose);
      }
    }
  ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            gcs.setComputeScorePolicy(1);
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
        setTempo(140);
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
            DAW.putPatternInQueue('Theme1Sax');
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('Theme1Cornet');
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('Theme2Sax');
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('Theme2Cornet');
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('Theme3Sax');
          }
        }
      ),

      hh.ATOM(
        {
          "%location":{},
          "%tag":"node",
          "apply":function () {
            DAW.putPatternInQueue('Theme3Cornet');
          }
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
      "countapply":function (){ return 2;}
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
                    "trap232016":"trap232016",
                    "%location":{},
                    "%tag":"trap232016"
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
                        "HopeWalkingBasseOUT":"HopeWalkingBasseOUT",
                        "apply":function (){
                          return ((() => {
                            const HopeWalkingBasseOUT = this["HopeWalkingBasseOUT"];
                            return [true, 255];
                          })());
                        }
                      },
                      hh.SIGACCESS({
                        "signame":"HopeWalkingBasseOUT",
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
                          gcs.informSelecteurOnMenuChange(255," HopeWalkingBasse", true);
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
            	            "HopeWalkingBasseOUT":"HopeWalkingBasseOUT",
            	            "apply":function (){
            	              return ((() => {
            	                const HopeWalkingBasseOUT = this["HopeWalkingBasseOUT"];
            	                return [false, 255];
            	              })());
            	            }
            	          },
            	          hh.SIGACCESS({
            	            "signame":"HopeWalkingBasseOUT",
            	            "pre":true,
            	            "val":true,
            	            "cnt":false
            	          })
            	        ), // Fin emit
            		    hh.ATOM(
            		      {
            		      "%location":{},
            		      "%tag":"node",
            		      "apply":function () { gcs.informSelecteurOnMenuChange(255," HopeWalkingBasse", false); }
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
            		          "trap232016":"trap232016",
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
                    "trap955871":"trap955871",
                    "%location":{},
                    "%tag":"trap955871"
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
                        "HopePianoOUT":"HopePianoOUT",
                        "apply":function (){
                          return ((() => {
                            const HopePianoOUT = this["HopePianoOUT"];
                            return [true, 255];
                          })());
                        }
                      },
                      hh.SIGACCESS({
                        "signame":"HopePianoOUT",
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
                          gcs.informSelecteurOnMenuChange(255," HopePiano", true);
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
            	            "HopePianoOUT":"HopePianoOUT",
            	            "apply":function (){
            	              return ((() => {
            	                const HopePianoOUT = this["HopePianoOUT"];
            	                return [false, 255];
            	              })());
            	            }
            	          },
            	          hh.SIGACCESS({
            	            "signame":"HopePianoOUT",
            	            "pre":true,
            	            "val":true,
            	            "cnt":false
            	          })
            	        ), // Fin emit
            		    hh.ATOM(
            		      {
            		      "%location":{},
            		      "%tag":"node",
            		      "apply":function () { gcs.informSelecteurOnMenuChange(255," HopePiano", false); }
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
            		          "trap955871":"trap955871",
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


                  hh.TRAP(
                    {
                      "trap335056":"trap335056",
                      "%location":{},
                      "%tag":"trap335056"
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
                            "HopeSaxoOUT":"HopeSaxoOUT",
                            "apply":function (){
                              return ((() => {
                                const HopeSaxoOUT = this["HopeSaxoOUT"];
                                return [true, 255];
                              })());
                            }
                          },
                          hh.SIGACCESS({
                            "signame":"HopeSaxoOUT",
                            "pre":true,
                            "val":true,
                            "cnt":false
                          })
                        ), // Fin emit
                      hh.ATOM(
                        {
                        "%location":{},
                        "%tag":"node",
                        "apply":function () { gcs.informSelecteurOnMenuChange(255," HopeSaxo", true); }
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
                            "HopeSaxoOUT":"HopeSaxoOUT",
                            "apply":function (){
                              return ((() => {
                                const HopeSaxoOUT = this["HopeSaxoOUT"];
                                return [false, 255];
                              })());
                            }
                          },
                          hh.SIGACCESS({
                            "signame":"HopeSaxoOUT",
                            "pre":true,
                            "val":true,
                            "cnt":false
                          })
                        ), // Fin emit
                      hh.ATOM(
                        {
                        "%location":{},
                        "%tag":"node",
                        "apply":function () { gcs.informSelecteurOnMenuChange(255," HopeSaxo", false); }
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
                            "trap335056":"trap335056",
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
                  "apply":function () {console.log('Fin solo 1');}
                }
              ),

                  hh.TRAP(
                    {
                      "trap721465":"trap721465",
                      "%location":{},
                      "%tag":"trap721465"
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
                            "HopeCornetOUT":"HopeCornetOUT",
                            "apply":function (){
                              return ((() => {
                                const HopeCornetOUT = this["HopeCornetOUT"];
                                return [true, 255];
                              })());
                            }
                          },
                          hh.SIGACCESS({
                            "signame":"HopeCornetOUT",
                            "pre":true,
                            "val":true,
                            "cnt":false
                          })
                        ), // Fin emit
                      hh.ATOM(
                        {
                        "%location":{},
                        "%tag":"node",
                        "apply":function () { gcs.informSelecteurOnMenuChange(255," HopeCornet", true); }
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
                            "HopeCornetOUT":"HopeCornetOUT",
                            "apply":function (){
                              return ((() => {
                                const HopeCornetOUT = this["HopeCornetOUT"];
                                return [false, 255];
                              })());
                            }
                          },
                          hh.SIGACCESS({
                            "signame":"HopeCornetOUT",
                            "pre":true,
                            "val":true,
                            "cnt":false
                          })
                        ), // Fin emit
                      hh.ATOM(
                        {
                        "%location":{},
                        "%tag":"node",
                        "apply":function () { gcs.informSelecteurOnMenuChange(255," HopeCornet", false); }
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
                            "trap721465":"trap721465",
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
                  "apply":function () {console.log('Fin solo 2');}
                }
              ),

              ),

            ),

          ),

            hh.TRAP(
              {
                "trap521504":"trap521504",
                "%location":{},
                "%tag":"trap521504"
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
                      "HopeCongasOUT":"HopeCongasOUT",
                      "apply":function (){
                        return ((() => {
                          const HopeCongasOUT = this["HopeCongasOUT"];
                          return [true, 255];
                        })());
                      }
                    },
                    hh.SIGACCESS({
                      "signame":"HopeCongasOUT",
                      "pre":true,
                      "val":true,
                      "cnt":false
                    })
                  ), // Fin emit
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255," HopeCongas", true); }
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
                      "HopeCongasOUT":"HopeCongasOUT",
                      "apply":function (){
                        return ((() => {
                          const HopeCongasOUT = this["HopeCongasOUT"];
                          return [false, 255];
                        })());
                      }
                    },
                    hh.SIGACCESS({
                      "signame":"HopeCongasOUT",
                      "pre":true,
                      "val":true,
                      "cnt":false
                    })
                  ), // Fin emit
                hh.ATOM(
                  {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () { gcs.informSelecteurOnMenuChange(255," HopeCongas", false); }
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
                      "trap521504":"trap521504",
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


      hh.RUN({
        "%location":{},
        "%tag":"run",
        "module": hh.getModule(  "transposition", {}),
        "tick":"",
        "stopTrans":"",

      }),

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
