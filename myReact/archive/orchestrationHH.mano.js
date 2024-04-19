"use strict";

var hh = require("../hiphop/hiphop.js");
var par = require('../serveur/skiniParametres');
var gcs = require("../serveur/autocontroleur/groupeClientsSons.js");

var debug = false;
var debug1 = true;

//var signals;

// Création des signaux OUT de contrôle de la matrice des possibles
// Ici et immédiatement.
var signals = [];

for (var i=0; i < par.groupesDesSons.length; i++) {
	var signame = par.groupesDesSons[i][0] + "OUT";

	var signal = hh.SIGNAL({
		"%location":{},
		"direction":"OUT",
		"name":signame,
		"init_func":function (){return [false, -1];}
	});
	signals.push(signal);
}

// Création des signaux IN de sélection de patterns
for (var i=0; i < par.groupesDesSons.length; i++) {
	var signame = par.groupesDesSons[i][0] + "IN";

	var signal = hh.SIGNAL({
		"%location":{},
		"direction":"IN",
		"name":signame
	});
	signals.push(signal);
}

function setSignals(){
	if(debug) console.log("orchestrationHH: setSignals: ", signals);
	var machine = new hh.ReactiveMachine( orchestration );
	return machine;
}
exports.setSignals = setSignals;

var trajet = hh.MODULE(
	{
		"id":"trajet",
		"%location":{},
		"%tag":"module"
	},

	hh.SIGNAL({"%location":{},"direction":"IN","name":"start"}),
	hh.SIGNAL({"%location":{},"direction":"IN","name":"stop"}),
	hh.SIGNAL({"%location":{},"direction":"IN","name":"tick"}),
	hh.SIGNAL({"%location":{},"direction":"IN","name":"DAWON"}),

	signals,

	hh.ATOM(
		{
		    "%location":{},
		    "%tag":"node",
		    "apply":function () {console.log('Debut trajet');}
	    }
	),
    
    hh.SEQUENCE(
    	{
            "%location":{},
            "%tag":"seq"
        },

        hh.ATOM(
		    {
		    "%location":{},
		    "%tag":"node",
		    "apply":function () {console.log('Sequence');}
		    }
		),

        // await start
		hh.AWAIT(
			{
				"%location":{},
				"%tag":"await",
				"immediate":false,
				"apply":function (){
					return ((() => {
						const start =this["start"];
						return start.now;
					})());},
				//"countapply":function (){return 3;}
			}
			,
			hh.SIGACCESS({"signame":"start","pre":false,"val":false,"cnt":false})
		),

		// affiche après start
        hh.ATOM(
		    {
		    "%location":{},
		    "%tag":"node",
		    "apply":function () {console.log('Après start 111');}
		    }
		),

		hh.EMIT(
	        {
	          "%location":{},
	          "%tag":"emit",
	          "djembeOUT":"djembeOUT",
	          "apply":function (){
	            return ((() => {
	              const djembeOUT = this["djembeOUT"];
	              return [true, 255];
	            })());
	          }
	        },
	        hh.SIGACCESS({
	          "signame":"djembeOUT",
	          "pre":true,
	          "val":true,
	          "cnt":false
	        })
	    ),

/*		hh.AWAIT(
			{
				"%location":{},
				"%tag":"await",
				"immediate":true,
				"apply":function (){
					return ((() => {
						const djembeOUT =this["djembeOUT"];
						return djembeOUT.now;
					})());},
				//"countapply":function (){return 3;}
			}
			,
			hh.SIGACCESS({"signame":"djembeOUT","pre":false,"val":false,"cnt":false})
		),*/

        hh.ATOM(
		    {
		    "%location":{},
		    "%tag":"node",
		    "apply":function () { gcs.informSelecteurOnMenuChange(255,"djembeOUT",true); }
		    }
		),

        hh.ATOM(
		    {
		    "%location":{},
		    "%tag":"node",
		    "apply":function () {console.log('Après emit'); }
		    }
		),

		hh.FORK(
			{
				"%location":{},
				"%tag":"fork"
			},
			hh.SEQUENCE(
				{
					"%location":{},
					"%tag":"fork"
				},
				hh.LOOPEACH(
					{
					    "%location":{},
					    "%tag":"do/every",
					    "immediate":false,
					    "apply": function (){return ((() => {
					          const tick = this["tick"];
					          return tick.now;
					    })());},
					    //"countapply":function (){ return 2;}
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
					    "apply":function () {console.log('Tick');}
					    }
					),
				),
			),
			hh.SEQUENCE(
				{
					"%location":{},
					"%tag":"fork"
				},

				hh.EVERY(
					{
					    "%location":{},
					    "%tag":"every",
					    "immediate":false,
					    "apply": function (){return ((() => {
					          const djembeIN = this["djembeIN"];
					          return djembeIN.now;
					    })());},
					    //"countapply":function (){ return 2;}
					},
					hh.SIGACCESS({
					    "signame":"djembeIN",
					    "pre":false,
					    "val":false,
					    "cnt":false
					}),
					hh.ATOM(
					    {
					    "%location":{},
					    "%tag":"node",
					    "apply":function () {console.log('********************  djembeIN');}
					    }
					),
				),
			)
		)
	)
);

