"use strict"
"use hopscript"

/*var hh = require( "hiphop" );

function func() {
   console.log( "atom works!" );
}

hiphop module prg() {
   loop {
      yield;
      hop { func() };
   }
}

var m = new hh.ReactiveMachine( prg, "atom" );
*/

var hh;
var __hh_module;
var m;
let prg;

function func() {
   console.log( "atom works!" );
}

__hh_module= require("../hiphop/hiphop.js");

prg=__hh_module.MACHINE(
	{"id":"prg","%location":{"filename":"emit-if2.hh.js","pos":290},"%tag":"module"},

	__hh_module.LOOP({"%location":{"filename":"emit-if2.hh.js","pos":308}},
		__hh_module.PAUSE({"%location":{"filename":"emit-if2.hh.js","pos":321},"%tag":"yield"}),
		__hh_module.ATOM(
			{
				"%location":{"filename":"emit-if2.hh.js","pos":334},
				"%tag":"hop",
				"apply":function (){func();}
			}
		)
	)
);
module.exports=prg;
//m = new hh.ReactiveMachine(prg,"awaitvalued");

prg.debug_emitted_func=console.log;

prg.react();
prg.react();
