/*"use hiphop"
"use hopscript"

const hh = require( "hiphop" );

hiphop module prg( in I, out O ) {
   loop {
      await count( 3, I.now );
      emit O();
   }
}

exports.prg = new hh.ReactiveMachine( prg, "await3" );
*/

"use strict";
var __hh_module;

const hh=require("hiphop");

let prg;__hh_module=require("hiphop");

prg=__hh_module.MODULE(
	{"id":"prg","%location":{"filename":"await-count.hh.js","pos":70},"%tag":"module"},

	__hh_module.SIGNAL({"%location":{"filename":"await-count.hh.js","pos":82},
		"direction":"IN",
		"name":"I"}
		),
	__hh_module.SIGNAL(
		{"%location":{"filename":"await-count.hh.js","pos":88},
		"direction":"OUT"
		"name":"O"}),
	__hh_module.LOOP(
		{"%location":{"filename":"await-count.hh.js","pos":101}}
		,__hh_module.AWAIT({"%location":{"filename":"await-count.hh.js","pos":114},
			"%tag":"await",
			"immediate":false,
			"apply":function (){return ((() => {const I=this["I"];return I.now;})());
		}



		var __hh_module;const hh=require("hiphop");
		let prg;__hh_module=require("hiphop");
		prg=__hh_module.MODULE({"id":"prg","%location":{"filename":"await-count.hh.js","pos":70},"%tag":"module"},
			__hh_module.SIGNAL({"%location":{"filename":"await-count.hh.js","pos":82},"direction":"IN","name":"I"}),
			__hh_module.SIGNAL({"%location":{"filename":"await-count.hh.js","pos":88},"direction":"OUT","name":"O"}),
			__hh_module.LOOP({"%location":{"filename":"await-count.hh.js","pos":101}},
				__hh_module.AWAIT(
					{
						"%location":{"filename":"await-count.hh.js","pos":114},
						"%tag":"await",
						"immediate":false,
						"apply":function (){
							return ((() => {
								const I=this["I"];
								return I.now;
							})());},
						"countapply":function (){return 3;}
					},

				__hh_module.SIGACCESS({"signame":"I","pre":false,"val":false,"cnt":false})),
				__hh_module.EMIT({"%location":{"filename":"await-count.hh.js","pos":150},"%tag":"emit","O":"O"})));
		
exports.prg=new hh.ReactiveMachine(prg,"await3");