var orchestration = hh.MODULE(
		{"id":"Orchestration","%location":{},"%tag":"module"},
		signals,

		hh.SIGNAL({"%location":{},"direction":"IN","name":"start"}),
		hh.SIGNAL({"%location":{},"direction":"IN","name":"stop"}),
		hh.SIGNAL({"%location":{},"direction":"IN","name":"tick"}),
		hh.SIGNAL({"%location":{},"direction":"IN","name":"DAWON"}),
		hh.SIGNAL({"%location":{},"direction":"OUT","name":"setTimerDivision"}),
		hh.SIGNAL({"%location":{},"direction":"OUT","name":"resetMatriceDesPossibles"}),
		hh.SIGNAL({"%location":{},"direction":"OUT","name":"cleanQueues"}),
		hh.SIGNAL({"%location":{},"direction":"OUT","name":"cleanOneQueue"}),
		hh.SIGNAL({"%location":{},"direction":"OUT","name":"pauseQueues"}),
		hh.SIGNAL({"%location":{},"direction":"OUT","name":"resumeQueues"}),
		hh.SIGNAL({"%location":{},"direction":"OUT","name":"pauseOneQueue"}),
		hh.SIGNAL({"%location":{},"direction":"OUT","name":"resumeOneQueue"}),
		hh.SIGNAL({"%location":{},"direction":"OUT","name":"patternListLength"}),
		hh.SIGNAL({"%location":{},"direction":"OUT","name":"cleanChoiceList"}),
		hh.SIGNAL({"%location":{},"direction":"OUT","name":"setComputeScoreClass"}),
		hh.SIGNAL({"%location":{},"direction":"OUT","name":"setComputeScorePolicy"}),	
		hh.SIGNAL({"%location":{},"direction":"IN","name":"patternSignal"}),
		hh.SIGNAL({"%location":{},"direction":"IN","name":"controlFromVideo"}),
		hh.SIGNAL({"%location":{},"direction":"IN","name":"pulsation"}),
		hh.SIGNAL({"%location":{},"direction":"IN","name":"midiSignal"}),		
		hh.SIGNAL({"%location":{},"direction":"IN","name":"emptyQueueSignal"}),	

	    hh.ATOM(
	      {
	        "%location":{},
	        "%tag":"node",
	        "apply":function () {console.log('Module Orchestration');}
	      }
	    ),

		hh.RUN({
			"%location":{},
			"%tag":"run",
			"module": hh.getModule("trajet", {}),
			"start":"",
			"stop":"",
			"tick":"",
			"DAWON":"",
			"djembeOUT":"djembeOUT", // Pour utiliser les eventListener depuis un sous module il faut faire ce lien.
			"djembeIN":"",
		})
	);
exports.orchestration = orchestration;

