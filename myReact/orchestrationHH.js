var cleanZone1, sensor0, cleanZone2, sensor2, cleanZone3, cleanZone4, zone7, zone8, zone9, zone10, tick, zone1, zone2, zone3, zone4;



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


  cleanZone1 = hh.MODULE({"id":"cleanZone1","%location":{},"%tag":"module"},


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

  cleanZone2 = hh.MODULE({"id":"cleanZone2","%location":{},"%tag":"module"},


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

  cleanZone3 = hh.MODULE({"id":"cleanZone3","%location":{},"%tag":"module"},


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

  cleanZone4 = hh.MODULE({"id":"cleanZone4","%location":{},"%tag":"module"},


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
          "apply":function () {
             gcs.setpatternListLength([5,255]);
          }
        }
      ),

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

        hh.AWAIT(
          {
            "%location":{"filename":"hiphop_blocks.js","pos":189},
            "%tag":"await",
            "immediate":false,
            "apply":function (){
              return ((() => {
                const INTERFACEZ_RC11 = this["INTERFACEZ_RC11"];
                //console.log("*****", 11, 10,5000, INTERFACEZ_RC.nowval );
                if( INTERFACEZ_RC11.nowval !== undefined ) {
                  return INTERFACEZ_RC11.now && ( INTERFACEZ_RC11.nowval[0] === 11
                    && INTERFACEZ_RC11.nowval[1] >10
                    && INTERFACEZ_RC11.nowval[1] <5000);
                }
              })());
            },
            "countapply":function (){ return 1;}
          },
          hh.SIGACCESS(
            {"signame":"INTERFACEZ_RC11",
            "pre":false,
            "val":false,
            "cnt":false
          })
        ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   MiniWI !');}
    }
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

        hh.AWAIT(
          {
            "%location":{"filename":"hiphop_blocks.js","pos":189},
            "%tag":"await",
            "immediate":false,
            "apply":function (){
              return ((() => {
                const INTERFACEZ_RC7 = this["INTERFACEZ_RC7"];
                //console.log("*****", 7, 500,5000, INTERFACEZ_RC.nowval );
                if( INTERFACEZ_RC7.nowval !== undefined ) {
                  return INTERFACEZ_RC7.now && ( INTERFACEZ_RC7.nowval[0] === 7
                    && INTERFACEZ_RC7.nowval[1] >500
                    && INTERFACEZ_RC7.nowval[1] <5000);
                }
              })());
            },
            "countapply":function (){ return 1;}
          },
          hh.SIGACCESS(
            {"signame":"INTERFACEZ_RC7",
            "pre":false,
            "val":false,
            "cnt":false
          })
        ),

  hh.ATOM(
    {
      "%location":{},
      "%tag":"node",
      "apply":function () {console.log('****************************** bouton !');}
    }
  ),

  hh.LOOP(
      {
        "%location":{loop: 1},
        "%tag":"loop"
      },

    hh.ATOM(
      {
        "%location":{},
        "%tag":"node",
        "apply":function () {
          setTempo(80);
        }
      }
    ),


    hh.ABORT(
      {
        "%location":{"filename":"hiphop_blocks.js","pos":189},
        "%tag":"do/every",
        "immediate":false,
        "apply": function (){return ((() => {
            const INTERFACEZ_RC7 = this["INTERFACEZ_RC7"];
            if( INTERFACEZ_RC7.nowval !== undefined ) {
              return INTERFACEZ_RC7.now && ( INTERFACEZ_RC7.nowval[0] === 7
                && INTERFACEZ_RC7.nowval[1] >500
                && INTERFACEZ_RC7.nowval[1] <5000);
            }
        })());},
        "countapply":function (){ return 1;}
      },
      hh.SIGACCESS({
        "signame":"INTERFACEZ_RC7",
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
                "countapply":function (){ return  2;}
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
                    moveTempo(2, 10);
                  }
                }
              )
            )
          ),


                hh.FORK(
                    {
                      "%location":{},
                      "%tag":"fork"
                    },



            hh.EVERY(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":189},
                "%tag":"do/every",
                "immediate":false,
                "apply": function (){return ((() => {
                    const INTERFACEZ_RC0 = this["INTERFACEZ_RC0"];
                    if( INTERFACEZ_RC0.nowval !== undefined ) {
                      return INTERFACEZ_RC0.now && ( INTERFACEZ_RC0.nowval[0] === 0
                        && INTERFACEZ_RC0.nowval[1] >10
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

            ),
            // Capteur de distance


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
                        value:'Zone1'
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
                          "trap48456":"trap48456",
                          "%location":{},
                          "%tag":"trap48456"
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
                  		          "trap48456":"trap48456",
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
                  "module": hh.getModule(  "cleanZone1", {}),
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
                        value:'Zone2'
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
                          "trap574762":"trap574762",
                          "%location":{},
                          "%tag":"trap574762"
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
                  		          "trap574762":"trap574762",
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
                  "module": hh.getModule(  "cleanZone2", {}),
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
                        value:'Zone3'
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
                          "trap912022":"trap912022",
                          "%location":{},
                          "%tag":"trap912022"
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
                  		          "trap912022":"trap912022",
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
                  "module": hh.getModule(  "cleanZone3", {}),
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
                    const INTERFACEZ_RC4 = this["INTERFACEZ_RC4"];
                    if( INTERFACEZ_RC4.nowval !== undefined ) {
                      return INTERFACEZ_RC4.now && ( INTERFACEZ_RC4.nowval[0] === 4
                        && INTERFACEZ_RC4.nowval[1] >1000
                        && INTERFACEZ_RC4.nowval[1] <4000);
                    }
                })());},
                "countapply":function (){ return 1;}
              },
              hh.SIGACCESS({
                "signame":"INTERFACEZ_RC4",
                "pre":false,
                "val":false,
                "cnt":false
              }),

              hh.ATOM(
                {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {console.log('Sensor4');}
                }
              ),

                hh.ATOM(
                    {
                    "%location":{},
                    "%tag":"node",
                    "apply":function () {
                      var msg = {
                        type: 'alertInfoScoreON',
                        value:'Zone4'
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
                          "trap676811":"trap676811",
                          "%location":{},
                          "%tag":"trap676811"
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
                  		          "trap676811":"trap676811",
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
                  "module": hh.getModule(  "cleanZone4", {}),
                  "''":"",

                }),

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
              var msg = {
                type: 'alertInfoScoreON',
                value:'2eme séquence'
              }
              serveur.broadcast(JSON.stringify(msg));
              }
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
                "countapply":function (){ return  2;}
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
                    moveTempo(2, 10);
                  }
                }
              )
            )
          ),


                hh.FORK(
                    {
                      "%location":{},
                      "%tag":"fork"
                    },



            hh.EVERY(
              {
                "%location":{"filename":"hiphop_blocks.js","pos":189},
                "%tag":"do/every",
                "immediate":false,
                "apply": function (){return ((() => {
                    const INTERFACEZ_RC0 = this["INTERFACEZ_RC0"];
                    if( INTERFACEZ_RC0.nowval !== undefined ) {
                      return INTERFACEZ_RC0.now && ( INTERFACEZ_RC0.nowval[0] === 0
                        && INTERFACEZ_RC0.nowval[1] >10
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

            ),
            // Capteur de distance


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
                        value:'Zone1'
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
                          "trap181424":"trap181424",
                          "%location":{},
                          "%tag":"trap181424"
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
                  		          "trap181424":"trap181424",
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
                  "module": hh.getModule(  "cleanZone1", {}),
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
                        value:'Zone2'
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
                          "trap772949":"trap772949",
                          "%location":{},
                          "%tag":"trap772949"
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
                  		          "trap772949":"trap772949",
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
                  "module": hh.getModule(  "cleanZone2", {}),
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
                        value:'Zone3'
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
                          "trap985862":"trap985862",
                          "%location":{},
                          "%tag":"trap985862"
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
                  		          "trap985862":"trap985862",
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
                  "module": hh.getModule(  "cleanZone3", {}),
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
                    const INTERFACEZ_RC4 = this["INTERFACEZ_RC4"];
                    if( INTERFACEZ_RC4.nowval !== undefined ) {
                      return INTERFACEZ_RC4.now && ( INTERFACEZ_RC4.nowval[0] === 4
                        && INTERFACEZ_RC4.nowval[1] >1000
                        && INTERFACEZ_RC4.nowval[1] <4000);
                    }
                })());},
                "countapply":function (){ return 1;}
              },
              hh.SIGACCESS({
                "signame":"INTERFACEZ_RC4",
                "pre":false,
                "val":false,
                "cnt":false
              }),

              hh.ATOM(
                {
                  "%location":{},
                  "%tag":"node",
                  "apply":function () {console.log('Sensor4');}
                }
              ),

                hh.ATOM(
                    {
                    "%location":{},
                    "%tag":"node",
                    "apply":function () {
                      var msg = {
                        type: 'alertInfoScoreON',
                        value:'Zone4'
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
                          "trap637724":"trap637724",
                          "%location":{},
                          "%tag":"trap637724"
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
                  		          "trap637724":"trap637724",
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
                  "module": hh.getModule(  "cleanZone4", {}),
                  "''":"",

                }),

                ),

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
          setTempo(80);
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
            var msg = {
              type: 'alertInfoScoreON',
              value:'****** Fin de la pièce'
            }
            serveur.broadcast(JSON.stringify(msg));
            }
          }
      ),

    ),

        hh.AWAIT(
          {
            "%location":{"filename":"hiphop_blocks.js","pos":189},
            "%tag":"await",
            "immediate":false,
            "apply":function (){
              return ((() => {
                const INTERFACEZ_RC11 = this["INTERFACEZ_RC11"];
                //console.log("*****", 11, 10,5000, INTERFACEZ_RC.nowval );
                if( INTERFACEZ_RC11.nowval !== undefined ) {
                  return INTERFACEZ_RC11.now && ( INTERFACEZ_RC11.nowval[0] === 11
                    && INTERFACEZ_RC11.nowval[1] >10
                    && INTERFACEZ_RC11.nowval[1] <5000);
                }
              })());
            },
            "countapply":function (){ return 1;}
          },
          hh.SIGACCESS(
            {"signame":"INTERFACEZ_RC11",
            "pre":false,
            "val":false,
            "cnt":false
          })
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
